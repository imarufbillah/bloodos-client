/**
 * Browse Requests Content Component
 * 
 * Main content component for browse requests page.
 * Separated from page.tsx to handle Suspense boundary for useSearchParams.
 */

"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { RequestCard } from "@/components/requests/RequestCard";
import { Filters } from "@/components/shared/Filters";
import { Pagination } from "@/components/shared/Pagination";
import { RequestsGridSkeleton } from "@/components/shared/SkeletonLoaders";
import type {
  BloodRequest,
  PaginatedResponse,
  BloodGroup,
  District,
} from "@/types/shared";
import type { Urgency, SortOption } from "@/components/shared/Filters";
import { AlertCircle, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * API endpoint for fetching blood requests
 * TODO: Replace with actual backend URL from env
 */
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/**
 * Fetch requests from backend with query params
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

  const url = `${API_BASE_URL}/api/requests?${queryParams.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch requests: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Browse Requests Content Component
 */
export default function BrowseRequestsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse URL search params into filter state
  const [filters, setFilters] = React.useState<{
    bloodGroups: BloodGroup[];
    urgencies: Urgency[];
    districts: District[];
    search: string;
    sort?: SortOption;
  }>({
    bloodGroups: searchParams.getAll("bloodGroup") as BloodGroup[],
    urgencies: searchParams.getAll("urgency") as Urgency[],
    districts: searchParams.getAll("district") as District[],
    search: searchParams.get("search") || "",
    sort: (searchParams.get("sort") as SortOption) || "newest",
  });

  const [page, setPage] = React.useState(
    parseInt(searchParams.get("page") || "1", 10)
  );

  // Data fetching state
  const [data, setData] =
    React.useState<PaginatedResponse<BloodRequest> | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Fetch data when filters or page changes
  React.useEffect(() => {
    const loadRequests = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await fetchRequests({
          ...filters,
          page,
          limit: 12, // 12 cards per page (4×3 grid on desktop)
        });
        setData(result);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load requests"
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadRequests();
  }, [filters, page]);

  // Update URL when filters change
  React.useEffect(() => {
    const queryParams = new URLSearchParams();

    if (filters.bloodGroups.length) {
      filters.bloodGroups.forEach((bg) => queryParams.append("bloodGroup", bg));
    }
    if (filters.urgencies.length) {
      filters.urgencies.forEach((u) => queryParams.append("urgency", u));
    }
    if (filters.districts.length) {
      filters.districts.forEach((d) => queryParams.append("district", d));
    }
    if (filters.search) {
      queryParams.set("search", filters.search);
    }
    if (filters.sort) {
      queryParams.set("sort", filters.sort);
    }
    if (page > 1) {
      queryParams.set("page", page.toString());
    }

    // Update URL without triggering navigation
    const newUrl = queryParams.toString()
      ? `/requests?${queryParams.toString()}`
      : "/requests";
    router.replace(newUrl, { scroll: false });
  }, [filters, page, router]);

  // Handle filter changes
  const handleFilterChange = (newFilters: {
    bloodGroups?: BloodGroup[];
    urgencies?: Urgency[];
    districts?: District[];
    search?: string;
    sort?: SortOption;
  }) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
    setPage(1); // Reset to page 1 when filters change
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    // Scroll to top of results
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <section className="border-b border-border bg-card">
        <div className="container mx-auto max-w-7xl px-4 py-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="font-heading text-3xl font-semibold text-foreground">
                Blood Requests
              </h1>
              <p className="mt-2 text-muted-foreground">
                Browse urgent blood donation requests near you
              </p>
            </div>
            {data && !isLoading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-mono tabular-data font-medium text-foreground">
                  {data.totalCount}
                </span>
                <span>
                  {data.totalCount === 1 ? "request" : "requests"} found
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="border-b border-border bg-card">
        <div className="container mx-auto max-w-7xl px-4 py-4">
          <Filters
            fields={{
              bloodGroup: true,
              urgency: true,
              district: true,
              search: true,
              sort: true,
            }}
            value={filters}
            onChange={handleFilterChange}
          />
        </div>
      </section>

      {/* Results Section */}
      <section className="container mx-auto max-w-7xl px-4 py-8">
        {/* Loading State */}
        {isLoading && <RequestsGridSkeleton count={12} />}

        {/* Error State */}
        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <h2 className="font-heading text-xl font-semibold text-foreground mb-2">
              Failed to Load Requests
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              {error}
            </p>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && data && data.data.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <SearchX className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="font-heading text-xl font-semibold text-foreground mb-2">
              No Requests Found
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              {filters.search ||
              filters.bloodGroups.length ||
              filters.urgencies.length ||
              filters.districts.length
                ? "Try adjusting your filters to see more results"
                : "There are no blood requests at the moment"}
            </p>
            {(filters.search ||
              filters.bloodGroups.length ||
              filters.urgencies.length ||
              filters.districts.length) && (
              <Button
                onClick={() =>
                  setFilters({
                    bloodGroups: [],
                    urgencies: [],
                    districts: [],
                    search: "",
                    sort: "newest",
                  })
                }
                variant="outline"
              >
                Clear All Filters
              </Button>
            )}
          </div>
        )}

        {/* Results Grid */}
        {!isLoading && !error && data && data.data.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {data.data.map((request, index) => (
                <RequestCard
                  key={request._id}
                  request={request}
                  staggerIndex={index}
                />
              ))}
            </div>

            {/* Pagination */}
            {data.totalPages > 1 && (
              <Pagination
                metadata={{
                  page: data.page,
                  limit: data.limit,
                  totalPages: data.totalPages,
                  totalCount: data.totalCount,
                  hasNextPage: data.hasNextPage,
                  hasPrevPage: data.hasPrevPage,
                }}
                onPageChange={handlePageChange}
                showTotalCount={true}
              />
            )}
          </>
        )}
      </section>
    </div>
  );
}
