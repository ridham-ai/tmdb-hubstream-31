import { Movie, TVShow, TMDBResponse } from '@/types/tmdb';

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const API_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export const getPosterUrl = (posterPath: string | null | undefined, size: 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w500') => {
  if (!posterPath) return null;
  return `${IMAGE_BASE_URL}/${size}${posterPath}`;
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
