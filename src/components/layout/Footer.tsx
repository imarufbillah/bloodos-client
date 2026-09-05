import Link from "next/link";
import { Droplet, ShieldCheck, MapPin, Mail, Phone } from "lucide-react";
import {
  FaFacebookF,
  FaTwitter,
  FaGithub,
} from "react-icons/fa";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border/80 bg-card/60 pb-16 md:pb-0">
      <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-8">
          {/* Brand & Purpose Col (2 cols on lg) */}
          <div className="space-y-4 lg:col-span-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 font-heading text-xl font-bold tracking-tight text-foreground transition-colors hover:text-crimson"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-crimson text-paper">
                <Droplet className="h-4 w-4 fill-paper" aria-hidden="true" />
              </div>
              <span>BloodOS</span>
            </Link>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-sm leading-relaxed">
              Bangladesh&apos;s real-time volunteer blood coordination network. Matching emergency hospital requirements with verified donors across 64 districts.
            </p>

            <div className="flex items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-teal/30 bg-teal/5 px-2.5 py-0.5 text-[11px] font-semibold text-teal">
                <ShieldCheck className="h-3 w-3" />
                56-Day Medical Cooldown Safeguard
              </span>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:border-crimson hover:text-crimson transition-colors"
              >
                <FaFacebookF className="h-3.5 w-3.5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:border-crimson hover:text-crimson transition-colors"
              >
                <FaTwitter className="h-3.5 w-3.5" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:border-crimson hover:text-crimson transition-colors"
              >
                <FaGithub className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* Quick Emergency Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Emergency Triage
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/requests/add" className="text-crimson font-bold hover:underline">
                  Post SOS Request
                </Link>
              </li>
              <li>
                <Link href="/requests" className="text-muted-foreground hover:text-foreground">
                  Browse Active Requests
                </Link>
              </li>
              <li>
                <Link href="/donors" className="text-muted-foreground hover:text-foreground">
                  Find Local Donors
                </Link>
              </li>
              <li>
                <Link href="/#compatibility" className="text-muted-foreground hover:text-foreground">
                  ABO/Rh Compatibility
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform & Resources */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Coordination
            </h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-foreground">
                  About the Platform
                </Link>
              </li>
              <li>
                <Link href="/about#how-it-works" className="hover:text-foreground">
                  3-Step Protocol
                </Link>
              </li>
              <li>
                <Link href="/about#faq" className="hover:text-foreground">
                  Eligibility & Safety FAQ
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-foreground">
                  Privacy & Masking Rules
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Direct Support
            </h3>
            <ul className="space-y-2.5 text-xs text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-crimson shrink-0" />
                <a href="mailto:emergency@bloodos.app" className="hover:text-foreground">
                  emergency@bloodos.app
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-crimson shrink-0" />
                <span className="font-mono text-foreground">01XXX***XXX</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-teal shrink-0" />
                <span>Dhaka, Bangladesh</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-border/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>&copy; {currentYear} BloodOS Bangladesh. Built for rapid emergency coordination.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="/contact" className="hover:text-foreground">
              Contact & Feedback
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
