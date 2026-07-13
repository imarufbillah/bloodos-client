# Browse Requests Page — Implementation Reference

## Route Structure
```
/requests → page.tsx (this page)
└── (public)/requests/
    ├── page.tsx          ← Browse/list view
    └── [id]/
        └── page.tsx      ← Detail view (Phase 8c)
```

## Component Hierarchy
```
BrowseRequestsPage (page.tsx)
├── Header Section
│   ├── Title + Description
│   └── Total Count Badge
├── Filters Section
│   └── <Filters /> component
│       ├── Blood Group Dropdown
│       ├── Urgency Dropdown
│       ├── District Dropdown
│       ├── Search Input (300ms debounce)
│       └── Sort Dropdown
├── Results Section
│   ├── Loading State
│   │   └── <RequestsGridSkeleton count={12} />
│   ├── Error State
│   │   └── Error message + Retry button
│   ├── Empty State
│   │   └── No results message + Clear filters
│   └── Results Grid (4/2/1 columns)
│       ├── <RequestCard /> × N
│       │   ├── Blood Group + District kicker
│       │   ├── Urgency badge
│       │   ├── Patient name (Fraunces heading)
│       │   ├── Hospital info
│       │   ├── Units needed
│       │   ├── Needed by date
│       │   ├── Description (truncated)
│       │   ├── Status badge
│       │   └── View Details button
│       └── <Pagination /> component
```

## State Flow Diagram
```
URL Query Params
    ↓
Parse into filters state
    ↓
useEffect → fetchRequests()
    ↓
API: GET /api/requests?bloodGroup=A+&urgency=critical&page=1
    ↓
PaginatedResponse<BloodRequest>
    ↓
Render grid of RequestCards
    ↓
User changes filter/page
    ↓
Update filters state + URL
    ↓
Loop back to fetchRequests()
```

## Grid Layout Breakpoints
```css
/* Mobile: 1 column */
@media (max-width: 639px) {
  grid-cols-1
}

/* Tablet: 2 columns */
@media (min-width: 640px) and (max-width: 1023px) {
  sm:grid-cols-2
}

/* Desktop: 4 columns */
@media (min-width: 1024px) {
  lg:grid-cols-4
}
```

## API Request Example
```typescript
// User selects: Blood Group = A+, Urgency = Critical, District = Dhaka
// Search = "hospital", Sort = Newest, Page = 2

GET /api/requests?bloodGroup=A%2B&urgency=critical&district=Dhaka&search=hospital&sort=newest&page=2&limit=12

Response:
{
  data: BloodRequest[],
  page: 2,
  limit: 12,
  totalPages: 5,
  totalCount: 58,
  hasNextPage: true,
  hasPrevPage: true
}
```

## Animation Timing
```
Card 0: 0ms delay
Card 1: 150ms delay
Card 2: 300ms delay
Card 3: 450ms delay
...
Card 11: 1650ms delay

Each card fades in over 200ms
```

## Empty States Matrix
| Condition | Message | Action |
|-----------|---------|--------|
| No data + No filters | "There are no blood requests at the moment" | None |
| No data + Has filters | "Try adjusting your filters to see more results" | Clear All Filters button |
| API error | Error message from backend | Try Again button |
| Loading | 12 skeleton cards | None |

## URL State Examples
```
/requests
→ No filters, page 1, default sort

/requests?bloodGroup=A%2B&bloodGroup=O%2B
→ Multiple blood groups selected

/requests?urgency=critical&district=Dhaka&page=2
→ Filtered + paginated

/requests?search=hospital&sort=most-urgent
→ Search + custom sort
```

## Performance Considerations
1. **Debounce**: Search input waits 300ms before triggering API call
2. **URL Sync**: `router.replace()` used to avoid history pollution
3. **Scroll Reset**: `window.scrollTo()` with smooth behavior on page change
4. **Skeleton Count**: Fixed at 12 to match expected result count
5. **Page Reset**: Filters change resets to page 1 to avoid empty results

## Accessibility Features
- Semantic HTML structure (`<section>`, `<nav>`, `<article>`)
- ARIA labels on pagination controls
- Loading states announced to screen readers
- Keyboard navigation support (via Filters component)
- Focus states visible on all interactive elements
- Reduced motion respected for animations

## Known Issues / Future Work
- [ ] Backend API URL hardcoded (needs environment variable)
- [ ] No SSR (client-side only)
- [ ] No optimistic UI updates
- [ ] Fixed page size (12 items)
- [ ] No infinite scroll option
- [ ] No filter preset saving
