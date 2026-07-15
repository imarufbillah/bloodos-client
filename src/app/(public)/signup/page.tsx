import { Suspense } from "react";
import Link from "next/link";
import { Metadata } from "next";
import { SignUpForm } from "@/components/forms/SignUpForm";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Sign Up | BloodOS",
  description: "Create your BloodOS account",
};

interface SignUpPageProps {
  searchParams: Promise<{ callbackUrl?: string; redirect?: string }>;
}

async function SignUpContent({ searchParams }: SignUpPageProps) {
  const params = await searchParams;
  const callbackUrl = params.callbackUrl;
  const redirectParam = params.redirect;

  // If we have callbackUrl but no redirect param, normalize to use redirect
  // For signup, default redirect is /profile for completing user profile
  if (callbackUrl && !redirectParam) {
    redirect(`/signup?redirect=${encodeURIComponent(callbackUrl)}`);
  } else if (!callbackUrl && !redirectParam) {
    // Default for signup without any params
    redirect(`/signup?redirect=${encodeURIComponent("/profile")}`);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16 pb-20 md:pb-12">
      <div className="w-full max-w-100 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="font-heading text-3xl">Create your account</h1>
          <p className="text-muted-foreground">
            Join BloodOS to connect donors and save lives
          </p>
        </div>

        {/* Sign Up Form */}
        <SignUpForm callbackUrl={redirectParam || callbackUrl || "/profile"} />

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
