
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getBackdropUrl } from '@/services/tmdbService';
import { MovieDetails } from '@/types/tmdb';

interface MovieHeroProps {
  movie: MovieDetails;
}

const MovieHero: React.FC<MovieHeroProps> = ({ movie }) => {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-transparent" />
      
      <img 
        src={getBackdropUrl(movie.backdrop_path)} 
        alt={movie.title} 
        className="w-full h-[70vh] object-cover object-top"
      />
      
      <div className="absolute top-4 left-4 z-10">
        <Link 
          to="/"
          className="flex items-center gap-1 bg-black/30 backdrop-blur-sm hover:bg-black/50 p-2 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="sr-only">Back</span>
        </Link>
      </div>
    </div>
  );
};

export default MovieHero;
