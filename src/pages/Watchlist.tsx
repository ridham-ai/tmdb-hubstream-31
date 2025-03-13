
import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import Layout from '@/components/Layout';
import MediaGrid from '@/components/MediaGrid';
import { useWatchlist } from '@/context/WatchlistContext';
import { cn } from '@/lib/utils';

const Watchlist: React.FC = () => {
  const { watchlist } = useWatchlist();
  const [activeFilter, setActiveFilter] = useState<'all' | 'movies' | 'tv'>('all');
  
  const filteredWatchlist = watchlist.filter(item => {
    if (activeFilter === 'all') return true;
    return item.mediaType === (activeFilter === 'movies' ? 'movie' : 'tv');
  });
  
  const movieItems = filteredWatchlist.filter(item => item.mediaType === 'movie').map(item => item.media);
  const tvItems = filteredWatchlist.filter(item => item.mediaType === 'tv').map(item => item.media);
  
  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold animate-fade-in">My Watchlist</h1>
          
          <div className="flex flex-wrap gap-2 animate-fade-in">
            <button
              onClick={() => setActiveFilter('all')}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                activeFilter === 'all'
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary/50 hover:bg-secondary/70"
              )}
            >
              All ({watchlist.length})
            </button>
            
            <button
              onClick={() => setActiveFilter('movies')}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                activeFilter === 'movies'
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary/50 hover:bg-secondary/70"
              )}
            >
              Movies ({movieItems.length})
            </button>
            
            <button
              onClick={() => setActiveFilter('tv')}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                activeFilter === 'tv'
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary/50 hover:bg-secondary/70"
              )}
            >
              TV Shows ({tvItems.length})
            </button>
          </div>
        </div>
        
        {watchlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-secondary/50 rounded-full flex items-center justify-center mb-4">
              <Heart className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Your watchlist is empty</h2>
            <p className="text-muted-foreground max-w-md">
              Add movies and TV shows to your watchlist to keep track of what you want to watch.
            </p>
          </div>
        ) : (
          <>
            {activeFilter !== 'tv' && movieItems.length > 0 && (
              <MediaGrid
                title={activeFilter === 'all' ? "Movies" : undefined}
                items={movieItems}
                mediaType="movie"
                className="mb-8"
              />
            )}
            
            {activeFilter !== 'movies' && tvItems.length > 0 && (
              <MediaGrid
                title={activeFilter === 'all' ? "TV Shows" : undefined}
                items={tvItems}
                mediaType="tv"
              />
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Watchlist;
