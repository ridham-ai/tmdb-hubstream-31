
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import MediaGrid from '@/components/MediaGrid';
import { getPopularTVShows, getTopRatedTVShows, getOnTheAirTVShows } from '@/services/tmdbService';
import { cn } from '@/lib/utils';

const TVShows: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'popular' | 'top-rated' | 'on-the-air'>('popular');
  
  // Fetch TV shows based on active category
  const { data: popularTVShows, isLoading: isLoadingPopular } = useQuery({
    queryKey: ['popularTVShows'],
    queryFn: async () => {
      const data = await getPopularTVShows();
      return data.results;
    },
    enabled: activeCategory === 'popular',
  });
  
  const { data: topRatedTVShows, isLoading: isLoadingTopRated } = useQuery({
    queryKey: ['topRatedTVShows'],
    queryFn: async () => {
      const data = await getTopRatedTVShows();
      return data.results;
    },
    enabled: activeCategory === 'top-rated',
  });
  
  const { data: onTheAirTVShows, isLoading: isLoadingOnTheAir } = useQuery({
    queryKey: ['onTheAirTVShows'],
    queryFn: async () => {
      const data = await getOnTheAirTVShows();
      return data.results;
    },
    enabled: activeCategory === 'on-the-air',
  });
  
  // Get current data and loading state based on active category
  const getCurrentData = () => {
    switch (activeCategory) {
      case 'popular':
        return { data: popularTVShows, isLoading: isLoadingPopular };
      case 'top-rated':
        return { data: topRatedTVShows, isLoading: isLoadingTopRated };
      case 'on-the-air':
        return { data: onTheAirTVShows, isLoading: isLoadingOnTheAir };
      default:
        return { data: popularTVShows, isLoading: isLoadingPopular };
    }
  };
  
  const { data, isLoading } = getCurrentData();
  
  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold animate-fade-in">TV Shows</h1>
          
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
              onClick={() => setActiveCategory('on-the-air')}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                activeCategory === 'on-the-air'
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary/50 hover:bg-secondary/70"
              )}
            >
              Currently Airing
            </button>
          </div>
        </div>
        
        <MediaGrid
          items={data || []}
          mediaType="tv"
          isLoading={isLoading}
        />
      </div>
    </Layout>
  );
};

export default TVShows;
