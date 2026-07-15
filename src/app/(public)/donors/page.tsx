/**
 * Donor Directory Page - Phase 8d (Refactored for Server Components)
 * 
 * Public directory of eligible blood donors with filtering and pagination.
 * 
 * Requirements:
 * - Req 17.1-17.13: All donor directory functionality
 * - Req 17.2: Public route (no auth required)
 * - Req 17.3: Filters wired to GET /api/donors query params
 * - Req 17.6: Blood group + district filters
 * - Req 17.7: Skeleton loaders during fetch
 * - Req 17.8: All fields displayed per DonorCard
 * - Req 17.9: Client-side eligibility calculation
 * - Req 17.10: Paginated results
 * - Req 17.11: "Request Contact" requires auth (redirect to login)
 * - Req 17.12: POST /api/donors/:id/request-contact on success
 * - Req 17.13: Toast "Contact information sent to your notifications"
 * 
 * Design:
 * - Same grid rhythm as /requests for consistency
 * - 4/2/1 column layout with stagger fade-in animation
 * - Civic infrastructure aesthetic: clean, functional, accessible
 * - Empty states, error states, loading states all handled
 * 
 * Improvements (Phase 2):
 * - Server-side data fetching for better SEO and initial load
 * - Automatic loading/error boundaries
 * - Streaming UI with React Suspense
 * - Reduced client bundle size
 */

import { Suspense } from "react";
import { DonorsGridSkeleton } from "@/components/shared/SkeletonLoaders";
import DonorDirectoryContent from "./DonorDirectoryContent";
import type { BloodGroup, District, PaginatedResponse, Donor } from "@/types/shared";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/**
 * Fetch donors from backend - Server-side
 */
async function fetchDonors(params: {
  bloodGroups?: BloodGroup[];
  districts?: District[];
  search?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<Donor>> {
  const queryParams = new URLSearchParams();

  // Add array params
  if (params.bloodGroups?.length) {
    params.bloodGroups.forEach((bg) => queryParams.append("bloodGroup", bg));
  }
  if (params.districts?.length) {
    params.districts.forEach((d) => queryParams.append("district", d));
  }

  // Add scalar params
  if (params.search) queryParams.set("search", params.search);
  if (params.page) queryParams.set("page", params.page.toString());
  if (params.limit) queryParams.set("limit", params.limit.toString());

  const url = `${API_BASE_URL}/api/donors?${queryParams.toString()}`;
  
  const response = await fetch(url, {
    // Revalidate every 5 minutes (donors change less frequently than requests)
    next: { revalidate: 300, tags: ['donors'] }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch donors: ${response.statusText}`);
  }

  return response.json();
}

type PageProps = {
  searchParams: Promise<{
    bloodGroup?: string | string[];
    district?: string | string[];
    search?: string;
    page?: string;
  }>;
};

/**
 * Donor Directory Page Component (Server Component)
 * Fetches data on the server for better performance and SEO
 */
export default async function DonorDirectoryPage({ searchParams }: PageProps) {
  const params = await searchParams;
  
  // Parse search params
  const bloodGroups = Array.isArray(params.bloodGroup)
    ? params.bloodGroup
    : params.bloodGroup
    ? [params.bloodGroup]
    : [];
  const districts = Array.isArray(params.district)
    ? params.district
    : params.district
    ? [params.district]
    : [];
  const search = params.search || "";
  const page = parseInt(params.page || "1", 10);

  // Fetch data server-side
  const data = await fetchDonors({
    bloodGroups: bloodGroups as BloodGroup[],
    districts: districts as District[],
    search,
    page,
    limit: 12,
  });

  return (
    <Suspense fallback={<DonorsGridSkeleton count={12} />}>
      <DonorDirectoryContent
        initialData={data}
        initialFilters={{
          bloodGroups: bloodGroups as BloodGroup[],
          districts: districts as District[],
          search,
        }}
        initialPage={page}
      />
    </Suspense>
  );
}
