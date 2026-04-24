import { Metadata } from "next";
import Link from "next/link";
import clsx from "clsx";
import { discoverDramas, SortOption, getTVGenres, getMovieGenres, TMDBGenre } from "@/lib/tmdb";
import DramaCard from "@/components/DramaCard";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ExplorePageProps {
  searchParams: Promise<{
    country?: string;
    genre?: string;
    sort?: string;
    page?: string;
    type?: string;
  }>;
}

// ─── Static filter configs ────────────────────────────────────────────────────

const TYPE_FILTERS = [
  { label: "Movies", type: "movie" as const, href: "/explore?type=movie" },
  { label: "TV Shows", type: "tv" as const, href: "/explore?type=tv" },
] as const;

const COUNTRY_FILTERS = [
  { label: "All Countries", country: "", genre: "", type: "movie" as const, href: "/explore?type=movie" },
  { label: "US Series", country: "US", genre: "", type: "tv" as const, href: "/explore?type=tv&country=US" },
  { label: "K-Drama", country: "KR", genre: "", type: "tv" as const, href: "/explore?type=tv&country=KR" },
] as const;

const SORT_OPTIONS: { label: string; value: SortOption; param: string }[] = [
  { label: "Popular", value: "popularity.desc", param: "popular" },
  { label: "Latest", value: "first_air_date.desc", param: "latest" },
  { label: "Top Rated", value: "vote_average.desc", param: "top_rated" },
];

function sortParamToValue(sort?: string): SortOption {
  switch (sort) {
    case "latest":
      return "first_air_date.desc";
    case "top_rated":
      return "vote_average.desc";
    default:
      return "popularity.desc";
  }
}

function buildFilterHref(
  base: string,
  overrides: Record<string, string | undefined>,
): string {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(overrides)) {
    if (v) params.set(k, v);
  }
  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

// ─── Metadata ────────────────────────────────────────────────────────────────

export async function generateMetadata({
  searchParams,
}: ExplorePageProps): Promise<Metadata> {
  const { country = "", sort = "", type = "tv" } = await searchParams;

  const typeLabel = type === "movie" ? "Movies" : "TV Shows";
  const countryLabel =
    COUNTRY_FILTERS.find((f) => f.country === country && f.type === type)?.label ??
    (type === "movie" ? "All Countries" : "US Series");
  const sortLabel =
    SORT_OPTIONS.find((o) => o.param === sort)?.label ?? "Popular";

  const title =
    country || sort
      ? `Explore ${countryLabel} · ${sortLabel}`
      : `Explore ${typeLabel}`;

  return {
    title,
    description:
      "Browse movies from all countries and US TV shows on MovFury. Filter by type and sort by popularity or release date.",
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const {
    country: currentCountry = "",
    genre: currentGenre = "",
    sort: currentSort = "",
    page: rawPage = "1",
    type: currentType = "tv",
  } = await searchParams;

  const currentPage = Math.max(1, Number(rawPage));

  /* Resolve effective genre */
  const effectiveGenre = currentGenre || "";

  /* Map sort param to TMDB sort_by value */
  const sortBy = sortParamToValue(currentSort);

  /* Min votes threshold */
  const minVotes = currentSort === "top_rated" ? 50 : 10;

  /* Fetch genres based on type */
  const genres = await (currentType === "movie" ? getMovieGenres() : getTVGenres()).catch(() => []);

  /* Fetch results based on type (tv or movie) */
  const { results, total_pages, total_results } = await discoverDramas({
    country: currentCountry || undefined,
    genre: effectiveGenre || undefined,
    sortBy,
    page: currentPage,
    minVotes,
    type: currentType === "movie" ? "movie" : "tv",
  }).catch(() => ({ results: [], total_pages: 1, total_results: 0 }));

  /* Active country filter */
  const activeCountry =
    COUNTRY_FILTERS.find(
      (f) => f.country === currentCountry && f.type === currentType,
    ) ?? COUNTRY_FILTERS[0];

  /* Helper — build sort href preserving current country/genre/type */
  const sortHref = (sortParam: string) =>
    buildFilterHref("/explore", {
      country: currentCountry || undefined,
      genre: currentGenre || undefined,
      type: currentType === "movie" ? "movie" : "tv",
      sort: sortParam,
      page: undefined,
    });

  /* Helper — page href */
  const pageHref = (p: number) =>
    buildFilterHref("/explore", {
      country: currentCountry || undefined,
      genre: currentGenre || undefined,
      type: currentType === "movie" ? "movie" : "tv",
      sort: currentSort || undefined,
      page: p > 1 ? String(p) : undefined,
    });

  const maxPage = Math.min(total_pages, 500);

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8">
      {/* ── Page Header ── */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          Explore{" "}
          {activeCountry.label !== "All Countries" && (
            <span className="gradient-text">{activeCountry.label}</span>
          )}
        </h1>
        {total_results > 0 && (
          <p className="text-gray-500 text-sm mt-1">
            {total_results.toLocaleString()} titles found
          </p>
        )}
      </div>

      {/* ── Type and Country Filter Bar (combined row) ── */}
      <div className="flex flex-wrap gap-2 mb-5 justify-between">
        {/* Type filters on left */}
        <div className="flex flex-wrap gap-2">
          {TYPE_FILTERS.map((f) => {
            const isActive = f.type === currentType;
            return (
              <Link
                key={f.href}
                href={f.href}
                className={clsx(
                  "px-4 py-2 rounded-full text-sm font-semibold transition-all border",
                  isActive
                    ? "bg-primary border-primary text-white shadow-md shadow-primary/25"
                    : "bg-surface border-border text-gray-400 hover:bg-surface-2 hover:text-white hover:border-gray-600",
                )}
              >
                {f.label}
              </Link>
            );
          })}
        </div>

        {/* Country filters on right */}
        <div className="flex flex-wrap gap-2">
          {COUNTRY_FILTERS.filter(f => f.type === currentType).map((f) => {
            const isActive = f.country === currentCountry;
            return (
              <Link
                key={f.href}
                href={f.href}
                className={clsx(
                  "px-4 py-2 rounded-full text-sm font-semibold transition-all border",
                  isActive
                    ? "bg-primary/15 border-primary/30 text-primary"
                    : "bg-surface border-border text-gray-400 hover:bg-surface-2 hover:text-white hover:border-gray-600",
                )}
              >
                {f.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── Sort Bar ── */}
      <div className="flex items-center gap-3 mb-7 border-b border-border pb-4">
        <span className="text-xs text-gray-600 font-medium uppercase tracking-widest flex-shrink-0">
          Sort by
        </span>
        <div className="flex gap-1 flex-wrap">
          {SORT_OPTIONS.map((opt) => {
            const isActive =
              currentSort === opt.param ||
              (!currentSort && opt.param === "popular");
            return (
              <Link
                key={opt.param}
                href={sortHref(opt.param)}
                className={clsx(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border",
                  isActive
                    ? "bg-primary/15 border-primary/30 text-primary"
                    : "bg-transparent border-transparent text-gray-500 hover:text-gray-300 hover:bg-surface",
                )}
              >
                {opt.label}
              </Link>
            );
          })}
        </div>

        {total_pages > 1 && (
          <span className="ml-auto text-xs text-gray-600 flex-shrink-0">
            Page {currentPage} of {maxPage}
          </span>
        )}
      </div>

      {/* ── Genre Filter Bar ── */}
      {genres.length > 0 && (
        <div className="mb-7 border-b border-border pb-4">
          <span className="text-xs text-gray-600 font-medium uppercase tracking-widest flex-shrink-0 mb-3 block">
            Genres
          </span>
          <div className="flex gap-2 flex-wrap">
            <Link
              href={buildFilterHref("/explore", {
                country: currentCountry || undefined,
                type: currentType === "movie" ? "movie" : "tv",
                sort: currentSort || undefined,
                genre: undefined,
              })}
              className={clsx(
                "px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border",
                !currentGenre
                  ? "bg-primary/15 border-primary/30 text-primary"
                  : "bg-transparent border-transparent text-gray-500 hover:text-gray-300 hover:bg-surface",
              )}
            >
              All
            </Link>
            {genres.map((genre) => {
              const isActive = currentGenre === String(genre.id);
              return (
                <Link
                  key={genre.id}
                  href={buildFilterHref("/explore", {
                    country: currentCountry || undefined,
                    type: currentType === "movie" ? "movie" : "tv",
                    sort: currentSort || undefined,
                    genre: String(genre.id),
                  })}
                  className={clsx(
                    "px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border",
                    isActive
                      ? "bg-primary/15 border-primary/30 text-primary"
                      : "bg-transparent border-transparent text-gray-500 hover:text-gray-300 hover:bg-surface",
                  )}
                >
                  {genre.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Results Grid ── */}
      {results.length > 0 ? (
        <>
          <div className="flex flex-wrap gap-4 justify-center">
            {results.map((drama) => (
              <DramaCard key={drama.id} drama={drama} showBadge />
            ))}
          </div>

          {/* ── Pagination ── */}
          {total_pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10 flex-wrap">
              {/* Previous */}
              {currentPage > 1 ? (
                <Link
                  href={pageHref(currentPage - 1)}
                  className="flex items-center gap-1.5 bg-surface hover:bg-surface-2 border border-border text-gray-400 hover:text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  ← Prev
                </Link>
              ) : (
                <span className="flex items-center gap-1.5 bg-surface/50 border border-border/50 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg cursor-not-allowed select-none">
                  ← Prev
                </span>
              )}

              {/* Page number buttons with ellipsis */}
              {(() => {
                const pages: (number | "...")[] = [];

                if (maxPage <= 7) {
                  for (let i = 1; i <= maxPage; i++) pages.push(i);
                } else {
                  pages.push(1);
                  if (currentPage > 3) pages.push("...");
                  for (
                    let i = Math.max(2, currentPage - 1);
                    i <= Math.min(maxPage - 1, currentPage + 1);
                    i++
                  ) {
                    pages.push(i);
                  }
                  if (currentPage < maxPage - 2) pages.push("...");
                  pages.push(maxPage);
                }

                return pages.map((p, idx) =>
                  p === "..." ? (
                    <span
                      key={`ellipsis-${idx}`}
                      className="text-gray-600 text-sm px-1 select-none"
                    >
                      &hellip;
                    </span>
                  ) : (
                    <Link
                      key={p}
                      href={pageHref(p)}
                      className={clsx(
                        "min-w-[40px] text-center text-sm font-semibold px-3 py-2 rounded-lg border transition-colors",
                        p === currentPage
                          ? "bg-primary border-primary text-white shadow-sm shadow-primary/25"
                          : "bg-surface border-border text-gray-400 hover:bg-surface-2 hover:text-white hover:border-gray-600",
                      )}
                    >
                      {p}
                    </Link>
                  ),
                );
              })()}

              {/* Next */}
              {currentPage < maxPage ? (
                <Link
                  href={pageHref(currentPage + 1)}
                  className="flex items-center gap-1.5 bg-surface hover:bg-surface-2 border border-border text-gray-400 hover:text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  Next →
                </Link>
              ) : (
                <span className="flex items-center gap-1.5 bg-surface/50 border border-border/50 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg cursor-not-allowed select-none">
                  Next →
                </span>
              )}
            </div>
          )}
        </>
      ) : (
        /* ── Empty State ── */
        <div className="flex flex-col items-center justify-center text-center py-24 px-4">
          <div className="w-20 h-20 rounded-full bg-surface flex items-center justify-center mb-6">
            <svg
              className="w-9 h-9 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375z"
              />
            </svg>
          </div>
          <p className="text-gray-400 text-lg font-semibold mb-2">
            No titles found
          </p>
          <p className="text-gray-600 text-sm mb-8 max-w-xs">
            Try a different filter combination or browse all titles.
          </p>
          <Link
            href="/explore"
            className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg text-sm font-bold transition-colors"
          >
            Browse All Titles
          </Link>
        </div>
      )}
    </div>
  );
}
