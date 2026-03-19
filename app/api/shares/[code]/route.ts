import { createHash } from 'crypto';
import { NextResponse } from 'next/server';
import { createShareAccessToken } from '@/utils/share-access-token';
import { findShareByCode } from '@/lib/storage';
import {
  clearPinFailures,
  consumeLimiter,
  getPinLockInfo,
  getClientIp,
  getPinAttemptKey,
  pinVerifyLimiter,
  registerPinFailure,
  shareMetaLimiter,
} from '@/lib/rate-limit';

export const runtime = 'nodejs';

type RouteContext = {
  params: Promise<{ code: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  const ip = getClientIp(request);
  const rateLimit = await consumeLimiter(shareMetaLimiter, `share-meta:${ip}`);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { message: 'Too many requests. Try again later.' },
      {
        status: 429,
        headers: {
          'retry-after': String(rateLimit.retryAfterSeconds),
        },
      },
    );
  }

  const { code } = await context.params;
  const result = await findShareByCode(code);

  if (result.status === 'not_found') {
    return NextResponse.json({ message: 'Share not found.' }, { status: 404 });
  }
  if (result.status === 'expired') {
    return NextResponse.json({ message: 'Share has expired.' }, { status: 410 });
  }

  return NextResponse.json({
    code: result.meta.code,
    createdAt: result.meta.createdAt,
    expiresAt: result.meta.expiresAt,
    filesCount: result.meta.files.length,
  });
}

export async function POST(request: Request, context: RouteContext) {
  const ip = getClientIp(request);
  const rateLimit = await consumeLimiter(pinVerifyLimiter, `pin-verify:${ip}`);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { message: 'Too many PIN attempts. Try again later.' },
      {
        status: 429,
        headers: {
          'retry-after': String(rateLimit.retryAfterSeconds),
        },
      },
    );
  }

  const { code } = await context.params;

  const pinAttemptKey = getPinAttemptKey(code, ip);
  const lockInfo = await getPinLockInfo(pinAttemptKey);
  if (lockInfo.locked) {
    return NextResponse.json(
      { message: 'Too many invalid PIN attempts. Try again later.' },
      {
        status: 429,
        headers: {
          'retry-after': String(lockInfo.retryAfterSeconds),
        },
      },
    );
  }

  const result = await findShareByCode(code);

  if (result.status === 'not_found') {
    return NextResponse.json({ message: 'Share not found.' }, { status: 404 });
  }
  if (result.status === 'expired') {
    return NextResponse.json({ message: 'Share has expired.' }, { status: 410 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: 'Invalid request body.' }, { status: 400 });
  }

  const pin = typeof payload === 'object' && payload ? (payload as { pin?: unknown }).pin : '';
  const pinValue = typeof pin === 'string' ? pin : '';
  if (!/^\d{4}$/.test(pinValue)) {
    return NextResponse.json(
      { message: 'PIN must contain exactly 4 digits.' },
      { status: 400 },
    );
  }

  const pinHash = createHash('sha256').update(pinValue).digest('hex');
  if (pinHash !== result.meta.pinHash) {
    const retryAfterSeconds = await registerPinFailure(pinAttemptKey);
    if (retryAfterSeconds > 0) {
      return NextResponse.json(
        { message: 'Too many invalid PIN attempts. Try again later.' },
        {
          status: 429,
          headers: {
            'retry-after': String(retryAfterSeconds),
          },
        },
      );
    }
    return NextResponse.json({ message: 'Invalid PIN.' }, { status: 401 });
  }
  await clearPinFailures(pinAttemptKey);

  return NextResponse.json({
    token: createShareAccessToken(result.meta.code),
    files: result.meta.files.map((file, index) => ({
      index,
      name: file.originalName,
      mimeType: file.mimeType,
      size: file.size,
    })),
  });
}
