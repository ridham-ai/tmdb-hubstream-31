
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import HeroSection from '@/components/HeroSection';
import MediaRow from '@/components/MediaRow';
import { 
  getTrendingMovies, 
  getPopularMovies, 
  getTopRatedMovies,
  getUpcomingMovies,
  getPopularTVShows,
  getTopRatedTVShows
} from '@/services/tmdbService';
import { Movie, TVShow } from '@/types/tmdb';

const Index: React.FC = () => {
  const { data: trendingMovies, isLoading: trendingLoading } = useQuery({
    queryKey: ['trendingMovies'],
    queryFn: async () => {
      const data = await getTrendingMovies();
      return data.results;
    }
  });

  const { data: popularMovies, isLoading: popularMoviesLoading } = useQuery({
    queryKey: ['popularMovies'],
    queryFn: async () => {
      const data = await getPopularMovies();
      return data.results;
    }
  });

  const { data: topRatedMovies, isLoading: topRatedMoviesLoading } = useQuery({
    queryKey: ['topRatedMovies'],
    queryFn: async () => {
      const data = await getTopRatedMovies();
      return data.results;
    }
  });

  const { data: upcomingMovies, isLoading: upcomingMoviesLoading } = useQuery({
    queryKey: ['upcomingMovies'],
    queryFn: async () => {
      const data = await getUpcomingMovies();
      return data.results;
    }
  });

  const { data: popularTVShows, isLoading: popularTVLoading } = useQuery({
    queryKey: ['popularTVShows'],
    queryFn: async () => {
      const data = await getPopularTVShows();
      return data.results;
    }
  });

  const { data: topRatedTVShows, isLoading: topRatedTVLoading } = useQuery({
    queryKey: ['topRatedTVShows'],
    queryFn: async () => {
      const data = await getTopRatedTVShows();
      return data.results;
    }
  });

  return (
    <Layout>
      {/* Hero Section */}
      {!trendingLoading && trendingMovies && trendingMovies.length > 0 && (
        <HeroSection items={trendingMovies.slice(0, 5)} mediaType="movie" />
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Popular Movies */}
        <MediaRow
          title="Popular Movies"
          items={popularMovies || []}
          mediaType="movie"
          viewAllLink="/movies"
          isLoading={popularMoviesLoading}
        />

        {/* Top Rated Movies */}
        <MediaRow
          title="Top Rated Movies"
          items={topRatedMovies || []}
          mediaType="movie"
          viewAllLink="/movies/top-rated"
          isLoading={topRatedMoviesLoading}
        />

        {/* Popular TV Shows */}
        <MediaRow
          title="Popular TV Shows"
          items={popularTVShows || []}
          mediaType="tv"
          viewAllLink="/tv"
          isLoading={popularTVLoading}
        />

        {/* Top Rated TV Shows */}
        <MediaRow
          title="Top Rated TV Shows"
          items={topRatedTVShows || []}
          mediaType="tv"
          viewAllLink="/tv/top-rated"
          isLoading={topRatedTVLoading}
        />

        {/* Upcoming Movies */}
        <MediaRow
          title="Coming Soon"
          items={upcomingMovies || []}
          mediaType="movie"
          viewAllLink="/movies/upcoming"
          isLoading={upcomingMoviesLoading}
        />
      </div>
    </Layout>
  );
};

export default Index;
