
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
  Tv,
  X,
  Check,
  PlayCircle
} from 'lucide-react';
import Layout from '@/components/Layout';
import MediaRow from '@/components/MediaRow';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  getTVShowDetails, 
  getTVShowCredits, 
  getSimilarTVShows,
  getTVShowVideos,
  getBackdropUrl,
  getPosterUrl,
  getProfileUrl
} from '@/services/tmdbService';
import { TVShowDetails as TVShowDetailsType, Credit } from '@/types/tmdb';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useWatchlist } from '@/context/WatchlistContext';

const TVDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const { toast } = useToast();
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  
  // Fetch TV show details
  const { data: tvShow, isLoading: isLoadingTVShow } = useQuery({
    queryKey: ['tvShowDetails', id],
    queryFn: () => getTVShowDetails(id!),
    enabled: !!id,
  });
  
  // Fetch TV show credits
  const { data: credits, isLoading: isLoadingCredits } = useQuery({
    queryKey: ['tvShowCredits', id],
    queryFn: () => getTVShowCredits(id!),
    enabled: !!id,
  });
  
  // Fetch similar TV shows
  const { data: similarData, isLoading: isLoadingSimilar } = useQuery({
    queryKey: ['similarTVShows', id],
    queryFn: async () => {
      const data = await getSimilarTVShows(id!);
      return data.results;
    },
    enabled: !!id,
  });
  
  // Fetch videos
  const { data: videosData } = useQuery({
    queryKey: ['tvShowVideos', id],
    queryFn: () => getTVShowVideos(id!),
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
  
  // Check if TV show is in watchlist
  const inWatchlist = tvShow ? isInWatchlist(tvShow.id, 'tv') : false;
  
  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Unknown';
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Format episode runtime
  const formatRuntime = (minutes: number[]) => {
    if (!minutes || minutes.length === 0) return 'Unknown';
    const avg = Math.floor(minutes.reduce((total, min) => total + min, 0) / minutes.length);
    return `${avg} min`;
  };
  
  // Get creators
  const creators = tvShow?.created_by || [];
  
  // Get cast
  const cast = credits?.cast.slice(0, 10) || [];
  
  // Handle watchlist toggle
  const handleWatchlistToggle = () => {
    if (!tvShow) return;
    
    if (inWatchlist) {
      removeFromWatchlist(tvShow.id, 'tv');
      toast({
        title: "Removed from Watchlist",
        description: `${tvShow.name} has been removed from your watchlist.`,
        duration: 3000,
      });
    } else {
      addToWatchlist({
        id: tvShow.id,
        mediaType: 'tv',
        media: tvShow,
      });
      toast({
        title: "Added to Watchlist",
        description: `${tvShow.name} has been added to your watchlist.`,
        duration: 3000,
      });
    }
  };
  
  // Handle share
  const handleShare = () => {
    if (!tvShow) return;
    
    if (navigator.share) {
      navigator.share({
        title: tvShow.name,
        text: tvShow.overview,
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
  
  // Handle watch now click
  const handleWatchNow = () => {
    if (!id || !tvShow?.seasons?.length) return;
    
    // Default to first season with episodes
    if (!selectedSeason) {
      const firstValidSeason = tvShow.seasons.find(s => s.episode_count > 0 && s.season_number > 0);
      if (firstValidSeason) {
        setSelectedSeason(firstValidSeason.season_number);
        setSelectedEpisode(1);
      }
    }
    
    setIsPlayerOpen(true);
  };
  
  useEffect(() => {
    // Disable body scroll when player is open
    if (isPlayerOpen || isTrailerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isPlayerOpen, isTrailerOpen]);
  
  if (isLoadingTVShow) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[70vh]">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }
  
  if (!tvShow) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold">TV show not found</h1>
          <Link to="/" className="text-primary hover:underline mt-4 inline-block">
            Return to home
          </Link>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      {/* Videasy Player */}
      {isPlayerOpen && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <button
            onClick={() => setIsPlayerOpen(false)}
            className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
            <span className="sr-only">Close</span>
          </button>
          <iframe
            src={`https://player.videasy.net/tv/${tvShow.id}/${selectedSeason}/${selectedEpisode}?nextEpisode=true&episodeSelector=true`}
            className="w-full h-full"
            allowFullScreen
            allow="autoplay; encrypted-media; picture-in-picture"
          ></iframe>
        </div>
      )}
      
      {/* Hero Section with Backdrop */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        
        <img 
          src={getBackdropUrl(tvShow.backdrop_path)} 
          alt={tvShow.name} 
          className="w-full h-[80vh] object-cover object-center"
        />
        
        <div className="absolute top-6 left-6 z-10">
          <Link 
            to="/"
            className="flex items-center gap-1 bg-black/50 backdrop-blur-sm hover:bg-black/70 p-3 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="sr-only">Back</span>
          </Link>
        </div>
        
        {/* Hero content */}
        <div className="absolute bottom-0 left-0 w-full p-8 pb-16 z-10">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row gap-8 items-end">
              <div className="w-full md:w-1/4 lg:w-1/5 hidden md:block">
                <div className="rounded-xl overflow-hidden shadow-lg transform -translate-y-16 hover:scale-105 transition-transform duration-300">
                  <img 
                    src={getPosterUrl(tvShow.poster_path)}
                    alt={tvShow.name}
                    className="w-full"
                  />
                </div>
              </div>
              
              <div className="flex-1">
                <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white drop-shadow-lg">{tvShow.name}</h1>
                
                {tvShow.tagline && (
                  <p className="text-lg text-white/80 mb-4 italic drop-shadow-md">"{tvShow.tagline}"</p>
                )}
                
                <div className="flex flex-wrap gap-3 mt-4">
                  <button
                    onClick={handleWatchNow}
                    className="bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    Watch Now
                  </button>
                  
                  {trailerKey && (
                    <button
                      onClick={() => setIsTrailerOpen(true)}
                      className="border border-white/30 bg-black/30 backdrop-blur-sm hover:bg-black/50 text-white py-3 px-6 rounded-lg flex items-center gap-2 transition-colors"
                    >
                      Watch Trailer
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-16 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0 animate-fade-in">
            <div className="md:hidden rounded-xl overflow-hidden shadow-lg hover-card mb-6">
              <img
                src={getPosterUrl(tvShow.poster_path)}
                alt={tvShow.name}
                className="w-full"
              />
            </div>
            
            <div className="space-y-6 backdrop-blur-sm bg-card/20 p-6 rounded-xl border border-border/40">
              <div className="hidden md:block rounded-xl overflow-hidden shadow-lg hover-card">
                <img
                  src={getPosterUrl(tvShow.poster_path)}
                  alt={tvShow.name}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-3">
                <Button
                  onClick={handleWatchNow}
                  className="w-full bg-primary hover:bg-primary/90 text-white py-3 px-4 rounded-lg"
                  variant="default"
                  size="lg"
                >
                  Watch Now
                </Button>
                
                <div className="flex gap-3">
                  <Button
                    onClick={handleWatchlistToggle}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-colors",
                      inWatchlist 
                        ? "bg-green-600/80 hover:bg-green-600 text-white" 
                        : "bg-secondary/80 hover:bg-secondary text-foreground"
                    )}
                    variant={inWatchlist ? "default" : "secondary"}
                  >
                    {inWatchlist ? <Check className="w-5 h-5" /> : <Heart className="w-5 h-5" />}
                    {inWatchlist ? "In Watchlist" : "Add to Watchlist"}
                  </Button>
                  
                  <Button
                    onClick={handleShare}
                    className="flex items-center justify-center gap-2 bg-secondary/80 hover:bg-secondary text-foreground py-3 px-4 rounded-lg"
                    variant="secondary"
                  >
                    <Share2 className="w-5 h-5" />
                    <span className="sr-only md:not-sr-only">Share</span>
                  </Button>
                </div>
                
                {/* Season Selector */}
                {tvShow.seasons && tvShow.seasons.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Select Season</h3>
                    <div className="grid grid-cols-4 gap-2">
                      {tvShow.seasons
                        .filter(season => season.season_number > 0)
                        .map((season) => (
                          <button
                            key={season.id}
                            onClick={() => {
                              setSelectedSeason(season.season_number);
                              setSelectedEpisode(1);
                            }}
                            className={cn(
                              "p-2 text-sm rounded-md transition-colors",
                              selectedSeason === season.season_number
                                ? "bg-primary text-white"
                                : "bg-secondary/40 hover:bg-secondary/60"
                            )}
                          >
                            {season.season_number}
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Details */}
          <div className="flex-1 animate-slide-up space-y-6">
            <div className="md:hidden">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{tvShow.name}</h1>
              
              {tvShow.tagline && (
                <p className="text-lg text-muted-foreground mb-4 italic">"{tvShow.tagline}"</p>
              )}
              
              {trailerKey && (
                <button
                  onClick={() => setIsTrailerOpen(true)}
                  className="flex items-center gap-2 text-primary hover:text-primary/80 mb-4 transition-colors"
                >
                  <PlayCircle className="w-5 h-5" />
                  Watch Trailer
                </button>
              )}
            </div>
            
            {/* Stats */}
            <Card className="bg-card/30 backdrop-blur-sm border-border/40">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {tvShow.first_air_date && (
                    <div className="flex flex-col items-center text-center p-2">
                      <Calendar className="w-6 h-6 text-primary mb-1" />
                      <span className="text-sm text-muted-foreground">First Aired</span>
                      <span className="font-medium">{formatDate(tvShow.first_air_date)}</span>
                    </div>
                  )}
                  
                  {tvShow.episode_run_time && tvShow.episode_run_time.length > 0 && (
                    <div className="flex flex-col items-center text-center p-2">
                      <Clock className="w-6 h-6 text-primary mb-1" />
                      <span className="text-sm text-muted-foreground">Episode Length</span>
                      <span className="font-medium">{formatRuntime(tvShow.episode_run_time)}</span>
                    </div>
                  )}
                  
                  {tvShow.vote_average > 0 && (
                    <div className="flex flex-col items-center text-center p-2">
                      <Star className="w-6 h-6 text-yellow-400 fill-yellow-400 mb-1" />
                      <span className="text-sm text-muted-foreground">Rating</span>
                      <span className="font-medium">
                        {tvShow.vote_average.toFixed(1)}<span className="text-muted-foreground text-xs ml-1">({tvShow.vote_count.toLocaleString()})</span>
                      </span>
                    </div>
                  )}
                  
                  <div className="flex flex-col items-center text-center p-2">
                    <Tv className="w-6 h-6 text-primary mb-1" />
                    <span className="text-sm text-muted-foreground">Seasons</span>
                    <span className="font-medium">{tvShow.number_of_seasons}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Genres */}
            {tvShow.genres && tvShow.genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tvShow.genres.map((genre) => (
                  <span 
                    key={genre.id}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}
            
            {/* Overview */}
            <div>
              <h2 className="text-xl font-semibold mb-3">Overview</h2>
              <Card className="bg-card/30 backdrop-blur-sm border-border/40">
                <CardContent className="p-6">
                  <p className="leading-relaxed">{tvShow.overview}</p>
                </CardContent>
              </Card>
            </div>
            
            {/* Seasons */}
            {tvShow.seasons && tvShow.seasons.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Seasons</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {tvShow.seasons.filter(season => season.season_number > 0).map((season) => (
                    <Card 
                      key={season.id} 
                      className={cn(
                        "overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer", 
                        selectedSeason === season.season_number 
                          ? "ring-2 ring-primary" 
                          : "hover:scale-[1.02]"
                      )}
                      onClick={() => {
                        setSelectedSeason(season.season_number);
                        setSelectedEpisode(1);
                      }}
                    >
                      <div className="aspect-[2/3] bg-muted">
                        <img 
                          src={getPosterUrl(season.poster_path)} 
                          alt={season.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-3">
                        <h3 className="font-medium text-sm">{season.name}</h3>
                        <div className="text-xs text-muted-foreground flex justify-between mt-1">
                          <span>{season.episode_count} episode{season.episode_count !== 1 ? 's' : ''}</span>
                          {season.air_date && <span>{new Date(season.air_date).getFullYear()}</span>}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
            
            {/* Crew */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Cast & Crew</h2>
              
              {creators.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Creator{creators.length > 1 ? 's' : ''}
                  </h3>
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
              {tvShow.status && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Status</h3>
                  <p>{tvShow.status}</p>
                </div>
              )}
              
              {tvShow.networks && tvShow.networks.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Network</h3>
                  <p>{tvShow.networks.map(network => network.name).join(', ')}</p>
                </div>
              )}
              
              {tvShow.in_production !== undefined && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">In Production</h3>
                  <p>{tvShow.in_production ? 'Yes' : 'No'}</p>
                </div>
              )}
              
              {tvShow.last_air_date && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Last Aired</h3>
                  <p>{formatDate(tvShow.last_air_date)}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Similar TV Shows */}
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
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 animate-fade-in"
             onClick={() => setIsTrailerOpen(false)}>
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
      )}
    </Layout>
  );
};

export default TVDetails;
