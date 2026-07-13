/**
 * Filters Component Usage Examples
 * 
 * This file demonstrates the two main usage patterns for the Filters component:
 * 1. /requests page (full filter set with urgency and sort)
 * 2. /donors page (simplified filter set)
 */

"use client";

import * as React from "react";
import { Filters, type SortOption } from "./Filters";
import type { BloodGroup } from "@/lib/constants/bloodGroups";
import type { District } from "@/lib/constants/districts";
import type { Urgency } from "./Filters";

/**
 * Example 1: /requests page filters
 * Includes: bloodGroup, urgency, district, search, sort
 * Per Req 21.4-21.6
 */
export function RequestsPageFiltersExample() {
  const [filters, setFilters] = React.useState<{
    bloodGroups?: BloodGroup[];
    urgencies?: Urgency[];
    districts?: District[];
    search?: string;
    sort?: SortOption;
  }>({
    bloodGroups: [],
    urgencies: [],
    districts: [],
    search: "",
    sort: "newest",
  });

  // In a real implementation, this would trigger API call with new filters
  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    console.log("Filters changed:", newFilters);
    // Example: fetchRequests({ ...newFilters, page: 1 })
  };

  return (
    <div className="p-4">
      <h2 className="font-heading text-lg mb-4">
        Requests Page Filters (Full Set)
      </h2>
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
      
      {/* Debug output */}
      <div className="mt-4 p-3 bg-muted rounded-lg">
        <p className="text-xs text-muted-foreground font-mono">
          Current filters: {JSON.stringify(filters, null, 2)}
        </p>
      </div>
    </div>
  );
}

/**
 * Example 2: /donors page filters
 * Includes: bloodGroup, district only
 * Per Req 17.6
 */
export function DonorsPageFiltersExample() {
  const [filters, setFilters] = React.useState<{
    bloodGroups?: BloodGroup[];
    districts?: District[];
    search?: string;
  }>({
    bloodGroups: [],
    districts: [],
    search: "",
  });

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    console.log("Donor filters changed:", newFilters);
    // Example: fetchDonors({ ...newFilters, page: 1 })
  };

  return (
    <div className="p-4">
      <h2 className="font-heading text-lg mb-4">
        Donors Page Filters (Simplified)
      </h2>
      <Filters
        fields={{
          bloodGroup: true,
          urgency: false, // donors don't have urgency
          district: true,
          search: true,
          sort: false, // donors typically sorted by last donation date server-side
        }}
        value={filters}
        onChange={handleFilterChange}
      />
      
      {/* Debug output */}
      <div className="mt-4 p-3 bg-muted rounded-lg">
        <p className="text-xs text-muted-foreground font-mono">
          Current filters: {JSON.stringify(filters, null, 2)}
        </p>
      </div>
    </div>
  );
}

/**
 * Example 3: Integration with API fetch
 * Shows how to wire filters to actual data fetching
 */
export function FiltersWithAPIExample() {
  const [filters, setFilters] = React.useState<{
    bloodGroups?: BloodGroup[];
    urgencies?: Urgency[];
    districts?: District[];
    search?: string;
    sort?: SortOption;
  }>({
    bloodGroups: [],
    urgencies: [],
    districts: [],
    search: "",
    sort: "newest",
  });

  // Simulate API call
  React.useEffect(() => {
    const fetchData = async () => {
      // Build query params from filters
      const params = new URLSearchParams();
      
      if (filters.bloodGroups?.length) {
        params.append("bloodGroup", filters.bloodGroups.join(","));
      }
      if (filters.urgencies?.length) {
        params.append("urgency", filters.urgencies.join(","));
      }
      if (filters.districts?.length) {
        params.append("district", filters.districts.join(","));
      }
      if (filters.search) {
        params.append("search", filters.search);
      }
      if (filters.sort) {
        params.append("sort", filters.sort);
      }

      console.log("Fetching with params:", params.toString());
      // Example: const response = await fetch(`/api/requests?${params}`);
    };

    fetchData();
  }, [filters]);

  return (
    <div className="p-4">
      <h2 className="font-heading text-lg mb-4">
        Filters with API Integration
      </h2>
      <Filters
        fields={{
          bloodGroup: true,
          urgency: true,
          district: true,
          search: true,
          sort: true,
        }}
        value={filters}
        onChange={setFilters}
      />
      
      <p className="mt-4 text-sm text-muted-foreground">
        Check browser console for API call simulation
      </p>
    </div>
  );
}
