
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import MediaGrid from '@/components/MediaGrid';
import { getPopularMovies, getTopRatedMovies, getUpcomingMovies, getNowPlayingMovies } from '@/services/tmdbService';
import { cn } from '@/lib/utils';

const Movies: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'popular' | 'top-rated' | 'now-playing' | 'upcoming'>('popular');
  
  // Fetch movies based on active category
  const { data: popularMovies, isLoading: isLoadingPopular } = useQuery({
    queryKey: ['popularMovies'],
    queryFn: async () => {
      const data = await getPopularMovies();
      return data.results;
    },
    enabled: activeCategory === 'popular',
  });
  
  const { data: topRatedMovies, isLoading: isLoadingTopRated } = useQuery({
    queryKey: ['topRatedMovies'],
    queryFn: async () => {
      const data = await getTopRatedMovies();
      return data.results;
    },
    enabled: activeCategory === 'top-rated',
  });
  
  const { data: nowPlayingMovies, isLoading: isLoadingNowPlaying } = useQuery({
    queryKey: ['nowPlayingMovies'],
    queryFn: async () => {
      const data = await getNowPlayingMovies();
      return data.results;
    },
    enabled: activeCategory === 'now-playing',
  });
  
  const { data: upcomingMovies, isLoading: isLoadingUpcoming } = useQuery({
    queryKey: ['upcomingMovies'],
    queryFn: async () => {
      const data = await getUpcomingMovies();
      return data.results;
    },
    enabled: activeCategory === 'upcoming',
  });
  
  // Get current data and loading state based on active category
  const getCurrentData = () => {
    switch (activeCategory) {
      case 'popular':
        return { data: popularMovies, isLoading: isLoadingPopular };
      case 'top-rated':
        return { data: topRatedMovies, isLoading: isLoadingTopRated };
      case 'now-playing':
        return { data: nowPlayingMovies, isLoading: isLoadingNowPlaying };
      case 'upcoming':
        return { data: upcomingMovies, isLoading: isLoadingUpcoming };
      default:
        return { data: popularMovies, isLoading: isLoadingPopular };
    }
  };
  
  const { data, isLoading } = getCurrentData();
  
  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold animate-fade-in">Movies</h1>
          
          <div className="flex flex-wrap gap-2 animate-fade-in">
            <button
              onClick={() => setActiveCategory('popular')}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                activeCategory === 'popular'
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary/50 hover:bg-secondary/70"
              )}
            >
              Popular
            </button>
            
            <button
              onClick={() => setActiveCategory('top-rated')}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                activeCategory === 'top-rated'
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary/50 hover:bg-secondary/70"
              )}
            >
              Top Rated
            </button>
            
            <button
              onClick={() => setActiveCategory('now-playing')}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                activeCategory === 'now-playing'
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary/50 hover:bg-secondary/70"
              )}
            >
              Now Playing
            </button>
            
            <button
              onClick={() => setActiveCategory('upcoming')}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                activeCategory === 'upcoming'
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary/50 hover:bg-secondary/70"
              )}
            >
              Coming Soon
            </button>
          </div>
        </div>
        
        <MediaGrid
          items={data || []}
          mediaType="movie"
          isLoading={isLoading}
        />
      </div>
    </Layout>
  );
};

export default Movies;
