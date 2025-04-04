
import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface TrailerModalProps {
  isTrailerOpen: boolean;
  trailerKey: string | null;
  setIsTrailerOpen: (isOpen: boolean) => void;
}

const TrailerModal: React.FC<TrailerModalProps> = ({ 
  isTrailerOpen, 
  trailerKey, 
  setIsTrailerOpen 
}) => {
  useEffect(() => {
    // Disable body scroll when modal is open
    if (isTrailerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isTrailerOpen]);
  
  if (!isTrailerOpen || !trailerKey) return null;
  
  return (
    <div 
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={() => setIsTrailerOpen(false)}
    >
      <div 
        className="w-full max-w-5xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative pb-[56.25%] rounded-xl overflow-hidden shadow-2xl">
          <iframe
            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
            title="Trailer"
            className="absolute inset-0 w-full h-full"
            allowFullScreen
          ></iframe>
        </div>
        <button
          onClick={() => setIsTrailerOpen(false)}
          className="absolute top-4 right-4 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full transition-colors"
        >
          <X className="w-6 h-6" />
          <span className="sr-only">Close</span>
        </button>
      </div>
    </div>
  );
};

export default TrailerModal;
