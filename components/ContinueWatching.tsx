'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Film, X, Play } from 'lucide-react';
import { getWatchHistory, removeFromWatchHistory, WatchHistoryItem } from '@/lib/watchHistory';

export default function ContinueWatching() {
  const [history, setHistory] = useState<WatchHistoryItem[]>([]);

  useEffect(() => {
    setHistory(getWatchHistory());
  }, []);

  if (history.length === 0) return null;

  const remove = (id: number) => {
    removeFromWatchHistory(id);
    setHistory(getWatchHistory());
  };

  return (
    <section className="mb-6">
      <h2 className="text-xl font-bold text-white mb-3">Continue Watching</h2>
      <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
        {history.map((item) => {
          const href =
            item.mediaType === 'movie'
              ? `/drama/${item.id}/watch`
              : `/drama/${item.id}/watch?s=${item.season ?? 1}&ep=${item.episode ?? 1}`;
          const posterUrl = item.poster_path
            ? item.poster_path.startsWith('http')
              ? item.poster_path
              : `https://image.tmdb.org/t/p/w342${item.poster_path}`
            : null;

          return (
            <div key={item.id} className="relative flex-shrink-0 group" style={{ width: '140px' }}>
              <Link href={href} className="block">
                <div className="relative rounded-md overflow-hidden bg-[#1a1a1a]" style={{ width: '140px', height: '210px' }}>
                  {posterUrl ? (
                    <Image src={posterUrl} alt={item.title} fill className="object-cover" sizes="140px" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Film className="w-8 h-8 text-gray-600" />
                    </div>
                  )}
                  {/* Play overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Play className="w-10 h-10 text-white fill-white" />
                  </div>
                  {/* Episode badge */}
                  {item.mediaType === 'tv' && (
                    <div className="absolute bottom-1.5 left-1.5 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded">
                      S{item.season} E{item.episode}
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-300 mt-1.5 line-clamp-1">{item.title}</p>
              </Link>
              {/* Remove button */}
              <button
                onClick={() => remove(item.id)}
                className="absolute top-1 right-1 w-5 h-5 bg-black/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/80"
                aria-label="Remove"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
