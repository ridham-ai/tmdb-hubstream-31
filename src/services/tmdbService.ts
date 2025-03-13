
import { 
  Movie, 
  TVShow, 
  MovieDetails, 
  TVShowDetails, 
  MovieCredits, 
  SearchResult,
  VideosResponse
} from '../types/tmdb';

const API_KEY = "08c748f7d51cbcbf3189168114145568";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

export const getImageUrl = (path: string | null, size: string = "original"): string => {
  if (!path) return "/placeholder.svg";
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const getBackdropUrl = (path: string | null): string => {
  return getImageUrl(path, "original");
};

export const getPosterUrl = (path: string | null, size: string = "w500"): string => {
  return getImageUrl(path, size);
};

export const getProfileUrl = (path: string | null): string => {
  return getImageUrl(path, "w185");
};

async function fetchFromTMDB<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const searchParams = new URLSearchParams({
    api_key: API_KEY,
    ...params,
  });
  
  const response = await fetch(`${BASE_URL}${endpoint}?${searchParams.toString()}`);
  
  if (!response.ok) {
    throw new Error(`TMDB API Error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

// Movies
export const getTrendingMovies = (): Promise<{ results: Movie[] }> => {
  return fetchFromTMDB<{ results: Movie[] }>("/trending/movie/day");
};

export const getPopularMovies = (): Promise<{ results: Movie[] }> => {
  return fetchFromTMDB<{ results: Movie[] }>("/movie/popular");
};

export const getTopRatedMovies = (): Promise<{ results: Movie[] }> => {
  return fetchFromTMDB<{ results: Movie[] }>("/movie/top_rated");
};

export const getUpcomingMovies = (): Promise<{ results: Movie[] }> => {
  return fetchFromTMDB<{ results: Movie[] }>("/movie/upcoming");
};

export const getNowPlayingMovies = (): Promise<{ results: Movie[] }> => {
  return fetchFromTMDB<{ results: Movie[] }>("/movie/now_playing");
};

export const getMovieDetails = (id: string): Promise<MovieDetails> => {
  return fetchFromTMDB<MovieDetails>(`/movie/${id}`);
};

export const getMovieCredits = (id: string): Promise<MovieCredits> => {
  return fetchFromTMDB<MovieCredits>(`/movie/${id}/credits`);
};

export const getSimilarMovies = (id: string): Promise<{ results: Movie[] }> => {
  return fetchFromTMDB<{ results: Movie[] }>(`/movie/${id}/similar`);
};

export const getMovieVideos = (id: string): Promise<VideosResponse> => {
  return fetchFromTMDB<VideosResponse>(`/movie/${id}/videos`);
};

// TV Shows
export const getTrendingTVShows = (): Promise<{ results: TVShow[] }> => {
  return fetchFromTMDB<{ results: TVShow[] }>("/trending/tv/day");
};

export const getPopularTVShows = (): Promise<{ results: TVShow[] }> => {
  return fetchFromTMDB<{ results: TVShow[] }>("/tv/popular");
};

export const getTopRatedTVShows = (): Promise<{ results: TVShow[] }> => {
  return fetchFromTMDB<{ results: TVShow[] }>("/tv/top_rated");
};

export const getOnTheAirTVShows = (): Promise<{ results: TVShow[] }> => {
  return fetchFromTMDB<{ results: TVShow[] }>("/tv/on_the_air");
};

export const getTVShowDetails = (id: string): Promise<TVShowDetails> => {
  return fetchFromTMDB<TVShowDetails>(`/tv/${id}`);
};

export const getTVShowCredits = (id: string): Promise<MovieCredits> => {
  return fetchFromTMDB<MovieCredits>(`/tv/${id}/credits`);
};

export const getSimilarTVShows = (id: string): Promise<{ results: TVShow[] }> => {
  return fetchFromTMDB<{ results: TVShow[] }>(`/tv/${id}/similar`);
};

export const getTVShowVideos = (id: string): Promise<VideosResponse> => {
  return fetchFromTMDB<VideosResponse>(`/tv/${id}/videos`);
};

// Search
export const searchMulti = (query: string, page: number = 1): Promise<SearchResult> => {
  return fetchFromTMDB<SearchResult>("/search/multi", { query, page: page.toString() });
};

export const searchMovies = (query: string, page: number = 1): Promise<SearchResult> => {
  return fetchFromTMDB<SearchResult>("/search/movie", { query, page: page.toString() });
};

export const searchTVShows = (query: string, page: number = 1): Promise<SearchResult> => {
  return fetchFromTMDB<SearchResult>("/search/tv", { query, page: page.toString() });
};
