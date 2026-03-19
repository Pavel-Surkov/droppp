import { createHash, randomBytes } from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import {
  DEFAULT_STORAGE_TTL_HOURS,
  MAX_FILES_COUNT,
  MAX_FILE_SIZE_BYTES,
} from '@/constants/upload';
import {
  cleanupExpiredShares,
  ensureStorageDirs,
  FILES_ROOT,
  SHARES_ROOT,
  type ShareMeta,
  type StoredFileMeta,
} from '@/lib/storage';
import { consumeLimiter, getClientIp, uploadLimiter } from '@/lib/rate-limit';
import { parseStorageTtlHours } from '@/utils/upload';

export const runtime = 'nodejs';
const HOUR_IN_MS = 60 * 60 * 1000;

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_');
}

function createCode(length = 6): string {
  return randomBytes(length).toString('base64url').toLowerCase().slice(0, length);
}

async function createUniqueCode(): Promise<string> {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const code = createCode(5);
    const metaPath = path.join(SHARES_ROOT, `${code}.json`);
    try {
      await fs.access(metaPath);
    } catch {
      return code;
    }
  }
  throw new Error('Could not allocate unique short code');
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rateLimit = await consumeLimiter(uploadLimiter, `upload:${ip}`);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { message: 'Too many upload requests. Try again later.' },
      {
        status: 429,
        headers: {
          'retry-after': String(rateLimit.retryAfterSeconds),
        },
      },
    );
  }

  try {
    const formData = await request.formData();
    const pin = String(formData.get('pin') ?? '');
    const ttlRaw = formData.get('ttlHours');
    const ttlHours =
      ttlRaw === null
        ? DEFAULT_STORAGE_TTL_HOURS
        : parseStorageTtlHours(ttlRaw);

    if (!/^\d{4}$/.test(pin)) {
      return NextResponse.json(
        { message: 'PIN must contain exactly 4 digits.' },
        { status: 400 },
      );
    }

    if (ttlHours === null) {
      return NextResponse.json(
        { message: 'Invalid storage time value.' },
        { status: 400 },
      );
    }

    const files = formData
      .getAll('files')
      .filter((item): item is File => item instanceof File);

    if (files.length === 0) {
      return NextResponse.json({ message: 'No files to upload.' }, { status: 400 });
    }

    if (files.length > MAX_FILES_COUNT) {
      return NextResponse.json(
        { message: `Too many files. Maximum is ${MAX_FILES_COUNT}.` },
        { status: 400 },
      );
    }

    const oversized = files.find((file) => file.size > MAX_FILE_SIZE_BYTES);
    if (oversized) {
      return NextResponse.json(
        {
          message: `File "${oversized.name}" exceeds ${Math.floor(
            MAX_FILE_SIZE_BYTES / (1024 * 1024),
          )} MB.`,
        },
        { status: 400 },
      );
    }

    await ensureStorageDirs();
    await cleanupExpiredShares();

    const id = randomBytes(12).toString('hex');
    const code = await createUniqueCode();
    const uploadDir = path.join(FILES_ROOT, id);
    await fs.mkdir(uploadDir, { recursive: true });

    const storedFiles: StoredFileMeta[] = [];

    for (const [index, file] of files.entries()) {
      const storedName = `${index}-${Date.now()}-${sanitizeFileName(file.name)}`;
      const targetPath = path.join(uploadDir, storedName);
      const arrayBuffer = await file.arrayBuffer();
      await fs.writeFile(targetPath, Buffer.from(arrayBuffer));

      storedFiles.push({
        originalName: file.name,
        storedName,
        mimeType: file.type || 'application/octet-stream',
        size: file.size,
      });
    }

    const createdAt = new Date();
    const expiresAt = new Date(createdAt.getTime() + ttlHours * HOUR_IN_MS);
    const pinHash = createHash('sha256').update(pin).digest('hex');

    const metadata: ShareMeta = {
      id,
      code,
      createdAt: createdAt.toISOString(),
      expiresAt: expiresAt.toISOString(),
      pinHash,
      files: storedFiles,
    };

    await fs.writeFile(
      path.join(SHARES_ROOT, `${code}.json`),
      JSON.stringify(metadata, null, 2),
      'utf8',
    );

    return NextResponse.json({
      code,
      shortLink: `/s/${code}`,
      expiresAt: metadata.expiresAt,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unexpected upload failure';
    return NextResponse.json({ message }, { status: 500 });
  }
}
