'use client';

import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { DramaDetails, Episode } from '@/lib/types';

interface EpisodeListProps {
  drama: DramaDetails;
  currentSeason: number;
  currentEpisode: number;
  onSelect: (season: number, episode: number) => void;
}

export default function EpisodeList({
  drama,
  currentSeason,
  currentEpisode,
  onSelect,
}: EpisodeListProps) {
  const [selectedSeason, setSelectedSeason] = useState(currentSeason);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(false);

  const regularSeasons = (drama.seasons || []).filter((s) => s.season_number > 0);

  useEffect(() => {
    const fetchEpisodes = async () => {
      setLoading(true);
      setEpisodes([]);
      try {
        const res = await fetch(
          `/api/drama/${drama.id}/season/${selectedSeason}`
        );
        if (!res.ok) throw new Error('Failed to fetch episodes');
        const data = await res.json();
        
        // Filter to only show aired episodes (air_date is not null and <= today)
        const today = new Date().toISOString().split('T')[0];
        const airedEpisodes = (data.episodes ?? []).filter(
          (ep: Episode) => ep.air_date && ep.air_date <= today
        );
        
        setEpisodes(airedEpisodes);
      } catch {
        setEpisodes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEpisodes();
  }, [drama.id, selectedSeason]);

  const handleSeasonChange = (seasonNumber: number) => {
    setSelectedSeason(seasonNumber);
  };

  return (
    <div>
      {/* ── Season Tabs ──────────────────────────────────────────── */}
      {regularSeasons.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {regularSeasons.map((season) => (
            <button
              key={season.id}
              onClick={() => handleSeasonChange(season.season_number)}
              className={clsx(
                'px-3 py-1.5 text-sm rounded-md transition-colors font-medium',
                selectedSeason === season.season_number
                  ? 'bg-primary text-white'
                  : 'bg-[#222222] text-gray-400 hover:text-white hover:bg-[#2a2a2a]'
              )}
            >
              {season.name || `Season ${season.season_number}`}
            </button>
          ))}
        </div>
      )}

      {/* ── Episode Grid ─────────────────────────────────────────── */}
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-1.5 max-h-60 overflow-y-auto hide-scrollbar">
        {loading
          ? Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="skeleton w-full aspect-square rounded"
              />
            ))
          : episodes.map((ep) => {
              const isActive =
                selectedSeason === currentSeason &&
                ep.episode_number === currentEpisode;

              return (
                <button
                  key={ep.id}
                  onClick={() => onSelect(selectedSeason, ep.episode_number)}
                  title={ep.name || `Episode ${ep.episode_number}`}
                  aria-label={`Play episode ${ep.episode_number}${ep.name ? `: ${ep.name}` : ''}`}
                  className={clsx(
                    'w-full aspect-square flex items-center justify-center text-sm font-medium rounded transition-colors',
                    isActive
                      ? 'bg-primary text-white ring-2 ring-primary ring-offset-1 ring-offset-[#1a1a1a]'
                      : 'bg-[#2a2a2a] text-gray-300 hover:bg-[#333333] hover:text-white'
                  )}
                >
                  {ep.episode_number}
                </button>
              );
            })}
      </div>

      {/* ── Footer Info ──────────────────────────────────────────── */}
      {!loading && episodes.length > 0 && (
        <p className="text-xs text-gray-600 mt-2">
          {episodes.length} episode{episodes.length !== 1 ? 's' : ''} &middot; Season {selectedSeason}
        </p>
      )}

      {/* ── Empty State ──────────────────────────────────────────── */}
      {!loading && episodes.length === 0 && (
        <p className="text-xs text-gray-500 mt-2 text-center py-4">
          No episodes available for this season.
        </p>
      )}
    </div>
  );
}
