import axios from "axios";
import type {
  Movie,
  MovieFormData,
  PaginatedMoviesResponse,
} from "../types/movie";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const handleApiError = (error: unknown, context: string): never => {
  console.error(context, error);
  if (axios.isAxiosError(error) && error.response) {
    const apiError = error.response.data?.error;
    const errorMessage =
      apiError?.message || apiError?.code || "An unknown API error occurred";
    throw new Error(errorMessage);
  }
  throw error;
};

interface ApiActor {
  id: number;
  name: string;
}

interface ApiMovie extends Omit<Movie, "actors"> {
  actors?: ApiActor[];
}

const transformMovieData = (movie: ApiMovie): Movie => ({
  ...movie,
  actors: Array.isArray(movie.actors)
    ? movie.actors.map((actor) => actor.name)
    : [],
});

export const movieService = {
  //all movies
  getAllMovies: async ({
    page,
    limit,
  }: {
    page: number;
    limit: number;
  }): Promise<PaginatedMoviesResponse> => {
    try {
      const offset = (page - 1) * limit;
      const response = await api.get("/movies", {
        params: { limit, offset, sort: "title", order: "ASC" },
      });
      if (
        response.data &&
        Array.isArray(response.data.data) &&
        response.data.meta
      ) {
        return {
          movies: response.data.data.map(transformMovieData),

          total: response.data.meta.total || 0,
        };
      }
      return { movies: [], total: 0 };
    } catch (error) {
      return handleApiError(error, "Error fetching movies:");
    }
  },

  //movie by ID
  getMovieById: async (id: string): Promise<Movie> => {
    try {
      const response = await api.get(`/movies/${id}`);
      if (response.data && response.data.data) {
        return transformMovieData(response.data.data);
      }
      throw new Error("Movie not found");
    } catch (error) {
      return handleApiError(error, `Error fetching movie with ID ${id}:`);
    }
  },

  //add new movie
  addMovie: async (movieData: MovieFormData): Promise<Movie> => {
    try {
      const actorsArray = movieData.actors
        .split(",")
        .map((actor) => actor.trim())
        .filter((actor) => actor !== "");

      const response = await api.post("/movies", {
        ...movieData,
        actors: actorsArray,
      });
      if (response.data && response.data.data) {
        return transformMovieData(response.data.data);
      }
      throw new Error("Failed to create movie");
    } catch (error) {
      return handleApiError(error, "Error adding movie:");
    }
  },

  //delete movie
  deleteMovie: async (id: string): Promise<void> => {
    try {
      await api.delete(`/movies/${id}`);
    } catch (error) {
      return handleApiError(error, `Error deleting movie with ID ${id}:`);
    }
  },

  //search movies by title
  searchByTitle: async (title: string): Promise<Movie[]> => {
    try {
      const response = await api.get("/movies", { params: { title } });
      if (response.data && Array.isArray(response.data.data)) {
        return response.data.data.map(transformMovieData);
      }
      return [];
    } catch (error) {
      return handleApiError(error, `Error searching movies by title ${title}:`);
    }
  },

  //search movies by actor
  searchByActor: async (actor: string): Promise<Movie[]> => {
    try {
      const response = await api.get("/movies", { params: { actor } });
      if (response.data && Array.isArray(response.data.data)) {
        return response.data.data.map(transformMovieData);
      }
      return [];
    } catch (error) {
      return handleApiError(error, `Error searching movies by actor ${actor}:`);
    }
  },

  importMovies: async (file: File): Promise<Movie[]> => {
    try {
      const formData = new FormData();
      formData.append("movies", file);

      const response = await api.post("/movies/import", formData, {
        headers: { "Content-Type": undefined },
      });

      if (response.data && Array.isArray(response.data.data)) {
        return response.data.data.map(transformMovieData);
      }
      return [];
    } catch (error) {
      return handleApiError(error, "Error importing movies:");
    }
  },
};
