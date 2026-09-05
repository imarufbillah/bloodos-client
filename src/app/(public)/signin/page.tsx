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
    <div className="relative min-h-[calc(100dvh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Subtle ambient light aura */}
      <div 
        className="pointer-events-none absolute top-1/4 left-1/2 h-[450px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-crimson/5 blur-[120px]" 
        aria-hidden="true" 
      />

      <div className="container relative mx-auto max-w-7xl w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Showcase Column: Tactical Bangladesh Dispatch Telemetry */}
          <div className="lg:col-span-6 space-y-6 hidden lg:flex flex-col justify-center">
            {/* Live Operational Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-teal/20 bg-teal/5 px-3 py-1 text-xs font-semibold text-teal w-fit">
              <span className="relative flex h-2 w-2">
                <span className="inline-flex h-2 w-2 rounded-full bg-teal animate-pulse" />
              </span>
              <span className="font-mono">VERIFIED LIFESAVER NETWORK • 64 DISTRICTS</span>
            </div>

            {/* Editorial Authority Headline */}
            <div className="space-y-3">
              <h1 className="font-heading text-3xl xl:text-4xl font-bold tracking-tight text-foreground leading-tight">
                Secure access for donors, patients, and dispatchers.
              </h1>
              <p className="text-base text-muted-foreground leading-relaxed">
                Log in to manage emergency requests, update your 56-day donation eligibility, and respond directly to critical operating theatre alerts across Bangladesh.
              </p>
            </div>

            {/* Tactical Telemetry Feature Grid */}
            <div className="grid grid-cols-2 gap-3.5 pt-2">
              <div className="rounded-xl border border-border/80 bg-card/60 p-3.5 space-y-1.5 shadow-xs">
                <div className="flex items-center gap-2 text-crimson font-bold text-xs">
                  <Clock className="h-4 w-4" />
                  <span>56-Day Cooldown</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-snug">
                  Automated serological rest intervals keep volunteer donors healthy and safe.
                </p>
              </div>

              <div className="rounded-xl border border-border/80 bg-card/60 p-3.5 space-y-1.5 shadow-xs">
                <div className="flex items-center gap-2 text-teal font-bold text-xs">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Privacy Masking</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-snug">
                  Phone numbers stay masked (<code className="font-mono text-[10px]">01XXX***XXX</code>) to prevent broker spam.
                </p>
              </div>

              <div className="rounded-xl border border-border/80 bg-card/60 p-3.5 space-y-1.5 shadow-xs">
                <div className="flex items-center gap-2 text-foreground font-bold text-xs">
                  <MapPin className="h-4 w-4 text-crimson" />
                  <span>64 District Grid</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-snug">
                  Instant localized triage matches donors within minutes of hospital notice.
                </p>
              </div>

              <div className="rounded-xl border border-border/80 bg-card/60 p-3.5 space-y-1.5 shadow-xs">
                <div className="flex items-center gap-2 text-ochre font-bold text-xs">
                  <Heart className="h-4 w-4 text-crimson" />
                  <span>100% Voluntary</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-snug">
                  Zero fees, zero middleman charges. Strictly non-commercial emergency coordination.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: High-Contrast Tactical Auth Capsule */}
          <div className="lg:col-span-6 w-full max-w-md mx-auto">
            <div className="rounded-2xl border border-border bg-card/95 backdrop-blur-md p-6 sm:p-8 shadow-sm space-y-6">
              
              {/* Header */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-crimson text-paper shadow-xs">
                      <Droplet className="h-4 w-4 fill-paper" />
                    </div>
                    <span className="font-heading font-bold text-base text-foreground">BloodOS</span>
                  </div>
                  <span className="rounded-md bg-muted px-2 py-0.5 font-mono text-[10px] font-semibold text-muted-foreground border border-border/70">
                    AUTH GATEWAY
                  </span>
                </div>
                
                <h2 className="font-heading text-2xl font-bold text-foreground pt-1">
                  Sign In to Your Account
                </h2>
                <p className="text-xs text-muted-foreground">
                  Enter your credentials or use 1-tap Google sign in to continue.
                </p>
              </div>

              {/* Form Component */}
              <SignInForm callbackUrl={destination} />

              {/* Mode Switch Affordance */}
              <div className="pt-2 border-t border-border/60 text-center space-y-3">
                <p className="text-xs text-muted-foreground">
                  Don&apos;t have a BloodOS account yet?{" "}
                  <Link
                    href={`/signup${redirectParam ? `?redirect=${encodeURIComponent(redirectParam)}` : ""}`}
                    className="font-semibold text-crimson hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-crimson rounded px-1"
                  >
                    Register as Donor / Coordinator
                  </Link>
                </p>

                <p className="text-[11px] text-muted-foreground/80">
                  By signing in, you agree to our{" "}
                  <Link href="/privacy" className="underline hover:text-foreground transition-colors">
                    Privacy Policy & Donor Code
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
