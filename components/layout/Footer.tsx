import Link from "next/link";
import Image from "next/image";
import { footerNav, footerLegal } from "@/data/navigation";
import { company } from "@/data/company";
import { SocialLinks } from "./SocialLinks";
import { FooterPlane } from "./FooterPlane";

/**
 * FOOTER — the arrivals board.
 *
 * Columns are set like a departure board: a mono header row, then the
 * entries. Every fact comes from data/company.ts and data/navigation.ts; the
 * legal row stays because a privacy link has to be reachable for EU visitors.
 *
 * `id="site-footer"` is the hook the WhatsApp button watches so it can retire
 * once the footer — which carries WhatsApp in full — is on screen.
 */
export function Footer() {
  const year = new Date().getFullYear();
  const wa = `https://wa.me/${company.contact.whatsapp}`;

  return (
    <footer id="site-footer" className="bp relative overflow-hidden border-t border-[var(--bp-line)]">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div className="grid gap-12 py-16 lg:grid-cols-[1.2fr_2fr] lg:py-20">
          <div>
            <Link href="/" aria-label="SnZ Ventures, home" className="inline-flex items-center gap-3">
              <Image src="/brand/snz-mark.png" alt="" width={40} height={40} className="h-10 w-10 rounded-full" />
              <span className="font-[family-name:var(--font-grotesk)] text-[1.25rem] font-semibold tracking-[-0.02em]">
                SnZ Ventures
              </span>
            </Link>
            <p className="bp-display mt-8 max-w-sm text-[1.9rem] leading-[1.1]">
              Geography should not be a barrier to <span className="bp-mark">ambition.</span>
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/contact#journey" className="bp-btn bp-btn-primary bp-btn-sm">
                Book a Consultation
              </Link>
              <a href={company.portalUrl} target="_blank" rel="noopener noreferrer" className="bp-btn bp-btn-ghost bp-btn-sm">
                Student portal
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3">
            {footerNav.map((group) => (
              <nav key={group.heading} aria-label={group.heading}>
                <h2 className="bp-mono border-b border-[var(--bp-line)] pb-3 text-[var(--color-aurora)]">
                  {group.heading}
                </h2>
                <ul className="mt-4 space-y-3">
                  {group.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-[0.95rem] text-[var(--bp-muted)] transition-colors hover:text-[var(--bp-strong)]">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}

            <div className="col-span-2 md:col-span-1">
              <h2 className="bp-mono border-b border-[var(--bp-line)] pb-3 text-[var(--color-aurora)]">Contact</h2>
              <ul className="mt-4 space-y-3 text-[0.95rem]">
                <li>
                  <a href={wa} target="_blank" rel="noopener noreferrer" className="text-[var(--bp-muted)] hover:text-[var(--bp-strong)]">
                    WhatsApp · {company.contact.whatsappDisplay}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${company.contact.email}`} className="break-all text-[var(--bp-muted)] hover:text-[var(--bp-strong)]">
                    {company.contact.email}
                  </a>
                </li>
              </ul>
              <address className="mt-4 text-[0.95rem] not-italic leading-relaxed text-[var(--bp-muted)]">
                {company.contact.streetAddress}
                <br />
                {company.contact.postalCode} {company.contact.city}, {company.contact.country}
              </address>
              <SocialLinks className="mt-6" />
            </div>
          </div>
        </div>

        <FooterPlane />

        {/* pb-24: room for the floating WhatsApp button, which stays on screen. */}
        <div className="flex flex-col gap-3 pb-24 pt-6 sm:flex-row sm:items-center sm:justify-between sm:pb-6 sm:pr-20">
          <p className="bp-mono text-[var(--bp-faint)]">
            © {year} {company.name} · VNO
          </p>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {footerLegal.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-[0.85rem] text-[var(--bp-faint)] hover:text-[var(--bp-strong)]">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
