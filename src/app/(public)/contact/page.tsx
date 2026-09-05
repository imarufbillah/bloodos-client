import { Metadata } from "next";
import Link from "next/link";
import { Mail, Phone, MapPin, AlertCircle, Clock, ShieldCheck, ArrowRight, MessageSquare, Heart } from "lucide-react";
import { FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";
import { ContactForm } from "@/components/forms/ContactForm";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Contact & Emergency Helpdesk | BloodOS Bangladesh",
  description:
    "Direct contact for emergency blood coordination support, verification assistance, and technical help across Bangladesh.",
};

export default function ContactPage() {
  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-background text-foreground flex flex-col justify-start py-10 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 w-full space-y-10">
        
        {/* Page Header */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal/20 bg-teal/5 px-3 py-1 text-xs font-semibold text-teal font-mono">
            <span className="h-2 w-2 rounded-full bg-teal animate-pulse motion-reduce:animate-none" />
            <span>24/7 COORDINATION & SUPPORT TERMINAL</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight">
            Emergency Support & Coordination Desk
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Whether you are coordinating an urgent operating theatre emergency, resolving a donor verification query, or reporting a safety violation, our team is standing by across Bangladesh.
          </p>
        </div>

        {/* 1. Critical STAT Emergency Alert Banner */}
        <div className="relative overflow-hidden rounded-2xl border border-destructive/30 bg-destructive/5 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="flex items-start gap-3.5 max-w-2xl">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-destructive text-paper shadow-xs mt-0.5">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <p className="font-heading font-bold text-base text-foreground">
                Is this an active code-red hospital emergency?
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Do not wait for a web inquiry form response during critical acute hemorrhage. Use our live emergency dispatch network or call the emergency hotline directly.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto shrink-0">
            <a href="tel:+8801700000000" className="w-full sm:w-auto">
              <Button size="default" className="w-full sm:w-auto bg-destructive text-destructive-foreground hover:bg-destructive/90 font-semibold gap-2 shadow-xs touch-manipulation min-h-[44px]">
                <Phone className="h-4 w-4" />
                <span className="font-mono">+880 1700-000000</span>
              </Button>
            </a>
            <Link href="/requests/add" className="w-full sm:w-auto">
              <Button variant="outline" size="default" className="w-full sm:w-auto border-border font-semibold gap-2 touch-manipulation min-h-[44px]">
                <span>Post Live SOS</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* 2. Main Desk Terminal: Form + Channel Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Structured Dispatch Message Form */}
          <div className="lg:col-span-7 rounded-2xl border border-border bg-card/90 backdrop-blur-md p-6 sm:p-8 shadow-xs space-y-6">
            <div className="space-y-1.5 border-b border-border/70 pb-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-crimson" />
                <h2 className="font-heading text-xl font-bold text-foreground">
                  Send a Structured Message
                </h2>
              </div>
              <p className="text-xs text-muted-foreground">
                Our support team logs every inquiry and responds within our stated SLAs.
              </p>
            </div>

            <ContactForm />
          </div>

          {/* Right Column: Operational Helpdesk Matrix */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Direct Channel Cards */}
            <div className="rounded-2xl border border-border bg-card/60 p-6 space-y-5 shadow-xs">
              <h3 className="font-heading text-lg font-bold text-foreground">
                Direct Communication Channels
              </h3>

              <div className="space-y-4">
                {/* Emergency Desk */}
                <div className="flex items-start gap-3.5 p-3 rounded-xl bg-background border border-border/70">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-crimson/10 text-crimson mt-0.5">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-foreground">24/7 STAT Emergency Desk</p>
                      <span className="rounded bg-teal/10 px-1.5 py-0.5 font-mono text-[9px] font-bold text-teal">LIVE</span>
                    </div>
                    <a href="tel:+8801700000000" className="font-mono text-xs font-semibold text-crimson hover:underline">
                      +880 1700-000000
                    </a>
                    <p className="text-[11px] text-muted-foreground">For active hospital blood coordination only</p>
                  </div>
                </div>

                {/* Email Support */}
                <div className="flex items-start gap-3.5 p-3 rounded-xl bg-background border border-border/70">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal/10 text-teal mt-0.5">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-foreground">General & Verification Support</p>
                    <a href="mailto:contact@bloodos.app" className="font-mono text-xs text-foreground/90 hover:text-teal transition-colors">
                      contact@bloodos-app.org
                    </a>
                    <p className="text-[11px] text-muted-foreground">Appeals, profile updates, and general inquiries</p>
                  </div>
                </div>

                {/* Headquarters */}
                <div className="flex items-start gap-3.5 p-3 rounded-xl bg-background border border-border/70">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ochre/10 text-ochre mt-0.5">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-foreground">Central Coordination Hub</p>
                    <p className="text-xs text-foreground/80">Dhaka, Bangladesh</p>
                    <p className="text-[11px] text-muted-foreground">Serving all 64 districts nationwide</p>
                  </div>
                </div>
              </div>
            </div>

            {/* SLA Commitments */}
            <div className="rounded-2xl border border-border/70 bg-muted/20 p-5 space-y-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-2 font-bold text-foreground">
                <Clock className="h-4 w-4 text-crimson" />
                <span>Response Time SLA Standards</span>
              </div>
              <ul className="space-y-1.5 pl-5 list-disc leading-snug">
                <li><strong className="text-foreground">STAT Code-Red Alerts:</strong> Immediate 24/7 hotline response.</li>
                <li><strong className="text-foreground">Account & Verification Appeals:</strong> Reviewed within 12–24 hours.</li>
                <li><strong className="text-foreground">General & Technical Inquiries:</strong> 1 business day.</li>
              </ul>
            </div>

            {/* Social Connect */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-card/40 text-xs">
              <span className="font-semibold text-foreground">Connect with BloodOS</span>
              <div className="flex items-center gap-2">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-crimson hover:bg-crimson/10 transition-colors"
                  aria-label="BloodOS on Facebook"
                >
                  <FaFacebook className="h-4 w-4" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-crimson hover:bg-crimson/10 transition-colors"
                  aria-label="BloodOS on Twitter"
                >
                  <FaTwitter className="h-4 w-4" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-crimson hover:bg-crimson/10 transition-colors"
                  aria-label="BloodOS on LinkedIn"
                >
                  <FaLinkedin className="h-4 w-4" />
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
