# Donor Directory Page - Phase 8d

**Route:** `/donors` (public)

## Overview

Public directory of eligible blood donors with filtering and pagination. Users can browse registered donors, filter by blood group and district, and request contact information (authentication required).

## Requirements Coverage

### Functional Requirements

- **Req 17.1**: Donor directory page implemented
- **Req 17.2**: Public route - no authentication required for browsing
- **Req 17.3**: Filters wired to `GET /api/donors` query params
- **Req 17.4**: Only `isDonor: true` users shown (server-side filter)
- **Req 17.5**: Phone numbers masked (`******XXXX` format)
- **Req 17.6**: Blood group + district filters implemented
- **Req 17.7**: Skeleton loaders during data fetch
- **Req 17.8**: All donor fields displayed per DonorCard spec
- **Req 17.9**: Client-side eligibility calculation (90-day cooldown)
- **Req 17.10**: Paginated results (12 donors per page)
- **Req 17.11**: "Request Contact" requires authentication (redirect to sign-in)
- **Req 17.12**: `POST /api/donors/:id/request-contact` on successful auth
- **Req 17.13**: Success toast: "Contact information sent to your notifications"

### Design Requirements

- **Req 16.9**: Uniform 4/2/1 column grid (matches `/requests` for consistency)
- **Req 16.11**: Loading states with skeleton loaders
- **Phase 6a**: Civic infrastructure aesthetic (clean, functional, accessible)
- **Phase 7d**: DonorCard component with eligibility badges
- **Phase 7e**: Filters component (blood group + district only, no urgency/sort)
- **Phase 7f**: Pagination component with backend metadata
- **Phase 7g**: Skeleton loaders shape-matched to DonorCard

## Component Architecture

### File Structure
```
app/(public)/donors/
├── page.tsx                    # Suspense wrapper
├── DonorDirectoryContent.tsx   # Main client component
└── README.md                   # This file
```

### Component Breakdown

#### `page.tsx`
- Server component wrapper
- Suspense boundary for `useSearchParams`
- Fallback: `DonorsGridSkeleton` (12 cards)

#### `DonorDirectoryContent.tsx`
- Client component with data fetching
- URL state management (filters + pagination in query params)
- Authentication check for contact requests
- Toast notifications for success/error states

## Data Flow

### 1. Donor Fetching
```typescript
GET /api/donors?bloodGroup=A+&district=Dhaka&page=1&limit=12
```

**Response:**
```typescript
{
  data: Donor[],
  page: 1,
  limit: 12,
  totalPages: 5,
  totalCount: 58,
  hasNextPage: true,
  hasPrevPage: false
}
```

### 2. Contact Request Flow
```typescript
// User clicks "Request Contact" on DonorCard
↓
// Check authentication
if (!session) {
  toast.error("Please sign in...")
  router.push("/sign-in?callbackUrl=/donors")
  return
}
↓
// Make API request
POST /api/donors/:donorId/request-contact
Authorization: Bearer {sessionToken}
↓
// Success response (unmasked contact info)
{
  phone: "01712345678",
  email: "donor@example.com"
}
↓
// Toast notification
toast.success("Contact information sent to your notifications")
```

### 3. Client-Side Eligibility Calculation
```typescript
// Import from lib/eligibility.ts
evaluateDonorEligibility(donor.lastDonationDate)
↓
{
  eligible: boolean,
  reason?: "cooldown_requirement",
  daysRemaining?: number
}
```

## Filter Configuration

Unlike `/requests`, donor directory only includes:
- ✅ Blood Group filter
- ✅ District filter
- ✅ Search input (300ms debounce)
- ❌ No urgency filter (not applicable to donors)
- ❌ No sort options (per spec)

## States

### Loading State
- Shows `DonorsGridSkeleton` with 12 skeleton cards
- Grid matches final layout (4/2/1 columns)
- Skeleton cards shape-matched to DonorCard

### Error State
- Alert icon + error message
- "Try Again" button (reloads page)
- Handles network errors, server errors, etc.

### Empty State
**With Filters Applied:**
- "No Donors Found"
- "Try adjusting your filters to see more donors"
- "Clear All Filters" button

**No Filters Applied:**
- "No Donors Found"
- "There are no registered donors at the moment"
- "Register as a Donor" CTA button

### Success State
- Grid of donor cards (4/2/1 columns)
- Stagger fade-in animation (via `card-grid-item` class)
- Pagination controls at bottom (if more than 1 page)

## URL State Management

All filters are synced to URL query params for:
- Shareable filtered views
- Browser back/forward navigation
- Page refresh preservation

**Example URLs:**
```
/donors                                    # Default view
/donors?bloodGroup=A+                      # Single blood group
/donors?bloodGroup=A+&bloodGroup=O+        # Multiple blood groups
/donors?district=Dhaka                     # Single district
/donors?search=eligible                    # Search term
/donors?bloodGroup=A+&district=Dhaka&page=2  # Combined filters + pagination
```

## Authentication Flow

### Browsing (Public)
- No authentication required
- All users can view donor directory
- Contact info is masked (`******XXXX`)

### Requesting Contact (Protected)
1. User clicks "Request Contact" button
2. Check session state:
   - **Not authenticated**: Redirect to `/sign-in?callbackUrl=/donors`
   - **Authenticated**: Proceed to API request
3. API call with session token in `Authorization` header
4. Success: Toast notification + contact info sent to notifications panel
5. Error: Toast error message

## Accessibility

- **Keyboard Navigation**: All interactive elements keyboard-accessible
- **Focus States**: Visible focus rings on all interactive elements
- **ARIA Labels**: Proper labels on all controls
- **Screen Readers**: Semantic HTML structure
- **Loading States**: `role="status"` on skeleton loaders
- **Empty States**: Descriptive text for context

## Performance Optimizations

- **Debounced Search**: 300ms delay prevents API spam
- **URL State Sync**: Filters update without full page reload
- **Pagination**: Only 12 donors loaded per page
- **Client-Side Eligibility**: No extra API calls for eligibility checks
- **Stagger Animation**: CSS-only fade-in (no JS animation library)

## Error Handling

### Network Errors
- Catch fetch failures
- Display user-friendly error message
- Provide "Try Again" action

### API Errors
- Parse error response from server
- Display specific error message
- Toast notifications for contact request failures

### Validation Errors
- N/A for this page (no form submission)
- Server-side validation on contact request endpoint

## Integration Points

### Components Used
- `DonorCard` (Phase 7d) - displays donor profile
- `Filters` (Phase 7e) - blood group + district filters
- `Pagination` (Phase 7f) - page navigation
- `DonorsGridSkeleton` (Phase 7g) - loading state
- `Button` (shadcn/ui) - CTAs and actions
- `toast` (sonner) - notifications

### API Endpoints
- `GET /api/donors` - fetch donor directory (Phase 5c)
- `POST /api/donors/:id/request-contact` - request contact info (Phase 5c)

### Auth Integration
- `authClient.useSession()` - get current session state
- Session token in `Authorization` header for protected requests
- Redirect to sign-in page for unauthenticated users

## Testing Checklist

### Functional Testing
- [x] Public route - no auth required for browsing
- [x] Blood group filter works correctly
- [x] District filter works correctly
- [x] Search filter works with 300ms debounce
- [x] Pagination works (page navigation, URL sync)
- [x] "Request Contact" redirects unauthenticated users
- [x] "Request Contact" calls API for authenticated users
- [x] Success toast shown on successful contact request
- [x] Error toast shown on failed contact request
- [x] Loading state shows skeleton loaders
- [x] Empty state shown when no donors found
- [x] Error state shown on API failure

### Visual Testing
- [x] Grid layout: 4 columns (desktop), 2 columns (tablet), 1 column (mobile)
- [x] Stagger fade-in animation on card load
- [x] Donor cards display all required fields
- [x] Eligibility badges show correct state
- [x] Phone numbers are masked (`******XXXX`)
- [x] Filters match theme styling
- [x] Pagination controls styled correctly

### Accessibility Testing
- [x] Keyboard navigation works
- [x] Focus states visible
- [x] ARIA labels present
- [x] Screen reader announces loading/empty states
- [x] Color contrast meets WCAG AA

### Edge Cases
- [x] No donors in database
- [x] Network timeout
- [x] Invalid filter combinations
- [x] Page number exceeds total pages
- [x] Session expired during contact request
- [x] Multiple rapid contact requests (loading state)

## Known Limitations

1. **No Sort Options**: Per spec, donors directory has no sort controls (unlike requests)
2. **No Donor Details Page**: Clicking a donor card doesn't navigate (only "Request Contact" action)
3. **Contact Info Viewing**: Unmasked contact info only shown in notifications panel, not on this page
4. **Eligibility Display**: Only shows eligibility badge, not detailed reasons (unlike DonorCard hover/tooltip)

## Future Enhancements (Out of Scope)

- Donor profile detail pages (`/donors/:id`)
- Map view of donors by location
- Saved donor lists (favorites)
- Direct messaging to donors
- Donor availability calendar
- Real-time donor status updates

## Related Documentation

- [Phase 7d - DonorCard Component](/components/donors/DonorCard.tsx)
- [Phase 7e - Filters Component](/components/shared/Filters.tsx)
- [Phase 7f - Pagination Component](/components/shared/Pagination.tsx)
- [Phase 5c - Donors API Endpoints](/bloodos-server/src/routes/donors.routes.ts)
- [Req 17 - Donor Directory Requirements](/requirements.md#17-donor-directory)
