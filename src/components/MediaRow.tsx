
import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Movie, TVShow } from '@/types/tmdb';
import MediaCard from './MediaCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MediaRowProps {
  title: string;
  items: (Movie | TVShow)[];
  mediaType: 'movie' | 'tv';
  viewAllLink?: string;
  isLoading?: boolean;
}

const MediaRow: React.FC<MediaRowProps> = ({
  title,
  items,
  mediaType,
  viewAllLink,
  isLoading = false,
}) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth * 0.75
        : scrollLeft + clientWidth * 0.75;
        
      rowRef.current.scrollTo({
        left: scrollTo,
        behavior: 'smooth'
      });
    }
  };

  const handleScroll = () => {
    if (rowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
      setShowLeftButton(scrollLeft > 20);
      setShowRightButton(scrollLeft < scrollWidth - clientWidth - 20);
    }
  };

  return (
    <section className="py-4 relative">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold animate-slide-up">{title}</h2>
        {viewAllLink && (
          <Link 
            to={viewAllLink}
            className="text-sm text-primary hover:text-primary/80 transition-colors"
          >
            View All
          </Link>
        )}
      </div>
      
      <div className="relative group">
        {/* Scroll buttons */}
        <button 
          className={cn(
            "absolute left-0 top-1/2 transform -translate-y-1/2 z-10",
            "bg-black/60 hover:bg-black/80 backdrop-blur-sm rounded-full p-2",
            "transition-all duration-300 focus:outline-none",
            showLeftButton ? "opacity-100" : "opacity-0 pointer-events-none",
            "-translate-x-1/2 sm:translate-x-0"
          )}
          onClick={() => scroll('left')}
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <button 
          className={cn(
            "absolute right-0 top-1/2 transform -translate-y-1/2 z-10",
            "bg-black/60 hover:bg-black/80 backdrop-blur-sm rounded-full p-2",
            "transition-all duration-300 focus:outline-none",
            showRightButton ? "opacity-100" : "opacity-0 pointer-events-none",
            "translate-x-1/2 sm:translate-x-0"
          )}
          onClick={() => scroll('right')}
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        
        {/* Media row */}
        <div 
          ref={rowRef}
          className="flex overflow-x-auto pb-4 scrollbar-hide space-x-4 scroll-smooth" 
          onScroll={handleScroll}
        >
          {isLoading ? (
            // Loading placeholders
            Array.from({ length: 10 }).map((_, index) => (
              <div 
                key={index}
                className="flex-shrink-0 w-[160px] sm:w-[180px] md:w-[200px] aspect-[2/3] rounded-xl bg-muted/20 animate-pulse"
                style={{ animationDelay: `${index * 0.05}s` }}
              />
            ))
          ) : (
            // Actual content
            items.map((item, index) => (
              <div 
                key={item.id} 
                className="flex-shrink-0 w-[160px] sm:w-[180px] md:w-[200px] animate-scale-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <MediaCard media={item} mediaType={mediaType} />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default MediaRow;
