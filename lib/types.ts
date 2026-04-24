export interface Drama {
  id: number;
  name: string;
  title?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  vote_average: number;
  vote_count: number;
  first_air_date?: string;
  release_date?: string;
  genre_ids?: number[];
  origin_country?: string[];
  original_language: string;
  popularity: number;
  media_type?: string;
}

export interface DramaDetails {
  id: number;
  name?: string;
  title?: string;
  original_name?: string;
  original_title?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  vote_average: number;
  vote_count: number;
  first_air_date?: string;
  release_date?: string;
  genres: Genre[];
  seasons?: Season[];
  number_of_episodes?: number;
  number_of_seasons?: number;
  status: string;
  tagline: string;
  origin_country?: string[];
  original_language: string;
  popularity: number;
  networks?: Network[];
  created_by?: Creator[];
  credits?: { cast: CastMember[]; crew: CrewMember[] };
  videos?: { results: VideoResult[] };
  similar?: TMDBResponse<Drama>;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Season {
  id: number;
  name: string;
  season_number: number;
  episode_count: number;
  air_date: string | null;
  poster_path: string | null;
  overview: string;
}

export interface Episode {
  id: number;
  name: string;
  episode_number: number;
  season_number: number;
  overview: string;
  still_path: string | null;
  air_date: string | null;
  runtime: number | null;
  vote_average: number;
}

export interface Network {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}

export interface Creator {
  id: number;
  name: string;
  profile_path: string | null;
  credit_id: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
  known_for_department: string;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface VideoResult {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  published_at: string;
}

export interface TMDBResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface SeasonDetails {
  id: number;
  name: string;
  overview: string;
  season_number: number;
  air_date: string | null;
  poster_path: string | null;
  episodes: Episode[];
}

export interface SearchResult {
  id: number;
  name: string;
  title?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  vote_average: number;
  first_air_date?: string;
  release_date?: string;
  media_type?: string;
  origin_country?: string[];
  original_language: string;
  genre_ids?: number[];
  popularity: number;
}

export interface DramaSection {
  title: string;
  slug: string;
  dramas: Drama[];
  viewMoreHref?: string;
}

export interface WatchHistoryItem {
  id: number;
  name: string;
  poster_path: string | null;
  season: number;
  episode: number;
  progress: number; // 0–100
  watchedAt: string;
}

export type ContentCategory =
  | "kdrama"
  | "cdrama"
  | "hollywood"
  | "anime"
  | "upcoming"
  | "latest";
