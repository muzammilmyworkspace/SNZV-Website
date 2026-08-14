"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, Fragment } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { Shell, Chapter, MaskedLines, Reveal } from "@/components/ui/Editorial";
import { pathways } from "@/data/pathways";
import { analytics } from "@/lib/analytics";
import { cn } from "@/lib/utils";

/**
 * CHAPTER 01 — THE DREAM.
 *
 * An interactive index rather than three cards: the three pathways are set as
 * oversized display type, and hovering one brings its plate up behind the list.
 * On touch the plates stack as a scrolling filmstrip instead.
 */
export function Dream() {
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const plateY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <section
      id="dream"
      ref={ref}
      className="relative overflow-hidden tone-deep py-16 md:py-20"
    >
      <div aria-hidden className="graticule pointer-events-none absolute inset-0 opacity-50" />
      <div
        aria-hidden
        className="bloom-royal pointer-events-none absolute -left-56 top-1/4 h-[34rem] w-[34rem] opacity-40"
      />

      <Shell className="relative">
        <Chapter index="01" label="The dream" className="mb-10" />

        <div className="grid gap-12 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
          <MaskedLines
            as="h2"
            className="d-1 max-w-[15ch] text-fg"
            lines={[
              "Some opportunities",
              <Fragment key="crossing">
                are worth <span className="d-em">crossing</span>
              </Fragment>,
              "borders for.",
            ]}
          />
          <Reveal delay={0.2}>
            <p className="max-w-sm text-[0.95rem] leading-relaxed text-muted">
              Three routes out. They look different from the outside, but the
              question underneath is the same one: is the life you want
              available where you are?
            </p>
          </Reveal>
        </div>

        {/* Interactive index */}
        {/*
          `items-stretch`, not `items-center`.

          The plate used to be a fixed 4:3 box centred against a list whose
          height changes as entries expand, so the image floated with unequal
          gaps above and below it. Stretching ties the plate's height to the
          list beside it — the images now start and finish level with the
          content they belong to.
        */}
        <div className="mt-16 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch lg:gap-16">
          <ul className="rule border-t">
            {pathways.map((p, i) => (
              <li key={p.key} className="border-b border-line">
                <Link
                  href={p.href}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => analytics.pathwaySelect(p.key, "dream_index")}
                  className="group flex items-start gap-6 py-7 md:items-center md:py-9"
                >
                  <span className="label num mt-2 shrink-0 text-accent/70 md:mt-0">
                    0{i + 1}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span
                      className={cn(
                        "block font-display text-[2rem] leading-[0.98] tracking-[-0.024em] transition-colors duration-500 sm:text-[2.9rem]",
                        active === i
                          ? "text-fg"
                          : "text-muted group-hover:text-fg"
                      )}
                    >
                      {p.title}
                    </span>
                    <motion.span
                      initial={false}
                      animate={{
                        height: active === i ? "auto" : 0,
                        opacity: active === i ? 1 : 0,
                      }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="block overflow-hidden"
                    >
                      <span className="mt-2.5 block max-w-md text-[0.9rem] leading-relaxed text-muted">
                        {p.hook}
                      </span>
                    </motion.span>

                    {/* mobile plate */}
                    <span className="mt-4 block overflow-hidden lg:hidden">
                      <span className="plate relative block aspect-[16/9]">
                        <Image
                          src={p.image}
                          alt={p.imageAlt}
                          fill
                          sizes="100vw"
                          loading="lazy"
                          className="object-cover"
                        />
                      </span>
                    </span>
                  </span>

                  <svg
                    viewBox="0 0 12 12"
                    fill="none"
                    aria-hidden
                    className={cn(
                      "h-4 w-4 shrink-0 transition-all duration-500 ease-[var(--ease-out-expo)]",
                      active === i
                        ? "translate-x-0 text-accent opacity-100"
                        : "-translate-x-2 text-faint opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                    )}
                  >
                    <path d="M1 6h9M6.5 2.5L10 6l-3.5 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>

          {/* desktop plate stack */}
          <motion.div
            style={reduced ? undefined : { y: plateY }}
            className="relative hidden min-h-[24rem] lg:block"
          >
            {pathways.map((p, i) => (
              <motion.div
                key={p.key}
                initial={false}
                animate={{
                  opacity: active === i ? 1 : 0,
                  scale: active === i ? 1 : 1.05,
                }}
                transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                data-stack
                className="plate absolute inset-0"
              >
                <Image
                  src={p.image}
                  alt={p.imageAlt}
                  fill
                  sizes="45vw"
                  loading="lazy"
                  className="object-cover"
                />
                <span className="absolute bottom-5 left-5 z-[3] label text-muted">
                  {p.eyebrow}
                </span>
              </motion.div>
            ))}
            {/* corner ticks — atlas framing */}
            <span aria-hidden className="absolute -left-px -top-px z-[3] h-5 w-5 border-l border-t border-moss-400/60" />
            <span aria-hidden className="absolute -bottom-px -right-px z-[3] h-5 w-5 border-b border-r border-moss-400/60" />
          </motion.div>
        </div>
      </Shell>
    </section>
  );
}
