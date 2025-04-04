
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search as SearchIcon } from 'lucide-react';
import Layout from '@/components/Layout';
import MediaGrid from '@/components/MediaGrid';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { searchMovies, searchTVShows } from '@/services/tmdbService';

const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [activeTab, setActiveTab] = useState(
    searchParams.get('type') || 'all'
  );
  const [page, setPage] = useState(1);
  
  useEffect(() => {
    const params: Record<string, string> = {};
    if (searchTerm) params.q = searchTerm;
    if (activeTab !== 'all') params.type = activeTab;
    setSearchParams(params);
  }, [searchTerm, activeTab, setSearchParams]);
  
  useEffect(() => {
    setPage(1);
  }, [searchTerm, activeTab]);
  
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
  
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = e.currentTarget.elements.namedItem('search') as HTMLInputElement;
    setSearchTerm(input.value);
    setPage(1);
  };
  
  const getResults = () => {
    if (activeTab === 'all' && movieResults?.results && tvResults?.results) {
      const combinedResults = [
        ...movieResults.results.map(item => ({ ...item, media_type: 'movie' })),
        ...tvResults.results.map(item => ({ ...item, media_type: 'tv' }))
      ];
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
  
  const getTotalResults = () => {
    if (activeTab === 'all') {
      const movieTotal = movieResults?.total_results || 0;
      const tvTotal = tvResults?.total_results || 0;
      return movieTotal + tvTotal;
    } else if (activeTab === 'movies') {
      return movieResults?.total_results;
    } else if (activeTab === 'tv') {
      return tvResults?.total_results;
    }
    return undefined;
  };
  
  const getTotalPages = () => {
    if (activeTab === 'all') {
      const moviePages = movieResults?.total_pages || 0;
      const tvPages = tvResults?.total_pages || 0;
      return Math.max(moviePages, tvPages);
    } else if (activeTab === 'movies') {
      return movieResults?.total_pages;
    } else if (activeTab === 'tv') {
      return tvResults?.total_pages;
    }
    return undefined;
  };
  
  const totalResults = getTotalResults();
  const totalPages = getTotalPages();
  
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
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 animate-fade-in">Search</h1>
          
          <form 
            onSubmit={handleSearch}
            className="relative mb-8 animate-slide-up"
          >
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <SearchIcon className="w-5 h-5 text-muted-foreground" />
              </div>
              <Input
                type="search"
                name="search"
                placeholder="Search for movies, TV shows..."
                className="pl-10 pr-20 py-6 text-lg w-full rounded-full"
                defaultValue={searchTerm}
              />
              <div className="absolute inset-y-0 right-2 flex items-center">
                <Button 
                  type="submit" 
                  size="sm"
                  className="rounded-full px-4"
                >
                  Search
                </Button>
              </div>
            </div>
          </form>
          
          <div className="flex space-x-4 mb-6 animate-fade-in">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-full transition-colors ${
                activeTab === 'all'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary hover:bg-secondary/80'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab('movies')}
              className={`px-4 py-2 rounded-full transition-colors ${
                activeTab === 'movies'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary hover:bg-secondary/80'
              }`}
            >
              Movies
            </button>
            <button
              onClick={() => setActiveTab('tv')}
              className={`px-4 py-2 rounded-full transition-colors ${
                activeTab === 'tv'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary hover:bg-secondary/80'
              }`}
            >
              TV Shows
            </button>
          </div>
        </div>
        
        {searchTerm ? (
          <div>
            {totalResults !== undefined && (
              <div className="text-center text-muted-foreground mb-6">
                Found {totalResults.toLocaleString()} {totalResults === 1 ? 'result' : 'results'} for "{searchTerm}"
              </div>
            )}
            
            {results && results.length > 0 ? (
              <MediaGrid
                items={results}
                mediaType="mixed"
                isLoading={isLoading}
              />
            ) : !isLoading ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No results found</h3>
                <p className="text-muted-foreground">
                  Try different keywords or check your spelling
                </p>
              </div>
            ) : null}
            
            {totalPages && totalPages > 1 && (
              <div className="flex justify-center mt-8 space-x-2">
                <button
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 rounded bg-secondary/50 hover:bg-secondary disabled:opacity-50 disabled:pointer-events-none"
                >
                  Previous
                </button>
                
                {pageNumbers.map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`px-3 py-1 rounded ${
                      pageNum === page
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary/50 hover:bg-secondary'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
                
                <button
                  onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1 rounded bg-secondary/50 hover:bg-secondary disabled:opacity-50 disabled:pointer-events-none"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16 animate-fade-in">
            <h2 className="text-2xl font-semibold mb-2">Search for Movies & TV Shows</h2>
            <p className="text-muted-foreground mb-6">
              Find information about your favorite movies and TV shows
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Search;
