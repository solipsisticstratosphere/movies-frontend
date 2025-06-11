import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Movie, MoviesState, MovieFormData } from "../types/movie";
import { movieService } from "../services/movieService";

const MOVIES_PER_PAGE = 10;

const initialState: MoviesState = {
  movies: [],
  filteredMovies: [],
  loading: false,
  error: null,
  currentMovie: null,
  currentPage: 1,
  totalPages: 0,
  totalMovies: 0,
};

export const fetchAllMovies = createAsyncThunk(
  "movies/fetchAll",
  async (page: number = 1, { rejectWithValue }) => {
    try {
      const response = await movieService.getAllMovies({
        page,
        limit: MOVIES_PER_PAGE,
      });
      return { ...response, page };
    } catch (error: unknown) {
      console.error("Failed to fetch movies:", error);
      return rejectWithValue("Failed to fetch movies");
    }
  }
);

export const fetchMovieById = createAsyncThunk(
  "movies/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      return await movieService.getMovieById(id);
    } catch (error: unknown) {
      console.error(`Failed to fetch movie with ID: ${id}`, error);
      return rejectWithValue(`Failed to fetch movie with ID: ${id}`);
    }
  }
);

export const addMovie = createAsyncThunk(
  "movies/add",
  async (movieData: MovieFormData, { rejectWithValue }) => {
    try {
      return await movieService.addMovie(movieData);
    } catch (error: unknown) {
      console.error("Failed to add movie:", error);
      return rejectWithValue("Failed to add movie");
    }
  }
);

export const deleteMovie = createAsyncThunk(
  "movies/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await movieService.deleteMovie(id);
      return id;
    } catch (error: unknown) {
      console.error(`Failed to delete movie with ID: ${id}`, error);
      return rejectWithValue(`Failed to delete movie with ID: ${id}`);
    }
  }
);

export const searchMoviesByTitle = createAsyncThunk(
  "movies/searchByTitle",
  async (title: string, { rejectWithValue }) => {
    try {
      return await movieService.searchByTitle(title);
    } catch (error: unknown) {
      console.error(`Failed to search movies by title: ${title}`, error);
      return rejectWithValue(`Failed to search movies by title: ${title}`);
    }
  }
);

export const searchMoviesByActor = createAsyncThunk(
  "movies/searchByActor",
  async (actor: string, { rejectWithValue }) => {
    try {
      return await movieService.searchByActor(actor);
    } catch (error: unknown) {
      console.error(`Failed to search movies by actor: ${actor}`, error);
      return rejectWithValue(`Failed to search movies by actor: ${actor}`);
    }
  }
);

export const importMoviesFromFile = createAsyncThunk(
  "movies/import",
  async (file: File, { rejectWithValue }) => {
    try {
      return await movieService.importMovies(file);
    } catch (error: unknown) {
      console.error("Failed to import movies from file:", error);
      return rejectWithValue("Failed to import movies from file");
    }
  }
);

const movieSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {
    clearFilteredMovies: (state) => {
      state.filteredMovies = [];
    },
    setCurrentMovie: (state, action: PayloadAction<Movie | null>) => {
      state.currentMovie = action.payload;
    },
    sortMoviesByTitle: (state) => {
      if (Array.isArray(state.movies)) {
        state.movies = [...state.movies].sort((a, b) =>
          a.title.localeCompare(b.title)
        );
      }
      if (
        Array.isArray(state.filteredMovies) &&
        state.filteredMovies.length > 0
      ) {
        state.filteredMovies = [...state.filteredMovies].sort((a, b) =>
          a.title.localeCompare(b.title)
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      //all movies
      .addCase(fetchAllMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = Array.isArray(action.payload.movies)
          ? action.payload.movies
          : [];
        state.totalMovies = action.payload.total;
        state.currentPage = action.payload.page;
        state.totalPages = Math.ceil(action.payload.total / MOVIES_PER_PAGE);
        state.error = null;
      })
      .addCase(fetchAllMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      //movie by ID
      .addCase(fetchMovieById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovieById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMovie = action.payload;
        state.error = null;
      })
      .addCase(fetchMovieById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      //add new movie
      .addCase(addMovie.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMovie.fulfilled, (state, action) => {
        state.loading = false;
        if (!Array.isArray(state.movies)) {
          state.movies = [];
        }
        state.movies.push(action.payload);
        state.error = null;
      })
      .addCase(addMovie.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      //delete movie
      .addCase(deleteMovie.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMovie.fulfilled, (state, action) => {
        state.loading = false;
        if (Array.isArray(state.movies)) {
          state.movies = state.movies.filter(
            (movie) => movie.id !== action.payload
          );
        }
        if (
          Array.isArray(state.filteredMovies) &&
          state.filteredMovies.length > 0
        ) {
          state.filteredMovies = state.filteredMovies.filter(
            (movie) => movie.id !== action.payload
          );
        }
        if (state.currentMovie && state.currentMovie.id === action.payload) {
          state.currentMovie = null;
        }
        state.error = null;
      })
      .addCase(deleteMovie.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      //search movies by title
      .addCase(searchMoviesByTitle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchMoviesByTitle.fulfilled, (state, action) => {
        state.loading = false;
        state.filteredMovies = Array.isArray(action.payload)
          ? action.payload
          : [];
        state.error = null;
      })
      .addCase(searchMoviesByTitle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      //search movies by actor
      .addCase(searchMoviesByActor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchMoviesByActor.fulfilled, (state, action) => {
        state.loading = false;
        state.filteredMovies = Array.isArray(action.payload)
          ? action.payload
          : [];
        state.error = null;
      })
      .addCase(searchMoviesByActor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      //import movies from file
      .addCase(importMoviesFromFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(importMoviesFromFile.fulfilled, (state, action) => {
        state.loading = false;
        if (!Array.isArray(state.movies)) {
          state.movies = [];
        }
        const newMovies = Array.isArray(action.payload) ? action.payload : [];
        state.movies = [...state.movies, ...newMovies];
        state.error = null;
      })
      .addCase(importMoviesFromFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearFilteredMovies, setCurrentMovie, sortMoviesByTitle } =
  movieSlice.actions;
export default movieSlice.reducer;
