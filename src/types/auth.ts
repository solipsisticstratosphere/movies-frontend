export interface AuthState {
  user: { id: number; name: string; email: string } | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface UserCredentials {
  email: string;
  password: string;
}

export interface UserRegistrationData extends UserCredentials {
  name: string;
  confirmPassword: string;
}

export interface AuthResponse {
  token: string;
  status: number;
}
