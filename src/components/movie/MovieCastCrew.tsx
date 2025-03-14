
import React from 'react';
import { getProfileUrl } from '@/services/tmdbService';
import { Credit } from '@/types/tmdb';

interface MovieCastCrewProps {
  director: Credit | undefined;
  cast: Credit[];
  isLoadingCredits: boolean;
}

const MovieCastCrew: React.FC<MovieCastCrewProps> = ({ 
  director, 
  cast, 
  isLoadingCredits 
}) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Cast & Crew</h2>
      
      {director && (
        <div className="mb-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Director</h3>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-secondary/50">
              <img 
                src={getProfileUrl(director.profile_path)} 
                alt={director.name}
                className="w-full h-full object-cover"
              />
            </div>
            <span>{director.name}</span>
          </div>
        </div>
      )}
      
      {/* Cast */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Cast</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {isLoadingCredits ? (
            Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="animate-pulse flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary/50"></div>
                <div className="h-4 bg-secondary/50 rounded w-24"></div>
              </div>
            ))
          ) : (
            cast.map((person) => (
              <div key={person.id} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-secondary/50">
                  <img 
                    src={getProfileUrl(person.profile_path)} 
                    alt={person.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-medium">{person.name}</div>
                  {person.character && (
                    <div className="text-xs text-muted-foreground">{person.character}</div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieCastCrew;
