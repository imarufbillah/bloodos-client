/**
 * Client-Side API Utility
 * 
 * Provides API helpers for client components (use client).
 * Uses session cookies from better-auth instead of JWTs.
 * 
 * Frontend (Next.js) runs on port 3000, backend (Express) runs on port 5000.
 * Backend needs to verify the session cookie from better-auth.
 */

import { authClient } from './auth-client';

/**
 * Get the base URL for backend API calls
 * Uses Next.js rewrite proxy in development/production
 */
export function getApiUrl(): string {
  // Use the proxied path which Next.js will rewrite to the backend
  // This ensures cookies work since requests appear to come from the same origin
  return '/backend-api';
}

/**
 * Create a full API endpoint URL
 * @param path - API endpoint path (e.g., '/api/notifications')
 * @returns Full URL to the backend API
 */
export function apiUrl(path: string): string {
  const base = getApiUrl(); // Returns '/backend-api'
  
  // Remove '/api' prefix from path if present since the rewrite adds it back
  let normalizedPath = path.startsWith('/') ? path : `/${path}`;
  if (normalizedPath.startsWith('/api/')) {
    normalizedPath = normalizedPath.substring(4); // Remove '/api'
  }
  
  return `${base}${normalizedPath}`;
}

/**
 * Get session token from better-auth cookie
 * This reads the session_token cookie that better-auth sets
 */
function getSessionToken(): string | null {
  if (typeof document === 'undefined') {
    return null;
  }

  // Better-auth stores the session in a cookie named 'better-auth.session_token'
  // or just 'session_token' depending on configuration
  const cookies = document.cookie.split(';');
  
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'better-auth.session_token' || name === 'session_token') {
      return value;
    }
  }

  return null;
}

/**
 * Fetch wrapper for client-side authenticated requests
 * 
 * This function:
 * 1. Resolves the full backend API URL
 * 2. Includes credentials to send cookies
 * 3. Makes the request to the backend
 * 4. Handles banned user errors automatically
 * 
 * The session token is sent via cookies automatically with credentials: 'include'.
 * The backend will verify the session using better-auth's session verification.
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
  
  // Build headers - merge provided headers with defaults
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options?.headers,
  };
  
  // Merge options with defaults, ensuring cookies are sent
  const fetchOptions: RequestInit = {
    ...options,
    credentials: 'include', // This sends cookies including session_token
    headers,
  };

  const response = await fetch(url, fetchOptions);

  // Check for banned user (401 with suspension message)
  if (!response.ok) {
    // Try to parse error message
    try {
      const errorData = await response.clone().json();
      const message = errorData.message || errorData.error || '';
      
      // Check if user is suspended/banned
      if (
        response.status === 401 &&
        (message.includes('suspended') || 
         message.includes('banned') || 
         message.includes('Your account has been suspended'))
      ) {
        // Extract ban reason from message if present
        const banReasonMatch = message.match(/suspended:\s*(.+)/i);
        const banReason = banReasonMatch ? banReasonMatch[1] : message;
        
        // Redirect to suspended page with reason (avoid loop if already there)
        if (typeof window !== 'undefined' && window.location.pathname !== '/suspended') {
          const suspendedUrl = `/suspended?reason=${encodeURIComponent(banReason)}`;
          window.location.href = suspendedUrl;
        }
      }
    } catch {
      // Ignore JSON parse errors
    }
  }

  return response;
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
