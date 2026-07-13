# Shared Components

Phase 7 shared components used across multiple pages.

---

## Filters

**File:** `Filters.tsx`  
**Status:** ✅ Complete

### Usage

```tsx
import { Filters, type SortOption } from "@/components/shared";

// Full configuration (requests page)
<Filters
  fields={{
    bloodGroup: true,
    urgency: true,
    district: true,
    search: true,
    sort: true,
  }}
  value={filters}
  onChange={setFilters}
/>

// Simplified (donors page)
<Filters
  fields={{
    bloodGroup: true,
    district: true,
    search: true,
  }}
  value={filters}
  onChange={setFilters}
/>
```

### Props

```typescript
interface FiltersProps {
  fields?: {
    bloodGroup?: boolean;
    urgency?: boolean;
    district?: boolean;
    search?: boolean;
    sort?: boolean;
  };
  value: {
    bloodGroups?: BloodGroup[];
    urgencies?: Urgency[];
    districts?: District[];
    search?: string;
    sort?: SortOption;
  };
  onChange: (filters: {...}) => void;
  className?: string;
}
```

### Features

- ✅ Multi-select dropdowns for blood groups, urgencies, districts
- ✅ 300ms debounced search input with visible pending state
- ✅ Sort dropdown (newest, oldest, most urgent, critical first, nearest deadline)
- ✅ Active filter count badges
- ✅ "Clear All" button
- ✅ Responsive layout (stacks on mobile)
- ✅ Keyboard navigable
- ✅ Theme-compliant styling

### Requirements

- Req 21.4-21.6 — `/requests` filters
- Req 17.6 — `/donors` filters
- Req 16.14 — Debounce visible in UI

---

## Coming Soon

- **Pagination** (Phase 7f) — Consumes `PaginatedResponse<T>`
- **SkeletonLoaders** (Phase 7g) — Loading states
- **StatusBadge** family (Phase 7h) — UrgencyBadge, BloodGroupBadge, RequestStatusBadge

---

## Examples

See `Filters.example.tsx` for detailed usage patterns:
- Requests page filters (full set)
- Donors page filters (simplified)
- API integration pattern
