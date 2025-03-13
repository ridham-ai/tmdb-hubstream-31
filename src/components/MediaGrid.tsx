
import React from 'react';
import { Movie, TVShow } from '@/types/tmdb';
import MediaCard from './MediaCard';
import { cn } from '@/lib/utils';

interface MediaGridProps {
  items: (Movie | TVShow)[];
  mediaType: 'movie' | 'tv';
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
          {items.map((item, index) => (
            <MediaCard
              key={item.id}
              media={item}
              mediaType={mediaType}
              className="animate-scale-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default MediaGrid;
