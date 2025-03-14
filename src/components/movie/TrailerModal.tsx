
import React from 'react';
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
  if (!isTrailerOpen || !trailerKey) return null;
  
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-4xl">
        <div className="relative pb-[56.25%]">
          <iframe
            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
            title="Trailer"
            className="absolute inset-0 w-full h-full rounded-lg"
            allowFullScreen
          ></iframe>
        </div>
        <button
          onClick={() => setIsTrailerOpen(false)}
          className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
        >
          <X className="w-6 h-6" />
          <span className="sr-only">Close</span>
        </button>
      </div>
    </div>
  );
};

export default TrailerModal;
