"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "motion/react";

/**
 * HERO SLIDESHOW
 * ---------------------------------------------------------------------------
 * The plate behind a hero, cycling up to four images.
 *
 * Three movements, all slow enough to read as atmosphere rather than effect:
 *
 *   • a crossfade between frames every 7s;
 *   • a Ken Burns drift on whichever frame is showing, so it is never still;
 *   • a scroll-linked parallax, so the plate falls away slower than the type.
 *
 * Decisions worth keeping:
 *
 * FOUR IMAGES, HARD CAP. Every frame beyond the first is a full-size image
 * download for a hero most visitors scroll past in seconds. The cap is enforced
 * here rather than trusted to call sites.
 *
 * ONLY THE FIRST IS `priority`. It is the LCP element. The rest are lazy and
 * are not fetched until the cycle needs them, so the slideshow costs nothing
 * on first paint.
 *
 * REDUCED MOTION STOPS EVERYTHING. No cycle, no drift, no parallax — just the
 * first image, static. A slideshow is exactly the kind of unrequested movement
 * that setting exists to prevent.
 */

export type HeroImage = { src: string; alt: string };

const MAX_FRAMES = 4;
const HOLD_MS = 7_000;

export function HeroSlideshow({
  images,
  className,
}: {
  images: HeroImage[];
  className?: string;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const frames = images.slice(0, MAX_FRAMES);
  const [index, setIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const fade = useTransform(scrollYProgress, [0, 1], [1, 0.55]);

  useEffect(() => {
    if (reduced || frames.length < 2) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % frames.length),
      HOLD_MS
    );
    return () => window.clearInterval(id);
  }, [reduced, frames.length]);

  const current = frames[index] ?? frames[0];
  if (!current) return null;

  return (
    <div ref={ref} className={className ?? "absolute inset-0 -z-10 overflow-hidden"}>
      <motion.div
        className="absolute inset-0"
        style={reduced ? undefined : { y, opacity: fade }}
      >
        <AnimatePresence initial={false}>
          <motion.div
            key={current.src}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 1.4, ease: "easeInOut" }}
          >
            <motion.div
              className="absolute inset-0"
              initial={reduced ? undefined : { scale: 1.06, x: "-1%", y: "-0.6%" }}
              animate={
                reduced
                  ? undefined
                  : { scale: 1.14, x: "1%", y: "0.6%" }
              }
              transition={
                reduced ? undefined : { duration: 12, ease: "easeInOut" }
              }
            >
              <Image
                src={current.src}
                alt={current.alt}
                fill
                // Only the first frame is the LCP candidate.
                priority={index === 0}
                loading={index === 0 ? undefined : "lazy"}
                sizes="100vw"
                className="object-cover"
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/*
        Frame indicator. Also the accessible summary of what is happening —
        without it a screen reader hears a hero image silently swap identity.
      */}
      {frames.length > 1 && !reduced && (
        <div
          className="pointer-events-none absolute bottom-6 right-6 z-[4] hidden gap-1.5 sm:flex"
          role="status"
          aria-live="off"
          aria-label={`Image ${index + 1} of ${frames.length}`}
        >
          {frames.map((f, i) => (
            <span
              key={f.src}
              aria-hidden
              className={
                "block h-0.5 w-6 rounded-full transition-colors duration-500 " +
                (i === index ? "bg-white/80" : "bg-white/25")
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
