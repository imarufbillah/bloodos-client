import { Suspense } from "react";
import Link from "next/link";
import { Metadata } from "next";
import { SignInForm } from "@/components/forms/SignInForm";
import { redirect } from "next/navigation";

/**
 * Phase 8m — Sign In Page
 * Route: /signin (with /login → /signin redirect handled in middleware)
 * Per Req 1.7, unauthenticated users attempting to access protected routes
 * are redirected here with a callbackUrl param.
 *
 * Design direction (unit 8m): Deliberately the quietest page in the app —
 * no card anatomy, no urgency badges. This is the one moment before someone
 * can act. Centered single-column form, max-width ~400px. Fraunces heading,
 * Public Sans labels/inputs, crimson primary button, teal focus rings.
 */

export const metadata: Metadata = {
  title: "Sign In | BloodOS",
  description: "Sign in to your BloodOS account",
};

interface SignInPageProps {
  searchParams: Promise<{ callbackUrl?: string; redirect?: string }>;
}

async function SignInContent({ searchParams }: SignInPageProps) {
  const params = await searchParams;
  const callbackUrl = params.callbackUrl;
  const redirectParam = params.redirect;

  // If we have callbackUrl but no redirect param, normalize to use redirect
  if (callbackUrl && !redirectParam) {
    redirect(`/signin?redirect=${encodeURIComponent(callbackUrl)}`);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16 pb-20 md:pb-12">
      <div className="w-full max-w-[400px] space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="font-heading text-3xl">Welcome back</h1>
          <p className="text-muted-foreground">
            Sign in to your account to continue
          </p>
        </div>

        {/* Sign In Form */}
        <SignInForm callbackUrl={redirectParam || callbackUrl} />

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Don&apos;t have an account?
            </span>
          </div>
        </div>

        {/* Sign Up Link */}
        <div className="text-center">
          <Link
            href="/signup"
            className="text-sm text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
          >
            Create a new account
          </Link>
        </div>

        {/* Help Text */}
        <p className="text-center text-xs text-muted-foreground">
          By signing in, you agree to our{" "}
          <Link
            href="/privacy"
            className="underline hover:text-foreground transition-colors"
          >
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignInPage(props: SignInPageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      }
    >
      <SignInContent {...props} />
    </Suspense>
  );
}
