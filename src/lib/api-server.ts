/**
 * Server-Side API Utility
 * 
 * Provides API helpers for server components and server actions.
 * Uses cookies to retrieve JWT token from better-auth session.
 * 
 * Frontend (Next.js) runs on port 3000, backend (Express) runs on port 5000.
 * Backend requires JWT token in Authorization header for protected routes.
 */

import { cookies } from 'next/headers';
import { auth } from './auth';

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
 * Get JWT token from better-auth session (server-side)
 * 
 * On the server, we need to get the session first, then extract the JWT.
 * Better-auth provides the JWT in the session response.
 * 
 * @returns JWT token string or null if not authenticated
 */
async function getAuthToken(): Promise<string | null> {
  try {
    const session = await auth.api.getSession({
      headers: await cookies(),
    });

    if (!session) {
      return null;
    }

    // Better-auth can provide JWT via headers when calling getSession
    // For server-side, we'll need to call the token endpoint directly
    const tokenResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/token`, {
      headers: {
        cookie: (await cookies()).toString(),
      },
    });

    if (!tokenResponse.ok) {
      return null;
    }

    const tokenData = await tokenResponse.json();
    return tokenData.token || null;
  } catch (error) {
    console.error('Failed to get auth token on server:', error);
    return null;
  }
}

/**
 * Fetch wrapper for server-side authenticated requests
 * 
 * This function:
 * 1. Resolves the full backend API URL
 * 2. Fetches JWT token from better-auth session
 * 3. Includes token in Authorization header
 * 4. Makes the request to the backend
 * 
 * @param path - API endpoint path
 * @param options - Fetch options
 * @returns Fetch response promise
 * 
 * @example
 * ```tsx
 * // In a server component
 * import { apiFetch } from '@/lib/api-server';
 * 
 * export default async function Page() {
 *   const response = await apiFetch('/api/notifications');
 *   const data = await response.json();
 *   return <div>...</div>
 * }
 * ```
 */
export async function apiFetch(
  path: string,
  options?: RequestInit
): Promise<Response> {
  const url = apiUrl(path);
  
  // Get JWT token for authentication
  const token = await getAuthToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options?.headers,
  };
  
  // Add Authorization header if token exists
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }
  
  const defaultOptions: RequestInit = {
    headers,
    cache: 'no-store', // Don't cache server-side API calls by default
  };

  return fetch(url, { ...defaultOptions, ...options });
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
