"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, Fragment } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Shell, Chapter, MaskedLines, Reveal, TextLink, Caveat } from "@/components/ui/Editorial";
import { CorridorMap } from "@/components/visuals/CorridorMap";
import { destinations, availabilityLabel } from "@/data/destinations";
import { analytics } from "@/lib/analytics";
import { cn } from "@/lib/utils";

/**
 * CHAPTER 05 — THE ATLAS.
 *
 * The signature global moment. The dot-matrix map carries the geography while
 * a selectable ledger of markets sits alongside it — choosing a market swaps
 * the plate and its availability read-out. Availability is shown honestly,
 * including the markets where the answer is still "ask us".
 */
export function Atlas() {
  const [active, setActive] = useState(0);
  const current = destinations[active];

  const rows = [
    { label: "Study", value: current.study },
    { label: "Careers", value: current.careers },
    { label: "Business", value: current.business },
  ] as const;

  return (
    <section id="atlas" className="grain relative overflow-hidden tone-deep py-16 md:py-20">
      <div
        aria-hidden
        className="bloom-royal pointer-events-none absolute left-1/2 top-0 h-[44rem] w-[44rem] -translate-x-1/2 opacity-35"
      />

      <Shell className="relative">
        <Chapter index="05" label="The atlas" className="mb-10" />

        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <MaskedLines
            as="h2"
            className="d-1 max-w-[16ch] text-fg"
            lines={[
              "Talent In. Businesses Out.",
              <Fragment key="Middle">
                Vilnius in the <span className="d-em">Middle</span>.
              </Fragment>,
            ]}
          />
          <Reveal delay={0.15}>
            <p className="max-w-sm text-[0.95rem] leading-relaxed text-muted">
              Eight source markets. Eight European destinations. We work both
              ends of the corridor, which is why what we tell each side is
              grounded in the other.
            </p>
          </Reveal>
        </div>

        {/* Map */}
        <Reveal delay={0.1} className="mt-14">
          <div className="relative">
            {/*
              Pins, driven by the ledger selection below — hovering a market
              lights its pin. That interaction is this section's own identity;
              the arc animation belongs to the home hero and repeating it here
              made two adjacent sections look like the same slide twice.
            */}
            <CorridorMap tone="dark" variant="pins" land="solid" activeSlug={current.slug} />
            <span aria-hidden className="absolute -left-px -top-px h-6 w-6 border-l border-t border-moss-400/50" />
            <span aria-hidden className="absolute -bottom-px -right-px h-6 w-6 border-b border-r border-moss-400/50" />
          </div>
        </Reveal>

        {/* Ledger */}
        <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_22rem] lg:gap-14">
          <div>
            <div className="rule flex items-baseline justify-between border-t pb-4 pt-4">
              <span className="label text-faint">Market</span>
              <span className="label text-faint">Focus</span>
            </div>
            <ul>
              {destinations.map((d, i) => (
                <li key={d.slug} className="border-b border-line">
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => {
                      setActive(i);
                      analytics.destinationView(d.slug);
                    }}
                    aria-pressed={active === i}
                    className="group flex w-full items-baseline justify-between gap-6 py-4 text-left"
                  >
                    <span className="flex items-baseline gap-4">
                      <span className="label num shrink-0 text-accent">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={cn(
                          "font-display text-[1.5rem] leading-none tracking-[-0.02em] transition-colors duration-400 sm:text-[1.9rem]",
                          active === i ? "text-fg" : "text-faint group-hover:text-fg"
                        )}
                      >
                        {d.country}
                      </span>
                    </span>
                    <span
                      className={cn(
                        "label shrink-0 transition-colors duration-400",
                        d.business === "core"
                          ? "text-accent"
                          : "text-faint group-hover:text-muted"
                      )}
                    >
                      {d.business === "core" ? "Full stack" : "Recruitment"}
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <TextLink href="/destinations">Open the full atlas</TextLink>
            </div>
          </div>

          {/* Detail panel */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="plate relative aspect-[4/3] overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.slug}
                  initial={{ opacity: 0, scale: 1.06 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0"
                >
                  <Image
                    src={current.image}
                    alt={`${current.city}, ${current.country}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 22rem"
                    loading="lazy"
                    className="object-cover"
                  />
                </motion.div>
              </AnimatePresence>
              <span className="absolute bottom-4 left-4 z-[3]">
                <span className="label block text-muted">{current.city}</span>
              </span>
            </div>

            <div className="mt-5">
              <p className="text-[0.88rem] leading-relaxed text-muted">
                {current.blurb}
              </p>

              <dl className="mt-5">
                {rows.map((r) => (
                  <div
                    key={r.label}
                    className="flex items-center justify-between border-t border-line py-2.5"
                  >
                    <dt className="label text-faint">{r.label}</dt>
                    <dd
                      className={cn(
                        "label",
                        r.value === "core"
                          ? "text-accent"
                          : r.value === "available"
                            ? "text-fg"
                            : "text-faint"
                      )}
                    >
                      {availabilityLabel[r.value]}
                    </dd>
                  </div>
                ))}
              </dl>

              <p className="mt-4 border-t border-line pt-4 text-[0.78rem] leading-snug text-faint">
                {current.marketNote}
              </p>

              <Link
                href="/destinations"
                /*
                  CTA form #3 — the one that changes as you explore. It names
                  whichever country is selected, so the invitation is always
                  about the place the reader is currently looking at rather
                  than a generic "learn more". min-h-11 keeps it thumb-sized.
                */
                className="label mt-5 inline-flex min-h-11 items-center gap-2 text-accent transition-colors hover:text-accent"
              >
                <span className="draw">Explore {current.country}</span>
              </Link>
            </div>
          </div>
        </div>

        <Caveat>
          &ldquo;Ask us&rdquo; means exactly that — the service isn&rsquo;t
          confirmed for that market. Availability varies by role, sector and
          permit category, and nothing here is an offer or a guarantee of
          eligibility.
        </Caveat>
      </Shell>
    </section>
  );
}
