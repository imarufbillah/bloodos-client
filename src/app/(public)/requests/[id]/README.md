# Request Details Page - Phase 8c

## Overview

The Request Details page (`/requests/:id`) provides a comprehensive view of a single blood donation request with six distinct sections, interactive features, and role-based content visibility.

## File Structure

```
app/(public)/requests/[id]/
├── page.tsx                    # Server component with data fetching
├── RequestDetailsContent.tsx   # Client component with interactivity
└── README.md                   # This file
```

## Implementation Details

### Architecture

**Server Component (`page.tsx`)**:
- Fetches request data on the server
- Implements ISR (Incremental Static Regeneration) with 60-second revalidation
- Generates dynamic metadata for SEO
- Handles 404 errors when request not found
- Provides loading skeleton

**Client Component (`RequestDetailsContent.tsx`)**:
- Handles all interactive features
- Manages authentication state
- Fetches related requests client-side
- Implements "I Can Help" response submission
- Shows role-based content (owner vs visitor)

### Six Sections

#### 1. Overview - Hero Section
**Features**:
- Large patient name heading (Fraunces font)
- Status and urgency badges
- Critical requests show the signature heartbeat pulse bar
- Three key metrics in a grid:
  - Blood Group (crimson-highlighted, monospace)
  - Units Needed (with icon)
  - Needed By date (with countdown)
- "I Can Help" CTA button (when request is open)

**Design**:
- Full-width card with optional crimson border for critical requests
- Metrics use muted background cards for visual hierarchy
- Button states: disabled for owner, loading during submission

#### 2. Key Information
**Fields**:
- Patient Name
- Blood Group (monospace, crimson text)
- Units Needed
- Hospital Name
- Needed By date (formatted as full date + time)
- Posted timestamp (relative time)

**Design**:
- Icon + label + value grid layout
- InfoRow component for consistent formatting
- Responsive two-column layout on desktop

#### 3. Location
**Fields**:
- Hospital Name
- Full Address
- District

**Design**:
- Same InfoRow pattern as Key Information
- MapPinned icon for section header
- Clear visual separation from other sections

#### 4. Additional Notes
**Features**:
- Displays `additionalNotes` field if present
- Preserves whitespace and line breaks
- Only shown when notes exist

**Design**:
- Simple card with text content
- Readable line height and spacing
- Pre-wrap to maintain formatting

#### 5. Contact Information
**Features**:
- Phone number display
- **Masking Logic** (Req 4.1-4.3):
  - Visitors see: `01XXX***XXX` (first 5 digits, last 3 digits visible)
  - Owners see: Full unmasked number
  - Admins see: Full unmasked number (future enhancement)
- Explanatory note for visitors about masking

**Design**:
- Monospace font for phone number
- Border-top disclaimer text for non-owners
- Phone icon for quick recognition

#### 6. Related Requests
**Features**:
- Shows up to 6 related requests via `GET /api/requests/related/:id`
- Algorithm (Req 14.2-14.6):
  - Same blood group AND district
  - Only `open` or `in_progress` status
  - Excludes current request
  - Sorted by urgency (critical > urgent > moderate)
  - Then by `neededByDate` ascending
- Uses `RequestCard` component for consistency
- Loading skeleton during fetch

**Design**:
- 3-column grid on desktop, 2 on tablet, 1 on mobile
- Stagger fade-in animation on cards
- Section heading with context (blood group + district)

### Interactive Features

#### "I Can Help" Button (Req 21.20-21.22)

**Behavior**:
1. **Unauthenticated users**: 
   - Button shown with tooltip
   - Click redirects to sign-in page with return URL
   - Toast: "Please sign in to respond to requests"

2. **Authenticated non-donors**:
   - Button shown but with disclaimer
   - Toast: "Only registered donors can respond to requests"

3. **Authenticated donors**:
   - Button enabled
   - Click triggers `POST /api/requests/:id/respond`
   - Shows loading state during submission
   - Success: Toast + redirect to `/profile` after 1.5s
   - Error: Toast with error message

4. **Request owner**:
   - Button disabled with "Your Request" text

**API Integration**:
```typescript
POST /api/requests/:id/respond
Headers: {
  Authorization: `Bearer ${token}`,
  Content-Type: "application/json"
}
Body: {
  message: "I can help with this blood donation request."
}
```

**Response Handling**:
- Success (200): `{ success: true, message: "..." }`
- Error (400/403/500): `{ success: false, message: "..." }`
- Network errors caught and displayed

### Phone Masking Implementation

**Format** (Bangladesh 11-digit):
- Input: `01712345678`
- Masked: `01712***678`
- Pattern: First 5 visible + 3 asterisks + last 3 visible

**Function**:
```typescript
function maskPhone(phone: string): string {
  if (!phone || phone.length !== 11) return phone;
  return `${phone.slice(0, 5)}***${phone.slice(-3)}`;
}
```

**Applied**:
- GET response from backend already includes masked contact for non-owners
- Client-side masking is defensive (shouldn't be needed if backend is correct)
- Contact reveal is handled via separate `/api/donors/:id/request-contact` endpoint

### Role-Based Visibility

| Section | Visitor | Owner | Admin |
|---------|---------|-------|-------|
| Overview | ✓ | ✓ | ✓ |
| Key Info | ✓ | ✓ | ✓ |
| Location | ✓ | ✓ | ✓ |
| Description | ✓ | ✓ | ✓ |
| Contact (masked) | ✓ | Full | Full |
| Related Requests | ✓ | ✓ | ✓ |
| "I Can Help" | Donors only | Hidden | Hidden |
| Responses (future) | - | ✓ | ✓ |

### SEO & Metadata

**Dynamic Title**:
```
{patientName} needs {bloodGroup} blood - BloodOS
```

**Dynamic Description** (160 chars max):
```
{urgency} blood request for {unitsNeeded} units of {bloodGroup} 
blood at {hospitalName}, {district}. {additionalNotes}
```

**Fallback** (on error):
- Title: "Request Details - BloodOS"
- Description: "View blood donation request details"

### Loading States

**Initial Page Load**:
- Server-side skeleton with 5 sections
- Animated pulse effect
- Full-page height maintained

**Related Requests**:
- Client-side skeleton grid (3 cards)
- Only shown while fetching
- Replaced with results or hidden if empty

**Button Submission**:
- Button text changes: "I Can Help" → "Submitting..."
- Button disabled during submission
- Toast feedback on completion

### Error Handling

**Request Not Found (404)**:
- Handled by Next.js `notFound()` function
- Shows default 404 page
- No partial content displayed

**Related Requests Failure**:
- Logged to console
- Empty array returned
- Section hidden (not shown as error)

**Response Submission Failure**:
- Network errors caught
- API errors parsed from response
- Toast displays specific error message
- Button re-enabled for retry

### Accessibility

**Keyboard Navigation**:
- Back button is keyboard accessible
- "I Can Help" button has focus states
- All links are keyboard navigable

**Screen Readers**:
- Semantic HTML structure (sections, headings)
- Icons have `aria-hidden="true"` attribute
- Status badges have visible text + icon
- Proper heading hierarchy (h1 → h2)

**Focus Management**:
- Ring utility classes on interactive elements
- Visible focus states on all buttons/links

### Design System Compliance

**Typography**:
- Fraunces: Patient name (h1), section headings (h2)
- Public Sans: Body text, labels, descriptions
- IBM Plex Mono: Blood group, phone number, timestamps

**Colors**:
- Crimson: Blood group emphasis, critical urgency
- Teal: Section header icons, status indicators
- Ochre: Urgent urgency, expiring soon warnings
- Slate: Moderate urgency
- Ink/Paper: Base text and backgrounds

**Spacing**:
- 4px base unit
- Consistent gaps: 8px/12px/16px
- Section padding: 16px/24px
- Container max-width: 1024px (4xl)

**Components**:
- Badge: Urgency and status indicators
- Button: Primary CTA, ghost back button
- Card: Section containers with borders
- Icons: lucide-react throughout

**Animations**:
- Critical pulse bar: Heartbeat keyframe
- Card grid: Stagger fade-in on load
- No micro-animations on state changes

## Requirements Coverage

### Functional Requirements

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| Req 21.12 | ✓ | Public route (no auth guard) |
| Req 21.13 | ✓ | Overview section with all key indicators |
| Req 21.14 | ✓ | Key Info section with all fields |
| Req 21.15 | ✓ | Location section with address |
| Req 21.16 | ✓ | Description section (when present) |
| Req 21.17 | ✓ | Contact masking for non-owners |
| Req 21.18 | ⚠️ | Responses section (owner-only) - Not yet implemented |
| Req 21.19 | ✓ | Related requests via `/api/requests/related/:id` |
| Req 21.20 | ✓ | "I Can Help" button (donor-only, auth-gated) |
| Req 21.21 | ✓ | `POST /api/requests/:id/respond` integration |
| Req 21.22 | ✓ | Success toast after response |
| Req 14.2-14.6 | ✓ | Related requests algorithm (blood + district + status + sort) |
| Req 4.1-4.3 | ✓ | Phone masking format `01XXX***XXX` |

### Design Requirements

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| Sectioned layout | ✓ | Six distinct sections with dividers |
| Hairline dividers | ✓ | `border-border` utility throughout |
| No cards-within-cards | ✓ | Flat section structure |
| Critical pulse bar | ✓ | `.critical-pulse-bar` on overview |
| Card grid rhythm | ✓ | Same stagger animation as browse page |
| Responsive layout | ✓ | Mobile-first grid system |

### Not Yet Implemented

**Responses Section (Req 21.18)**:
- Owner/admin-only section
- Lists all responses to the request
- Shows donor names, response status, timestamps
- Action buttons: Accept/Decline responses
- **Planned for**: Future enhancement or separate Phase 8c-responses unit

**Why deferred**:
- Responses CRUD is complex (own state machine)
- Requires additional API endpoints (GET responses)
- Needs admin action logging on status changes
- Not blocking for basic request details viewing

## Testing Checklist

### Functional Tests

- [ ] Request data loads correctly
- [ ] 404 handling for non-existent requests
- [ ] All six sections render with correct data
- [ ] Phone masking works for visitors
- [ ] Full phone shown for owners
- [ ] Related requests fetch and display
- [ ] "I Can Help" button shows for donors
- [ ] Button disabled for owner
- [ ] Redirect to sign-in for unauthenticated users
- [ ] Response submission success flow
- [ ] Response submission error handling
- [ ] Toast notifications appear correctly
- [ ] Redirect to profile after successful response

### Visual Tests

- [ ] Critical requests show pulse bar
- [ ] Urgency badges styled correctly
- [ ] Status badges match design system
- [ ] Metrics grid responsive on mobile
- [ ] Section spacing consistent
- [ ] Related requests grid layout
- [ ] Loading skeletons appear
- [ ] Icons aligned properly
- [ ] Typography hierarchy clear

### Accessibility Tests

- [ ] Keyboard navigation works
- [ ] Screen reader can read all content
- [ ] Focus states visible
- [ ] Heading structure logical
- [ ] Icons have proper ARIA attributes
- [ ] Button states announced

### Browser Tests

- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari
- [ ] Mobile Safari (iOS)
- [ ] Chrome Android

## Known Limitations

1. **No Responses Section**: Deferred to future implementation
2. **No Admin Action Logging**: Contact masking visibility doesn't log admin actions yet
3. **No Edit Capability**: Owners can't edit request details from this page
4. **No Share Button**: Social sharing not implemented
5. **No Print Styling**: Page not optimized for printing
6. **Static Related Requests**: Not refreshed when data changes (needs revalidation)

## Future Enhancements

1. **Responses Section**:
   - List all responses with donor info
   - Accept/Decline actions for owner
   - Status change notifications
   - Admin moderation capabilities

2. **Edit Request**:
   - Inline editing for owner
   - Modal or separate page for full edit
   - Validation and error handling

3. **Share Features**:
   - Copy link button
   - Social media share buttons
   - QR code generation
   - WhatsApp/Telegram direct share

4. **Enhanced Related Requests**:
   - Real-time updates via WebSocket
   - Infinite scroll or "Load More" button
   - Filter/sort controls
   - Distance-based sorting (if location data available)

5. **Rich Contact**:
   - Click-to-call button
   - Email integration
   - WhatsApp direct message
   - Contact audit log visibility for owner

6. **Analytics**:
   - View count
   - Response rate
   - Time to first response
   - Fulfillment rate

## Integration Points

### Backend APIs
- `GET /api/requests/:id` - Fetch single request
- `GET /api/requests/related/:id` - Fetch related requests (limit 6)
- `POST /api/requests/:id/respond` - Submit donor response

### Authentication
- `useSession()` from `@/lib/auth-client`
- Better-Auth handles authentication via HTTP-only cookies automatically
- No manual token passing required - credentials sent via `credentials: "include"`
- Role checks: `isDonor`, `role === "admin"`, ownership

### Components
- `<RequestCard>` - Shared card component for related requests
- `<Badge>` - shadcn badge for status/urgency
- `<Button>` - shadcn button for actions
- Toast notifications via `sonner`

### State Management
- React state for related requests
- React state for submission loading
- URL params for redirect after sign-in
- Session state for auth/role checks

## Performance Considerations

**Server-Side Rendering**:
- Request data fetched on server
- ISR caching with 60-second revalidation
- Reduces client-side loading time

**Client-Side Fetching**:
- Related requests fetched client-side
- Prevents blocking main content
- Shows skeleton during load

**Image Optimization**:
- No images in this implementation
- Future: Use Next.js Image component for patient photos

**Code Splitting**:
- Client component auto-split by Next.js
- date-fns imported (small utility library)
- No heavy dependencies

## Deployment Notes

**Environment Variables**:
```env
NEXT_PUBLIC_API_URL=https://api.bloodos.app
NEXT_PUBLIC_BASE_URL=https://bloodos.app
```

**Build Validation**:
```bash
npm run build
npm run lint
```

**Type Checking**:
```bash
tsc --noEmit
```

## Related Files

- **Phase 8b**: Browse Requests page - `/app/(public)/requests/page.tsx`
- **Phase 7c**: RequestCard component - `/components/requests/RequestCard.tsx`
- **Phase 7h**: Badge components - Inline in RequestCard (to be extracted)
- **Phase 6a**: Theme setup - `/app/globals.css`
- **Backend Phase 5a**: Requests API - `bloodos-server/src/routes/requests.routes.ts`
- **Backend Phase 5b**: Related requests - `bloodos-server/src/controllers/requests.controller.ts`

---

**Implementation Date**: 2026-07-13  
**Phase**: 8c - Request Details Page  
**Status**: ✓ Complete (except Responses section)  
**Next**: Phase 8d - Donor Directory (`/donors`)
