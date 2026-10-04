"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useScroll, useTransform } from "motion/react";
import { portalShots, portalPoints } from "@/data/portal";
import { company } from "@/data/company";
import { analytics } from "@/lib/analytics";
import { Arrow } from "./Glyphs";
import { cn } from "@/lib/utils";
import { useReduced } from "@/components/bp/useReduced";
import { Reveal } from "./Reveal";

/**
 * THE PORTAL — "Every step, live, in your pocket."
 *
 * The reason SnZ is different, shown rather than claimed. Four beats down the
 * left (data/portal.ts → portalPoints, each one visible in a real screen); on
 * the right a device that tilts from a lean to flat as the section arrives,
 * and swaps to the screen for whichever beat is in the middle of the viewport.
 *
 * Screens are the real portal photographed against invented people — never
 * client data (see data/portal.ts).
 *
 * THE WALKTHROUGH VIDEO is not rendered here while `portalVideo.src` is null.
 * The rest of the site shows a marked placeholder for missing video; on the
 * homepage the reel and the screens already do that job, and a "video
 * required" box in the centrepiece section would be the first thing a visitor
 * reads. It is listed in CONTENT-HANDOFF.md.
 */

// Pair each point with the screen that proves it.
const PAIRS = portalPoints.map((pt, i) => ({ ...pt, shot: portalShots[i % portalShots.length] }));

export function PortalSection() {
  const reduce = useReduced();
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start start"] });
  const tilt = useTransform(scrollYProgress, [0, 1], [24, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.88, 1]);

  return (
    <section ref={ref} id="portal" aria-labelledby="portal-title" className="relative z-10 pb-10 pt-2 sm:pb-14 sm:pt-4">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div className="max-w-4xl">
          <p className="bp-eyebrow">The SnZ student portal</p>
          <Reveal mask>
            <h2 id="portal-title" className="bp-display bp-h2 mt-5">
            Every step, <span className="bp-mark">live,</span> in your pocket.
          </h2>
            </Reveal>
          <p className="bp-lede mt-6">
            The moment you become our student, you get your own login. The same file your consultant works from: 
            what is done, what is missing, and what happens next.
          </p>
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
          <ol className="order-2 lg:order-1">
            {PAIRS.map((pt, i) => (
              <Beat key={pt.title} i={i} active={active === i} onEnter={setActive} title={pt.title} body={pt.body} />
            ))}
            <li className="flex flex-wrap gap-3 pt-10">
              <a
                href={company.portalUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => analytics.ctaClick("Portal login", "portal-section")}
                className="bp-btn bp-btn-primary"
              >
                Log in to your portal <Arrow />
              </a>
              <Link href="/contact#journey" className="bp-btn bp-btn-ghost">
                Ask how it works
              </Link>
            </li>
          </ol>

          <div className="order-1 lg:order-2">
            <div className="lg:sticky lg:top-28" style={{ perspective: 1400 }}>
              <motion.div
                style={reduce ? undefined : { rotateX: tilt, scale, transformOrigin: "50% 100%" }}
                className="relative rounded-[22px] border border-white/10 bg-gradient-to-b from-[#2A3350] to-[#121830] p-2.5 shadow-[0_60px_120px_-40px_rgba(0,0,0,0.95)]"
              >
                <div className="relative aspect-[16/11] overflow-hidden rounded-[14px] bg-[#EEF2F8]">
                  <AnimatePresence initial={false}>
                    <motion.div
                      key={PAIRS[active].shot.key}
                      className="absolute inset-0"
                      initial={{ opacity: 0, scale: 1.04 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <Image
                        src={PAIRS[active].shot.file}
                        alt={PAIRS[active].shot.alt}
                        fill
                        sizes="(min-width: 1024px) 720px, 92vw"
                        className="object-cover object-left-top"
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
                {/* Tabs mirror the beats — also a way to switch on mobile, where the list is below. */}
                <div className="mt-2.5 flex flex-wrap gap-1.5 px-1 pb-0.5">
                  {PAIRS.map((pt, i) => (
                    <button
                      key={pt.shot.key}
                      type="button"
                      onClick={() => setActive(i)}
                      aria-pressed={active === i}
                      className={cn(
                        "min-h-11 rounded-full px-4 text-[0.8rem] font-semibold transition-colors",
                        active === i ? "bg-[var(--color-runway)] text-[var(--bp-on-accent)]" : "bg-[var(--bp-chip)] text-[var(--bp-muted)] hover:text-[var(--bp-strong)]"
                      )}
                    >
                      {pt.shot.tab}
                    </button>
                  ))}
                </div>
              </motion.div>
              <p className="mt-4 text-[0.85rem] text-[var(--bp-faint)]">{PAIRS[active].shot.caption}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Beat({ i, active, onEnter, title, body }: { i: number; active: boolean; onEnter: (i: number) => void; title: string; body: string }) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" });
  useEffect(() => {
    if (inView) onEnter(i);
  }, [inView, onEnter, i]);
  return (
    <li ref={ref} className="relative border-t border-[var(--bp-line)] py-6 pl-14 lg:py-8">
      <span
        className={cn(
          "absolute left-0 top-8 grid h-9 w-9 place-items-center rounded-full border font-mono text-[0.8rem] transition-all duration-500 lg:top-12",
          active ? "border-[var(--color-runway)] bg-[var(--color-runway)] text-[var(--bp-on-accent)]" : "border-[var(--bp-line-strong)] text-[var(--bp-faint)]"
        )}
      >
        0{i + 1}
      </span>
      <h3 className={cn("bp-display text-[1.6rem] leading-tight transition-colors duration-500 sm:text-[1.9rem]", active ? "text-[var(--bp-strong)]" : "text-[var(--bp-muted)]")}>
        {title}
      </h3>
      <p className="bp-body mt-3 max-w-md">{body}</p>
    </li>
  );
}
