"use client";

import type React from "react";

import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import { addMovie, fetchAllMovies } from "../store/movieSlice";
import type { MovieFormData } from "../types/movie";

interface MovieFormProps {
  onClose: () => void;
  setFooter: (footer: React.ReactNode) => void;
}

const MovieForm = ({ onClose, setFooter }: MovieFormProps) => {
  const { currentPage } = useSelector((state: RootState) => state.movies);
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState<MovieFormData>({
    title: "",
    year: 2000,
    format: "DVD",
    actors: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<{
    year?: string;
    actors?: string;
  }>({});

  const validateForm = (): boolean => {
    const newErrors: { year?: string; actors?: string } = {};

    if (formData.year > 2000) {
      newErrors.year = "Release year cannot be later than 2000.";
    }
    if (formData.year < 1500) {
      newErrors.year = "Please enter a valid release year.";
    }

    const actorsRegex = /^[a-zA-Z\s'-]+(?:,\s*[a-zA-Z\s'-]+)*$/;
    if (!formData.actors.trim()) {
      newErrors.actors = "Actors list cannot be empty.";
    } else if (!actorsRegex.test(formData.actors.trim())) {
      newErrors.actors =
        "Please use a valid format (e.g., Tom Hanks, David Morse).";
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "year" ? Number.parseInt(value, 10) || 0 : value,
    }));

    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSuccess(false);
    setError(null);

    try {
      await dispatch(addMovie(formData)).unwrap();
      setSuccess(true);
      await dispatch(fetchAllMovies(currentPage)).unwrap();
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage || "Failed to add movie. Please try again.");
      console.error("Failed to add movie:", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    setFooter(
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white py-2.5 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
          onClick={onClose}
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          Cancel
        </button>
        <button
          type="submit"
          form="movie-form"
          disabled={isSubmitting}
          className={`inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 py-2.5 px-5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 ${
            isSubmitting ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Adding...
            </>
          ) : (
            <>
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
            </>
          )}
        </button>
      </div>
    );
  }, [isSubmitting, onClose, setFooter]);

  return (
    <div className="overflow-hidden">
      <p className="text-sm text-gray-600 mb-6 leading-relaxed">
        Fill in the details below to add a new movie to your collection.
      </p>

      {success && (
        <div className="rounded-lg bg-green-50 p-4 mb-6 border border-green-200 flex items-start">
          <svg
            className="h-5 w-5 text-green-600 mt-0.5 mr-3"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <p className="text-sm font-medium text-green-800">
            Movie added successfully!
          </p>
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 p-4 mb-6 border border-red-200 flex items-start">
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

      <form id="movie-form" onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Movie Title
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-400"
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
              <input
                type="text"
                name="title"
                id="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="block w-full pl-10 pr-4 py-3 rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200"
                placeholder="The Green Mile"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="year"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Release Year
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <input
                type="number"
                name="year"
                id="year"
                value={formData.year}
                onChange={handleChange}
                required
                min="1500"
                max="2000"
                className={`block w-full pl-10 pr-4 py-3 rounded-lg shadow-sm sm:text-sm transition-colors duration-200 ${
                  formErrors.year
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
              />
            </div>
            {formErrors.year && (
              <p className="mt-2 text-xs text-red-600">{formErrors.year}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="format"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Format
            </label>
            <div className="relative">
              <select
                id="format"
                name="format"
                value={formData.format}
                onChange={handleChange}
                className="block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg transition-colors duration-200"
              >
                <option value="VHS">VHS</option>
                <option value="DVD">DVD</option>
                <option value="Blu-ray">Blu-ray</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="actors"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Actors
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 pt-3 flex items-start pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <textarea
                id="actors"
                name="actors"
                value={formData.actors}
                onChange={handleChange}
                required
                rows={4}
                className={`block w-full pl-10 pr-4 py-3 rounded-lg shadow-sm sm:text-sm transition-colors duration-200 ${
                  formErrors.actors
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
                placeholder="Tom Hanks, David Morse, Michael Clarke Duncan"
              ></textarea>
            </div>
            {formErrors.actors ? (
              <p className="mt-2 text-xs text-red-600">{formErrors.actors}</p>
            ) : (
              <p className="mt-2 text-xs text-gray-500 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 text-gray-400 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Enter actor names separated by commas.
              </p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default MovieForm;
