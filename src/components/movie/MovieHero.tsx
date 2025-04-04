
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getBackdropUrl } from '@/services/tmdbService';
import { MovieDetails } from '@/types/tmdb';

interface MovieHeroProps {
  movie: MovieDetails;
  trailerKey: string | null;
  setIsTrailerOpen: (isOpen: boolean) => void;
  onWatchNow: () => void;
}

const MovieHero: React.FC<MovieHeroProps> = ({ 
  movie, 
  trailerKey, 
  setIsTrailerOpen,
  onWatchNow 
}) => {
  return (
    <div className="relative">
      {/* Backdrop image with overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
      
      <img 
        src={getBackdropUrl(movie.backdrop_path)} 
        alt={movie.title} 
        className="w-full h-[80vh] object-cover object-center"
      />
      
      {/* Back button */}
      <div className="absolute top-6 left-6 z-10">
        <Link 
          to="/"
          className="flex items-center gap-1 bg-black/50 backdrop-blur-sm hover:bg-black/70 p-3 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="sr-only">Back</span>
        </Link>
      </div>
      
      {/* Hero content */}
      <div className="absolute bottom-0 left-0 w-full p-8 pb-16 z-10">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row gap-8 items-end">
            <div className="w-full md:w-1/4 lg:w-1/5 hidden md:block">
              <div className="rounded-xl overflow-hidden shadow-lg transform -translate-y-16 hover:scale-105 transition-transform duration-300">
                <img 
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full"
                />
              </div>
            </div>
            
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white drop-shadow-lg">{movie.title}</h1>
              
              {movie.tagline && (
                <p className="text-lg text-white/80 mb-4 italic drop-shadow-md">"{movie.tagline}"</p>
              )}
              
              <div className="flex flex-wrap gap-3 mt-4">
                <button
                  onClick={onWatchNow}
                  className="bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-lg flex items-center gap-2 transition-colors"
                >
                  Watch Now
                </button>
                
                {trailerKey && (
                  <button
                    onClick={() => setIsTrailerOpen(true)}
                    className="border border-white/30 bg-black/30 backdrop-blur-sm hover:bg-black/50 text-white py-3 px-6 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    Watch Trailer
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieHero;
