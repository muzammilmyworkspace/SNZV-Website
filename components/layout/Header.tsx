"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "motion/react";
import { primaryNav } from "@/data/navigation";
import { company } from "@/data/company";
import { analytics } from "@/lib/analytics";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";
import { useReduced } from "@/components/bp/useReduced";

/**
 * THE HEADER — Boarding Pass chrome.
 *
 * Two actions on the right and they are deliberately not equal:
 *   • Book a Consultation — filled green. It is what a new visitor came for,
 *     so it is the primary action on every page.
 *   • Login — outlined. It serves somebody who has already decided, and they
 *     will find it without it shouting.
 *
 * Behaviour:
 *   • Always night glass. Over the homepage hero that is the same colour as
 *     the page, so it reads as transparent; over the inner pages — still on the
 *     older light system — it is what keeps white type off a white ground. At
 *     the top of the homepage only the hairline is dropped.
 *   • Hides on scroll-down and returns on scroll-up — it gets out of the way of
 *     the journey animations, which need the whole viewport.
 *   • A hairline along its bottom edge fills with page progress: the flight
 *     path of the visit. Driven by a motion value, so scrolling never
 *     re-renders this component for it.
 */

const BOOK_HREF = "/contact#journey";

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const reduce = useReduced();

  const [atTop, setAtTop] = useState(true);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const last = useRef(0);

  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 40, mass: 0.3 });

  useMotionValueEvent(scrollY, "change", (y) => {
    setAtTop(y < 24);
    const goingDown = y > last.current;
    // A small dead zone so a trackpad's jitter does not flicker the bar.
    if (Math.abs(y - last.current) > 6) setHidden(goingDown && y > 320 && !menuOpen);
    last.current = y;
  });

  useEffect(() => setMenuOpen(false), [pathname]);

  const solid = !isHome || !atTop;
  // Taller and borderless at the top of the homepage; compact once moving.
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <motion.header
        className="bp-header fixed inset-x-0 top-0 z-50"
        animate={{ y: hidden && !reduce ? "-100%" : "0%" }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          className={cn(
            "relative transition-[background-color,border-color,backdrop-filter] duration-500",
            "bg-[var(--bp-header-bg)] backdrop-blur-xl",
            solid ? "border-b border-[var(--bp-line)]" : "border-b border-transparent"
          )}
        >
          <div
            className={cn(
              "mx-auto flex max-w-[1440px] items-center gap-6 px-4 transition-[height] duration-500 sm:px-6 lg:px-10",
              solid ? "h-16" : "h-20"
            )}
          >
            <Link
              href="/"
              aria-label="SnZ Ventures, home"
              className="group -my-1 flex shrink-0 items-center gap-2.5 py-1"
            >
              <Image
                src="/brand/snz-mark.png"
                alt=""
                width={36}
                height={36}
                priority
                className="h-9 w-9 rounded-full transition-transform duration-700 group-hover:rotate-[10deg]"
              />
              <span className="hidden font-[family-name:var(--font-grotesk)] text-[1.1rem] font-semibold tracking-[-0.02em] xs:inline">
                SnZ Ventures
              </span>
            </Link>

            <nav aria-label="Main" className="mx-auto hidden items-center gap-1 xl:flex">
              {primaryNav
                .filter((n) => n.href !== "/" && n.href !== "/contact")
                .map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative flex min-h-11 items-center rounded-full px-4 text-[0.92rem] transition-colors duration-300",
                        active ? "text-[var(--bp-strong)]" : "text-[var(--bp-muted)] hover:text-[var(--bp-strong)]"
                      )}
                    >
                      {active && (
                        <motion.span
                          layoutId="bp-nav-pill"
                          className="absolute inset-0 -z-10 rounded-full bg-[var(--bp-chip)]"
                          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                        />
                      )}
                      {item.label}
                    </Link>
                  );
                })}
              <Link
                href="/contact"
                aria-current={isActive("/contact") ? "page" : undefined}
                className="flex min-h-11 items-center rounded-full px-4 text-[0.92rem] text-[var(--bp-muted)] transition-colors hover:text-[var(--bp-strong)]"
              >
                Contact
              </Link>
            </nav>

            <div className="ml-auto flex items-center gap-2 xl:ml-0">
              {/* The inner pages still offer light and dark; the homepage is
                  always night, so the toggle only changes what follows it. */}
              <ThemeToggle className="hidden !rounded-full !border-[var(--bp-line-strong)] !text-[var(--bp-fg)] sm:flex" />
              <a
                href={company.portalUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => analytics.ctaClick("Portal login", "header")}
                className="bp-btn bp-btn-ghost bp-btn-sm !px-3 sm:!px-4"
                aria-label="Login to the student portal"
              >
                <svg viewBox="0 0 20 20" fill="none" aria-hidden className="h-4 w-4">
                  <circle cx="10" cy="7" r="3.2" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M3.8 17c.9-3 3.4-4.6 6.2-4.6s5.3 1.6 6.2 4.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
                <span className="hidden sm:inline">Login</span>
              </a>
              <Link
                href={BOOK_HREF}
                onClick={() => analytics.ctaClick("Book a consultation", "header")}
                className="bp-btn bp-btn-primary bp-btn-sm"
              >
                <span className="sm:hidden">Book</span>
                <span className="hidden sm:inline">Book a Consultation</span>
              </Link>

              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
                aria-expanded={menuOpen}
                aria-controls="mobile-nav"
                className="ml-1 flex h-11 w-11 items-center justify-center rounded-full border border-[var(--bp-line-strong)] xl:hidden"
              >
                <span className="flex flex-col gap-[5px]">
                  <span className="block h-px w-4 bg-current" />
                  <span className="block h-px w-4 bg-current" />
                  <span className="ml-auto block h-px w-2.5 bg-current" />
                </span>
              </button>
            </div>
          </div>

          {/* The flight path of the visit. */}
          <motion.div
            aria-hidden
            className="absolute inset-x-0 bottom-[-1px] h-[2px] origin-left bg-gradient-to-r from-[var(--color-aurora)] to-[var(--color-runway)]"
            style={{ scaleX: progress }}
          />
        </div>
      </motion.header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} isActive={isActive} />
    </>
  );
}

function MobileMenu({
  open,
  onClose,
  isActive,
}: {
  open: boolean;
  onClose: () => void;
  isActive: (href: string) => boolean;
}) {
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const restore = document.activeElement as HTMLElement | null;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab") return;
      const f = panel.current?.querySelectorAll<HTMLElement>("a[href], button");
      if (!f?.length) return;
      const first = f[0];
      const lastEl = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    const t = window.setTimeout(() => panel.current?.querySelector<HTMLElement>("button")?.focus(), 60);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
      restore?.focus();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-nav"
          ref={panel}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="bp fixed inset-0 z-[60] flex flex-col overflow-y-auto px-5 pb-8 pt-4"
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="flex h-12 items-center justify-between">
            <span className="bp-mono text-[var(--bp-faint)]">Menu · Gate open</span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--bp-line-strong)]"
            >
              <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden>
                <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <nav aria-label="Main" className="mt-8 flex flex-col">
            {primaryNav.map((item, i) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="border-b border-[var(--bp-line)]"
              >
                <Link
                  href={item.href}
                  onClick={onClose}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className="flex items-baseline gap-4 py-4"
                >
                  <span className="bp-mono text-[var(--bp-faint)]">0{i + 1}</span>
                  <span
                    className={cn(
                      "bp-display text-[2rem]",
                      isActive(item.href) ? "text-[var(--color-runway)]" : "text-[var(--bp-strong)]"
                    )}
                  >
                    {item.label}
                  </span>
                </Link>
              </motion.div>
            ))}
          </nav>

          <div className="mt-auto grid gap-3 pt-10">
            <Link href={BOOK_HREF} onClick={onClose} className="bp-btn bp-btn-primary w-full">
              Book a Consultation
            </Link>
            <a
              href={company.portalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bp-btn bp-btn-ghost w-full"
            >
              Login to your portal
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
