"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RequestCard } from "@/components/requests/RequestCard";
import { Pagination } from "@/components/shared/Pagination";
import type {
  BloodRequest,
  PaginatedResponse,
  BloodGroup,
  District,
} from "@/types/shared";
import {
  BLOOD_GROUPS,
  DISTRICTS,
  Urgency,
  SortOption,
} from "@/types/shared";
import {
  Search,
  Filter,
  X,
  PlusCircle,
  SearchX,
  AlertCircle,
  SlidersHorizontal,
  ChevronDown,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { triggerTactileFeedback, HAPTIC_PATTERNS } from "@/lib/haptics";

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

  const [filters, setFilters] = React.useState(initialFilters);
  const [searchInput, setSearchInput] = React.useState(initialFilters.search || "");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = React.useState(false);
  const data = initialData;

  // Build URL with query params
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
      if (newFilters.sort && newFilters.sort !== SortOption.NEWEST) {
        queryParams.set("sort", newFilters.sort);
      }
      if (newPage > 1) {
        queryParams.set("page", newPage.toString());
      }

      const queryString = queryParams.toString();
      return queryString ? `/requests?${queryString}` : "/requests";
    },
    []
  );

  const applyFilters = (updatedFilters: typeof filters, newPage = 1) => {
    setFilters(updatedFilters);
    router.push(buildUrl(updatedFilters, newPage));
  };

  // Toggle single blood group pill
  const toggleBloodGroup = (bg: BloodGroup) => {
    triggerTactileFeedback(HAPTIC_PATTERNS.LIGHT);
    const exists = filters.bloodGroups.includes(bg);
    const updatedBloodGroups = exists
      ? filters.bloodGroups.filter((item) => item !== bg)
      : [...filters.bloodGroups, bg];

    applyFilters({
      ...filters,
      bloodGroups: updatedBloodGroups,
    });
  };

  // Toggle urgency tier
  const handleUrgencyChange = (urgencyValue: string) => {
    triggerTactileFeedback(HAPTIC_PATTERNS.LIGHT);
    const updatedUrgencies = urgencyValue === "all" ? [] : [urgencyValue as Urgency];
    applyFilters({
      ...filters,
      urgencies: updatedUrgencies,
    });
  };

  // District filter change
  const handleDistrictChange = (districtValue: string) => {
    triggerTactileFeedback(HAPTIC_PATTERNS.LIGHT);
    const updatedDistricts = districtValue === "all" ? [] : [districtValue as District];
    applyFilters({
      ...filters,
      districts: updatedDistricts,
    });
  };

  // Sort order change
  const handleSortChange = (sortValue: string) => {
    triggerTactileFeedback(HAPTIC_PATTERNS.LIGHT);
    applyFilters({
      ...filters,
      sort: sortValue as SortOption,
    });
  };

  // Search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerTactileFeedback(HAPTIC_PATTERNS.LIGHT);
    applyFilters({
      ...filters,
      search: searchInput.trim(),
    });
  };

  // Clear all filters
  const handleClearAll = () => {
    triggerTactileFeedback(HAPTIC_PATTERNS.LIGHT);
    setSearchInput("");
    applyFilters({
      bloodGroups: [],
      urgencies: [],
      districts: [],
      search: "",
      sort: SortOption.NEWEST,
    });
  };

  const handlePageChange = (newPage: number) => {
    triggerTactileFeedback(HAPTIC_PATTERNS.LIGHT);
    router.push(buildUrl(filters, newPage));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const activeFilterCount =
    filters.bloodGroups.length +
    filters.urgencies.length +
    filters.districts.length +
    (filters.search ? 1 : 0) +
    (filters.sort && filters.sort !== SortOption.NEWEST ? 1 : 0);

  return (
    <div className="w-full min-h-[calc(100dvh-4rem)] flex flex-col bg-background text-foreground pb-24 sm:pb-16">
      {/* 1. Header Command Ribbon */}
      <section className="border-b border-border bg-muted/20 py-8 sm:py-10">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2">
              <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                Emergency Blood Triage Feed
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Real-time active hospital requisitions verified across 64 districts in Bangladesh.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link href="/requests/add">
                <Button
                  size="default"
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-semibold gap-2 shadow-xs min-h-[42px]"
                  onClick={() => triggerTactileFeedback(HAPTIC_PATTERNS.EMERGENCY_SOS)}
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Post Urgent SOS</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Quick-Select Filtering Ribbon */}
      <section className="border-b border-border bg-card sticky top-14 sm:top-16 z-30 shadow-xs">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-3.5">
          {/* Top Filter Row: Blood Group Quick-Pills & Search */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Blood Group Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
              <span className="text-xs font-mono font-semibold text-muted-foreground mr-1 hidden sm:inline">
                Blood Group:
              </span>
              <button
                type="button"
                onClick={() => {
                  triggerTactileFeedback(HAPTIC_PATTERNS.LIGHT);
                  applyFilters({ ...filters, bloodGroups: [] });
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  filters.bloodGroups.length === 0
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                ALL
              </button>
              {BLOOD_GROUPS.map((bg) => {
                const isSelected = filters.bloodGroups.includes(bg);
                return (
                  <button
                    key={bg}
                    type="button"
                    onClick={() => toggleBloodGroup(bg)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/60"
                    }`}
                  >
                    {bg}
                  </button>
                );
              })}
            </div>

            {/* Keyword Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search patient, hospital, or city..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full h-10 pl-9 pr-8 rounded-xl bg-background border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput("");
                    applyFilters({ ...filters, search: "" });
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </form>
          </div>

          {/* Secondary Controls Row: District, Urgency Tier, Sort & Clear */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-border/50 text-xs">
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Urgency Selector */}
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground font-medium text-[11px]">Urgency:</span>
                <select
                  value={filters.urgencies[0] || "all"}
                  onChange={(e) => handleUrgencyChange(e.target.value)}
                  className="h-8 rounded-lg bg-background border border-border px-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                >
                  <option value="all">All Urgencies</option>
                  <option value={Urgency.CRITICAL}>STAT / Critical</option>
                  <option value={Urgency.URGENT}>Urgent</option>
                  <option value={Urgency.MODERATE}>Moderate</option>
                </select>
              </div>

              {/* District Selector */}
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground font-medium text-[11px]">District:</span>
                <select
                  value={filters.districts[0] || "all"}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  className="h-8 rounded-lg bg-background border border-border px-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer max-w-[150px] truncate"
                >
                  <option value="all">All 64 Districts</option>
                  {DISTRICTS.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Order */}
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground font-medium text-[11px]">Sort:</span>
                <select
                  value={filters.sort || SortOption.NEWEST}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="h-8 rounded-lg bg-background border border-border px-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                >
                  <option value={SortOption.NEWEST}>Newest Requisitions</option>
                  <option value={SortOption.CRITICAL_FIRST}>Critical First</option>
                  <option value={SortOption.MOST_URGENT}>Most Urgent</option>
                  <option value={SortOption.OLDEST}>Oldest</option>
                </select>
              </div>
            </div>

            {/* Active Count & Clear Action */}
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground text-[11px] font-mono">
                <strong className="text-foreground">{data.totalCount}</strong> active{" "}
                {data.totalCount === 1 ? "requisition" : "requisitions"}
              </span>

              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-destructive hover:underline cursor-pointer"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Reset Filters ({activeFilterCount})</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Results Main Grid Section */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 flex-1">
        {data.data.length === 0 ? (
          /* Empty State */
          <div className="py-16 sm:py-24 text-center max-w-md mx-auto space-y-4">
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-muted text-muted-foreground shadow-xs">
              <SearchX className="h-7 w-7" />
            </div>
            <div className="space-y-1.5">
              <h2 className="font-heading text-xl font-bold text-foreground">
                No matching blood requisitions found
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {activeFilterCount > 0
                  ? "Try loosening your search query, selecting additional blood groups, or clearing regional district filters."
                  : "There are currently no active emergency blood requests in this feed."}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
              {activeFilterCount > 0 ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearAll}
                  className="w-full sm:w-auto text-xs"
                >
                  <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                  Clear All Filters
                </Button>
              ) : (
                <Link href="/requests/add" className="w-full sm:w-auto">
                  <Button size="sm" className="w-full sm:w-auto text-xs font-semibold bg-destructive text-destructive-foreground">
                    <PlusCircle className="h-3.5 w-3.5 mr-1.5" />
                    Post Emergency Request
                  </Button>
                </Link>
              )}
            </div>
          </div>
        ) : (
          /* High-Craft Triage Grid */
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {data.data.map((request, index) => (
                <RequestCard
                  key={request._id}
                  request={request}
                  staggerIndex={index}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {data.totalPages > 1 && (
              <div className="pt-6 border-t border-border/70">
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
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
