// src/axios.ts
import axios from "axios";

const baseURL =
  process.env.NODE_ENV === "production"
    ? "/api/v1" // in production, use same domain with relative API path
    : "http://localhost:8000/api/v1"; // in local dev, hit your local backend

// Create an Axios instance with default settings
const instance = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 3000, // 3 second timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

// 👉 Add interceptor to handle 401 errors
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear any stored auth/session data
      localStorage.clear();
      sessionStorage.clear();
      
      // Don't clear all cookies, just log the error
      console.warn("Authentication error. Redirecting to login...");

      // Redirect to login page
      window.location.href = "/login";
    }
    
    // Handle connection errors
    if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
      console.warn("Connection error. Backend server might be down.");
    }
    
    return Promise.reject(error);
  }
);

// Add request interceptor to check for cookies before making requests
instance.interceptors.request.use(
  (config) => {
    // Check if we're making an auth-related request (login, signup, etc.)
    const isAuthRequest = config.url?.includes('/login') || 
                          config.url?.includes('/signup') || 
                          config.url?.includes('/forgot-password') ||
                          config.url?.includes('/reset-password') ||
                          config.url?.includes('/verify-email');
    
    // For non-auth requests, check if we have a token in localStorage as backup
    if (!isAuthRequest) {
      const token = localStorage.getItem('auth_token');
      if (token) {
        // Add token to request headers
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
