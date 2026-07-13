# Phase 8m — Authentication Pages

## Implementation Summary

This phase implements `/signin` and `/signup` pages with better-auth integration, following the unit 8m specification from `prompts.md`.

## Files Created

### Pages
- **`/signin/page.tsx`** — Sign-in page with email/password form
- **`/signup/page.tsx`** — Registration page with email/password/name form

### Components
- **`components/forms/SignInForm.tsx`** — Client component handling sign-in logic
- **`components/forms/SignUpForm.tsx`** — Client component handling registration logic

### Validation
- **`lib/validators/auth.schema.ts`** — Zod schemas for sign-in and sign-up forms

### Proxy (Next.js 16)
- **`proxy.ts`** — Route protection and `/login` → `/signin` redirect
  - Note: In Next.js 16, `middleware.ts` is deprecated and replaced by `proxy.ts`
  - Reference: https://nextjs.org/docs/messages/middleware-to-proxy

## Design Decisions

### 1. Route Naming: `/signin` vs `/login`

**Decision:** Use `/signin` and `/signup` as primary routes, with middleware redirect from `/login` → `/signin`

**Rationale:**
- Req 1.7 specifies *"/login"* as the redirect target
- Modern convention prefers "sign in/sign up" over "log in/log out"
- Middleware redirect ensures backwards compatibility with any hardcoded `/login` references

### 2. Registration Fields

**Decision:** Collect only `email`, `password`, and `name` at registration

**Rationale:**
- Reduces friction at first touch
- Extended fields (phone, district, bloodGroup, isDonor, lastDonationDate) per Req 1.8 are collected later on `/profile` (unit 8j)
- Better-auth server config already sets `role: "user"` by default (Req 1.9)
- No `role` field exposed in client forms (Req 1.10)

### 3. Rate Limiting Display

**Implementation:** Forms parse `Retry-After` header and display countdown

**Edge case handling:**
- 429 responses show specific "try again in X minutes" message
- Submit button disabled during rate limit period
- Banner with alert icon highlights the restriction

### 4. Callback URL Handling

**Implementation:** Proxy appends `?callbackUrl={originalPath}` when redirecting to `/signin`

**Flow:**
1. Unauthenticated user attempts to access `/profile`
2. Proxy redirects to `/signin?callbackUrl=/profile`
3. After successful sign-in, user is redirected to `/profile`
4. If no callbackUrl, defaults to `/` (home)

### 5. Error Handling

**Client-side validation:**
- Zod schemas enforce all rules before submission
- Inline field errors displayed immediately
- Password strength requirements shown as helper text

**Server-side errors:**
- Invalid credentials → inline error, not toast
- Duplicate email → specific error message
- Network/unexpected errors → toast notification

## Design Aesthetic

Per unit 8m specification:

> Deliberately the quietest page in the app — no card anatomy, no urgency badges, this is the one moment before someone can act.

**Implementation:**
- Centered single-column form, max-width 400px
- Fraunces for headings ("Welcome back" / "Create your account")
- Public Sans for labels, inputs, body text
- Crimson primary button (inherited from theme)
- Teal focus rings (inherited from `--ring` token, Req 16.4)
- No shadows, no animations beyond focus states
- Minimal visual hierarchy — form is the only element

## Better-Auth Integration

### Client SDK (`lib/auth-client.ts`)

```typescript
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  plugins: [jwtClient()],
});
```

**Note:** The existing file had a duplicate `createAuthClient()` call that was fixed in this phase.

### Methods Used
- `authClient.signIn.email({ email, password })`
- `authClient.signUp.email({ email, password, name })`

**Session management:**
- better-auth handles cookie creation automatically
- Session token stored in `better-auth.session_token` cookie
- Middleware checks for presence of this cookie to determine authentication status

### Server Config (`lib/auth.ts`)

**Not modified in this phase** — only consumed.

Existing schema extension (from earlier phases):
```typescript
user: {
  additionalFields: {
    role: {
      type: "string",
      default: "user",
      enum: ["user", "admin"],
      input: false, // Cannot be set by client
      required: true,
    },
    // Additional fields: phone, district, bloodGroup, isDonor, lastDonationDate
  }
}
```

## Proxy Implementation (Next.js 16)

**Important:** In Next.js 16, `middleware.ts` has been deprecated and replaced by `proxy.ts`. The exported function is renamed from `middleware` to `proxy`. This change clarifies that the file acts as a proxy layer in the request lifecycle, not traditional middleware.

Reference: [Next.js Middleware to Proxy Migration](https://nextjs.org/docs/messages/middleware-to-proxy)

### Protected Routes

**Paths requiring authentication:**
- `/profile`
- `/requests/add`
- `/requests/manage`
- `/admin` (also requires admin role, verified in page component)

**Behavior:**
- Unauthenticated access → redirect to `/signin?callbackUrl={path}`
- Authenticated access → allow through

### Admin Routes

**Decision:** Role check performed in page component, not proxy

**Rationale:**
- better-auth doesn't expose `role` in cookies by default
- Proxy only checks authentication (presence of session token)
- Admin pages call `useSession()` and verify `user.role === "admin"` before rendering

## Acceptance Checklist

From unit 8m specification:

- [x] Redirect conflict resolved: `/login` → `/signin` via middleware
- [x] No `role` field on either form (Req 1.9)
- [x] Both forms call existing `authClient`, don't reimplement token handling
- [x] `auth.ts` schema extension not modified or duplicated
- [x] 429 responses show rate-limit-specific message with countdown
- [x] Successful signin/signup redirects correctly (respects callbackUrl)
- [x] Keyboard-navigable, visible focus states (Req 16.3/16.4)

## Testing Checklist

### Manual Testing Scenarios

1. **Sign Up Flow**
   - [ ] Valid data → account created, redirected to /profile
   - [ ] Duplicate email → error shown
   - [ ] Weak password → validation error
   - [ ] Password mismatch → validation error
   - [ ] Rate limit exceeded → countdown shown, submit disabled

2. **Sign In Flow**
   - [ ] Valid credentials → signed in, redirected to callbackUrl or /
   - [ ] Invalid credentials → error shown
   - [ ] Empty fields → validation errors
   - [ ] Rate limit exceeded → countdown shown

3. **Middleware Redirect**
   - [ ] Access /login → redirected to /signin
   - [ ] Access /profile (unauthenticated) → redirected to /signin?callbackUrl=/profile
   - [ ] Sign in → redirected back to /profile

4. **Accessibility**
   - [ ] Tab navigation works through all fields
   - [ ] Focus rings visible (teal outline)
   - [ ] Error messages announced by screen readers (aria-describedby)
   - [ ] Form fields have proper labels and autocomplete attributes

## Known Limitations

1. **Admin role verification** — Happens in page component, not proxy. This means an authenticated non-admin user can technically access `/admin` URL but will see a 403/redirect when the page loads.

2. **Extended fields** — Not collected at registration. Users must complete their profile after first sign-in. Consider adding a banner/prompt to guide new users to `/profile`.

3. **Password reset** — Not implemented in this phase. better-auth supports password reset, but it requires email sending configuration. Plan for unit 8n or later.

4. **OAuth** — Google OAuth configured in `auth.ts` but no UI buttons provided in this phase. Add social login buttons in a follow-up if needed.

5. **Next.js 16 Migration** — This implementation uses `proxy.ts` (Next.js 16 convention) instead of the deprecated `middleware.ts`. If upgrading from an earlier Next.js version, Vercel provides a codemod: `npx @next/codemod@canary middleware-to-proxy`

## Dependencies

**Runtime:**
- `better-auth` ^1.6.23
- `@hookform/resolvers` ^5.4.0
- `react-hook-form` ^7.81.0
- `zod` ^4.4.3
- `sonner` ^2.0.7
- `react-icons` ^5.7.0

**Already present in package.json** — no new installations required.

## Related Units

- **Unit 1a** — Shared types (UserExtension with role field)
- **Unit 2b** — Auth middleware (server-side JWT verification)
- **Unit 6a** — Theme tokens (Fraunces, Public Sans, crimson, teal, --ring)
- **Unit 7a** — Navbar (will need to show sign-in/sign-up vs profile link based on session)
- **Unit 8j** — Profile page (will collect extended fields for new users)

## Next Steps

1. **Test the flow end-to-end:**
   ```bash
   cd bloodos-client
   npm run dev
   # Visit http://localhost:3000/signin
   # Visit http://localhost:3000/signup
   ```

2. **Update Navbar (unit 7a)** to show:
   - Unauthenticated: "Sign In" and "Sign Up" links
   - Authenticated: User name + dropdown with "Profile" and "Sign Out"

3. **Add sign-out functionality** — better-auth provides `authClient.signOut()`, wire it to a button in Navbar dropdown.

4. **Profile completion flow** — After first sign-in, redirect to `/profile` with a banner prompting user to complete their donor information.

5. **Error logging** — Console errors are present for debugging; consider integrating with a logging service (Sentry, LogRocket) before production.

## References

- [better-auth Docs](https://www.better-auth.com/docs)
- [Unit 8m Specification](../../../prompts.md#8m--auth-signin-and-signup)
- [Requirements Document](../../../requirements.md) — Req 1.1–1.10, 15.1–15.6, 16.3–16.4
