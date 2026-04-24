'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  getDramaDetails,
  getPosterUrl,
  getBackdropUrl,
  getProfileUrl,
} from '@/lib/tmdb';
import { DramaDetails, Episode, SeasonDetails } from '@/lib/types';
import DramaRow from '@/components/DramaRow';

// ─────────────────────────────────────────────────────────────────────────────
// NOTE: This file uses 'use client' to co-locate SeasonSection (which requires
// useState/useEffect) with the drama detail page in a single file, per design.
// If you need server-side rendering + generateMetadata, extract SeasonSection
// to app/drama/[id]/SeasonSection.tsx (with its own 'use client') and convert
// this page back to an async Server Component.
// ─────────────────────────────────────────────────────────────────────────────

// ─── SeasonSection Client Component ──────────────────────────────────────────

function SeasonSection({ drama }: { drama: DramaDetails }) {
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Don't show episodes for movies
  const isMovie = !drama.seasons || drama.seasons.length === 0;
  if (isMovie) return null;

  const fetchEpisodes = useCallback(async (seasonNum: number) => {
    setLoading(true);
    setEpisodes([]);
    try {
      const res = await fetch(`/api/drama/${drama.id}/season/${seasonNum}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: SeasonDetails = await res.json();
      
      // Filter to only show aired episodes (air_date is not null and <= today)
      const today = new Date().toISOString().split('T')[0];
      const airedEpisodes = (data.episodes ?? []).filter(
        (ep: Episode) => ep.air_date && ep.air_date <= today
      );
      
      setEpisodes(airedEpisodes);
    } catch (err) {
      console.error('Failed to fetch season episodes:', err);
      setEpisodes([]);
    } finally {
      setLoading(false);
    }
  }, [drama.id]);

  useEffect(() => {
    fetchEpisodes(selectedSeason);
  }, [selectedSeason, fetchEpisodes]);

  const handleSeasonChange = (seasonNum: number) => {
    if (seasonNum === selectedSeason) return;
    setSelectedSeason(seasonNum);
  };

  const validSeasons = (drama.seasons ?? []).filter(s => s.season_number > 0);

  return (
    <section className="mt-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Episodes</h2>
        {!loading && episodes.length > 0 && (
          <span className="text-sm text-gray-500">{episodes.length} episodes</span>
        )}
      </div>

      {/* Season Tabs */}
      {validSeasons.length > 1 && (
        <div className="flex gap-2 mb-6 overflow-x-auto hide-scrollbar pb-2">
          {validSeasons.map(season => (
            <button
              key={season.season_number}
              onClick={() => handleSeasonChange(season.season_number)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedSeason === season.season_number
                  ? 'bg-primary text-white shadow-lg shadow-primary/25'
                  : 'bg-surface text-gray-400 hover:bg-surface-2 hover:text-white'
              }`}
            >
              {season.name && season.name !== `Season ${season.season_number}`
                ? season.name
                : `Season ${season.season_number}`}
            </button>
          ))}
        </div>
      )}

      {/* Episode Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="skeleton h-10 rounded-lg" />
          ))}
        </div>
      ) : episodes.length === 0 ? (
        <div className="text-center py-10 bg-surface rounded-xl">
          <p className="text-gray-500 text-sm">No episodes available for this season.</p>
          <p className="text-gray-600 text-xs mt-1">Check back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {episodes.map(ep => (
            <Link
              key={ep.id}
              href={`/drama/${drama.id}/watch?s=${selectedSeason}&ep=${ep.episode_number}`}
              className="flex items-center justify-between bg-surface hover:bg-primary/10 hover:border-primary border border-transparent px-3 py-2.5 rounded-lg text-sm transition-all group"
            >
              <span className="text-gray-400 group-hover:text-white transition-colors font-medium truncate">
                Ep {ep.episode_number}
              </span>
              {ep.vote_average > 0 && (
                <span className="text-xs text-yellow-400 flex-shrink-0 ml-1.5">
                  ★{ep.vote_average.toFixed(1)}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

// ─── Drama Detail Page ────────────────────────────────────────────────────────

export default function DramaDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [drama, setDrama] = useState<DramaDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [isMovie, setIsMovie] = useState<boolean>(false);

  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();

    const fetchDrama = async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await fetch(`/api/drama/${id}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: DramaDetails = await res.json();
        setDrama(data);
        // Detect if it's a movie (no seasons) or series
        setIsMovie(!data.seasons || data.seasons.length === 0);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Failed to fetch drama:', err);
          setError(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDrama();
    return () => controller.abort();
  }, [id]);

  /* ── Loading State ── */
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="spinner-ring">
          <span /><span /><span /><span />
          <span /><span /><span /><span />
        </div>
        <p className="text-gray-500 text-sm">Loading details...</p>
      </div>
    );
  }

  /* ── Error / Not Found State ── */
  if (error || !drama) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-6xl font-black gradient-text mb-4">Oops</h1>
        <h2 className="text-2xl font-bold text-white mb-2">Not Found</h2>
        <p className="text-gray-500 mb-8 max-w-sm">
          This title doesn&apos;t exist or was removed from our database.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-bold transition-colors"
        >
          ← Go Back Home
        </Link>
      </div>
    );
  }

  /* ── Main Content ── */
  return (
    <div className="relative">
      {/* ── Hero Backdrop ── */}
      <div className="relative h-[50vw] max-h-[500px] min-h-[250px]">
        <Image
          fill
          src={getBackdropUrl(drama.backdrop_path)}
          alt={drama.name || drama.title || ''}
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="hero-gradient absolute inset-0" />
      </div>

      {/* ── Main Content Container ── */}
      <div className="max-w-[1400px] mx-auto px-4 -mt-32 relative z-10 pb-16">
        {/* ── Header Row: Poster + Info ── */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* Poster */}
          <div className="hidden md:block flex-shrink-0 w-44 lg:w-48">
            <div className="relative aspect-poster rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
              <Image
                fill
                src={getPosterUrl(drama.poster_path)}
                alt={drama.title || drama.name || 'Poster'}
                className="object-cover"
                sizes="192px"
              />
            </div>
          </div>

          {/* Info Panel */}
          <div className="flex-1 pt-2 md:pt-6">
            {/* Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-1 leading-tight">
              {drama.title || drama.name}
            </h1>

            {/* Original name/title (if different) */}
            {(drama.original_name && drama.original_name !== drama.name) || 
             (drama.original_title && drama.original_title !== drama.title) ? (
              <p className="text-gray-500 text-sm mb-2">
                {drama.original_title || drama.original_name}
              </p>
            ) : null}

            {/* Tagline */}
            {drama.tagline && (
              <p className="text-primary italic text-sm mb-3">&ldquo;{drama.tagline}&rdquo;</p>
            )}

            {/* Meta Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-4 text-sm">
              {drama.status && (
                <span className="bg-surface border border-border px-3 py-1 rounded-full text-gray-300 text-xs font-medium">
                  {drama.status}
                </span>
              )}
              {(drama.release_date || drama.first_air_date) && (
                <span className="bg-surface border border-border px-3 py-1 rounded-full text-gray-300 text-xs font-medium">
                  {(drama.release_date || drama.first_air_date)!.slice(0, 4)}
                </span>
              )}
              {!isMovie && (drama.number_of_seasons ?? 0) > 0 && (
                <span className="bg-surface border border-border px-3 py-1 rounded-full text-gray-300 text-xs font-medium">
                  {drama.number_of_seasons} Season{drama.number_of_seasons !== 1 ? 's' : ''}
                </span>
              )}
              {!isMovie && (drama.number_of_episodes ?? 0) > 0 && (
                <span className="bg-surface border border-border px-3 py-1 rounded-full text-gray-300 text-xs font-medium">
                  {drama.number_of_episodes} Episodes
                </span>
              )}
              {drama.genres.slice(0, 3).map(g => (
                <span
                  key={g.id}
                  className="bg-primary/15 text-primary px-3 py-1 rounded-full text-xs font-medium border border-primary/20"
                >
                  {g.name}
                </span>
              ))}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1.5 bg-surface border border-border px-3 py-1.5 rounded-lg">
                <span className="text-yellow-400 text-base leading-none">★</span>
                <span className="text-white font-bold text-sm">
                  {drama.vote_average.toFixed(1)}
                </span>
                <span className="text-gray-500 text-xs">/ 10</span>
              </div>
              <span className="text-gray-600 text-xs">
                {drama.vote_count.toLocaleString()} votes
              </span>
            </div>

            {/* Networks */}
            {drama.networks && drama.networks.length > 0 && (
              <div className="flex items-center gap-2 mb-4 text-xs text-gray-500">
                <span>Network:</span>
                {drama.networks.slice(0, 2).map((n, i) => (
                  <span key={n.id} className="text-gray-400">
                    {n.name}{i < Math.min(drama.networks?.length || 0, 2) - 1 ? ',' : ''}
                  </span>
                ))}
              </div>
            )}

            {/* Overview */}
            <p className="text-gray-300 leading-relaxed mb-6 max-w-2xl text-sm md:text-base">
              {drama.overview || 'No overview available.'}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={isMovie ? `/drama/${drama.id}/watch` : `/drama/${drama.id}/watch?s=1&ep=1`}
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-colors shadow-lg shadow-primary/25"
              >
                <span className="text-base leading-none">▶</span>
                {isMovie ? 'Watch Now' : 'Watch Now — Episode 1'}
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-surface hover:bg-surface-2 border border-border text-gray-300 hover:text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>

        {/* ── Seasons & Episodes ── */}
        <SeasonSection drama={drama} />

        {/* ── Cast Section ── */}
        {(drama.credits?.cast?.length ?? 0) > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-bold text-white mb-4">Cast</h2>
            <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
              {drama.credits!.cast.slice(0, 16).map(member => (
                <div key={member.id} className="flex-shrink-0 text-center w-20">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden bg-surface mb-2 ring-2 ring-surface-2">
                    <Image
                      fill
                      src={getProfileUrl(member.profile_path)}
                      alt={member.name}
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <p className="text-xs text-gray-300 font-medium line-clamp-1 leading-snug">
                    {member.name}
                  </p>
                  <p className="text-xs text-gray-600 line-clamp-1 leading-snug mt-0.5">
                    {member.character}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Similar Dramas ── */}
        {(drama.similar?.results?.length ?? 0) > 0 && (
          <div className="mt-10">
            <DramaRow
              title="Similar Titles"
              dramas={drama.similar!.results.slice(0, 12)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
