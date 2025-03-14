
import React from 'react';
import { Heart, Share2, Play, Check } from 'lucide-react';
import { getPosterUrl } from '@/services/tmdbService';
import { MovieDetails } from '@/types/tmdb';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useWatchlist } from '@/context/WatchlistContext';

interface MoviePosterProps {
  movie: MovieDetails;
  handleWatchlistToggle: () => void;
  handleShare: () => void;
  inWatchlist: boolean;
}

const MoviePoster: React.FC<MoviePosterProps> = ({ 
  movie, 
  handleWatchlistToggle, 
  handleShare, 
  inWatchlist 
}) => {
  return (
    <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0 animate-fade-in">
      <div className="rounded-xl overflow-hidden shadow-lg hover-card">
        <img
          src={getPosterUrl(movie.poster_path)}
          alt={movie.title}
          className="w-full"
        />
      </div>
      
      <div className="mt-6 space-y-3">
        <button
          className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white py-3 px-4 rounded-lg transition-colors"
        >
          <Play className="w-5 h-5" />
          Watch Now
        </button>
        
        <div className="flex gap-3">
          <button
            onClick={handleWatchlistToggle}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-colors",
              inWatchlist 
                ? "bg-green-600/80 hover:bg-green-600 text-white" 
                : "bg-secondary/80 hover:bg-secondary text-foreground"
            )}
          >
            {inWatchlist ? <Check className="w-5 h-5" /> : <Heart className="w-5 h-5" />}
            {inWatchlist ? "In Watchlist" : "Add to Watchlist"}
          </button>
          
          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-2 bg-secondary/80 hover:bg-secondary text-foreground py-3 px-4 rounded-lg transition-colors"
          >
            <Share2 className="w-5 h-5" />
            <span className="sr-only md:not-sr-only">Share</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoviePoster;
