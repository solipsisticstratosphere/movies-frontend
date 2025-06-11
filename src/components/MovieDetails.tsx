"use client";

import { useDispatch } from "react-redux";
import type { Movie } from "../types/movie";
import { setCurrentMovie } from "../store/movieSlice";
import Modal from "./Modal";

interface MovieDetailsProps {
  movie: Movie | null;
  isOpen: boolean;
}

const MovieDetails = ({ movie, isOpen }: MovieDetailsProps) => {
  const dispatch = useDispatch();

  if (!movie) {
    return null;
  }

  const handleClose = () => {
    dispatch(setCurrentMovie(null));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={movie.title}
      footer={null}
    >
      <div className="space-y-5">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-blue-600 mr-2"
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
            <div className="text-sm font-medium text-gray-700">
              Release Year
            </div>
          </div>
          <div className="mt-2 text-lg font-medium text-gray-900">
            {movie.year}
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-blue-600 mr-2"
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
            <div className="text-sm font-medium text-gray-700">Format</div>
          </div>
          <div className="mt-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {movie.format}
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-blue-600 mr-2"
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
            <div className="text-sm font-medium text-gray-700">Actors</div>
          </div>
          <div className="mt-2">
            {movie.actors && movie.actors.length > 0 ? (
              <ul className="divide-y divide-blue-200">
                {movie.actors.map((actor, index) => (
                  <li
                    key={`actor-${index}`}
                    className="py-2 first:pt-0 last:pb-0 flex items-center"
                  >
                    <div className="h-8 w-8 rounded-full bg-blue-200 flex items-center justify-center mr-3 text-blue-600 font-medium">
                      {actor.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-gray-900">{actor}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No actors listed</p>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default MovieDetails;
