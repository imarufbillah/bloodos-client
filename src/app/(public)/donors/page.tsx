import { Suspense } from "react";
import { DonorsGridSkeleton } from "@/components/shared/SkeletonLoaders";
import DonorDirectoryContent from "./DonorDirectoryContent";
import type {
  BloodGroup,
  District,
  PaginatedResponse,
  Donor,
} from "@/types/shared";

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
    next: { revalidate: 300, tags: ["donors"] },
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
