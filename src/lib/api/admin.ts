/**
 * Admin API client utilities
 * Handles all admin-specific API calls (Req 18, 5f)
 */

import { apiFetch } from "../api-client";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface AdminStats {
  totalRequests: number;
  activeRequests: number;
  fulfilledRequests: number;
  totalDonors: number;
  donationsThisMonth: number;
  requestsByBloodGroup: Array<{ bloodGroup: string; count: number }>;
  requestsByDistrict: Array<{ district: string; count: number }>;
  requestTrend: Array<{ date: string; count: number }>;
}

export interface ModerationRequest {
  _id: string;
  patientName: string;
  bloodGroup: string;
  status: string;
  createdAt: string;
  userId: string;
}

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  isDonor: boolean;
  bloodGroup?: string;
  district?: string;
  createdAt: string;
  banned?: boolean;
}

/**
 * Fetch admin dashboard statistics (Req 18.4)
 */
export async function getAdminStats(): Promise<AdminStats> {
  const response = await apiFetch("/api/admin/stats");

  if (!response.ok) {
    throw new Error("Failed to fetch admin stats");
  }

  return response.json();
}

/**
 * Fetch requests pending moderation (Req 18.9)
 */
export async function getModerationRequests(): Promise<ModerationRequest[]> {
  const response = await apiFetch("/api/admin/requests?limit=100");

  if (!response.ok) {
    throw new Error("Failed to fetch moderation requests");
  }

  const result = await response.json();
  return result.data || [];
}

/**
 * Approve a blood request (admin action)
 */
export async function approveRequest(requestId: string): Promise<void> {
  const response = await apiFetch(`/api/admin/requests/${requestId}/approve`, {
    method: "PATCH",
  });

  if (!response.ok) {
    throw new Error("Failed to approve request");
  }
}

/**
 * Reject a blood request (admin action)
 */
export async function rejectRequest(
  requestId: string,
  reason: string
): Promise<void> {
  const response = await apiFetch(`/api/admin/requests/${requestId}/reject`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reason }),
  });

  if (!response.ok) {
    throw new Error("Failed to reject request");
  }
}

/**
 * Delete a blood request (admin action, Req 18.12)
 */
export async function deleteRequest(requestId: string): Promise<void> {
  const response = await apiFetch(`/api/requests/${requestId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete request");
  }
}

/**
 * Fetch all users for management (Req 5f)
 */
export async function getUsers(): Promise<AdminUser[]> {
  const response = await apiFetch("/api/admin/users?limit=100");

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  const result = await response.json();
  return result.data || [];
}

/**
 * Ban or unban a user (Req 10.5/10.6)
 */
export async function toggleUserBan(
  userId: string,
  banned: boolean,
  reason: string
): Promise<void> {
  const response = await apiFetch(`/api/admin/users/${userId}/ban`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ banned, reason }),
  });

  if (!response.ok) {
    throw new Error("Failed to update user ban status");
  }
}

/**
 * Change user role (Req 1.10, 5f)
 */
export async function changeUserRole(
  userId: string,
  role: "user" | "admin"
): Promise<void> {
  const response = await apiFetch(`/api/admin/users/${userId}/role`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role }),
  });

  if (!response.ok) {
    throw new Error("Failed to change user role");
  }
}

/**
 * Verify a donation (Req 10.4)
 */
export async function verifyDonation(donationId: string): Promise<void> {
  const response = await apiFetch(`/api/admin/donations/${donationId}/verify`, {
    method: "PATCH",
  });

  if (!response.ok) {
    throw new Error("Failed to verify donation");
  }
}
