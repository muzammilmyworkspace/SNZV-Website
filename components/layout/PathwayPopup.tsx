"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { pathways } from "@/data/pathways";
import { analytics } from "@/lib/analytics";

/**
 * PATHWAY POPUP
 * ---------------------------------------------------------------------------
 * Deliberately restrained. It is an orientation aid, not an interstitial:
 *
 *  • Never fires on first paint. Requires genuine engagement — 35% scroll
 *    depth OR 25s dwell, whichever comes first (exit-intent on desktop as a
 *    third trigger).
 *  • Shows once. Dismissal is remembered for 30 days in localStorage, and
 *    choosing a pathway suppresses it permanently.
 *  • Suppressed entirely on the pathway pages themselves, on /contact and
 *    inside the portal — anywhere the question is already being answered.
 *  • Escape closes it, focus is trapped while open, and the trigger regains
 *    focus on close.
 */

const KEY = "snz_pathway_popup";
const DISMISS_DAYS = 30;
const DWELL_MS = 25_000;
const SCROLL_TRIGGER = 0.35;

const SUPPRESSED = [
  "/study-abroad",
  "/global-careers",
  "/business-setup",
  "/contact",
  "/portal",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
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

  const suppressed = SUPPRESSED.some((p) => pathname.startsWith(p));

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
          className="fixed inset-0 z-[80] flex items-center justify-center p-4"
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

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="pathway-popup-title"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.99 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="tone-deep relative w-full max-w-4xl overflow-hidden rounded-[var(--radius-lg)] border border-line shadow-[0_40px_120px_-30px_rgba(0,0,0,0.8)]"
          >
            <div aria-hidden className="graticule pointer-events-none absolute inset-0 opacity-40" />
            <div
              aria-hidden
              className="bloom-moss pointer-events-none absolute -bottom-32 left-1/4 h-72 w-72 opacity-30"
            />

            <button
              type="button"
              onClick={() => close("button")}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] border border-line text-fg transition-colors hover:border-line-strong"
            >
              <svg viewBox="0 0 16 16" aria-hidden className="h-3.5 w-3.5">
                <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>

            <div className="relative px-6 pt-8 text-center sm:px-10">
              <p className="label text-accent">Three routes</p>
              <h2 id="pathway-popup-title" className="d-2 mt-3 text-fg-strong">
                Where are you going next?
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-[0.92rem] leading-relaxed text-muted">
                Pick the one closest to your situation. We&rsquo;ll show you what
                that route actually involves — no sign-up needed.
              </p>
            </div>

            <div className="relative grid gap-px p-6 sm:grid-cols-3 sm:p-8">
              {pathways.map((p, i) => (
                <motion.div
                  key={p.key}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={p.href}
                    onClick={() => choose(p.key)}
                    className="group block h-full overflow-hidden rounded-[var(--radius-md)] border border-line transition-all duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:border-moss-400/60"
                  >
                    <span className="plate relative block aspect-[16/10] overflow-hidden">
                      <Image
                        src={p.image}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        loading="lazy"
                        className="object-cover transition-transform duration-[1100ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.07]"
                      />
                    </span>
                    <span className="block p-4">
                      <span className="block text-[1.05rem] font-bold tracking-[-0.02em] text-fg transition-colors group-hover:text-accent">
                        {p.title}
                      </span>
                      <span className="mt-1.5 block text-[0.83rem] leading-snug text-muted">
                        {p.hook}
                      </span>
                      <span className="label mt-4 inline-flex items-center gap-2 text-accent">
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

            <div className="relative border-t border-line px-6 py-4 text-center sm:px-10">
              <button
                type="button"
                onClick={() => close("not-sure")}
                className="text-[0.84rem] text-muted underline underline-offset-4 transition-colors hover:text-fg"
              >
                I&rsquo;m just looking around
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
