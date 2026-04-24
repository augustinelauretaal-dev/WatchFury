'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Play, Info, Star } from 'lucide-react';
import clsx from 'clsx';
import { Drama } from '@/lib/types';

interface HeroBannerProps {
  dramas: Drama[];
}

export default function HeroBanner({ dramas }: HeroBannerProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const prev = useCallback(() => {
    setActiveIndex((i) => (i === 0 ? dramas.length - 1 : i - 1));
  }, [dramas.length]);

  const next = useCallback(() => {
    setActiveIndex((i) => (i === dramas.length - 1 ? 0 : i + 1));
  }, [dramas.length]);

  // Auto-advance every 5 seconds
  useEffect(() => {
    if (dramas.length <= 1) return;
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [next, dramas.length]);

  if (!dramas.length) return null;

  const drama = dramas[activeIndex];
  const backdropUrl = drama.backdrop_path
    ? `https://image.tmdb.org/t/p/original${drama.backdrop_path}`
    : null;

  const title = drama.name || drama.title || 'Unknown';
  const year = drama.first_air_date?.slice(0, 4);

  return (
    <div className="relative h-[55vw] max-h-[520px] min-h-[300px] overflow-hidden bg-[#111111]">
      {/* Backdrop Image */}
      {backdropUrl ? (
        <Image
          key={backdropUrl}
          src={backdropUrl}
          alt={title}
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a1a] to-[#0f0f0f]" />
      )}

      {/* Bottom-up dark gradient */}
      <div className="hero-gradient absolute inset-0 z-[1]" />

      {/* Left-side dark gradient */}
      <div className="hero-gradient-left absolute inset-0 z-[2]" />

      {/* Top-left breadcrumb */}
      <div className="absolute top-4 left-4 z-10">
        <span className="text-white/70 text-xs bg-black/40 px-2 py-1 rounded backdrop-blur-sm">
          {title}
        </span>
      </div>

      {/* Bottom-left content */}
      <div className="absolute bottom-0 left-0 p-6 md:p-10 max-w-lg z-10">
        {/* Title */}
        <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-3 italic drop-shadow-2xl">
          {title}
        </h1>

        {/* Overview */}
        {drama.overview && (
          <p className="text-sm text-gray-300 line-clamp-2 mb-4 max-w-md leading-relaxed">
            {drama.overview}
          </p>
        )}

        {/* Rating / Meta row */}
        <div className="flex items-center gap-2 mb-5 flex-wrap">
          <span className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-yellow-400 font-semibold text-sm">
              {drama.vote_average.toFixed(1)}
            </span>
          </span>
          {year && (
            <>
              <span className="text-gray-500 text-sm">·</span>
              <span className="text-gray-300 text-sm">{year}</span>
            </>
          )}
          {drama.origin_country?.[0] && (
            <>
              <span className="text-gray-500 text-sm">·</span>
              <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded font-bold uppercase tracking-wide">
                {drama.origin_country[0]}
              </span>
            </>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          <Link
            href={`/drama/${drama.id}/watch?s=1&ep=1`}
            className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-md font-semibold text-sm transition-colors shadow-lg"
          >
            <Play className="w-4 h-4 fill-white" />
            Watch Now
          </Link>
          <Link
            href={`/drama/${drama.id}`}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-md font-semibold text-sm transition-colors backdrop-blur-sm border border-white/10"
          >
            <Info className="w-4 h-4" />
            More Info
          </Link>
        </div>
      </div>

      {/* Left arrow */}
      {dramas.length > 1 && (
        <button
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
          aria-label="Previous drama"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      {/* Right arrow */}
      {dramas.length > 1 && (
        <button
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
          aria-label="Next drama"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      {/* Dot indicators — bottom right */}
      {dramas.length > 1 && (
        <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5">
          {dramas.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={clsx(
                'h-2 rounded-full transition-all duration-300 focus:outline-none',
                i === activeIndex
                  ? 'bg-primary w-6'
                  : 'bg-white/30 hover:bg-white/50 w-2'
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
