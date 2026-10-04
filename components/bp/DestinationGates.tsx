"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { studyDestinations, type StudyDestination } from "@/data/study";
import { useReduced } from "@/components/bp/useReduced";
import { Reveal } from "./Reveal";
import { InlineCta } from "./InlineCta";
import { Arrow } from "./Glyphs";
import { cn } from "@/lib/utils";

/**
 * CHOOSE YOUR GATE — the ten destinations, photographed.
 *
 * Deliberately not a card grid (the old site had that). On desktop it is a
 * row of ten tall gates: each one a slim strip of the city's photograph with
 * the country set vertically and its airport code; the open gate widens to
 * show the city, the line SnZ publishes about it, the reason students
 * shortlist it, and its indicative tuition. The row walks itself from gate to
 * gate while nobody is touching it, and stops the moment somebody does.
 *
 * On a phone, the same content as a swipeable rail of full cards.
 *
 * Every fact is from data/study.ts (published on SnZ's own student site), and
 * the photographs are licensed and recorded in data/image-manifest.json.
 * Tuition is indicative and says so.
 */

const AUTO_MS = 4200;

export function DestinationGates() {
  const reduce = useReduced();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-20% 0px" });
  const [open, setOpen] = useState(0);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (reduce || touched || !inView) return;
    const t = window.setTimeout(() => setOpen((o) => (o + 1) % studyDestinations.length), AUTO_MS);
    return () => window.clearTimeout(t);
  }, [open, reduce, touched, inView]);

  const pick = (i: number) => {
    setTouched(true);
    setOpen(i);
  };

  return (
    <section id="destinations" aria-labelledby="gates-title" className="relative z-10 py-10 sm:py-14">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="bp-eyebrow">Choose your gate</p>
            <Reveal mask>
              <h2 id="gates-title" className="bp-display bp-h2 mt-5 max-w-3xl">
                Ten cities. <span className="bp-outline">One of them is yours.</span>
              </h2>
            </Reveal>
          </div>
          <p className="bp-body max-w-md">
            Open a gate to see the city, what draws students there, and what a year of tuition starts at, all before you
            ever book a call.
          </p>
        </div>

        {/* Desktop: the gates */}
        <div ref={ref} className="mt-10 hidden h-[560px] gap-2.5 lg:flex" role="tablist" aria-label="Study destinations">
          {studyDestinations.map((d, i) => (
            <Gate key={d.slug} d={d} i={i} open={open === i} onPick={() => pick(i)} />
          ))}
        </div>

        {/* Phone & tablet: the rail */}
        <div className="-mx-4 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 lg:hidden">
          {studyDestinations.map((d) => (
            <article key={d.slug} className="relative aspect-[3/4] w-[78vw] max-w-[340px] shrink-0 snap-center overflow-hidden rounded-[22px] bg-[#04070F] bp-night">
              <Image src={d.image} alt={d.imageAlt} fill sizes="78vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#04070F] via-[#04070F]/45 to-transparent" />
              <GateBody d={d} />
            </article>
          ))}
        </div>

        <p className="mt-4 text-[0.85rem] text-[var(--bp-faint)]">
          Tuition is indicative annual course fees as published by SnZ Ventures; the exact figure depends on the
          programme and the university.
        </p>
        <InlineCta className="mt-6" lead="Not sure which gate is yours?" label="Let a consultant shortlist with you" href="/contact#journey" />
      </div>
    </section>
  );
}

function Gate({ d, i, open, onPick }: { d: StudyDestination; i: number; open: boolean; onPick: () => void }) {
  return (
    <motion.div
      layout
      role="tab"
      aria-selected={open}
      tabIndex={0}
      onClick={onPick}
      onMouseEnter={onPick}
      onFocus={onPick}
      className={cn(
        "bp-night group relative cursor-pointer overflow-hidden rounded-[22px] bg-[#04070F] outline-none ring-[var(--color-aurora)] focus-visible:ring-2",
        open ? "flex-[6]" : "flex-1"
      )}
      transition={{ layout: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }}
    >
      <Image
        src={d.image}
        alt={d.imageAlt}
        fill
        sizes={open ? "60vw" : "12vw"}
        className={cn("object-cover transition-transform duration-[1600ms] ease-out", open ? "scale-105" : "scale-110 grayscale-[35%]")}
        priority={i < 2}
      />
      <div
        className={cn(
          "absolute inset-0 transition-colors duration-700",
          open ? "bg-gradient-to-t from-[#04070F] via-[#04070F]/35 to-transparent" : "bg-[#04070F]/55 group-hover:bg-[#04070F]/40"
        )}
      />

      {/* Closed: the strip label */}
      <AnimatePresence>
        {!open && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-between py-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <span className="bp-mono text-[var(--color-runway)]">{d.airport}</span>
            <span className="font-[family-name:var(--font-grotesk)] text-[1.15rem] font-semibold tracking-tight text-white [writing-mode:vertical-rl] rotate-180">
              {d.country}
            </span>
            <span className="relative h-4 w-6 overflow-hidden rounded-[3px]">
              <Image src={`/flags/${d.slug}.svg`} alt="" fill sizes="24px" className="object-cover" />
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Open: the full gate */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <GateBody d={d} big />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function GateBody({ d, big }: { d: StudyDestination; big?: boolean }) {
  return (
    <div className="absolute inset-0 flex flex-col justify-between p-5 text-white sm:p-7">
      <div className="flex items-start justify-between gap-3">
        <span className="flex items-center gap-2 whitespace-nowrap rounded-full bg-black/35 px-3 py-1.5 backdrop-blur">
          <span className="relative h-3.5 w-5 overflow-hidden rounded-[2px]">
            <Image src={`/flags/${d.slug}.svg`} alt="" fill sizes="20px" className="object-cover" />
          </span>
          <span className="bp-mono text-white">Gate {d.airport}</span>
        </span>
        <span className="whitespace-nowrap rounded-full bg-[var(--color-runway)] px-3 py-1.5 text-[0.8rem] font-semibold text-[var(--bp-on-accent)]">
          {d.tuitionFrom}
        </span>
      </div>
      <div className={big ? "max-w-xl" : ""}>
        <p className="bp-mono text-white/85">{d.city}</p>
        <h3 className={cn("bp-display mt-2 text-white", big ? "text-[3.4rem]" : "text-[2.2rem]")}>{d.country}</h3>
        <p className={cn("mt-3 leading-relaxed text-white/90", big ? "text-[1.05rem]" : "text-[0.95rem]")}>{d.blurb}</p>
        <p className="mt-3 flex items-center gap-2 text-[0.92rem] font-semibold text-white">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-runway)]" />
          {d.draw}
        </p>
        <Link
          href="/contact#journey"
          onClick={(e) => e.stopPropagation()}
          className="bp-btn bp-btn-primary bp-btn-sm mt-5"
        >
          Ask about {d.country} <Arrow />
        </Link>
      </div>
    </div>
  );
}
