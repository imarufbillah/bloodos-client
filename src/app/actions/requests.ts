"use server";

import { revalidatePath } from "next/cache";
import { apiFetch } from "@/lib/api-server";
import type { RequestStatus } from "@/types/shared";

/**
 * Create a new blood request
 */
export async function createBloodRequest(formData: FormData) {
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

    const response = await apiFetch("/api/requests", {
      method: "POST",
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || "Failed to create request",
      };
    }

    const data = await response.json();

    // Invalidate relevant caches
    revalidatePath("/requests");
    revalidatePath("/requests/manage");

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create request",
    };
  }
}

/**
 * Update blood request status
 */
export async function updateRequestStatus(
  requestId: string,
  status: RequestStatus,
) {
  try {
    const response = await apiFetch(`/api/requests/${requestId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || "Failed to update status",
      };
    }

    const data = await response.json();

    // Invalidate relevant caches
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
  try {
    const response = await apiFetch(`/api/requests/${requestId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || "Failed to delete request",
      };
    }

    // Invalidate relevant caches
    revalidatePath("/requests");
    revalidatePath("/requests/manage");

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete request",
    };
  }
}

/**
 * Respond to a blood request
 */
export async function respondToRequest(requestId: string, message: string) {
  try {
    const response = await apiFetch(`/api/requests/${requestId}/respond`, {
      method: "POST",
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || "Failed to respond to request",
      };
    }

    const data = await response.json();

    // Invalidate relevant caches
    revalidatePath(`/requests/${requestId}`);
    revalidatePath("/profile");

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to respond to request",
    };
  }
}
