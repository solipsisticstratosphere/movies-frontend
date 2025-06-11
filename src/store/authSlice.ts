import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import { authService } from "../services/authService";
import type {
  AuthState,
  UserCredentials,
  UserRegistrationData,
} from "../types/auth";
import { AxiosError } from "axios";

const getUserFromToken = (
  token: string
): { id: number; name: string; email: string } | null => {
  try {
    return jwtDecode(token);
  } catch (e) {
    console.error("Invalid token:", e);
    return null;
  }
};

const token = localStorage.getItem("token");
const user = token ? getUserFromToken(token) : null;

const initialState: AuthState = {
  user,
  token,
  isAuthenticated: !!token,
  loading: false,
  error: null,
};

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData: UserRegistrationData, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData);
      localStorage.setItem("token", response.token);
      return response.token;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(
          error.response.data.error.message || "Registration failed"
        );
      }
      return rejectWithValue(
        "An unexpected error occurred during registration"
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (userCredentials: UserCredentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(userCredentials);
      localStorage.setItem("token", response.token);
      return response.token;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(
          error.response.data.error.message || "Login failed"
        );
      }
      return rejectWithValue("An unexpected error occurred during login");
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("token");
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      //register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload;
        state.isAuthenticated = true;
        state.user = getUserFromToken(action.payload);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      //login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload;
        state.isAuthenticated = true;
        state.user = getUserFromToken(action.payload);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
