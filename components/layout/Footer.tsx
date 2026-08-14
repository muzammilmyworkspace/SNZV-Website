import Link from "next/link";
import Image from "next/image";
import { Shell } from "@/components/ui/Editorial";
import { footerNav, footerLegal } from "@/data/navigation";
import { company } from "@/data/company";
import { ContactLinks } from "./ContactLinks";
import { SocialLinks } from "./SocialLinks";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    // `id` is the hook FloatingCTA observes so it can retire once the footer
    // is on screen — otherwise it sits on top of the legal links.
    <footer
      id="site-footer"
      className="grain relative overflow-hidden border-t border-line bg-surface"
    >
      <div aria-hidden className="graticule pointer-events-none absolute inset-0 opacity-40" />
      <div
        aria-hidden
        className="bloom-moss pointer-events-none absolute -bottom-56 left-1/3 h-[32rem] w-[32rem] opacity-25"
      />

      <Shell className="relative">
        {/* Brand statement, set large */}
        <div className="grid gap-10 py-12 lg:grid-cols-[1.05fr_2fr] lg:gap-16 lg:py-14">
          <div>
            <Link href="/" aria-label="SnZ Ventures — home" className="group inline-flex items-center gap-3">
              <Image
                src="/brand/snz-mark.png"
                alt=""
                width={40}
                height={40}
                className="h-10 w-10 rounded-full transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:rotate-[8deg]"
              />
              <span className="font-display text-[1.25rem] tracking-[-0.02em] text-fg">
                SnZ Ventures
              </span>
            </Link>

            <p className="mt-7 max-w-sm font-display text-[1.45rem] leading-[1.2] tracking-[-0.018em] text-fg">
              Geography should not be a barrier to ambition.
            </p>

            {/* The phone number lives here now that the contact rail is down
                to email and WhatsApp — otherwise it left the footer entirely. */}
            <address className="mt-7 not-italic">
              <span className="label block text-accent">Office</span>
              <p className="mt-3 text-[0.9rem] leading-relaxed text-muted">
                {company.contact.streetAddress}
                <br />
                {company.contact.postalCode} {company.contact.city},{" "}
                {company.contact.country}
                <br />
                <a
                  href={`tel:${company.contact.phoneHref}`}
                  className="transition-colors hover:text-fg"
                >
                  {company.contact.phone}
                </a>
              </p>
            </address>

            <SocialLinks className="mt-7" />

            {/* Contact sits directly under the social rail: the two ways to
                reach a person, in the one place people look for them. */}
            <ContactLinks location="footer" variant="compact" className="mt-6" />
          </div>

          {/* Two columns from the smallest screen up. Stacked one-per-row,
              four link groups made the footer taller than the phone. */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4 lg:gap-9">
            {footerNav.map((group) => (
              <nav key={group.heading} aria-label={group.heading}>
                <h2 className="label text-accent">{group.heading}</h2>
                <ul className="mt-5 space-y-3">
                  {group.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="text-[0.87rem] text-muted transition-colors duration-300 hover:text-fg"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}

            <nav aria-label="Legal">
              <h2 className="label text-accent">Legal</h2>
              <ul className="mt-5 space-y-3">
                {footerLegal.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-[0.87rem] text-muted transition-colors duration-300 hover:text-fg"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        {/*
          The footer ends on one line.

          It previously carried a contact row, a legal row and a disclaimer
          paragraph stacked underneath each other. Contact moved up beside the
          social rail and legal became a column, so both are still one click
          away while the foot of the page is just the copyright.
        */}
        <div className="border-t border-line py-6">
          <p className="text-[0.76rem] text-faint">
            © {year} {company.name}
          </p>
        </div>
      </Shell>
    </footer>
  );
}
