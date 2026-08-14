import Link from "next/link";
import Image from "next/image";
import { Shell } from "@/components/ui/Editorial";
import { footerNav, footerLegal } from "@/data/navigation";
import { company } from "@/data/company";
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
          </div>

          {/* Two columns from the smallest screen up. Stacked one-per-row,
              the link groups made the footer taller than the phone. */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-3 lg:gap-9">
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

            {/*
              Contact replaces the old Company and Legal columns: the three
              things people scan a footer for — how to email, how to call,
              where the office is — plus the social rail, all in one place
              rather than split between a brand block and a bottom rail.
            */}
            <div className="sm:col-span-2 lg:col-span-1">
              <h2 className="label text-accent">Contact</h2>

              <ul className="mt-5 space-y-3">
                <li>
                  <a
                    href={`mailto:${company.contact.email}`}
                    className="break-all text-[0.87rem] text-muted transition-colors duration-300 hover:text-fg"
                  >
                    {company.contact.email}
                  </a>
                </li>
                <li>
                  <a
                    href={`tel:${company.contact.phoneHref}`}
                    className="text-[0.87rem] text-muted transition-colors duration-300 hover:text-fg"
                  >
                    {company.contact.phone}
                  </a>
                </li>
              </ul>

              <address className="mt-4 not-italic text-[0.87rem] leading-relaxed text-muted">
                {company.contact.streetAddress}
                <br />
                {company.contact.postalCode} {company.contact.city},{" "}
                {company.contact.country}
              </address>

              <SocialLinks className="mt-6" />
            </div>
          </div>
        </div>

        {/*
          The footer ends on the copyright plus a quiet legal row.

          It previously carried a contact rail, a legal rail and a disclaimer
          paragraph stacked underneath each other. Contact is now its own
          column, so the foot of the page carries almost nothing.
        */}
        <div className="flex flex-col gap-3 border-t border-line py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[0.76rem] text-faint">
            © {year} {company.name}
          </p>
          {/*
            Legal is down to a quiet inline row rather than a column. These
            cannot be dropped outright — a privacy policy link has to stay
            reachable for EU visitors, and the disclaimer is what keeps the
            outcome language on the rest of the site honest.
          */}
          <ul className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
            {footerLegal.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-[0.74rem] text-faint transition-colors hover:text-fg"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Shell>
    </footer>
  );
}
