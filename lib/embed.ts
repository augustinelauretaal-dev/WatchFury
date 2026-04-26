// lib/embed.ts
// ─────────────────────────────────────────────────────────────────────────────
// Robust embed URL builder with provider management, fallback system, and validation.
// All providers use publicly accessible embed URLs that accept TMDB IDs.
// ─────────────────────────────────────────────────────────────────────────────

export type MediaType = 'tv' | 'movie';
export type SourceType = 'embed';
export type ProviderStatus = 'active' | 'disabled' | 'error';

export interface StreamSource {
  /** Unique provider identifier */
  id: string;
  /** Display name shown in the server tabs */
  name: string;
  /** The resolved iframe embed URL */
  url: string;
  /** Always 'embed' — future-proofed for HLS sources */
  type: SourceType;
  /** Optional quality/feature badge, e.g. "HD", "SUB", "4K" */
  badge?: string;
  /** Colour class used for the badge chip */
  badgeColor?: 'blue' | 'green' | 'purple' | 'pink' | 'yellow' | 'red';
  /** Whether this provider supports subtitles out-of-the-box */
  hasSubs?: boolean;
  /** Provider priority order (lower = higher priority) */
  priority?: number;
  /** Current status */
  status?: ProviderStatus;
  /** Error message if status is 'error' */
  errorMessage?: string;
}

export interface ProviderConfig {
  id: string;
  name: string;
  badge?: string;
  badgeColor?: 'blue' | 'green' | 'purple' | 'pink' | 'yellow' | 'red';
  hasSubs?: boolean;
  priority: number;
  /** Build an embed URL for a TV episode */
  tv: (tmdbId: number, season: number, episode: number) => string;
  /** Build an embed URL for a movie */
  movie: (tmdbId: number) => string;
  /** Provider is temporarily disabled */
  disabled?: boolean;
  /** Timeout for this provider in ms (default: 30000) */
  timeout?: number;
}

export interface EmbedValidationResult {
  isValid: boolean;
  tmdbId: number;
  mediaType: MediaType;
  season?: number;
  episode?: number;
  maxSeasons?: number;
  maxEpisodes?: number;
  error?: string;
  suggestions?: string[];
}

// ─── Provider Registry ────────────────────────────────────────────────────────

const PROVIDERS: ProviderConfig[] = [
  // ── Tier 1: Primary Providers (Fast & Reliable) ─────────────────────────────
  {
    id: 'vidsrc-icu',
    name: 'Server 2',
    badge: 'HD',
    badgeColor: 'blue',
    hasSubs: true,
    priority: 2,
    tv: (id, s, ep) => `https://vidsrc.icu/embed/tv/${id}/${s}/${ep}?sub_lang=en`,
    movie: (id) => `https://vidsrc.icu/embed/movie/${id}?sub_lang=en`,
  },
  /**{
    id: 'vidsrc-me',
    name: 'Server 2',
    badge: 'HD',
    badgeColor: 'blue',
    hasSubs: true,
    priority: 2,
    tv: (id, s, ep) => `https://vidsrc.me/embed/tv?tmdb=${id}&season=${s}&episode=${ep}&sub_lang=en`,
    movie: (id) => `https://vidsrc.me/embed/movie?tmdb=${id}&sub_lang=en`,
  },
  {
    id: 'vidsrc-to',
    name: 'Server 3',
    badge: 'HD',
    badgeColor: 'blue',
    hasSubs: true,
    priority: 4,
    tv: (id, s, ep) => `https://vidsrc-embed.ru/embed/tv/${id}/${s}/${ep}?sub_lang=en`,
    movie: (id) => `https://vidsrc-embed.ru/embed/movie/${id}?sub_lang=en`,
  },*/

  {
    id: 'vidking-net',
    name: 'Server 1',
    badge: 'HD',
    badgeColor: 'blue',
    hasSubs: true,
    priority: 1,
    tv: (id, s, ep) => `https://www.vidking.net/embed/tv/${id}/${s}/${ep}?lang=en`,
    movie: (id) => `https://www.vidking.net/embed/movie/${id}?lang=en`,
  },
]; 
// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Get all active providers sorted by priority
 */
export function getActiveProviders(): ProviderConfig[] {
  return PROVIDERS
    .filter((p) => !p.disabled)
    .sort((a, b) => a.priority - b.priority);
}

/**
 * Build embed URL for a specific provider
 */
export function buildEmbedUrl(
  providerId: string,
  tmdbId: number,
  mediaType: MediaType,
  season?: number,
  episode?: number
): string | null {
  const provider = PROVIDERS.find((p) => p.id === providerId && !p.disabled);
  if (!provider) return null;

  try {
    if (mediaType === 'movie') {
      return provider.movie(tmdbId);
    } else {
      const s = season ?? 1;
      const ep = episode ?? 1;
      return provider.tv(tmdbId, s, ep);
    }
  } catch (error) {
    console.error(`[Embed] Failed to build URL for ${providerId}:`, error);
    return null;
  }
}

/**
 * Get streaming sources for TV episode with metadata
 */
export function getTVSources(
  tmdbId: number,
  season: number,
  episode: number,
  options?: { debug?: boolean }
): StreamSource[] {
  const providers = getActiveProviders();
  
  if (options?.debug) {
    console.log(`[Embed] Building TV sources for TMDB:${tmdbId} S${season}E${episode}`);
  }

  return providers.map((p) => {
    const url = p.tv(tmdbId, season, episode);
    
    if (options?.debug) {
      console.log(`[Embed] ${p.name}: ${url}`);
    }

    return {
      id: p.id,
      name: p.name,
      url,
      type: 'embed',
      badge: p.badge,
      badgeColor: p.badgeColor,
      hasSubs: p.hasSubs,
      priority: p.priority,
      status: 'active',
    };
  });
}

/**
 * Get streaming sources for movie with metadata
 */
export function getMovieSources(
  tmdbId: number,
  options?: { debug?: boolean }
): StreamSource[] {
  const providers = getActiveProviders();
  
  if (options?.debug) {
    console.log(`[Embed] Building movie sources for TMDB:${tmdbId}`);
  }

  return providers.map((p) => {
    const url = p.movie(tmdbId);
    
    if (options?.debug) {
      console.log(`[Embed] ${p.name}: ${url}`);
    }

    return {
      id: p.id,
      name: p.name,
      url,
      type: 'embed',
      badge: p.badge,
      badgeColor: p.badgeColor,
      hasSubs: p.hasSubs,
      priority: p.priority,
      status: 'active',
    };
  });
}

/**
 * Get a single source by provider ID
 */
export function getSourceById(
  providerId: string,
  tmdbId: number,
  mediaType: MediaType,
  season = 1,
  episode = 1,
  options?: { debug?: boolean }
): StreamSource | null {
  const url = buildEmbedUrl(providerId, tmdbId, mediaType, season, episode);
  if (!url) return null;

  const provider = PROVIDERS.find((p) => p.id === providerId);
  if (!provider) return null;

  if (options?.debug) {
    console.log(`[Embed] Single source ${providerId}: ${url}`);
  }

  return {
    id: provider.id,
    name: provider.name,
    url,
    type: 'embed',
    badge: provider.badge,
    badgeColor: provider.badgeColor,
    hasSubs: provider.hasSubs,
    priority: provider.priority,
    status: 'active',
  };
}

/**
 * Validate and get next available source (for auto-fallback)
 */
export function getNextAvailableSource(
  currentProviderId: string,
  tmdbId: number,
  mediaType: MediaType,
  season?: number,
  episode?: number,
  excludeProviderIds: string[] = []
): StreamSource | null {
  const allSources = mediaType === 'movie' 
    ? getMovieSources(tmdbId)
    : getTVSources(tmdbId, season ?? 1, episode ?? 1);

  const excludedSet = new Set([currentProviderId, ...excludeProviderIds]);
  
  return allSources.find((s) => !excludedSet.has(s.id)) ?? null;
}

/**
 * Get provider list metadata (without URLs)
 */
export function getProviderList() {
  return getActiveProviders().map(({ id, name, badge, hasSubs, priority }) => ({
    id,
    name,
    badge,
    hasSubs: hasSubs ?? false,
    priority,
  }));
}

/**
 * Get total provider count
 */
export function getProviderCount(): number {
  return getActiveProviders().length;
}

/**
 * Mark a provider as having an error (for client-side tracking)
 */
export function markProviderError(
  sources: StreamSource[],
  providerId: string,
  errorMessage?: string
): StreamSource[] {
  return sources.map((s) =>
    s.id === providerId
      ? { ...s, status: 'error' as const, errorMessage }
      : s
  );
}

/**
 * Check if all providers have failed
 */
export function allProvidersFailed(sources: StreamSource[]): boolean {
  return sources.length > 0 && sources.every((s) => s.status === 'error');
}

/**
 * Get active sources only (non-error)
 */
export function getActiveSources(sources: StreamSource[]): StreamSource[] {
  return sources.filter((s) => s.status !== 'error');
}

// ─── Debug Helper ─────────────────────────────────────────────────────────────

/**
 * Log all embed URLs for debugging
 */
export function logEmbedUrls(
  tmdbId: number,
  mediaType: MediaType,
  season?: number,
  episode?: number
): void {
  console.group(`🎬 Embed URLs for TMDB:${tmdbId} (${mediaType})`);
  
  const sources = mediaType === 'movie'
    ? getMovieSources(tmdbId, { debug: true })
    : getTVSources(tmdbId, season ?? 1, episode ?? 1, { debug: true });

  console.table(sources.map((s) => ({
    provider: s.name,
    priority: s.priority,
    url: s.url,
    badge: s.badge || '-',
  })));
  
  console.groupEnd();
}

// ─── URL Testing Helper ───────────────────────────────────────────────────────

/**
 * Test if an embed URL is accessible (best-effort, may be blocked by CORS)
 */
export async function testEmbedUrl(url: string, timeout = 10000): Promise<{
  accessible: boolean;
  error?: string;
  responseTime?: number;
}> {
  const start = performance.now();
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    const response = await fetch(url, {
      method: 'HEAD',
      mode: 'no-cors',
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    return {
      accessible: true,
      responseTime: Math.round(performance.now() - start),
    };
  } catch (error) {
    return {
      accessible: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      responseTime: Math.round(performance.now() - start),
    };
  }
}

// ─── Validation Helpers ───────────────────────────────────────────────────────

/**
 * Client-side validation helper (server-side validation preferred)
 */
export function validateEmbedParams(
  tmdbId: number,
  mediaType: MediaType,
  season?: number,
  episode?: number
): EmbedValidationResult {
  const result: EmbedValidationResult = {
    isValid: true,
    tmdbId,
    mediaType,
  };

  // Validate TMDB ID
  if (!Number.isFinite(tmdbId) || tmdbId <= 0) {
    return {
      ...result,
      isValid: false,
      error: 'Invalid TMDB ID. Must be a positive number.',
    };
  }

  // Validate media type
  if (mediaType !== 'tv' && mediaType !== 'movie') {
    return {
      ...result,
      isValid: false,
      error: 'Invalid media type. Must be "tv" or "movie".',
    };
  }

  // Validate TV-specific params
  if (mediaType === 'tv') {
    const s = season ?? 1;
    const ep = episode ?? 1;

    if (!Number.isFinite(s) || s < 1) {
      return {
        ...result,
        isValid: false,
        error: 'Invalid season number. Must be 1 or greater.',
      };
    }

    if (!Number.isFinite(ep) || ep < 1) {
      return {
        ...result,
        isValid: false,
        error: 'Invalid episode number. Must be 1 or greater.',
      };
    }

    result.season = s;
    result.episode = ep;
  }

  return result;
}

// ─── Default Export ───────────────────────────────────────────────────────────

export default {
  getTVSources,
  getMovieSources,
  getSourceById,
  getNextAvailableSource,
  getActiveProviders,
  getProviderList,
  buildEmbedUrl,
  logEmbedUrls,
  testEmbedUrl,
  validateEmbedParams,
  markProviderError,
  allProvidersFailed,
  getActiveSources,
};
