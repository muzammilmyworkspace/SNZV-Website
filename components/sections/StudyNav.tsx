"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * STUDY ABROAD SUB-NAVIGATION
 * ---------------------------------------------------------------------------
 * An in-page rail for one long page — deliberately NOT a second site header.
 * It carries no external destinations, only anchors within /study-abroad, so
 * it can never compete with the global nav for the same job.
 *
 * Three things here are less obvious than they look:
 *
 * 1. STICK POSITION. The global header is `position: fixed` and collapses from
 *    92px to 64px once you scroll. This bar only ever appears after the hero
 *    has passed, by which point the header is always in its 64px state, so
 *    `top-16` is correct rather than merely close.
 *
 * 2. SCROLL SPY OFFSET. IntersectionObserver reports against the viewport, not
 *    against "the area a reader can actually see". Both bars occupy the top
 *    ~7.5rem, so the root margin pulls the detection band down past them.
 *    Without that, a section highlights while still hidden behind the chrome.
 *
 * 3. WHY NOT `whileInView`. Sections here are full viewport-height bands; more
 *    than one is on screen at a time. The spy therefore picks the entry
 *    closest to the top of the readable area rather than "the first one that
 *    intersects", which would flicker between neighbours on fast scrolls.
 */

export type StudySection = { id: string; label: string };

export const STUDY_SECTIONS: StudySection[] = [
  { id: "overview", label: "Overview" },
  { id: "destinations", label: "Destinations" },
  { id: "universities", label: "Universities" },
  { id: "programmes", label: "Programmes" },
  { id: "scholarships", label: "Scholarships" },
  { id: "journey", label: "How it works" },
  { id: "support", label: "Student support" },
  { id: "faqs", label: "FAQs" },
];

export function StudyNav() {
  const [active, setActive] = useState<string>(STUDY_SECTIONS[0].id);
  const [stuck, setStuck] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  /* Scroll spy ----------------------------------------------------------- */
  useEffect(() => {
    const nodes = STUDY_SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (n): n is HTMLElement => n !== null
    );
    if (!nodes.length) return;

    const pick = () => {
      /**
       * Top of the area a reader can actually see, below both fixed bars.
       *
       * This MUST sit at or below where an anchor jump actually lands, which
       * is `scroll-padding-top` (90px) + `.anchor-target`'s `scroll-margin-top`
       * (52px) = 142px. At 128 the freshly-clicked section was still 14px
       * below the line, so clicking "Programmes" highlighted "Universities" —
       * the tab you pressed was never the tab that lit up. 150 clears the
       * landing position with a few pixels of slack for sub-pixel rounding.
       */
      const readableTop = 150;
      let current = nodes[0];
      for (const node of nodes) {
        if (node.getBoundingClientRect().top - readableTop <= 0) current = node;
      }
      // Bottom of the page can't scroll far enough to reach the last section's
      // trigger point, so pin to it once we're within a viewport of the end.
      const atEnd =
        window.innerHeight + window.scrollY >= document.body.scrollHeight - 120;
      setActive(atEnd ? nodes[nodes.length - 1].id : current.id);
    };

    pick();
    window.addEventListener("scroll", pick, { passive: true });
    window.addEventListener("resize", pick);
    return () => {
      window.removeEventListener("scroll", pick);
      window.removeEventListener("resize", pick);
    };
  }, []);

  /* Show the bar only once the hero is behind us -------------------------- */
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setStuck(!entry.isIntersecting),
      { rootMargin: "-72px 0px 0px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* Keep the active tab visible on mobile --------------------------------- */
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const tab = list.querySelector<HTMLElement>(`[data-tab="${active}"]`);
    if (!tab) return;
    // Only nudge the rail itself; `scrollIntoView` would also scroll the page.
    const target = tab.offsetLeft - list.clientWidth / 2 + tab.clientWidth / 2;
    list.scrollTo({
      left: Math.max(0, target),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  }, [active]);

  return (
    <>
      <div ref={sentinelRef} aria-hidden className="h-px w-full" />

      <nav
        aria-label="Study Abroad sections"
        className={cn(
          "sticky top-16 z-40 tone-deep border-y border-line transition-colors duration-500",
          stuck ? "bg-surface/90 backdrop-blur-xl" : "bg-surface"
        )}
      >
        <ul
          ref={listRef}
          className="no-scrollbar mx-auto flex max-w-[1360px] gap-1 overflow-x-auto px-3 sm:px-6 lg:px-10"
        >
          {STUDY_SECTIONS.map((s) => {
            const isActive = active === s.id;
            return (
              <li key={s.id} className="shrink-0">
                <a
                  href={`#${s.id}`}
                  data-tab={s.id}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "label relative block whitespace-nowrap px-3 py-4 transition-colors duration-300",
                    isActive ? "text-fg" : "text-faint hover:text-fg"
                  )}
                >
                  {s.label}
                  <span
                    aria-hidden
                    className={cn(
                      "grad-rule absolute inset-x-3 bottom-0 h-px origin-left transition-transform duration-500 ease-[var(--ease-out-expo)]",
                      isActive ? "scale-x-100" : "scale-x-0"
                    )}
                  />
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
