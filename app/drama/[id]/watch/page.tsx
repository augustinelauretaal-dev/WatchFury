'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-react';
import VideoPlayer from '@/components/VideoPlayer';
import EpisodeList from '@/components/EpisodeList';
import { DramaDetails } from '@/lib/types';

interface ValidationState {
  valid: boolean;
  validating: boolean;
  error?: string;
  suggestions?: string[];
  maxSeasons?: number;
  maxEpisodes?: number;
}

export default function WatchPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const id = params.id as string;

  const [season, setSeason] = useState<number>(
    Number(searchParams.get('s') || 1)
  );
  const [episode, setEpisode] = useState<number>(
    Number(searchParams.get('ep') || 1)
  );
  const [drama, setDrama] = useState<DramaDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [isMovie, setIsMovie] = useState<boolean>(false);
  const [validation, setValidation] = useState<ValidationState>({
    valid: false,
    validating: true,
  });
  const [allProvidersFailed, setAllProvidersFailed] = useState(false);
  const [debugMode] = useState(true); // Set to false to disable debug panel

  /* ── Sync season/episode from URL ── */
  useEffect(() => {
    const s = Number(searchParams.get('s') || 1);
    const ep = Number(searchParams.get('ep') || 1);
    setSeason(s);
    setEpisode(ep);
  }, [searchParams]);

  /* ── Fetch drama details ── */
  const fetchDrama = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`/api/drama/${id}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: DramaDetails = await res.json();
      setDrama(data);
      // Detect if it's a movie (no seasons) or series
      setIsMovie(!data.seasons || data.seasons.length === 0);
    } catch (err) {
      console.error('Failed to fetch drama for watch page:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [id]);

  /* ── Validate episode exists (only for series) ── */
  const validateEpisode = useCallback(async () => {
    if (isMovie) {
      setValidation({ valid: true, validating: false });
      return;
    }

    setValidation((v) => ({ ...v, validating: true }));
    
    try {
      const res = await fetch(
        `/api/validate?id=${id}&type=tv&s=${season}&ep=${episode}`
      );
      const data = await res.json();
      
      setValidation({
        valid: data.valid,
        validating: false,
        error: data.error,
        suggestions: data.suggestions,
        maxSeasons: data.data?.maxSeasons,
        maxEpisodes: data.data?.maxEpisodes,
      });

      // Auto-correct if episode is out of range
      if (!data.valid && data.suggestions && drama) {
        const maxEp = data.data?.maxEpisodes;
        if (maxEp && episode > maxEp) {
          // Redirect to last available episode
          router.replace(`/drama/${id}/watch?s=${season}&ep=${maxEp}`);
        }
      }
    } catch (err) {
      console.error('Validation error:', err);
      setValidation({
        valid: true, // Allow playback even if validation fails
        validating: false,
      });
    }
  }, [id, season, episode, drama, router, isMovie]);

  useEffect(() => {
    fetchDrama();
  }, [fetchDrama]);

  /* ── Validate on season/episode change (only for series) ── */
  useEffect(() => {
    if (id && !isMovie) {
      validateEpisode();
    }
  }, [id, season, episode, validateEpisode, isMovie]);

  /* ── Handle episode selection from EpisodeList (only for series) ── */
  const handleEpisodeSelect = useCallback((s: number, ep: number) => {
    if (isMovie) return;
    setSeason(s);
    setEpisode(ep);
    setAllProvidersFailed(false);
    router.replace(`/drama/${id}/watch?s=${s}&ep=${ep}`);
  }, [id, router, isMovie]);

  /* ── Handle all providers failed ── */
  const handleAllProvidersFailed = useCallback(() => {
    setAllProvidersFailed(true);
  }, []);

  /* ── Get max episode for current season (only for series) ── */
  const getMaxEpisodeForSeason = useCallback((s: number) => {
    if (isMovie || !drama || !drama.seasons) return 0;
    const seasonData = drama.seasons.find((se) => se.season_number === s);
    return seasonData?.episode_count || 0;
  }, [drama, isMovie]);

  /* ── Navigate to next/previous with validation (only for series) ── */
  const goToPrevEpisode = useCallback(() => {
    if (isMovie) return;
    if (episode > 1) {
      handleEpisodeSelect(season, episode - 1);
    } else if (season > 1) {
      // Go to last episode of previous season
      const prevSeason = season - 1;
      const maxEp = getMaxEpisodeForSeason(prevSeason);
      if (maxEp > 0) {
        handleEpisodeSelect(prevSeason, maxEp);
      }
    }
  }, [episode, season, getMaxEpisodeForSeason, handleEpisodeSelect, isMovie]);

  const goToNextEpisode = useCallback(() => {
    if (isMovie) return;
    const maxEp = getMaxEpisodeForSeason(season);
    if (episode < maxEp) {
      handleEpisodeSelect(season, episode + 1);
    } else {
      // Go to first episode of next season
      const nextSeason = season + 1;
      const nextMaxEp = getMaxEpisodeForSeason(nextSeason);
      if (nextMaxEp > 0) {
        handleEpisodeSelect(nextSeason, 1);
      }
    }
  }, [episode, season, getMaxEpisodeForSeason, handleEpisodeSelect, isMovie]);

  /* ── Loading State ── */
  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        {/* Breadcrumb skeleton */}
        <div className="flex items-center gap-2 mb-4">
          <div className="skeleton h-4 w-10 rounded" />
          <span className="text-gray-600">/</span>
          <div className="skeleton h-4 w-32 rounded" />
          <span className="text-gray-600">/</span>
          <div className="skeleton h-4 w-16 rounded" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Player skeleton */}
          <div className="lg:col-span-2">
            <div className="video-wrapper skeleton" />
            <div className="mt-4 space-y-2">
              <div className="skeleton h-6 w-64 rounded" />
              <div className="skeleton h-4 w-40 rounded" />
            </div>
          </div>

          {/* Sidebar skeleton */}
          <div className="bg-card rounded-lg p-4 space-y-2">
            <div className="skeleton h-4 w-24 rounded mb-4" />
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="skeleton h-10 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ── Error State ── */
  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-5xl font-black gradient-text mb-4">Oops!</h1>
        <h2 className="text-xl font-bold text-white mb-2">
          Failed to load content
        </h2>
        <p className="text-gray-500 mb-8 max-w-sm text-sm">
          Something went wrong while fetching this title. Please try again.
        </p>
        <div className="flex gap-3">
          <button
            onClick={fetchDrama}
            className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-colors"
          >
            Retry
          </button>
          <Link
            href="/"
            className="bg-surface hover:bg-surface-2 border border-border text-gray-300 hover:text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-6">
      {/* ── Breadcrumb ── */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-4 flex-wrap">
        <Link href="/" className="hover:text-gray-300 transition-colors">
          Home
        </Link>
        <span className="text-gray-700">/</span>
        <Link
          href={`/drama/${id}`}
          className="hover:text-gray-300 transition-colors truncate max-w-[180px] sm:max-w-xs"
        >
          {(drama?.title ?? drama?.name) ?? id}
        </Link>
        <span className="text-gray-700">/</span>
        <span className="text-gray-300 font-medium">
          {isMovie ? 'Watch' : `S${season} E${episode}`}
        </span>
      </nav>

      {/* ── Main Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left: Player + Info ── */}
        <div className="lg:col-span-2 space-y-4">
          {/* Video Player with fallback system */}
          <VideoPlayer
            tmdbId={Number(id)}
            season={isMovie ? undefined : season}
            episode={isMovie ? undefined : episode}
            title={drama?.title || drama?.name}
            mediaType={isMovie ? 'movie' : 'tv'}
            debug={debugMode}
            onAllProvidersFailed={handleAllProvidersFailed}
          />

          {/* Validation Warning (only for series) */}
          {!isMovie && !validation.valid && !validation.validating && validation.error && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-yellow-400 text-sm font-medium">
                  {validation.error}
                </p>
                {validation.suggestions && (
                  <ul className="mt-1 space-y-0.5">
                    {validation.suggestions.map((s, i) => (
                      <li key={i} className="text-yellow-400/70 text-xs">
                        • {s}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {/* All Providers Failed Warning */}
          {allProvidersFailed && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-center">
              <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <h3 className="text-red-400 font-semibold mb-1">
                All streaming servers unavailable
              </h3>
              <p className="text-red-400/70 text-sm mb-3">
                This video may not be available from any provider at the moment.
              </p>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => window.location.reload()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Retry All
                </button>
                <button
                  onClick={goToNextEpisode}
                  className="px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 text-gray-400 text-sm transition-colors"
                >
                  Try Next Episode
                </button>
              </div>
            </div>
          )}

          {/* Episode Title & Meta */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-white leading-tight truncate">
                {drama?.title || drama?.name}
              </h1>
              <p className="text-gray-400 text-sm mt-0.5">
                {isMovie ? 'Movie' : `Season ${season} · Episode ${episode}`}
              </p>
            </div>

            {/* Prev / Next episode buttons with smart navigation (only for series) */}
            {!isMovie && (
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={goToPrevEpisode}
                  disabled={episode <= 1 && season <= 1}
                  className="flex items-center gap-1.5 bg-surface hover:bg-surface-2 border border-border text-gray-400 hover:text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Prev
                </button>
                <button
                  onClick={goToNextEpisode}
                  disabled={episode >= (getMaxEpisodeForSeason(season)) && season >= (drama?.number_of_seasons || 1)}
                  className="flex items-center gap-1.5 bg-surface hover:bg-surface-2 border border-border text-gray-400 hover:text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              </div>
            )}
          </div>

          {/* Movie/Series Overview */}
          {drama?.overview && (
            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                About
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                {drama.overview}
              </p>
            </div>
          )}

          {/* Movie/Series Meta Info */}
          {drama && (
            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
              {drama.vote_average > 0 && (
                <span className="flex items-center gap-1">
                  <span className="text-yellow-400">★</span>
                  <span className="text-gray-400 font-medium">
                    {drama.vote_average.toFixed(1)}
                  </span>
                  <span>/10</span>
                </span>
              )}
              {(drama.release_date || drama.first_air_date) && (
                <span>{(drama.release_date || drama.first_air_date)!.slice(0, 4)}</span>
              )}
              {!isMovie && (drama.number_of_episodes ?? 0) > 0 && (
                <span>{drama.number_of_episodes} Episodes</span>
              )}
              {drama.genres?.slice(0, 3).map(g => (
                <span
                  key={g.id}
                  className="bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20"
                >
                  {g.name}
                </span>
              ))}
            </div>
          )}

          {/* Back to detail page */}
          <div className="pt-2">
            <Link
              href={`/drama/${id}`}
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-300 transition-colors"
            >
              ← View full details for{' '}
              <span className="text-gray-400 font-medium truncate max-w-[200px]">
                {drama?.title || drama?.name}
              </span>
            </Link>
          </div>
        </div>

        {/* ── Right: Episode List Sidebar (only for series) ── */}
        {!isMovie && (
          <div className="bg-card border border-border rounded-xl p-4 h-fit lg:sticky lg:top-[calc(var(--nav-height)+1rem)] lg:max-h-[calc(100vh-var(--nav-height)-2rem)] lg:overflow-hidden lg:flex lg:flex-col">
            <h3 className="font-bold text-xs text-gray-400 uppercase tracking-widest mb-3 flex-shrink-0">
              Episodes
            </h3>
            <div className="lg:overflow-y-auto lg:flex-1 hide-scrollbar">
              {drama ? (
                <EpisodeList
                  drama={drama}
                  currentSeason={season}
                  currentEpisode={episode}
                  onSelect={handleEpisodeSelect}
                />
              ) : (
                <div className="space-y-2">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="skeleton h-10 w-full rounded-lg" />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
