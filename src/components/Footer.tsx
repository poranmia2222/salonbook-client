import Link from "next/link"
import {
  Clock3,
  Mail,
  MapPin,
  Phone,
  Scissors,
} from "lucide-react"

const navigationLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Browse services" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#about", label: "About us" },
]

const socialLinks = [
  { href: "https://www.instagram.com/", label: "Instagram" },
  { href: "https://www.facebook.com/", label: "Facebook" },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-[1180px] px-5 py-14 sm:px-6 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.25fr_0.8fr_1fr_1fr] lg:gap-12">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2"
              aria-label="SalonBook home"
            >
              <Scissors className="h-5 w-5 text-primary" aria-hidden="true" />
              <span className="font-[var(--font-playfair)] text-xl font-semibold tracking-tight text-foreground">
                SalonBook
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-6 text-muted-foreground">
              A better salon day starts here. Discover services, find your
              stylist, and book a time that works for you.
            </p>
            <div className="mt-5 flex items-center gap-3">
              {socialLinks.map(({ href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-9 items-center justify-center rounded-full border border-border px-3 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Explore
            </h2>
            <ul className="mt-4 space-y-3">
              {navigationLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Get in touch
            </h2>
            <ul className="mt-4 space-y-4">
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <Phone
                  className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <a
                  href="tel:+12125550148"
                  className="transition-colors hover:text-primary"
                >
                  +1 (212) 555-0148
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <Mail
                  className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <a
                  href="mailto:hello@salonbook.com"
                  className="transition-colors hover:text-primary"
                >
                  hello@salonbook.com
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Visit us
            </h2>
            <div className="mt-4 space-y-4 text-sm text-muted-foreground">
              <a
                href="https://maps.google.com/?q=123+Beauty+Avenue+New+York+NY+10001"
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-3 transition-colors hover:text-primary"
              >
                <MapPin
                  className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <span>123 Beauty Avenue, New York, NY 10001</span>
              </a>
              <div className="flex items-start gap-3">
                <Clock3
                  className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <div className="space-y-1">
                  <p>Mon–Fri: 9:00 AM–7:00 PM</p>
                  <p>Sat–Sun: 10:00 AM–5:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© SalonBook. All rights reserved.</p>
          <p>Made for your best salon day.</p>
        </div>
      </div>
    </footer>
  )
}
