import axios from "axios";

/**
 * Configured Axios instance:
 * - Sets base URL based on environment (dev/prod)
 * - Enables credentials for cross-origin cookies
 * - Centralizes API endpoint configuration
 */
export const axiosInstance = axios.create({
  // Use localhost in development, relative path in production
  baseURL: import.meta.env.MODE === "development" 
    ? "http://localhost:5001/api"  // Development server
    : "/api",                      // Production (same-origin)

  // Essential for sending/receiving cookies (JWT tokens)
  withCredentials: true,
});