
import React from 'react';
import { Heart, Share2, Check } from 'lucide-react';
import { getPosterUrl } from '@/services/tmdbService';
import { MovieDetails } from '@/types/tmdb';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface MoviePosterProps {
  movie: MovieDetails;
  handleWatchlistToggle: () => void;
  handleShare: () => void;
  inWatchlist: boolean;
  onWatchNow: () => void;
}

const MoviePoster: React.FC<MoviePosterProps> = ({ 
  movie, 
  handleWatchlistToggle, 
  handleShare, 
  inWatchlist,
  onWatchNow
}) => {
  return (
    <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0 animate-fade-in">
      <div className="md:hidden rounded-xl overflow-hidden shadow-lg hover-card mb-6">
        <img
          src={getPosterUrl(movie.poster_path)}
          alt={movie.title}
          className="w-full"
        />
      </div>
      
      <div className="space-y-6 backdrop-blur-sm bg-card/20 p-6 rounded-xl border border-border/40">
        <div className="hidden md:block rounded-xl overflow-hidden shadow-lg hover-card">
          <img
            src={getPosterUrl(movie.poster_path)}
            alt={movie.title}
            className="w-full"
          />
        </div>
        
        <div className="space-y-3">
          <Button
            onClick={onWatchNow}
            className="w-full bg-primary hover:bg-primary/90 text-white py-3 px-4 rounded-lg"
            variant="default"
            size="lg"
          >
            Watch Now
          </Button>
          
          <div className="flex gap-3">
            <Button
              onClick={handleWatchlistToggle}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-colors",
                inWatchlist 
                  ? "bg-green-600/80 hover:bg-green-600 text-white" 
                  : "bg-secondary/80 hover:bg-secondary text-foreground"
              )}
              variant={inWatchlist ? "default" : "secondary"}
            >
              {inWatchlist ? <Check className="w-5 h-5" /> : <Heart className="w-5 h-5" />}
              {inWatchlist ? "In Watchlist" : "Add to Watchlist"}
            </Button>
            
            <Button
              onClick={handleShare}
              className="flex items-center justify-center gap-2 bg-secondary/80 hover:bg-secondary text-foreground py-3 px-4 rounded-lg"
              variant="secondary"
            >
              <Share2 className="w-5 h-5" />
              <span className="sr-only md:not-sr-only">Share</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoviePoster;
