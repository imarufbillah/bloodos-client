/**
 * Server Actions for Blood Request Mutations
 * 
 * These actions run on the server and provide better security,
 * automatic error handling, and cache invalidation.
 */

"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import type { RequestStatus } from "@/types/shared";

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
 * Create a new blood request
 */
export async function createBloodRequest(formData: FormData) {
  const sessionToken = await getSessionToken();

  if (!sessionToken) {
    return { success: false, error: "Authentication required" };
  }

  try {
    const requestData = {
      patientName: formData.get("patientName"),
      bloodGroup: formData.get("bloodGroup"),
      unitsNeeded: Number(formData.get("unitsNeeded")),
      hospitalName: formData.get("hospitalName"),
      hospitalAddress: formData.get("hospitalAddress"),
      district: formData.get("district"),
      urgency: formData.get("urgency"),
      neededByDate: formData.get("neededByDate"),
      contactPhone: formData.get("contactPhone"),
      additionalNotes: formData.get("additionalNotes"),
    };

    const response = await fetch(`${API_BASE_URL}/api/requests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Failed to create request" };
    }

    const data = await response.json();

    // Invalidate relevant caches
    revalidateTag("requests");
    revalidatePath("/requests");
    revalidatePath("/requests/manage");

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create request",
    };
  }
}

/**
 * Update blood request status
 */
export async function updateRequestStatus(requestId: string, status: RequestStatus) {
  const sessionToken = await getSessionToken();

  if (!sessionToken) {
    return { success: false, error: "Authentication required" };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/requests/${requestId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Failed to update status" };
    }

    const data = await response.json();

    // Invalidate relevant caches
    revalidateTag("requests");
    revalidatePath("/requests");
    revalidatePath(`/requests/${requestId}`);
    revalidatePath("/requests/manage");

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update status",
    };
  }
}

/**
 * Delete a blood request
 */
export async function deleteRequest(requestId: string) {
  const sessionToken = await getSessionToken();

  if (!sessionToken) {
    return { success: false, error: "Authentication required" };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/requests/${requestId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Failed to delete request" };
    }

    // Invalidate relevant caches
    revalidateTag("requests");
    revalidatePath("/requests");
    revalidatePath("/requests/manage");

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete request",
    };
  }
}

/**
 * Respond to a blood request
 */
export async function respondToRequest(requestId: string, message: string) {
  const sessionToken = await getSessionToken();

  if (!sessionToken) {
    return { success: false, error: "Authentication required" };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/requests/${requestId}/respond`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Failed to respond to request" };
    }

    const data = await response.json();

    // Invalidate relevant caches
    revalidatePath(`/requests/${requestId}`);
    revalidatePath("/profile");

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to respond to request",
    };
  }
}
