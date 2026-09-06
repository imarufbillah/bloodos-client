"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  EyeOff,
  Clock,
  HeartHandshake,
  Database,
  Lock,
  UserX,
  FileCheck2,
  Mail,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SectionNavItem {
  id: string;
  title: string;
  badge: string;
}

const SECTIONS: SectionNavItem[] = [
  { id: "overview", title: "1. Governance & Scope", badge: "Scope" },
  { id: "data-collection", title: "2. Data We Collect", badge: "Collection" },
  { id: "data-utilization", title: "3. Clinical & Triage Use", badge: "Usage" },
  { id: "phone-masking", title: "4. Phone Masking Standard", badge: "Masking" },
  { id: "cooldown-safety", title: "5. 56-Day Cooldown & Safety", badge: "Health" },
  { id: "zero-brokerage", title: "6. Zero Brokerage Guarantee", badge: "Ethics" },
  { id: "user-rights", title: "7. User Rights & Erasure", badge: "Rights" },
  { id: "security-architecture", title: "8. Security Safeguards", badge: "Security" },
  { id: "dpo-contact", title: "9. Inquiries & DPO Contact", badge: "Contact" },
];

export default function PrivacyPage() {
  const [activeSection, setActiveSection] = useState<string>("overview");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0px -70% 0px",
      }
    );

    SECTIONS.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -90;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full min-h-[calc(100dvh-4rem)] flex flex-col bg-background text-foreground pb-24 sm:pb-16">
      {/* Header Banner */}
      <section className="border-b border-border bg-muted/20 py-12 sm:py-16">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl space-y-4">
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Privacy, Safety & Identity Protection
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              BloodOS operates as a non-profit emergency humanitarian network. We handle health and contact records with extreme clinical restraint, automated privacy controls, and zero commercial monetization.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-mono text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <FileCheck2 className="h-4 w-4 text-teal" /> Version 2.4 (2026 Edition)
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-primary" /> Effective Date: January 1, 2026
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-teal" /> DGHS & ICT Act Compliant
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Core Safeguards 4-Grid Highlights */}
      <section className="border-b border-border py-10 bg-background">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Safeguard 1 */}
            <div className="p-5 rounded-2xl border border-border bg-card shadow-xs flex flex-col justify-between">
              <div className="space-y-3">
                <div className="h-10 w-10 rounded-xl bg-teal/10 flex items-center justify-center text-teal">
                  <EyeOff className="h-5 w-5" />
                </div>
                <h3 className="font-heading font-semibold text-base text-foreground">
                  Algorithmic Phone Masking
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  All Bangladesh phone numbers are publicly redacted to <code className="font-mono text-teal bg-teal/5 px-1 py-0.5 rounded">01XXX***XXX</code> to stop scrapers and unsolicited harassment.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-border text-[11px] font-mono text-teal flex items-center gap-1">
                <span>Direct match disclosure only</span>
              </div>
            </div>

            {/* Safeguard 2 */}
            <div className="p-5 rounded-2xl border border-border bg-card shadow-xs flex flex-col justify-between">
              <div className="space-y-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Clock className="h-5 w-5" />
                </div>
                <h3 className="font-heading font-semibold text-base text-foreground">
                  56-Day Cooldown Ledger
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Post-donation biological lockout is calculated strictly by automated system rules to protect donor cardiovascular and erythropoietic recovery.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-border text-[11px] font-mono text-primary flex items-center gap-1">
                <span>WHO biological safety rule</span>
              </div>
            </div>

            {/* Safeguard 3 */}
            <div className="p-5 rounded-2xl border border-border bg-card shadow-xs flex flex-col justify-between">
              <div className="space-y-3">
                <div className="h-10 w-10 rounded-xl bg-ochre/10 flex items-center justify-center text-ochre">
                  <HeartHandshake className="h-5 w-5" />
                </div>
                <h3 className="font-heading font-semibold text-base text-foreground">
                  Zero Brokerage Guarantee
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  We never buy, sell, broker, or monetize blood or donor records. Commercial exchange of blood is strictly illegal and blocked on our platform.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-border text-[11px] font-mono text-ochre flex items-center gap-1">
                <span>100% Free Public Good</span>
              </div>
            </div>

            {/* Safeguard 4 */}
            <div className="p-5 rounded-2xl border border-border bg-card shadow-xs flex flex-col justify-between">
              <div className="space-y-3">
                <div className="h-10 w-10 rounded-xl bg-teal/10 flex items-center justify-center text-teal">
                  <UserX className="h-5 w-5" />
                </div>
                <h3 className="font-heading font-semibold text-base text-foreground">
                  Permanent Data Erasure
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Donors and recipients retain absolute sovereignty over their data with 1-click irreversible account erasure and clinical log de-identification.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-border text-[11px] font-mono text-teal flex items-center gap-1">
                <span>Unconditional Right to Delete</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content with Sticky TOC */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Desktop Table of Contents Sidebar */}
          <aside className="hidden lg:block lg:col-span-4 xl:col-span-3">
            <div className="sticky top-24 p-5 rounded-2xl border border-border bg-card shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-border font-heading font-semibold text-sm text-foreground">
                <FileText className="h-4 w-4 text-teal" />
                <span>Policy Navigation</span>
              </div>
              <nav className="flex flex-col space-y-1">
                {SECTIONS.map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => scrollTo(sec.id)}
                    className={`flex items-center justify-between text-left px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      activeSection === sec.id
                        ? "bg-teal/10 text-teal font-semibold border-l-2 border-teal"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    }`}
                  >
                    <span className="truncate mr-2">{sec.title}</span>
                    <span className="text-[10px] font-mono opacity-70">
                      {sec.badge}
                    </span>
                  </button>
                ))}
              </nav>

              <div className="pt-4 border-t border-border space-y-2">
                <p className="text-[11px] text-muted-foreground">
                  Questions regarding data safety?
                </p>
                <Link href="/contact" className="block">
                  <Button variant="outline" size="sm" className="w-full text-xs h-8">
                    <Mail className="h-3.5 w-3.5 mr-1.5 text-teal" />
                    Contact DPO
                  </Button>
                </Link>
              </div>
            </div>
          </aside>

          {/* Policy Text Column */}
          <main className="lg:col-span-8 xl:col-span-9 space-y-16">
            {/* Section 1: Overview */}
            <section id="overview" className="scroll-mt-28 space-y-4">
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
                1. Governance & Scope
              </h2>
              <div className="text-muted-foreground text-sm sm:text-base leading-relaxed space-y-3">
                <p>
                  BloodOS is an open humanitarian clinical coordination protocol purpose-built to accelerate emergency blood matching across Bangladesh. This Privacy Policy governs all interactions with the platform across web, mobile viewports, and automated emergency notification channels.
                </p>
                <p>
                  By accessing BloodOS or registering as a donor or requester, you acknowledge that your operational details (such as blood group, district, and emergency status) will be processed strictly in accordance with this document to facilitate life-saving blood transfers.
                </p>
              </div>
            </section>

            {/* Section 2: Data We Collect */}
            <section id="data-collection" className="scroll-mt-28 space-y-6">
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
                2. Information We Collect
              </h2>
              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="font-heading font-semibold text-foreground text-base flex items-center gap-2">
                    <Database className="h-4 w-4 text-teal" />
                    Donor Profile Records
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Collected upon voluntary registration to determine donation compatibility and geographic proximity:
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground pt-1">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-teal shrink-0" />
                      <span>Full Legal Name & Verified Email</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-teal shrink-0" />
                      <span>Blood Group & Rh Factor (A+, B+, O+, AB+, etc.)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-teal shrink-0" />
                      <span>Primary Phone Number (Bangladesh 11-digit)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-teal shrink-0" />
                      <span>District & Upazila Jurisdiction</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-teal shrink-0" />
                      <span>Last Donation Date (for 56-day cooldown)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-teal shrink-0" />
                      <span>Availability Flag (`isAvailable`)</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-3 pt-4 border-t border-border">
                  <h3 className="font-heading font-semibold text-foreground text-base flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-primary" />
                    Emergency Blood Request Records
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Submitted when an urgent transfusion requirement is logged by a patient, attendant, or hospital coordinator:
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground pt-1">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>Patient Name or Identifier</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>Hospital Name, District & Address</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>Units Required & Target Transfusion Date</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>Urgency Tier (STAT Emergency vs Standard)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>Hospital Attendant Contact Number</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>Clinical Reason for Transfusion</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 3: Clinical & Triage Use */}
            <section id="data-utilization" className="scroll-mt-28 space-y-4">
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
                3. How We Process Your Data
              </h2>
              <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
                <p>
                  BloodOS enforces strict data minimalism. Data collected is used exclusively for the following operational workflows:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-1">
                    <span className="font-mono text-xs text-foreground font-semibold">Triage Matching</span>
                    <p className="text-xs text-muted-foreground">Automated cross-checking of ABO/Rh compatibility and geographic proximity within 64 districts.</p>
                  </div>
                  <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-1">
                    <span className="font-mono text-xs text-foreground font-semibold">Emergency Broadcast</span>
                    <p className="text-xs text-muted-foreground">Delivering real-time alerts and notifications to eligible matched donors when STAT alerts trigger.</p>
                  </div>
                  <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-1">
                    <span className="font-mono text-xs text-foreground font-semibold">Abuse Prevention</span>
                    <p className="text-xs text-muted-foreground">Detecting duplicate requests, spam bots, and unauthorized commercial middlemen seeking blood products.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4: Phone Masking Standard */}
            <section id="phone-masking" className="scroll-mt-28 space-y-4">
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
                4. Automated Phone Masking Standard
              </h2>
              <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
                <p>
                  To eliminate unsolicited commercial messages, identity theft, and harassment of female and vulnerable donors, BloodOS implements cryptographic server-side phone redaction:
                </p>
                <div className="p-5 rounded-2xl border border-teal/20 bg-teal/5 text-foreground space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-teal font-semibold">Redaction Standard</span>
                    <span className="text-[11px] font-mono text-muted-foreground">Regex: 01XXX***XXX</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <span className="font-semibold text-foreground">Public / Unauthenticated View:</span>
                      <p className="font-mono text-primary font-bold text-sm">01712***890</p>
                      <p className="text-muted-foreground text-[11px]">Only first 5 digits (operator/prefix) and last 3 digits remain visible for audit reference.</p>
                    </div>
                    <div className="space-y-1">
                      <span className="font-semibold text-foreground">Unmasked Access Criteria:</span>
                      <p className="text-muted-foreground text-[11px]">Direct full contact is unveiled strictly after an authenticated donor formally commits via &ldquo;I Can Help&rdquo; or hospital coordinator verification.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 5: 56-Day Cooldown & Medical Integrity */}
            <section id="cooldown-safety" className="scroll-mt-28 space-y-4">
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
                5. 56-Day Cooldown & Clinical Integrity
              </h2>
              <div className="space-y-3 text-muted-foreground text-sm leading-relaxed">
                <p>
                  Under standard clinical guidelines (Directorate General of Health Services & WHO), a whole-blood donor must rest for at least <strong>56 days (8 weeks)</strong> between donations to allow complete red blood cell regeneration and hemoglobin recovery.
                </p>
                <p>
                  BloodOS maintains an automated biological ledger. When a donation is marked confirmed, the donor&apos;s profile is instantly flagged as ineligible until the 56-day cooldown reaches zero. This metric is computed deterministically and cannot be manually overridden without administrative clinical review.
                </p>
              </div>
            </section>

            {/* Section 6: Zero Brokerage Guarantee */}
            <section id="zero-brokerage" className="scroll-mt-28 space-y-4">
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
                6. Zero Brokerage & Non-Commercialization
              </h2>
              <div className="p-5 rounded-2xl border border-ochre/20 bg-ochre/5 space-y-3 text-sm">
                <p className="text-foreground font-medium">
                  Blood is a humanitarian gift, not a commodity.
                </p>
                <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                  BloodOS operates with an absolute zero-tolerance policy against commercial blood brokerage, extortion, or paid matching. We do not sell user data to pharmaceutical entities, insurance brokers, advertisers, or third-party marketing brokers. Any account found demanding financial compensation for blood will be permanently suspended and reported to law enforcement.
                </p>
              </div>
            </section>

            {/* Section 7: User Rights & Data Erasure */}
            <section id="user-rights" className="scroll-mt-28 space-y-4">
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
                7. Your Data Rights & Right to Erasure
              </h2>
              <div className="space-y-3 text-muted-foreground text-sm leading-relaxed">
                <p>
                  You hold complete legal sovereignty over your personal records stored within BloodOS:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl border border-border bg-card space-y-1">
                    <span className="text-xs font-mono text-foreground font-semibold">Right to Access & Rectify</span>
                    <p className="text-xs text-muted-foreground">You can update your phone, district, availability, and donation history at any time from your Profile.</p>
                  </div>
                  <div className="p-4 rounded-xl border border-border bg-card space-y-1">
                    <span className="text-xs font-mono text-foreground font-semibold">Right to Erasure (Delete)</span>
                    <p className="text-xs text-muted-foreground">You can request full account deletion. All contact information is wiped and historical logs are permanently anonymized.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 8: Security Safeguards */}
            <section id="security-architecture" className="scroll-mt-28 space-y-4">
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
                8. Technical & Clinical Security Safeguards
              </h2>
              <div className="space-y-3 text-muted-foreground text-sm leading-relaxed">
                <p>
                  Our production infrastructure deploys multiple defensive perimeters to secure your medical information:
                </p>
                <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Lock className="h-4 w-4 text-teal mt-0.5 shrink-0" />
                    <span><strong>End-to-End TLS 1.3 Encryption:</strong> All transit data between client browsers, Next.js servers, and MongoDB clusters is strictly encrypted.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Lock className="h-4 w-4 text-teal mt-0.5 shrink-0" />
                    <span><strong>Role-Based Access Control (RBAC):</strong> Administrative audit terminals require dual-factor authorization and maintain immutable tamper-evident logs.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Lock className="h-4 w-4 text-teal mt-0.5 shrink-0" />
                    <span><strong>No Plaintext Credential Storage:</strong> Passwords and session tokens utilize Argon2/Bcrypt cryptographic salting through Better Auth.</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 9: DPO Contact */}
            <section id="dpo-contact" className="scroll-mt-28 space-y-4">
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
                9. Data Protection Officer & Inquiries
              </h2>
              <div className="p-6 rounded-2xl border border-border bg-card space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  For formal data access requests, clinical audit inquiries, or reporting unauthorized contact disclosures, reach our Data Protection & Ethics Committee:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-muted/30 border border-border">
                    <span className="text-muted-foreground block text-[11px]">Electronic Inquiries</span>
                    <a href="mailto:privacy@bloodos.org" className="font-mono text-teal hover:underline font-medium text-sm">
                      privacy@bloodos.org
                    </a>
                  </div>
                  <div className="p-3.5 rounded-xl bg-muted/30 border border-border">
                    <span className="text-muted-foreground block text-[11px]">Direct Support Desk</span>
                    <Link href="/contact" className="font-mono text-foreground hover:underline font-medium text-sm flex items-center gap-1">
                      <span>bloodos.org/contact</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
