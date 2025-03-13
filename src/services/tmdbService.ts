
import { Movie, TVShow, TMDBResponse, MovieDetails, TVShowDetails, MovieCredits, VideosResponse } from '@/types/tmdb';

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || '08c748f7d51cbcbf3189168114145568';
const API_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Image URL helpers
export const getPosterUrl = (posterPath: string | null | undefined, size: 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w500') => {
  if (!posterPath) return null;
  return `${IMAGE_BASE_URL}/${size}${posterPath}`;
};

export const getBackdropUrl = (backdropPath: string | null | undefined, size: 'w300' | 'w780' | 'w1280' | 'original' = 'w1280') => {
  if (!backdropPath) return 'https://placehold.co/1280x720/1f1f1f/2a2a2a?text=No+Image';
  return `${IMAGE_BASE_URL}/${size}${backdropPath}`;
};

export const getProfileUrl = (profilePath: string | null | undefined, size: 'w45' | 'w185' | 'h632' | 'original' = 'w185') => {
  if (!profilePath) return 'https://placehold.co/185x278/1f1f1f/2a2a2a?text=No+Image';
  return `${IMAGE_BASE_URL}/${size}${profilePath}`;
};

// Trending
export const getTrendingMovies = async (page = 1, timeWindow: 'day' | 'week' = 'week'): Promise<TMDBResponse<Movie>> => {
  const response = await fetch(
    `${API_BASE_URL}/trending/movie/${timeWindow}?api_key=${API_KEY}&language=en-US&page=${page}`
  );
  return response.json();
};

export const getTrendingTVShows = async (page = 1, timeWindow: 'day' | 'week' = 'week'): Promise<TMDBResponse<TVShow>> => {
  const response = await fetch(
    `${API_BASE_URL}/trending/tv/${timeWindow}?api_key=${API_KEY}&language=en-US&page=${page}`
  );
  return response.json();
};

// Movies Endpoints
export const getPopularMovies = async (page = 1): Promise<TMDBResponse<Movie>> => {
  const response = await fetch(
    `${API_BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`
  );
  return response.json();
};

export const getTopRatedMovies = async (page = 1): Promise<TMDBResponse<Movie>> => {
  const response = await fetch(
    `${API_BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US&page=${page}`
  );
  return response.json();
};

export const getUpcomingMovies = async (page = 1): Promise<TMDBResponse<Movie>> => {
  const response = await fetch(
    `${API_BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=en-US&page=${page}`
  );
  return response.json();
};

export const getNowPlayingMovies = async (page = 1): Promise<TMDBResponse<Movie>> => {
  const response = await fetch(
    `${API_BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=en-US&page=${page}`
  );
  return response.json();
};

export const getMovieDetails = async (movieId: string | number): Promise<MovieDetails> => {
  const response = await fetch(
    `${API_BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US`
  );
  return response.json();
};

export const getMovieCredits = async (movieId: string | number): Promise<MovieCredits> => {
  const response = await fetch(
    `${API_BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}&language=en-US`
  );
  return response.json();
};

export const getSimilarMovies = async (movieId: string | number, page = 1): Promise<TMDBResponse<Movie>> => {
  const response = await fetch(
    `${API_BASE_URL}/movie/${movieId}/similar?api_key=${API_KEY}&language=en-US&page=${page}`
  );
  return response.json();
};

export const getMovieVideos = async (movieId: string | number): Promise<VideosResponse> => {
  const response = await fetch(
    `${API_BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`
  );
  return response.json();
};

// TV Shows Endpoints
export const getPopularTVShows = async (page = 1): Promise<TMDBResponse<TVShow>> => {
  const response = await fetch(
    `${API_BASE_URL}/tv/popular?api_key=${API_KEY}&language=en-US&page=${page}`
  );
  return response.json();
};

export const getTopRatedTVShows = async (page = 1): Promise<TMDBResponse<TVShow>> => {
  const response = await fetch(
    `${API_BASE_URL}/tv/top_rated?api_key=${API_KEY}&language=en-US&page=${page}`
  );
  return response.json();
};

export const getOnTheAirTVShows = async (page = 1): Promise<TMDBResponse<TVShow>> => {
  const response = await fetch(
    `${API_BASE_URL}/tv/on_the_air?api_key=${API_KEY}&language=en-US&page=${page}`
  );
  return response.json();
};

export const getTVShowDetails = async (tvId: string | number): Promise<TVShowDetails> => {
  const response = await fetch(
    `${API_BASE_URL}/tv/${tvId}?api_key=${API_KEY}&language=en-US`
  );
  return response.json();
};

export const getTVShowCredits = async (tvId: string | number): Promise<MovieCredits> => {
  const response = await fetch(
    `${API_BASE_URL}/tv/${tvId}/credits?api_key=${API_KEY}&language=en-US`
  );
  return response.json();
};

export const getSimilarTVShows = async (tvId: string | number, page = 1): Promise<TMDBResponse<TVShow>> => {
  const response = await fetch(
    `${API_BASE_URL}/tv/${tvId}/similar?api_key=${API_KEY}&language=en-US&page=${page}`
  );
  return response.json();
};

export const getTVShowVideos = async (tvId: string | number): Promise<VideosResponse> => {
  const response = await fetch(
    `${API_BASE_URL}/tv/${tvId}/videos?api_key=${API_KEY}&language=en-US`
  );
  return response.json();
};

// Search Endpoints
export const searchMovies = async (query: string, page = 1): Promise<TMDBResponse<Movie>> => {
  const response = await fetch(
    `${API_BASE_URL}/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=${page}&include_adult=false`
  );
  return response.json();
};

export const searchTVShows = async (query: string, page = 1): Promise<TMDBResponse<TVShow>> => {
  const response = await fetch(
    `${API_BASE_URL}/search/tv?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=${page}&include_adult=false`
  );
  return response.json();
};
