import { NextRequest, NextResponse } from 'next/server';
import {
  getTVSources,
  getMovieSources,
  getProviderList,
  type MediaType,
} from '@/lib/streaming';

export const dynamic = 'force-dynamic';

// ---------------------------------------------------------------------------
// GET /api/stream
// ---------------------------------------------------------------------------
// Query params:
//   id    – TMDB ID (required)
//   type  – "tv" | "movie"  (default: "tv")
//   s     – season number   (default: 1, tv only)
//   ep    – episode number  (default: 1, tv only)
//
// Response:
//   {
//     tmdbId:   number,
//     type:     "tv" | "movie",
//     season?:  number,
//     episode?: number,
//     total:    number,
//     providers: { id, name, badge, hasSubs }[],
//     sources:  StreamSource[],
//   }
// ---------------------------------------------------------------------------

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  // ── Parse & validate params ──────────────────────────────────────────────
  const rawId = searchParams.get('id');
  if (!rawId) {
    return NextResponse.json(
      { error: 'Missing required query parameter: id' },
      { status: 400 }
    );
  }

  const tmdbId = Number(rawId);
  if (!Number.isFinite(tmdbId) || tmdbId <= 0) {
    return NextResponse.json(
      { error: `Invalid TMDB ID: "${rawId}". Must be a positive integer.` },
      { status: 400 }
    );
  }

  const type = (searchParams.get('type') ?? 'tv') as MediaType;
  if (type !== 'tv' && type !== 'movie') {
    return NextResponse.json(
      { error: 'Invalid type. Must be "tv" or "movie".' },
      { status: 400 }
    );
  }

  const season = Math.max(1, Number(searchParams.get('s') ?? '1'));
  const episode = Math.max(1, Number(searchParams.get('ep') ?? '1'));

  // ── Build sources ────────────────────────────────────────────────────────
  const sources =
    type === 'movie'
      ? getMovieSources(tmdbId)
      : getTVSources(tmdbId, season, episode);

  // ── Response ─────────────────────────────────────────────────────────────
  const body: Record<string, unknown> = {
    tmdbId,
    type,
    total: sources.length,
    providers: getProviderList(),
    sources,
  };

  if (type === 'tv') {
    body.season = season;
    body.episode = episode;
  }

  return NextResponse.json(body, {
    headers: {
      // Allow browser to cache for 5 minutes; CDN/proxy for 10 minutes.
      // Sources don't change per-request, only per tmdbId+s+ep combo.
      'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=300',
    },
  });
}

// ---------------------------------------------------------------------------
// POST /api/stream
// ---------------------------------------------------------------------------
// Body: { id, type?, season?, episode? }
// Identical logic to GET — useful when calling from a server action or
// when you don't want TMDB IDs in the browser URL bar.
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body.' },
      { status: 400 }
    );
  }

  const tmdbId = Number(body.id);
  if (!Number.isFinite(tmdbId) || tmdbId <= 0) {
    return NextResponse.json(
      { error: 'Missing or invalid "id" in request body.' },
      { status: 400 }
    );
  }

  const type = ((body.type as string) ?? 'tv') as MediaType;
  const season = Math.max(1, Number(body.season ?? 1));
  const episode = Math.max(1, Number(body.episode ?? 1));

  const sources =
    type === 'movie'
      ? getMovieSources(tmdbId)
      : getTVSources(tmdbId, season, episode);

  const responseBody: Record<string, unknown> = {
    tmdbId,
    type,
    total: sources.length,
    providers: getProviderList(),
    sources,
  };

  if (type === 'tv') {
    responseBody.season = season;
    responseBody.episode = episode;
  }

  return NextResponse.json(responseBody);
}
