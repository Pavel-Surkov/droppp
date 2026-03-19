import { promises as fs } from 'fs';
import path from 'path';

export type StoredFileMeta = {
  originalName: string;
  storedName: string;
  mimeType: string;
  size: number;
};

export type ShareMeta = {
  id: string;
  code: string;
  createdAt: string;
  expiresAt: string;
  pinHash: string;
  files: StoredFileMeta[];
};

export type ShareLookupResult =
  | { status: 'active'; meta: ShareMeta }
  | { status: 'expired' }
  | { status: 'not_found' };

function resolveStorageRoot(): string {
  const fromEnv = process.env.STORAGE_ROOT_DIR?.trim();
  if (fromEnv) return fromEnv;

  if (process.env.VERCEL) {
    // /var/task is read-only on Vercel serverless runtime; use writable /tmp.
    return path.join('/tmp', 'dropp-storage');
  }

  return path.join(process.cwd(), 'storage');
}

export const STORAGE_ROOT = resolveStorageRoot();
export const FILES_ROOT = path.join(STORAGE_ROOT, 'uploads');
export const SHARES_ROOT = path.join(STORAGE_ROOT, 'shares');

export async function ensureStorageDirs() {
  await fs.mkdir(FILES_ROOT, { recursive: true });
  await fs.mkdir(SHARES_ROOT, { recursive: true });
}

function isExpired(isoDate: string, now: Date): boolean {
  const expiresAtMs = new Date(isoDate).getTime();
  if (Number.isNaN(expiresAtMs)) return true;
  return expiresAtMs <= now.getTime();
}

export async function cleanupExpiredShares(now = new Date()) {
  await ensureStorageDirs();

  const files = await fs.readdir(SHARES_ROOT);
  let removed = 0;
  let failed = 0;

  for (const fileName of files) {
    if (!fileName.endsWith('.json')) continue;

    const metaPath = path.join(SHARES_ROOT, fileName);
    try {
      const raw = await fs.readFile(metaPath, 'utf8');
      const meta = JSON.parse(raw) as Partial<ShareMeta>;

      if (!meta.expiresAt || !isExpired(meta.expiresAt, now)) continue;

      if (typeof meta.id === 'string' && meta.id.length > 0) {
        await fs.rm(path.join(FILES_ROOT, meta.id), { recursive: true, force: true });
      }
      await fs.rm(metaPath, { force: true });
      removed += 1;
    } catch {
      failed += 1;
    }
  }

  return { removed, failed };
}

function isShareMeta(value: unknown): value is ShareMeta {
  if (!value || typeof value !== 'object') return false;

  const candidate = value as Partial<ShareMeta>;
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.code === 'string' &&
    typeof candidate.createdAt === 'string' &&
    typeof candidate.expiresAt === 'string' &&
    typeof candidate.pinHash === 'string' &&
    Array.isArray(candidate.files)
  );
}

export function isValidShareCode(code: string): boolean {
  return /^[a-z0-9]{5}$/.test(code);
}

function getShareMetaPath(code: string): string {
  return path.join(SHARES_ROOT, `${code}.json`);
}

async function removeShare(meta: ShareMeta): Promise<void> {
  const uploadDir = path.join(FILES_ROOT, meta.id);
  await fs.rm(uploadDir, { recursive: true, force: true });
  await fs.rm(getShareMetaPath(meta.code), { force: true });
}

export async function findShareByCode(
  code: string,
  now = new Date(),
): Promise<ShareLookupResult> {
  if (!isValidShareCode(code)) {
    return { status: 'not_found' };
  }

  await ensureStorageDirs();
  const metaPath = getShareMetaPath(code);

  let raw: string;
  try {
    raw = await fs.readFile(metaPath, 'utf8');
  } catch {
    return { status: 'not_found' };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    await fs.rm(metaPath, { force: true });
    return { status: 'not_found' };
  }

  if (!isShareMeta(parsed)) {
    await fs.rm(metaPath, { force: true });
    return { status: 'not_found' };
  }

  if (isExpired(parsed.expiresAt, now)) {
    await removeShare(parsed);
    return { status: 'expired' };
  }

  return { status: 'active', meta: parsed };
}

export function getShareFilePath(meta: ShareMeta, fileIndex: number): string | null {
  const file = meta.files[fileIndex];
  if (!file) return null;

  const baseDir = path.join(FILES_ROOT, meta.id);
  const targetPath = path.join(baseDir, file.storedName);
  if (!targetPath.startsWith(`${baseDir}${path.sep}`)) {
    return null;
  }

  return targetPath;
}
