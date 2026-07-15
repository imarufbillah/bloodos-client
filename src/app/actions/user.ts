/**
 * Server Actions for User Profile Mutations
 * 
 * These actions run on the server and provide better security,
 * automatic error handling, and cache invalidation.
 */

"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import type { BloodGroup, District } from "@/types/shared";

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
  const sessionToken = await getSessionToken();

  if (!sessionToken) {
    return { success: false, error: "Authentication required" };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/users/me`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
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
  const sessionToken = await getSessionToken();

  if (!sessionToken) {
    return { success: false, error: "Authentication required" };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/users/me/donations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
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
