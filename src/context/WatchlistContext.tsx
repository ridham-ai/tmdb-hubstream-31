
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Movie, TVShow } from '@/types/tmdb';

type WatchlistItem = {
  id: number;
  mediaType: 'movie' | 'tv';
  media: Movie | TVShow;
};

interface WatchlistContextType {
  watchlist: WatchlistItem[];
  addToWatchlist: (item: WatchlistItem) => void;
  removeFromWatchlist: (id: number, mediaType: 'movie' | 'tv') => void;
  isInWatchlist: (id: number, mediaType: 'movie' | 'tv') => boolean;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export const WatchlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(() => {
    const savedWatchlist = localStorage.getItem('watchlist');
    return savedWatchlist ? JSON.parse(savedWatchlist) : [];
  });

  useEffect(() => {
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const addToWatchlist = (item: WatchlistItem) => {
    setWatchlist(prev => {
      if (prev.some(i => i.id === item.id && i.mediaType === item.mediaType)) {
        return prev;
      }
      return [...prev, item];
    });
  };

  const removeFromWatchlist = (id: number, mediaType: 'movie' | 'tv') => {
    setWatchlist(prev => prev.filter(item => !(item.id === id && item.mediaType === mediaType)));
  };

  const isInWatchlist = (id: number, mediaType: 'movie' | 'tv') => {
    return watchlist.some(item => item.id === id && item.mediaType === mediaType);
  };

  return (
    <WatchlistContext.Provider value={{ watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist }}>
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (context === undefined) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
};
