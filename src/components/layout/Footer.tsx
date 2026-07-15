import Link from "next/link";
import { Droplet } from "lucide-react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaGithub,
} from "react-icons/fa";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";

const navigationLinks = [
  {
    title: "Platform",
    links: [
      { label: "Browse Requests", href: "/requests" },
      { label: "Find Donors", href: "/donors" },
      { label: "Post a Request", href: "/requests/add" },
      { label: "About Us", href: "/about" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "How It Works", href: "/about#how-it-works" },
      { label: "FAQ", href: "/about#faq" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy" },
    ],
  },
];

const socialLinks = [
  { label: "Facebook", href: "https://facebook.com/bloodos", icon: FaFacebookF },
  { label: "Twitter", href: "https://twitter.com/bloodos", icon: FaTwitter },
  { label: "Instagram", href: "https://instagram.com/bloodos", icon: FaInstagram },
  { label: "LinkedIn", href: "https://linkedin.com/company/bloodos", icon: FaLinkedinIn },
  { label: "GitHub", href: "https://github.com/bloodos", icon: FaGithub },
];

const contactInfo = [
  { label: "Email", value: "support@bloodos.app", href: "mailto:support@bloodos.app", icon: MdEmail },
  { label: "Phone", value: "+880 1XXX-XXXXXX", href: "tel:+8801xxxxxxxxx", icon: MdPhone },
  { label: "Address", value: "Dhaka, Bangladesh", href: null, icon: MdLocationOn },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border bg-linear-to-b from-background to-muted/20 pb-10 md:pb-0">
      <div className="container mx-auto max-w-screen-2xl px-4 py-10 sm:py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          <div className="space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-heading text-lg font-semibold tracking-tight transition-colors hover:text-crimson focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <Droplet className="h-5 w-5 text-crimson" aria-hidden="true" />
              <span>BloodOS</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A verified blood donor coordination platform connecting urgent
              hospital requests with eligible donors in Bangladesh.
            </p>
            <div className="flex items-center gap-2">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-crimson/10 hover:text-crimson focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                );
              })}
            </div>
          </div>

          {navigationLinks.map((section) => (
            <div key={section.title} className="space-y-3.5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground/60">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-crimson focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="space-y-3.5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground/60">
              Get in Touch
            </h3>
            <ul className="space-y-2.5">
              {contactInfo.map((contact) => {
                const Icon = contact.icon;
                const content = (
                  <>
                    <Icon
                      className="h-3.5 w-3.5 shrink-0 text-crimson"
                      aria-hidden="true"
                    />
                    <span className="text-sm text-muted-foreground">
                      {contact.value}
                    </span>
                  </>
                );

                return (
                  <li key={contact.label}>
                    {contact.href ? (
                      <a
                        href={contact.href}
                        className="inline-flex items-center gap-2 transition-colors hover:text-crimson focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        aria-label={contact.label}
                      >
                        {content}
                      </a>
                    ) : (
                      <div
                        className="inline-flex items-center gap-2"
                        aria-label={contact.label}
                      >
                        {content}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-5">
          <div className="flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
            <p className="text-xs text-muted-foreground">
              &copy; {currentYear} BloodOS. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground sm:gap-5">
              <Link
                href="/privacy"
                className="transition-colors hover:text-crimson focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Privacy Policy
              </Link>
              <Link
                href="/about#terms"
                className="transition-colors hover:text-crimson focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Terms of Service
              </Link>
              <Link
                href="/contact"
                className="transition-colors hover:text-crimson focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
