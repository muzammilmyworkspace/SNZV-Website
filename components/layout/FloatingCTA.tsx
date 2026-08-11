"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import { JourneyForm } from "@/components/forms/JourneyForm";
import { Magnetic } from "@/components/ui/Editorial";
import { company } from "@/data/company";
import { analytics } from "@/lib/analytics";

/**
 * Floating consultation entry. Appears only after the visitor commits to the
 * page, never auto-opens, and is suppressed on /contact where the form is the
 * page. Breathes rather than blinks.
 */
export function FloatingCTA() {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const restore = useRef<HTMLElement | null>(null);

  const suppressed = pathname.startsWith("/contact");

  useEffect(() => {
    if (suppressed) return setVisible(false);
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.85);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [suppressed]);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    restore.current = document.activeElement as HTMLElement;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key !== "Tab") return;
      const f = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
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
      () => panelRef.current?.querySelector<HTMLElement>("button")?.focus(),
      90
    );
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
      restore.current?.focus?.();
    };
  }, [open]);

  if (suppressed) return null;

  return (
    <>
      {/* Desktop */}
      <AnimatePresence>
        {visible && !open && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-7 right-7 z-40 hidden lg:block"
          >
            <Magnetic strength={0.22}>
              <button
                type="button"
                onClick={() => {
                  analytics.ctaClick("Start Your Journey", "floating_desktop");
                  setOpen(true);
                }}
                className="group relative flex items-center gap-3 overflow-hidden border border-moss-400/40 bg-abyss/90 py-4 pl-6 pr-5 backdrop-blur-xl transition-all duration-500 ease-[var(--ease-out-expo)] hover:border-moss-400 hover:bg-abyss"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-moss-400/20 to-transparent transition-transform duration-[1100ms] ease-[var(--ease-out-expo)] group-hover:translate-x-full"
                />
                <span className="relative flex h-1.5 w-1.5">
                  <span className="breathe absolute inline-flex h-full w-full rounded-full bg-moss-400" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-moss-400" />
                </span>
                <span className="label relative text-paper">
                  Start your journey
                </span>
                <svg viewBox="0 0 12 12" fill="none" aria-hidden className="relative h-3 w-3 text-moss-400 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1">
                  <path d="M1 6h9M6.5 2.5L10 6l-3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </Magnetic>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile */}
      <AnimatePresence>
        {visible && !open && (
          <motion.div
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            exit={{ y: "110%" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-white/10 bg-abyss/95 p-3 backdrop-blur-xl lg:hidden"
            style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
          >
            <button
              type="button"
              onClick={() => {
                analytics.ctaClick("Start Your Journey", "floating_mobile");
                setOpen(true);
              }}
              className="label flex h-12 flex-1 items-center justify-center gap-2 bg-moss-400 text-void"
            >
              Start your journey
              <svg viewBox="0 0 12 12" fill="none" aria-hidden className="h-3 w-3">
                <path d="M1 6h9M6.5 2.5L10 6l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <a
              href={`https://wa.me/${company.contact.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => analytics.whatsapp("floating_mobile")}
              aria-label="Message SnZ Ventures on WhatsApp"
              className="flex h-12 w-12 shrink-0 items-center justify-center border border-white/20 text-paper"
            >
              <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5" fill="currentColor">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 004.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0012.04 2zm0 18.15h-.01a8.23 8.23 0 01-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 01-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.83 2.41a8.19 8.19 0 012.41 5.83c0 4.54-3.7 8.23-8.24 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.14.16-.29.18-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.48c-.16 0-.43.06-.65.31-.22.25-.85.83-.85 2.03s.87 2.35.99 2.51c.12.16 1.71 2.61 4.15 3.66.58.25 1.03.4 1.38.51.58.19 1.11.16 1.53.1.47-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29z" />
              </svg>
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[70]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <button
              type="button"
              aria-label="Close"
              onClick={() => setOpen(false)}
              className="absolute inset-0 h-full w-full cursor-default bg-void/70 backdrop-blur-md"
            />
            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="drawer-title"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
              className="absolute inset-y-0 right-0 flex w-full max-w-[34rem] flex-col overflow-y-auto border-l border-white/10 bg-abyss"
            >
              <div className="flex items-start justify-between gap-6 border-b border-white/10 px-6 py-6 sm:px-8">
                <div>
                  <span className="label text-moss-400">Consultation</span>
                  <h2 id="drawer-title" className="d-3 mt-3 text-paper">
                    Let&rsquo;s find your route.
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="flex h-10 w-10 shrink-0 items-center justify-center border border-white/15 text-paper transition-colors hover:border-white/40"
                >
                  <svg viewBox="0 0 16 16" aria-hidden className="h-3.5 w-3.5">
                    <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              <div className="px-6 py-7 sm:px-8">
                <JourneyForm compact />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
