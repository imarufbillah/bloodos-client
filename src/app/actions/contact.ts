/**
 * Server Actions for Contact Operations
 * 
 * These actions run on the server and provide better security
 * and automatic rate limiting integration.
 */

"use server";

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
 * Submit contact form
 * Rate-limited on the backend (5 requests per 15 minutes)
 */
export async function submitContactForm(formData: FormData) {
  try {
    const contactData = {
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    const response = await fetch(`${API_BASE_URL}/api/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contactData),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Failed to submit contact form" };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to submit contact form",
    };
  }
}

/**
 * Request donor contact information
 * Requires authentication and creates audit log entry
 */
export async function requestDonorContact(donorId: string, requestId?: string) {
  const sessionToken = await getSessionToken();

  if (!sessionToken) {
    return { success: false, error: "Authentication required" };
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/donors/${donorId}/request-contact`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({ requestId }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || "Failed to request contact information",
      };
    }

    const data = await response.json();

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to request contact information",
    };
  }
}
