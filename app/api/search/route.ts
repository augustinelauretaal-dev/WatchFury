import { NextRequest, NextResponse } from 'next/server';
import { multiSearch } from '@/lib/tmdb';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q') ?? '';

  if (!q.trim()) {
    return NextResponse.json([]);
  }

  try {
    const results = await multiSearch(q);
    return NextResponse.json(results);
  } catch (err) {
    console.error('Search API error:', err);
    return NextResponse.json([], { status: 500 });
  }
}
