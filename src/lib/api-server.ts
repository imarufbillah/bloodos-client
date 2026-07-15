import { cookies } from "next/headers";

/**
 * Get the base URL for backend API calls (direct to Express from server)
 */
export function getApiUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
}

/**
 * Create a full API endpoint URL
 * @param path - API endpoint path (e.g., '/api/notifications')
 * @returns Full URL to the backend API
 */
export function apiUrl(path: string): string {
  const base = getApiUrl();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}

export async function apiFetch(
  path: string,
  options?: RequestInit,
): Promise<Response> {
  const url = apiUrl(path);

  // Get cookies to forward to backend
  const cookieStore = await cookies();
  const cookieString = cookieStore.toString();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options?.headers,
  };

  // Forward cookies for authentication
  if (cookieString) {
    (headers as Record<string, string>)["Cookie"] = cookieString;
  }

  const defaultOptions: RequestInit = {
    headers,
    cache: "no-store", // Don't cache server-side API calls by default
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
    method: "POST",
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
    method: "PATCH",
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
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`API DELETE error: ${response.statusText}`);
  }
  return response.json();
}
