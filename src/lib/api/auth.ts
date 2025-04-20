import axios, { AxiosError } from "axios";
import { dummyLogin, dummyGetCurrentUser, dummyLogout } from "@/lib/auth-dummy";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
const DUMMY_MODE = process.env.NEXT_PUBLIC_USE_DUMMY_AUTH === "true" || true; // Set to true for dummy auth

export interface User {
  id: string;
  username: string;
  email: string;
  createdAt?: string;
  role?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ErrorResponse {
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

const authApi = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor
authApi.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor
authApi.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ErrorResponse>) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        window.location.href = "auth/login"; // Fixed path to /login
      }
    }
    return Promise.reject(error);
  }
);

export const registerUser = async (userData: {
  username: string;
  email: string;
  password: string;
}): Promise<AuthResponse> => {
  if (DUMMY_MODE) {
    // In dummy mode, just login with the provided email (assuming all registrations succeed)
    return dummyLogin(userData.email, userData.password);
  }

  try {
    const response = await authApi.post<AuthResponse>(
      "/auth/register",
      userData
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    if (axiosError.response) {
      throw {
        message: axiosError.response.data.message || "Registration failed",
        errors: axiosError.response.data.errors,
        status: axiosError.response.status,
      };
    } else {
      throw {
        message: "Network error. Please check your connection.",
        status: 500,
      };
    }
  }
};

export const loginUser = async (credentials: {
  email: string;
  password: string;
}): Promise<AuthResponse> => {
  if (DUMMY_MODE) {
    // Use dummy login in dummy mode
    try {
      return await dummyLogin(credentials.email, credentials.password);
    } catch (error) {
      throw {
        message: error instanceof Error ? error.message : "Login failed",
        status: 401,
      };
    }
  }

  try {
    const response = await authApi.post<AuthResponse>(
      "/auth/login",
      credentials
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    throw {
      message: axiosError.response?.data.message || "Login failed",
      errors: axiosError.response?.data.errors,
      status: axiosError.response?.status,
    };
  }
};

export const getCurrentUser = async (): Promise<User> => {
  if (DUMMY_MODE) {
    // Use dummy getCurrentUser in dummy mode
    const user = await dummyGetCurrentUser();
    if (!user) {
      throw {
        message: "User not authenticated",
        status: 401,
      };
    }
    return user;
  }

  try {
    const response = await authApi.get<User>("/auth/me");
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    throw {
      message: axiosError.response?.data.message || "Failed to fetch user",
      status: axiosError.response?.status,
    };
  }
};

export const logoutUser = async (): Promise<void> => {
  if (DUMMY_MODE) {
    // Use dummy logout in dummy mode
    await dummyLogout();
    return;
  }

  try {
    await authApi.post("/auth/logout");
  } finally {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  }
};

// Utility function to check if we're running in dummy mode
export const isDummyMode = (): boolean => {
  return DUMMY_MODE;
};

// Helper function to get auth token (useful for other API calls)
export const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

export default authApi;
