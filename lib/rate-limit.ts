import { RateLimiterMemory, type RateLimiterRes } from 'rate-limiter-flexible';
import { PIN_PROTECTION, RATE_LIMITS } from '@/constants/security';

function asRetryAfterSeconds(value: unknown): number {
  const ms =
    typeof value === 'object' &&
    value !== null &&
    'msBeforeNext' in value &&
    typeof (value as { msBeforeNext?: unknown }).msBeforeNext === 'number'
      ? (value as { msBeforeNext: number }).msBeforeNext
      : 1000;

  return Math.max(1, Math.ceil(ms / 1000));
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp;

  const cfIp = request.headers.get('cf-connecting-ip');
  if (cfIp) return cfIp;

  return 'unknown';
}

export const uploadLimiter = new RateLimiterMemory({
  points: RATE_LIMITS.upload.max,
  duration: Math.ceil(RATE_LIMITS.upload.windowMs / 1000),
});

export const shareMetaLimiter = new RateLimiterMemory({
  points: RATE_LIMITS.shareMeta.max,
  duration: Math.ceil(RATE_LIMITS.shareMeta.windowMs / 1000),
});

export const pinVerifyLimiter = new RateLimiterMemory({
  points: RATE_LIMITS.pinVerify.max,
  duration: Math.ceil(RATE_LIMITS.pinVerify.windowMs / 1000),
});

export const downloadLimiter = new RateLimiterMemory({
  points: RATE_LIMITS.download.max,
  duration: Math.ceil(RATE_LIMITS.download.windowMs / 1000),
});

export const archiveLimiter = new RateLimiterMemory({
  points: RATE_LIMITS.archive.max,
  duration: Math.ceil(RATE_LIMITS.archive.windowMs / 1000),
});

const pinFailureLimiter = new RateLimiterMemory({
  points: PIN_PROTECTION.maxFailedAttempts,
  duration: Math.ceil(PIN_PROTECTION.attemptWindowMs / 1000),
  blockDuration: Math.ceil(PIN_PROTECTION.lockMs / 1000),
});

export async function consumeLimiter(
  limiter: RateLimiterMemory,
  key: string,
): Promise<{ allowed: true } | { allowed: false; retryAfterSeconds: number }> {
  try {
    await limiter.consume(key);
    return { allowed: true };
  } catch (error) {
    return { allowed: false, retryAfterSeconds: asRetryAfterSeconds(error) };
  }
}

export function getPinAttemptKey(code: string, ip: string): string {
  return `${code}:${ip}`;
}

export async function getPinLockInfo(
  key: string,
): Promise<{ locked: boolean; retryAfterSeconds: number }> {
  const state = (await pinFailureLimiter.get(key)) as RateLimiterRes | null;
  if (!state) {
    return { locked: false, retryAfterSeconds: 0 };
  }

  const isBlocked =
    state.msBeforeNext > 0 &&
    state.consumedPoints > PIN_PROTECTION.maxFailedAttempts;

  if (!isBlocked) {
    return { locked: false, retryAfterSeconds: 0 };
  }

  return {
    locked: true,
    retryAfterSeconds: Math.max(1, Math.ceil(state.msBeforeNext / 1000)),
  };
}

export async function registerPinFailure(key: string): Promise<number> {
  try {
    await pinFailureLimiter.consume(key);
    return 0;
  } catch (error) {
    return asRetryAfterSeconds(error);
  }
}

export async function clearPinFailures(key: string): Promise<void> {
  await pinFailureLimiter.delete(key);
}
