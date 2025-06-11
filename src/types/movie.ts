export interface Movie {
  id: string;
  title: string;
  year: number;
  format: "VHS" | "DVD" | "Blu-ray";
  actors: string[];
}

export interface MovieFormData {
  title: string;
  year: number;
  format: "VHS" | "DVD" | "Blu-ray";
  actors: string;
}

export interface MoviesState {
  movies: Movie[];
  filteredMovies: Movie[];
  loading: boolean;
  error: string | null;
  currentMovie: Movie | null;
  currentPage: number;
  totalPages: number;
  totalMovies: number;
}

export interface PaginatedMoviesResponse {
  movies: Movie[];
  total: number;
}
