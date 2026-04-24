'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Drama } from '@/lib/types';
import DramaCard from './DramaCard';

interface DramaRowProps {
  title: string;
  dramas: Drama[];
  viewMoreHref?: string;
  isLoading?: boolean;
}

export default function DramaRow({
  title,
  dramas,
  viewMoreHref,
  isLoading = false,
}: DramaRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    scrollRef.current?.scrollBy({
      left: direction === 'left' ? -400 : 400,
      behavior: 'smooth',
    });
  };

  return (
    <section className="mb-8">
      {/* Title Row */}
      <div className="flex items-center justify-between mb-3 px-0.5">
        <h2 className="text-lg font-bold text-white">{title}</h2>
        {viewMoreHref && (
          <Link
            href={viewMoreHref}
            className="flex items-center gap-0.5 text-sm text-gray-400 hover:text-primary transition-colors"
          >
            View more
            <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      {/* Scrollable container with arrows */}
      <div className="relative row-wrapper">
        {/* Left Arrow */}
        <button
          onClick={() => scroll('left')}
          className="scroll-arrow scroll-arrow-left"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Right Arrow */}
        <button
          onClick={() => scroll('right')}
          className="scroll-arrow scroll-arrow-right"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Cards / Skeletons */}
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto hide-scrollbar pb-2"
        >
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="skeleton-card min-w-[130px] sm:min-w-[150px] md:min-w-[170px] flex-shrink-0"
                >
                  <div className="skeleton-img" />
                  <div className="skeleton-text" style={{ width: '75%' }} />
                  <div
                    className="skeleton-text"
                    style={{ width: '40%', marginTop: 4 }}
                  />
                </div>
              ))
            : dramas.map((drama) => (
                <div
                  key={drama.id}
                  className="min-w-[130px] sm:min-w-[150px] md:min-w-[170px] flex-shrink-0 h-full"
                >
                  <DramaCard drama={drama} />
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
