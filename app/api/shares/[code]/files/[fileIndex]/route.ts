import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { findShareByCode, getShareFilePath } from '@/lib/storage';
import {
  consumeLimiter,
  downloadLimiter,
  getClientIp,
} from '@/lib/rate-limit';
import { verifyShareAccessToken } from '@/utils/share-access-token';

export const runtime = 'nodejs';

type RouteContext = {
  params: Promise<{ code: string; fileIndex: string }>;
};

function encodeFileName(name: string): string {
  return encodeURIComponent(name).replace(/['()*]/g, (char) =>
    `%${char.charCodeAt(0).toString(16).toUpperCase()}`,
  );
}

export async function GET(request: Request, context: RouteContext) {
  const ip = getClientIp(request);
  const rateLimit = await consumeLimiter(downloadLimiter, `download:${ip}`);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { message: 'Too many download requests. Try again later.' },
      {
        status: 429,
        headers: {
          'retry-after': String(rateLimit.retryAfterSeconds),
        },
      },
    );
  }

  const { code, fileIndex } = await context.params;
  const token = new URL(request.url).searchParams.get('token') ?? '';

  if (!verifyShareAccessToken(token, code)) {
    return NextResponse.json({ message: 'Access denied.' }, { status: 401 });
  }

  const result = await findShareByCode(code);
  if (result.status === 'not_found') {
    return NextResponse.json({ message: 'Share not found.' }, { status: 404 });
  }
  if (result.status === 'expired') {
    return NextResponse.json({ message: 'Share has expired.' }, { status: 410 });
  }

  const index = Number(fileIndex);
  if (!Number.isInteger(index) || index < 0) {
    return NextResponse.json({ message: 'Invalid file index.' }, { status: 400 });
  }

  const fileMeta = result.meta.files[index];
  const filePath = getShareFilePath(result.meta, index);
  if (!fileMeta || !filePath) {
    return NextResponse.json({ message: 'File not found.' }, { status: 404 });
  }

  const relative = path.relative(path.join(process.cwd(), 'storage'), filePath);
  if (relative.startsWith('..')) {
    return NextResponse.json({ message: 'Invalid file path.' }, { status: 400 });
  }

  let content: Buffer;
  try {
    content = await fs.readFile(filePath);
  } catch {
    return NextResponse.json({ message: 'File not found.' }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(content), {
    status: 200,
    headers: {
      'content-type': fileMeta.mimeType || 'application/octet-stream',
      'content-length': String(fileMeta.size),
      'content-disposition': `attachment; filename*=UTF-8''${encodeFileName(
        fileMeta.originalName,
      )}`,
      'cache-control': 'no-store',
    },
  });
}
