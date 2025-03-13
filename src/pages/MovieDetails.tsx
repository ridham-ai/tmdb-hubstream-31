import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Play, 
  Calendar, 
  Clock, 
  Star, 
  Heart, 
  Share2, 
  ArrowLeft,
  X
} from 'lucide-react';
import Layout from '@/components/Layout';
import MediaRow from '@/components/MediaRow';
import { 
  getMovieDetails, 
  getMovieCredits, 
  getSimilarMovies,
  getMovieVideos,
  getBackdropUrl,
  getPosterUrl,
  getProfileUrl
} from '@/services/tmdbService';
import { MovieDetails as MovieDetailsType, Credit } from '@/types/tmdb';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const { toast } = useToast();
  
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
  
  // Handle add to watchlist
  const handleAddToWatchlist = () => {
    toast({
      title: "Added to Watchlist",
      description: `${movie?.title} has been added to your watchlist.`,
      duration: 3000,
    });
  };
  
  // Handle share
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: movie?.title,
        text: movie?.overview,
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
      {/* Hero Section with Backdrop */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-transparent" />
        
        <img 
          src={getBackdropUrl(movie.backdrop_path)} 
          alt={movie.title} 
          className="w-full h-[70vh] object-cover object-top"
        />
        
        <div className="absolute top-4 left-4 z-10">
          <Link 
            to="/"
            className="flex items-center gap-1 bg-black/30 backdrop-blur-sm hover:bg-black/50 p-2 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="sr-only">Back</span>
          </Link>
        </div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0 animate-fade-in">
            <div className="rounded-xl overflow-hidden shadow-lg hover-card">
              <img
                src={getPosterUrl(movie.poster_path)}
                alt={movie.title}
                className="w-full"
              />
            </div>
            
            <div className="mt-6 space-y-3">
              <button
                onClick={() => trailerKey && setIsTrailerOpen(true)}
                disabled={!trailerKey}
                className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white py-3 px-4 rounded-lg transition-colors"
              >
                <Play className="w-5 h-5" />
                Watch Trailer
              </button>
              
              <div className="flex gap-3">
                <button
                  onClick={handleAddToWatchlist}
                  className="flex-1 flex items-center justify-center gap-2 bg-secondary/80 hover:bg-secondary text-foreground py-3 px-4 rounded-lg transition-colors"
                >
                  <Heart className="w-5 h-5" />
                  Watchlist
                </button>
                
                <button
                  onClick={handleShare}
                  className="flex items-center justify-center gap-2 bg-secondary/80 hover:bg-secondary text-foreground py-3 px-4 rounded-lg transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                  <span className="sr-only md:not-sr-only">Share</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Details */}
          <div className="flex-1 animate-slide-up">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{movie.title}</h1>
            
            {movie.tagline && (
              <p className="text-lg text-muted-foreground mb-4 italic">"{movie.tagline}"</p>
            )}
            
            {/* Stats */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 mb-6">
              {movie.release_date && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>{formatDate(movie.release_date)}</span>
                </div>
              )}
              
              {movie.runtime > 0 && (
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{formatRuntime(movie.runtime)}</span>
                </div>
              )}
              
              {movie.vote_average > 0 && (
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span>
                    {movie.vote_average.toFixed(1)}
                    <span className="text-muted-foreground ml-1">({movie.vote_count.toLocaleString()})</span>
                  </span>
                </div>
              )}
            </div>
            
            {/* Genres */}
            {movie.genres && movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genres.map((genre) => (
                  <span 
                    key={genre.id}
                    className="px-3 py-1 bg-secondary/50 text-secondary-foreground rounded-full text-sm"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}
            
            {/* Overview */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-2">Overview</h2>
              <p className="leading-relaxed">{movie.overview}</p>
            </div>
            
            {/* Crew */}
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
            
            {/* Additional Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {movie.status && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Status</h3>
                  <p>{movie.status}</p>
                </div>
              )}
              
              {movie.budget > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Budget</h3>
                  <p>${movie.budget.toLocaleString()}</p>
                </div>
              )}
              
              {movie.revenue > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Revenue</h3>
                  <p>${movie.revenue.toLocaleString()}</p>
                </div>
              )}
              
              {movie.production_companies && movie.production_companies.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Production</h3>
                  <p>{movie.production_companies.map(company => company.name).join(', ')}</p>
                </div>
              )}
            </div>
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
      {isTrailerOpen && trailerKey && (
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
      )}
    </Layout>
  );
};

export default MovieDetails;
