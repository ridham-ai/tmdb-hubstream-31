
import React, { useState } from 'react';
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
  X,
  List
} from 'lucide-react';
import Layout from '@/components/Layout';
import MediaRow from '@/components/MediaRow';
import { 
  getTVShowDetails, 
  getTVShowCredits, 
  getSimilarTVShows,
  getTVShowVideos,
  getBackdropUrl,
  getPosterUrl,
  getProfileUrl
} from '@/services/tmdbService';
import { TVShowDetails as TVShowDetailsType } from '@/types/tmdb';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const TVDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Fetch show details
  const { data: show, isLoading: isLoadingShow } = useQuery({
    queryKey: ['tvDetails', id],
    queryFn: () => getTVShowDetails(id!),
    enabled: !!id,
  });
  
  // Fetch show credits
  const { data: credits, isLoading: isLoadingCredits } = useQuery({
    queryKey: ['tvCredits', id],
    queryFn: () => getTVShowCredits(id!),
    enabled: !!id,
  });
  
  // Fetch similar shows
  const { data: similarData, isLoading: isLoadingSimilar } = useQuery({
    queryKey: ['similarShows', id],
    queryFn: async () => {
      const data = await getSimilarTVShows(id!);
      return data.results;
    },
    enabled: !!id,
  });
  
  // Fetch videos
  const { data: videosData } = useQuery({
    queryKey: ['tvVideos', id],
    queryFn: () => getTVShowVideos(id!),
    enabled: !!id,
    onSuccess: (data) => {
      const trailer = data.results.find(
        (video) => video.type === 'Trailer' && video.site === 'YouTube'
      );
      if (trailer) {
        setTrailerKey(trailer.key);
      }
    },
  });
  
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
  
  // Get creator
  const creators = show?.created_by || [];
  
  // Get cast
  const cast = credits?.cast.slice(0, 10) || [];
  
  // Handle add to watchlist
  const handleAddToWatchlist = () => {
    toast({
      title: "Added to Watchlist",
      description: `${show?.name} has been added to your watchlist.`,
      duration: 3000,
    });
  };
  
  // Handle share
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: show?.name,
        text: show?.overview,
        url: window.location.href,
      }).catch((error) => console.log('Error sharing', error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "TV show link copied to clipboard.",
        duration: 3000,
      });
    }
  };
  
  if (isLoadingShow) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[70vh]">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }
  
  if (!show) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold">TV Show not found</h1>
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
          src={getBackdropUrl(show.backdrop_path)} 
          alt={show.name} 
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
                src={getPosterUrl(show.poster_path)}
                alt={show.name}
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
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{show.name}</h1>
            
            {show.tagline && (
              <p className="text-lg text-muted-foreground mb-4 italic">"{show.tagline}"</p>
            )}
            
            {/* Stats */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 mb-6">
              {show.first_air_date && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>{formatDate(show.first_air_date)}</span>
                </div>
              )}
              
              {show.episode_run_time && show.episode_run_time.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{formatRuntime(show.episode_run_time[0])} per episode</span>
                </div>
              )}
              
              {show.vote_average > 0 && (
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span>
                    {show.vote_average.toFixed(1)}
                    <span className="text-muted-foreground ml-1">({show.vote_count.toLocaleString()})</span>
                  </span>
                </div>
              )}
              
              {show.number_of_seasons > 0 && (
                <div className="flex items-center gap-1.5">
                  <List className="w-4 h-4 text-muted-foreground" />
                  <span>
                    {show.number_of_seasons} {show.number_of_seasons === 1 ? 'Season' : 'Seasons'}
                  </span>
                </div>
              )}
            </div>
            
            {/* Genres */}
            {show.genres && show.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {show.genres.map((genre) => (
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
              <p className="leading-relaxed">{show.overview}</p>
            </div>
            
            {/* Created By */}
            {creators.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Created By</h2>
                <div className="flex flex-wrap gap-4">
                  {creators.map((creator) => (
                    <div key={creator.id} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-secondary/50">
                        <img 
                          src={getProfileUrl(creator.profile_path)} 
                          alt={creator.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span>{creator.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Cast */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Cast</h2>
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
            
            {/* Seasons */}
            {show.seasons && show.seasons.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Seasons</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {show.seasons.map((season) => (
                    <div 
                      key={season.id} 
                      className="flex gap-3 p-3 bg-secondary/30 hover:bg-secondary/40 rounded-lg transition-colors"
                    >
                      {season.poster_path ? (
                        <img 
                          src={getPosterUrl(season.poster_path, 'w92')} 
                          alt={season.name}
                          className="w-16 h-24 object-cover rounded"
                        />
                      ) : (
                        <div className="w-16 h-24 bg-secondary/50 rounded flex items-center justify-center">
                          <Tv2 className="w-8 h-8 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex flex-col">
                        <h3 className="font-medium">{season.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {season.episode_count} episodes
                        </p>
                        {season.air_date && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(season.air_date).getFullYear()}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Additional Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {show.status && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Status</h3>
                  <p>{show.status}</p>
                </div>
              )}
              
              {show.networks && show.networks.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Network</h3>
                  <p>{show.networks.map(network => network.name).join(', ')}</p>
                </div>
              )}
              
              {show.in_production !== undefined && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">In Production</h3>
                  <p>{show.in_production ? 'Yes' : 'No'}</p>
                </div>
              )}
              
              {show.last_air_date && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Last Air Date</h3>
                  <p>{formatDate(show.last_air_date)}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Similar Shows */}
        {similarData && similarData.length > 0 && (
          <div className="mt-12">
            <MediaRow
              title="Similar TV Shows"
              items={similarData}
              mediaType="tv"
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

export default TVDetails;
