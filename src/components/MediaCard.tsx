import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, CalendarDays, Play, Plus, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Movie, TVShow } from '@/types/tmdb';
import { getPosterUrl } from '@/services/tmdbService';
import { useToast } from '@/hooks/use-toast';
import { useWatchlist } from '@/context/WatchlistContext';

interface MediaCardProps {
  media: Movie | TVShow;
  mediaType: 'movie' | 'tv';
  className?: string;
  style?: React.CSSProperties;
}

const MediaCard: React.FC<MediaCardProps> = ({ media, mediaType, className, style }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { toast } = useToast();
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();

  const title = 'title' in media ? media.title : media.name;
  const releaseDate = 'release_date' in media ? media.release_date : media.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : '';
  
  const inWatchlist = isInWatchlist(media.id, mediaType);
  
  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (inWatchlist) {
      removeFromWatchlist(media.id, mediaType);
      toast({
        title: "Removed from Watchlist",
        description: `${title} has been removed from your watchlist.`,
        duration: 3000,
      });
    } else {
      addToWatchlist({
        id: media.id,
        mediaType,
        media,
      });
      toast({
        title: "Added to Watchlist",
        description: `${title} has been added to your watchlist.`,
        duration: 3000,
      });
    }
  };

  return (
    <Link
      to={`/${mediaType}/${media.id}`}
      className={cn(
        "group relative overflow-hidden rounded-xl transition-all duration-300",
        "hover:shadow-xl hover:shadow-primary/10",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        isHovered ? "scale-[1.02] z-10" : "scale-100 z-0",
        className
      )}
      style={style}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="aspect-[2/3] w-full overflow-hidden rounded-xl bg-muted/20">
        <div className={cn(
          "image-reveal h-full w-full",
          isLoaded ? "opacity-100" : "opacity-0"
        )}>
          <img
            src={getPosterUrl(media.poster_path)}
            alt={title}
            className={cn(
              "h-full w-full object-cover transition-all duration-500",
              "group-hover:scale-105"
            )}
            onLoad={() => setIsLoaded(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/20 animate-pulse">
            <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          </div>
        )}
      </div>
      
      <div className={cn(
        "absolute inset-0 flex flex-col justify-end p-3 text-white",
        "opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      )}>
        <div className="flex items-center space-x-2 mb-1">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="text-sm font-medium">{media.vote_average.toFixed(1)}</span>
          <span className="text-xs text-white/70">({media.vote_count})</span>
        </div>
        
        <h3 className="text-base font-medium line-clamp-1">{title}</h3>
        
        <div className="flex items-center mt-1 text-xs text-white/70 space-x-2">
          <CalendarDays className="w-3 h-3" />
          <span>{year}</span>
        </div>
        
        <div className="flex items-center justify-between mt-3 gap-2">
          <button 
            className="flex-1 flex items-center justify-center gap-1 bg-primary/90 hover:bg-primary text-white py-1.5 px-3 rounded-md text-sm font-medium transition-colors"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <Play className="w-3 h-3" />
            Watch
          </button>
          
          <button 
            className={cn(
              "flex items-center justify-center p-1.5 rounded-md backdrop-blur-sm transition-colors",
              inWatchlist ? "bg-green-500/30 hover:bg-green-500/40" : "bg-white/20 hover:bg-white/30"
            )}
            onClick={handleWatchlistToggle}
            aria-label={inWatchlist ? "Remove from watchlist" : "Add to watchlist"}
          >
            {inWatchlist ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default MediaCard;
