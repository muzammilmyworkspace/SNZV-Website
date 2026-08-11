"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
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
    <section id="atlas" className="grain relative overflow-hidden bg-void py-24 md:py-32">
      <div
        aria-hidden
        className="bloom-royal pointer-events-none absolute left-1/2 top-0 h-[44rem] w-[44rem] -translate-x-1/2 opacity-35"
      />

      <Shell className="relative">
        <Chapter index="05" label="The atlas" className="mb-10" />

        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <MaskedLines
            as="h2"
            className="d-1 max-w-[16ch] text-paper"
            lines={[
              <>Talent in. Businesses out.</>,
              <>
                Vilnius in the <span className="d-em">middle</span>.
              </>,
            ]}
          />
          <Reveal delay={0.15}>
            <p className="max-w-sm text-[0.95rem] leading-relaxed text-navy-200">
              Eight source markets. Eight European destinations. We work both
              ends of the corridor, which is why what we tell each side is
              grounded in the other.
            </p>
          </Reveal>
        </div>

        {/* Map */}
        <Reveal delay={0.1} className="mt-14">
          <div className="relative">
            <CorridorMap tone="dark" />
            <span aria-hidden className="absolute -left-px -top-px h-6 w-6 border-l border-t border-moss-400/50" />
            <span aria-hidden className="absolute -bottom-px -right-px h-6 w-6 border-b border-r border-moss-400/50" />
          </div>
        </Reveal>

        {/* Ledger */}
        <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_22rem] lg:gap-14">
          <div>
            <div className="rule flex items-baseline justify-between border-t pb-4 pt-4">
              <span className="label text-navy-300">Market</span>
              <span className="label text-navy-300">Focus</span>
            </div>
            <ul>
              {destinations.map((d, i) => (
                <li key={d.slug} className="border-b border-white/8">
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
                      <span className="label num shrink-0 text-moss-400/50">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={cn(
                          "font-display text-[1.5rem] leading-none tracking-[-0.02em] transition-colors duration-400 sm:text-[1.9rem]",
                          active === i ? "text-paper" : "text-navy-300 group-hover:text-paper"
                        )}
                      >
                        {d.country}
                      </span>
                    </span>
                    <span
                      className={cn(
                        "label shrink-0 transition-colors duration-400",
                        d.business === "core"
                          ? "text-moss-400"
                          : "text-navy-400 group-hover:text-navy-200"
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
                <span className="label block text-paper/70">{current.city}</span>
              </span>
            </div>

            <div className="mt-5">
              <p className="text-[0.88rem] leading-relaxed text-navy-200">
                {current.blurb}
              </p>

              <dl className="mt-5">
                {rows.map((r) => (
                  <div
                    key={r.label}
                    className="flex items-center justify-between border-t border-white/10 py-2.5"
                  >
                    <dt className="label text-navy-300">{r.label}</dt>
                    <dd
                      className={cn(
                        "label",
                        r.value === "core"
                          ? "text-moss-400"
                          : r.value === "available"
                            ? "text-navy-100"
                            : "text-navy-400"
                      )}
                    >
                      {availabilityLabel[r.value]}
                    </dd>
                  </div>
                ))}
              </dl>

              <p className="mt-4 border-t border-white/10 pt-4 text-[0.78rem] leading-snug text-navy-400">
                {current.marketNote}
              </p>

              <Link
                href="/destinations"
                className="label mt-5 inline-flex items-center gap-2 text-moss-300 transition-colors hover:text-moss-200"
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
