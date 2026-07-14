/**
 * SkeletonLoaders — Usage Examples
 * 
 * This file demonstrates how to use skeleton loaders during data fetching.
 * DO NOT import this file in production code — it's documentation only.
 */

import * as React from "react";
import {
  RequestCardSkeleton,
  DonorCardSkeleton,
  RequestsGridSkeleton,
  DonorsGridSkeleton,
  TableSkeleton,
  RequestDetailSkeleton,
  ProfileSectionSkeleton,
  Skeleton,
} from "./SkeletonLoaders";
import { RequestCard } from "@/components/requests/RequestCard";
import { DonorCard } from "@/components/donors/DonorCard";
import type { BloodRequest, Donor, PaginatedResponse } from "@/types/shared";

// ============================================================================
// Example 1: Single Card Skeleton (for detail views)
// ============================================================================

export function SingleRequestCardExample() {
  const [request, setRequest] = React.useState<BloodRequest | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchRequest = async () => {
      setLoading(true);
      const response = await fetch("/api/requests/123");
      const data = await response.json();
      setRequest(data);
      setLoading(false);
    };

    fetchRequest();
  }, []);

  if (loading) {
    return <RequestCardSkeleton />;
  }

  return request ? <RequestCard request={request} /> : null;
}

// ============================================================================
// Example 2: Grid Skeleton (for directory pages)
// ============================================================================

export function RequestsGridExample() {
  const [data, setData] = React.useState<PaginatedResponse<BloodRequest> | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      const response = await fetch("/api/requests?page=1&limit=12");
      const result = await response.json();
      setData(result);
      setLoading(false);
    };

    fetchRequests();
  }, []);

  if (loading) {
    return <RequestsGridSkeleton count={12} />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {data?.data.map((request, index) => (
        <RequestCard key={request._id} request={request} staggerIndex={index} />
      ))}
    </div>
  );
}

// ============================================================================
// Example 3: Donors Grid with Filter Changes
// ============================================================================

export function DonorsGridWithFiltersExample() {
  const [data, setData] = React.useState<PaginatedResponse<Donor> | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [filters, setFilters] = React.useState({
    bloodGroup: "A+",
    district: "Dhaka",
  });

  React.useEffect(() => {
    const fetchDonors = async () => {
      setLoading(true);
      const response = await fetch(
        `/api/donors?bloodGroup=${filters.bloodGroup}&district=${filters.district}&page=1&limit=12`
      );
      const result = await response.json();
      setData(result);
      setLoading(false);
    };

    fetchDonors();
  }, [filters]);

  // Show skeleton whenever filters change (good UX for filter changes)
  if (loading) {
    return <DonorsGridSkeleton count={12} />;
  }

  return (
    <div>
      {/* Filters would go here */}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {data?.data.map((donor, index) => (
          <DonorCard key={donor._id} donor={donor} staggerIndex={index} />
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Example 4: Request Detail Page Skeleton
// ============================================================================

export function RequestDetailPageExample() {
  const [request, setRequest] = React.useState<BloodRequest | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchRequest = async () => {
      setLoading(true);
      const response = await fetch("/api/requests/123");
      const data = await response.json();
      setRequest(data);
      setLoading(false);
    };

    fetchRequest();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <RequestDetailSkeleton />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {/* Actual request detail content */}
      <h1 className="font-heading text-3xl">{request?.patientName}</h1>
      {/* ... rest of detail page */}
    </div>
  );
}

// ============================================================================
// Example 5: Admin Dashboard Table Skeleton
// ============================================================================

export function AdminModerationTableExample() {
  const [requests, setRequests] = React.useState<BloodRequest[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      // Note: This is example code. In production, use apiFetch from @/lib/api-client
      // to ensure JWT token is included for authentication
      const response = await fetch("/api/admin/requests/pending");
      const data = await response.json();
      setRequests(data);
      setLoading(false);
    };

    fetchRequests();
  }, []);

  return (
    <div className="rounded-lg border border-border">
      {loading ? (
        <TableSkeleton rows={10} columns={6} />
      ) : (
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left text-sm font-medium">ID</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Patient</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Blood Group</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Created</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request._id} className="border-b border-border">
                <td className="px-4 py-3 font-mono text-sm">{request._id.slice(0, 8)}</td>
                <td className="px-4 py-3 text-sm">{request.patientName}</td>
                <td className="px-4 py-3 font-mono text-sm">{request.bloodGroup}</td>
                <td className="px-4 py-3 text-sm">{request.status}</td>
                <td className="px-4 py-3 text-sm">{request.createdAt}</td>
                <td className="px-4 py-3">
                  <button className="text-sm text-teal hover:underline">Review</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// ============================================================================
// Example 6: Profile Page Section Skeleton
// ============================================================================

export function ProfileDonationHistoryExample() {
  const [donations, setDonations] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchDonations = async () => {
      setLoading(true);
      const response = await fetch("/api/users/me/donations");
      const data = await response.json();
      setDonations(data);
      setLoading(false);
    };

    fetchDonations();
  }, []);

  if (loading) {
    return <ProfileSectionSkeleton />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-xl">Donation History</h2>
        <button className="text-sm text-teal hover:underline">View All</button>
      </div>

      <div className="space-y-3">
        {donations.map((donation) => (
          <div
            key={donation._id}
            className="flex items-center justify-between p-4 border border-border rounded-lg"
          >
            <div>
              <p className="text-sm font-medium">{donation.hospitalName}</p>
              <p className="text-xs text-muted-foreground">{donation.district}</p>
            </div>
            <span className="text-sm font-mono tabular-data">
              {new Date(donation.donationDate).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Example 7: Conditional Loading (Refetch on Page Change)
// ============================================================================

export function PaginatedRequestsExample() {
  const [page, setPage] = React.useState(1);
  const [data, setData] = React.useState<PaginatedResponse<BloodRequest> | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      const response = await fetch(`/api/requests?page=${page}&limit=12`);
      const result = await response.json();
      setData(result);
      setLoading(false);
    };

    fetchRequests();
  }, [page]);

  return (
    <div className="space-y-6">
      {loading ? (
        <RequestsGridSkeleton count={12} />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {data?.data.map((request, index) => (
              <RequestCard key={request._id} request={request} staggerIndex={index} />
            ))}
          </div>

          {/* Pagination controls would go here */}
        </>
      )}
    </div>
  );
}

// ============================================================================
// Example 8: Custom Skeleton (using base Skeleton primitive)
// ============================================================================

export function CustomFormSkeletonExample() {
  return (
    <div className="space-y-4 p-6">
      {/* Form field */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" /> {/* Label */}
        <Skeleton className="h-10 w-full rounded-md" /> {/* Input */}
      </div>

      {/* Form field */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" /> {/* Label */}
        <Skeleton className="h-10 w-full rounded-md" /> {/* Input */}
      </div>

      {/* Form field */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" /> {/* Label */}
        <Skeleton className="h-24 w-full rounded-md" /> {/* Textarea */}
      </div>

      {/* Submit button */}
      <Skeleton className="h-10 w-32 rounded-md" />
    </div>
  );
}

// ============================================================================
// Example 9: Inline Loading (for small components)
// ============================================================================

export function InlineSkeletonExample() {
  const [userName, setUserName] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const response = await fetch("/api/users/me");
      const data = await response.json();
      setUserName(data.name);
      setLoading(false);
    };

    fetchUser();
  }, []);

  return (
    <div className="flex items-center gap-3 p-4 border border-border rounded-lg">
      {/* Avatar skeleton or actual avatar */}
      {loading ? (
        <Skeleton className="h-10 w-10 rounded-full" />
      ) : (
        <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
          {userName?.[0]}
        </div>
      )}

      <div className="flex-1">
        {loading ? (
          <>
            <Skeleton className="h-4 w-32 mb-1" />
            <Skeleton className="h-3 w-24" />
          </>
        ) : (
          <>
            <p className="text-sm font-medium">{userName}</p>
            <p className="text-xs text-muted-foreground">View Profile</p>
          </>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Example 10: Optimistic Loading (show skeleton during mutation)
// ============================================================================

export function OptimisticLoadingExample() {
  const [requests, setRequests] = React.useState<BloodRequest[]>([]);
  const [isDeleting, setIsDeleting] = React.useState<string | null>(null);

  const handleDelete = async (requestId: string) => {
    setIsDeleting(requestId);
    await fetch(`/api/requests/${requestId}`, { method: "DELETE" });
    setRequests((prev) => prev.filter((r) => r._id !== requestId));
    setIsDeleting(null);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {requests.map((request, index) => {
        // Show skeleton during deletion
        if (isDeleting === request._id) {
          return <RequestCardSkeleton key={request._id} staggerIndex={index} />;
        }

        return (
          <div key={request._id} className="relative">
            <RequestCard request={request} staggerIndex={index} />
            <button
              onClick={() => handleDelete(request._id)}
              className="absolute top-2 right-2 text-destructive hover:underline"
            >
              Delete
            </button>
          </div>
        );
      })}
    </div>
  );
}
