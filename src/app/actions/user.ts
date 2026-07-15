/**
 * Server Actions for User Profile Mutations
 * 
 * These actions run on the server and provide better security,
 * automatic error handling, and cache invalidation.
 */

"use server";

import { revalidatePath } from "next/cache";
import { apiFetch } from "@/lib/api-server";
import type { BloodGroup, District } from "@/types/shared";

/**
 * Update user profile
 */
export async function updateUserProfile(data: {
  name?: string;
  phone?: string;
  bloodGroup?: BloodGroup;
  district?: District;
  isDonor?: boolean;
  lastDonationDate?: string | null;
}) {
  try {
    const response = await apiFetch("/api/users/me", {
      method: "PATCH",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Failed to update profile" };
    }

    const updatedUser = await response.json();

    // Invalidate profile page cache
    revalidatePath("/profile");
    
    // If donor status changed, invalidate donors page
    if (data.isDonor !== undefined) {
      revalidatePath("/donors");
    }

    return { success: true, data: updatedUser };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update profile",
    };
  }
}

/**
 * Report a donation
 */
export async function reportDonation(data: {
  donationDate: string;
  bloodGroup: BloodGroup;
  hospitalName: string;
  district: District;
}) {
  try {
    const response = await apiFetch("/api/users/me/donations", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Failed to report donation" };
    }

    const donation = await response.json();

    // Invalidate profile page to show new donation
    revalidatePath("/profile");

    return { success: true, data: donation };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to report donation",
    };
  }
}
