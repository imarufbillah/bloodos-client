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
    <div className="relative min-h-[calc(100dvh-4rem)] flex items-center justify-center py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
      {/* Ambient background glow */}
      <div 
        className="pointer-events-none absolute top-1/3 left-1/2 h-[380px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal/5 blur-[120px]" 
        aria-hidden="true" 
      />

      <div className="container relative mx-auto max-w-7xl w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* Left Column: Essential System Context */}
          <div className="lg:col-span-6 space-y-6 hidden lg:flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-crimson font-mono">
              <span className="h-2 w-2 rounded-full bg-crimson animate-pulse" />
              <span>JOIN 1,400+ READY DONORS • BANGLADESH</span>
            </div>

            <div className="space-y-3">
              <h1 className="font-heading text-3xl xl:text-4xl font-bold tracking-tight text-foreground leading-tight">
                One unified network. <br />
                <span className="text-crimson">Direct impact</span> for every emergency.
              </h1>
              <p className="text-base text-muted-foreground leading-relaxed max-w-lg">
                Registering with BloodOS means emergency patients in urgent need can reach you when it matters most—with complete privacy masking and zero middleman fees.
              </p>
            </div>

            {/* Distilled Telemetry Highlights */}
            <div className="space-y-3 pt-2 border-t border-border/60 max-w-lg">
              <div className="flex items-center gap-3 text-sm text-foreground/90">
                <CheckCircle2 className="h-4 w-4 text-crimson shrink-0" />
                <span><strong className="font-semibold text-foreground">1-Tap SOS Responses:</strong> Immediate alerts when patients match your group.</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-foreground/90">
                <ShieldCheck className="h-4 w-4 text-teal shrink-0" />
                <span><strong className="font-semibold text-foreground">Masked Contact Info:</strong> Never indexed publicly or sold to third parties.</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-foreground/90">
                <HeartHandshake className="h-4 w-4 text-ochre shrink-0" />
                <span><strong className="font-semibold text-foreground">100% Free & Voluntary:</strong> Zero coordination charges, ever.</span>
              </div>
            </div>
          </div>

          {/* Right Column: Distilled Registration Capsule */}
          <div className="lg:col-span-6 w-full max-w-md mx-auto">
            <div className="rounded-2xl border border-border bg-card/95 backdrop-blur-md p-6 sm:p-8 shadow-sm space-y-6">
              
              {/* Card Header */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-crimson text-paper shadow-xs">
                    <Droplet className="h-4 w-4 fill-paper" />
                  </div>
                  <span className="font-heading font-bold text-base text-foreground">BloodOS</span>
                </div>
                
                <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
                  Create Account
                </h2>
                <p className="text-xs text-muted-foreground">
                  Join as a donor or coordinator in less than 30 seconds
                </p>
              </div>

              {/* Form Component */}
              <SignUpForm callbackUrl={destination} />

              {/* Footer Links */}
              <div className="pt-2 border-t border-border/60 text-center space-y-2">
                <p className="text-xs text-muted-foreground">
                  Already registered?{" "}
                  <Link
                    href={`/signin${redirectParam ? `?redirect=${encodeURIComponent(redirectParam)}` : ""}`}
                    className="font-semibold text-crimson hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-crimson rounded"
                  >
                    Sign in instead
                  </Link>
                </p>

                <p className="text-[11px] text-muted-foreground/80">
                  By registering, you agree to our{" "}
                  <Link href="/privacy" className="underline hover:text-foreground transition-colors">
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

export default function SignUpPage(props: SignUpPageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100dvh-4rem)] flex items-center justify-center">
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
