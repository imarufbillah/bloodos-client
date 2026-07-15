/**
 * Server Actions for Contact Operations
 * 
 * These actions run on the server and provide better security
 * and automatic rate limiting integration.
 */

"use server";

import { apiFetch } from "@/lib/api-server";

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

    const response = await apiFetch("/api/contact", {
      method: "POST",
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
  try {
    const response = await apiFetch(
      `/api/donors/${donorId}/request-contact`,
      {
        method: "POST",
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
