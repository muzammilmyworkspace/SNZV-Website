"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { EASE } from "@/lib/utils";
import { Stamp } from "./Stamp";
import { SkyLines, Waves } from "./SkyLines";

export type ArchImage = { src: string; alt: string };

const HOLD_MS = 5_000;

/**
 * INNER-PAGE HERO (October 2026), in the homepage's Horizon language.
 *
 * Copy on the left; on the right a tall arch of photographs that opens upward
 * on load, crossfades through the page's frames and drifts slower than the
 * page on scroll, a round second photograph, a floating chip and the turning
 * stamp. Replaces the full-bleed MERIDIAN plate (PageParts `PageHero`,
 * Study `StudyHero`), so text never sits on a photograph.
 */
export function ArchHero({
  top,
  title,
  children,
  images,
  chip,
}: {
  /** Breadcrumbs and eyebrow. */
  top: ReactNode;
  title: ReactNode;
  /** Lead, buttons and anything else under the headline. */
  children?: ReactNode;
  images: ArchImage[];
  chip?: { title: string; body: string; icon?: ReactNode };
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yMain = useTransform(scrollYProgress, [0, 1], ["0%", reduced ? "0%" : "14%"]);
  const ySide = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -70]);

  const frames = images.slice(0, 4);
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduced || frames.length < 2) return;
    const t = setInterval(() => setI((n) => (n + 1) % frames.length), HOLD_MS);
    return () => clearInterval(t);
  }, [reduced, frames.length]);
  const side = frames.length > 1 ? frames[(i + 1) % frames.length] : null;

  return (
    <section ref={ref} className="sk-hero tone-deep">
      <div aria-hidden className="sk-dots" />
      <SkyLines />
      <Waves />
      <div className="relative mx-auto grid w-full max-w-[1320px] items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14 lg:px-10">
        <div className="relative z-10">
          {top}
          <div className="mt-6">{title}</div>
          {children}
        </div>

        <div className="sk-art">
          <motion.div
            className="sk-arch sk-arch-main"
            initial={{ clipPath: reduced ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            transition={{ duration: reduced ? 0 : 1.3, ease: EASE, delay: 0.15 }}
          >
            <motion.div className="sk-arch-inner" style={{ y: yMain }}>
              <AnimatePresence initial={false}>
                {frames.length > 0 && (
                  <motion.div
                    key={frames[i].src}
                    className="absolute inset-0"
                    initial={{ opacity: 0, scale: 1.08 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ opacity: { duration: 1.1 }, scale: { duration: 6, ease: "linear" } }}
                  >
                    <Image
                      src={frames[i].src}
                      alt={frames[i].alt}
                      fill
                      priority={i === 0}
                      sizes="(min-width:1024px) 34vw, 72vw"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>

          {side && (
            <motion.div
              className="sk-arch sk-arch-side"
              style={{ y: ySide }}
              initial={{ scale: reduced ? 1 : 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: reduced ? 0 : 0.9, ease: EASE, delay: 0.7 }}
            >
              <AnimatePresence initial={false}>
                <motion.div
                  key={side.src}
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.1 }}
                >
                  <Image src={side.src} alt="" fill sizes="(min-width:1024px) 18vw, 40vw" />
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}

          {chip && (
            <motion.div
              className="sk-hero-chip"
              initial={{ opacity: 0, y: reduced ? 0 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.95 }}
            >
              <span className="sk-float flex items-center gap-3">
                <span className="sk-chip-icon">{chip.icon ?? <Spark />}</span>
                <span>
                  <b>{chip.title}</b>
                  {chip.body}
                </span>
              </span>
            </motion.div>
          )}

          <motion.div
            className="sk-hero-stamp"
            initial={{ opacity: 0, rotate: reduced ? 0 : -90, scale: reduced ? 1 : 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            transition={{ duration: 1, ease: EASE, delay: 1.1 }}
          >
            <Stamp />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Spark() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6" />
    </svg>
  );
}
