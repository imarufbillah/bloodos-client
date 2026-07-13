/**
 * BloodGroupBadge — Usage Examples
 * Phase 7h — StatusBadge family
 */

import { BloodGroupBadge } from "./BloodGroupBadge";
import { BloodGroup } from "@/types/shared";

export function BloodGroupBadgeExamples() {
  return (
    <div className="space-y-8 p-8">
      <section>
        <h2 className="mb-4 text-lg font-semibold">All Blood Groups</h2>
        <div className="flex flex-wrap items-center gap-3">
          <BloodGroupBadge bloodGroup={BloodGroup.A_POSITIVE} />
          <BloodGroupBadge bloodGroup={BloodGroup.A_NEGATIVE} />
          <BloodGroupBadge bloodGroup={BloodGroup.B_POSITIVE} />
          <BloodGroupBadge bloodGroup={BloodGroup.B_NEGATIVE} />
          <BloodGroupBadge bloodGroup={BloodGroup.AB_POSITIVE} />
          <BloodGroupBadge bloodGroup={BloodGroup.AB_NEGATIVE} />
          <BloodGroupBadge bloodGroup={BloodGroup.O_POSITIVE} />
          <BloodGroupBadge bloodGroup={BloodGroup.O_NEGATIVE} />
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold">Size Variants</h2>
        <div className="space-y-4">
          <div>
            <p className="mb-2 text-sm font-medium">Small (for dense tables)</p>
            <div className="flex flex-wrap gap-2">
              <BloodGroupBadge bloodGroup={BloodGroup.A_POSITIVE} size="sm" />
              <BloodGroupBadge bloodGroup={BloodGroup.B_POSITIVE} size="sm" />
              <BloodGroupBadge bloodGroup={BloodGroup.O_NEGATIVE} size="sm" />
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium">
              Medium (default, for cards)
            </p>
            <div className="flex flex-wrap gap-2">
              <BloodGroupBadge bloodGroup={BloodGroup.A_POSITIVE} size="md" />
              <BloodGroupBadge bloodGroup={BloodGroup.B_POSITIVE} size="md" />
              <BloodGroupBadge bloodGroup={BloodGroup.O_NEGATIVE} size="md" />
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium">Large (for headers)</p>
            <div className="flex flex-wrap gap-2">
              <BloodGroupBadge bloodGroup={BloodGroup.A_POSITIVE} size="lg" />
              <BloodGroupBadge bloodGroup={BloodGroup.B_POSITIVE} size="lg" />
              <BloodGroupBadge bloodGroup={BloodGroup.O_NEGATIVE} size="lg" />
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold">In Card Kicker Context</h2>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="mb-2 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <BloodGroupBadge bloodGroup={BloodGroup.A_POSITIVE} />
                <span className="text-xs uppercase tracking-wide text-muted-foreground">
                  • Dhaka
                </span>
              </div>
              <h3 className="mt-2 font-heading text-lg font-semibold">
                Patient Name
              </h3>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border-crimson bg-crimson px-3 py-1 text-xs font-semibold text-paper">
              Critical
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            National Hospital • Needed by Jan 15, 2025
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
                  Blood Group
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium">
                  Patient
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium">
                  District
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="px-4 py-3">
                  <BloodGroupBadge
                    bloodGroup={BloodGroup.A_POSITIVE}
                    size="sm"
                  />
                </td>
                <td className="px-4 py-3 text-sm">John Doe</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  Dhaka
                </td>
                <td className="px-4 py-3 font-mono text-sm tabular-data">
                  2025-01-15
                </td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-3">
                  <BloodGroupBadge
                    bloodGroup={BloodGroup.O_NEGATIVE}
                    size="sm"
                  />
                </td>
                <td className="px-4 py-3 text-sm">Jane Smith</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  Chittagong
                </td>
                <td className="px-4 py-3 font-mono text-sm tabular-data">
                  2025-01-20
                </td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-3">
                  <BloodGroupBadge
                    bloodGroup={BloodGroup.B_POSITIVE}
                    size="sm"
                  />
                </td>
                <td className="px-4 py-3 text-sm">Bob Wilson</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  Sylhet
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
        <h2 className="mb-4 text-lg font-semibold">In Donor Card Context</h2>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="mb-3 flex items-start justify-between">
            <div>
              <h3 className="font-heading text-lg font-semibold">
                Donor Name
              </h3>
              <div className="mt-1 flex items-center gap-2">
                <BloodGroupBadge bloodGroup={BloodGroup.O_NEGATIVE} />
                <span className="text-sm text-muted-foreground">• Dhaka</span>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-teal">
              Eligible
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Last donation: 120 days ago
          </p>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold">
          Comparison with Other Badges
        </h2>
        <div className="space-y-4 rounded-lg border bg-muted p-4">
          <div>
            <p className="mb-2 text-sm font-medium">
              BloodGroupBadge = Monospace chips (never urgency colors):
            </p>
            <div className="flex flex-wrap gap-2">
              <BloodGroupBadge bloodGroup={BloodGroup.A_POSITIVE} />
              <BloodGroupBadge bloodGroup={BloodGroup.O_NEGATIVE} />
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">
              UrgencyBadge = Filled/outlined pills (crimson/ochre/slate):
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border-crimson bg-crimson px-3 py-1 text-xs font-semibold text-paper">
                Critical
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate bg-transparent px-3 py-1 text-xs font-medium text-slate">
                Moderate
              </span>
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">
              StatusBadge = Text labels (teal/ochre/slate):
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-teal">
                Open
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-ochre">
                In Progress
              </span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Note: Three visually distinct systems that never share a color
            channel. Blood groups are always muted ink-on-paper (data codes),
            never urgency colors.
          </p>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold">Dark Mode Preview</h2>
        <div className="dark rounded-lg bg-background p-6">
          <div className="flex flex-wrap items-center gap-3">
            <BloodGroupBadge bloodGroup={BloodGroup.A_POSITIVE} />
            <BloodGroupBadge bloodGroup={BloodGroup.A_NEGATIVE} />
            <BloodGroupBadge bloodGroup={BloodGroup.B_POSITIVE} />
            <BloodGroupBadge bloodGroup={BloodGroup.B_NEGATIVE} />
            <BloodGroupBadge bloodGroup={BloodGroup.AB_POSITIVE} />
            <BloodGroupBadge bloodGroup={BloodGroup.AB_NEGATIVE} />
            <BloodGroupBadge bloodGroup={BloodGroup.O_POSITIVE} />
            <BloodGroupBadge bloodGroup={BloodGroup.O_NEGATIVE} />
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold">Design Notes</h2>
        <div className="rounded-lg border bg-muted p-4">
          <ul className="space-y-2 text-sm">
            <li>
              ✓ Monospace font (IBM Plex Mono) — blood types are data codes,
              not prose
            </li>
            <li>✓ Compact chips optimized for dense layouts and tables</li>
            <li>
              ✓ Muted palette (never urgency colors) — prevents confusion with
              UrgencyBadge
            </li>
            <li>
              ✓ Icon-free — blood type codes (A+, O-, etc.) are self-explanatory
              symbols
            </li>
            <li>✓ Three size variants for different contexts</li>
            <li>
              ✓ tabular-data utility for tabular-nums rendering (all blood
              groups take same width)
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
