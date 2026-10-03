"use client";

import { useRef, Fragment } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useSafeReducedMotion } from "@/lib/use-safe-reduced-motion";
import { Shell, Chapter, MaskedLines, Reveal, Action } from "@/components/ui/Editorial";
import { cn } from "@/lib/utils";
import { analytics } from "@/lib/analytics";

/**
 * CHAPTER 03 — THE PAIN.
 *
 * The doubts people actually carry, set as overheard questions that drift
 * across the panel at different depths. Answering them with a single line
 * ("That's where SnZ Ventures comes in") is the turn in the narrative.
 */

/*
 * THE STAGGER IS NOW A DRIFT, NOT A SCATTER.
 *
 * The indents ran 6%–48%, which spread nine quotes across half the viewport
 * with no common left edge. The intent — overheard voices at different depths
 * — survives a much smaller range; what it does not survive is a reader having
 * to hunt for where each line begins. A usability audit flagged it as the one
 * Major density problem on the page, and re-reading it cold, it was right.
 *
 * The band is now 0%–18% and every group of three opens flush left, so the eye
 * has an anchor to return to on each persona while the lines still breathe.
 * The personas were already grouped three-by-three in source order; at the old
 * amplitude that grouping was invisible.
 */
const VOICES: { q: string; who: string; x: string; delay: number }[] = [
  { q: "Where do I even start?", who: "Student", x: "0%", delay: 0 },
  { q: "Which opportunity is actually right for me?", who: "Student", x: "10%", delay: 0.1 },
  { q: "Can I find funding?", who: "Student", x: "5%", delay: 0.2 },
  { q: "Where are the genuine opportunities?", who: "Professional", x: "0%", delay: 0.15 },
  { q: "Am I even eligible?", who: "Professional", x: "12%", delay: 0.25 },
  { q: "How do I position myself?", who: "Professional", x: "6%", delay: 0.3 },
  { q: "Which market?", who: "Founder", x: "0%", delay: 0.2 },
  { q: "How do I establish there?", who: "Founder", x: "14%", delay: 0.35 },
  { q: "Who can I actually trust to tell me?", who: "Founder", x: "7%", delay: 0.4 },
];

export function Pain() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useSafeReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const drift = useTransform(scrollYProgress, [0, 1], ["4%", "-4%"]);

  return (
    <section
      id="pain"
      ref={ref}
      className="grain relative overflow-hidden tone-deep py-16 md:py-20"
    >
      <div
        aria-hidden
        className="hatch mask-radial pointer-events-none absolute inset-0 opacity-[0.35]"
      />
      <div
        aria-hidden
        className="bloom-royal pointer-events-none absolute right-[-18%] top-1/3 h-[38rem] w-[38rem] opacity-40"
      />

      <Shell className="relative">
        <Chapter index="03" label="The reality" className="mb-10" />

        <MaskedLines
          as="h2"
          className="d-1 max-w-[16ch] text-fg"
          lines={[
            "Going Global Is Exciting.",
            <Fragment key="Isnt">
              The Process <span className="d-em">Isn&rsquo;t</span> Always.
            </Fragment>,
          ]}
        />

        {/* Voices */}
        <motion.ul
          style={reduced ? undefined : { y: drift }}
          className="mt-14 space-y-1"
        >
          {VOICES.map((v, i) => (
            <motion.li
              key={v.q}
              initial={{ opacity: 0, x: reduced ? 0 : -18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "320px 0px -5% 0px" }}
              transition={{
                duration: 0.85,
                delay: v.delay,
                ease: [0.16, 1, 0.3, 1],
              }}
              /*
                THE STAGGER IS A DESKTOP IDEA, and it was being applied at every
                width. `min(x, 42vw)` is 157px of indent on a 375px phone, which
                left roughly 170px for a non-shrinking label AND a question like
                "Which opportunity is actually right for me?" at 1.35rem. It did
                not overflow — which is why the mobile audit passed it — it just
                collapsed into an unreadable ragged column.

                The indent now starts at `md`, and below that the speaker sits
                above the question instead of fighting it for the same line.
              */
              className={cn(
                "group flex flex-col gap-1 py-2 md:flex-row md:items-baseline md:gap-4 md:py-1.5 md:[padding-left:min(var(--indent),18vw)]",
                // A little air where the speaker changes, so three groups of
                // three read as three groups rather than as nine loose lines.
                i > 0 && VOICES[i - 1].who !== v.who && "mt-6 md:mt-7"
              )}
              style={{ "--indent": v.x } as React.CSSProperties}
            >
              <span className="label text-faint transition-colors group-hover:text-accent md:shrink-0">
                {v.who}
              </span>
              <span className="font-display text-[1.15rem] leading-snug tracking-[-0.015em] text-muted transition-colors duration-500 group-hover:text-fg sm:text-[1.4rem] md:text-[1.75rem]">
                &ldquo;{v.q}&rdquo;
              </span>
            </motion.li>
          ))}
        </motion.ul>

        {/* The turn */}
        <Reveal delay={0.15} className="mt-16">
          <div className="rule flex flex-col gap-6 border-t pt-10 md:flex-row md:items-end md:gap-14">
            <p className="d-3 max-w-[20ch] text-fg">
              That&rsquo;s the part we do.
            </p>
            <div className="max-w-md">
              <p className="text-[0.95rem] leading-relaxed text-muted">
                Not the excitement — you already have that. The sequencing, the
                eligibility, the paperwork, and the honest answer about whether
                your plan holds up.
              </p>
              <div className="mt-6">
                <Action
                  href="#method"
                  variant="line"
                  onClick={() => analytics.ctaClick("See how we help", "pain")}
                >
                  See how we work
                </Action>
              </div>
            </div>
          </div>
        </Reveal>
      </Shell>
    </section>
  );
}
