
import React from 'react';
import { cn } from '@/lib/utils';

interface Season {
  id: number;
  name: string;
  episode_count: number;
  poster_path: string | null;
  season_number: number;
  air_date: string;
}

interface TVSeasonSelectorProps {
  seasons: Season[];
  selectedSeason: number;
  onSelectSeason: (seasonNumber: number) => void;
}

const TVSeasonSelector: React.FC<TVSeasonSelectorProps> = ({ 
  seasons, 
  selectedSeason, 
  onSelectSeason 
}) => {
  if (!seasons || seasons.length === 0) return null;
  
  // Filter out season 0 (usually specials)
  const validSeasons = seasons.filter(season => season.season_number > 0);
  
  return (
    <div className="mt-6">
      <h3 className="text-sm font-medium text-muted-foreground mb-2">Select Season</h3>
      <div className="grid grid-cols-4 gap-2">
        {validSeasons.map((season) => (
          <button
            key={season.id}
            onClick={() => onSelectSeason(season.season_number)}
            className={cn(
              "p-2 text-sm rounded-md transition-colors",
              selectedSeason === season.season_number
                ? "bg-primary text-white"
                : "bg-secondary/40 hover:bg-secondary/60"
            )}
          >
            {season.season_number}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TVSeasonSelector;
