/**
 * Manage Blood Requests Page
 * Phase 8i - /requests/manage
 *
 * Functional requirements:
 * - Req 20.11: Authenticated users can view their posted requests
 * - Req 20.12: Auth required (protected route)
 * - Req 20.13: Data from GET /api/requests/mine endpoint
 * - Req 20.14: Table columns: Patient, Blood Group, Status, Date, Actions
 * - Req 20.15: Paginated if > 10 requests
 * - Req 20.16: Mark Fulfilled → PATCH /api/requests/:id/status {status: "fulfilled"}
 * - Req 20.17: Cancel → PATCH /api/requests/:id/status {status: "cancelled"}
 * - Req 20.18: Delete requires confirmation dialog
 * - Req 20.19: Delete → DELETE /api/requests/:id
 *
 * Design direction (from unit 8i):
 * - Table layout (not cards)
 * - Monospace for dates/IDs per Phase 6a
 * - Delete requires confirmation dialog before calling DELETE
 * - Civic infrastructure aesthetic: compact, functional, clear hierarchy
 *
 * Edge cases & states:
 * - Empty state when user has no requests
 * - Loading state with skeleton
 * - Error state with retry
 * - Delete confirmation dialog gates DELETE call
 * - Status transitions respect state machine rules (via backend)
 */

import { Metadata } from "next";
import { ManageRequestsContent } from "./ManageRequestsContent";

export const metadata: Metadata = {
  title: "Manage Requests | BloodOS",
  description: "View and manage your blood donation requests",
};

export default function ManageRequestsPage() {
  return <ManageRequestsContent />;
}
