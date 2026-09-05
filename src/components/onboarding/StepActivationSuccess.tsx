"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Droplet,
  ShieldCheck,
  ArrowRight,
  Activity,
  User,
} from "lucide-react";
import { triggerTactileFeedback, HAPTIC_PATTERNS } from "@/lib/haptics";

interface StepActivationSuccessProps {
  bloodGroup: string;
  district: string;
  isDonor: boolean;
  phone: string;
  userName?: string;
}

export function StepActivationSuccess({
  bloodGroup,
  district,
  isDonor,
  phone,
  userName = "Lifesaver Member",
}: StepActivationSuccessProps) {
  React.useEffect(() => {
    triggerTactileFeedback(HAPTIC_PATTERNS.SUCCESS);
  }, []);

  const maskedPhone = React.useMemo(() => {
    if (!phone || phone.length < 5) return "01XXX***XXX";
    const clean = phone.replace(/[^0-9]/g, "");
    if (clean.length < 11) return `${clean.slice(0, 5)}***`;
    return `${clean.slice(0, 5)}***${clean.slice(8, 11)}`;
  }, [phone]);

  return (
    <div className="space-y-6 text-center animate-in fade-in zoom-in-95 duration-200">
      {/* Success Icon */}
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal/10 text-teal border border-teal/30 shadow-2xs">
        <CheckCircle2 className="h-7 w-7" />
      </div>

      <div className="space-y-1.5 max-w-md mx-auto">
        <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Ready for Duty
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Your emergency profile is now active on Bangladesh&apos;s blood coordination network.
        </p>
      </div>

      {/* Activated Responder Card */}
      <div className="max-w-md mx-auto rounded-2xl border border-border bg-card p-5 text-left shadow-xs space-y-3.5">
        <div className="flex items-center justify-between pb-3 border-b border-border/70">
          <div className="flex items-center gap-2">
            <Droplet className="h-4 w-4 text-crimson fill-crimson" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-foreground">
              Responder Pass
            </span>
          </div>
          <Badge variant="outline" className="text-[10px] font-mono bg-teal/10 text-teal border-teal/30 px-2 py-0.5">
            VERIFIED READY
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-2.5 text-xs">
          <div className="p-2.5 rounded-xl bg-muted/30 border border-border/60">
            <span className="text-[10px] font-mono uppercase text-muted-foreground block mb-0.5">
              Blood Group
            </span>
            <span className="font-mono text-lg font-bold text-crimson">
              {bloodGroup || "Not Set"}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-muted/30 border border-border/60">
            <span className="text-[10px] font-mono uppercase text-muted-foreground block mb-0.5">
              District
            </span>
            <span className="font-semibold text-foreground truncate block">
              {district || "Bangladesh"}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1 text-[11px] font-mono text-muted-foreground border-t border-border/50">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-teal" />
            <span>{maskedPhone}</span>
          </span>
          <span className="text-teal font-semibold">
            {isDonor ? "Volunteer Donor" : "Coordinator"}
          </span>
        </div>
      </div>

      {/* Direct Handoff Actions */}
      <div className="max-w-md mx-auto space-y-2 pt-2">
        <Link href="/requests" className="block w-full">
          <Button
            size="lg"
            className="w-full h-11 rounded-xl bg-crimson hover:bg-crimson/90 text-paper font-semibold text-xs uppercase tracking-wider gap-2 shadow-xs"
          >
            <Activity className="h-4 w-4" />
            <span>Explore Urgent Requests</span>
            <ArrowRight className="h-4 w-4 ml-auto" />
          </Button>
        </Link>

        <Link href="/profile" className="block w-full">
          <Button
            variant="outline"
            size="lg"
            className="w-full h-11 rounded-xl border-border/80 text-foreground font-semibold text-xs uppercase tracking-wider gap-2"
          >
            <User className="h-4 w-4 text-muted-foreground" />
            <span>View Donor Profile</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}

