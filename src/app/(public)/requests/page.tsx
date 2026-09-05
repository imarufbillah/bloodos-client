import { Suspense } from "react";
import { Metadata } from "next";
import Loading from "./loading";
import BrowseRequestsContent from "./BrowseRequestsContent";
import type {
  BloodGroup,
  District,
  PaginatedResponse,
  BloodRequest,
  Urgency,
  SortOption,
} from "@/types/shared";

export const metadata: Metadata = {
  title: "Live Emergency Blood Requests | BloodOS Bangladesh",
  description:
    "Real-time emergency blood requests feed across 64 districts in Bangladesh. Search by ABO/Rh blood group, district, and urgency level.",
};

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

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const url = `${API_BASE_URL}/api/requests?${queryParams.toString()}`;

  try {
    const response = await fetch(url, {
      next: { revalidate: 30, tags: ["requests"] },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch requests: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching requests:", error);
    return {
      data: [],
      page: 1,
      limit: params.limit || 12,
      totalPages: 0,
      totalCount: 0,
      hasNextPage: false,
      hasPrevPage: false,
    };
  }
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
    <Suspense fallback={<Loading />}>
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
