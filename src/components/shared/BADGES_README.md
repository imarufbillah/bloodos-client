# Badge Components — Usage Guide

Phase 7h implements three distinct badge families for BloodOS. Each serves a specific semantic purpose with a unique visual language.

---

## Quick Reference

```tsx
import { 
  UrgencyBadge, 
  StatusBadge, 
  BloodGroupBadge 
} from "@/components/shared";
import { 
  Urgency, 
  RequestStatus, 
  BloodGroup 
} from "@/types/shared";

// Urgency levels (critical/urgent/moderate)
<UrgencyBadge urgency={Urgency.CRITICAL} />

// Request lifecycle status
<StatusBadge status={RequestStatus.OPEN} />

// Blood type codes
<BloodGroupBadge bloodGroup={BloodGroup.A_POSITIVE} />
<BloodGroupBadge bloodGroup={BloodGroup.O_NEGATIVE} size="sm" />
```

---

## 1. UrgencyBadge

**Purpose**: Display request urgency level  
**Visual**: Filled/outlined pills with icons  
**Colors**: Crimson (critical), Ochre (urgent), Slate (moderate)

### API

```tsx
interface UrgencyBadgeProps {
  urgency: "critical" | "urgent" | "moderate";
  className?: string;
}
```

### Examples

```tsx
// Critical urgency (filled crimson pill)
<UrgencyBadge urgency={Urgency.CRITICAL} />

// Urgent (filled ochre pill)
<UrgencyBadge urgency={Urgency.URGENT} />

// Moderate (outlined slate pill)
<UrgencyBadge urgency={Urgency.MODERATE} />

// With custom className
<UrgencyBadge urgency={Urgency.CRITICAL} className="ml-auto" />
```

### Visual Treatment

- **Critical**: AlertCircle icon, filled crimson background, white text
- **Urgent**: Clock icon, filled ochre background, ink text
- **Moderate**: Info icon, outlined slate border, slate text

### Use Cases

- Request card top-right corner
- Request detail page header
- Table columns for urgency
- Admin moderation queue

---

## 2. StatusBadge

**Purpose**: Display BloodRequest lifecycle status  
**Visual**: Text labels with icons (NOT pills)  
**Colors**: Teal (active), Ochre (transitional), Slate/Muted (terminal)

### API

```tsx
interface StatusBadgeProps {
  status: "open" | "in_progress" | "fulfilled" | "cancelled" | "expired";
  className?: string;
}
```

### Examples

```tsx
// Open (accepting responses)
<StatusBadge status={RequestStatus.OPEN} />

// In progress (has responses)
<StatusBadge status={RequestStatus.IN_PROGRESS} />

// Fulfilled (completed)
<StatusBadge status={RequestStatus.FULFILLED} />

// Cancelled (terminated by user)
<StatusBadge status={RequestStatus.CANCELLED} />

// Expired (passed deadline)
<StatusBadge status={RequestStatus.EXPIRED} />
```

### Visual Treatment

- **Open**: Circle icon, teal text
- **In Progress**: Clock icon, ochre text
- **Fulfilled**: CheckCircle2 icon, teal text
- **Cancelled**: XCircle icon, muted text
- **Expired**: AlertTriangle icon, slate text

### Design Note

StatusBadge deliberately uses text labels (NOT pills) to visually distinguish it from UrgencyBadge. Status is a lifecycle state, not an urgency tier.

### Use Cases

- Request card metadata row
- User's "Manage Requests" table
- Admin moderation table
- Request detail page status display

---

## 3. BloodGroupBadge

**Purpose**: Display blood type codes  
**Visual**: Monospace chips  
**Colors**: Muted palette (NEVER urgency colors)

### API

```tsx
interface BloodGroupBadgeProps {
  bloodGroup: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  size?: "sm" | "md" | "lg";
  className?: string;
}
```

### Examples

```tsx
// Default size (medium)
<BloodGroupBadge bloodGroup={BloodGroup.A_POSITIVE} />

// Small (for dense tables)
<BloodGroupBadge bloodGroup={BloodGroup.O_NEGATIVE} size="sm" />

// Large (for headers)
<BloodGroupBadge bloodGroup={BloodGroup.AB_POSITIVE} size="lg" />

// All 8 blood groups
<BloodGroupBadge bloodGroup={BloodGroup.A_POSITIVE} />
<BloodGroupBadge bloodGroup={BloodGroup.A_NEGATIVE} />
<BloodGroupBadge bloodGroup={BloodGroup.B_POSITIVE} />
<BloodGroupBadge bloodGroup={BloodGroup.B_NEGATIVE} />
<BloodGroupBadge bloodGroup={BloodGroup.AB_POSITIVE} />
<BloodGroupBadge bloodGroup={BloodGroup.AB_NEGATIVE} />
<BloodGroupBadge bloodGroup={BloodGroup.O_POSITIVE} />
<BloodGroupBadge bloodGroup={BloodGroup.O_NEGATIVE} />
```

### Size Variants

- **sm**: 10px text, 16px height — for dense tables
- **md**: 12px text, 20px height — default, for cards
- **lg**: 14px text, 24px height — for headers

### Visual Treatment

- Monospace font (IBM Plex Mono)
- Muted background with border
- Tabular-nums for consistent width
- Icon-free (blood type codes are self-explanatory)

### Design Note

Blood groups are treated as data codes (like request IDs or timestamps), not urgency indicators. They NEVER use crimson/ochre urgency colors.

### Use Cases

- Request card kickers ("A+ • Dhaka")
- Donor card headers
- Table columns for blood group
- Filter chips

---

## Visual Hierarchy

### Three Systems Side-by-Side

```
UrgencyBadge:      [● Critical]  [● Urgent]  [○ Moderate]
                   Crimson pill  Ochre pill  Slate outline

StatusBadge:       [○ Open]  [◷ In Progress]  [✓ Fulfilled]
                   Teal text  Ochre text       Teal text

BloodGroupBadge:   [A+]  [O-]  [AB+]
                   Muted chips, monospace
```

### Key Principle

**Three visually distinct systems that never share a color channel.**

- UrgencyBadge owns crimson/ochre/slate urgency vocabulary
- StatusBadge uses lifecycle colors (teal/ochre/muted)
- BloodGroupBadge uses neutral palette only

This separation prevents confusion between "how urgent" (UrgencyBadge), "what lifecycle stage" (StatusBadge), and "what blood type" (BloodGroupBadge).

---

## Card Integration Example

```tsx
import { 
  UrgencyBadge, 
  StatusBadge, 
  BloodGroupBadge 
} from "@/components/shared";

function RequestCard({ request }) {
  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      {/* Kicker: Blood group + district, Urgency pill top-right */}
      <div className="mb-2 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <BloodGroupBadge bloodGroup={request.bloodGroup} />
          <span className="text-xs text-muted-foreground">
            • {request.district}
          </span>
        </div>
        <UrgencyBadge urgency={request.urgency} />
      </div>

      {/* Patient name */}
      <h3 className="font-heading text-lg font-semibold">
        {request.patientName}
      </h3>

      {/* Hospital + date */}
      <p className="text-sm text-muted-foreground">
        {request.hospitalName} • Needed by {formatDate(request.neededByDate)}
      </p>

      {/* Status badge in metadata row */}
      <div className="mt-2">
        <StatusBadge status={request.status} />
      </div>

      {/* Description */}
      <p className="mt-2 text-sm line-clamp-2">
        {request.additionalNotes}
      </p>

      {/* CTA */}
      <button className="mt-3 text-sm text-primary">View Details →</button>
    </div>
  );
}
```

---

## Table Integration Example

```tsx
import { 
  UrgencyBadge, 
  StatusBadge, 
  BloodGroupBadge 
} from "@/components/shared";

function RequestsTable({ requests }) {
  return (
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
            Urgency
          </th>
          <th className="px-4 py-2 text-left text-sm font-medium">
            Status
          </th>
          <th className="px-4 py-2 text-left text-sm font-medium">
            Date
          </th>
        </tr>
      </thead>
      <tbody>
        {requests.map((req) => (
          <tr key={req._id} className="border-t">
            <td className="px-4 py-3">
              <BloodGroupBadge bloodGroup={req.bloodGroup} size="sm" />
            </td>
            <td className="px-4 py-3 text-sm">{req.patientName}</td>
            <td className="px-4 py-3">
              <UrgencyBadge urgency={req.urgency} />
            </td>
            <td className="px-4 py-3">
              <StatusBadge status={req.status} />
            </td>
            <td className="px-4 py-3 font-mono text-sm tabular-data">
              {formatDate(req.neededByDate)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

---

## Accessibility Notes

### UrgencyBadge & StatusBadge

- ✓ Color + Icon + Text (never color alone)
- ✓ Icons have `aria-hidden="true"` (text provides semantic label)
- ✓ All contrast ratios meet WCAG AA

### BloodGroupBadge

- ✓ Icon-free (blood type codes are self-explanatory)
- ✓ Monospace + tabular-nums for consistent rendering
- ✓ Muted palette (never urgency colors)

### Screen Reader Testing

All three badge types should announce their text content correctly:
- "Critical" (UrgencyBadge)
- "Open" (StatusBadge)
- "A positive" or "O negative" (BloodGroupBadge)

Icons are skipped (`aria-hidden="true"`).

---

## Dark Mode

All three badge families adapt automatically via theme tokens. No special handling needed.

**Verification**: Toggle dark mode and check contrast ratios remain WCAG AA compliant.

---

## Do's and Don'ts

### ✓ Do

- Use UrgencyBadge for request urgency levels
- Use StatusBadge for request lifecycle states
- Use BloodGroupBadge for blood type codes
- Combine all three in request cards and tables
- Override positioning/spacing with `className` prop

### ✗ Don't

- Don't use UrgencyBadge colors on StatusBadge or BloodGroupBadge
- Don't render BloodGroupBadge as a pill (keep it a chip)
- Don't add icons to BloodGroupBadge (blood types are self-explanatory)
- Don't override badge colors via className (use the correct badge type instead)
- Don't use StatusBadge for urgency or UrgencyBadge for status

---

## Example Files

For visual reference and additional usage patterns, see:

- `UrgencyBadge.example.tsx`
- `StatusBadge.example.tsx`
- `BloodGroupBadge.example.tsx`

Each example file demonstrates:
- All variants/states
- Card integration
- Table integration
- Dark mode preview
- Accessibility notes

---

## Support

For questions or issues with badge components, refer to:

1. `/PHASE_7H_VISUAL_GUIDE.md` — Comprehensive visual hierarchy guide
2. `/PHASE_7H_COMPLETION_REPORT.md` — Full technical documentation
3. Example files in this directory

---

**Last Updated**: 2025-01-13  
**Phase**: 7h Complete ✅
