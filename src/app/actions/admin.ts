/**
 * Server Actions for Admin Operations
 * 
 * These actions run on the server with admin authentication
 * and provide automatic cache invalidation.
 */

"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/**
 * Get session token from cookies
 */
async function getSessionToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("better-auth.session_token");
  return sessionCookie?.value;
}

/**
 * Approve a blood request
 */
export async function approveRequest(requestId: string) {
  const sessionToken = await getSessionToken();

  if (!sessionToken) {
    return { success: false, error: "Authentication required" };
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/admin/requests/${requestId}/approve`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
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
  const sessionToken = await getSessionToken();

  if (!sessionToken) {
    return { success: false, error: "Authentication required" };
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/admin/requests/${requestId}/reject`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionToken}`,
        },
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
  const sessionToken = await getSessionToken();

  if (!sessionToken) {
    return { success: false, error: "Authentication required" };
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/admin/donations/${donationId}/verify`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
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
  const sessionToken = await getSessionToken();

  if (!sessionToken) {
    return { success: false, error: "Authentication required" };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/ban`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
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
  const sessionToken = await getSessionToken();

  if (!sessionToken) {
    return { success: false, error: "Authentication required" };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/unban`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
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
  const sessionToken = await getSessionToken();

  if (!sessionToken) {
    return { success: false, error: "Authentication required" };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/role`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
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
