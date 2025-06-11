import axios from "axios";
import type {
  UserCredentials,
  UserRegistrationData,
  AuthResponse,
} from "../types/auth";

const API_URL = import.meta.env.VITE_API_URL;

const register = async (
  userData: UserRegistrationData
): Promise<AuthResponse> => {
  const response = await axios.post(`${API_URL}/users`, userData);
  return response.data;
};

const login = async (
  userCredentials: UserCredentials
): Promise<AuthResponse> => {
  const response = await axios.post(`${API_URL}/sessions`, userCredentials);
  return response.data;
};

export const authService = {
  register,
  login,
};
