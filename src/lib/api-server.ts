/**
 * Server-Side API Utility
 * 
 * Provides API helpers for server components and server actions.
 * For server-side calls, we directly call the Express backend and forward cookies.
 * 
 * Frontend (Next.js) runs on port 3000, backend (Express) runs on port 5000.
 */

import { cookies } from 'next/headers';

/**
 * Get the base URL for backend API calls (direct to Express from server)
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
 * Fetch wrapper for server-side authenticated requests
 * 
 * This function:
 * 1. Resolves the full backend API URL
 * 2. Forwards session cookies to the backend
 * 3. Makes the request to the backend
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
  
  // Get cookies to forward to backend
  const cookieStore = await cookies();
  const cookieString = cookieStore.toString();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options?.headers,
  };
  
  // Forward cookies for authentication
  if (cookieString) {
    (headers as Record<string, string>)['Cookie'] = cookieString;
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
