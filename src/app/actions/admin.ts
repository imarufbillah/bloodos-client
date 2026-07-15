/**
 * Server Actions for Admin Operations
 * 
 * These actions run on the server with admin authentication
 * and provide automatic cache invalidation.
 */

"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { apiFetch } from "@/lib/api-server";

/**
 * Approve a blood request
 */
export async function approveRequest(requestId: string) {
  try {
    const response = await apiFetch(
      `/api/admin/requests/${requestId}/approve`,
      {
        method: "PATCH",
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Failed to approve request" };
    }

    const data = await response.json();

    // Invalidate relevant caches
    revalidateTag("requests");
    revalidatePath("/admin");
    revalidatePath("/requests");
    revalidatePath(`/requests/${requestId}`);

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to approve request",
    };
  }
}

/**
 * Reject a blood request
 */
export async function rejectRequest(requestId: string, reason?: string) {
  try {
    const response = await apiFetch(
      `/api/admin/requests/${requestId}/reject`,
      {
        method: "PATCH",
        body: JSON.stringify({ reason }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Failed to reject request" };
    }

    const data = await response.json();

    // Invalidate relevant caches
    revalidateTag("requests");
    revalidatePath("/admin");
    revalidatePath("/requests");

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to reject request",
    };
  }
}

/**
 * Verify a donation
 */
export async function verifyDonation(donationId: string) {
  try {
    const response = await apiFetch(
      `/api/admin/donations/${donationId}/verify`,
      {
        method: "PATCH",
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Failed to verify donation" };
    }

    const data = await response.json();

    // Invalidate admin dashboard and donors cache
    revalidatePath("/admin");
    revalidatePath("/donors");

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to verify donation",
    };
  }
}

/**
 * Ban a user
 */
export async function banUser(userId: string, reason?: string) {
  try {
    const response = await apiFetch(`/api/admin/users/${userId}/ban`, {
      method: "PATCH",
      body: JSON.stringify({ reason }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Failed to ban user" };
    }

    const data = await response.json();

    // Invalidate admin dashboard
    revalidatePath("/admin");

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to ban user",
    };
  }
}

/**
 * Unban a user
 */
export async function unbanUser(userId: string) {
  try {
    const response = await apiFetch(`/api/admin/users/${userId}/unban`, {
      method: "PATCH",
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Failed to unban user" };
    }

    const data = await response.json();

    // Invalidate admin dashboard
    revalidatePath("/admin");

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to unban user",
    };
  }
}

/**
 * Change user role
 */
export async function changeUserRole(userId: string, role: "user" | "admin") {
  try {
    const response = await apiFetch(`/api/admin/users/${userId}/role`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Failed to change user role" };
    }

    const data = await response.json();

    // Invalidate admin dashboard
    revalidatePath("/admin");

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to change user role",
    };
  }
}
