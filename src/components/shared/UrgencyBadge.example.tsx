/**
 * UrgencyBadge — Usage Examples
 * Phase 7h — StatusBadge family
 */

import { UrgencyBadge } from "./UrgencyBadge";
import { Urgency } from "@/types/shared";

export function UrgencyBadgeExamples() {
  return (
    <div className="space-y-8 p-8">
      <section>
        <h2 className="mb-4 text-lg font-semibold">All Urgency Levels</h2>
        <div className="flex flex-wrap items-center gap-4">
          <UrgencyBadge urgency={Urgency.CRITICAL} />
          <UrgencyBadge urgency={Urgency.URGENT} />
          <UrgencyBadge urgency={Urgency.MODERATE} />
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold">In Request Card Context</h2>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="mb-2 flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                A+ • Dhaka
              </p>
              <h3 className="mt-1 font-heading text-lg font-semibold">
                Patient Name
              </h3>
            </div>
            <UrgencyBadge urgency={Urgency.CRITICAL} />
          </div>
          <p className="text-sm text-muted-foreground">
            Hospital Name • Needed by Jan 15, 2025
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
                  Patient
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium">
                  Urgency
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="px-4 py-3 text-sm">John Doe</td>
                <td className="px-4 py-3">
                  <UrgencyBadge urgency={Urgency.CRITICAL} />
                </td>
                <td className="px-4 py-3 font-mono text-sm tabular-data">
                  2025-01-15
                </td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-3 text-sm">Jane Smith</td>
                <td className="px-4 py-3">
                  <UrgencyBadge urgency={Urgency.URGENT} />
                </td>
                <td className="px-4 py-3 font-mono text-sm tabular-data">
                  2025-01-20
                </td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-3 text-sm">Bob Wilson</td>
                <td className="px-4 py-3">
                  <UrgencyBadge urgency={Urgency.MODERATE} />
                </td>
                <td className="px-4 py-3 font-mono text-sm tabular-data">
                  2025-01-25
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold">Dark Mode Preview</h2>
        <div className="dark rounded-lg bg-background p-6">
          <div className="flex flex-wrap items-center gap-4">
            <UrgencyBadge urgency={Urgency.CRITICAL} />
            <UrgencyBadge urgency={Urgency.URGENT} />
            <UrgencyBadge urgency={Urgency.MODERATE} />
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold">Accessibility Notes</h2>
        <div className="rounded-lg border bg-muted p-4">
          <ul className="space-y-2 text-sm">
            <li>✓ Color + Icon + Text (never color alone)</li>
            <li>✓ Icon has aria-hidden (text provides the label)</li>
            <li>✓ Minimum contrast ratios met for all urgency levels</li>
            <li>
              ✓ Visual hierarchy: Critical (filled crimson) → Urgent (filled
              ochre) → Moderate (outlined slate)
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
