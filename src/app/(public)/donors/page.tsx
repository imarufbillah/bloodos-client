/**
 * Donor Directory Page - Phase 8d
 * 
 * Public directory of eligible blood donors with filtering and pagination.
 * 
 * Requirements:
 * - Req 17.1-17.13: All donor directory functionality
 * - Req 17.2: Public route (no auth required)
 * - Req 17.3: Filters wired to GET /api/donors query params
 * - Req 17.6: Blood group + district filters
 * - Req 17.7: Skeleton loaders during fetch
 * - Req 17.8: All fields displayed per DonorCard
 * - Req 17.9: Client-side eligibility calculation
 * - Req 17.10: Paginated results
 * - Req 17.11: "Request Contact" requires auth (redirect to login)
 * - Req 17.12: POST /api/donors/:id/request-contact on success
 * - Req 17.13: Toast "Contact information sent to your notifications"
 * 
 * Design:
 * - Same grid rhythm as /requests for consistency
 * - 4/2/1 column layout with stagger fade-in animation
 * - Civic infrastructure aesthetic: clean, functional, accessible
 * - Empty states, error states, loading states all handled
 */

import { Suspense } from "react";
import { DonorsGridSkeleton } from "@/components/shared/SkeletonLoaders";
import DonorDirectoryContent from "./DonorDirectoryContent";

/**
 * Donor Directory Page Component
 * Wrapped in Suspense boundary for useSearchParams
 */
export default function DonorDirectoryPage() {
  return (
    <Suspense fallback={<DonorsGridSkeleton count={12} />}>
      <DonorDirectoryContent />
    </Suspense>
  );
}
