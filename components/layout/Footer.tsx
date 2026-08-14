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

            <SocialLinks className="mt-7" />
          </div>

          <div className="grid gap-9 sm:grid-cols-2 lg:grid-cols-3">
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
          </div>
        </div>

        {/*
          One closing rail instead of three.

          The footer previously ran a contact row, a legal row and a separate
          disclaimer paragraph — three stacked bands of small print that pushed
          the useful links off most screens. The full regulatory text and the
          outcomes disclaimer live on /legal/disclaimer, which is linked here,
          so nothing has been lost except the repetition.
        */}
        <div className="border-t border-line py-7">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <ContactLinks location="footer" />
            <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
              {[...footerLegal, { label: "Image credits", href: "/legal/image-credits" }].map(
                (l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-[0.76rem] text-faint transition-colors hover:text-fg"
                    >
                      {l.label}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>
          <p className="mt-5 text-[0.74rem] leading-relaxed text-faint">
            © {year} {company.name}. Registered in{" "}
            {company.legal.incorporatedIn}. Admission, employment, banking,
            licensing and immigration outcomes rest with institutions,
            employers and national authorities — see the{" "}
            <Link
              href="/legal/disclaimer"
              className="underline underline-offset-2 transition-colors hover:text-fg"
            >
              full disclaimer
            </Link>
            .
          </p>
        </div>
      </Shell>
    </footer>
  );
}
