/**
 * Admin Dashboard Page (Refactored for Server Components)
 * Main admin interface with stats, charts, and management tables (Req 18.1-18.13)
 * Tabs: Overview (stats + charts), Moderation, Users
 * 
 * Improvements (Phase 2):
 * - Server-side data fetching with admin authentication
 * - Automatic loading/error boundaries
 * - Reduced client bundle size
 * - Better initial page load performance
 */

import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminDashboardContent } from "./AdminDashboardContent";
import type { AdminStats, ModerationRequest, AdminUser } from "@/lib/api/admin";

export const metadata: Metadata = {
  title: "Admin Dashboard | BloodOS",
  description: "Manage requests, users, and view platform statistics",
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/**
 * Fetch admin stats - Server-side with admin authentication
 */
async function fetchAdminStats(sessionToken?: string): Promise<AdminStats> {
  const url = `${API_BASE_URL}/api/admin/stats`;

  const response = await fetch(url, {
    headers: {
      ...(sessionToken && { Authorization: `Bearer ${sessionToken}` }),
    },
    // Short cache for admin stats (they change frequently)
    next: { revalidate: 30 },
  });

  if (response.status === 401 || response.status === 403) {
    // Redirect to login if unauthorized or forbidden
    redirect("/signin?callbackUrl=/admin");
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch admin stats: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch moderation requests - Server-side
 */
async function fetchModerationRequests(
  sessionToken?: string
): Promise<ModerationRequest[]> {
  const url = `${API_BASE_URL}/api/admin/requests/pending`;

  const response = await fetch(url, {
    headers: {
      ...(sessionToken && { Authorization: `Bearer ${sessionToken}` }),
    },
    // No cache for moderation queue
    cache: "no-store",
  });

  if (!response.ok) {
    // Return empty array on error, component will handle gracefully
    return [];
  }

  return response.json();
}

/**
 * Fetch users for management - Server-side
 */
async function fetchUsers(sessionToken?: string): Promise<AdminUser[]> {
  const url = `${API_BASE_URL}/api/admin/users`;

  const response = await fetch(url, {
    headers: {
      ...(sessionToken && { Authorization: `Bearer ${sessionToken}` }),
    },
    // Short cache for user list
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    // Return empty array on error, component will handle gracefully
    return [];
  }

  return response.json();
}

export default async function AdminDashboardPage() {
  // Get session token from cookies
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("better-auth.session_token");
  const sessionToken = sessionCookie?.value;

  // Fetch all data in parallel server-side
  const [stats, requests, users] = await Promise.all([
    fetchAdminStats(sessionToken),
    fetchModerationRequests(sessionToken),
    fetchUsers(sessionToken),
  ]);

  return (
    <AdminDashboardContent
      initialStats={stats}
      initialRequests={requests}
      initialUsers={users}
    />
  );
}
