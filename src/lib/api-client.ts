export function getApiUrl(): string {
  return "/backend-api";
}

/**
 * Create a full API endpoint URL
 * @param path - API endpoint path (e.g., '/api/notifications')
 * @returns Full URL to the backend API
 */
export function apiUrl(path: string): string {
  const base = getApiUrl(); // Returns '/backend-api'

  // Remove '/api' prefix from path if present since the rewrite adds it back
  let normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (normalizedPath.startsWith("/api/")) {
    normalizedPath = normalizedPath.substring(4); // Remove '/api'
  }

  return `${base}${normalizedPath}`;
}

export async function apiFetch(
  path: string,
  options?: RequestInit,
): Promise<Response> {
  const url = apiUrl(path);

  // Don't set Content-Type for FormData — browser sets multipart boundary automatically
  const isFormData = options?.body instanceof FormData;
  const headers: HeadersInit = isFormData
    ? { ...options?.headers }
    : { "Content-Type": "application/json", ...options?.headers };

  const fetchOptions: RequestInit = {
    ...options,
    credentials: "include",
    headers,
  };

  const response = await fetch(url, fetchOptions);

  // Check for banned user (401 with suspension message)
  if (!response.ok) {
    // Try to parse error message
    try {
      const errorData = await response.clone().json();
      const message = errorData.message || errorData.error || "";

      // Check if user is suspended/banned
      if (
        response.status === 401 &&
        (message.includes("suspended") ||
          message.includes("banned") ||
          message.includes("Your account has been suspended"))
      ) {
        // Extract ban reason from message if present
        const banReasonMatch = message.match(/suspended:\s*(.+)/i);
        const banReason = banReasonMatch ? banReasonMatch[1] : message;

        // Redirect to suspended page with reason (avoid loop if already there)
        if (
          typeof window !== "undefined" &&
          window.location.pathname !== "/suspended"
        ) {
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
