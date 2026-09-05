import { Suspense } from "react";
import Link from "next/link";
import { Metadata } from "next";
import { SignUpForm } from "@/components/forms/SignUpForm";
import { redirect } from "next/navigation";
import { Droplet, ShieldCheck, Clock, MapPin, HeartHandshake, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Create Account | BloodOS Emergency Network",
  description: "Join Bangladesh's real-time emergency blood network as a verified donor or coordinator. Free, voluntary, and private.",
};

interface SignUpPageProps {
  searchParams: Promise<{ callbackUrl?: string; redirect?: string }>;
}

async function SignUpContent({ searchParams }: SignUpPageProps) {
  const params = await searchParams;
  const callbackUrl = params.callbackUrl;
  const redirectParam = params.redirect;

  if (callbackUrl && !redirectParam) {
    redirect(`/signup?redirect=${encodeURIComponent(callbackUrl)}`);
  } else if (!callbackUrl && !redirectParam) {
    redirect(`/signup?redirect=${encodeURIComponent("/profile")}`);
  }

  const destination = redirectParam || callbackUrl || "/profile";

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Subtle ambient light aura */}
      <div 
        className="pointer-events-none absolute top-1/4 left-1/2 h-[450px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal/5 blur-[120px]" 
        aria-hidden="true" 
      />

      <div className="container relative mx-auto max-w-6xl w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Showcase Column: Why Join BloodOS */}
          <div className="lg:col-span-6 space-y-6 hidden lg:flex flex-col justify-center">
            {/* Live Operational Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-crimson/20 bg-crimson/5 px-3 py-1 text-xs font-semibold text-crimson w-fit">
              <span className="relative flex h-2 w-2">
                <span className="inline-flex h-2 w-2 rounded-full bg-crimson animate-pulse" />
              </span>
              <span className="font-mono">JOIN 1,400+ READY DONORS • BANGLADESH</span>
            </div>

            {/* Editorial Authority Headline */}
            <div className="space-y-3">
              <h1 className="font-heading text-3xl xl:text-4xl font-bold tracking-tight text-foreground leading-tight">
                One account. <br />
                <span className="text-crimson">Direct impact</span> for every emergency.
              </h1>
              <p className="text-base text-muted-foreground leading-relaxed">
                Registering with BloodOS means hospital patients in urgent need can reach you when it matters most—with complete privacy masking and zero commercial brokerage.
              </p>
            </div>

            {/* Impact Highlights Grid */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 rounded-xl border border-border/80 bg-card/60 p-3.5 shadow-xs">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-crimson/10 text-crimson mt-0.5">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-foreground">1-Tap Emergency SOS Responses</p>
                  <p className="text-[11px] text-muted-foreground">Receive prioritized notifications when a patient matches your blood group in your district.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-border/80 bg-card/60 p-3.5 shadow-xs">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-teal/10 text-teal mt-0.5">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-foreground">Full Number Masking & Zero Spam</p>
                  <p className="text-[11px] text-muted-foreground">Your contact number is never indexed publicly or shared with commercial entities.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-border/80 bg-card/60 p-3.5 shadow-xs">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-ochre/10 text-ochre mt-0.5">
                  <HeartHandshake className="h-4 w-4" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-foreground">56-Day Biological Rest Tracker</p>
                  <p className="text-[11px] text-muted-foreground">Automatic eligibility countdowns ensure you only donate when medically ready.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: High-Contrast Registration Capsule */}
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
                    DONOR ONBOARDING
                  </span>
                </div>
                
                <h2 className="font-heading text-2xl font-bold text-foreground pt-1">
                  Create Your Account
                </h2>
                <p className="text-xs text-muted-foreground">
                  Join as a lifesaver or patient coordinator in less than 30 seconds.
                </p>
              </div>

              {/* Form Component */}
              <SignUpForm callbackUrl={destination} />

              {/* Mode Switch Affordance */}
              <div className="pt-2 border-t border-border/60 text-center space-y-3">
                <p className="text-xs text-muted-foreground">
                  Already registered with BloodOS?{" "}
                  <Link
                    href={`/signin${redirectParam ? `?redirect=${encodeURIComponent(redirectParam)}` : ""}`}
                    className="font-semibold text-crimson hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-crimson rounded px-1"
                  >
                    Sign In instead
                  </Link>
                </p>

                <p className="text-[11px] text-muted-foreground/80">
                  By registering, you agree to our{" "}
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

export default function SignUpPage(props: SignUpPageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
          <div className="space-y-2 text-center">
            <div className="h-8 w-8 rounded-full border-2 border-crimson border-t-transparent animate-spin mx-auto" />
            <p className="font-mono text-xs text-muted-foreground">Preparing BloodOS Registration Gateway...</p>
          </div>
        </div>
      }
    >
      <SignUpContent {...props} />
    </Suspense>
  );
}
