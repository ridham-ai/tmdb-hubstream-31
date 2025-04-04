
import React from 'react';
import { Calendar, Clock, Star, PlayCircle } from 'lucide-react';
import { MovieDetails } from '@/types/tmdb';
import { Card, CardContent } from '@/components/ui/card';

interface MovieInfoProps {
  movie: MovieDetails;
  trailerKey: string | null;
  formatDate: (date: string) => string;
  formatRuntime: (minutes: number) => string;
  setIsTrailerOpen: (isOpen: boolean) => void;
}

const MovieInfo: React.FC<MovieInfoProps> = ({ 
  movie, 
  trailerKey, 
  formatDate, 
  formatRuntime, 
  setIsTrailerOpen 
}) => {
  return (
    <div className="animate-slide-up space-y-6">
      <div className="md:hidden">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{movie.title}</h1>
        
        {movie.tagline && (
          <p className="text-lg text-muted-foreground mb-4 italic">"{movie.tagline}"</p>
        )}
        
        {trailerKey && (
          <button
            onClick={() => setIsTrailerOpen(true)}
            className="flex items-center gap-2 text-primary hover:text-primary/80 mb-4 transition-colors"
          >
            <PlayCircle className="w-5 h-5" />
            Watch Trailer
          </button>
        )}
      </div>
      
      {/* Stats */}
      <Card className="bg-card/30 backdrop-blur-sm border-border/40">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {movie.release_date && (
              <div className="flex flex-col items-center text-center p-2">
                <Calendar className="w-6 h-6 text-primary mb-1" />
                <span className="text-sm text-muted-foreground">Release Date</span>
                <span className="font-medium">{formatDate(movie.release_date)}</span>
              </div>
            )}
            
            {movie.runtime > 0 && (
              <div className="flex flex-col items-center text-center p-2">
                <Clock className="w-6 h-6 text-primary mb-1" />
                <span className="text-sm text-muted-foreground">Runtime</span>
                <span className="font-medium">{formatRuntime(movie.runtime)}</span>
              </div>
            )}
            
            {movie.vote_average > 0 && (
              <div className="flex flex-col items-center text-center p-2">
                <Star className="w-6 h-6 text-yellow-400 fill-yellow-400 mb-1" />
                <span className="text-sm text-muted-foreground">Rating</span>
                <span className="font-medium">
                  {movie.vote_average.toFixed(1)}<span className="text-muted-foreground text-xs ml-1">({movie.vote_count.toLocaleString()})</span>
                </span>
              </div>
            )}
            
            {movie.status && (
              <div className="flex flex-col items-center text-center p-2">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-1">
                  <span className="text-xs font-bold">S</span>
                </div>
                <span className="text-sm text-muted-foreground">Status</span>
                <span className="font-medium">{movie.status}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Genres */}
      {movie.genres && movie.genres.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {movie.genres.map((genre) => (
            <span 
              key={genre.id}
              className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
            >
              {genre.name}
            </span>
          ))}
        </div>
      )}
      
      {/* Overview */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Overview</h2>
        <Card className="bg-card/30 backdrop-blur-sm border-border/40">
          <CardContent className="p-6">
            <p className="leading-relaxed">{movie.overview}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MovieInfo;
