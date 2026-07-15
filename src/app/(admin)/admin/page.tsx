import { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminDashboardContent } from "./AdminDashboardContent";
import { apiFetch } from "@/lib/api-server";
import type { AdminStats, ModerationRequest, AdminUser } from "@/lib/api/admin";

export const metadata: Metadata = {
  title: "Admin Dashboard | BloodOS",
  description: "Manage requests, users, and view platform statistics",
};

/**
 * Fetch admin stats - Server-side with admin authentication
 */
async function fetchAdminStats(): Promise<AdminStats> {
  const response = await apiFetch("/api/admin/stats");

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
async function fetchModerationRequests(): Promise<ModerationRequest[]> {
  // The correct endpoint is /api/admin/requests, not /pending
  const response = await apiFetch("/api/admin/requests");

  if (!response.ok) {
    // Return empty array on error, component will handle gracefully
    return [];
  }

  const data = await response.json();

  // If it's a paginated response, extract the data array
  if (data.data && Array.isArray(data.data)) {
    return data.data;
  }

  // Otherwise assume it's already an array
  return Array.isArray(data) ? data : [];
}

/**
 * Fetch users for management - Server-side
 */
async function fetchUsers(): Promise<AdminUser[]> {
  const response = await apiFetch("/api/admin/users");

  if (!response.ok) {
    // Return empty array on error, component will handle gracefully
    return [];
  }

  const data = await response.json();

  // If it's a paginated response, extract the data array
  if (data.data && Array.isArray(data.data)) {
    return data.data;
  }

  // Otherwise assume it's already an array
  return Array.isArray(data) ? data : [];
}

export default async function AdminDashboardPage() {
  // Fetch all data in parallel server-side
  // Cookies are automatically forwarded by apiFetch
  const [stats, requests, users] = await Promise.all([
    fetchAdminStats(),
    fetchModerationRequests(),
    fetchUsers(),
  ]);

  return (
    <AdminDashboardContent
      initialStats={stats}
      initialRequests={requests}
      initialUsers={users}
    />
  );
}
