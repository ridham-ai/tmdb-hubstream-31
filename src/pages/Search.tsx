
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search as SearchIcon, Film, Tv2, LayoutGrid, X } from 'lucide-react';
import Layout from '@/components/Layout';
import MediaGrid from '@/components/MediaGrid';
import { searchMovies, searchTVShows } from '@/services/tmdbService';
import { cn } from '@/lib/utils';
import { Movie, TVShow } from '@/types/tmdb';

const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [activeTab, setActiveTab] = useState<'all' | 'movies' | 'tv'>(
    (searchParams.get('type') as 'all' | 'movies' | 'tv') || 'all'
  );
  const [page, setPage] = useState(1);
  
  // Update searchParams when any filter changes
  useEffect(() => {
    const params: Record<string, string> = {};
    if (searchTerm) params.q = searchTerm;
    params.type = activeTab;
    setSearchParams(params);
  }, [searchTerm, activeTab, setSearchParams]);
  
  // Reset page when search term or type changes
  useEffect(() => {
    setPage(1);
  }, [searchTerm, activeTab]);
  
  // Search queries
  const {
    data: movieResults,
    isLoading: isLoadingMovies,
  } = useQuery({
    queryKey: ['searchMovies', searchTerm, page],
    queryFn: () => searchMovies(searchTerm, page),
    enabled: !!searchTerm && (activeTab === 'movies' || activeTab === 'all'),
  });
  
  const {
    data: tvResults,
    isLoading: isLoadingTV,
  } = useQuery({
    queryKey: ['searchTVShows', searchTerm, page],
    queryFn: () => searchTVShows(searchTerm, page),
    enabled: !!searchTerm && (activeTab === 'tv' || activeTab === 'all'),
  });
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm) {
      setPage(1);
    }
  };
  
  const handleClearSearch = () => {
    setSearchTerm('');
    setPage(1);
  };
  
  // Get combined results for 'all' tab or specific results for other tabs
  const getResults = () => {
    if (activeTab === 'all' && movieResults?.results && tvResults?.results) {
      const combinedResults = [
        ...movieResults.results.map(item => ({ ...item, media_type: 'movie' })),
        ...tvResults.results.map(item => ({ ...item, media_type: 'tv' }))
      ];
      // Sort by popularity (if available)
      return combinedResults.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    } else if (activeTab === 'movies') {
      return movieResults?.results || [];
    } else if (activeTab === 'tv') {
      return tvResults?.results || [];
    }
    return [];
  };
  
  const results = getResults();
  const isLoading = (activeTab === 'movies' || activeTab === 'all') && isLoadingMovies || 
                   (activeTab === 'tv' || activeTab === 'all') && isLoadingTV;
  
  // Calculate total results and pages for pagination
  const getTotalResults = () => {
    if (activeTab === 'all') {
      const movieTotal = movieResults?.total_results || 0;
      const tvTotal = tvResults?.total_results || 0;
      return movieTotal + tvTotal;
    } else if (activeTab === 'movies') {
      return movieResults?.total_results || 0;
    } else {
      return tvResults?.total_results || 0;
    }
  };
  
  const getTotalPages = () => {
    if (activeTab === 'all') {
      const moviePages = movieResults?.total_pages || 0;
      const tvPages = tvResults?.total_pages || 0;
      return Math.max(moviePages, tvPages);
    } else if (activeTab === 'movies') {
      return movieResults?.total_pages || 0;
    } else {
      return tvResults?.total_pages || 0;
    }
  };
  
  const totalResults = getTotalResults();
  const totalPages = getTotalPages();
  
  // Calculate page numbers to show
  const pageNumbers = [];
  if (totalPages) {
    const startPage = Math.max(1, page - 2);
    const endPage = Math.min(totalPages, startPage + 4);
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 animate-fade-in">Search</h1>
          
          {/* Search form */}
          <form 
            onSubmit={handleSearch}
            className="relative mb-8 animate-slide-up"
          >
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="w-5 h-5 text-muted-foreground" />
              </div>
              
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for movies or TV shows..."
                className="w-full pl-10 pr-10 py-3 bg-white/5 dark:bg-black/20 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              />
              
              {searchTerm && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <X className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
                </button>
              )}
            </div>
          </form>
          
          {/* Tabs */}
          <div className="flex space-x-4 mb-6 animate-fade-in">
            <button
              onClick={() => setActiveTab('all')}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors",
                activeTab === 'all'
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary/50 hover:bg-secondary/70"
              )}
            >
              <LayoutGrid className="w-4 h-4" />
              All
            </button>
            
            <button
              onClick={() => setActiveTab('movies')}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors",
                activeTab === 'movies'
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary/50 hover:bg-secondary/70"
              )}
            >
              <Film className="w-4 h-4" />
              Movies
            </button>
            
            <button
              onClick={() => setActiveTab('tv')}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors",
                activeTab === 'tv'
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary/50 hover:bg-secondary/70"
              )}
            >
              <Tv2 className="w-4 h-4" />
              TV Shows
            </button>
          </div>
        </div>
        
        {/* Search results */}
        {searchTerm ? (
          <div>
            {totalResults !== undefined && (
              <p className="text-muted-foreground mb-6 animate-fade-in">
                Found {totalResults.toLocaleString()} results
              </p>
            )}
            
            {results && results.length > 0 ? (
              <MediaGrid
                items={results}
                mediaType={activeTab === 'movies' ? 'movie' : activeTab === 'tv' ? 'tv' : 'mixed'}
                isLoading={isLoading}
              />
            ) : !isLoading ? (
              <div className="text-center py-16">
                <h2 className="text-xl font-medium mb-2">No results found</h2>
                <p className="text-muted-foreground">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
              </div>
            ) : null}
            
            {/* Pagination */}
            {totalPages && totalPages > 1 && (
              <div className="flex justify-center mt-8 space-x-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className={cn(
                    "px-3 py-1.5 rounded-md transition-colors",
                    page === 1
                      ? "bg-secondary/20 text-muted-foreground cursor-not-allowed"
                      : "bg-secondary/50 hover:bg-secondary/70"
                  )}
                >
                  Previous
                </button>
                
                {pageNumbers.map((num) => (
                  <button
                    key={num}
                    onClick={() => setPage(num)}
                    className={cn(
                      "px-3 py-1.5 rounded-md transition-colors",
                      page === num
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary/50 hover:bg-secondary/70"
                    )}
                  >
                    {num}
                  </button>
                ))}
                
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className={cn(
                    "px-3 py-1.5 rounded-md transition-colors",
                    page === totalPages
                      ? "bg-secondary/20 text-muted-foreground cursor-not-allowed"
                      : "bg-secondary/50 hover:bg-secondary/70"
                  )}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4">
              <SearchIcon className="w-full h-full text-muted-foreground" />
            </div>
            <h2 className="text-xl font-medium mb-2">Search for Movies & TV Shows</h2>
            <p className="text-muted-foreground">
              Enter a title in the search box above to find movies and TV shows.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Search;
