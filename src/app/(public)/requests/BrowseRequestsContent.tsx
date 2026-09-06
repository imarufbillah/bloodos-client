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
  X,
  PlusCircle,
  SearchX,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  const [isFiltersOpen, setIsFiltersOpen] = React.useState(false);
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
  const handleUrgencyChange = (urgencyValue: string | null) => {
    triggerTactileFeedback(HAPTIC_PATTERNS.LIGHT);
    const val = urgencyValue || "all";
    const updatedUrgencies = val === "all" ? [] : [val as Urgency];
    applyFilters({
      ...filters,
      urgencies: updatedUrgencies,
    });
  };

  // District filter change
  const handleDistrictChange = (districtValue: string | null) => {
    triggerTactileFeedback(HAPTIC_PATTERNS.LIGHT);
    const val = districtValue || "all";
    const updatedDistricts = val === "all" ? [] : [val as District];
    applyFilters({
      ...filters,
      districts: updatedDistricts,
    });
  };

  // Sort order change
  const handleSortChange = (sortValue: string | null) => {
    triggerTactileFeedback(HAPTIC_PATTERNS.LIGHT);
    applyFilters({
      ...filters,
      sort: (sortValue || SortOption.NEWEST) as SortOption,
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
      {/* 1. Header Ribbon */}
      <section className="border-b border-border bg-muted/20 py-8 sm:py-10">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-1.5">
              <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                Emergency Blood Requests
              </h1>
              <p className="text-sm text-muted-foreground">
                Verified hospital requisitions needing urgent donor response across Bangladesh.
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
                  <span>Post Blood Request</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Tactical Filtering & Search Ribbon */}
      <section className="border-b border-border bg-card/95 backdrop-blur-md sticky top-14 sm:top-16 z-20 shadow-xs">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-3 space-y-2.5">
          {/* Main Bar: Keyword Search + Filter Toggle Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
            {/* Keyword Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative flex-1" role="search">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" aria-hidden="true" />
              <input
                type="text"
                placeholder="Search patient name, hospital, or city..."
                aria-label="Search blood requests by patient name, hospital, or city"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full h-10 pl-9 pr-9 rounded-xl bg-background border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all shadow-xs"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput("");
                    applyFilters({ ...filters, search: "" });
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-foreground cursor-pointer rounded-lg hover:bg-muted/60"
                  aria-label="Clear search text"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </form>

            {/* Filter Toggle Button */}
            <div className="flex items-center gap-2 shrink-0">
              <Button
                type="button"
                variant={isFiltersOpen ? "default" : "outline"}
                size="default"
                onClick={() => {
                  triggerTactileFeedback(HAPTIC_PATTERNS.LIGHT);
                  setIsFiltersOpen(!isFiltersOpen);
                }}
                aria-expanded={isFiltersOpen}
                aria-controls="requests-filter-panel"
                className={`h-10 px-3.5 rounded-xl text-xs font-semibold gap-2 shadow-xs transition-all cursor-pointer ${
                  isFiltersOpen
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 border-transparent shadow-xs font-bold"
                    : activeFilterCount > 0
                      ? "border-primary text-primary bg-primary/10 hover:bg-primary/15 font-bold"
                      : "border-border text-foreground hover:bg-muted/80 bg-background"
                }`}
              >
                <SlidersHorizontal
                  className={`h-3.5 w-3.5 ${
                    isFiltersOpen
                      ? "text-primary-foreground"
                      : activeFilterCount > 0
                        ? "text-primary"
                        : "text-muted-foreground"
                  }`}
                />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span
                    className={`flex items-center justify-center h-4.5 px-1.5 rounded-full text-[10px] font-mono font-bold leading-none ${
                      isFiltersOpen
                        ? "bg-white/20 text-white"
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    {activeFilterCount}
                  </span>
                )}
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    isFiltersOpen
                      ? "rotate-180 text-primary-foreground"
                      : activeFilterCount > 0
                        ? "text-primary"
                        : "text-muted-foreground"
                  }`}
                />
              </Button>

              <div className="hidden sm:flex items-center text-[11px] font-mono text-muted-foreground pl-2 border-l border-border/60">
                <span>
                  <strong className="text-foreground font-bold">{data.totalCount}</strong> requests
                </span>
              </div>
            </div>
          </div>

          {/* Active Filters Summary (When collapsed) */}
          {!isFiltersOpen && activeFilterCount > 0 && (
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/40 text-xs">
              <div className="flex items-center gap-1.5 flex-wrap overflow-hidden">
                <span className="text-[11px] font-mono text-muted-foreground">Active:</span>
                {filters.bloodGroups.map((bg) => (
                  <span key={bg} className="px-2 py-0.5 rounded-md bg-crimson/15 text-crimson text-[11px] font-mono font-bold">
                    {bg}
                  </span>
                ))}
                {filters.urgencies.map((u) => (
                  <span key={u} className="px-2 py-0.5 rounded-md bg-destructive/15 text-destructive text-[11px] font-mono font-semibold">
                    {u}
                  </span>
                ))}
                {filters.districts.map((d) => (
                  <span key={d} className="px-2 py-0.5 rounded-md bg-muted text-foreground text-[11px] font-mono">
                    {d}
                  </span>
                ))}
                {filters.sort && filters.sort !== SortOption.NEWEST && (
                  <span className="px-2 py-0.5 rounded-md bg-muted text-foreground text-[11px] font-mono">
                    {filters.sort}
                  </span>
                )}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="h-7 px-2 text-[11px] font-semibold text-destructive hover:text-destructive hover:bg-destructive/10 gap-1 rounded-md shrink-0 cursor-pointer"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset</span>
              </Button>
            </div>
          )}

          {/* Collapsible Filter Panel */}
          {isFiltersOpen && (
            <div
              id="requests-filter-panel"
              className="pt-3 border-t border-border/60 space-y-3.5 animate-in fade-in-0 slide-in-from-top-2 duration-150"
            >
              {/* Blood Group Chips */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground hidden sm:inline shrink-0">
                  Blood Group:
                </span>
                <div
                  role="group"
                  aria-label="Filter by blood group"
                  className="flex items-center gap-1 p-1 rounded-xl bg-muted/50 border border-border/60 shrink-0"
                >
                  <button
                    type="button"
                    onClick={() => {
                      triggerTactileFeedback(HAPTIC_PATTERNS.LIGHT);
                      applyFilters({ ...filters, bloodGroups: [] });
                    }}
                    className={`h-8 px-3 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer select-none shrink-0 ${
                      filters.bloodGroups.length === 0
                        ? "bg-primary text-primary-foreground shadow-xs font-black"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    }`}
                    aria-pressed={filters.bloodGroups.length === 0}
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
                        className={`h-8 px-2.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer select-none shrink-0 ${
                          isSelected
                            ? "bg-crimson text-white shadow-xs font-black"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                        }`}
                        aria-pressed={isSelected}
                      >
                        {bg}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Secondary Controls Bar: Dropdowns with UX Labels + Live Count + Reset */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-3.5 pt-2 border-t border-border/40">
                {/* Filter Dropdowns with UX Labels */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
                  {/* Urgency Selector */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground block">
                      Urgency Tier
                    </label>
                    <Select
                      value={filters.urgencies[0] || "all"}
                      onValueChange={handleUrgencyChange}
                    >
                      <SelectTrigger className="h-9 w-full rounded-xl text-xs bg-background border-border/80 shadow-xs">
                        <SelectValue placeholder="All Urgencies" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Urgencies</SelectItem>
                        <SelectItem value={Urgency.CRITICAL}>Critical (STAT)</SelectItem>
                        <SelectItem value={Urgency.URGENT}>Urgent</SelectItem>
                        <SelectItem value={Urgency.MODERATE}>Moderate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* District Selector */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground block">
                      District / Location
                    </label>
                    <Select
                      value={filters.districts[0] || "all"}
                      onValueChange={handleDistrictChange}
                    >
                      <SelectTrigger className="h-9 w-full rounded-xl text-xs bg-background border-border/80 shadow-xs">
                        <SelectValue placeholder="All 64 Districts" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All 64 Districts</SelectItem>
                        {DISTRICTS.map((district) => (
                          <SelectItem key={district} value={district}>
                            {district}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Sort Order */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground block">
                      Sort Order
                    </label>
                    <Select
                      value={filters.sort || SortOption.NEWEST}
                      onValueChange={handleSortChange}
                    >
                      <SelectTrigger className="h-9 w-full rounded-xl text-xs bg-background border-border/80 shadow-xs">
                        <SelectValue placeholder="Sort: Newest" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={SortOption.NEWEST}>Newest First</SelectItem>
                        <SelectItem value={SortOption.CRITICAL_FIRST}>Critical First</SelectItem>
                        <SelectItem value={SortOption.MOST_URGENT}>Most Urgent</SelectItem>
                        <SelectItem value={SortOption.OLDEST}>Oldest First</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Active Count & Clear Button */}
                <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-1 md:pt-0">
                  <span className="text-[11px] font-mono text-muted-foreground md:hidden">
                    Showing <strong className="text-foreground font-bold">{data.totalCount}</strong>{" "}
                    {data.totalCount === 1 ? "request" : "requests"}
                  </span>

                  {activeFilterCount > 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleClearAll}
                      className="h-9 px-3 text-xs font-semibold text-destructive hover:text-destructive hover:bg-destructive/10 gap-1.5 rounded-xl cursor-pointer"
                      aria-label="Reset all applied filters"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>Reset ({activeFilterCount})</span>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 3. Results Main Grid Section */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 flex-1">
        {data.data.length === 0 ? (
          /* Empty State */
          <div className="py-16 sm:py-24 text-center max-w-md mx-auto space-y-4">
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-muted text-muted-foreground shadow-xs">
              <SearchX className="h-7 w-7" aria-hidden="true" />
            </div>
            <div className="space-y-1.5">
              <h2 className="font-heading text-xl font-bold text-foreground">
                No matching blood requests found
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {activeFilterCount > 0
                  ? "Try searching a different location, selecting more blood groups, or clearing your active filters."
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
                  Reset All Filters
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
