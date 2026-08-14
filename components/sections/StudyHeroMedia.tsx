"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

/**
 * Study Abroad hero plate.
 *
 * Two movements, both slow enough to register as atmosphere rather than as an
 * effect:
 *
 *   • a 26s Ken Burns drift — the frame eases between two slightly different
 *     scales and offsets, so the image is never quite still;
 *   • a scroll-linked parallax that lets the plate fall away more slowly than
 *     the type above it.
 *
 * Both are cut under `prefers-reduced-motion`, which leaves a plain static
 * image — the reason this is a separate client component rather than motion
 * bolted onto the server-rendered hero.
 *
 * The image is `priority`: it is the LCP element on this route, and lazy
 * loading it would trade a real Core Web Vitals score for nothing.
 */
export function StudyHeroMedia() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Travels slower than the page, so the type appears to lift off the plate.
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const fade = useTransform(scrollYProgress, [0, 1], [1, 0.55]);

  return (
    <div ref={ref} className="absolute inset-0 -z-10 overflow-hidden">
      <motion.div
        className="absolute inset-0"
        style={reduced ? undefined : { y, opacity: fade }}
      >
        <motion.div
          className="absolute inset-0"
          initial={reduced ? undefined : { scale: 1.08, x: "-1.2%", y: "-0.8%" }}
          animate={
            reduced
              ? undefined
              : {
                  scale: [1.08, 1.16, 1.08],
                  x: ["-1.2%", "1.2%", "-1.2%"],
                  y: ["-0.8%", "0.8%", "-0.8%"],
                }
          }
          transition={
            reduced
              ? undefined
              : { duration: 26, ease: "easeInOut", repeat: Infinity }
          }
        >
          <Image
            src="/images/study-campus.webp"
            alt="Kazimierz Palace, the historic main building of the University of Warsaw, Poland"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
