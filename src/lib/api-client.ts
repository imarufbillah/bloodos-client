/**
 * Client-Side API Utility
 * 
 * Provides API helpers for client components (use client).
 * Automatically includes JWT token from better-auth in requests.
 * 
 * Frontend (Next.js) runs on port 3000, backend (Express) runs on port 5000.
 * Backend requires JWT token in Authorization header for protected routes.
 */

import { authClient } from './auth-client';

/**
 * Get the base URL for backend API calls
 */
export function getApiUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
}

/**
 * Create a full API endpoint URL
 * @param path - API endpoint path (e.g., '/api/notifications')
 * @returns Full URL to the backend API
 */
export function apiUrl(path: string): string {
  const base = getApiUrl();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}

/**
 * Get JWT token from better-auth (client-side only)
 * @returns JWT token string or null if not authenticated
 */
async function getAuthToken(): Promise<string | null> {
  try {
    const { data, error } = await authClient.token();
    if (error || !data) {
      return null;
    }
    return data.token;
  } catch (error) {
    console.error('Failed to get auth token:', error);
    return null;
  }
}

/**
 * Fetch wrapper for client-side authenticated requests
 * 
 * This function:
 * 1. Resolves the full backend API URL
 * 2. Fetches JWT token from better-auth
 * 3. Includes token in Authorization header
 * 4. Makes the request to the backend
 * 
 * @param path - API endpoint path
 * @param options - Fetch options
 * @returns Fetch response promise
 * 
 * @example
 * ```tsx
 * "use client"
 * import { apiFetch } from '@/lib/api-client';
 * 
 * const response = await apiFetch('/api/notifications');
 * const data = await response.json();
 * ```
 */
export async function apiFetch(
  path: string,
  options?: RequestInit
): Promise<Response> {
  const url = apiUrl(path);
  
  // Get JWT token for authentication
  const token = await getAuthToken();
  
  // Build headers - merge provided headers with defaults
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options?.headers,
  };
  
  // Add Authorization header if token exists
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }
  
  // Merge options with defaults, ensuring headers are properly combined
  const fetchOptions: RequestInit = {
    ...options,
    credentials: 'include',
    headers,
  };

  return fetch(url, fetchOptions);
}

/**
 * Generic GET request helper
 */
export async function apiGet<T>(path: string): Promise<T> {
  const response = await apiFetch(path);
  if (!response.ok) {
    throw new Error(`API GET error: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Generic POST request helper
 */
export async function apiPost<T>(path: string, body?: unknown): Promise<T> {
  const response = await apiFetch(path, {
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!response.ok) {
    throw new Error(`API POST error: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Generic PATCH request helper
 */
export async function apiPatch<T>(path: string, body?: unknown): Promise<T> {
  const response = await apiFetch(path, {
    method: 'PATCH',
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!response.ok) {
    throw new Error(`API PATCH error: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Generic DELETE request helper
 */
export async function apiDelete<T>(path: string): Promise<T> {
  const response = await apiFetch(path, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(`API DELETE error: ${response.statusText}`);
  }
  return response.json();
}
