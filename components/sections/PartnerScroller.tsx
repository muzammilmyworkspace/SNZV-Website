"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  partners,
  partnerHorizon,
  horizonPoster,
  horizonPosterAlt,
} from "@/data/partners";

/**
 * The partnerships, as a scroller of the announcements themselves.
 *
 * THE ARTWORK IS SnZ'S OWN. Each card shows the creative published for that
 * partnership, which is where the institution's logo and its campus
 * photography come from — the firm's own announcement rather than a mark
 * reassembled here.
 *
 * THE TEXT IS STILL TEXT. Everything baked into a poster is invisible to a
 * search engine and to a screen reader, so the name, city and highlights sit
 * beside the image as content. The poster is the picture; it is not the copy.
 *
 * FOUR CARDS: three named institutions and the one that says more are coming.
 * That last card is part of the set rather than a note under it, because "who
 * else" is the next question somebody asks after reading three names.
 *
 * SCROLL-SNAP, NOT A SLIDESHOW. Nothing advances on its own — a card that
 * slides away mid-sentence is the most reliable way to make somebody stop
 * reading. The track is an ordinary overflow container, so swipe, trackpad and
 * keyboard all work without being reimplemented.
 */
export function PartnerScroller() {
  const track = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  /*
    The buttons disable at the ends rather than wrapping. A scroller that jumps
    back to the first card hides how many there are, and with four the count is
    worth knowing.
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
    // Measured from a card rather than assumed, so it stays correct at every
    // breakpoint.
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
        {partners.map((p, i) => (
          <li
            key={p.slug}
            className="group flex w-[17.5rem] shrink-0 snap-start flex-col overflow-hidden rounded-[var(--radius-md)] border border-line bg-raised sm:w-[19.5rem]"
          >
            {/*
              4:5, the proportion the artwork was made at. Anything else either
              crops the institution's logo out of the top or letterboxes it.
            */}
            <div className="relative aspect-[4/5] w-full overflow-hidden">
              <Image
                src={p.poster}
                alt={p.posterAlt}
                fill
                sizes="(max-width: 640px) 80vw, 20rem"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                /* The first two are near the top of the home page. */
                priority={i < 2}
              />
            </div>

            <div className="flex flex-1 flex-col p-5">
              <span className="label" style={{ color: p.tint }}>
                {p.city} · {p.country}
              </span>
              <h3 className="mt-1.5 text-[1.05rem] font-semibold leading-tight tracking-[-0.015em] text-fg-strong">
                {p.name}
              </h3>
              <p className="mt-2 text-[0.85rem] leading-relaxed text-muted">{p.blurb}</p>

              <ul className="mt-4 flex flex-1 flex-wrap content-start gap-1.5 border-t border-line pt-3.5">
                {p.highlights.map((h) => (
                  <li
                    key={h}
                    className="rounded-full border border-line px-2 py-0.5 text-[0.72rem] leading-relaxed text-muted"
                  >
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}

        {/* The fourth. Countries, never institutions — naming a university
            before an agreement exists is the one thing this must not do. */}
        <li className="group flex w-[17.5rem] shrink-0 snap-start flex-col overflow-hidden rounded-[var(--radius-md)] border border-dashed border-line bg-raised sm:w-[19.5rem]">
          <div className="relative aspect-[4/5] w-full overflow-hidden">
            <Image
              src={horizonPoster}
              alt={horizonPosterAlt}
              fill
              sizes="(max-width: 640px) 80vw, 20rem"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
          </div>

          <div className="flex flex-1 flex-col p-5">
            <span className="label text-accent">In progress</span>
            <h3 className="mt-1.5 text-[1.05rem] font-semibold leading-tight tracking-[-0.015em] text-fg-strong">
              More partnerships
            </h3>
            <p className="mt-2 text-[0.85rem] leading-relaxed text-muted">
              Each is named here once it is signed, and not before.
            </p>

            <ul className="mt-4 flex flex-1 flex-wrap content-start gap-1.5 border-t border-line pt-3.5">
              {partnerHorizon.map((c) => (
                <li
                  key={c}
                  className="rounded-full border border-line px-2 py-0.5 text-[0.72rem] leading-relaxed text-muted"
                >
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </li>
      </ul>

      {/* Hidden below sm, where swiping is how anybody would move this anyway
          and two buttons would only take up room. */}
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
