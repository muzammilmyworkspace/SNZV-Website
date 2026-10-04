"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "motion/react";
import { partners, partnerHorizon, horizonPoster, horizonPosterAlt, type Partner } from "@/data/partners";
import { useReduced } from "@/components/bp/useReduced";

/**
 * PARTNERSHIPS — SnZ's own announcement posters, dealt onto the table.
 *
 * The posters are the firm's published creatives for each partnership
 * (data/partners.ts → poster), so the institution's name and campus appear
 * exactly as SnZ announced them — nothing reproduced or assembled here. The
 * name, city and highlights are repeated as real text beneath each poster,
 * because words baked into an image are invisible to search and to a screen
 * reader.
 *
 * The fourth card is the "more partnerships coming" creative, with the
 * countries listed as text. It names PLACES, never institutions: a university
 * that has no announcement on file is never named on this site.
 *
 * MOTION: on first view the cards are dealt from a stacked deck into the row;
 * on hover each tilts toward the pointer with a light sweep across it. Under
 * reduced motion they simply sit in the row.
 */

export function PartnerPosters() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -20% 0px" });
  const reduce = useReduced();
  const cards = [...partners.map((p) => ({ kind: "partner" as const, p })), { kind: "horizon" as const }];

  return (
    <div ref={ref} className="mt-12">
      <div className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-6 sm:mx-0 sm:px-0 lg:grid lg:grid-cols-4 lg:overflow-visible">
        {cards.map((c, i) => {
          // Deal from a deck stacked at the row's centre.
          const fromX = (1.5 - i) * 105;
          return (
            <motion.div
              key={c.kind === "partner" ? c.p.slug : "horizon"}
              className="w-[72vw] max-w-[300px] shrink-0 snap-center lg:w-auto lg:max-w-none"
              initial={reduce ? false : { x: `${fromX}%`, y: 60, rotate: (i - 1.5) * -6, opacity: 0 }}
              animate={inView || reduce ? { x: "0%", y: 0, rotate: 0, opacity: 1 } : undefined}
              transition={{ delay: 0.15 + i * 0.12, type: "spring", stiffness: 90, damping: 16 }}
            >
              {c.kind === "partner" ? <PartnerCard p={c.p} /> : <HorizonCard />}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function Tilt({ children }: { children: React.ReactNode }) {
  const reduce = useReduced();
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [8, -8]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(mx, [0, 1], [-10, 10]), { stiffness: 200, damping: 20 });
  const shine = useTransform(mx, [0, 1], ["-60%", "160%"]);

  return (
    <div
      style={{ perspective: 900 }}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width);
        my.set((e.clientY - r.top) / r.height);
      }}
      onPointerLeave={() => {
        mx.set(0.5);
        my.set(0.5);
      }}
    >
      <motion.div style={reduce ? undefined : { rotateX: rx, rotateY: ry }} className="group relative">
        {children}
        <motion.span
          aria-hidden
          data-stack
          style={{ left: shine }}
          className="pointer-events-none absolute inset-y-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
      </motion.div>
    </div>
  );
}

function PartnerCard({ p }: { p: Partner }) {
  return (
    <article>
      <Tilt>
        <div className="relative aspect-[4/5] overflow-hidden rounded-[18px] shadow-[0_40px_70px_-30px_rgba(0,0,0,0.9)] ring-1 ring-white/10">
          <Image src={p.poster} alt={p.posterAlt} fill sizes="(min-width: 1024px) 25vw, 72vw" className="object-cover" />
        </div>
      </Tilt>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-[family-name:var(--font-grotesk)] text-[1.15rem] font-semibold leading-tight">{p.name}</h3>
          <p className="mt-1 text-[0.9rem] text-[var(--bp-muted)]">
            {p.city}, {p.country}
          </p>
        </div>
        <span className="bp-mono mt-1 shrink-0 rounded-full border border-[var(--color-runway)]/50 px-2.5 py-1 text-[var(--color-runway)]">
          Partner
        </span>
      </div>
      <p className="mt-2 text-[0.9rem] leading-relaxed text-[var(--bp-muted)]">{p.highlights.slice(0, 2).join(" · ")}</p>
    </article>
  );
}

function HorizonCard() {
  return (
    <article>
      <Tilt>
        <div className="relative aspect-[4/5] overflow-hidden rounded-[18px] shadow-[0_40px_70px_-30px_rgba(0,0,0,0.9)] ring-1 ring-white/10">
          <Image src={horizonPoster} alt={horizonPosterAlt} fill sizes="(min-width: 1024px) 25vw, 72vw" className="object-cover" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#070B1A] via-[#070B1A]/85 to-transparent p-4 pt-16">
            <p className="bp-mono flex items-center gap-2 text-[var(--color-runway)]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--color-runway)] motion-reduce:animate-none" />
              Signing now
            </p>
          </div>
        </div>
      </Tilt>
      <div className="mt-4">
        <h3 className="font-[family-name:var(--font-grotesk)] text-[1.15rem] font-semibold leading-tight">More partners coming</h3>
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {partnerHorizon.map((c) => (
            <li key={c} className="rounded-full bg-[var(--bp-chip)] px-2.5 py-1 text-[0.8rem] text-[var(--bp-fg)]">
              {c}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
