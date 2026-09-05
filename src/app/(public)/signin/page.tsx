import { Suspense } from "react";
import Link from "next/link";
import { Metadata } from "next";
import { SignInForm } from "@/components/forms/SignInForm";
import { redirect } from "next/navigation";
import { Droplet, ShieldCheck, Clock, MapPin, Heart, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Sign In | BloodOS Emergency Triage",
  description: "Sign in to access your donor dashboard, coordinate emergency requests, and save lives across Bangladesh.",
};

interface SignInPageProps {
  searchParams: Promise<{ callbackUrl?: string; redirect?: string }>;
}

async function SignInContent({ searchParams }: SignInPageProps) {
  const params = await searchParams;
  const callbackUrl = params.callbackUrl;
  const redirectParam = params.redirect;

  if (callbackUrl && !redirectParam) {
    redirect(`/signin?redirect=${encodeURIComponent(callbackUrl)}`);
  }

  const destination = redirectParam || callbackUrl || "/profile";

  return (
    <div className="relative min-h-[calc(100dvh-4rem)] flex items-center justify-center pt-8 pb-24 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Ambient background glow */}
      <div 
        className="pointer-events-none absolute top-1/3 left-1/2 h-[380px] w-[600px] max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-crimson/5 blur-[120px]" 
        aria-hidden="true" 
      />

      <div className="container relative mx-auto max-w-7xl w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          
          {/* Left Column: Essential System Context (Desktop / Large Displays) */}
          <div className="lg:col-span-6 space-y-6 hidden lg:flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-teal font-mono">
              <span className="h-2 w-2 rounded-full bg-teal animate-pulse motion-reduce:animate-none" />
              <span>VERIFIED LIFESAVER NETWORK • 64 DISTRICTS</span>
            </div>

            <div className="space-y-3">
              <h1 className="font-heading text-3xl xl:text-4xl font-bold tracking-tight text-foreground leading-tight">
                Direct coordination for emergency blood transfusion.
              </h1>
              <p className="text-base text-muted-foreground leading-relaxed max-w-lg">
                Log in to manage urgent requests, track your 56-day donation rest cycle, and respond directly to critical hospital alerts across Bangladesh.
              </p>
            </div>

            {/* Distilled Telemetry Highlights */}
            <div className="space-y-3 pt-2 border-t border-border/60 max-w-lg">
              <div className="flex items-center gap-3 text-sm text-foreground/90">
                <Clock className="h-4 w-4 text-crimson shrink-0" />
                <span><strong className="font-semibold text-foreground">56-Day Biological Cooldown:</strong> Automatic medical rest tracking.</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-foreground/90">
                <ShieldCheck className="h-4 w-4 text-teal shrink-0" />
                <span><strong className="font-semibold text-foreground">Phone Privacy Masking:</strong> Full protection against broker spam.</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-foreground/90">
                <MapPin className="h-4 w-4 text-ochre shrink-0" />
                <span><strong className="font-semibold text-foreground">64-District Dispatch:</strong> Real-time hospital matching within minutes.</span>
              </div>
            </div>
          </div>

          {/* Right Column: Distilled Auth Capsule (Responsive on Mobile, Tablet & Desktop) */}
          <div className="lg:col-span-6 w-full max-w-md mx-auto">
            <div className="rounded-2xl border border-border bg-card/95 backdrop-blur-md p-5 sm:p-7 md:p-8 shadow-sm space-y-5 sm:space-y-6">
              
              {/* Card Header */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-crimson text-paper shadow-xs">
                    <Droplet className="h-4 w-4 fill-paper" />
                  </div>
                  <span className="font-heading font-bold text-base text-foreground">BloodOS</span>
                </div>
                
                <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
                  Sign In
                </h2>
                <p className="text-xs text-muted-foreground">
                  Access your donor dashboard and emergency notifications
                </p>
              </div>

              {/* Form Component */}
              <SignInForm callbackUrl={destination} />

              {/* Footer Links with Accessible Touch Targets */}
              <div className="pt-2 border-t border-border/60 text-center space-y-1.5">
                <p className="text-xs text-muted-foreground flex flex-wrap items-center justify-center gap-1">
                  <span>Don&apos;t have an account yet?</span>
                  <Link
                    href={`/signup${redirectParam ? `?redirect=${encodeURIComponent(redirectParam)}` : ""}`}
                    className="inline-flex items-center min-h-[36px] py-1 font-semibold text-crimson hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-crimson rounded touch-manipulation"
                  >
                    Register here
                  </Link>
                </p>

                <p className="text-[11px] text-muted-foreground/80">
                  By signing in, you agree to our{" "}
                  <Link href="/privacy" className="inline-flex items-center min-h-[32px] py-0.5 underline hover:text-foreground transition-colors touch-manipulation">
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function SignInPage(props: SignInPageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100dvh-4rem)] flex items-center justify-center">
          <div className="space-y-2 text-center">
            <div className="h-8 w-8 rounded-full border-2 border-crimson border-t-transparent animate-spin mx-auto" />
            <p className="font-mono text-xs text-muted-foreground">Initializing BloodOS Authentication...</p>
          </div>
        </div>
      }
    >
      <SignInContent {...props} />
    </Suspense>
  );
}
