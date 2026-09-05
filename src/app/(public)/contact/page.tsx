import { Metadata } from "next";
import { Mail, Phone, MapPin } from "lucide-react";
import { FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";

import { ContactForm } from "@/components/forms/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us - BloodOS",
  description:
    "Get in touch with BloodOS. We're here to help with any questions about blood donation coordination.",
};

export default function ContactPage() {
  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-background">
      <div className="container mx-auto px-4 py-12 max-w-7xl sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <h1 className="font-heading text-4xl font-semibold mb-4 text-foreground">Contact Us</h1>
          <p className="text-muted-foreground leading-relaxed">
            Have questions or need assistance? We&apos;re here to help. Reach out
            to us through the form below or use any of the contact methods
            provided.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start max-w-5xl mx-auto">
          {/* Contact Form Section - Req 19.6 */}
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xs">
            <h2 className="font-heading text-2xl font-semibold mb-6 text-foreground">
              Send us a message
            </h2>
            <ContactForm />
          </div>

          {/* Contact Information Section - Req 19.6 */}
          <div className="space-y-8 rounded-2xl border border-border bg-card/60 p-6 sm:p-8 shadow-xs">
            <div>
              <h2 className="font-heading text-2xl font-semibold mb-3 text-foreground">
                Get in touch
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                You can also reach us directly through any of the following
                channels. Our volunteer coordination desk responds 24/7 during emergency STAT events.
              </p>
            </div>

            {/* Contact Methods */}
            <div className="space-y-6">
              {/* Email - Req 19.6 */}
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-teal/10 text-teal shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Email</h3>
                  <a
                    href="mailto:contact@bloodos.app"
                    className="text-muted-foreground hover:text-teal transition-colors text-sm"
                  >
                    contact@bloodos.app
                  </a>
                  <p className="text-xs text-muted-foreground mt-1">
                    For general inquiries and support
                  </p>
                </div>
              </div>

              {/* Phone - Req 19.6 */}
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-crimson/10 text-crimson shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Phone</h3>
                  <a
                    href="tel:+8801700000000"
                    className="text-muted-foreground hover:text-crimson transition-colors font-mono text-sm"
                  >
                    +880 1700-000000
                  </a>
                  <p className="text-xs text-muted-foreground mt-1">
                    Emergency coordination desk (24/7)
                  </p>
                </div>
              </div>

              {/* Address - Req 19.6 */}
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-ochre/10 text-ochre shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Location</h3>
                  <p className="text-muted-foreground text-sm">
                    Dhaka, Bangladesh
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Serving all 64 districts nationwide
                  </p>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="pt-6 border-t border-border/80">
              <h3 className="font-semibold text-foreground mb-4 text-sm">Follow us</h3>
              <div className="flex gap-4">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                  aria-label="Facebook"
                >
                  <FaFacebook className="w-5 h-5" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                  aria-label="Twitter"
                >
                  <FaTwitter className="w-5 h-5" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
