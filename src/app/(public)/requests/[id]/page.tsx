import { Suspense } from "react";
import { notFound } from "next/navigation";
import RequestDetailsContent from "./RequestDetailsContent";
import type { BloodRequest } from "@/types/shared";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/**
 * Fetch a single request by ID (server component)
 */
async function fetchRequest(id: string): Promise<BloodRequest> {
  const response = await fetch(`${API_BASE_URL}/api/requests/${id}`, {
    next: { revalidate: 30 },
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

export default async function RequestDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const request = await fetchRequest(id);

  return (
    <Suspense fallback={<RequestDetailsSkeleton />}>
      <RequestDetailsContent request={request} />
    </Suspense>
  );
}

function RequestDetailsSkeleton() {
  return (
    <div className="w-full min-h-[calc(100dvh-4rem)] flex flex-col bg-background pb-24 sm:pb-16">
      {/* Sub-nav Skeleton */}
      <div className="border-b border-border bg-card/60 py-3">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="h-4 w-40 bg-muted animate-pulse rounded" />
          <div className="h-8 w-20 bg-muted animate-pulse rounded-lg" />
        </div>
      </div>

      {/* Main 2-Col Grid Skeleton */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          <div className="lg:col-span-8 space-y-8">
            <div className="h-72 rounded-2xl bg-muted animate-pulse" />
            <div className="h-56 rounded-2xl bg-muted animate-pulse" />
            <div className="h-40 rounded-2xl bg-muted animate-pulse" />
          </div>
          <div className="lg:col-span-4 space-y-6">
            <div className="h-96 rounded-2xl bg-muted animate-pulse" />
            <div className="h-32 rounded-2xl bg-muted animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;

  try {
    const request = await fetchRequest(id);
    return {
      title: `Emergency ${request.bloodGroup} Blood Request: ${request.patientName} | BloodOS Bangladesh`,
      description:
        `Urgent requisition for ${request.unitsNeeded} ${request.unitsNeeded === 1 ? "bag" : "bags"} of ${request.bloodGroup} blood at ${request.hospitalName}, ${request.district}. Volunteer to donate.`,
    };
  } catch {
    return {
      title: "Blood Donation Request Details | BloodOS Bangladesh",
      description: "View verified emergency blood donation request details on BloodOS.",
    };
  }
}
