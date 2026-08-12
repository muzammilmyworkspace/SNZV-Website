"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useMotionValue,
  useSpring,
} from "motion/react";
import { Shell, Action, MaskedLines } from "@/components/ui/Editorial";
import { RouteField } from "@/components/visuals/RouteField";
import { analytics } from "@/lib/analytics";
import { company } from "@/data/company";

/**
 * THE HERO.
 *
 * Four depth layers, each moving at a different rate:
 *   1. duotone aerial plate (slow parallax + slow scale)
 *   2. animated route field — real corridors, drawn as an atlas overlay
 *   3. atmospheric blooms
 *   4. type, which rises from behind masks
 *
 * The whole composition also leans a few pixels toward the cursor, which is
 * what makes it feel like a surface rather than a picture.
 */
export function HeroMeridian() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const plateY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const plateScale = useTransform(scrollYProgress, [0, 1], [1.04, 1.16]);
  const typeY = useTransform(scrollYProgress, [0, 1], ["0%", "-38%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  // Cursor lean
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const lx = useSpring(mx, { stiffness: 60, damping: 22 });
  const ly = useSpring(my, { stiffness: 60, damping: 22 });

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    if (reduced) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width - 0.5) * 22);
    my.set(((e.clientY - r.top) / r.height - 0.5) * 14);
  };

  return (
    <section
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      className="plate plate-deep grain relative flex min-h-[94svh] items-end overflow-hidden tone-deep pb-12 pt-28 md:pb-16"
    >
      {/* 1 — plate */}
      <motion.div
        className="absolute inset-0 -z-10"
        style={reduced ? undefined : { y: plateY, scale: plateScale }}
      >
        <motion.div
          className="absolute inset-[-4%]"
          style={reduced ? undefined : { x: lx, y: ly }}
        >
          <Image
            src="/images/dest-vilnius.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
      </motion.div>

      {/* 3 — atmosphere */}
      <div
        aria-hidden
        className="bloom-royal pointer-events-none absolute -right-40 -top-40 -z-10 h-[52rem] w-[52rem] opacity-70"
      />
      <div
        aria-hidden
        className="bloom-moss pointer-events-none absolute -bottom-56 left-[14%] -z-10 h-[36rem] w-[36rem] opacity-50"
      />
      <div
        aria-hidden
        className="graticule mask-radial pointer-events-none absolute inset-0 -z-10 opacity-70"
      />

      {/* 2 — corridors */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 -z-10 hidden w-[62%] items-center lg:flex"
      >
        <RouteField className="w-full opacity-[0.85]" />
      </div>

      {/* 4 — type */}
      <Shell className="relative z-10">
        <motion.div style={reduced ? undefined : { y: typeY, opacity: fade }}>
          {/* Standfirst */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="mb-8 flex flex-wrap items-center gap-x-5 gap-y-2"
          >
            <span className="label flex items-center gap-2.5 text-moss-400">
              <span className="relative flex h-1.5 w-1.5">
                <span className="breathe absolute inline-flex h-full w-full rounded-full bg-moss-400" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-moss-400" />
              </span>
              54.6872° N, 25.2797° E
            </span>
            <span aria-hidden className="hidden h-3 w-px bg-raised sm:block" />
            <span className="label text-muted">{company.positioning}</span>
          </motion.div>

          {/* Headline */}
          <MaskedLines
            as="h1"
            animate="mount"
            delay={0.28}
            className="d-hero max-w-[16ch] text-fg"
            lines={[
              <>Your ambition</>,
              <>
                has <span className="d-em">no</span> borders.
              </>,
            ]}
          />

          <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,30rem)_auto] lg:items-end lg:gap-16">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className="lede"
            >
              SnZ Ventures moves students, professionals and founders into
              Europe — education that leads to work, roles with employers we can
              name, and companies built to actually operate. From Vilnius,
              across all 27 member states.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 1, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-3"
            >
              <Action
                href="/contact#journey"
                size="lg"
                magnetic
                onClick={() => analytics.ctaClick("Start Your Journey", "hero")}
              >
                Start your journey
              </Action>
              <Action
                href="#dream"
                variant="line"
                size="lg"
                onClick={() =>
                  analytics.ctaClick("Explore Your Possibilities", "hero")
                }
              >
                Explore possibilities
              </Action>
            </motion.div>
          </div>
        </motion.div>
      </Shell>

      {/* Scroll cue */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        style={reduced ? undefined : { opacity: fade }}
        className="absolute bottom-6 right-5 z-10 hidden items-center gap-3 sm:right-8 md:flex lg:right-12"
      >
        <span className="label text-faint">Scroll</span>
        <span className="relative block h-10 w-px overflow-hidden bg-raised">
          <motion.span
            className="absolute inset-x-0 top-0 h-4 bg-moss-400"
            animate={reduced ? {} : { y: ["-100%", "260%"] }}
            transition={{ duration: 2.1, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.div>
    </section>
  );
}
