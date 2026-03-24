import { NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';
import { cleanupExpiredShares } from '@/lib/storage';

export const runtime = 'nodejs';

// Maintenance endpoint for manual/scheduled cleanup runs (for example, cron).
// User upload flow also calls cleanup directly, but this route allows triggering
// cleanup even when there are no new uploads.
function getCleanupSecret(): string | null {
  const secret = process.env.CLEANUP_SECRET?.trim();
  if (!secret) return null;
  return secret;
}

function isAuthorized(request: Request): boolean {
  const expected = getCleanupSecret();
  const provided = request.headers.get('x-cleanup-secret')?.trim();

  if (!expected || !provided) {
    return false;
  }

  const expectedBuffer = Buffer.from(expected, 'utf8');
  const providedBuffer = Buffer.from(provided, 'utf8');
  if (expectedBuffer.length !== providedBuffer.length) {
    return false;
  }

  return timingSafeEqual(expectedBuffer, providedBuffer);
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
  }

  // Runs expiration cleanup for stored shares and upload directories.
  const result = await cleanupExpiredShares();
  return NextResponse.json({
    message: 'Cleanup completed.',
    removed: result.removed,
    failed: result.failed,
  });
}

export async function GET() {
  return NextResponse.json(
    { message: 'Method not allowed.' },
    {
      status: 405,
      headers: {
        allow: 'POST',
      },
    },
  );
}
