/**
 * Request Details Page - Phase 8c
 *
 * Public detailed view of a single blood request with six sections:
 * 1. Overview (hero with key urgency indicators)
 * 2. Key Information (patient, blood, hospital details)
 * 3. Location (hospital address, district)
 * 4. Contact (masked unless owner/admin)
 * 5. Responses (owner-only section)
 * 6. Related Requests (same blood group + district)
 *
 * Requirements:
 * - Req 21.12: Public route (no auth required for viewing)
 * - Req 21.13: Overview section with status, urgency, blood group
 * - Req 21.14: Key Info section with all patient/medical details
 * - Req 21.15: Location section with hospital address
 * - Req 21.16: Description section with additional notes
 * - Req 21.17: Contact section (masked unless owner/admin)
 * - Req 21.18: Responses section (owner/admin only)
 * - Req 21.19: Related Requests grid (via GET /api/requests/related/:id)
 * - Req 21.20: "I Can Help" button (authenticated donors only)
 * - Req 21.21: POST /api/requests/:id/respond on help click
 * - Req 21.22: Success toast after response submission
 *
 * Design:
 * - Sectioned layout with hairline dividers (not cards-within-cards)
 * - Critical requests get the heartbeat pulse bar on the overview section
 * - Related requests use the same card-grid rhythm as browse page
 */

import { Suspense } from "react";
import { notFound } from "next/navigation";
import RequestDetailsContent from "./RequestDetailsContent";
import type { BloodRequest } from "@/types/shared";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/**
 * Fetch a single request by ID (server component)
 */
async function fetchRequest(id: string): Promise<BloodRequest> {
  const response = await fetch(`${API_BASE_URL}/api/requests/${id}`, {
    next: { revalidate: 60 }, // Revalidate every minute
  });

  if (!response.ok) {
    if (response.status === 404) {
      notFound();
    }
    throw new Error(`Failed to fetch request: ${response.statusText}`);
  }

  return response.json();
}

interface PageProps {
  params: Promise<{ id: string }>;
}

/**
 * Request Details Page Component
 */
export default async function RequestDetailsPage({ params }: PageProps) {
  const { id } = await params;

  // Fetch request data (server-side)
  const request = await fetchRequest(id);

  return (
    <Suspense fallback={<RequestDetailsSkeleton />}>
      <RequestDetailsContent request={request} />
    </Suspense>
  );
}

/**
 * Loading skeleton for request details
 */
function RequestDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="space-y-8 animate-pulse">
          {/* Overview Skeleton */}
          <div className="h-48 bg-muted rounded-lg" />

          {/* Sections Skeleton */}
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-3">
                <div className="h-6 bg-muted rounded w-1/4" />
                <div className="h-20 bg-muted rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;

  try {
    const request = await fetchRequest(id);
    return {
      title: `${request.patientName} needs ${request.bloodGroup} blood - BloodOS`,
      description: `${request.urgency} blood request for ${request.unitsNeeded} units of ${request.bloodGroup} blood at ${request.hospitalName}, ${request.district}. ${request.additionalNotes || ""}`.slice(
        0,
        160
      ),
    };
  } catch {
    return {
      title: "Request Details - BloodOS",
      description: "View blood donation request details",
    };
  }
}
