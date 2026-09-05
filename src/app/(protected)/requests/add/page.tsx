import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, PlusCircle, ShieldAlert } from "lucide-react";
import { AddRequestForm } from "@/components/forms/AddRequestForm";

export const metadata: Metadata = {
  title: "Create Blood Request | BloodOS",
  description:
    "Broadcast an emergency blood donation request across Bangladesh with real-time donor matching.",
};

export default function AddRequestPage() {
  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-background">
      {/* Header Banner */}
      <div className="border-b border-border/80 bg-card/60 backdrop-blur-xs">
        <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            href="/requests"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors mb-4 group"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            <span>Back to Live Requests Radar</span>
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-crimson/10 text-crimson border border-crimson/20 font-mono text-[11px] font-bold uppercase tracking-wider">
                  <PlusCircle className="h-3 w-3" />
                  Emergency Dispatch
                </span>
                <span className="font-mono text-xs text-muted-foreground hidden sm:inline-block">
                  • 64 Districts Network
                </span>
              </div>
              <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
                Create Blood Request
              </h1>
              <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
                Post an emergency or scheduled blood request. Verified donors in your district matching serological compatibility will be notified instantly.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Form Content */}
      <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-8 lg:p-10 shadow-xs">
          <AddRequestForm />
        </div>
      </div>
    </div>
  );
}

