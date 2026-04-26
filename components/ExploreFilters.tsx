'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import clsx from 'clsx';
import { ChevronDown, SlidersHorizontal, X, Grid3x3, List } from 'lucide-react';

interface Genre {
  id?: number;
  mal_id?: number;
  name: string;
}

interface ExploreFiltersProps {
  genres: Genre[];
  totalResults: number;
}

const MAIN_CATEGORIES = [
  { value: 'movie', label: 'Movie' },
  { value: 'hollywood', label: 'Hollywood Series' },
  { value: 'kdrama', label: 'K-Drama' },
];

const TYPE_OPTIONS = [
  { value: 'movie', label: 'Movie' },
  { value: 'tv', label: 'TV' },
];

const SORT_OPTIONS = [
  { value: 'popularity', label: 'Popularity' },
  { value: 'release_date', label: 'Release Date' },
  { value: 'vote_average', label: 'Rating' },
  { value: 'vote_count', label: 'Vote Count' },
];

const YEAR_OPTIONS = ['2026','2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015'];

export default function ExploreFilters({ genres, totalResults }: ExploreFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Get current values from URL
  const currentCategory = searchParams.get('category') || 'movie';
  const currentType = searchParams.get('type') || 'movie';
  const currentGenre = searchParams.get('genre') || '';
  const currentSort = searchParams.get('sort') || 'popularity';
  const currentYear = searchParams.get('year') || '';

  const handleCategoryChange = (categoryValue: string, checked: boolean) => {
    if (checked) {
      let updates: Record<string, string | null> = { category: categoryValue };
      
      // Set appropriate defaults based on category
      switch (categoryValue) {
        case 'movie':
          updates = { ...updates, type: 'movie', country: null };
          break;
        case 'hollywood':
          updates = { ...updates, type: 'tv', country: 'US' };
          break;
        case 'kdrama':
          updates = { ...updates, type: 'tv', country: 'KR' };
          break;
      }
      
      router.push(`${pathname}?${createQueryString(updates)}`);
      setOpenDropdown(null);
    }
  };

  const createQueryString = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    return params.toString();
  };

  const handleTypeChange = (typeValue: string, checked: boolean) => {
    if (checked) {
      router.push(`${pathname}?${createQueryString({ type: typeValue })}`);
    }
  };

  const handleGenreChange = (genreId: string, checked: boolean) => {
    router.push(`${pathname}?${createQueryString({ genre: checked ? genreId : null })}`);
    setOpenDropdown(null);
  };

  const handleSortChange = (sortValue: string) => {
    router.push(`${pathname}?${createQueryString({ sort: sortValue })}`);
    setOpenDropdown(null);
  };

  const handleFilterChange = (key: string, value: string | null) => {
    router.push(`${pathname}?${createQueryString({ [key]: value })}`);
  };

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode);
    router.push(`${pathname}?${createQueryString({ view: mode })}`);
  };

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  // Close dropdown when clicking outside
  const handleDropdownBlur = (e: React.FocusEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setOpenDropdown(null);
    }
  };

  return (
    <div className="mb-6">
      {/* Top Bar with Search and Count */}
      <div className="flex items-center justify-between mb-4">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2.5 pl-10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <div className="text-sm text-gray-400">
          {totalResults.toLocaleString()} results
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Main Category Dropdown */}
        <div className="relative" onBlur={handleDropdownBlur} tabIndex={-1}>
          <button
            onClick={() => toggleDropdown('category')}
            className={clsx(
              "flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#1a1a1a] border text-sm font-medium transition-all",
              openDropdown === 'category'
                ? "border-primary text-white"
                : "border-[#2a2a2a] text-gray-400 hover:text-white hover:border-gray-600"
            )}
          >
            {MAIN_CATEGORIES.find(c => c.value === currentCategory)?.label || 'Category'}
            <ChevronDown className={clsx("w-4 h-4 transition-transform", openDropdown === 'category' && "rotate-180")} />
          </button>
          {openDropdown === 'category' && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg shadow-xl z-50 p-3">
              <div className="space-y-2">
                {MAIN_CATEGORIES.map((category) => (
                  <label key={category.value} className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={currentCategory === category.value}
                        onChange={(e) => handleCategoryChange(category.value, e.target.checked)}
                        className="peer sr-only"
                      />
                      <div className={clsx(
                        "w-4 h-4 rounded border transition-all",
                        currentCategory === category.value
                          ? "bg-primary border-primary"
                          : "bg-[#2a2a2a] border-[#3a3a3a] group-hover:border-gray-500"
                      )}>
                        {currentCategory === category.value && (
                          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <path d="M5 12l5 5L20 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className={clsx(
                      "text-sm transition-colors",
                      currentCategory === category.value ? "text-white" : "text-gray-400 group-hover:text-gray-300"
                    )}>
                      {category.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Type Dropdown */}
        <div className="relative" onBlur={handleDropdownBlur} tabIndex={-1}>
          <button
            onClick={() => toggleDropdown('type')}
            className={clsx(
              "flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#1a1a1a] border text-sm font-medium transition-all",
              openDropdown === 'type'
                ? "border-primary text-white"
                : "border-[#2a2a2a] text-gray-400 hover:text-white hover:border-gray-600"
            )}
          >
            Type
            <ChevronDown className={clsx("w-4 h-4 transition-transform", openDropdown === 'type' && "rotate-180")} />
          </button>
          {openDropdown === 'type' && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg shadow-xl z-50 p-3">
              <div className="space-y-2">
                {TYPE_OPTIONS.map((type) => (
                  <label key={type.value} className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={currentType === type.value}
                        onChange={(e) => handleTypeChange(type.value, e.target.checked)}
                        className="peer sr-only"
                      />
                      <div className={clsx(
                        "w-4 h-4 rounded border transition-all",
                        currentType === type.value
                          ? "bg-primary border-primary"
                          : "bg-[#2a2a2a] border-[#3a3a3a] group-hover:border-gray-500"
                      )}>
                        {currentType === type.value && (
                          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <path d="M5 12l5 5L20 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className={clsx(
                      "text-sm transition-colors",
                      currentType === type.value ? "text-white" : "text-gray-400 group-hover:text-gray-300"
                    )}>
                      {type.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Genre Dropdown */}
        <div className="relative" onBlur={handleDropdownBlur} tabIndex={-1}>
          <button
            onClick={() => toggleDropdown('genre')}
            className={clsx(
              "flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#1a1a1a] border text-sm font-medium transition-all",
              openDropdown === 'genre' || currentGenre
                ? "border-primary text-white"
                : "border-[#2a2a2a] text-gray-400 hover:text-white hover:border-gray-600"
            )}
          >
            Genre
            {currentGenre && (
              <span className="ml-1 px-1.5 py-0.5 bg-primary/20 text-primary text-xs rounded">
                1
              </span>
            )}
            <ChevronDown className={clsx("w-4 h-4 transition-transform", openDropdown === 'genre' && "rotate-180")} />
          </button>
          {openDropdown === 'genre' && (
            <div className="absolute top-full left-0 mt-2 w-[500px] bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg shadow-xl z-50 p-4">
              <div className="grid grid-cols-4 gap-3">
                {genres.map((genre) => {
                  const genreId = genre.id || genre.mal_id || 0;
                  const isActive = currentGenre === String(genreId);
                  return (
                    <label key={genreId} className="flex items-center gap-2 cursor-pointer group">
                      <div className="relative flex-shrink-0">
                        <input
                          type="checkbox"
                          checked={isActive}
                          onChange={(e) => handleGenreChange(String(genreId), e.target.checked)}
                          className="peer sr-only"
                        />
                        <div className={clsx(
                          "w-4 h-4 rounded border transition-all",
                          isActive
                            ? "bg-primary border-primary"
                            : "bg-[#2a2a2a] border-[#3a3a3a] group-hover:border-gray-500"
                        )}>
                          {isActive && (
                            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                              <path d="M5 12l5 5L20 7" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <span className={clsx(
                        "text-xs truncate transition-colors",
                        isActive ? "text-white" : "text-gray-400 group-hover:text-gray-300"
                      )}>
                        {genre.name}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="relative" onBlur={handleDropdownBlur} tabIndex={-1}>
          <button
            onClick={() => toggleDropdown('sort')}
            className={clsx(
              "flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#1a1a1a] border text-sm font-medium transition-all",
              openDropdown === 'sort'
                ? "border-primary text-white"
                : "border-[#2a2a2a] text-gray-400 hover:text-white hover:border-gray-600"
            )}
          >
            {SORT_OPTIONS.find(s => s.value === currentSort)?.label || 'Updated date'}
            <ChevronDown className={clsx("w-4 h-4 transition-transform", openDropdown === 'sort' && "rotate-180")} />
          </button>
          {openDropdown === 'sort' && (
            <div className="absolute top-full left-0 mt-2 w-56 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg shadow-xl z-50 p-3">
              <div className="space-y-1">
                {SORT_OPTIONS.map((sort) => (
                  <button
                    key={sort.value}
                    onClick={() => handleSortChange(sort.value)}
                    className={clsx(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm transition-all",
                      currentSort === sort.value
                        ? "bg-primary/15 text-primary"
                        : "text-gray-400 hover:bg-[#2a2a2a] hover:text-gray-300"
                    )}
                  >
                    <div className={clsx(
                      "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                      currentSort === sort.value
                        ? "border-primary"
                        : "border-[#3a3a3a]"
                    )}>
                      {currentSort === sort.value && (
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      )}
                    </div>
                    {sort.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* View Toggle */}
        <button
          onClick={() => handleViewModeChange(viewMode === 'grid' ? 'list' : 'grid')}
          className="p-2.5 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-gray-400 hover:text-white hover:border-gray-600 transition-all"
          title={viewMode === 'grid' ? 'Switch to list view' : 'Switch to grid view'}
        >
          {viewMode === 'grid' ? (
            <List className="w-5 h-5" />
          ) : (
            <Grid3x3 className="w-5 h-5" />
          )}
        </button>

        {/* Filter Button */}
        <button
          onClick={() => setShowFilterPanel(!showFilterPanel)}
          className={clsx(
            "flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all",
            showFilterPanel || currentYear
              ? "bg-primary text-white"
              : "bg-[#1a1a1a] border border-[#2a2a2a] text-gray-400 hover:text-white hover:border-gray-600"
          )}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filter
        </button>
      </div>

      {/* Filter Panel */}
      {showFilterPanel && (
        <div className="mt-4 p-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Additional Filters</h3>
            <button
              onClick={() => setShowFilterPanel(false)}
              className="p-1 rounded hover:bg-[#2a2a2a] text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Year */}
          <div>
            <label className="block text-xs text-gray-500 mb-2">Year</label>
            <select
              value={currentYear}
              onChange={(e) => handleFilterChange('year', e.target.value || null)}
              className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
            >
              <option value="">All Years</option>
              {YEAR_OPTIONS.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
