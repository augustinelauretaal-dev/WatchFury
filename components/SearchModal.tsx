"use client";

import { useState, useEffect, useRef, useCallback, KeyboardEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X, Star, Clock, TrendingUp, ArrowRight } from "lucide-react";
import type { Drama } from "@/lib/types";

// ─── Constants ────────────────────────────────────────────────────────────────

const RECENT_KEY = "watchfury_recent_searches";
const MAX_RECENT = 6;

const TRENDING_SUGGESTIONS = [
  "Dune",
  "Oppenheimer",
  "The Batman",
  "Stranger Things",
  "Wednesday",
  "House of the Dragon",
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getRecent(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveRecent(term: string) {
  if (!term.trim()) return;
  const prev = getRecent().filter(
    (s) => s.toLowerCase() !== term.toLowerCase(),
  );
  const next = [term, ...prev].slice(0, MAX_RECENT);
  localStorage.setItem(RECENT_KEY, JSON.stringify(next));
}

function removeRecent(term: string) {
  const next = getRecent().filter(
    (s) => s.toLowerCase() !== term.toLowerCase(),
  );
  localStorage.setItem(RECENT_KEY, JSON.stringify(next));
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface SearchModalProps {
  onClose: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SearchModal({ onClose }: SearchModalProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Drama[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [recent, setRecent] = useState<string[]>([]);

  // ── Boot ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    setRecent(getRecent());
    const id = setTimeout(() => inputRef.current?.focus(), 60);
    return () => clearTimeout(id);
  }, []);

  // ── Body scroll lock ──────────────────────────────────────────────────────
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // ── Keyboard: ESC closes, Ctrl+K toggles ─────────────────────────────────
  useEffect(() => {
    const handler = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
      // Ctrl+K or Cmd+K while already open → close
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        onClose();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  // ── Reset active index whenever results change ────────────────────────────
  useEffect(() => {
    setActiveIdx(-1);
  }, [results, query]);

  // ── Debounced search ─────────────────────────────────────────────────────
  const runSearch = useCallback(async (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) {
      setResults([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`);
      if (!res.ok) throw new Error("Search failed");
      const data: Drama[] = await res.json();
      setResults(data);
    } catch {
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);

    if (timerRef.current) clearTimeout(timerRef.current);

    if (!val.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    timerRef.current = setTimeout(() => runSearch(val), 380);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // ── Navigate to full search page ─────────────────────────────────────────
  const goToSearch = useCallback(
    (term: string) => {
      if (!term.trim()) return;
      saveRecent(term.trim());
      onClose();
      router.push(`/search?q=${encodeURIComponent(term.trim())}`);
    },
    [onClose, router],
  );

  // ── Click on a result ────────────────────────────────────────────────────
  const handleResultClick = (drama: Drama) => {
    saveRecent(drama.name || drama.title || "");
    setRecent(getRecent());
    onClose();
  };

  // ── Keyboard navigation inside the result list ────────────────────────────
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const total = results.length;

    if (e.key === "Enter") {
      e.preventDefault();
      if (activeIdx >= 0 && results[activeIdx]) {
        const d = results[activeIdx];
        handleResultClick(d);
        router.push(`/drama/${d.id}${d.media_type ? `?type=${d.media_type}` : ''}`);
      } else {
        goToSearch(query);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((prev) => (prev + 1) % total);
      scrollActiveIntoView();
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((prev) => (prev <= 0 ? total - 1 : prev - 1));
      scrollActiveIntoView();
      return;
    }
  };

  const scrollActiveIntoView = () => {
    requestAnimationFrame(() => {
      listRef.current
        ?.querySelector("[data-active='true']")
        ?.scrollIntoView({ block: "nearest" });
    });
  };

  // ── Delete a recent term ─────────────────────────────────────────────────
  const deleteRecent = (term: string) => {
    removeRecent(term);
    setRecent(getRecent());
  };

  // ─── Derived state ────────────────────────────────────────────────────────
  const hasQuery = query.trim().length > 0;
  const showRecent = !hasQuery && recent.length > 0;
  const showSuggestions = !hasQuery && recent.length === 0;

  // ─────────────────────────────────────────────────────────────────────────
  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      {/* Panel */}
      <div
        className="relative bg-[#1a1a1a] mx-4 sm:mx-auto mt-16 sm:mt-20 max-w-2xl rounded-2xl overflow-hidden shadow-2xl border border-white/5 animate-slide-down"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Search input row ───────────────────────────────────────────── */}
        <div className="flex items-center gap-3 px-4 py-3.5">
          <Search className="w-5 h-5 text-primary flex-shrink-0" />

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Search movies, TV shows…"
            className="flex-1 bg-transparent text-white placeholder-gray-500 text-base sm:text-lg outline-none border-none min-w-0"
            autoComplete="off"
            spellCheck={false}
            aria-label="Search dramas"
          />

          {/* Clear query */}
          {hasQuery && (
            <button
              onClick={() => {
                setQuery("");
                setResults([]);
                inputRef.current?.focus();
              }}
              className="flex items-center justify-center w-7 h-7 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Close modal */}
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0"
            aria-label="Close search"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="border-b border-white/8" />

        {/* ── Keyboard hint strip ────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-4 py-1.5 bg-[#161616]">
          <div className="flex items-center gap-3 text-[11px] text-gray-600">
            <span className="flex items-center gap-1">
              <kbd className="bg-[#222] border border-white/10 rounded px-1 py-0.5 font-mono text-[10px] text-gray-500">
                ↑
              </kbd>
              <kbd className="bg-[#222] border border-white/10 rounded px-1 py-0.5 font-mono text-[10px] text-gray-500">
                ↓
              </kbd>
              navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="bg-[#222] border border-white/10 rounded px-1.5 py-0.5 font-mono text-[10px] text-gray-500">
                ↵
              </kbd>
              select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="bg-[#222] border border-white/10 rounded px-1.5 py-0.5 font-mono text-[10px] text-gray-500">
                Esc
              </kbd>
              close
            </span>
          </div>

          <span className="text-[11px] text-gray-700">
            <kbd className="bg-[#222] border border-white/10 rounded px-1.5 py-0.5 font-mono text-[10px] text-gray-600">
              Ctrl K
            </kbd>{" "}
            to toggle
          </span>
        </div>

        <div className="border-b border-white/5" />

        {/* ── Scrollable body ────────────────────────────────────────────── */}
        <div
          ref={listRef}
          className="overflow-y-auto hide-scrollbar"
          style={{ maxHeight: "min(420px, 60vh)" }}
        >
          {/* Loading */}
          {isLoading && (
            <div className="flex items-center justify-center py-10">
              <div className="spinner-ring">
                {Array.from({ length: 8 }).map((_, i) => (
                  <span key={i} />
                ))}
              </div>
            </div>
          )}

          {/* Results */}
          {!isLoading && hasQuery && results.length > 0 && (
            <ul role="listbox" aria-label="Search results">
              {results.map((drama, idx) => {
                const posterUrl = drama.poster_path
                  ? `https://image.tmdb.org/t/p/w92${drama.poster_path}`
                  : null;
                const title = drama.name || drama.title || "Untitled";
                const year =
                  drama.first_air_date?.slice(0, 4) ||
                  drama.release_date?.slice(0, 4) ||
                  null;
                const country = drama.origin_country?.[0] ?? null;
                const isActive = idx === activeIdx;

                return (
                  <li key={drama.id} role="option" aria-selected={isActive}>
                    <Link
                      href={`/drama/${drama.id}${drama.media_type ? `?type=${drama.media_type}` : ''}`}
                      onClick={() => handleResultClick(drama)}
                      data-active={isActive}
                      className={`flex items-center gap-3 px-4 py-3 transition-colors group ${
                        isActive
                          ? "bg-primary/10 border-l-2 border-primary"
                          : "hover:bg-white/5 border-l-2 border-transparent"
                      }`}
                    >
                      {/* Poster */}
                      <div className="relative w-11 h-[66px] flex-shrink-0 rounded-lg overflow-hidden bg-[#222]">
                        {posterUrl ? (
                          <Image
                            src={posterUrl}
                            alt={title}
                            fill
                            sizes="44px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Search className="w-4 h-4 text-gray-600" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p
                          className={`font-semibold text-sm line-clamp-1 transition-colors ${
                            isActive
                              ? "text-primary"
                              : "text-white group-hover:text-primary"
                          }`}
                        >
                          {title}
                        </p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          {year && (
                            <span className="text-xs text-gray-500">
                              {year}
                            </span>
                          )}
                          {drama.vote_average > 0 && (
                            <span className="flex items-center gap-0.5 text-xs text-gray-400">
                              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                              {drama.vote_average.toFixed(1)}
                            </span>
                          )}
                          {country && (
                            <span className="text-[10px] font-bold text-primary/80 bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20">
                              {country}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Arrow hint */}
                      <ArrowRight
                        className={`w-4 h-4 flex-shrink-0 transition-all ${
                          isActive
                            ? "text-primary opacity-100"
                            : "text-gray-700 opacity-0 group-hover:opacity-100 group-hover:text-gray-500"
                        }`}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}

          {/* No results */}
          {!isLoading && hasQuery && results.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 gap-3 text-center px-6">
              <div className="w-14 h-14 rounded-full bg-[#222] flex items-center justify-center">
                <Search className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <p className="text-gray-300 font-semibold text-sm">
                  No results for &ldquo;{query}&rdquo;
                </p>
                <p className="text-gray-600 text-xs mt-1">
                  Try a different spelling or browse the Explore page.
                </p>
              </div>
              <Link
                href="/explore"
                onClick={onClose}
                className="text-xs text-primary hover:underline"
              >
                Browse all titles →
              </Link>
            </div>
          )}

          {/* Recent searches */}
          {!isLoading && showRecent && (
            <div className="py-2">
              <div className="flex items-center justify-between px-4 py-2">
                <span className="text-[11px] font-bold text-gray-600 uppercase tracking-widest flex items-center gap-1.5">
                  <Clock className="w-3 h-3" />
                  Recent
                </span>
                <button
                  onClick={() => {
                    localStorage.removeItem(RECENT_KEY);
                    setRecent([]);
                  }}
                  className="text-[11px] text-gray-600 hover:text-gray-400 transition-colors"
                >
                  Clear all
                </button>
              </div>
              {recent.map((term) => (
                <div
                  key={term}
                  className="flex items-center gap-2 px-4 py-2.5 hover:bg-white/5 group transition-colors"
                >
                  <Clock className="w-3.5 h-3.5 text-gray-600 flex-shrink-0" />
                  <button
                    className="flex-1 text-left text-sm text-gray-400 hover:text-white transition-colors truncate"
                    onClick={() => {
                      setQuery(term);
                      runSearch(term);
                    }}
                  >
                    {term}
                  </button>
                  <button
                    onClick={() => deleteRecent(term)}
                    className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-gray-300 transition-all flex-shrink-0"
                    aria-label={`Remove "${term}" from recent searches`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Trending suggestions (idle state) */}
          {!isLoading && showSuggestions && (
            <div className="py-2">
              <div className="px-4 py-2">
                <span className="text-[11px] font-bold text-gray-600 uppercase tracking-widest flex items-center gap-1.5">
                  <TrendingUp className="w-3 h-3" />
                  Trending
                </span>
              </div>
              <div className="px-4 pb-3 flex flex-wrap gap-2 mt-1">
                {TRENDING_SUGGESTIONS.map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setQuery(term);
                      runSearch(term);
                    }}
                    className="text-xs text-gray-400 bg-[#222] hover:bg-primary/15 hover:text-primary border border-white/5 hover:border-primary/30 px-3 py-1.5 rounded-full transition-all"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Footer: "View all results" ──────────────────────────────────── */}
        {hasQuery && results.length > 0 && !isLoading && (
          <>
            <div className="border-t border-white/5" />
            <div className="px-4 py-3 flex items-center justify-between">
              <p className="text-xs text-gray-600">
                Showing top{" "}
                <span className="text-gray-400 font-medium">
                  {results.length}
                </span>{" "}
                results
              </p>
              <button
                onClick={() => goToSearch(query)}
                className="flex items-center gap-1.5 text-xs text-primary hover:text-primary-light font-semibold transition-colors group"
              >
                View all results for &ldquo;{query}&rdquo;
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </>
        )}

        {/* Footer: Search page link when idle */}
        {!hasQuery && (
          <>
            <div className="border-t border-white/5" />
            <div className="px-4 py-3 flex items-center justify-between">
              <p className="text-xs text-gray-700">Powered by TMDB</p>
              <Link
                href="/search"
                onClick={onClose}
                className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-400 transition-colors"
              >
                Advanced search
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
