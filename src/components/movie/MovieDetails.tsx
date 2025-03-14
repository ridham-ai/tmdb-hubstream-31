
import React from 'react';
import { MovieDetails as MovieDetailsType } from '@/types/tmdb';

interface MovieDetailsProps {
  movie: MovieDetailsType;
}

const MovieDetailsComponent: React.FC<MovieDetailsProps> = ({ movie }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {movie.status && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Status</h3>
          <p>{movie.status}</p>
        </div>
      )}
      
      {movie.budget > 0 && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Budget</h3>
          <p>${movie.budget.toLocaleString()}</p>
        </div>
      )}
      
      {movie.revenue > 0 && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Revenue</h3>
          <p>${movie.revenue.toLocaleString()}</p>
        </div>
      )}
      
      {movie.production_companies && movie.production_companies.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Production</h3>
          <p>{movie.production_companies.map(company => company.name).join(', ')}</p>
        </div>
      )}
    </div>
  );
};

export default MovieDetailsComponent;
