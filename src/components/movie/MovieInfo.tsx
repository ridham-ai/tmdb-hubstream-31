
import React from 'react';
import { Calendar, Clock, Star, Play } from 'lucide-react';
import { MovieDetails } from '@/types/tmdb';

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
    <div className="animate-slide-up">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">{movie.title}</h1>
      
      {movie.tagline && (
        <p className="text-lg text-muted-foreground mb-4 italic">"{movie.tagline}"</p>
      )}
      
      {trailerKey && (
        <button
          onClick={() => setIsTrailerOpen(true)}
          className="flex items-center gap-2 text-primary hover:text-primary/80 mb-4 transition-colors"
        >
          <Play className="w-4 h-4" />
          Watch Trailer
        </button>
      )}
      
      {/* Stats */}
      <div className="flex flex-wrap gap-x-6 gap-y-2 mb-6">
        {movie.release_date && (
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span>{formatDate(movie.release_date)}</span>
          </div>
        )}
        
        {movie.runtime > 0 && (
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span>{formatRuntime(movie.runtime)}</span>
          </div>
        )}
        
        {movie.vote_average > 0 && (
          <div className="flex items-center gap-1.5">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span>
              {movie.vote_average.toFixed(1)}
              <span className="text-muted-foreground ml-1">({movie.vote_count.toLocaleString()})</span>
            </span>
          </div>
        )}
      </div>
      
      {/* Genres */}
      {movie.genres && movie.genres.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {movie.genres.map((genre) => (
            <span 
              key={genre.id}
              className="px-3 py-1 bg-secondary/50 text-secondary-foreground rounded-full text-sm"
            >
              {genre.name}
            </span>
          ))}
        </div>
      )}
      
      {/* Overview */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Overview</h2>
        <p className="leading-relaxed">{movie.overview}</p>
      </div>
    </div>
  );
};

export default MovieInfo;
