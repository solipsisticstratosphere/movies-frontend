"use client";

import type React from "react";

import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllMovies, clearFilteredMovies } from "./store/movieSlice";
import { logout } from "./store/authSlice";
import type { AppDispatch, RootState } from "./store";
import MovieList from "./components/MovieList";
import MovieForm from "./components/MovieForm";
import MovieSearch from "./components/MovieSearch";
import MovieImport from "./components/MovieImport";
import MovieDetails from "./components/MovieDetails";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Modal from "./components/Modal";

const App = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const {
    movies = [],
    filteredMovies = [],
    loading,
    error,
    currentMovie,
    totalMovies,
  } = useSelector((state: RootState) => state.movies);

  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isImportModalOpen, setImportModalOpen] = useState(false);
  const [modalFooter, setModalFooter] = useState<React.ReactNode>(null);
  const [isAuthForm, setIsAuthForm] = useState<"login" | "register">("login");
  const [isSearchActive, setIsSearchActive] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchAllMovies(1)).catch((err) => {
        console.error("Failed to fetch movies:", err);
      });
    } else {
      dispatch(clearFilteredMovies());
    }
  }, [dispatch, isAuthenticated]);

  const handleLogout = () => {
    dispatch(logout());
    setIsSearchActive(false);
  };

  const handleCloseImportModal = useCallback(() => {
    setImportModalOpen(false);
  }, []);

  const handleCloseAddModal = useCallback(() => {
    setAddModalOpen(false);
  }, []);

  if (!isAuthenticated) {
    if (isAuthForm === "login") {
      return <LoginForm onSwitchToRegister={() => setIsAuthForm("register")} />;
    }
    return <RegisterForm onSwitchToLogin={() => setIsAuthForm("login")} />;
  }

  const moviesToShow = isSearchActive ? filteredMovies : movies;
  const displayCount = isSearchActive ? filteredMovies.length : totalMovies;
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 4v16M17 4v16M3 8h18M3 16h18"
                    />
                  </svg>
                </div>
                <h1 className="text-xl font-bold text-gray-900">
                  Movie Collection
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center text-sm text-gray-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span>Welcome, {user?.name}</span>
              </div>

              <button
                onClick={handleLogout}
                className="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {isSearchActive ? "Search Results" : "Your Movie Collection"}
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                {displayCount} {displayCount === 1 ? "movie" : "movies"} found
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setImportModalOpen(true)}
                className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                  />
                </svg>
                Import Movies
              </button>

              <button
                onClick={() => setAddModalOpen(true)}
                className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Movie
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-6 rounded-lg bg-red-50 p-4 border border-red-200 flex items-start">
              <svg
                className="h-5 w-5 text-red-600 mt-0.5 mr-3"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            <MovieSearch onSearchStatusChange={setIsSearchActive} />

            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="relative">
                  <div className="h-12 w-12 rounded-full border-4 border-blue-200"></div>
                  <div className="absolute top-0 left-0 h-12 w-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
                </div>
                <p className="mt-4 text-sm text-gray-600">
                  Loading your movies...
                </p>
              </div>
            ) : (
              <MovieList
                movies={moviesToShow}
                isSearchResult={isSearchActive}
              />
            )}
          </div>
        </div>
      </main>

      <MovieDetails movie={currentMovie} isOpen={!!currentMovie} />

      <Modal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        title="Add New Movie"
        footer={modalFooter}
      >
        <MovieForm onClose={handleCloseAddModal} setFooter={setModalFooter} />
      </Modal>

      <Modal
        isOpen={isImportModalOpen}
        onClose={handleCloseImportModal}
        title="Import Movies from File"
        footer={modalFooter}
      >
        <MovieImport
          onClose={handleCloseImportModal}
          setFooter={setModalFooter}
        />
      </Modal>
    </div>
  );
};

export default App;
