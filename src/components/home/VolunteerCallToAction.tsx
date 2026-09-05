import * as React from "react";
import Link from "next/link";
import { 
  Heart, 
  ArrowRight, 
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function VolunteerCallToAction() {
  return (
    <section className="bg-background py-16 sm:py-20">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border-2 border-crimson/20 bg-linear-to-br from-card via-card to-crimson/5 p-8 sm:p-12 lg:p-16 shadow-lg">
          {/* Subtle background glow */}
          <div 
            className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-crimson/10 blur-[90px]" 
            aria-hidden="true" 
          />

          <div className="relative z-10 max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-crimson/10 px-3.5 py-1 text-xs font-semibold text-crimson">
              <Heart className="h-3.5 w-3.5 fill-crimson" />
              <span>BECOME A REGISTERED DONOR</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-[1.12]">
              One donation can save up to <span className="text-crimson">3 lives</span>.
            </h2>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Join thousands of verified voluntary blood donors across Bangladesh. Receive instant alerts when a compatible patient in your district needs help.
            </p>

            {/* Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-foreground/90 font-medium">
                <CheckCircle2 className="h-4 w-4 text-teal shrink-0" />
                <span>Automatic 56-day cooldown alerts</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-foreground/90 font-medium">
                <CheckCircle2 className="h-4 w-4 text-teal shrink-0" />
                <span>100% privacy-protected phone number</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-foreground/90 font-medium">
                <CheckCircle2 className="h-4 w-4 text-teal shrink-0" />
                <span>Geo-targeted emergency notifications</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-foreground/90 font-medium">
                <CheckCircle2 className="h-4 w-4 text-teal shrink-0" />
                <span>Personal donation history dashboard</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4">
              <Link href="/signup">
                <Button size="lg" className="w-full sm:w-auto bg-crimson hover:bg-crimson/90 text-paper font-semibold gap-2 h-12 px-7">
                  <span>Register as a Donor</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-border hover:bg-muted font-medium h-12 px-6">
                  <span>Learn About Donor Safety</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
