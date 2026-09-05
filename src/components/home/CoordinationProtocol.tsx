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
    color: "crimson",
    iconBg: "bg-crimson/10 text-crimson ring-1 ring-crimson/20",
    badgeStyle: "text-crimson bg-crimson/10 border-crimson/20",
    hoverBorder: "hover:border-crimson/40",
  },
  {
    icon: BellRing,
    step: "02",
    title: "Instant Donor Matching",
    desc: "Eligible volunteer donors in your target district receive push notifications. Compatibility matrix filters out incompatible donors automatically.",
    badge: "56-Day Verified",
    color: "teal",
    iconBg: "bg-teal/10 text-teal ring-1 ring-teal/20",
    badgeStyle: "text-teal bg-teal/10 border-teal/20",
    hoverBorder: "hover:border-teal/40",
  },
  {
    icon: ShieldCheck,
    step: "03",
    title: "Privacy-Masked Contact",
    desc: "When a donor accepts, direct coordination begins. Phone numbers (01XXX***XXX) are protected against scrapers and harassment until accepted.",
    badge: "Zero Spam",
    color: "ochre",
    iconBg: "bg-ochre/10 text-ochre ring-1 ring-ochre/20",
    badgeStyle: "text-ochre bg-ochre/10 border-ochre/20",
    hoverBorder: "hover:border-ochre/40",
  },
];

export function CoordinationProtocol() {
  return (
    <section className="border-b border-border/80 bg-background py-16 sm:py-20" id="protocol">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 w-full">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
            How BloodOS Protects & Accelerates Transfusions
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Eliminating broker delays, unverified requests, and donor harassment with 3 safeguards.
          </p>
        </div>

        {/* 3 Steps Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className={`group relative rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-6 hover:-translate-y-1 hover:shadow-lg transition-all duration-200 ${item.hoverBorder}`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110 ${item.iconBg}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="font-mono text-xs font-bold text-muted-foreground bg-muted px-2.5 py-1 rounded-md border border-border/70">
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
                  <span className={`inline-flex items-center gap-1 font-semibold rounded-full px-2.5 py-0.5 border ${item.badgeStyle}`}>
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
