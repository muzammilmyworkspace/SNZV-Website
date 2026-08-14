"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { primaryNav } from "@/data/navigation";
import { company } from "@/data/company";
import { Action } from "@/components/ui/Editorial";
import { analytics } from "@/lib/analytics";
import { cn } from "@/lib/utils";

/**
 * Full-bleed mobile navigation. Items stagger in as oversized display type —
 * the same editorial voice as the pages, not a shrunken desktop menu.
 */
export function MobileNav({
  open,
  onClose,
  pathname,
}: {
  open: boolean;
  onClose: () => void;
  pathname: string;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const restore = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    restore.current = document.activeElement as HTMLElement;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return onClose();
      if (e.key !== "Tab") return;
      const f = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
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
      () => panelRef.current?.querySelector<HTMLElement>("button, a")?.focus(),
      80
    );
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
      restore.current?.focus?.();
    };
  }, [open, onClose]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-nav"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
          className="grain fixed inset-0 z-[60] flex flex-col bg-surface xl:hidden"
        >
          <div
            aria-hidden
            className="bloom-moss pointer-events-none absolute -bottom-40 -left-24 h-[28rem] w-[28rem] opacity-40"
          />
          <div
            aria-hidden
            className="graticule pointer-events-none absolute inset-0 opacity-60"
          />

          <div className="relative flex items-center justify-between px-5 py-5 sm:px-8">
            <span className="label text-faint">Menu</span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="flex h-10 w-10 items-center justify-center border border-line text-fg transition-colors hover:border-line"
            >
              <svg viewBox="0 0 16 16" aria-hidden className="h-3.5 w-3.5">
                <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <nav
            aria-label="Mobile"
            className="relative flex-1 overflow-y-auto px-5 sm:px-8"
          >
            <ul>
              {primaryNav.map((item, i) => (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.7,
                    delay: 0.18 + i * 0.055,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="border-b border-line"
                >
                  <Link
                    href={item.href}
                    onClick={onClose}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className="group flex items-baseline gap-4 py-4"
                  >
                    <span className="label num w-6 shrink-0 text-moss-400/70">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={cn(
                        "font-display text-[2rem] leading-none tracking-[-0.02em] transition-colors",
                        isActive(item.href)
                          ? "text-accent"
                          : "text-fg group-hover:text-accent"
                      )}
                    >
                      {item.label}
                    </span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </nav>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="relative border-t border-line px-5 py-6 sm:px-8"
          >
            <Action
              href="/contact#journey"
              size="lg"
              className="w-full"
              onClick={() => {
                analytics.ctaClick("Book a consultation", "mobile_nav");
                onClose();
              }}
            >
              Book a consultation
            </Action>
            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
              <a
                href={`tel:${company.contact.phoneHref}`}
                onClick={() => analytics.phone("mobile_nav")}
                className="label text-faint transition-colors hover:text-fg"
              >
                {company.contact.phone}
              </a>
              <a
                href={`mailto:${company.contact.email}`}
                onClick={() => analytics.email("mobile_nav")}
                className="label text-faint transition-colors hover:text-fg"
              >
                Email
              </a>
              <a
                href={`https://wa.me/${company.contact.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => analytics.whatsapp("mobile_nav")}
                className="label text-faint transition-colors hover:text-fg"
              >
                WhatsApp
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
