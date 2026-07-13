import { Suspense } from "react";
import Link from "next/link";
import { Metadata } from "next";
import { SignUpForm } from "@/components/forms/SignUpForm";

/**
 * Phase 8m — Sign Up Page
 * Route: /signup
 * Per unit 8m decision: collects only email/password/name at registration.
 * Extended fields (phone, district, bloodGroup, isDonor, lastDonationDate)
 * per Req 1.8 are collected on /profile after first login (unit 8j).
 *
 * Design direction: Same minimal aesthetic as /signin — centered form,
 * max-width ~400px, Fraunces heading, Public Sans body.
 */

export const metadata: Metadata = {
  title: "Sign Up | BloodOS",
  description: "Create your BloodOS account",
};

interface SignUpPageProps {
  searchParams: Promise<{ callbackUrl?: string }>;
}

async function SignUpContent({ searchParams }: SignUpPageProps) {
  const params = await searchParams;
  const callbackUrl = params.callbackUrl;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[400px] space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="font-heading text-3xl">Create your account</h1>
          <p className="text-muted-foreground">
            Join BloodOS to connect donors and save lives
          </p>
        </div>

        {/* Sign Up Form */}
        <SignUpForm callbackUrl={callbackUrl} />

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Already have an account?
            </span>
          </div>
        </div>

        {/* Sign In Link */}
        <div className="text-center">
          <Link
            href="/signin"
            className="text-sm text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
          >
            Sign in instead
          </Link>
        </div>

        {/* Help Text */}
        <p className="text-center text-xs text-muted-foreground">
          By creating an account, you agree to our{" "}
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

export default function SignUpPage(props: SignUpPageProps) {
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
      <SignUpContent {...props} />
    </Suspense>
  );
}
