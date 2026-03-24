import { promises as fs } from 'fs';
import { NextResponse } from 'next/server';
import JSZip from 'jszip';
import { archiveLimiter, consumeLimiter, getClientIp } from '@/lib/rate-limit';
import { findShareByCode, getShareFilePath } from '@/lib/storage';
import { getBearerTokenFromRequest } from '@/utils/request-auth';
import { verifyShareAccessToken } from '@/utils/share-access-token';

export const runtime = 'nodejs';

type RouteContext = {
  params: Promise<{ code: string }>;
};

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

function toUniqueArchiveEntryName(
  originalName: string,
  usageByName: Map<string, number>,
): string {
  const currentUsage = usageByName.get(originalName) ?? 0;
  usageByName.set(originalName, currentUsage + 1);
  if (currentUsage === 0) {
    return originalName;
  }

  const lastDot = originalName.lastIndexOf('.');
  const hasExt = lastDot > 0 && lastDot < originalName.length - 1;
  if (!hasExt) {
    return `${originalName} (${currentUsage})`;
  }

  const base = originalName.slice(0, lastDot);
  const ext = originalName.slice(lastDot);
  return `${base} (${currentUsage})${ext}`;
}

export async function GET(request: Request, context: RouteContext) {
  const ip = getClientIp(request);
  const rateLimit = await consumeLimiter(archiveLimiter, `archive:${ip}`);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { message: 'Too many archive requests. Try again later.' },
      {
        status: 429,
        headers: {
          'retry-after': String(rateLimit.retryAfterSeconds),
        },
      },
    );
  }

  const { code } = await context.params;
  const url = new URL(request.url);
  const token = getBearerTokenFromRequest(request);
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

  try {
    const zip = new JSZip();
    const usageByName = new Map<string, number>();

    for (const entry of selected) {
      const entryName = toUniqueArchiveEntryName(entry.fileMeta.originalName, usageByName);
      const fileContent = await fs.readFile(entry.filePath);
      zip.file(entryName, fileContent);
    }

    const content = await zip.generateAsync({
      type: 'uint8array',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 },
    });

    return new NextResponse(Buffer.from(content), {
      status: 200,
      headers: {
        'content-type': 'application/zip',
        'content-length': String(content.byteLength),
        'content-disposition': `attachment; filename*=UTF-8''${encodeFileName(
          `dropp-${code}.zip`,
        )}`,
        'cache-control': 'no-store',
      },
    });
  } catch {
    return NextResponse.json({ message: 'Archive creation failed.' }, { status: 500 });
  }
}
