/**
 * Pagination Component — Usage Examples
 * 
 * This file demonstrates how to use the Pagination component with real API responses.
 * DO NOT import this file in production code — it's documentation only.
 */

import * as React from "react";
import { Pagination } from "./Pagination";
import type { PaginatedResponse, BloodRequest, Donor } from "@/types/shared";

// ============================================================================
// Example 1: Paginated Requests List (for /requests page)
// ============================================================================

export function RequestsListExample() {
  const [page, setPage] = React.useState(1);
  const [data, setData] = React.useState<PaginatedResponse<BloodRequest> | null>(null);

  // Fetch requests when page changes
  React.useEffect(() => {
    const fetchRequests = async () => {
      const response = await fetch(
        `/api/requests?page=${page}&limit=12&bloodGroup=A+&urgency=critical`
      );
      const result: PaginatedResponse<BloodRequest> = await response.json();
      setData(result);
    };

    fetchRequests();
  }, [page]);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Render request cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.data.map((request) => (
          <div key={request._id} className="border rounded-lg p-4">
            <h3 className="font-heading">{request.patientName}</h3>
            <p className="text-sm text-muted-foreground">{request.hospitalName}</p>
          </div>
        ))}
      </div>

      {/* Pagination controls */}
      <Pagination
        metadata={{
          page: data.page,
          limit: data.limit,
          totalPages: data.totalPages,
          totalCount: data.totalCount,
          hasNextPage: data.hasNextPage,
          hasPrevPage: data.hasPrevPage,
        }}
        onPageChange={setPage}
        showTotalCount={true}
      />
    </div>
  );
}

// ============================================================================
// Example 2: Paginated Donors Directory (for /donors page)
// ============================================================================

export function DonorsDirectoryExample() {
  const [page, setPage] = React.useState(1);
  const [data, setData] = React.useState<PaginatedResponse<Donor> | null>(null);

  React.useEffect(() => {
    const fetchDonors = async () => {
      const response = await fetch(
        `/api/donors?page=${page}&limit=20&bloodGroup=O-&district=Dhaka`
      );
      const result: PaginatedResponse<Donor> = await response.json();
      setData(result);
    };

    fetchDonors();
  }, [page]);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Render donor cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.data.map((donor) => (
          <div key={donor._id} className="border rounded-lg p-4">
            <h3 className="font-heading">{donor.name}</h3>
            <p className="text-sm font-mono">{donor.bloodGroup}</p>
          </div>
        ))}
      </div>

      {/* Pagination controls */}
      <Pagination
        metadata={data}
        onPageChange={setPage}
        showTotalCount={true}
      />
    </div>
  );
}

// ============================================================================
// Example 3: Compact Pagination (without total count)
// ============================================================================

export function CompactPaginationExample() {
  const [page, setPage] = React.useState(1);
  const mockData: PaginatedResponse<unknown> = {
    data: [],
    page: 3,
    limit: 10,
    totalPages: 25,
    totalCount: 247,
    hasNextPage: true,
    hasPrevPage: true,
  };

  return (
    <Pagination
      metadata={mockData}
      onPageChange={setPage}
      showTotalCount={false} // Hide "Showing X-Y of Z results"
    />
  );
}

// ============================================================================
// Example 4: Edge Cases — Single Page
// ============================================================================

export function SinglePageExample() {
  const mockData: PaginatedResponse<unknown> = {
    data: [],
    page: 1,
    limit: 10,
    totalPages: 1,
    totalCount: 8,
    hasNextPage: false,
    hasPrevPage: false,
  };

  return (
    <div>
      <p>When totalPages is 1, pagination doesn't render at all:</p>
      <Pagination
        metadata={mockData}
        onPageChange={() => {}}
        showTotalCount={true}
      />
      <p className="text-muted-foreground text-sm">(Nothing rendered above)</p>
    </div>
  );
}

// ============================================================================
// Example 5: Edge Cases — Empty Results
// ============================================================================

export function EmptyResultsExample() {
  const mockData: PaginatedResponse<unknown> = {
    data: [],
    page: 1,
    limit: 10,
    totalPages: 0,
    totalCount: 0,
    hasNextPage: false,
    hasPrevPage: false,
  };

  return (
    <div>
      <p>When totalCount is 0, pagination doesn't render:</p>
      <Pagination
        metadata={mockData}
        onPageChange={() => {}}
        showTotalCount={true}
      />
      <p className="text-muted-foreground text-sm">(Nothing rendered above)</p>
    </div>
  );
}

// ============================================================================
// Example 6: Large Page Count (ellipsis rendering)
// ============================================================================

export function LargePageCountExample() {
  const [page, setPage] = React.useState(15);
  const mockData: PaginatedResponse<unknown> = {
    data: [],
    page: page,
    limit: 10,
    totalPages: 50,
    totalCount: 497,
    hasNextPage: true,
    hasPrevPage: true,
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Current page: {page} / {mockData.totalPages}
      </p>
      <Pagination
        metadata={mockData}
        onPageChange={setPage}
        showTotalCount={true}
      />
      <p className="text-sm text-muted-foreground">
        Notice the ellipsis (…) between page ranges for better UX on large datasets.
      </p>
    </div>
  );
}

// ============================================================================
// Example 7: Integration with URL Query Params (recommended pattern)
// ============================================================================

export function URLIntegrationExample() {
  // This example shows the recommended pattern for real pages:
  // sync pagination state with URL search params for shareable links

  const [searchParams, setSearchParams] = React.useState(new URLSearchParams());
  const page = parseInt(searchParams.get("page") ?? "1", 10);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    setSearchParams(params);
    // In a real Next.js page, use: router.push(`?${params.toString()}`)
  };

  const mockData: PaginatedResponse<unknown> = {
    data: [],
    page: page,
    limit: 12,
    totalPages: 8,
    totalCount: 94,
    hasNextPage: page < 8,
    hasPrevPage: page > 1,
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Current URL: ?{searchParams.toString()}
      </p>
      <Pagination
        metadata={mockData}
        onPageChange={handlePageChange}
        showTotalCount={true}
      />
    </div>
  );
}
