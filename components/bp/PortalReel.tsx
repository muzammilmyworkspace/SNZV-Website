"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { portalShots } from "@/data/portal";
import { cn } from "@/lib/utils";
import { useReduced } from "@/components/bp/useReduced";

/**
 * THE PORTAL REEL — a fast, cut-together tour of the real portal.
 *
 * Built from the screenshots rather than a video file: sharper at every size,
 * a fraction of the weight, and nothing to caption. Each cut is a crossfade
 * with a slow push-in, a cursor that travels to the thing that matters on that
 * screen, and a status chip that changes as the "application" progresses.
 *
 * The screenshots are of the real portal photographed against a database of
 * invented people (see data/portal.ts) — no client data, ever.
 *
 * It only runs while on screen (`active`), and under reduced motion it holds
 * on the dashboard.
 */

const BEATS: { cursor: [number, number]; zoom: [number, number]; status: string }[] = [
  { cursor: [38, 52], zoom: [0, 0], status: "Next step: upload" },
  { cursor: [30, 70], zoom: [-4, -6], status: "Stage 3 of 5" },
  { cursor: [70, 40], zoom: [-6, -2], status: "Document approved" },
  { cursor: [55, 62], zoom: [-2, -6], status: "Application saved" },
];

export function PortalReel({
  className,
  interval = 2600,
  active = true,
  chrome = "laptop",
}: {
  className?: string;
  interval?: number;
  active?: boolean;
  chrome?: "laptop" | "bare";
}) {
  const reduce = useReduced();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduce || !active) return;
    const t = window.setInterval(() => setI((n) => (n + 1) % portalShots.length), interval);
    return () => window.clearInterval(t);
  }, [reduce, active, interval]);

  const shot = portalShots[i];
  const beat = BEATS[i % BEATS.length];

  const screen = (
    <div className="relative aspect-[16/11] overflow-hidden bg-[#EEF2F8]">
      <AnimatePresence initial={false}>
        <motion.div
          key={shot.key}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1.0, x: `${beat.zoom[0] / 2}%`, y: `${beat.zoom[1] / 2}%` }}
          exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 0.45 }, default: { duration: interval / 1000, ease: "linear" } }}
        >
          <Image
            src={shot.file}
            alt={shot.alt}
            fill
            sizes="(min-width: 1024px) 560px, 90vw"
            className="object-cover object-left-top"
            priority={i === 0}
          />
        </motion.div>
      </AnimatePresence>

      {/* The cursor — travels to the point of each screen. */}
      {!reduce && (
        <motion.div
          aria-hidden
          className="absolute z-10"
          animate={{ left: `${beat.cursor[0]}%`, top: `${beat.cursor[1]}%` }}
          transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
        >
          <svg viewBox="0 0 20 20" className="h-5 w-5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
            <path d="M3 2l13 7-6 1.5L7.5 17z" fill="#0B1020" stroke="#fff" strokeWidth="1.2" strokeLinejoin="round" />
          </svg>
          <motion.span
            key={i}
            className="absolute -left-2 -top-2 h-9 w-9 rounded-full border-2 border-[var(--color-runway)]"
            initial={{ scale: 0.2, opacity: 0 }}
            animate={{ scale: [0.2, 1, 1.4], opacity: [0, 0.9, 0] }}
            transition={{ delay: 0.95, duration: 0.7 }}
          />
        </motion.div>
      )}

      {/* Status chip */}
      <div className="absolute bottom-3 left-3 z-10">
        <AnimatePresence mode="wait">
          <motion.span
            key={beat.status}
            className="flex items-center gap-2 rounded-full bg-[#0B1020]/90 px-3 py-1.5 text-[0.72rem] font-semibold text-white backdrop-blur"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-runway)]" />
            {beat.status}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Progress ticks — which cut of the reel this is. */}
      <div aria-hidden className="absolute right-3 top-3 z-10 flex gap-1">
        {portalShots.map((s, n) => (
          <span
            key={s.key}
            className={cn("h-1 rounded-full transition-all duration-500", n === i ? "w-5 bg-[#0B1020]" : "w-1.5 bg-[#0B1020]/30")}
          />
        ))}
      </div>
    </div>
  );

  if (chrome === "bare") return <div className={className}>{screen}</div>;

  return (
    <div className={className}>
      <div className="rounded-[14px] border border-white/10 bg-gradient-to-b from-[#2A3350] to-[#161C30] p-[2.5%] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)]">
        <div className="mb-[1.5%] flex items-center gap-1.5 px-1">
          <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
          <span className="ml-2 truncate font-mono text-[0.72rem] text-white/60">portal.snzventures.com</span>
        </div>
        <div className="overflow-hidden rounded-[6px]">{screen}</div>
      </div>
      <div className="mx-auto h-2.5 w-[106%] -translate-x-[2.8%] rounded-b-[10px] bg-gradient-to-b from-[#3A4466] to-[#1A2038]" />
    </div>
  );
}
