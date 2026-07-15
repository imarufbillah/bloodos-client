/**
 * StatusBadge — Usage Examples
 * Phase 7h — StatusBadge family
 */

import { StatusBadge } from "./StatusBadge";
import { RequestStatus } from "@/types/shared";

export function StatusBadgeExamples() {
  return (
    <div className="space-y-8 p-8">
      <section>
        <h2 className="mb-4 text-lg font-semibold">
          All Request Status Values
        </h2>
        <div className="flex flex-wrap items-center gap-4">
          <StatusBadge status={RequestStatus.OPEN} />
          <StatusBadge status={RequestStatus.IN_PROGRESS} />
          <StatusBadge status={RequestStatus.FULFILLED} />
          <StatusBadge status={RequestStatus.CANCELLED} />
          <StatusBadge status={RequestStatus.EXPIRED} />
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold">
          Compared to UrgencyBadge (Visual Separation)
        </h2>
        <div className="space-y-4 rounded-lg border bg-muted p-4">
          <div>
            <p className="mb-2 text-sm font-medium">
              StatusBadge = Plain text labels (ink-on-paper):
            </p>
            <div className="flex flex-wrap gap-3">
              <StatusBadge status={RequestStatus.OPEN} />
              <StatusBadge status={RequestStatus.FULFILLED} />
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">
              UrgencyBadge = Filled/outlined pills (urgency colors):
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate bg-transparent px-3 py-1 text-xs font-medium text-slate">
                <svg
                  className="h-3 w-3"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <circle cx="12" cy="12" r="10" />
                </svg>
                Moderate
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border-crimson bg-crimson px-3 py-1 text-xs font-semibold text-paper shadow-sm">
                <svg
                  className="h-3 w-3"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4m0 4h.01" />
                </svg>
                Critical
              </span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Note: StatusBadge never uses urgency colors (crimson/ochre). This
            prevents confusion between &quot;request status&quot; and
            &quot;urgency level.&quot;
          </p>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold">In Table Context</h2>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium">
                  Request ID
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium">
                  Status
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium">
                  Updated
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="px-4 py-3 font-mono text-sm tabular-data">
                  #12345
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={RequestStatus.OPEN} />
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  2 hours ago
                </td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-3 font-mono text-sm tabular-data">
                  #12344
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={RequestStatus.IN_PROGRESS} />
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  5 hours ago
                </td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-3 font-mono text-sm tabular-data">
                  #12343
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={RequestStatus.FULFILLED} />
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  1 day ago
                </td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-3 font-mono text-sm tabular-data">
                  #12342
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={RequestStatus.CANCELLED} />
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  3 days ago
                </td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-3 font-mono text-sm tabular-data">
                  #12341
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={RequestStatus.EXPIRED} />
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  1 week ago
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold">In Card Context</h2>
        <div className="space-y-4">
          <div className="rounded-lg border bg-card p-4 shadow-sm">
            <div className="mb-2 flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Request #12345
                </p>
                <h3 className="mt-1 font-heading text-lg font-semibold">
                  Active Request
                </h3>
              </div>
              <StatusBadge status={RequestStatus.OPEN} />
            </div>
            <p className="text-sm text-muted-foreground">
              This request is accepting responses from donors.
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4 shadow-sm">
            <div className="mb-2 flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Request #12344
                </p>
                <h3 className="mt-1 font-heading text-lg font-semibold">
                  Completed Request
                </h3>
              </div>
              <StatusBadge status={RequestStatus.FULFILLED} />
            </div>
            <p className="text-sm text-muted-foreground">
              This request has been successfully fulfilled.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold">Dark Mode Preview</h2>
        <div className="dark rounded-lg bg-background p-6">
          <div className="flex flex-wrap items-center gap-4">
            <StatusBadge status={RequestStatus.OPEN} />
            <StatusBadge status={RequestStatus.IN_PROGRESS} />
            <StatusBadge status={RequestStatus.FULFILLED} />
            <StatusBadge status={RequestStatus.CANCELLED} />
            <StatusBadge status={RequestStatus.EXPIRED} />
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold">Accessibility Notes</h2>
        <div className="rounded-lg border bg-muted p-4">
          <ul className="space-y-2 text-sm">
            <li>✓ Icon + Text (never color alone)</li>
            <li>✓ Plain text labels, not pills (distinct from UrgencyBadge)</li>
            <li>
              ✓ Status meanings are clear from labels: &quot;Open&quot;,
              &quot;In Progress&quot;, &quot;Fulfilled&quot;, etc.
            </li>
            <li>
              ✓ Color coding supports but doesn&apos;t replace semantic meaning
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
