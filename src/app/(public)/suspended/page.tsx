"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ShieldAlert,
  AlertCircle,
  Mail,
  Home,
  FileText,
  XCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  HelpCircle,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

function SuspendedContent() {
  const searchParams = useSearchParams();
  const banReason = searchParams.get("reason");

  const appealUrl = banReason
    ? `/contact?subject=Account%20Suspension%20Appeal&message=${encodeURIComponent(
        `I am writing to appeal the suspension of my BloodOS account.\n\nStated reason: "${banReason}"\n\nPlease review my case.`
      )}`
    : `/contact?subject=Account%20Suspension%20Appeal`;

  return (
    <div className="w-full min-h-[calc(100dvh-4rem)] flex flex-col justify-center items-center py-12 sm:py-16 px-4 sm:px-6 bg-background text-foreground pb-24 sm:pb-16">
      <div className="w-full max-w-3xl mx-auto space-y-8">
        {/* Header Alert Hero */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 sm:p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive mb-2 shadow-xs">
            <ShieldAlert className="h-10 w-10 sm:h-12 sm:w-12" />
          </div>
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-destructive/20 bg-destructive/5 text-destructive text-xs font-mono font-semibold uppercase tracking-wider">
              <span>Security & Integrity Protocol</span>
              <span>•</span>
              <span>Account Status: Suspended</span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Account Access Temporarily Restricted
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
              Administrative safeguards have temporarily frozen active privileges for this account to uphold clinical safety, anti-fraud compliance, or community standards.
            </p>
          </div>
        </div>

        {/* Reason Card */}
        <div className="p-6 rounded-2xl border border-destructive/20 bg-destructive/5 space-y-3">
          <div className="flex items-center gap-2 text-destructive font-heading font-semibold text-sm">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>Enforcement Notice & Clinical Trigger</span>
          </div>
          <div className="p-4 rounded-xl bg-card border border-border">
            <p className="font-mono text-xs sm:text-sm text-foreground leading-relaxed">
              {banReason ? (
                <span>&ldquo;{banReason}&rdquo;</span>
              ) : (
                <span className="text-muted-foreground">
                  Your account has been placed under administrative review due to automated safety triggers or potential terms of service discrepancies.
                </span>
              )}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] font-mono text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-destructive" /> Status: Enforced
            </span>
            <span>Reference: BLD-SUSP-{Math.abs(hashString(banReason || "DEFAULT")).toString(16).toUpperCase()}</span>
          </div>
        </div>

        {/* Restriction Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Suspended Capabilities */}
          <div className="p-5 rounded-xl border border-destructive/20 bg-card space-y-3">
            <div className="flex items-center gap-2 text-destructive font-heading font-semibold text-sm">
              <XCircle className="h-4 w-4" />
              <span>Restricted Privileges</span>
            </div>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-destructive font-bold">•</span>
                <span>Broadcasting new emergency SOS blood requests</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive font-bold">•</span>
                <span>Responding to emergency requests (&ldquo;I Can Help&rdquo;)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive font-bold">•</span>
                <span>Modifying donor availability or clinical readiness status</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive font-bold">•</span>
                <span>Accessing authenticated donor coordination workspaces</span>
              </li>
            </ul>
          </div>

          {/* Permitted Actions */}
          <div className="p-5 rounded-xl border border-teal/20 bg-card space-y-3">
            <div className="flex items-center gap-2 text-teal font-heading font-semibold text-sm">
              <CheckCircle2 className="h-4 w-4" />
              <span>Permitted Actions</span>
            </div>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-teal font-bold">•</span>
                <span>Browsing the public emergency blood directory</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal font-bold">•</span>
                <span>Viewing educational ABO/Rh compatibility charts</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal font-bold">•</span>
                <span>Submitting a formal appeal with supporting documentation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal font-bold">•</span>
                <span>Contacting the BloodOS Data Protection & Ethics Desk</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Appeal Resolution Terminal */}
        <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card shadow-xs space-y-6">
          <div className="space-y-2">
            <h2 className="font-heading text-lg font-bold text-foreground flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-teal" />
              <span>How to File an Appeal or Request Review</span>
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              If you believe this restriction occurred due to a technical error, false flag, or resolved dispute, you have the right to request a manual review from the Clinical Moderation Committee.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-muted/40 border border-border text-xs text-muted-foreground space-y-2">
            <div className="flex items-center gap-2 text-foreground font-semibold">
              <ShieldCheck className="h-4 w-4 text-teal" />
              <span>Appeal Review SLA Standards</span>
            </div>
            <p>
              Appeals are independently reviewed by authorized clinical officers within <strong>4 to 12 hours</strong> for active emergency coordinators, and within 24 hours for standard accounts.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <Link href={appealUrl} className="w-full sm:flex-1">
              <Button variant="default" className="w-full h-10 gap-2 text-xs font-semibold">
                <Mail className="h-4 w-4" />
                Submit Formal Appeal
              </Button>
            </Link>
            <Link href="/" className="w-full sm:flex-1">
              <Button variant="outline" className="w-full h-10 gap-2 text-xs">
                <Home className="h-4 w-4" />
                Return to Public Portal
              </Button>
            </Link>
          </div>
        </div>

        {/* Footer Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground font-mono">
          <Link href="/privacy" className="hover:text-foreground transition-colors flex items-center gap-1">
            <FileText className="h-3.5 w-3.5" />
            <span>Privacy & Data Rights</span>
          </Link>
          <span>•</span>
          <Link href="/about" className="hover:text-foreground transition-colors">
            <span>About BloodOS</span>
          </Link>
          <span>•</span>
          <Link href="/contact" className="hover:text-foreground transition-colors">
            <span>Direct Support Desk</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return hash;
}

export default function SuspendedPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-[calc(100dvh-4rem)] flex items-center justify-center p-8 text-muted-foreground font-mono text-xs">
          Loading account status...
        </div>
      }
    >
      <SuspendedContent />
    </Suspense>
  );
}
