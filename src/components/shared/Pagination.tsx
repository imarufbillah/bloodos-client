"use client";

import * as React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { PaginatedResponse } from "@/types/shared";

export interface PaginationProps<T = unknown> {
  /** Backend pagination metadata from PaginatedResponse<T> */
  metadata: Pick<
    PaginatedResponse<T>,
    | "page"
    | "limit"
    | "totalPages"
    | "totalCount"
    | "hasNextPage"
    | "hasPrevPage"
  >;
  /** Callback when page changes */
  onPageChange: (page: number) => void;
  /** Optional className for container */
  className?: string;
  /** Show total count text (e.g. "Showing 1-10 of 42 results") */
  showTotalCount?: boolean;
}

export function Pagination<T = unknown>({
  metadata,
  onPageChange,
  className,
  showTotalCount = true,
}: PaginationProps<T>) {
  const { page, limit, totalPages, totalCount, hasNextPage, hasPrevPage } =
    metadata;

  // Calculate displayed range for "Showing X-Y of Z results"
  const startItem = totalCount === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, totalCount);

  // Generate page numbers to display: current ± 2, with ellipsis for gaps
  const pageNumbers = React.useMemo(() => {
    const pages: (number | "ellipsis")[] = [];

    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate range around current page
      const start = Math.max(2, page - 2);
      const end = Math.min(totalPages - 1, page + 2);

      // Add ellipsis after first page if needed
      if (start > 2) {
        pages.push("ellipsis");
      }

      // Add pages around current
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add ellipsis before last page if needed
      if (end < totalPages - 1) {
        pages.push("ellipsis");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  }, [page, totalPages]);

  // Don't render anything if there's only one page or no data
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
      aria-label="Pagination"
    >
      {/* Total count text */}
      {showTotalCount && (
        <p className="text-sm text-muted-foreground font-mono tabular-data">
          Showing {startItem}–{endItem} of {totalCount} results
        </p>
      )}

      {/* Page controls */}
      <div className="flex items-center gap-1">
        {/* Previous button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrevPage}
          aria-label="Go to previous page"
          className="h-8 w-8 p-0"
        >
          <ChevronLeftIcon className="size-4" />
        </Button>

        {/* Page numbers */}
        {pageNumbers.map((pageNum, idx) => {
          if (pageNum === "ellipsis") {
            return (
              <span
                key={`ellipsis-${idx}`}
                className="flex h-8 w-8 items-center justify-center text-sm text-muted-foreground"
                aria-hidden="true"
              >
                …
              </span>
            );
          }

          const isCurrent = pageNum === page;

          return (
            <Button
              key={pageNum}
              variant={isCurrent ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(pageNum)}
              disabled={isCurrent}
              aria-label={`Go to page ${pageNum}`}
              aria-current={isCurrent ? "page" : undefined}
              className={cn(
                "h-8 w-8 p-0 font-mono tabular-data text-sm",
                isCurrent && "pointer-events-none",
              )}
            >
              {pageNum}
            </Button>
          );
        })}

        {/* Next button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNextPage}
          aria-label="Go to next page"
          className="h-8 w-8 p-0"
        >
          <ChevronRightIcon className="size-4" />
        </Button>
      </div>
    </nav>
  );
}
