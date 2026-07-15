/**
 * Donor Directory Content Component (Refactored for Server Components)
 * 
 * Client component that receives server-fetched initial data and handles
 * interactive filtering and contact requests.
 * 
 * Improvements:
 * - Receives initialData from server component
 * - Uses router.push for client-side filtering (triggers server refetch)
 * - No client-side data fetching in useEffect
 * - Optimistic UI updates with initialData
 */

"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { DonorCard } from "@/components/donors/DonorCard";
import { Filters } from "@/components/shared/Filters";
import { Pagination } from "@/components/shared/Pagination";
import type {
  Donor,
  PaginatedResponse,
  BloodGroup,
  District,
} from "@/types/shared";
import { SearchX, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api-client";
import { useSession } from "@/lib/auth-client";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function requestContactInfo(
  donorId: string
): Promise<{ phone: string; email?: string }> {
  const response = await apiFetch(`/api/donors/${donorId}/request-contact`, {
    method: "POST",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to request contact information");
  }

  return response.json();
}

type DonorDirectoryContentProps = {
  initialData: PaginatedResponse<Donor>;
  initialFilters: {
    bloodGroups: BloodGroup[];
    districts: District[];
    search: string;
  };
  initialPage: number;
};

/**
 * Donor Directory Content Component
 */
export default function DonorDirectoryContent({
  initialData,
  initialFilters,
  initialPage,
}: DonorDirectoryContentProps) {
  const router = useRouter();

  // State is initialized from server-fetched data
  const [filters, setFilters] = React.useState(initialFilters);
  const [page, setPage] = React.useState(initialPage);
  const data = initialData; // Use server data directly

  // Contact request state
  const [requestingContactFor, setRequestingContactFor] = React.useState<
    string | null
  >(null);

  // Get current session
  const { data: session } = useSession();

  // Build URL from current filters and page
  const buildUrl = React.useCallback(
    (newFilters: typeof filters, newPage: number) => {
      const queryParams = new URLSearchParams();

      if (newFilters.bloodGroups.length) {
        newFilters.bloodGroups.forEach((bg) =>
          queryParams.append("bloodGroup", bg)
        );
      }
      if (newFilters.districts.length) {
        newFilters.districts.forEach((d) => queryParams.append("district", d));
      }
      if (newFilters.search) {
        queryParams.set("search", newFilters.search);
      }
      if (newPage > 1) {
        queryParams.set("page", newPage.toString());
      }

      return queryParams.toString()
        ? `/donors?${queryParams.toString()}`
        : "/donors";
    },
    []
  );

  // Handle filter changes - triggers server refetch via router.push
  const handleFilterChange = (newFilters: {
    bloodGroups?: BloodGroup[];
    districts?: District[];
    search?: string;
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
      districts: [],
      search: "",
    };
    setFilters(clearedFilters);
    setPage(1);
    router.push("/donors");
  };
  // Handle contact request (Req 17.11-17.13)
  const handleRequestContact = async (donorId: string) => {
    // Check authentication (Req 17.11)
    if (!session?.user) {
      toast.error("Please sign in to request contact information", {
        description: "You'll be redirected to the login page",
      });
      // Redirect to login with return URL
      router.push(`/signin?callbackUrl=${encodeURIComponent("/donors")}`);
      return;
    }

    setRequestingContactFor(donorId);

    try {
      // Request contact info (Req 17.12)
      await requestContactInfo(donorId);

      // Success toast (Req 17.13)
      toast.success("Contact information sent to your notifications", {
        description: "Check your notifications panel to view the contact details",
      });
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to request contact"
      );
    } finally {
      setRequestingContactFor(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <section className="border-b border-border bg-card">
        <div className="container mx-auto max-w-7xl px-4 py-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="font-heading text-3xl font-semibold text-foreground">
                Find Donors
              </h1>
              <p className="mt-2 text-muted-foreground">
                Connect with eligible blood donors in your area
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-mono tabular-data font-medium text-foreground">
                {data.totalCount}
              </span>
              <span>{data.totalCount === 1 ? "donor" : "donors"} found</span>
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
              urgency: false, // No urgency filter for donors
              district: true,
              search: true,
              sort: false, // No sort options for donors (per spec)
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
              No Donors Found
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              {filters.search ||
              filters.bloodGroups.length ||
              filters.districts.length
                ? "Try adjusting your filters to see more donors"
                : "There are no registered donors at the moment"}
            </p>
            {(filters.search ||
              filters.bloodGroups.length ||
              filters.districts.length) && (
              <Button onClick={handleClearFilters} variant="outline">
                Clear All Filters
              </Button>
            )}
            {!filters.search &&
              !filters.bloodGroups.length &&
              !filters.districts.length && (
                <Button
                  onClick={() => router.push("/signup")}
                  className="mt-4"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Register as a Donor
                </Button>
              )}
          </div>
        )}

        {/* Results Grid */}
        {data.data.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {data.data.map((donor, index) => (
                <DonorCard
                  key={donor._id}
                  donor={donor}
                  staggerIndex={index}
                  onRequestContact={handleRequestContact}
                  isRequestingContact={requestingContactFor === donor._id}
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
