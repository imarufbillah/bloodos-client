"use client";

import * as React from "react";
import { ChevronDownIcon, SearchIcon, XIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BLOOD_GROUPS, type BloodGroup } from "@/lib/constants/bloodGroups";
import { DISTRICTS_BY_DIVISION, type District } from "@/lib/constants/districts";

/**
 * Filters Component — Phase 7e
 * 
 * Unified filter component for both /requests and /donors directory pages.
 * - Configurable field set: bloodGroup, urgency, district, search, sort
 * - Styled to BloodOS theme (shadcn dropdowns, debounced search input)
 * - Matches civic infrastructure aesthetic (no over-styled chips)
 * 
 * Requirements:
 * - Req 21.4-21.6: /requests filters (blood/urgency/district/search/sort)
 * - Req 17.6: /donors filters (blood/district)
 * - Req 21.5: 300ms search debounce
 * - Req 16.14: Debounce visible in UI (pending state)
 */

// Urgency levels per Req 3
export type Urgency = "critical" | "urgent" | "moderate";
const URGENCIES: Urgency[] = ["critical", "urgent", "moderate"];

// Sort options per Req 21.6
export type SortOption =
  | "newest"
  | "oldest"
  | "most-urgent"
  | "critical-first"
  | "nearest-deadline";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "most-urgent", label: "Most Urgent" },
  { value: "critical-first", label: "Critical First" },
  { value: "nearest-deadline", label: "Nearest Deadline" },
];

export interface FiltersProps {
  /** Which filters to show — different per page */
  fields?: {
    bloodGroup?: boolean;
    urgency?: boolean;
    district?: boolean;
    search?: boolean;
    sort?: boolean;
  };
  /** Current filter values */
  value: {
    bloodGroups?: BloodGroup[];
    urgencies?: Urgency[];
    districts?: District[];
    search?: string;
    sort?: SortOption;
  };
  /** Callback when any filter changes */
  onChange: (filters: {
    bloodGroups?: BloodGroup[];
    urgencies?: Urgency[];
    districts?: District[];
    search?: string;
    sort?: SortOption;
  }) => void;
  /** Optional className for container */
  className?: string;
}

export function Filters({
  fields = {
    bloodGroup: true,
    urgency: false,
    district: true,
    search: true,
    sort: false,
  },
  value,
  onChange,
  className,
}: FiltersProps) {
  const [searchInput, setSearchInput] = React.useState(value.search ?? "");
  const [isSearchPending, setIsSearchPending] = React.useState(false);

  // Debounced search handler — Req 21.5 (300ms), Req 16.14 (visible pending state)
  React.useEffect(() => {
    setIsSearchPending(true);
    const timeout = setTimeout(() => {
      onChange({ ...value, search: searchInput });
      setIsSearchPending(false);
    }, 300);

    return () => {
      clearTimeout(timeout);
      setIsSearchPending(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  // Count active filters for badge display
  const activeCount =
    (value.bloodGroups?.length ?? 0) +
    (value.urgencies?.length ?? 0) +
    (value.districts?.length ?? 0) +
    (value.search ? 1 : 0);

  const hasActiveFilters = activeCount > 0;

  const clearAllFilters = () => {
    setSearchInput("");
    onChange({
      bloodGroups: [],
      urgencies: [],
      districts: [],
      search: "",
      sort: value.sort, // preserve sort when clearing filters
    });
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      {/* Left side: filter dropdowns + search */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Blood Group Filter */}
        {fields.bloodGroup && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1.5">
                <span className="font-mono text-xs">
                  {value.bloodGroups?.length
                    ? `Blood (${value.bloodGroups.length})`
                    : "Blood Group"}
                </span>
                <ChevronDownIcon className="size-3.5 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuLabel className="text-muted-foreground">
                Select Blood Groups
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {BLOOD_GROUPS.map((group) => (
                <DropdownMenuCheckboxItem
                  key={group}
                  checked={value.bloodGroups?.includes(group)}
                  onCheckedChange={(checked) => {
                    const current = value.bloodGroups ?? [];
                    onChange({
                      ...value,
                      bloodGroups: checked
                        ? [...current, group]
                        : current.filter((g) => g !== group),
                    });
                  }}
                >
                  <span className="font-mono text-sm">{group}</span>
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Urgency Filter */}
        {fields.urgency && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1.5">
                <span className="text-xs">
                  {value.urgencies?.length
                    ? `Urgency (${value.urgencies.length})`
                    : "Urgency"}
                </span>
                <ChevronDownIcon className="size-3.5 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuLabel className="text-muted-foreground">
                Select Urgency Levels
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {URGENCIES.map((urgency) => (
                <DropdownMenuCheckboxItem
                  key={urgency}
                  checked={value.urgencies?.includes(urgency)}
                  onCheckedChange={(checked) => {
                    const current = value.urgencies ?? [];
                    onChange({
                      ...value,
                      urgencies: checked
                        ? [...current, urgency]
                        : current.filter((u) => u !== urgency),
                    });
                  }}
                >
                  <span className="text-sm capitalize">{urgency}</span>
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* District Filter */}
        {fields.district && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1.5">
                <span className="text-xs">
                  {value.districts?.length
                    ? `District (${value.districts.length})`
                    : "District"}
                </span>
                <ChevronDownIcon className="size-3.5 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 max-h-96 overflow-y-auto">
              <DropdownMenuLabel className="text-muted-foreground">
                Select Districts
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {Object.entries(DISTRICTS_BY_DIVISION).map(([division, districts]) => (
                <div key={division}>
                  <DropdownMenuLabel className="text-xs font-semibold text-foreground mt-1">
                    {division}
                  </DropdownMenuLabel>
                  {districts.map((district) => (
                    <DropdownMenuCheckboxItem
                      key={district}
                      checked={value.districts?.includes(district as District)}
                      onCheckedChange={(checked) => {
                        const current = value.districts ?? [];
                        onChange({
                          ...value,
                          districts: checked
                            ? [...current, district as District]
                            : current.filter((d) => d !== district),
                        });
                      }}
                    >
                      <span className="text-sm">{district}</span>
                    </DropdownMenuCheckboxItem>
                  ))}
                </div>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Search Input */}
        {fields.search && (
          <div className="relative">
            <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className={cn(
                "h-8 w-full sm:w-64 rounded-lg border border-input bg-background pl-8 pr-8 text-sm",
                "placeholder:text-muted-foreground",
                "focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring",
                "transition-all",
                isSearchPending && "border-ochre ring-1 ring-ochre/20"
              )}
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Clear search"
              >
                <XIcon className="size-3.5" />
              </button>
            )}
          </div>
        )}

        {/* Clear All Button */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="h-8 text-xs text-muted-foreground hover:text-foreground"
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Right side: sort dropdown */}
      {fields.sort && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 gap-1.5">
              <span className="text-xs">
                {value.sort
                  ? SORT_OPTIONS.find((opt) => opt.value === value.sort)?.label
                  : "Sort By"}
              </span>
              <ChevronDownIcon className="size-3.5 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="text-muted-foreground">
              Sort By
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {SORT_OPTIONS.map((option) => (
              <DropdownMenuCheckboxItem
                key={option.value}
                checked={value.sort === option.value}
                onCheckedChange={(checked) => {
                  onChange({
                    ...value,
                    sort: checked ? option.value : undefined,
                  });
                }}
              >
                <span className="text-sm">{option.label}</span>
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
