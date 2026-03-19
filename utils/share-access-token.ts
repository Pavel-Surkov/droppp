import { createHmac, timingSafeEqual } from 'crypto';
import { SHARE_ACCESS_TOKEN_TTL_SECONDS } from '@/constants/share';

type AccessTokenPayload = {
  code: string;
  exp: number;
};

function getSecret(): string {
  const secret = process.env.SHARE_ACCESS_TOKEN_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      'SHARE_ACCESS_TOKEN_SECRET must be set and at least 32 characters long.',
    );
  }
  return secret;
}

function sign(input: string): string {
  return createHmac('sha256', getSecret()).update(input).digest('base64url');
}

function encodePayload(payload: AccessTokenPayload): string {
  return Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
}

function decodePayload(encoded: string): AccessTokenPayload | null {
  try {
    const parsed = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as
      | Partial<AccessTokenPayload>
      | null;
    if (!parsed) return null;
    if (typeof parsed.code !== 'string') return null;
    if (typeof parsed.exp !== 'number') return null;
    return { code: parsed.code, exp: parsed.exp };
  } catch {
    return null;
  }
}

export function createShareAccessToken(code: string): string {
  const exp = Math.floor(Date.now() / 1000) + SHARE_ACCESS_TOKEN_TTL_SECONDS;
  const payload = encodePayload({ code, exp });
  const signature = sign(payload);
  return `${payload}.${signature}`;
}

export function verifyShareAccessToken(token: string, code: string): boolean {
  const [payloadPart, signaturePart] = token.split('.');
  if (!payloadPart || !signaturePart) return false;

  const expected = sign(payloadPart);
  const actualBuffer = Buffer.from(signaturePart, 'utf8');
  const expectedBuffer = Buffer.from(expected, 'utf8');
  if (actualBuffer.length !== expectedBuffer.length) return false;
  if (!timingSafeEqual(actualBuffer, expectedBuffer)) return false;

  const payload = decodePayload(payloadPart);
  if (!payload) return false;
  if (payload.code !== code) return false;

  const now = Math.floor(Date.now() / 1000);
  return payload.exp > now;
}
