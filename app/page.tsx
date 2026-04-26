import { Metadata } from 'next';
import {
  getTrendingMovies,
  getLatestMovies,
  getTopMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  getLatestSeries,
  getTopUSSeries,
  getLatestKdramaSeries,
  getTopKdramaSeries,
  getUpcomingSeries,
} from '@/lib/tmdb';
import HeroBanner from '@/components/HeroBanner';
import DramaRow from '@/components/DramaRow';
import ContinueWatching from '@/components/ContinueWatching';

export const metadata: Metadata = {
  title: 'WatchFury — Watch Movies & Series Free',
  description:
    'Watch the latest movies from all countries and US series for free. No subscription required. Stream online in HD.',
};

export default async function HomePage() {
  const [heromovies, latestMovies, topMovies, topRatedMovies, upcomingMovies, latestSeries, usSeries, latestKdramaSeries, topKdramaSeries, upcomingSeries] =
    await Promise.all([
      getTrendingMovies().catch(() => []),
      getLatestMovies().catch(() => []),
      getTopMovies().catch(() => []),
      getTopRatedMovies().catch(() => []),
      getUpcomingMovies().catch(() => []),
      getLatestSeries().catch(() => []),
      getTopUSSeries().catch(() => []),
      getLatestKdramaSeries().catch(() => []),
      getTopKdramaSeries().catch(() => []),
      getUpcomingSeries().catch(() => []),
    ]);

  return (
    <>
      {/* Hero Banner Carousel */}
      <HeroBanner dramas={heromovies} />

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-4 py-6 space-y-2">
        <ContinueWatching />

        {/* Movie Rows */}
        <DramaRow
          title="Latest Movies"
          dramas={latestMovies}
          viewMoreHref="/explore?type=movie&sort=latest"
        />

        <DramaRow
          title="Top Movies"
          dramas={topMovies}
          viewMoreHref="/explore?type=movie&sort=popularity"
        />

        <DramaRow
          title="Top Rated Movies"
          dramas={topRatedMovies}
          viewMoreHref="/explore?type=movie&sort=rating"
        />

        <DramaRow
          title="Upcoming Movies"
          dramas={upcomingMovies}
          viewMoreHref="/explore?type=movie&sort=upcoming"
        />

        {/* Series Rows */}
        <DramaRow
          title="Latest Series"
          dramas={latestSeries}
          viewMoreHref="/explore?type=tv&sort=latest"
        />

        <DramaRow
          title="US Series"
          dramas={usSeries}
          viewMoreHref="/explore?type=tv&country=US"
        />

        <DramaRow
          title="Latest K-Drama"
          dramas={latestKdramaSeries}
          viewMoreHref="/explore?type=tv&country=KR&sort=latest"
        />

        <DramaRow
          title="K-Drama"
          dramas={topKdramaSeries}
          viewMoreHref="/explore?type=tv&country=KR"
        />

        <DramaRow
          title="Upcoming Series"
          dramas={upcomingSeries}
          viewMoreHref="/explore?type=tv&sort=upcoming"
        />
      </div>
    </>
  );
}
