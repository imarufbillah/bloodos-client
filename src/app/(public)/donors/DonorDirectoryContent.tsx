/**
 * Donor Directory Content Component
 * 
 * Main content component for donor directory page.
 * Separated from page.tsx to handle Suspense boundary for useSearchParams.
 */

"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DonorCard } from "@/components/donors/DonorCard";
import { Filters } from "@/components/shared/Filters";
import { Pagination } from "@/components/shared/Pagination";
import { DonorsGridSkeleton } from "@/components/shared/SkeletonLoaders";
import type {
  Donor,
  PaginatedResponse,
  BloodGroup,
  District,
} from "@/types/shared";
import { AlertCircle, SearchX, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

/**
 * API endpoint for fetching donors
 * TODO: Replace with actual backend URL from env
 */
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/**
 * Fetch donors from backend with query params
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
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch donors: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Request contact information for a donor (Req 17.12)
 */
async function requestContactInfo(
  donorId: string,
  sessionToken?: string
): Promise<{ phone: string; email?: string }> {
  const url = `${API_BASE_URL}/api/donors/${donorId}/request-contact`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(sessionToken && { Authorization: `Bearer ${sessionToken}` }),
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to request contact information");
  }

  return response.json();
}

/**
 * Donor Directory Content Component
 */
export default function DonorDirectoryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse URL search params into filter state
  const [filters, setFilters] = React.useState<{
    bloodGroups: BloodGroup[];
    districts: District[];
    search: string;
  }>({
    bloodGroups: searchParams.getAll("bloodGroup") as BloodGroup[],
    districts: searchParams.getAll("district") as District[],
    search: searchParams.get("search") || "",
  });

  const [page, setPage] = React.useState(
    parseInt(searchParams.get("page") || "1", 10)
  );

  // Data fetching state
  const [data, setData] = React.useState<PaginatedResponse<Donor> | null>(
    null
  );
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Contact request state
  const [requestingContactFor, setRequestingContactFor] = React.useState<
    string | null
  >(null);

  // Get current session
  const { data: session } = authClient.useSession();

  // Fetch data when filters or page changes
  React.useEffect(() => {
    const loadDonors = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await fetchDonors({
          ...filters,
          page,
          limit: 12, // 12 cards per page (4×3 grid on desktop)
        });
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load donors");
      } finally {
        setIsLoading(false);
      }
    };

    loadDonors();
  }, [filters, page]);

  // Update URL when filters change
  React.useEffect(() => {
    const queryParams = new URLSearchParams();

    if (filters.bloodGroups.length) {
      filters.bloodGroups.forEach((bg) => queryParams.append("bloodGroup", bg));
    }
    if (filters.districts.length) {
      filters.districts.forEach((d) => queryParams.append("district", d));
    }
    if (filters.search) {
      queryParams.set("search", filters.search);
    }
    if (page > 1) {
      queryParams.set("page", page.toString());
    }

    // Update URL without triggering navigation
    const newUrl = queryParams.toString()
      ? `/donors?${queryParams.toString()}`
      : "/donors";
    router.replace(newUrl, { scroll: false });
  }, [filters, page, router]);

  // Handle filter changes
  const handleFilterChange = (newFilters: {
    bloodGroups?: BloodGroup[];
    districts?: District[];
    search?: string;
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
      await requestContactInfo(donorId, session.session.token);

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
            {data && !isLoading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-mono tabular-data font-medium text-foreground">
                  {data.totalCount}
                </span>
                <span>{data.totalCount === 1 ? "donor" : "donors"} found</span>
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
        {/* Loading State */}
        {isLoading && <DonorsGridSkeleton count={12} />}

        {/* Error State */}
        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <h2 className="font-heading text-xl font-semibold text-foreground mb-2">
              Failed to Load Donors
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md">{error}</p>
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
              <Button
                onClick={() =>
                  setFilters({
                    bloodGroups: [],
                    districts: [],
                    search: "",
                  })
                }
                variant="outline"
              >
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
        {!isLoading && !error && data && data.data.length > 0 && (
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
