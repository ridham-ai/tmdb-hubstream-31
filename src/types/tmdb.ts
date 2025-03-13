
export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  popularity: number;
  adult: boolean;
  original_language: string;
  original_title: string;
  video: boolean;
}

export interface TVShow {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  popularity: number;
  original_language: string;
  original_name: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Credit {
  id: number;
  name: string;
  profile_path: string | null;
  character?: string;
  job?: string;
}

export interface MovieDetails extends Movie {
  runtime: number;
  status: string;
  tagline: string;
  genres: Genre[];
  budget: number;
  revenue: number;
  production_companies: {
    id: number;
    name: string;
    logo_path: string | null;
  }[];
}

export interface TVShowDetails extends TVShow {
  seasons: {
    id: number;
    name: string;
    episode_count: number;
    poster_path: string | null;
    season_number: number;
    air_date: string;
  }[];
  status: string;
  tagline: string;
  genres: Genre[];
  created_by: {
    id: number;
    name: string;
    profile_path: string | null;
  }[];
  episode_run_time: number[];
  in_production: boolean;
  last_air_date: string;
  networks: {
    id: number;
    name: string;
    logo_path: string | null;
  }[];
  number_of_episodes: number;
  number_of_seasons: number;
}

export interface MovieCredits {
  id: number;
  cast: Credit[];
  crew: Credit[];
}

export interface SearchResult {
  page: number;
  results: (Movie | TVShow)[];
  total_pages: number;
  total_results: number;
}

export interface VideoResult {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

export interface VideosResponse {
  id: number;
  results: VideoResult[];
}
