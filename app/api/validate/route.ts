import { NextRequest, NextResponse } from 'next/server';
import { 
  validateWatchParams, 
  validateSeasonAndEpisode, 
  getSeasonEpisodes,
  detectMediaType,
  type ValidationResult 
} from '@/lib/tmdb';

export const dynamic = 'force-dynamic';

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/validate
// ─────────────────────────────────────────────────────────────────────────────
// Query params:
//   id       – TMDB ID (required)
//   type     – "tv" | "movie" (optional, will auto-detect if not provided)
//   s        – season number (default: 1, tv only)
//   ep       – episode number (default: 1, tv only)
//
// Response:
//   {
//     valid: boolean,
//     error?: string,
//     suggestions?: string[],
//     data?: {
//       maxSeasons?: number,
//       maxEpisodes?: number,
//       seasonExists?: boolean,
//       episodeExists?: boolean,
//       mediaType?: 'tv' | 'movie'
//     }
//   }
// ─────────────────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  // ── Parse & validate TMDB ID ───────────────────────────────────────────────
  const rawId = searchParams.get('id');
  if (!rawId) {
    return NextResponse.json(
      { valid: false, error: 'Missing required parameter: id' },
      { status: 400 }
    );
  }

  const tmdbId = Number(rawId);
  if (!Number.isFinite(tmdbId) || tmdbId <= 0) {
    return NextResponse.json(
      { valid: false, error: `Invalid TMDB ID: "${rawId}"` },
      { status: 400 }
    );
  }

  // ── Detect or validate media type ──────────────────────────────────────────
  let mediaType = searchParams.get('type') as 'tv' | 'movie' | null;
  
  if (!mediaType) {
    // Auto-detect media type
    const detected = await detectMediaType(tmdbId);
    if (!detected) {
      return NextResponse.json(
        { 
          valid: false, 
          error: `Content with ID ${tmdbId} not found`,
          suggestions: ['Verify the TMDB ID is correct', 'Check if the content exists on TMDB']
        },
        { status: 404 }
      );
    }
    mediaType = detected;
  } else if (mediaType !== 'tv' && mediaType !== 'movie') {
    return NextResponse.json(
      { valid: false, error: 'Invalid type. Must be "tv" or "movie".' },
      { status: 400 }
    );
  }

  // ── Parse season and episode ───────────────────────────────────────────────
  const season = Math.max(1, Number(searchParams.get('s') ?? '1'));
  const episode = Math.max(1, Number(searchParams.get('ep') ?? '1'));

  // ── Perform validation ─────────────────────────────────────────────────────
  try {
    const result: ValidationResult = await validateWatchParams(
      tmdbId,
      mediaType,
      season,
      episode
    );

    const statusCode = result.valid ? 200 : 404;
    
    return NextResponse.json(
      {
        ...result,
        meta: {
          tmdbId,
          mediaType,
          ...(mediaType === 'tv' && { season, episode }),
        },
      },
      { 
        status: statusCode,
        headers: {
          'Cache-Control': 'private, max-age=300', // Cache for 5 minutes
        }
      }
    );
  } catch (error) {
    console.error('[API/Validate] Validation error:', error);
    return NextResponse.json(
      { 
        valid: false, 
        error: 'Validation failed due to server error',
        meta: { tmdbId, mediaType }
      },
      { status: 500 }
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/validate/episodes
// ─────────────────────────────────────────────────────────────────────────────
// Body: { id: number, season: number }
// Returns: { valid: boolean, episodes: Array<{episode_number, name}>, error? }
// ─────────────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { valid: false, error: 'Invalid JSON body' },
      { status: 400 }
    );
  }

  // Validate TMDB ID
  const tmdbId = Number(body.id);
  if (!Number.isFinite(tmdbId) || tmdbId <= 0) {
    return NextResponse.json(
      { valid: false, error: 'Missing or invalid "id"' },
      { status: 400 }
    );
  }

  // Validate season
  const season = Number(body.season ?? 1);
  if (!Number.isFinite(season) || season < 1) {
    return NextResponse.json(
      { valid: false, error: 'Invalid season number' },
      { status: 400 }
    );
  }

  try {
    const result = await getSeasonEpisodes(tmdbId, season);
    
    return NextResponse.json(
      {
        ...result,
        meta: { tmdbId, season },
      },
      { 
        status: result.valid ? 200 : 404,
        headers: {
          'Cache-Control': 'private, max-age=600', // Cache for 10 minutes
        }
      }
    );
  } catch (error) {
    console.error('[API/Validate] Episodes fetch error:', error);
    return NextResponse.json(
      { 
        valid: false, 
        error: 'Failed to fetch episodes',
        meta: { tmdbId, season }
      },
      { status: 500 }
    );
  }
}
