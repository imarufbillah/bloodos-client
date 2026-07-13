import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Phase 8m — Proxy for auth redirects and route protection
 * 
 * In Next.js 16, middleware.ts has been renamed to proxy.ts with the
 * exported function renamed from `middleware` to `proxy`.
 * 
 * Reference: https://nextjs.org/docs/messages/middleware-to-proxy
 *
 * 1. Redirects /login → /signin (per unit 8m naming conflict resolution)
 * 2. Protects routes in (protected) and (admin) route groups (per Req 1.7)
 * 3. Preserves the original URL as callbackUrl for post-auth redirect
 */

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Redirect /login → /signin
  if (pathname === "/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/signin";
    return NextResponse.redirect(url);
  }

  // 2. Check authentication for protected routes
  // Note: better-auth stores session in cookies; we check for the presence
  // of the auth cookie to determine if user is authenticated.
  const authCookie = request.cookies.get("better-auth.session_token");
  const isAuthenticated = !!authCookie;

  // Define protected path prefixes
  const protectedPaths = ["/profile", "/requests/add", "/requests/manage"];
  const adminPaths = ["/admin"];

  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );
  const isAdminPath = adminPaths.some((path) => pathname.startsWith(path));

  // 3. Redirect unauthenticated users from protected routes
  if ((isProtectedPath || isAdminPath) && !isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = "/signin";
    // Preserve the original URL for redirect after sign-in
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  // 4. For admin routes, we let the page component check the role
  // (better-auth doesn't expose role in cookies by default, so we
  // verify role server-side in the page component)

  return NextResponse.next();
}

// Apply proxy to all routes except static files and API routes
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     * - api routes (handled by better-auth directly)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api).*)",
  ],
};
