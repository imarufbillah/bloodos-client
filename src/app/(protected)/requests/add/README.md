# Create Blood Request Page (Phase 8h)

## Route
`/requests/add` (Protected)

## Status
✅ Complete

## Overview
Blood request creation form that allows authenticated users to post urgent blood donation requests. The form follows a logical grouping structure (patient → medical → location → timing) designed for users in potentially stressful situations.

## Files Created

### Page Component
- **`page.tsx`** - Main page with header, form container, and help text

### Form Component
- **`components/forms/AddRequestForm.tsx`** - Client component with:
  - 5 logical sections (Patient, Medical, Location, Timing, Contact, Additional)
  - Real-time validation with Zod
  - Inline error messages
  - Live urgency badge preview
  - Loading states
  - Toast notifications
  - Automatic redirect on success

### Validation Schema
- **`lib/validators/request.schema.ts`** - Zod schema that mirrors backend validation:
  - Patient name (2-100 chars)
  - Blood group (enum validation)
  - Units needed (1-10)
  - Hospital name & address
  - District (enum validation)
  - Urgency (enum validation)
  - Needed by date (future date validation)
  - Contact phone (Bangladesh format: 01XXXXXXXXX)
  - Additional notes (optional, max 1000 chars)

### UI Components
- **`components/ui/select.tsx`** - Native select wrapper with consistent styling

### Layout
- **`app/(protected)/layout.tsx`** - Protected route wrapper with auth check

## Functional Requirements Met

### Req 20.1-20.10 (All)
- ✅ **20.1**: Blood request creation form implemented
- ✅ **20.2**: Auth required (protected layout with redirect)
- ✅ **20.3**: All required fields present:
  - patientName
  - bloodGroup
  - unitsNeeded
  - hospitalName
  - hospitalAddress
  - district
  - urgency
  - neededByDate
  - contactPhone
  - additionalNotes (optional)
- ✅ **20.4**: Zod validation mirrors backend validator exactly
- ✅ **20.5**: Submits to `POST /api/requests`
- ✅ **20.6-20.8**: Server sets requesterId, timestamps, status (handled by backend)
- ✅ **20.9**: Validation errors shown inline with field-level detail
- ✅ **20.10**: Success toast + redirect to `/requests/manage`

### Req 7.1-7.12 (Validation)
- ✅ **7.1**: Phone format validated (01XXXXXXXXX)
- ✅ **7.2**: District enum validated
- ✅ **7.3**: Blood group enum validated
- ✅ **7.4**: Units 1-10 validated
- ✅ **7.5**: Future date validation
- ✅ **7.6**: Field-level error messages
- ✅ All validation mirrors backend exactly

### Req 16 (UI/UX)
- ✅ **16.3**: Keyboard navigable with visible focus states
- ✅ **16.4**: Focus rings use teal (--ring), not crimson
- ✅ **16.9**: Consistent form styling across application

## Design Direction

### Logical Field Grouping
1. **Patient Information** - Name
2. **Medical Requirements** - Blood group, units needed
3. **Location** - Hospital name, address, district
4. **Urgency & Timeline** - Urgency level, needed by date
5. **Contact Information** - Phone number
6. **Additional Information** - Optional notes

### For Hurried Users
- Clear section headers with descriptions
- Required fields marked with *
- No multi-step wizard (single page form)
- Inline validation (errors appear immediately)
- Large touch targets
- Clear button labels

### Live Urgency Preview
When user selects urgency level, a live preview of the urgency badge appears below the dropdown, using the exact pill styling from Phase 7h (UrgencyBadge component).

### Accessibility
- Proper label associations
- aria-invalid on error fields
- aria-describedby linking to error messages
- role="alert" on error messages
- Semantic HTML structure
- Keyboard navigation support

## API Integration

### Endpoint
`POST /api/requests`

### Request Body
```typescript
{
  patientName: string;
  bloodGroup: BloodGroup;
  unitsNeeded: number;
  hospitalName: string;
  hospitalAddress: string;
  district: District;
  urgency: "critical" | "urgent" | "moderate";
  neededByDate: string; // ISO date
  contactPhone: string;
  additionalNotes?: string;
}
```

### Success Response
- 201 Created
- Returns created request object
- Toast: "Blood request created successfully"
- Redirect: `/requests/manage`

### Error Handling
- Zod validation errors → inline field errors
- API errors → toast notification
- Network errors → toast notification
- Loading state prevents double submission

## User Flow

1. User navigates to `/requests/add` (must be logged in)
2. Protected layout checks authentication
   - If not authenticated → redirect to `/login`
   - If authenticated → show form
3. User fills out form sections in order
4. Client-side validation on blur/change
5. User clicks "Post Blood Request"
6. Form validates with Zod
7. If validation fails → show inline errors
8. If validation passes → submit to API
9. If API fails → show toast error
10. If API succeeds → show toast + redirect to `/requests/manage`

## Edge Cases Handled

### Authentication
- Unauthenticated access redirected to login
- JWT sent via cookies (credentials: include)
- Loading state while checking auth

### Validation
- Empty required fields
- Invalid blood group/district/urgency
- Units outside 1-10 range
- Past dates for neededByDate
- Invalid phone format
- Notes exceeding 1000 chars

### Form State
- Disabled during submission (prevents double-post)
- Clear error messages
- Preserves form data on validation error
- Cancel button with browser back

### Date Input
- Minimum date set to today
- Browser native date picker
- ISO format for API

## Testing Checklist

### Manual Testing
- [ ] Protected route redirects when not logged in
- [ ] All fields render correctly
- [ ] Urgency preview updates on selection
- [ ] Required field validation works
- [ ] Phone format validation (01XXXXXXXXX)
- [ ] Date cannot be in past
- [ ] Units must be 1-10
- [ ] Blood group dropdown has all 8 groups
- [ ] District dropdown has all 64 districts
- [ ] Submit shows loading state
- [ ] Success redirects to /requests/manage
- [ ] Error shows toast
- [ ] Cancel button returns to previous page

### Accessibility Testing
- [ ] Tab navigation works through all fields
- [ ] Focus states visible
- [ ] Error messages announced by screen readers
- [ ] Labels properly associated
- [ ] Form submits with Enter key

## Dependencies
- React Hook Form alternative: Native form with Zod validation
- Zod for schema validation
- Sonner for toast notifications
- Next.js useRouter for navigation
- Better-auth useSession for auth check

## Future Enhancements (Not in Scope)
- Image upload for patient/prescription
- Save as draft functionality
- Auto-save to local storage
- Multiple contact methods
- Hospital autocomplete
- GPS location picker
- Donation history check before post

## Notes
- Form uses native HTML validation + Zod for double validation
- Server performs final validation (never trust client)
- Phone masking not needed on create (only on display)
- Image upload field prepared but not implemented (backend support needed)
- Form state not preserved on navigation away (intentional for security)
