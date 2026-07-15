import { Metadata } from "next";
import { redirect } from "next/navigation";
import { ManageRequestsContent } from "./ManageRequestsContent";
import type { BloodRequest, PaginatedResponse } from "@/types/shared";
import { apiFetch } from "@/lib/api-server";

export const metadata: Metadata = {
  title: "Manage Requests | BloodOS",
  description: "View and manage your blood donation requests",
};

/**
 * Fetch user's requests - Server-side with authentication
 */
async function fetchUserRequests(
  page: number,
): Promise<PaginatedResponse<BloodRequest>> {
  const response = await apiFetch(`/api/requests/mine?page=${page}&limit=10`);

  if (response.status === 401) {
    // Redirect to login if unauthorized
    redirect("/signin?callbackUrl=/requests/manage");
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch requests: ${response.statusText}`);
  }

  return response.json();
}

type PageProps = {
  searchParams: Promise<{
    page?: string;
  }>;
};

export default async function ManageRequestsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || "1", 10);

  // Fetch data server-side with automatic cookie forwarding
  const data = await fetchUserRequests(page);

  return <ManageRequestsContent initialData={data} initialPage={page} />;
}
