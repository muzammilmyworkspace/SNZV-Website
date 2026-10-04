"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { pathways } from "@/data/pathways";
import { Action } from "@/components/ui/Editorial";
import { analytics } from "@/lib/analytics";

/**
 * PATHWAY POPUP
 * ---------------------------------------------------------------------------
 * Deliberately restrained. It is an orientation aid, not an interstitial:
 *
 *  • Never fires on first paint. Requires 35% scroll depth OR 6s dwell,
 *    whichever comes first, with exit-intent as a third trigger on desktop.
 *  • Shows once. Dismissal is remembered for 30 days in localStorage, and
 *    choosing a pathway suppresses it permanently.
 *  • Suppressed entirely on the pathway pages themselves, on /contact and
 *    inside the portal — anywhere the question is already being answered.
 *  • Escape closes it, focus is trapped while open, and the trigger regains
 *    focus on close.
 */

const KEY = "snz_pathway_popup";
const DISMISS_DAYS = 30;
/**
 * Time on page before the popup offers itself.
 *
 * This was 25s, which in practice meant most visitors never saw it — they had
 * either converted, scrolled past the trigger or left. 6s is long enough that
 * the hero has been read and the modal does not feel like it interrupted the
 * page load, and short enough that a browsing visitor actually receives it.
 *
 * Not shorter: an interstitial that lands immediately on arrival is what
 * Google penalises on mobile, and it reads as an ad rather than an offer.
 */
const DWELL_MS = 6_000;
const SCROLL_TRIGGER = 0.35;

const SUPPRESSED = [
  // Rebuilt on the Boarding Pass system: header CTA + closing form already.
  "/about",
  "/study-abroad",
  "/global-careers",
  "/business-setup",
  "/contact",
  "/portal",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];

function dismissedRecently(): boolean {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return false;
    const { until } = JSON.parse(raw) as { until: number };
    return typeof until === "number" && Date.now() < until;
  } catch {
    return false;
  }
}

function remember(days: number) {
  try {
    localStorage.setItem(
      KEY,
      JSON.stringify({ until: Date.now() + days * 86_400_000 })
    );
  } catch {
    /* storage unavailable — the popup simply shows again next visit */
  }
}

export function PathwayPopup({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const restore = useRef<HTMLElement | null>(null);
  const fired = useRef(false);

  /*
    Not on the homepage. The new homepage is one continuous scroll-driven
    story — the hero's flight loop, then the journey — and a modal six seconds
    in lands on top of the moment that is meant to hook. The homepage already
    answers "which route?" by being about the student route, and the header's
    Book a Consultation is on screen the whole time.
  */
  const suppressed =
    pathname === "/" || SUPPRESSED.some((p) => pathname.startsWith(p));

  useEffect(() => {
    if (suppressed || dismissedRecently()) return;

    const show = () => {
      if (fired.current) return;
      fired.current = true;
      restore.current = document.activeElement as HTMLElement;
      setOpen(true);
      analytics.popupOpen(pathname);
    };

    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      if (max > 0 && window.scrollY / max >= SCROLL_TRIGGER) show();
    };

    const onExit = (e: MouseEvent) => {
      if (e.clientY <= 0) show();
    };

    const timer = window.setTimeout(show, DWELL_MS);
    window.addEventListener("scroll", onScroll, { passive: true });
    // Exit intent is meaningless on touch, where there is no cursor to leave.
    if (window.matchMedia("(hover: hover)").matches) {
      document.addEventListener("mouseout", onExit);
    }

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mouseout", onExit);
    };
  }, [pathname, suppressed]);

  // Focus trap + scroll lock
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return close("escape");
      if (e.key !== "Tab") return;
      const f = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])'
      );
      if (!f?.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    const t = window.setTimeout(
      () => panelRef.current?.querySelector<HTMLElement>("a[href]")?.focus(),
      120
    );
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function close(reason: string) {
    remember(DISMISS_DAYS);
    setOpen(false);
    analytics.popupClose(reason);
    restore.current?.focus?.();
  }

  function choose(key: string) {
    // A chosen path means the question is answered — don't ask again.
    remember(365);
    analytics.popupPathSelected(key);
    setOpen(false);
  }

  if (suppressed) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28 }}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={() => close("backdrop")}
            className="absolute inset-0 h-full w-full cursor-default bg-navy-950/80 backdrop-blur-md"
          />

          {/*
            BOUNDED, AND A COLUMN — both matter on a phone.

            This was `w-full max-w-4xl` with no height limit. Stacked to one
            column the panel measured about 1290px against roughly 810px of
            usable viewport, and because the flex parent centres it, the
            overflow was split evenly above and below the fold. That put the
            close button off the top of the screen and the whole footer off the
            bottom, while the oversized panel covered the backdrop so there was
            nothing left to tap. Body scroll is locked whenever this is open and
            phones have no Escape key, so the only way out was to reload.

            Capping the height keeps the close button and footer on screen at
            every size; the column split below lets the middle scroll instead of
            the panel growing. `dvh` rather than `vh` because mobile browser
            chrome collapses on scroll and `vh` measures the taller state, which
            reintroduces the same overflow this exists to stop.
          */}
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="pathway-popup-title"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.99 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="pathway-popup tone-deep relative flex w-full max-w-4xl flex-col overflow-hidden rounded-[var(--radius-lg)] border border-line shadow-[0_40px_120px_-30px_rgba(0,0,0,0.8)]"
          >
            <div aria-hidden className="graticule pointer-events-none absolute inset-0 opacity-40" />
            <div
              aria-hidden
              className="bloom-moss pointer-events-none absolute -bottom-32 left-1/4 h-72 w-72 opacity-30"
            />

            {/*
              `bg-surface` because the region below now scrolls under it, and a
              transparent control over moving artwork stops being readable. The
              drawn box stays 36px; `before:-inset-1` grows the touch target to
              44px for WCAG 2.5.5 without enlarging the graphic.
            */}
            <button
              type="button"
              onClick={() => close("button")}
              aria-label="Close"
              className="pp-close absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] border border-line bg-surface text-fg transition-colors before:absolute before:-inset-1 before:content-[''] hover:border-line-strong sm:right-4 sm:top-4"
            >
              <svg viewBox="0 0 16 16" aria-hidden className="pp-close-icon h-3.5 w-3.5">
                <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>

            {/*
              Fixed head — stays put so the close button is always reachable.
              Padding stays symmetric so the centred type reads as centred, and
              is wide enough on mobile to clear the close button in the corner
              rather than letting a long heading line run underneath it.
            */}
            <div className="pp-head relative shrink-0 px-12 pt-6 text-center sm:px-10 sm:pt-8">
              <p className="label text-accent">Three routes</p>
              <h2 id="pathway-popup-title" className="pp-title d-2 mt-2 text-fg-strong sm:mt-3">
                Where are you going next?
              </h2>
              <p className="pp-lede mx-auto mt-2 max-w-lg text-[0.85rem] leading-relaxed text-muted sm:mt-3 sm:text-[0.95rem]">
                Pick the one closest to your situation. We&rsquo;ll show you what
                that route actually involves, no sign-up needed.
              </p>
            </div>

            {/*
              The only region allowed to scroll. `min-h-0` is load-bearing: a
              flex child defaults to `min-height: auto`, which refuses to
              shrink below its content, so without it the panel would grow past
              its own max-height again and nothing would scroll.
              `overscroll-contain` stops a flick at the end of the list from
              chaining through to the page behind.
            */}
            <div className="pp-cards relative grid min-h-0 flex-1 gap-2 overflow-y-auto overscroll-contain px-4 py-4 sm:grid-cols-3 sm:gap-px sm:p-8">
              {pathways.map((p, i) => (
                <motion.div
                  key={p.key}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/*
                    TWO LAYOUTS, ONE MARKUP. Below `sm` each card is a short
                    horizontal row — thumbnail beside the words — which is what
                    brings three of them plus the head and footer inside a phone
                    viewport. Stacked full-bleed 16:10 plates cost roughly 300px
                    per card and were most of the overflow. From `sm` up the
                    original vertical card is unchanged.
                  */}
                  <Link
                    href={p.href}
                    onClick={() => choose(p.key)}
                    className="pp-card group flex h-full items-center gap-3 overflow-hidden rounded-[var(--radius-md)] border border-line p-2 transition-all duration-500 ease-[var(--ease-out-expo)] hover:border-moss-400/60 sm:block sm:p-0 sm:hover:-translate-y-1"
                  >
                    <span className="pp-thumb plate relative block aspect-[4/3] w-20 shrink-0 overflow-hidden rounded-[var(--radius-xs)] sm:aspect-[16/10] sm:w-full sm:rounded-none">
                      <Image
                        src={p.image}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 80px, 33vw"
                        loading="lazy"
                        className="object-cover transition-transform duration-[1100ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.07]"
                      />
                    </span>
                    {/* `min-w-0` so a long hook wraps instead of stretching the row. */}
                    <span className="pp-body block min-w-0 flex-1 sm:p-4">
                      <span className="block text-[0.95rem] font-bold tracking-[-0.02em] text-fg transition-colors group-hover:text-accent sm:text-[1.05rem]">
                        {p.title}
                      </span>
                      <span className="mt-1 block text-[0.8rem] leading-snug text-muted sm:mt-1.5 sm:text-[0.85rem]">
                        {p.hook}
                      </span>
                      <span className="label mt-2 inline-flex items-center gap-2 text-accent sm:mt-4">
                        <span className="draw">Explore</span>
                        <svg viewBox="0 0 12 12" fill="none" aria-hidden className="h-2.5 w-2.5 transition-transform duration-500 group-hover:translate-x-1">
                          <path d="M1 6h9M6.5 2.5L10 6l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/*
              A direct route out for the visitor who is curious but does not
              want to self-classify. Without it the modal's only forward
              actions were three pathway pages — someone ready to talk had to
              dismiss the popup and go find the contact form themselves.
            */}
            {/* Fixed foot — never scrolls away, so the consultation CTA is always offered. */}
            <div className="pp-foot relative flex shrink-0 flex-col items-center gap-3 border-t border-line bg-surface px-5 py-4 text-center sm:flex-row sm:justify-between sm:gap-4 sm:px-10 sm:py-5 sm:text-left">
              <p className="text-[0.85rem] leading-snug text-muted sm:text-[0.85rem]">
                Not sure which one fits?{" "}
                <span className="text-fg">Tell us where you want to end up.</span>
              </p>

              <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 sm:gap-x-6 sm:gap-y-3">
                <Action
                  href="/contact#journey"
                  size="sm"
                  onClick={() => {
                    analytics.ctaClick("Book a consultation", "pathway_popup");
                    remember(365);
                    setOpen(false);
                  }}
                >
                  Book a consultation
                </Action>

                <button
                  type="button"
                  onClick={() => close("not-sure")}
                  className="text-[0.85rem] text-muted underline underline-offset-4 transition-colors hover:text-fg"
                >
                  I&rsquo;m just looking around
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
