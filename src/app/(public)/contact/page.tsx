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
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      {/* Page Header */}
      <div className="mb-12 text-center">
        <h1 className="font-heading text-4xl font-semibold mb-4">Contact Us</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Have questions or need assistance? We&apos;re here to help. Reach out
          to us through the form below or use any of the contact methods
          provided.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Contact Form Section - Req 19.6 */}
        <div>
          <h2 className="font-heading text-2xl font-semibold mb-6">
            Send us a message
          </h2>
          <ContactForm />
        </div>

        {/* Contact Information Section - Req 19.6 */}
        <div className="space-y-8">
          <div>
            <h2 className="font-heading text-2xl font-semibold mb-6">
              Get in touch
            </h2>
            <p className="text-muted-foreground mb-8">
              You can also reach us directly through any of the following
              channels. Our team typically responds within 24-48 hours.
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
                <h3 className="font-semibold mb-1">Email</h3>
                <a
                  href="mailto:contact@bloodos.app"
                  className="text-muted-foreground hover:text-teal transition-colors"
                >
                  contact@bloodos.app
                </a>
              </div>
            </div>

            {/* Phone - Req 19.6 */}
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-teal/10 text-teal shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Phone</h3>
                <a
                  href="tel:+8801711111111"
                  className="text-muted-foreground hover:text-teal transition-colors"
                >
                  +880 1711 111 111
                </a>
                <p className="text-sm text-muted-foreground mt-1">
                  Available: 9 AM - 6 PM (GMT+6)
                </p>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-teal/10 text-teal shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Office</h3>
                <p className="text-muted-foreground">
                  Dhaka, Bangladesh
                  <br />
                  <span className="text-sm">
                    Serving all 64 districts nationwide
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Social Media - Req 19.6 */}
          <div className="pt-6 border-t">
            <h3 className="font-semibold mb-4">Follow us</h3>
            <div className="flex gap-4">
              <a
                href="https://facebook.com/bloodos"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted hover:bg-teal/10 hover:text-teal transition-colors"
                aria-label="Follow us on Facebook"
              >
                <FaFacebook className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com/bloodos"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted hover:bg-teal/10 hover:text-teal transition-colors"
                aria-label="Follow us on Twitter"
              >
                <FaTwitter className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com/company/bloodos"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted hover:bg-teal/10 hover:text-teal transition-colors"
                aria-label="Follow us on LinkedIn"
              >
                <FaLinkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Emergency Notice */}
          <div className="p-4 rounded-lg bg-crimson/10 border border-crimson/20">
            <p className="text-sm">
              <span className="font-semibold text-crimson">
                Emergency Blood Need?
              </span>
              <br />
              <span className="text-muted-foreground">
                For urgent blood requests, please post directly on the platform
                instead of using this contact form. Our system will immediately
                notify eligible donors in your area.
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
