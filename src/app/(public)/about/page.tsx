/**
 * About Page - Phase 8e
 * 
 * Public information page explaining BloodOS mission, how it works, team, and FAQ.
 * 
 * Requirements:
 * - Req 19.1: About page with platform information
 * - Req 19.4: Sections - Mission, How It Works, Team, FAQ
 * 
 * Design Direction:
 * - Long-form content page
 * - Fraunces section headers, Public Sans body text
 * - Generous reading measure (max-width for readability)
 * - Civic infrastructure aesthetic (clean, functional)
 * - Minimal use of crimson (only for key emphasis points)
 * - Hairline dividers between sections
 */

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
    <div className="flex flex-col">
      {/* ===================================================================
          Hero Section
       =================================================================== */}
      <section className="relative border-b border-border bg-linear-to-b from-background to-muted/20 px-4 py-16 sm:py-20">
        <div className="container mx-auto max-w-4xl">
          <div className="flex flex-col items-center gap-6 text-center">
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
          Req 19.4: Mission statement and platform purpose
       =================================================================== */}
      <section className="border-b border-border px-4 py-16 sm:py-20">
        <div className="container mx-auto max-w-4xl">
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
              Traditional blood donation coordination happens through ad-hoc
              social media posts, phone trees, and word-of-mouth networks. This
              approach is chaotic, unverified, and often fails when time matters
              most. Eligible donors might never see urgent requests, while
              ineligible volunteers waste precious time.
            </p>

            <p className="text-lg font-semibold text-foreground sm:text-xl">
              BloodOS replaces this chaos with a verified, server-tracked
              platform that matches urgent hospital blood requests with eligible
              nearby donors in real-time.
            </p>

            <p>
              We track donor eligibility automatically—enforcing the 90-day
              cooldown period set by the Bangladesh Red Crescent Society,
              verifying blood type compatibility, and ensuring only qualified
              donors are notified. Requesters get instant access to a network of
              pre-verified donors in their district, sorted by eligibility and
              availability.
            </p>
          </div>

          {/* Mission Pillars */}
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            <div className="flex flex-col gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-crimson/10">
                <Shield className="h-6 w-6 text-crimson" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground">
                Verified & Safe
              </h3>
              <p className="text-sm text-muted-foreground">
                Server-side eligibility checks enforce 90-day cooldown periods
                and blood compatibility rules. No guesswork, no risk.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal/10">
                <Zap className="h-6 w-6 text-teal" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground">
                Fast & Efficient
              </h3>
              <p className="text-sm text-muted-foreground">
                Real-time notifications to eligible donors in the same district.
                Critical requests get priority matching. No delays.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-ochre/10">
                <Users className="h-6 w-6 text-ochre" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground">
                Community-Driven
              </h3>
              <p className="text-sm text-muted-foreground">
                Built for hospitals, families, and donors. Transparent status
                tracking keeps everyone informed throughout the process.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          How It Works Section
          Req 19.4: Detailed explanation of the platform workflow
       =================================================================== */}
      <section className="border-b border-border bg-muted/20 px-4 py-16 sm:py-20">
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            How It Works
          </h2>

          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            BloodOS coordinates the entire donation workflow—from urgent request
            to fulfilled donation—in a verified, trackable system.
          </p>

          {/* Workflow Steps */}
          <div className="mt-12 space-y-12">
            {/* Step 1: Request Creation */}
            <div className="flex gap-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-crimson font-mono text-lg font-bold text-white">
                1
              </div>
              <div className="flex-1">
                <h3 className="font-heading text-xl font-semibold text-foreground">
                  Hospital or Family Posts a Request
                </h3>
                <p className="mt-2 text-base text-muted-foreground">
                  Authenticated users submit blood requests with patient details,
                  blood group needed, hospital location, units required, and
                  urgency level (critical, urgent, or moderate). The system
                  validates all fields and publishes the request immediately.
                </p>
                <div className="mt-4 rounded-lg border border-border bg-card p-4">
                  <p className="text-sm font-medium text-foreground">
                    Required Information:
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-teal" />
                      Patient name and blood group
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-teal" />
                      Hospital name, address, and district
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-teal" />
                      Units needed (1-10 bags) and deadline
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-teal" />
                      Contact phone number and urgency level
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Step 2: Automatic Matching */}
            <div className="flex gap-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-crimson font-mono text-lg font-bold text-white">
                2
              </div>
              <div className="flex-1">
                <h3 className="font-heading text-xl font-semibold text-foreground">
                  System Matches Eligible Donors
                </h3>
                <p className="mt-2 text-base text-muted-foreground">
                  The platform automatically identifies compatible donors in the
                  same district using our blood compatibility matrix. It checks
                  donor eligibility (age 18-60, weight ≥50kg, 90-day cooldown
                  since last donation) and sends real-time notifications to
                  qualified candidates only.
                </p>
                <div className="mt-4 rounded-lg border border-border bg-card p-4">
                  <p className="text-sm font-medium text-foreground">
                    Eligibility Requirements:
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-teal" />
                      Age between 18-60 years
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-teal" />
                      Weight at least 50kg
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-teal" />
                      At least 90 days since last donation
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-teal" />
                      Compatible blood type (verified server-side)
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Step 3: Donor Response */}
            <div className="flex gap-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-crimson font-mono text-lg font-bold text-white">
                3
              </div>
              <div className="flex-1">
                <h3 className="font-heading text-xl font-semibold text-foreground">
                  Donors Offer to Help
                </h3>
                <p className="mt-2 text-base text-muted-foreground">
                  Notified donors can browse the request details and click &quot;I Can
                  Help&quot; to offer their availability. The system tracks all
                  responses with timestamps and eligibility status. Donors can
                  retract their offer before it&apos;s accepted.
                </p>
              </div>
            </div>

            {/* Step 4: Coordination */}
            <div className="flex gap-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-crimson font-mono text-lg font-bold text-white">
                4
              </div>
              <div className="flex-1">
                <h3 className="font-heading text-xl font-semibold text-foreground">
                  Requester Coordinates Donation
                </h3>
                <p className="mt-2 text-base text-muted-foreground">
                  The requester reviews donor responses, selects the most suitable
                  candidate, and clicks &quot;Accept&quot; to reveal full contact
                  information (phone and email). They coordinate the donation
                  directly and mark the request as fulfilled once complete. All
                  actions are logged for transparency.
                </p>
              </div>
            </div>

            {/* Step 5: Tracking */}
            <div className="flex gap-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-crimson font-mono text-lg font-bold text-white">
                5
              </div>
              <div className="flex-1">
                <h3 className="font-heading text-xl font-semibold text-foreground">
                  Donation Tracked & Verified
                </h3>
                <p className="mt-2 text-base text-muted-foreground">
                  Donors can self-report completed donations with date, location,
                  and units given. Admin moderators verify these records, which
                  automatically update the donor&apos;s eligibility cooldown period.
                  Verified donation history builds trust and helps future matching.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          Team Section
          Req 19.4: Information about the team behind BloodOS
       =================================================================== */}
      <section className="border-b border-border px-4 py-16 sm:py-20">
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            The Team
          </h2>

          <div className="mt-8 space-y-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
            <p>
              BloodOS was built by a team of developers, healthcare
              professionals, and community organizers who have experienced
              firsthand the challenges of emergency blood coordination in
              Bangladesh.
            </p>

            <p>
              After witnessing critical delays and coordination failures in our
              own families and communities, we knew there had to be a better way.
              We studied existing social media-based coordination patterns,
              interviewed hospital staff and regular donors, and consulted with
              the Bangladesh Red Crescent Society to understand the medical and
              safety requirements.
            </p>

            <p>
              The result is BloodOS—a civic infrastructure project built with the
              same reliability standards as emergency services. We&apos;re a
              volunteer-driven team committed to maintaining this platform as a
              public service for as long as it&apos;s needed.
            </p>
          </div>

          <div className="mt-12 rounded-lg border border-border bg-muted/30 p-6 sm:p-8">
            <h3 className="font-heading text-xl font-semibold text-foreground">
              Our Commitment
            </h3>
            <ul className="mt-4 space-y-3 text-base text-muted-foreground">
              <li className="flex gap-3">
                <Heart className="mt-1 h-5 w-5 shrink-0 text-crimson" />
                <span>
                  <strong className="text-foreground">No Profit Motive:</strong>{" "}
                  BloodOS is and will always remain free for hospitals, families,
                  and donors. We don&apos;t sell data or run ads.
                </span>
              </li>
              <li className="flex gap-3">
                <Shield className="mt-1 h-5 w-5 shrink-0 text-teal" />
                <span>
                  <strong className="text-foreground">Privacy First:</strong> We
                  collect only what&apos;s necessary for matching. Contact information
                  is masked until explicitly revealed by the requester.
                </span>
              </li>
              <li className="flex gap-3">
                <Users className="mt-1 h-5 w-5 shrink-0 text-ochre" />
                <span>
                  <strong className="text-foreground">Community-Governed:</strong>{" "}
                  Major platform decisions are discussed with active donors and
                  regular users. This is infrastructure for the community, by the
                  community.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ===================================================================
          FAQ Section
          Req 19.4: Frequently Asked Questions
       =================================================================== */}
      <section className="border-b border-border bg-muted/20 px-4 py-16 sm:py-20">
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Frequently Asked Questions
          </h2>

          <div className="mt-12 space-y-8">
            {/* FAQ Item 1 */}
            <div>
              <h3 className="font-heading text-lg font-semibold text-foreground">
                Is BloodOS free to use?
              </h3>
              <p className="mt-2 text-base text-muted-foreground">
                Yes, completely free. There are no charges for posting requests,
                registering as a donor, or using any platform features. We
                don&apos;t sell your data or show ads.
              </p>
            </div>

            {/* FAQ Item 2 */}
            <div>
              <h3 className="font-heading text-lg font-semibold text-foreground">
                How do you verify donor eligibility?
              </h3>
              <p className="mt-2 text-base text-muted-foreground">
                We enforce the Bangladesh Red Crescent Society&apos;s eligibility
                guidelines: donors must be 18-60 years old, weigh at least 50kg,
                and wait 90 days between donations. Blood type compatibility is
                verified using medical standards before notifying donors.
              </p>
            </div>

            {/* FAQ Item 3 */}
            <div>
              <h3 className="font-heading text-lg font-semibold text-foreground">
                Why do I need to create an account?
              </h3>
              <p className="mt-2 text-base text-muted-foreground">
                Authentication ensures only verified users can post requests and
                offer donations. This prevents spam, abuse, and fake requests. You
                can browse public requests without an account, but posting or
                responding requires registration.
              </p>
            </div>

            {/* FAQ Item 4 */}
            <div>
              <h3 className="font-heading text-lg font-semibold text-foreground">
                How is my contact information protected?
              </h3>
              <p className="mt-2 text-base text-muted-foreground">
                Your phone number is masked (showing only partial digits) in all
                public listings. Full contact details are only revealed when a
                requester explicitly accepts your donor offer. All contact reveals
                are logged for safety and transparency.
              </p>
            </div>

            {/* FAQ Item 5 */}
            <div>
              <h3 className="font-heading text-lg font-semibold text-foreground">
                What happens after I offer to donate?
              </h3>
              <p className="mt-2 text-base text-muted-foreground">
                The requester will review your offer along with others. If they
                accept your offer, you&apos;ll receive a notification with their full
                contact information. You can then coordinate the donation directly
                with them. If they choose another donor, you&apos;ll be notified and
                your offer will be marked as declined.
              </p>
            </div>

            {/* FAQ Item 6 */}
            <div>
              <h3 className="font-heading text-lg font-semibold text-foreground">
                Can I donate before the 90-day cooldown period?
              </h3>
              <p className="mt-2 text-base text-muted-foreground">
                The 90-day cooldown is a medical safety guideline set by the
                Bangladesh Red Crescent Society. BloodOS enforces this server-side
                to protect donor health. You won&apos;t be notified of new requests
                until your cooldown period ends. However, you can browse requests
                and see how many days remain until you&apos;re eligible again.
              </p>
            </div>

            {/* FAQ Item 7 */}
            <div>
              <h3 className="font-heading text-lg font-semibold text-foreground">
                How do I report a problem or get help?
              </h3>
              <p className="mt-2 text-base text-muted-foreground">
                Visit our <Link href="/contact" className="text-teal hover:underline">Contact page</Link> to submit
                questions, report issues, or request support. For urgent
                platform-wide issues, you can also reach us via the emergency
                contact email listed in the footer.
              </p>
            </div>

            {/* FAQ Item 8 */}
            <div>
              <h3 className="font-heading text-lg font-semibold text-foreground">
                Does BloodOS replace blood banks?
              </h3>
              <p className="mt-2 text-base text-muted-foreground">
                No. BloodOS is a coordination platform for when blood banks are
                unavailable or don&apos;t have the required blood type in stock. We
                strongly encourage using official blood banks as the first option.
                BloodOS serves as a backup network for emergency situations where
                direct donor-to-patient coordination is necessary.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          Call-to-Action Section
       =================================================================== */}
      <section className="px-4 py-16 sm:py-20">
        <div className="container mx-auto max-w-4xl">
          <div className="flex flex-col items-center gap-6 rounded-lg border border-border bg-card p-8 text-center sm:p-12">
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
