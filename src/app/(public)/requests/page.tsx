/**
 * Browse Requests Page - Phase 8b (Refactored for Server Components)
 * 
 * Public directory of blood requests with filtering, search, sorting, and pagination.
 * 
 * Requirements:
 * - Req 21.1-21.11: All browse requests functionality
 * - Req 21.2: Public route (no auth required)
 * - Req 21.3: Filters wired to GET /api/requests query params
 * - Req 21.4: Blood group, urgency, district filters + search
 * - Req 21.5: 300ms search debounce
 * - Req 21.6: Sort options (newest/oldest/most urgent/critical first)
 * - Req 21.7: 4/2/1 column grid with stagger fade-in
 * - Req 21.8: All fields displayed per RequestCard
 * - Req 21.9: Skeleton loaders during fetch
 * - Req 21.10: Pagination at bottom
 * - Req 21.11: Card click → /requests/:id
 * 
 * Design:
 * - Grid uses Phase 6a's stagger fade-in animation
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
import { RequestsGridSkeleton } from "@/components/shared/SkeletonLoaders";
import BrowseRequestsContent from "./BrowseRequestsContent";
import type { BloodGroup, District, PaginatedResponse, BloodRequest } from "@/types/shared";
import type { Urgency, SortOption } from "@/components/shared/Filters";

/**
 * Fetch requests from backend - Server-side
 */
async function fetchRequests(params: {
  bloodGroups?: BloodGroup[];
  urgencies?: Urgency[];
  districts?: District[];
  search?: string;
  sort?: SortOption;
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<BloodRequest>> {
  const queryParams = new URLSearchParams();

  // Add array params
  if (params.bloodGroups?.length) {
    params.bloodGroups.forEach((bg) => queryParams.append("bloodGroup", bg));
  }
  if (params.urgencies?.length) {
    params.urgencies.forEach((u) => queryParams.append("urgency", u));
  }
  if (params.districts?.length) {
    params.districts.forEach((d) => queryParams.append("district", d));
  }

  // Add scalar params
  if (params.search) queryParams.set("search", params.search);
  if (params.sort) queryParams.set("sort", params.sort);
  if (params.page) queryParams.set("page", params.page.toString());
  if (params.limit) queryParams.set("limit", params.limit.toString());

  // Use direct backend URL for server-side fetch (no rewrite needed on server)
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const url = `${API_BASE_URL}/api/requests?${queryParams.toString()}`;
  
  const response = await fetch(url, {
    // Revalidate every 60 seconds
    next: { revalidate: 60, tags: ['requests'] }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch requests: ${response.statusText}`);
  }

  return response.json();
}

type PageProps = {
  searchParams: Promise<{
    bloodGroup?: string | string[];
    urgency?: string | string[];
    district?: string | string[];
    search?: string;
    sort?: string;
    page?: string;
  }>;
};

/**
 * Browse Requests Page Component (Server Component)
 * Fetches data on the server for better performance and SEO
 */
export default async function BrowseRequestsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  
  // Parse search params
  const bloodGroups = Array.isArray(params.bloodGroup)
    ? params.bloodGroup
    : params.bloodGroup
    ? [params.bloodGroup]
    : [];
  const urgencies = Array.isArray(params.urgency)
    ? params.urgency
    : params.urgency
    ? [params.urgency]
    : [];
  const districts = Array.isArray(params.district)
    ? params.district
    : params.district
    ? [params.district]
    : [];
  const search = params.search || "";
  const sort = (params.sort as SortOption) || "newest";
  const page = parseInt(params.page || "1", 10);

  // Fetch data server-side
  const data = await fetchRequests({
    bloodGroups: bloodGroups as BloodGroup[],
    urgencies: urgencies as Urgency[],
    districts: districts as District[],
    search,
    sort,
    page,
    limit: 12,
  });

  return (
    <Suspense fallback={<RequestsGridSkeleton count={12} />}>
      <BrowseRequestsContent
        initialData={data}
        initialFilters={{
          bloodGroups: bloodGroups as BloodGroup[],
          urgencies: urgencies as Urgency[],
          districts: districts as District[],
          search,
          sort,
        }}
        initialPage={page}
      />
    </Suspense>
  );
}
