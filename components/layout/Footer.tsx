import Link from "next/link";
import Image from "next/image";
import { Shell } from "@/components/ui/Editorial";
import { footerNav } from "@/data/navigation";
import { company } from "@/data/company";
import { ContactLinks } from "./ContactLinks";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="grain relative overflow-hidden border-t border-line bg-surface">
      <div aria-hidden className="graticule pointer-events-none absolute inset-0 opacity-40" />
      <div
        aria-hidden
        className="bloom-moss pointer-events-none absolute -bottom-56 left-1/3 h-[32rem] w-[32rem] opacity-25"
      />

      <Shell className="relative">
        {/* Brand statement, set large */}
        <div className="grid gap-12 py-16 lg:grid-cols-[1.15fr_2fr] lg:gap-20 lg:py-20">
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

            <address className="mt-7 not-italic">
              <span className="label block text-accent">Office</span>
              <p className="mt-3 text-[0.9rem] leading-relaxed text-muted">
                {company.contact.streetAddress}
                <br />
                {company.contact.postalCode} {company.contact.city}
                <br />
                {company.contact.country}
              </p>
            </address>

            <ul className="mt-7 flex flex-wrap gap-2">
              {company.attributes.map((a) => (
                <li key={a} className="label border border-line px-2.5 py-1.5 text-faint">
                  {a}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-9 sm:grid-cols-2 lg:grid-cols-4">
            {footerNav.map((group) => (
              <nav key={group.heading} aria-label={group.heading}>
                <h2 className="label text-moss-400">{group.heading}</h2>
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
          </div>
        </div>

        {/* Contact rail */}
        <div className="flex flex-col gap-6 border-t border-line py-8 md:flex-row md:items-center md:justify-between">
          <ContactLinks location="footer" />
          {company.social.linkedin && (
            <a
              href={company.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="SnZ Ventures on LinkedIn"
              className="flex h-10 w-10 items-center justify-center border border-line text-muted transition-colors hover:border-moss-400/60 hover:text-accent"
            >
              <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4" fill="currentColor">
                <path d="M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3 8.98h4v12.02H3V8.98zM9.5 8.98h3.83v1.64h.05c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.78 2.65 4.78 6.1V21H18v-5.54c0-1.32-.03-3.03-1.85-3.03-1.85 0-2.13 1.44-2.13 2.93V21H9.5V8.98z" />
              </svg>
            </a>
          )}
        </div>

        {/* Legal */}
        <div className="flex flex-col gap-4 border-t border-line py-7 text-[0.76rem] leading-relaxed text-faint md:flex-row md:justify-between">
          <p>
            © {year} {company.name}. Registered in {company.legal.incorporatedIn}.
          </p>
          <p className="max-w-2xl md:text-right">{company.regulatoryNotice}</p>
        </div>

        <div className="border-t border-line py-6 text-[0.72rem] leading-relaxed text-faint">
          <p>
            SnZ Ventures does not guarantee admission, employment, banking,
            licensing or immigration outcomes. These decisions rest with
            institutions, employers, financial institutions and national
            authorities.{" "}
            <Link
              href="/legal/image-credits"
              className="underline underline-offset-2 transition-colors hover:text-faint"
            >
              Image credits
            </Link>
            .
          </p>
        </div>
      </Shell>
    </footer>
  );
}
