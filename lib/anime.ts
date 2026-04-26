// lib/anime.ts
// ─────────────────────────────────────────────────────────────────────────────
// Jikan API integration for anime data
// Jikan is an unofficial MyAnimeList API - https://api.jikan.moe/
// ─────────────────────────────────────────────────────────────────────────────

import type { Drama } from './types';

const JIKAN_BASE_URL = 'https://api.jikan.moe/v4';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Anime {
  mal_id: number;
  title: string;
  title_english?: string;
  title_japanese?: string;
  images: {
    jpg: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
    webp: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
  };
  type: 'tv' | 'movie' | 'ova' | 'special' | 'ona' | 'music';
  episodes?: number;
  status: string;
  airing: boolean;
  aired: {
    from: string | null;
    to: string | null;
    string: string;
  };
  duration?: string;
  rating?: string;
  score?: number;
  scored_by?: number;
  rank?: number;
  popularity?: number;
  members?: number;
  favorites?: number;
  synopsis?: string;
  background?: string;
  genres: Array<{
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }>;
  studios: Array<{
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }>;
  source: string;
  season?: string;
  year?: number;
}

export interface AnimeGenre {
  mal_id: number;
  name: string;
  url: string;
  count?: number;
}

export interface JikanResponse<T> {
  data: T[];
  pagination: {
    last_visible_page: number;
    has_next_page: boolean;
    current_page: number;
    items: {
      count: number;
      total: number;
      per_page: number;
    };
  };
}

// ─── Helper Functions ───────────────────────────────────────────────────────

async function jikanFetch<T>(endpoint: string): Promise<T> {
  const url = `${JIKAN_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  if (!response.ok) {
    throw new Error(`Jikan API error: ${response.status}`);
  }

  return response.json();
}

// ─── Public API Functions ────────────────────────────────────────────────────

/**
 * Get top anime
 */
export async function getTopAnime(limit = 21, page = 1): Promise<JikanResponse<Anime>> {
  const data = await jikanFetch<JikanResponse<Anime>>(
    `/top/anime?limit=${limit}&page=${page}`
  );
  return data;
}

/**
 * Get currently airing anime
 */
export async function getAiringAnime(limit = 21, page = 1): Promise<JikanResponse<Anime>> {
  const data = await jikanFetch<JikanResponse<Anime>>(
    `/anime?status=airing&order_by=score&sort=desc&limit=${limit}&page=${page}`
  );
  return data;
}

/**
 * Get upcoming anime
 */
export async function getUpcomingAnime(limit = 21, page = 1): Promise<JikanResponse<Anime>> {
  const data = await jikanFetch<JikanResponse<Anime>>(
    `/anime?status=upcoming&order_by=popularity&sort=desc&limit=${limit}&page=${page}`
  );
  return data;
}

/**
 * Get latest anime (by start date)
 */
export async function getLatestAnime(limit = 21, page = 1): Promise<JikanResponse<Anime>> {
  const data = await jikanFetch<JikanResponse<Anime>>(
    `/anime?order_by=start_date&sort=desc&limit=${limit}&page=${page}`
  );
  return data;
}

/**
 * Get anime by genre
 */
export async function getAnimeByGenre(
  genreId: number,
  limit = 21,
  page = 1
): Promise<JikanResponse<Anime>> {
  const data = await jikanFetch<JikanResponse<Anime>>(
    `/anime?genres=${genreId}&order_by=score&sort=desc&limit=${limit}&page=${page}`
  );
  return data;
}

/**
 * Get anime by country of origin (Japan)
 * Note: Jikan API doesn't have direct country filter, but we can use type and origin
 */
export async function getAnimeByCountry(
  country: 'japan',
  limit = 21,
  page = 1
): Promise<JikanResponse<Anime>> {
  // Jikan doesn't have a direct country filter, so we'll use the origin parameter
  const data = await jikanFetch<JikanResponse<Anime>>(
    `/anime?origin=${country}&order_by=score&sort=desc&limit=${limit}&page=${page}`
  );
  return data;
}


/**
 * Get anime genres
 */
export async function getAnimeGenres(): Promise<AnimeGenre[]> {
  const data = await jikanFetch<{ data: AnimeGenre[] }>(
    '/genres/anime'
  );
  return data.data;
}

/**
 * Search anime by query
 */
export async function searchAnime(query: string, limit = 20): Promise<Anime[]> {
  const data = await jikanFetch<JikanResponse<Anime>>(
    `/anime?q=${encodeURIComponent(query)}&order_by=score&sort=desc&limit=${limit}`
  );
  return data.data;
}

/**
 * Get anime details by ID
 */
export async function getAnimeDetails(id: number): Promise<Anime> {
  const data = await jikanFetch<{ data: Anime }>(`/anime/${id}`);
  return data.data;
}

// ─── Utility Functions ───────────────────────────────────────────────────────

/**
 * Convert Jikan Anime to Drama format for compatibility with existing components
 */
export function animeToDrama(anime: Anime): Drama {
  return {
    id: Number(`99999${anime.mal_id}`), // Add prefix to avoid ID conflicts with TMDB
    name: anime.title_english || anime.title,
    title: anime.title_english || anime.title,
    poster_path: anime.images.jpg.large_image_url,
    backdrop_path: anime.images.jpg.image_url,
    overview: anime.synopsis || '',
    vote_average: anime.score || 0,
    vote_count: anime.scored_by || 0,
    first_air_date: anime.aired.from || undefined,
    release_date: anime.aired.from || undefined,
    genre_ids: anime.genres.map(g => g.mal_id),
    origin_country: anime.studios.map(s => s.name),
    original_language: 'ja',
    popularity: anime.popularity || 0,
    media_type: anime.type === 'movie' ? 'movie' : 'tv',
  };
}

/**
 * Convert array of Anime to Drama format
 */
export function animeListToDrama(animeList: Anime[]): Drama[] {
  return animeList.map(animeToDrama);
}
