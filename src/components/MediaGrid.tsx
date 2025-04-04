
import React from 'react';
import { Movie, TVShow } from '@/types/tmdb';
import MediaCard from './MediaCard';
import { cn } from '@/lib/utils';

interface MediaGridProps {
  items: (Movie | TVShow)[];
  mediaType: 'movie' | 'tv' | 'mixed';
  className?: string;
  title?: string;
  isLoading?: boolean;
}

const MediaGrid: React.FC<MediaGridProps> = ({
  items,
  mediaType,
  className,
  title,
  isLoading = false,
}) => {
  return (
    <section className={cn("py-4", className)}>
      {title && (
        <h2 className="text-2xl font-semibold mb-4 animate-slide-up">{title}</h2>
      )}
      
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {Array.from({ length: 12 }).map((_, index) => (
            <div 
              key={index} 
              className="aspect-[2/3] rounded-xl bg-muted/20 animate-pulse"
              style={{ animationDelay: `${index * 0.05}s` }}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {items.map((item, index) => {
            // Determine media type: first use item's media_type if available, then fall back to the grid's mediaType
            // For 'mixed' mediaType, we need to detect if it's a movie or TV show
            const itemMediaType = 
              (item as any).media_type ? 
              (item as any).media_type : 
              mediaType === 'mixed' ? 
                ('title' in item ? 'movie' : 'tv') : 
                mediaType;
                
            return (
              <MediaCard
                key={item.id}
                media={item}
                mediaType={itemMediaType as 'movie' | 'tv'}
                className="animate-scale-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              />
            );
          })}
        </div>
      )}
    </section>
  );
};

export default MediaGrid;
