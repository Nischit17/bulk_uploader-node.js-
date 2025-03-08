"use client";

import axios from "axios";

/**
 * Base API configuration with common settings
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Create axios instance with common configuration
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds
});

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred";

    // Handle specific error codes if needed
    if (error.response?.status === 401) {
      // Handle authentication errors
      console.error("Authentication error:", errorMessage);
    } else if (error.response?.status === 429) {
      // Handle rate limiting
      console.error("Rate limit exceeded:", errorMessage);
    }

    return Promise.reject(error);
  }
);

/**
 * Error codes and their descriptions for API response handling
 */
export const API_ERROR_CODES = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  VALIDATION_ERROR: 422,
  SERVER_ERROR: 500,
} as const;

/**
 * Formats the API URL with the given endpoint
 * @param endpoint - The API endpoint to format
 * @returns The formatted API URL
 */
export function formatApiUrl(endpoint: string): string {
  const trimmedEndpoint = endpoint.startsWith("/")
    ? endpoint.slice(1)
    : endpoint;
  return `${API_BASE_URL}/${trimmedEndpoint}`;
}
