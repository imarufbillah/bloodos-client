import * as React from "react";
import Link from "next/link";
import { 
  FileCheck, 
  BellRing, 
  ShieldCheck, 
  ArrowRight,
  Droplet
} from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    icon: FileCheck,
    step: "01",
    title: "Post Emergency Need",
    desc: "Specify patient blood group, required bags, hospital location, and clinical urgency. Request is immediately broadcast to matching local donors.",
    badge: "10-Sec Triage",
  },
  {
    icon: BellRing,
    step: "02",
    title: "Instant Donor Matching",
    desc: "Eligible volunteer donors in your target district receive push notifications. Compatibility matrix filters out incompatible donors automatically.",
    badge: "56-Day Verified",
  },
  {
    icon: ShieldCheck,
    step: "03",
    title: "Privacy-Masked Contact",
    desc: "When a donor accepts, direct coordination begins. Phone numbers (01XXX***XXX) are protected against scrapers and harassment until accepted.",
    badge: "Zero Spam",
  },
];

export function CoordinationProtocol() {
  return (
    <section className="border-b border-border/80 bg-background py-16 sm:py-20" id="protocol">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-crimson/10 px-3 py-1 text-xs font-semibold text-crimson">
            <Droplet className="h-3.5 w-3.5" />
            <span>DIRECT COORDINATION PROTOCOL</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
            How BloodOS Protects & Accelerates Transfusions
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Eliminating middleman delays, unverified social media requests, and donor harassment through strict architectural safeguards.
          </p>
        </div>

        {/* 3 Steps Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="group relative rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-6 hover:border-crimson/40 hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-crimson/10 text-crimson transition-transform duration-200 group-hover:scale-110">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="font-mono text-xs font-bold text-muted-foreground bg-muted px-2.5 py-1 rounded-md">
                      STEP {item.step}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-foreground">{item.title}</h3>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-border/70 flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1 font-semibold text-teal">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    {item.badge}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Fast Action Callout */}
        <div className="mt-12 rounded-2xl border border-border bg-muted/40 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 transition-all duration-200 hover:border-border">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-base font-bold text-foreground">Need urgent blood at a hospital right now?</h4>
            <p className="text-xs sm:text-sm text-muted-foreground">Post your requirement in under a minute without account delays.</p>
          </div>
          <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
            <Link href="/requests/add" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-crimson hover:bg-crimson/90 text-paper font-semibold gap-2 h-11 px-6 transition-all duration-150 active:scale-[0.98]">
                <span>Create SOS Request</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
