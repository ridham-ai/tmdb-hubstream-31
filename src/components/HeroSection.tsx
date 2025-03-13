
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Info, Star } from 'lucide-react';
import { Movie, TVShow } from '@/types/tmdb';
import { getBackdropUrl } from '@/services/tmdbService';
import { cn } from '@/lib/utils';

interface HeroSectionProps {
  items: (Movie | TVShow)[];
  mediaType: 'movie' | 'tv';
}

const HeroSection: React.FC<HeroSectionProps> = ({ items, mediaType }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const featured = items[currentIndex];
  const title = 'title' in featured ? featured.title : featured.name;
  const releaseDate = 'release_date' in featured ? featured.release_date : featured.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : '';

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
        setIsTransitioning(false);
      }, 500);
    }, 8000);

    return () => clearInterval(interval);
  }, [items.length]);

  return (
    <section className="relative h-[70vh] md:h-[80vh] w-full overflow-hidden">
      {/* Backdrop image */}
      <div 
        className={cn(
          "absolute inset-0 transition-opacity duration-1000",
          isTransitioning ? "opacity-0" : "opacity-100"
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-transparent" />
        
        <img 
          src={getBackdropUrl(featured.backdrop_path)} 
          alt={title}
          className="h-full w-full object-cover object-top"
        />
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 h-full flex items-center">
        <div className="max-w-2xl transition-all duration-500" style={{
          transform: isTransitioning ? 'translateY(20px)' : 'translateY(0)',
          opacity: isTransitioning ? 0 : 1
        }}>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4">{title}</h1>
          
          <div className="flex items-center space-x-3 mb-4">
            <div className="flex items-center bg-primary/30 backdrop-blur-sm rounded-full px-3 py-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
              <span className="text-sm font-medium">{featured.vote_average.toFixed(1)}</span>
            </div>
            <span className="text-sm font-medium text-muted-foreground">{year}</span>
          </div>
          
          <p className="text-base md:text-lg text-muted-foreground mb-6 line-clamp-3">
            {featured.overview}
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Link
              to={`/${mediaType}/${featured.id}`}
              className="glass-card-dark flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 hover:bg-primary text-white"
            >
              <Play className="w-5 h-5" />
              Watch Now
            </Link>
            
            <Link
              to={`/${mediaType}/${featured.id}`}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 font-medium text-white"
            >
              <Info className="w-5 h-5" />
              More Info
            </Link>
          </div>
        </div>
      </div>
      
      {/* Bottom indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {items.slice(0, 5).map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-12 h-1 rounded-full transition-all duration-300",
              currentIndex === index ? "bg-primary" : "bg-white/30"
            )}
            onClick={() => {
              setIsTransitioning(true);
              setTimeout(() => {
                setCurrentIndex(index);
                setIsTransitioning(false);
              }, 500);
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
