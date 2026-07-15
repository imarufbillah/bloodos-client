/**
 * Manage Blood Requests Page (Refactored for Server Components)
 * Phase 8i - /requests/manage
 *
 * Functional requirements:
 * - Req 20.11: Authenticated users can view their posted requests
 * - Req 20.12: Auth required (protected route)
 * - Req 20.13: Data from GET /api/requests/mine endpoint
 * - Req 20.14: Table columns: Patient, Blood Group, Status, Date, Actions
 * - Req 20.15: Paginated if > 10 requests
 * - Req 20.16: Mark Fulfilled → PATCH /api/requests/:id/status {status: "fulfilled"}
 * - Req 20.17: Cancel → PATCH /api/requests/:id/status {status: "cancelled"}
 * - Req 20.18: Delete requires confirmation dialog
 * - Req 20.19: Delete → DELETE /api/requests/:id
 *
 * Design direction (from unit 8i):
 * - Table layout (not cards)
 * - Monospace for dates/IDs per Phase 6a
 * - Delete requires confirmation dialog before calling DELETE
 * - Civic infrastructure aesthetic: compact, functional, clear hierarchy
 *
 * Improvements (Phase 2):
 * - Server-side data fetching with authentication
 * - Automatic loading/error boundaries
 * - Reduced client bundle size
 * - Better initial page load performance
 */

import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ManageRequestsContent } from "./ManageRequestsContent";
import type { BloodRequest, PaginatedResponse } from "@/types/shared";

export const metadata: Metadata = {
  title: "Manage Requests | BloodOS",
  description: "View and manage your blood donation requests",
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/**
 * Fetch user's requests - Server-side with authentication
 */
async function fetchUserRequests(
  page: number,
  sessionToken?: string
): Promise<PaginatedResponse<BloodRequest>> {
  const url = `${API_BASE_URL}/api/requests/mine?page=${page}&limit=10`;

  const response = await fetch(url, {
    headers: {
      ...(sessionToken && { Authorization: `Bearer ${sessionToken}` }),
    },
    // No caching for user-specific data that changes frequently
    cache: "no-store",
  });

  if (response.status === 401) {
    // Redirect to login if unauthorized
    redirect("/signin?callbackUrl=/requests/manage");
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch requests: ${response.statusText}`);
  }

  return response.json();
}

type PageProps = {
  searchParams: Promise<{
    page?: string;
  }>;
};

export default async function ManageRequestsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || "1", 10);

  // Get session token from cookies
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("better-auth.session_token");
  const sessionToken = sessionCookie?.value;

  // Fetch data server-side
  const data = await fetchUserRequests(page, sessionToken);

  return <ManageRequestsContent initialData={data} initialPage={page} />;
}
