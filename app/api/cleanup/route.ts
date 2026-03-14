import { NextResponse } from 'next/server';
import { cleanupExpiredShares } from '@/lib/storage';

export const runtime = 'nodejs';

export async function POST() {
  const result = await cleanupExpiredShares();
  return NextResponse.json({
    message: 'Cleanup completed.',
    removed: result.removed,
    failed: result.failed,
  });
}

export async function GET() {
  return POST();
}
