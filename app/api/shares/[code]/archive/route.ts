import { execFile } from 'child_process';
import { promises as fs } from 'fs';
import os from 'os';
import path from 'path';
import { promisify } from 'util';
import { NextResponse } from 'next/server';
import { findShareByCode, getShareFilePath } from '@/lib/storage';
import { verifyShareAccessToken } from '@/utils/share-access-token';

export const runtime = 'nodejs';

type RouteContext = {
  params: Promise<{ code: string }>;
};

const execFileAsync = promisify(execFile);

function parseIndexes(raw: string | null): number[] {
  if (!raw) return [];
  const unique = new Set<number>();
  for (const part of raw.split(',')) {
    const value = Number(part.trim());
    if (Number.isInteger(value) && value >= 0) {
      unique.add(value);
    }
  }
  return [...unique];
}

function encodeFileName(name: string): string {
  return encodeURIComponent(name).replace(/['()*]/g, (char) =>
    `%${char.charCodeAt(0).toString(16).toUpperCase()}`,
  );
}

export async function GET(request: Request, context: RouteContext) {
  const { code } = await context.params;
  const url = new URL(request.url);
  const token = url.searchParams.get('token') ?? '';
  const indexes = parseIndexes(url.searchParams.get('files'));

  if (!verifyShareAccessToken(token, code)) {
    return NextResponse.json({ message: 'Access denied.' }, { status: 401 });
  }
  if (indexes.length === 0) {
    return NextResponse.json({ message: 'No files selected.' }, { status: 400 });
  }

  const result = await findShareByCode(code);
  if (result.status === 'not_found') {
    return NextResponse.json({ message: 'Share not found.' }, { status: 404 });
  }
  if (result.status === 'expired') {
    return NextResponse.json({ message: 'Share has expired.' }, { status: 410 });
  }

  const selected = indexes
    .map((index) => {
      const fileMeta = result.meta.files[index];
      const filePath = getShareFilePath(result.meta, index);
      if (!fileMeta || !filePath) return null;
      return { fileMeta, filePath };
    })
    .filter((entry): entry is { fileMeta: (typeof result.meta.files)[number]; filePath: string } => Boolean(entry));

  if (selected.length === 0) {
    return NextResponse.json({ message: 'No valid files selected.' }, { status: 400 });
  }

  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'dropp-zip-'));
  const archivePath = path.join(tempDir, `dropp-${code}.zip`);

  try {
    const args = ['-j', '-q', archivePath, ...selected.map((entry) => entry.filePath)];
    await execFileAsync('/usr/bin/zip', args);
    const content = await fs.readFile(archivePath);

    return new NextResponse(new Uint8Array(content), {
      status: 200,
      headers: {
        'content-type': 'application/zip',
        'content-disposition': `attachment; filename*=UTF-8''${encodeFileName(
          `dropp-${code}.zip`,
        )}`,
        'cache-control': 'no-store',
      },
    });
  } catch {
    return NextResponse.json({ message: 'Archive creation failed.' }, { status: 500 });
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
}
