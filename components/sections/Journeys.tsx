"use client";

import Image from "next/image";
import { useRef, Fragment } from "react";
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
      "Your future shouldn’t be",
      <Fragment key="geography">
        Limited by <span className="d-em">Geography</span>.
      </Fragment>,
    ],
    plate: "/images/atmos-library.webp",
    alt: "Library stacks receding into shadow",
  },
  careers: {
    kicker: "For professionals",
    lines: [
      "Your next career could be",
      <Fragment key="havent">
        Somewhere You <span className="d-em">Haven&rsquo;t</span> Looked.
      </Fragment>,
    ],
    plate: "/images/plate-europe-dawn.webp",
    alt: "European rooftops at first light",
  },
  business: {
    kicker: "For founders",
    lines: [
      "Your business can think",
      <Fragment key="one-market">
        Bigger Than <span className="d-em">One</span> Market.
      </Fragment>,
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
      className="relative border-t border-line py-14 first:border-t-0 md:py-16"
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
            {/*
              4:5 on desktop, not 5:6.

              At 5:6 the plate rendered ~710px against ~483px of copy beside
              it — half again as tall as the thing it illustrates, which left
              the text floating in the middle of a column of photograph. The
              cap keeps it from outgrowing the copy on very wide viewports;
              the aspect ratio is preserved, so nothing is distorted.
            */}
            <div className="plate relative aspect-[5/6] overflow-hidden sm:aspect-[4/3] lg:aspect-[4/5] lg:max-h-[34rem]">
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
                "absolute -bottom-5 z-[3] flex items-baseline gap-3 bg-surface px-5 py-3",
                flipped ? "right-0 lg:-right-6" : "left-0 lg:-left-6"
              )}
            >
              <span className="label num text-accent">0{index + 1}</span>
              <span className="label text-muted">{art.kicker}</span>
            </div>
          </div>

          {/* Copy */}
          <div className={cn(flipped && "lg:order-1")}>
            <MaskedLines
              as="h3"
              className="d-2 text-fg"
              lines={art.lines}
            />

            <Reveal delay={0.12}>
              <p className="mt-6 max-w-md text-[0.97rem] leading-[1.68] text-muted">
                {pathway.body}
              </p>
            </Reveal>

            <Reveal delay={0.18}>
              <ul className="mt-8 max-w-md">
                {pathway.bullets.map((b, i) => (
                  <li
                    key={b}
                    className="flex items-baseline gap-4 border-t border-line py-3.5 last:border-b"
                  >
                    <span className="label num shrink-0 text-accent">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[0.9rem] leading-snug text-fg">
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
    <section id="journeys" className="relative overflow-hidden tone-soft">
      <div aria-hidden className="graticule pointer-events-none absolute inset-0 opacity-40" />
      <Shell className="relative pt-16 md:pt-20">
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
