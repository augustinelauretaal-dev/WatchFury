import { Drama, DramaDetails, SeasonDetails, TMDBResponse } from "./types";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
export const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

// ─── Core Fetcher ────────────────────────────────────────────────────────────

async function tmdbFetch<T = unknown>(
  endpoint: string,
  params: Record<string, string> = {}
): Promise<T> {
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);

  // Always include language
  if (!params.language) params.language = "en-US";

  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.append(key, value)
  );

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    next: { revalidate: 0 }, // No caching for development
  });

  if (!res.ok) {
    throw new Error(
      `TMDB API Error [${res.status}]: ${res.statusText} — ${endpoint}`
    );
  }

  return res.json() as Promise<T>;
}

// ─── Image Helpers ────────────────────────────────────────────────────────────

export function getPosterUrl(
  path: string | null,
  size: "w185" | "w342" | "w500" | "w780" | "original" = "w500"
): string {
  if (!path) return "/placeholder-poster.jpg";
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

export function getBackdropUrl(
  path: string | null,
  size: "w300" | "w780" | "w1280" | "original" = "original"
): string {
  if (!path) return "/placeholder-backdrop.jpg";
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

export function getProfileUrl(
  path: string | null,
  size: "w45" | "w185" | "h632" | "original" = "w185"
): string {
  if (!path) return "/placeholder-avatar.jpg";
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

// ─── Hero / Trending ─────────────────────────────────────────────────────────

/** Trending movies this week — used for the hero banner carousel */
export async function getTrendingMovies(): Promise<Drama[]> {
  const data = await tmdbFetch<TMDBResponse<Drama>>("/trending/movie/week");
  return data.results.slice(0, 8);
}

/** Trending series (US and Filipino only) — hero fallback */
export async function getTrendingSeries(): Promise<Drama[]> {
  const data = await tmdbFetch<TMDBResponse<Drama>>("/trending/tv/week");
  return data.results
    .filter(
      (d) =>
        d.origin_country?.includes("US") ||
        d.origin_country?.includes("PH") ||
        d.original_language === "en" ||
        d.original_language === "tl"
    )
    .slice(0, 10);
}

// ─── Category Rows (Movies - All Countries) ─────────────────────────────────

/** Latest movies sorted by release date descending */
export async function getLatestMovies(page = 1): Promise<Drama[]> {
  const today = new Date().toISOString().split("T")[0];
  const data = await tmdbFetch<TMDBResponse<Drama>>("/discover/movie", {
    sort_by: "release_date.desc",
    "release_date.lte": today,
    page: String(page),
    "vote_count.gte": "10",
  });
  return data.results.slice(0, 16);
}

/** Top movies by popularity */
export async function getTopMovies(page = 1): Promise<Drama[]> {
  const data = await tmdbFetch<TMDBResponse<Drama>>("/discover/movie", {
    sort_by: "popularity.desc",
    page: String(page),
    "vote_count.gte": "50",
  });
  return data.results.slice(0, 16);
}

/** Top-rated movies */
export async function getTopRatedMovies(page = 1): Promise<Drama[]> {
  const data = await tmdbFetch<TMDBResponse<Drama>>("/discover/movie", {
    sort_by: "vote_average.desc",
    "vote_count.gte": "100",
    page: String(page),
  });
  return data.results.slice(0, 16);
}

/** Upcoming movies — releasing in the next 90 days */
export async function getUpcomingMovies(): Promise<Drama[]> {
  const today = new Date();
  const future = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000);

  const fmt = (d: Date) => d.toISOString().split("T")[0];

  const data = await tmdbFetch<TMDBResponse<Drama>>("/discover/movie", {
    sort_by: "release_date.asc",
    "release_date.gte": fmt(today),
    "release_date.lte": fmt(future),
  });
  return data.results.slice(0, 16);
}

// ─── Category Rows (Series - US Only) ─────────────────────────────────────

/** Latest series (US) sorted by air date descending */
export async function getLatestSeries(page = 1): Promise<Drama[]> {
  const today = new Date().toISOString().split("T")[0];
  const data = await tmdbFetch<TMDBResponse<Drama>>("/discover/tv", {
    with_origin_country: "US",
    sort_by: "first_air_date.desc",
    "first_air_date.lte": today,
    page: String(page),
    "vote_count.gte": "5",
  });
  return data.results.slice(0, 16);
}

/** Top US series by popularity */
export async function getTopUSSeries(page = 1): Promise<Drama[]> {
  const data = await tmdbFetch<TMDBResponse<Drama>>("/discover/tv", {
    with_origin_country: "US",
    with_original_language: "en",
    sort_by: "popularity.desc",
    page: String(page),
    "vote_count.gte": "50",
  });
  return data.results.slice(0, 16);
}

/** Latest K-drama series sorted by air date descending */
export async function getLatestKdramaSeries(page = 1): Promise<Drama[]> {
  const today = new Date().toISOString().split("T")[0];
  const data = await tmdbFetch<TMDBResponse<Drama>>("/discover/tv", {
    with_origin_country: "KR",
    with_original_language: "ko",
    sort_by: "first_air_date.desc",
    "first_air_date.lte": today,
    page: String(page),
    "vote_count.gte": "5",
  });
  return data.results.slice(0, 16);
}

/** Top K-drama series by popularity */
export async function getTopKdramaSeries(page = 1): Promise<Drama[]> {
  const data = await tmdbFetch<TMDBResponse<Drama>>("/discover/tv", {
    with_origin_country: "KR",
    with_original_language: "ko",
    sort_by: "popularity.desc",
    page: String(page),
    "vote_count.gte": "10",
  });
  return data.results.slice(0, 16);
}

/** Upcoming series (US) — airing in the next 90 days */
export async function getUpcomingSeries(): Promise<Drama[]> {
  const today = new Date();
  const future = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000);

  const fmt = (d: Date) => d.toISOString().split("T")[0];

  const data = await tmdbFetch<TMDBResponse<Drama>>("/discover/tv", {
    with_origin_country: "US",
    sort_by: "first_air_date.asc",
    "first_air_date.gte": fmt(today),
    "first_air_date.lte": fmt(future),
  });
  return data.results.slice(0, 16);
}

/** Top-rated series (US) */
export async function getTopRatedSeries(page = 1): Promise<Drama[]> {
  const data = await tmdbFetch<TMDBResponse<Drama>>("/discover/tv", {
    with_origin_country: "US",
    sort_by: "vote_average.desc",
    "vote_count.gte": "100",
    page: String(page),
  });
  return data.results.slice(0, 16);
}

// ─── Detail Pages ─────────────────────────────────────────────────────────────

/** Full series details with cast, videos, and similar titles */
export async function getSeriesDetails(id: number): Promise<DramaDetails> {
  return tmdbFetch<DramaDetails>(`/tv/${id}`, {
    append_to_response: "credits,videos,similar,content_ratings",
  });
}

/** Full movie details with cast, videos, and similar titles */
export async function getMovieDetails(id: number): Promise<DramaDetails> {
  return tmdbFetch<DramaDetails>(`/movie/${id}`, {
    append_to_response: "credits,videos,similar,content_ratings",
  });
}

/** Legacy function name for compatibility */
export async function getDramaDetails(id: number): Promise<DramaDetails> {
  return getSeriesDetails(id);
}

/** All episodes for a given season */
export async function getSeasonDetails(
  dramaId: number,
  seasonNumber: number
): Promise<SeasonDetails> {
  return tmdbFetch<SeasonDetails>(`/tv/${dramaId}/season/${seasonNumber}`);
}

// ─── Search ───────────────────────────────────────────────────────────────────

/** Search TV shows by query string */
export async function searchDramas(query: string, page = 1): Promise<Drama[]> {
  if (!query.trim()) return [];

  const data = await tmdbFetch<TMDBResponse<Drama>>("/search/tv", {
    query: query.trim(),
    page: String(page),
    include_adult: "false",
  });

  return data.results.slice(0, 21);
}

/** Multi-search (TV + movies) */
export async function multiSearch(query: string): Promise<Drama[]> {
  if (!query.trim()) return [];

  // First try with original query
  let data = await tmdbFetch<TMDBResponse<Drama>>("/search/multi", {
    query: query.trim(),
    include_adult: "false",
    language: "en-US",
  });

  let results = data.results
    .filter((r) => r.media_type === "tv" || r.media_type === "movie")
    .slice(0, 21);

  // If no results, try without year (remove anything in parentheses)
  if (results.length === 0) {
    const cleanQuery = query.replace(/\s*\(.*?\)\s*/g, "").trim();
    if (cleanQuery && cleanQuery !== query) {
      data = await tmdbFetch<TMDBResponse<Drama>>("/search/multi", {
        query: cleanQuery,
        include_adult: "false",
        language: "en-US",
      });
      results = data.results
        .filter((r) => r.media_type === "tv" || r.media_type === "movie")
        .slice(0, 21);
    }
  }

  return results;
}

// ─── Discover Helpers ─────────────────────────────────────────────────────────

export type SortOption =
  | "popularity.desc"
  | "popularity.asc"
  | "first_air_date.desc"
  | "first_air_date.asc"
  | "vote_average.desc"
  | "vote_average.asc";

export interface DiscoverOptions {
  country?: string;
  genre?: string;
  sortBy?: SortOption;
  page?: number;
  minVotes?: number;
  type?: 'tv' | 'movie';
}

/** Generic discover endpoint — used by the /explore page */
export async function discoverDramas(
  options: DiscoverOptions = {}
): Promise<{ results: Drama[]; total_pages: number; total_results: number }> {
  const {
    country,
    genre,
    sortBy = "popularity.desc",
    page = 1,
    minVotes = 5,
    type = "tv",
  } = options;

  const params: Record<string, string> = {
    sort_by: sortBy,
    page: String(page),
    "vote_count.gte": String(minVotes),
  };

  if (country) params.with_origin_country = country;
  if (genre) params.with_genres = genre;

  const endpoint = type === "movie" ? "/discover/movie" : "/discover/tv";
  
  // Fetch page 1 and page 2 to get 21 items (TMDB returns 20 per page)
  const [data1, data2] = await Promise.all([
    tmdbFetch<TMDBResponse<Drama>>(endpoint, { ...params, page: String(page) }),
    tmdbFetch<TMDBResponse<Drama>>(endpoint, { ...params, page: String(page + 1) }),
  ]);

  // Combine and deduplicate by ID, then slice to 21
  const seen = new Set<number>();
  const uniqueResults: Drama[] = [];
  
  for (const drama of [...data1.results, ...data2.results]) {
    if (!seen.has(drama.id)) {
      seen.add(drama.id);
      uniqueResults.push(drama);
      if (uniqueResults.length >= 21) break;
    }
  }

  return {
    results: uniqueResults,
    total_pages: data1.total_pages,
    total_results: data1.total_results,
  };
}

// ─── Genre List ───────────────────────────────────────────────────────────────

export interface TMDBGenre {
  id: number;
  name: string;
}

export async function getTVGenres(): Promise<TMDBGenre[]> {
  const data = await tmdbFetch<{ genres: TMDBGenre[] }>("/genre/tv/list");
  return data.genres;
}

export async function getMovieGenres(): Promise<TMDBGenre[]> {
  const data = await tmdbFetch<{ genres: TMDBGenre[] }>("/genre/movie/list");
  return data.genres;
}

// ─── Streaming Embed URL ──────────────────────────────────────────────────────

/**
 * Build a vidsrc.to embed URL for a TV episode.
 * vidsrc.to is a free, public streaming embed — no API key required.
 *
 * @param tmdbId   - TMDB show ID
 * @param season   - Season number (1-based)
 * @param episode
 */
export function getStreamingEmbedUrl(
  tmdbId: number,
  season: number,
  episode: number
): string {
  const base =
    process.env.NEXT_PUBLIC_EMBED_BASE_URL_SECONDARY ?? "https://vidsrc.to/embed";
  return `${base}/tv/${tmdbId}/${season}/${episode}`;
}

/**
 * Build a vidsrc.to embed URL for a movie.
 */
export function getMovieEmbedUrl(tmdbId: number): string {
  const base =
    process.env.NEXT_PUBLIC_EMBED_BASE_URL_SECONDARY ?? "https://vidsrc.to/embed";
  return `${base}/movie/${tmdbId}`;
}

// ─── Validation Functions ─────────────────────────────────────────────────────

export interface ValidationResult {
  valid: boolean;
  error?: string;
  suggestions?: string[];
  data?: {
    maxSeasons?: number;
    maxEpisodes?: number;
    seasonExists?: boolean;
    episodeExists?: boolean;
    mediaType?: 'tv' | 'movie';
  };
}

/**
 * Validate if a TV show exists and get basic info
 */
export async function validateTVShow(tmdbId: number): Promise<ValidationResult> {
  try {
    const details = await tmdbFetch<{ 
      id: number; 
      name: string; 
      number_of_seasons: number;
      number_of_episodes: number;
    }>(`/tv/${tmdbId}`);

    return {
      valid: true,
      data: {
        maxSeasons: details.number_of_seasons,
        maxEpisodes: details.number_of_episodes,
        mediaType: 'tv',
      },
    };
  } catch (error) {
    return {
      valid: false,
      error: `TV show with ID ${tmdbId} not found`,
      suggestions: ['Check the TMDB ID is correct', 'Try searching for the show by name'],
    };
  }
}

/**
 * Validate if a movie exists
 */
export async function validateMovie(tmdbId: number): Promise<ValidationResult> {
  try {
    const details = await tmdbFetch<{ 
      id: number; 
      title: string;
    }>(`/movie/${tmdbId}`);

    return {
      valid: true,
      data: {
        mediaType: 'movie',
      },
    };
  } catch (error) {
    return {
      valid: false,
      error: `Movie with ID ${tmdbId} not found`,
      suggestions: ['Check the TMDB ID is correct', 'Try searching for the movie by name'],
    };
  }
}

/**
 * Validate season and episode numbers against TMDB data
 */
export async function validateSeasonAndEpisode(
  tmdbId: number,
  seasonNumber: number,
  episodeNumber?: number
): Promise<ValidationResult> {
  try {
    // First, get season details
    const season = await tmdbFetch<{
      id: number;
      season_number: number;
      episodes: Array<{ episode_number: number }>;
    }>(`/tv/${tmdbId}/season/${seasonNumber}`);

    const maxEpisodes = season.episodes.length;
    const maxEpisodeNumber = Math.max(...season.episodes.map((e) => e.episode_number));

    // If episode number provided, validate it
    if (episodeNumber !== undefined) {
      const episodeExists = season.episodes.some(
        (e) => e.episode_number === episodeNumber
      );

      if (!episodeExists) {
        return {
          valid: false,
          error: `Episode ${episodeNumber} does not exist in Season ${seasonNumber}`,
          suggestions: [
            `This season has episodes 1-${maxEpisodeNumber}`,
            `Try episode 1 to start the season`,
          ],
          data: {
            seasonExists: true,
            episodeExists: false,
            maxEpisodes,
          },
        };
      }

      return {
        valid: true,
        data: {
          seasonExists: true,
          episodeExists: true,
          maxEpisodes,
        },
      };
    }

    return {
      valid: true,
      data: {
        seasonExists: true,
        maxEpisodes,
      },
    };
  } catch (error) {
    // Season might not exist, check how many seasons exist
    try {
      const show = await tmdbFetch<{ number_of_seasons: number }>(`/tv/${tmdbId}`);
      return {
        valid: false,
        error: `Season ${seasonNumber} does not exist`,
        suggestions: [
          `This show has ${show.number_of_seasons} season(s)`,
          `Try season 1`,
        ],
        data: {
          seasonExists: false,
          maxSeasons: show.number_of_seasons,
        },
      };
    } catch {
      return {
        valid: false,
        error: `Unable to validate season ${seasonNumber}`,
      };
    }
  }
}

/**
 * Get all episodes for a specific season (for episode selector validation)
 */
export async function getSeasonEpisodes(
  tmdbId: number,
  seasonNumber: number
): Promise<{ episodes: Array<{ episode_number: number; name: string }>; valid: boolean; error?: string }> {
  try {
    const season = await tmdbFetch<{
      episodes: Array<{ episode_number: number; name: string }>;
    }>(`/tv/${tmdbId}/season/${seasonNumber}`);

    return {
      valid: true,
      episodes: season.episodes.map((e) => ({
        episode_number: e.episode_number,
        name: e.name,
      })),
    };
  } catch (error) {
    return {
      valid: false,
      episodes: [],
      error: `Failed to fetch episodes for season ${seasonNumber}`,
    };
  }
}

/**
 * Detect media type from TMDB ID (tries TV first, then movie)
 */
export async function detectMediaType(tmdbId: number): Promise<'tv' | 'movie' | null> {
  // Try TV first
  try {
    await tmdbFetch<{ id: number }>(`/tv/${tmdbId}`);
    return 'tv';
  } catch {
    // Not a TV show, try movie
    try {
      await tmdbFetch<{ id: number }>(`/movie/${tmdbId}`);
      return 'movie';
    } catch {
      return null;
    }
  }
}

/**
 * Comprehensive validation for watch page
 */
export async function validateWatchParams(
  tmdbId: number,
  mediaType: 'tv' | 'movie',
  season?: number,
  episode?: number
): Promise<ValidationResult> {
  // Validate TMDB ID
  if (!Number.isFinite(tmdbId) || tmdbId <= 0) {
    return {
      valid: false,
      error: 'Invalid TMDB ID',
    };
  }

  // Validate based on media type
  if (mediaType === 'movie') {
    return validateMovie(tmdbId);
  }

  // For TV, validate show exists first
  const showValidation = await validateTVShow(tmdbId);
  if (!showValidation.valid) {
    return showValidation;
  }

  // Then validate season/episode
  const s = season ?? 1;
  const ep = episode ?? 1;

  const seasonValidation = await validateSeasonAndEpisode(tmdbId, s, ep);
  
  if (!seasonValidation.valid) {
    return seasonValidation;
  }

  return {
    valid: true,
    data: {
      ...showValidation.data,
      ...seasonValidation.data,
    },
  };
}
