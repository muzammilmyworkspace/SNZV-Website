"use client";

import { useEffect, useRef, useState } from "react";
import { partners, partnerHorizon } from "@/data/partners";

/**
 * The partnerships, as a scroller.
 *
 * FOUR CARDS: three named institutions and the one that says more are coming.
 * That last card is part of the set rather than a note under it, because "who
 * else" is the next question somebody asks after reading three names, and the
 * answer belongs where they are already looking.
 *
 * SCROLL-SNAP, NOT A SLIDESHOW. No timer, no auto-advance, nothing moving on
 * its own — a card that slides away mid-sentence is the most reliable way to
 * make somebody stop reading. The buttons scroll by one card; the track is an
 * ordinary overflow container, so a trackpad, a touch swipe and the keyboard
 * all work without any of it being reimplemented.
 *
 * COLOUR INSTEAD OF LOGOS. A partner's mark is theirs, and reproducing one is
 * a use of their brand that belongs in a signed agreement. Each card takes the
 * institution's own colour from its crest, which distinguishes the four at a
 * glance and cannot be mistaken for their logo.
 */
export function PartnerScroller() {
  const track = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  /*
    The buttons disable at the ends rather than wrapping around. A scroller
    that jumps back to the first card hides how many there are, and with four
    the count is worth knowing.
  */
  useEffect(() => {
    const el = track.current;
    if (!el) return;

    const update = () => {
      setAtStart(el.scrollLeft < 8);
      setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 8);
    };

    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  function nudge(direction: 1 | -1) {
    const el = track.current;
    if (!el) return;
    // One card plus its gap, measured rather than assumed, so this stays
    // correct at every breakpoint.
    const card = el.querySelector("li");
    const step = card ? card.getBoundingClientRect().width + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: step * direction, behavior: "smooth" });
  }

  return (
    <div className="mt-12">
      <ul
        ref={track}
        className="scrollbar-none -mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-2 sm:mx-0 sm:px-0"
      >
        {partners.map((p) => (
          <li
            key={p.slug}
            className="group relative flex w-[19rem] shrink-0 snap-start flex-col overflow-hidden rounded-[var(--radius-md)] border border-line bg-raised sm:w-[21rem]"
          >
            {/*
              The colour field. `tint` is an arbitrary hex from the data, so it
              is set inline — Tailwind cannot generate a class for a value it
              never sees at build time.
            */}
            <div
              className="relative px-6 pb-7 pt-8"
              style={{
                background: `linear-gradient(150deg, ${p.tint} 0%, ${p.tint}D9 55%, ${p.tint}A6 100%)`,
              }}
            >
              <span
                aria-hidden
                className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-white/10 transition-transform duration-500 group-hover:scale-125"
              />
              <span className="label relative text-white/70">
                {p.city} · {p.country}
              </span>
              <h3 className="relative mt-2 text-[1.3rem] font-semibold leading-tight tracking-[-0.02em] text-white">
                {p.name}
              </h3>
            </div>

            <div className="flex flex-1 flex-col p-6">
              <p className="text-[0.9rem] leading-relaxed text-muted">{p.blurb}</p>

              <ul className="mt-5 flex-1 space-y-2 border-t border-line pt-4">
                {p.highlights.map((h) => (
                  <li
                    key={h}
                    className="flex gap-2.5 text-[0.85rem] leading-relaxed text-muted"
                  >
                    <span
                      aria-hidden
                      className="mt-[0.45em] h-1 w-1 shrink-0 rounded-full"
                      style={{ background: p.tint }}
                    />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}

        {/* The fourth card. Countries, never institutions — naming a university
            before an agreement exists is the one thing this must not do. */}
        <li className="relative flex w-[19rem] shrink-0 snap-start flex-col overflow-hidden rounded-[var(--radius-md)] border border-dashed border-line bg-raised sm:w-[21rem]">
          <div className="relative bg-gradient-to-br from-moss-400 to-[color-mix(in_srgb,var(--color-moss-400)_55%,#0B2E13)] px-6 pb-7 pt-8">
            <span className="label relative text-navy-950/60">In progress</span>
            <h3 className="relative mt-2 text-[1.3rem] font-semibold leading-tight tracking-[-0.02em] text-navy-950">
              More partnerships
            </h3>
          </div>

          <div className="flex flex-1 flex-col p-6">
            <p className="text-[0.9rem] leading-relaxed text-muted">
              Further institutional partnerships are being formed. Each is named here once it
              is signed, and not before.
            </p>

            <ul className="mt-5 flex flex-wrap gap-2 border-t border-line pt-4">
              {partnerHorizon.map((c) => (
                <li
                  key={c}
                  className="rounded-full border border-line px-2.5 py-1 text-[0.78rem] text-muted"
                >
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </li>
      </ul>

      {/*
        Hidden below sm, where swiping is how anybody would move this anyway and
        two buttons would only take up room.
      */}
      <div className="mt-5 hidden items-center gap-2 sm:flex">
        {([-1, 1] as const).map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => nudge(d)}
            disabled={d === -1 ? atStart : atEnd}
            aria-label={d === -1 ? "Previous partners" : "Next partners"}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-fg hover:text-fg disabled:opacity-30 disabled:hover:border-line disabled:hover:text-muted"
          >
            <svg viewBox="0 0 12 12" fill="none" aria-hidden className="h-3 w-3">
              <path
                d={d === -1 ? "M8 2L4 6l4 4" : "M4 2l4 4-4 4"}
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}
