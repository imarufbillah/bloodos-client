/**
 * Browse Requests Page - Phase 8b
 * 
 * Public directory of blood requests with filtering, search, sorting, and pagination.
 * 
 * Requirements:
 * - Req 21.1-21.11: All browse requests functionality
 * - Req 21.2: Public route (no auth required)
 * - Req 21.3: Filters wired to GET /api/requests query params
 * - Req 21.4: Blood group, urgency, district filters + search
 * - Req 21.5: 300ms search debounce
 * - Req 21.6: Sort options (newest/oldest/most urgent/critical first)
 * - Req 21.7: 4/2/1 column grid with stagger fade-in
 * - Req 21.8: All fields displayed per RequestCard
 * - Req 21.9: Skeleton loaders during fetch
 * - Req 21.10: Pagination at bottom
 * - Req 21.11: Card click → /requests/:id
 * 
 * Design:
 * - Grid uses Phase 6a's stagger fade-in animation
 * - Civic infrastructure aesthetic: clean, functional, accessible
 * - Empty states, error states, loading states all handled
 */

import { Suspense } from "react";
import { RequestsGridSkeleton } from "@/components/shared/SkeletonLoaders";
import BrowseRequestsContent from "./BrowseRequestsContent";

/**
 * Browse Requests Page Component
 * Wrapped in Suspense boundary for useSearchParams
 */
export default function BrowseRequestsPage() {
  return (
    <Suspense fallback={<RequestsGridSkeleton count={12} />}>
      <BrowseRequestsContent />
    </Suspense>
  );
}
