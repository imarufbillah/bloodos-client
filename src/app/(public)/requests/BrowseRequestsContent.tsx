"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { RequestCard } from "@/components/requests/RequestCard";
import { Filters } from "@/components/shared/Filters";
import { Pagination } from "@/components/shared/Pagination";
import type {
  BloodRequest,
  PaginatedResponse,
  BloodGroup,
  District,
} from "@/types/shared";
import type { Urgency, SortOption } from "@/components/shared/Filters";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

type BrowseRequestsContentProps = {
  initialData: PaginatedResponse<BloodRequest>;
  initialFilters: {
    bloodGroups: BloodGroup[];
    urgencies: Urgency[];
    districts: District[];
    search: string;
    sort?: SortOption;
  };
  initialPage: number;
};

export default function BrowseRequestsContent({
  initialData,
  initialFilters,
  initialPage,
}: BrowseRequestsContentProps) {
  const router = useRouter();

  // State is initialized from server-fetched data
  const [filters, setFilters] = React.useState(initialFilters);
  const [page, setPage] = React.useState(initialPage);
  const data = initialData; // Use server data directly

  // Build URL from current filters and page
  const buildUrl = React.useCallback(
    (newFilters: typeof filters, newPage: number) => {
      const queryParams = new URLSearchParams();

      if (newFilters.bloodGroups.length) {
        newFilters.bloodGroups.forEach((bg) =>
          queryParams.append("bloodGroup", bg)
        );
      }
      if (newFilters.urgencies.length) {
        newFilters.urgencies.forEach((u) => queryParams.append("urgency", u));
      }
      if (newFilters.districts.length) {
        newFilters.districts.forEach((d) => queryParams.append("district", d));
      }
      if (newFilters.search) {
        queryParams.set("search", newFilters.search);
      }
      if (newFilters.sort) {
        queryParams.set("sort", newFilters.sort);
      }
      if (newPage > 1) {
        queryParams.set("page", newPage.toString());
      }

      return queryParams.toString()
        ? `/requests?${queryParams.toString()}`
        : "/requests";
    },
    []
  );

  // Handle filter changes - triggers server refetch via router.push
  const handleFilterChange = (newFilters: {
    bloodGroups?: BloodGroup[];
    urgencies?: Urgency[];
    districts?: District[];
    search?: string;
    sort?: SortOption;
  }) => {
    const updatedFilters = {
      ...filters,
      ...newFilters,
    };
    setFilters(updatedFilters);
    setPage(1); // Reset to page 1 when filters change
    
    // Navigate to new URL - triggers server refetch
    router.push(buildUrl(updatedFilters, 1));
  };

  // Handle page change - triggers server refetch via router.push
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    
    // Navigate to new URL - triggers server refetch
    router.push(buildUrl(filters, newPage));
    
    // Scroll to top of results
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle clear all filters
  const handleClearFilters = () => {
    const clearedFilters = {
      bloodGroups: [],
      urgencies: [],
      districts: [],
      search: "",
      sort: "newest" as SortOption,
    };
    setFilters(clearedFilters);
    setPage(1);
    router.push("/requests");
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
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-mono tabular-data font-medium text-foreground">
                {data.totalCount}
              </span>
              <span>
                {data.totalCount === 1 ? "request" : "requests"} found
              </span>
            </div>
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
        {/* Empty State */}
        {data.data.length === 0 && (
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
              <Button onClick={handleClearFilters} variant="outline">
                Clear All Filters
              </Button>
            )}
          </div>
        )}

        {/* Results Grid */}
        {data.data.length > 0 && (
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
