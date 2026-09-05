"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Droplet,
  Heart,
  Shield,
  Users,
  Zap,
  CheckCircle2,
  ArrowRight,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * About Page Component
 * Static content page with mission, how it works, team, and FAQ sections
 */
export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-[calc(100dvh-4rem)]">
      {/* ===================================================================
          Hero Section
       =================================================================== */}
      <section className="relative border-b border-border bg-linear-to-b from-background to-muted/20 px-4 py-16 sm:py-20">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col items-center gap-6 text-center max-w-3xl mx-auto">
            <motion.div
              className="flex h-20 w-20 items-center justify-center rounded-full bg-crimson"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Droplet className="h-10 w-10 text-white" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
                About BloodOS
              </h1>
              <p className="mt-4 text-lg text-muted-foreground sm:text-xl">
                A verified platform connecting urgent blood needs with eligible
                donors across Bangladesh
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          Mission Section
       =================================================================== */}
      <section className="border-b border-border px-4 py-16 sm:py-20">
        <div className="container mx-auto max-w-7xl">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Our Mission
            </h2>

            <div className="mt-8 space-y-6 text-base leading-relaxed text-foreground sm:text-lg">
              <p>
                Every 2 seconds, someone in Bangladesh needs blood. Yet finding a
                compatible donor in time remains one of the most challenging
                aspects of emergency medical care. BloodOS was built to solve this
                critical gap.
              </p>
              <p>
                We are a non-profit, community-driven platform that connects
                verified blood donors with patients and families in urgent need.
                Our mission is simple: eliminate barriers to blood donation, ensure
                donor safety through medical cooldown periods, and save lives
                across all 64 districts of Bangladesh.
              </p>
              <p>
                By combining real-time matching, automated eligibility tracking,
                and a commitment to privacy, BloodOS empowers communities to help
                each other in times of medical crisis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          How It Works Section
       =================================================================== */}
      <section
        id="how-it-works"
        className="border-b border-border bg-muted/20 px-4 py-16 sm:py-20 scroll-mt-20"
      >
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              How BloodOS Works
            </h2>
            <p className="mt-4 text-base text-muted-foreground sm:text-lg">
              A simple, secure, and transparent process for both donors and recipients
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Step 1 */}
            <motion.div
              className="rounded-lg border border-border bg-card p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-crimson/10 text-crimson mb-4">
                <span className="font-mono text-xl font-bold">1</span>
              </div>
              <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                Post an Emergency Request
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Families or hospitals create a verified request with patient details,
                blood group needed, units required, hospital location, and urgency level.
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              className="rounded-lg border border-border bg-card p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal/10 text-teal mb-4">
                <span className="font-mono text-xl font-bold">2</span>
              </div>
              <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                Match with Eligible Donors
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Our system instantly notifies compatible, verified donors in the same
                district who are currently eligible to donate (56-day cooldown verified).
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              className="rounded-lg border border-border bg-card p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-ochre/10 text-ochre mb-4">
                <span className="font-mono text-xl font-bold">3</span>
              </div>
              <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                Direct Coordination & Impact
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Donors respond directly through the platform. Contact information is
                shared securely to coordinate the donation at the specified hospital.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          Core Values Section
       =================================================================== */}
      <section className="border-b border-border px-4 py-16 sm:py-20">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Our Core Principles
            </h2>
            <p className="mt-4 text-base text-muted-foreground sm:text-lg">
              The values that guide every decision we make
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Value 1 */}
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-crimson/10 text-crimson mb-4">
                <Heart className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                100% Free & Voluntary
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                BloodOS is and will always be completely free. We strictly prohibit
                any buying, selling, or commercialization of blood donations.
              </p>
            </div>

            {/* Value 2 */}
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal/10 text-teal mb-4">
                <Shield className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                Donor Health First
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                We strictly enforce the medically recommended 56-day cooldown period
                between donations to protect donor health and safety.
              </p>
            </div>

            {/* Value 3 */}
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-ochre/10 text-ochre mb-4">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                Speed & Transparency
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                In medical emergencies, every minute counts. We prioritize fast,
                transparent matching with real-time status updates.
              </p>
            </div>

            {/* Value 4 */}
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                Community-Driven
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                BloodOS is powered by a community of selfless volunteer donors who
                stand ready to help their neighbors in times of need.
              </p>
            </div>

            {/* Value 5 */}
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal/10 text-teal mb-4">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                Privacy Protection
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Donor phone numbers are masked by default and only revealed during
                active response coordination to prevent unsolicited calls.
              </p>
            </div>

            {/* Value 6 */}
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-crimson/10 text-crimson mb-4">
                <Droplet className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                Nationwide Reach
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Covering all 64 districts of Bangladesh to ensure no patient is left
                without support, regardless of their location.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          FAQ Section
       =================================================================== */}
      <section className="border-b border-border px-4 py-16 sm:py-20">
        <div className="container mx-auto max-w-7xl">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Frequently Asked Questions
              </h2>
              <p className="mt-4 text-base text-muted-foreground sm:text-lg">
                Common questions about donating blood and using BloodOS
              </p>
            </div>

            <div className="space-y-6">
              {/* FAQ 1 */}
              <div className="rounded-lg border border-border bg-card p-6">
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                  Who can donate blood on BloodOS?
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Anyone aged 18-60, weighing at least 45 kg (for females) or 50 kg
                  (for males), in good health, and with no recent history of major
                  illness or surgery. Donors must have completed at least 56 days
                  since their last whole blood donation.
                </p>
              </div>

              {/* FAQ 2 */}
              <div className="rounded-lg border border-border bg-card p-6">
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                  Why is there a 56-day cooldown period?
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  The human body takes approximately 4-8 weeks to fully replenish red
                  blood cells and iron levels after a whole blood donation. The 56-day
                  cooldown is a global medical standard to ensure donor safety.
                </p>
              </div>

              {/* FAQ 3 */}
              <div className="rounded-lg border border-border bg-card p-6">
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                  Is BloodOS completely free to use?
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Yes, 100% free. BloodOS charges no fees to patients, donors, or
                  hospitals. Buying or selling blood is strictly illegal in Bangladesh
                  and prohibited on our platform.
                </p>
              </div>

              {/* FAQ 4 */}
              <div className="rounded-lg border border-border bg-card p-6">
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                  How is my phone number protected?
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Your phone number is masked (e.g., 01XXX***XXX) in the public donor
                  directory. It is only revealed when you explicitly respond to an
                  emergency request, ensuring you are not spammed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          CTA Section
       =================================================================== */}
      <section className="px-4 py-16 sm:py-20">
        <div className="container mx-auto max-w-7xl">
          <div className="max-w-4xl mx-auto flex flex-col items-center gap-6 rounded-lg border border-border bg-card p-8 text-center sm:p-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-crimson">
              <Heart className="h-8 w-8 text-white" />
            </div>

            <div className="space-y-3">
              <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Ready to Save Lives?
              </h2>
              <p className="text-base text-muted-foreground sm:text-lg">
                Join our network of verified donors and help coordinate urgent
                blood needs in your community.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/requests">
                <Button size="lg" className="gap-2">
                  Browse Requests
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="gap-2">
                  <Mail className="h-5 w-5" />
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
