"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useSafeReducedMotion } from "@/lib/use-safe-reduced-motion";
import { Action, MaskedLines } from "@/components/ui/Editorial";
import { analytics } from "@/lib/analytics";
import { company } from "@/data/company";
import { studyDestinations } from "@/data/study";
import { partners } from "@/data/partners";

/**
 * THE HERO — drawn, not photographed.
 *
 * The previous hero was a four-frame photographic slideshow with parallax
 * plates. It was well made and it was also every consultancy hero on the
 * internet: a city at dusk, a headline over it, a gradient to keep the type
 * legible. Nothing about it could only have been SnZ.
 *
 * This is a drawing. One route is struck across the viewport in the brand's
 * own two hues, the type sits in the space the curve leaves, and the hairline
 * grid behind it is the same grid that runs under every band on the page. It
 * is the opening statement of a site whose whole argument is a line from one
 * country to another — and it is a composition nobody else is running, which
 * is the entire point of a hero.
 *
 * NO PHOTOGRAPH, deliberately. A stock skyline says "we bought a stock
 * skyline". It also costs 300KB at the exact moment the Largest Contentful
 * Paint is measured; this hero's heaviest asset is a font that was already
 * loading.
 *
 * ENTRANCE, THEN NOTHING. The route draws once on mount and stops. No
 * autoplay, no loop, no slideshow advancing behind the reader's sentence —
 * the old hero changed its background every 4.5 seconds, which is movement
 * competing with the one thing the hero needs somebody to read.
 */

/**
 * The route, in the hero's own 1200×640 coordinate space.
 *
 * IT KEEPS OUT OF THE TYPE'S WAY, and that is most of the design work in this
 * file. The first version swept from the bottom-left corner and crossed the
 * headline and the body copy on the way up — a 2px gradient stroke through
 * "has no borders." which made the one line a visitor must read the hardest
 * thing on the screen to read.
 *
 * The type block occupies roughly x 170–600 at this scale, so the curve now
 * enters below it and climbs through the right half only. The composition is
 * the same gesture; it simply happens in the space the words leave.
 */
const ARC =
  "M 470 700 C 640 648 714 520 820 404 C 926 288 1040 156 1270 112";

/** Nodes on the curve, as a fraction of its length. */
const STOPS = [0.12, 0.42, 0.72, 0.94];

export function Hero() {
  const reduced = useSafeReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [nodes, setNodes] = useState<{ x: number; y: number }[]>([]);

  /*
    Measured off the real path once, so the dots stay on the curve when the
    curve is adjusted. Eyeballed coordinates drift by a few pixels and nobody
    notices until the whole thing looks subtly wrong.
  */
  useEffect(() => {
    const el = pathRef.current;
    if (!el) return;
    const len = el.getTotalLength();
    setNodes(
      STOPS.map((t) => {
        const p = el.getPointAtLength(t * len);
        return { x: p.x, y: p.y };
      })
    );
  }, []);

  /*
    The only scroll work in the hero: the type leaves slightly faster than the
    page. Transform and opacity only — this runs while the reader is still on
    the first screen, which is the worst possible moment to drop a frame.
  */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const typeY = useTransform(scrollYProgress, [0, 1], ["0%", "-26%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      className="tone-deep relative flex min-h-[94svh] flex-col justify-end overflow-hidden pb-10 pt-32 sm:pb-14"
    >
      {/* ------------------------------------------------------- the route */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <svg
          viewBox="0 0 1200 640"
          fill="none"
          /*
            `slice` so the curve fills the frame at every ratio rather than
            letterboxing. Hidden below `sm`: at phone width the crop leaves
            only a fragment of the curve, and a fragment behind a full-width
            headline is noise rather than composition.
          */
          preserveAspectRatio="xMidYMid slice"
          className="hidden h-full w-full sm:block"
        >
          <defs>
            {/*
              A fade at the bottom end. Without it the stroke stops dead at the
              section's edge and reads as a clipped graphic rather than a route
              arriving from somewhere off-screen.
            */}
            <linearGradient id="hero-fade" x1="0" y1="1" x2="0.35" y2="0">
              <stop offset="0%" stopColor="#000" stopOpacity="0" />
              <stop offset="22%" stopColor="#000" stopOpacity="1" />
            </linearGradient>
            <mask id="hero-mask">
              <rect x="0" y="0" width="1200" height="640" fill="url(#hero-fade)" />
            </mask>
            {/*
              The mark's own two hues, with a teal midpoint. A straight
              blue-to-green blend passes through desaturated slate — the muddy
              midpoint that makes a two-colour gradient look cheap. The reason
              is written out at BRAND GRADIENT in globals.css; this is the same
              ramp, as a stroke.
            */}
            <linearGradient id="hero-route" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--brand-blue)" />
              <stop offset="45%" stopColor="var(--brand-teal)" />
              <stop offset="100%" stopColor="var(--brand-green)" />
            </linearGradient>
          </defs>

          {/* The whole route, faint — so the shape of the journey is legible
              before the line has finished travelling it. */}
          <path
            d={ARC}
            stroke="var(--line-strong)"
            strokeWidth={1}
            strokeDasharray="2 7"
            strokeLinecap="round"
            mask="url(#hero-mask)"
          />

          <motion.path
            ref={pathRef}
            d={ARC}
            pathLength={1}
            stroke="url(#hero-route)"
            strokeWidth={2}
            strokeLinecap="round"
            mask="url(#hero-mask)"
            initial={{ strokeDasharray: 1, strokeDashoffset: reduced ? 0 : 1 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{
              duration: reduced ? 0 : 2.4,
              ease: [0.16, 1, 0.3, 1],
              delay: reduced ? 0 : 0.15,
            }}
          />

          {nodes.map((n, i) => (
            <motion.circle
              key={i}
              cx={n.x}
              cy={n.y}
              r={3.5}
              fill="var(--brand-green)"
              initial={{ opacity: reduced ? 1 : 0, scale: reduced ? 1 : 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: reduced ? 0 : 0.5,
                delay: reduced ? 0 : 0.5 + STOPS[i] * 1.9,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            />
          ))}
        </svg>
      </div>

      {/* A pool of brand light where the route lands, so the top-right corner
          is not an empty navy field. */}
      <div
        aria-hidden
        className="bloom-moss pointer-events-none absolute -right-32 -top-32 h-[34rem] w-[34rem] opacity-50"
      />

      {/* ------------------------------------------------------------ type */}
      <motion.div
        style={{ y: reduced ? 0 : typeY, opacity: reduced ? 1 : fade }}
        className="relative mx-auto w-full max-w-[1320px] px-5 sm:px-8 lg:px-10"
      >
        <motion.p
          initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: reduced ? 0 : 0.1 }}
          className="label flex flex-wrap items-center gap-x-4 gap-y-2 text-accent"
        >
          <span className="num">54.6872° N, 25.2797° E</span>
          <span aria-hidden className="h-px w-8 bg-current opacity-40" />
          <span className="text-muted">{company.positioning}</span>
        </motion.p>

        {/*
          Four short lines, not two long ones. The mask reveal works line by
          line, so the rhythm of the reveal IS the rhythm of the sentence —
          and at this size two lines of ten words each is a paragraph set in
          display type, which nobody reads.
        */}
        <MaskedLines
          as="h1"
          animate="mount"
          delay={0.2}
          className="d-hero mt-7 max-w-[15ch] text-fg-strong"
          lines={["Your ambition", "has no borders."]}
        />

        <motion.p
          initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: reduced ? 0 : 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="lede mt-7 max-w-xl"
        >
          We move students, professionals and founders into Europe — from
          Vilnius, across all 27 member states. Every application has one named
          advisor and a portal you can open at two in the morning.
        </motion.p>

        <motion.div
          initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: reduced ? 0 : 0.92, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          <Action
            href="/contact#journey"
            size="lg"
            onClick={() => analytics.ctaClick("Start your journey", "hero")}
          >
            Start your journey
          </Action>
          <Action
            href={company.portalUrl}
            external
            variant="line"
            size="lg"
            onClick={() => analytics.ctaClick("Portal login", "hero")}
          >
            Portal login
          </Action>
        </motion.div>

        {/*
          THE RAIL. Three facts, each derived from this site's own content and
          checkable by scrolling — see the header of data/stats.ts on why the
          numbers here count inventory rather than performance.
        */}
        <motion.ul
          initial={{ opacity: reduced ? 1 : 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: reduced ? 0 : 1.15 }}
          className="mt-14 grid gap-x-10 gap-y-5 border-t border-line pt-7 sm:grid-cols-3"
        >
          {[
            { n: studyDestinations.length, label: "Study destinations in Europe" },
            { n: partners.length, label: "Named university partnerships" },
            { n: 27, label: "EU member states, from one entity" },
          ].map((f) => (
            <li key={f.label} className="flex items-baseline gap-3">
              <span className="num text-[1.6rem] leading-none text-fg-strong">
                {f.n}
              </span>
              <span className="text-[0.82rem] leading-snug text-muted">
                {f.label}
              </span>
            </li>
          ))}
        </motion.ul>
      </motion.div>
    </section>
  );
}
