import { company } from "@/data/company";
import { partners } from "@/data/partners";

/**
 * THE TRUST TICKER — the info strip that runs under an airport display.
 *
 * Every item is a verified fact already held in data/: the office address,
 * the attributes published on the live site, the partner cities, the portal,
 * the free first consultation (data/study.ts → studyJourney). It is the quick
 * answer to the question every parent asks first: "who are these people?"
 *
 * Decorative motion only — the same items are plain text in the DOM, the
 * duplicate copy is aria-hidden, and under reduced motion the strip wraps
 * as a static row (boarding.css).
 */

const partnerCities = [...new Set(partners.map((p) => `${p.city}`))].join(" · ");

const ITEMS = [
 `Office in ${company.contact.city}, ${company.contact.country}, inside the EU`,
  `Partner universities in ${partnerCities}`,
  "Your own live student portal",
  "First consultation free",
  "One named consultant, start to finish",
  "WhatsApp a real person, not a bot",
];

export function TrustTicker() {
  return (
    <section aria-label="Why students trust SnZ Ventures" className="relative z-10 border-y border-[var(--bp-line)] bg-white/[0.02] py-4">
      <div className="bp-marquee overflow-hidden">
        <div className="bp-marquee-track" style={{ ["--bp-speed" as string]: "60s" }}>
          {[0, 1].map((copy) => (
            <ul key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1 ? "true" : undefined}>
              {ITEMS.map((t) => (
                <li key={t} className="flex items-center gap-4 whitespace-nowrap pr-10 text-[0.95rem] text-[var(--bp-fg)]">
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0 -rotate-45 text-[var(--color-runway)]" fill="currentColor" aria-hidden>
                    <path d="M22.5 12c0-.8-.7-1.4-1.6-1.4h-5.4L10.3 2.3a.8.8 0 00-.7-.4H8.2c-.4 0-.6.4-.5.7l2.6 8H5.1L3.4 8.2a.6.6 0 00-.5-.3H1.8c-.3 0-.5.3-.4.6L2.6 12l-1.2 3.5c-.1.3.1.6.4.6h1.1c.2 0 .4-.1.5-.3l1.7-2.4h5.2l-2.6 8c-.1.3.1.7.5.7h1.4c.3 0 .5-.2.7-.4l5.2-8.3h5.4c.9 0 1.6-.6 1.6-1.4z" />
                  </svg>
                  {t}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
