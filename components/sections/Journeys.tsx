"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { Shell, Chapter, MaskedLines, Action, Reveal } from "@/components/ui/Editorial";
import { pathways, type Pathway } from "@/data/pathways";
import { analytics } from "@/lib/analytics";
import { cn } from "@/lib/utils";

/**
 * CHAPTER 02 — THREE HUMAN JOURNEYS.
 *
 * Each journey is a full-bleed panel with its own art direction: the plate
 * alternates sides, the display line is set against it, and the supporting
 * detail sits in a narrow measure like a caption column. Deliberately not a
 * repeating card — the rhythm changes as you descend.
 */

const HEADLINES: Record<
  Pathway["key"],
  { lines: React.ReactNode[]; kicker: string; plate: string; alt: string }
> = {
  study: {
    kicker: "For students",
    lines: [
      <>Your future shouldn&rsquo;t be</>,
      <>
        limited by <span className="d-em">geography</span>.
      </>,
    ],
    plate: "/images/atmos-library.webp",
    alt: "Library stacks receding into shadow",
  },
  careers: {
    kicker: "For professionals",
    lines: [
      <>Your next career could be</>,
      <>
        somewhere you <span className="d-em">haven&rsquo;t</span> looked.
      </>,
    ],
    plate: "/images/plate-europe-dawn.webp",
    alt: "European rooftops at first light",
  },
  business: {
    kicker: "For founders",
    lines: [
      <>Your business can think</>,
      <>
        bigger than <span className="d-em">one</span> market.
      </>,
    ],
    plate: "/images/path-business.webp",
    alt: "Glass towers seen from below",
  },
};

function Journey({ pathway, index }: { pathway: Pathway; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const flipped = index % 2 === 1;
  const art = HEADLINES[pathway.key];

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-9%", "9%"]);
  const imgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1.02, 1.1]);

  return (
    <div
      ref={ref}
      className="relative border-t border-white/8 py-20 first:border-t-0 md:py-28"
    >
      <Shell>
        <div
          className={cn(
            "grid items-center gap-10 lg:grid-cols-2 lg:gap-20",
            flipped && "lg:[&>*:first-child]:order-2"
          )}
        >
          {/* Plate */}
          <div className="relative">
            <div className="plate relative aspect-[5/6] overflow-hidden sm:aspect-[4/3] lg:aspect-[5/6]">
              <motion.div
                className="absolute inset-[-8%]"
                style={reduced ? undefined : { y: imgY, scale: imgScale }}
              >
                <Image
                  src={art.plate}
                  alt={art.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 48vw"
                  loading="lazy"
                  className="object-cover"
                />
              </motion.div>
            </div>

            {/* index plate — overlaps the image edge */}
            <div
              className={cn(
                "absolute -bottom-5 z-[3] flex items-baseline gap-3 bg-void px-5 py-3",
                flipped ? "right-0 lg:-right-6" : "left-0 lg:-left-6"
              )}
            >
              <span className="label num text-moss-400">0{index + 1}</span>
              <span className="label text-navy-200">{art.kicker}</span>
            </div>
          </div>

          {/* Copy */}
          <div className={cn(flipped && "lg:order-1")}>
            <MaskedLines
              as="h3"
              className="d-2 text-paper"
              lines={art.lines}
            />

            <Reveal delay={0.12}>
              <p className="mt-6 max-w-md text-[0.97rem] leading-[1.68] text-navy-200">
                {pathway.body}
              </p>
            </Reveal>

            <Reveal delay={0.18}>
              <ul className="mt-8 max-w-md">
                {pathway.bullets.map((b, i) => (
                  <li
                    key={b}
                    className="flex items-baseline gap-4 border-t border-white/10 py-3.5 last:border-b"
                  >
                    <span className="label num shrink-0 text-moss-400/60">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[0.9rem] leading-snug text-navy-100">
                      {b}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.24}>
              <div className="mt-9">
                <Action
                  href={pathway.href}
                  variant="line"
                  magnetic
                  onClick={() =>
                    analytics.pathwaySelect(pathway.key, "journeys")
                  }
                >
                  {pathway.cta}
                </Action>
              </div>
            </Reveal>
          </div>
        </div>
      </Shell>
    </div>
  );
}

export function Journeys() {
  return (
    <section id="journeys" className="relative overflow-hidden bg-abyss">
      <div aria-hidden className="graticule pointer-events-none absolute inset-0 opacity-40" />
      <Shell className="relative pt-24 md:pt-32">
        <Chapter index="02" label="Three journeys" />
      </Shell>
      <div className="relative">
        {pathways.map((p, i) => (
          <Journey key={p.key} pathway={p} index={i} />
        ))}
      </div>
    </section>
  );
}
