
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import MediaRow from '@/components/MediaRow';
import MovieHero from '@/components/movie/MovieHero';
import MoviePoster from '@/components/movie/MoviePoster';
import MovieInfo from '@/components/movie/MovieInfo';
import MovieCastCrew from '@/components/movie/MovieCastCrew';
import MovieDetailsComponent from '@/components/movie/MovieDetails';
import TrailerModal from '@/components/movie/TrailerModal';
import { 
  getMovieDetails, 
  getMovieCredits, 
  getSimilarMovies,
  getMovieVideos
} from '@/services/tmdbService';
import { useToast } from '@/hooks/use-toast';
import { useWatchlist } from '@/context/WatchlistContext';

const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const { toast } = useToast();
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  
  // Fetch movie details
  const { data: movie, isLoading: isLoadingMovie } = useQuery({
    queryKey: ['movieDetails', id],
    queryFn: () => getMovieDetails(id!),
    enabled: !!id,
  });
  
  // Fetch movie credits
  const { data: credits, isLoading: isLoadingCredits } = useQuery({
    queryKey: ['movieCredits', id],
    queryFn: () => getMovieCredits(id!),
    enabled: !!id,
  });
  
  // Fetch similar movies
  const { data: similarData, isLoading: isLoadingSimilar } = useQuery({
    queryKey: ['similarMovies', id],
    queryFn: async () => {
      const data = await getSimilarMovies(id!);
      return data.results;
    },
    enabled: !!id,
  });
  
  // Fetch videos
  const { data: videosData } = useQuery({
    queryKey: ['movieVideos', id],
    queryFn: () => getMovieVideos(id!),
    enabled: !!id,
  });
  
  // Watch for video data changes and set trailer key
  useEffect(() => {
    if (videosData?.results) {
      const trailer = videosData.results.find(
        (video) => video.type === 'Trailer' && video.site === 'YouTube'
      );
      if (trailer) {
        setTrailerKey(trailer.key);
      }
    }
  }, [videosData]);
  
  // Check if movie is in watchlist
  const inWatchlist = movie ? isInWatchlist(movie.id, 'movie') : false;
  
  // Format runtime
  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Get director
  const director = credits?.crew.find(person => person.job === 'Director');
  
  // Get cast
  const cast = credits?.cast.slice(0, 10) || [];
  
  // Handle watchlist toggle
  const handleWatchlistToggle = () => {
    if (!movie) return;
    
    if (inWatchlist) {
      removeFromWatchlist(movie.id, 'movie');
      toast({
        title: "Removed from Watchlist",
        description: `${movie.title} has been removed from your watchlist.`,
        duration: 3000,
      });
    } else {
      addToWatchlist({
        id: movie.id,
        mediaType: 'movie',
        media: movie,
      });
      toast({
        title: "Added to Watchlist",
        description: `${movie.title} has been added to your watchlist.`,
        duration: 3000,
      });
    }
  };
  
  // Handle share
  const handleShare = () => {
    if (!movie) return;
    
    if (navigator.share) {
      navigator.share({
        title: movie.title,
        text: movie.overview,
        url: window.location.href,
      }).catch((error) => console.log('Error sharing', error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Movie link copied to clipboard.",
        duration: 3000,
      });
    }
  };
  
  if (isLoadingMovie) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[70vh]">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }
  
  if (!movie) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold">Movie not found</h1>
          <Link to="/" className="text-primary hover:underline mt-4 inline-block">
            Return to home
          </Link>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <MovieHero movie={movie} />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster with Action Buttons */}
          <MoviePoster 
            movie={movie} 
            handleWatchlistToggle={handleWatchlistToggle} 
            handleShare={handleShare} 
            inWatchlist={inWatchlist}
          />
          
          {/* Movie Info Section */}
          <div className="flex-1">
            <MovieInfo 
              movie={movie} 
              trailerKey={trailerKey} 
              formatDate={formatDate} 
              formatRuntime={formatRuntime} 
              setIsTrailerOpen={setIsTrailerOpen}
            />
            
            <MovieCastCrew 
              director={director} 
              cast={cast} 
              isLoadingCredits={isLoadingCredits}
            />
            
            <MovieDetailsComponent movie={movie} />
          </div>
        </div>
        
        {/* Similar Movies */}
        {similarData && similarData.length > 0 && (
          <div className="mt-12">
            <MediaRow
              title="Similar Movies"
              items={similarData}
              mediaType="movie"
              isLoading={isLoadingSimilar}
            />
          </div>
        )}
      </div>
      
      {/* Trailer Modal */}
      <TrailerModal 
        isTrailerOpen={isTrailerOpen} 
        trailerKey={trailerKey} 
        setIsTrailerOpen={setIsTrailerOpen}
      />
    </Layout>
  );
};

export default MovieDetails;
