"use client";

import * as React from "react";
import Link from "next/link";
import {
  Clock,
  ShieldCheck,
  MapPin,
  HeartHandshake,
  ArrowRight,
  HelpCircle,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { triggerTactileFeedback, HAPTIC_PATTERNS } from "@/lib/haptics";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "Who is eligible to donate blood through BloodOS in Bangladesh?",
    answer:
      "Any healthy individual aged 18–60 weighing at least 45 kg (for females) or 50 kg (for males), with normal hemoglobin levels (≥12.5 g/dL) and blood pressure. You must not have donated whole blood within the past 56 days or had major surgery, active infections, or recent tattoos.",
  },
  {
    question: "How does BloodOS protect volunteer donor phone numbers?",
    answer:
      "BloodOS strictly enforces full number masking (e.g. 01XXX***XXX) across public listings. Contact numbers are never crawled, indexed by search engines, or distributed to commercial blood brokers. Direct communication is only unlocked when an eligible donor actively confirms 'I Can Help' on a verified emergency request.",
  },
  {
    question: "Why is the 56-day cooldown interval strictly enforced?",
    answer:
      "Whole blood donation removes red blood cells and iron stores that take approximately 8 weeks (56 days) to regenerate safely. BloodOS enforces this serological cooldown automatically so volunteers never compromise their own health or risk donor anemia.",
  },
  {
    question: "Does BloodOS charge any fees for matching patients or blood requests?",
    answer:
      "Never. BloodOS is 100% free, voluntary, and non-commercial. Blood donation is a humanitarian duty. Buying or selling blood is illegal and strictly prohibited on this platform; accounts attempting monetary transactions are permanently banned.",
  },
  {
    question: "How are hospital emergency requests verified?",
    answer:
      "Every emergency request requires hospital name, district, attending contact, and required unit timestamp. Our volunteer dispatch coordinators monitor live submissions, while automated rate limits and algorithmic cross-checks prevent spam duplicates.",
  },
];

export default function AboutPage() {
  const [openFaqIndex, setOpenFaqIndex] = React.useState<number | null>(0);

  const toggleFaq = (index: number) => {
    triggerTactileFeedback(HAPTIC_PATTERNS.LIGHT);
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="flex flex-col min-h-[calc(100dvh-4rem)] bg-background text-foreground">
      {/* 1. Hero Dossier Header */}
      <section className="relative border-b border-border/80 bg-linear-to-b from-background via-muted/10 to-background py-16 sm:py-24 overflow-hidden">
        {/* Ambient aura */}
        <div
          className="pointer-events-none absolute top-0 left-1/2 h-[450px] w-[800px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-crimson/5 blur-[120px]"
          aria-hidden="true"
        />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 w-full relative">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal/20 bg-teal/5 px-3.5 py-1 text-xs font-semibold text-teal font-mono">
              <span className="h-2 w-2 rounded-full bg-teal animate-pulse motion-reduce:animate-none" />
              <span>BANGLADESH EMERGENCY TRANSFUSION INFRASTRUCTURE</span>
            </div>

            <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
              The decentralized lifesaver network for Bangladesh.
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              When a hemorrhaging mother or trauma patient needs blood in an operating theatre, finding a compatible donor in minutes is the difference between life and death. BloodOS coordinates direct, voluntary donations across all 64 districts with zero middleman fees and automated donor safety.
            </p>

            {/* High-Contrast Telemetry Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-border/70">
              <div className="space-y-0.5">
                <p className="font-mono text-2xl sm:text-3xl font-bold text-crimson">64</p>
                <p className="text-xs font-medium text-muted-foreground">Districts Covered</p>
              </div>
              <div className="space-y-0.5">
                <p className="font-mono text-2xl sm:text-3xl font-bold text-teal">56 Days</p>
                <p className="text-xs font-medium text-muted-foreground">Biological Rest Cycle</p>
              </div>
              <div className="space-y-0.5">
                <p className="font-mono text-2xl sm:text-3xl font-bold text-foreground">0৳</p>
                <p className="text-xs font-medium text-muted-foreground">100% Free & Voluntary</p>
              </div>
              <div className="space-y-0.5">
                <p className="font-mono text-2xl sm:text-3xl font-bold text-ochre">&lt;15m</p>
                <p className="text-xs font-medium text-muted-foreground">STAT Dispatch Target</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Four Operational Pillars */}
      <section className="border-b border-border/80 py-16 sm:py-24 bg-card/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 w-full space-y-12">
          <div className="max-w-2xl space-y-2">
            <h2 className="font-heading text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
              Built on four non-negotiable principles.
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Traditional blood coordination in Bangladesh is fractured across informal social media posts and aggressive middleman brokers. BloodOS replaces chaos with clinical reliability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1 */}
            <div className="rounded-2xl border border-border bg-background p-6 space-y-3.5 shadow-xs transition-colors hover:border-crimson/40">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-crimson/10 text-crimson">
                <Clock className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-lg font-bold text-foreground">
                Automated 56-Day Rest
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Our algorithm locks donor eligibility after whole blood donation, preventing premature draws and guarding volunteers against chronic anemia.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="rounded-2xl border border-border bg-background p-6 space-y-3.5 shadow-xs transition-colors hover:border-teal/40">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal/10 text-teal">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-lg font-bold text-foreground">
                Privacy Phone Masking
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Contact numbers are masked (<code className="font-mono text-xs">01XXX***XXX</code>) on public views to stop broker databases and nuisance calls.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="rounded-2xl border border-border bg-background p-6 space-y-3.5 shadow-xs transition-colors hover:border-ochre/40">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-ochre/10 text-ochre">
                <MapPin className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-lg font-bold text-foreground">
                64-District Local Grid
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Transfusion alerts target donors within the patient&apos;s specific district, slashing transit delays during code-red operating room emergencies.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="rounded-2xl border border-border bg-background p-6 space-y-3.5 shadow-xs transition-colors hover:border-primary/40">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-crimson text-paper">
                <HeartHandshake className="h-5 w-5 fill-paper" />
              </div>
              <h3 className="font-heading text-lg font-bold text-foreground">
                Zero Commercial Fees
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                BloodOS is 100% voluntary. We strictly ban any commercial exchange, middlemen commissions, or payment gateways for blood units.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The STAT Dispatch Loop */}
      <section className="border-b border-border/80 py-16 sm:py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 w-full space-y-12">
          <div className="max-w-2xl space-y-2">
            <h2 className="font-heading text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
              How emergency blood coordination works.
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              From hospital requisition to bedside transfusion in 4 systematic stages.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            <div className="space-y-3 rounded-2xl border border-border/80 bg-card/60 p-6">
              <span className="font-mono text-xs font-bold text-crimson uppercase tracking-wider">
                Stage 01 • Dispatch Requisition
              </span>
              <h3 className="font-heading text-base font-bold text-foreground">
                Post Urgent Requisition
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Patient relative or coordinator inputs blood group, hospital, required units, and urgency level (Urgent / Critical / STAT).
              </p>
            </div>

            <div className="space-y-3 rounded-2xl border border-border/80 bg-card/60 p-6">
              <span className="font-mono text-xs font-bold text-teal uppercase tracking-wider">
                Stage 02 • Algorithmic Triage
              </span>
              <h3 className="font-heading text-base font-bold text-foreground">
                Targeted Donor Alert
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                BloodOS matches ABO/Rh compatibility and filters for verified donors in the district who are past their 56-day cooldown.
              </p>
            </div>

            <div className="space-y-3 rounded-2xl border border-border/80 bg-card/60 p-6">
              <span className="font-mono text-xs font-bold text-ochre uppercase tracking-wider">
                Stage 03 • Direct Connection
              </span>
              <h3 className="font-heading text-base font-bold text-foreground">
                1-Tap Response & Contact
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Eligible donor taps &quot;I Can Help&quot;. Contact is unlocked directly between donor and hospital coordinator with zero brokers.
              </p>
            </div>

            <div className="space-y-3 rounded-2xl border border-border/80 bg-card/60 p-6">
              <span className="font-mono text-xs font-bold text-foreground uppercase tracking-wider">
                Stage 04 • Cooldown Lock
              </span>
              <h3 className="font-heading text-base font-bold text-foreground">
                Fulfilled & Safe Rest
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Request status marks fulfilled. Donor&apos;s 56-day cooldown timer starts immediately to protect biological recovery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Interactive FAQs */}
      <section className="border-b border-border/80 py-16 sm:py-24 bg-card/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-crimson font-mono">
                <HelpCircle className="h-4 w-4" />
                <span>FREQUENTLY ASKED QUESTIONS</span>
              </div>
              <h2 className="font-heading text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
                Clinical safety, privacy, and protocol answers.
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Have a specific question not addressed here? You can always reach out directly to our{" "}
                <Link href="/contact" className="font-semibold text-crimson hover:underline">
                  24/7 volunteer coordination desk
                </Link>.
              </p>
            </div>

            <div className="lg:col-span-7 space-y-3">
              {faqs.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div
                    key={faq.question}
                    className="rounded-2xl border border-border bg-background transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(index)}
                      className="flex w-full items-center justify-between p-5 sm:p-6 text-left font-heading text-sm sm:text-base font-bold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson rounded-2xl"
                      aria-expanded={isOpen}
                    >
                      <span className="pr-4">{faq.question}</span>
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-crimson" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-0 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/40 mt-1 animate-in fade-in duration-150">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Call to Action Banner */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 w-full">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 sm:p-12 lg:p-16 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-xl text-center md:text-left">
              <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
                Join 1,400+ verified donors saving lives across Bangladesh.
              </h2>
              <p className="text-sm text-muted-foreground">
                Register in less than 30 seconds. Protect your privacy and respond to real-time hospital emergencies in your district.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
              <Link href="/signup" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto min-h-[44px] bg-primary text-paper hover:bg-primary/90 font-semibold gap-2 shadow-xs transition-all active:scale-[0.98]">
                  <span>Register as Donor</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/requests" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto min-h-[44px] font-semibold border-border">
                  <span>Browse Live Requests</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
