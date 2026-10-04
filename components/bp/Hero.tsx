"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { homeStats } from "@/data/stats";
import { analytics } from "@/lib/analytics";
import { ApplicationScene } from "./ApplicationScene";
import { Arrow } from "./Glyphs";
import { useReduced } from "@/components/bp/useReduced";

/**
 * HERO — "From application form to take-off."
 *
 * One promise, two actions, and the scene that proves it. The headline is the
 * LCP element and is real text: it masks up line by line, but it is in the
 * HTML from the first byte, so nothing waits on an image to be readable.
 *
 * The ticket strip under the CTAs reads its figures from data/stats.ts — the
 * same shipped set as the departure board, so the two can never disagree.
 */

const LINES: { text: string; mark?: boolean }[] = [
  { text: "From one form" },
  { text: "to your first" },
  { text: "flight abroad.", mark: true },
];

export function Hero() {
  const reduce = useReduced();
  const ease = [0.16, 1, 0.3, 1] as const;
  const fig = (label: string) => {
    const s = homeStats.find((x) => x.label === label);
    return s ? `${s.value}${s.suffix ?? ""}` : null;
  };
  const placed = fig("Students placed");
  const dest = fig("Study destinations");

  return (
    <section className="relative z-10 overflow-hidden pt-28 sm:pt-32 lg:pt-36">
      <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-4 pb-10 sm:px-6 lg:grid-cols-[1fr_1.05fr] lg:gap-8 lg:px-10 lg:pb-12">
        <div className="relative">
          <motion.p
            className="bp-eyebrow"
            initial={reduce ? false : { opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease }}
          >
            Study abroad · with SnZ Ventures
          </motion.p>

          <h1 className="bp-display bp-h1 mt-6">
            {LINES.map((l, i) => (
              <span key={l.text} className="block overflow-hidden pb-[0.06em]">
                <motion.span
                  className={l.mark ? "block bp-mark" : "block"}
                  initial={reduce ? false : { y: "105%" }}
                  animate={{ y: "0%" }}
                  transition={{ delay: 0.15 + i * 0.12, duration: 1, ease }}
                >
                  {l.text}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            className="bp-lede mt-7"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.9, ease }}
          >
            We take students from the first conversation to the departure gate: shortlist, application, offer,
            visa, fees and flight. You watch every step happen live in your own portal.
          </motion.p>

          <motion.div
            className="mt-9 flex flex-wrap items-center gap-3"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.9, ease }}
          >
            <Link
              href="/contact#journey"
              onClick={() => analytics.ctaClick("Book a free consultation", "hero")}
              className="bp-btn bp-btn-primary"
            >
              Book a free consultation <Arrow />
            </Link>
            <a href="#journey" className="bp-btn bp-btn-ghost">
              See how it works
            </a>
          </motion.div>

          {/* The ticket strip — facts only, read from data. */}
          <motion.dl
            className="mt-12 grid max-w-xl grid-cols-3 divide-x divide-[var(--bp-line)] rounded-2xl border border-[var(--bp-line)] bg-white/[0.02]"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
          >
            <div className="px-4 py-3">
              <dt className="bp-mono !text-[0.72rem] text-[var(--bp-faint)]">Students placed</dt>
              <dd className="mt-1 font-[family-name:var(--font-grotesk)] text-lg font-semibold">{placed}</dd>
            </div>
            <div className="px-4 py-3">
              <dt className="bp-mono !text-[0.72rem] text-[var(--bp-faint)]">Destinations</dt>
              <dd className="mt-1 font-[family-name:var(--font-grotesk)] text-lg font-semibold">{dest} countries</dd>
            </div>
            <div className="px-4 py-3">
              <dt className="bp-mono !text-[0.72rem] text-[var(--bp-faint)]">Tracking</dt>
              <dd className="mt-1 flex items-center gap-2 font-[family-name:var(--font-grotesk)] text-lg font-semibold">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inset-0 animate-ping rounded-full bg-[var(--color-runway)] opacity-60 motion-reduce:animate-none" />
                  <span className="relative h-2 w-2 rounded-full bg-[var(--color-runway)]" />
                </span>
                Live
              </dd>
            </div>
          </motion.dl>
        </div>

        <ApplicationScene />
      </div>

      {/* Scroll cue */}
      <div aria-hidden className="pointer-events-none absolute bottom-5 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex">
        <span className="bp-mono !text-[0.72rem] text-[var(--bp-faint)]">Scroll to board</span>
        <span className="relative h-10 w-px overflow-hidden bg-[var(--bp-line)]">
          <motion.span
            className="absolute inset-x-0 top-0 h-4 bg-[var(--color-aurora)]"
            animate={reduce ? undefined : { y: ["-100%", "250%"] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </div>
    </section>
  );
}
