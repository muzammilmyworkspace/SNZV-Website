"use client";

import Link from "next/link";
import { portalUrls } from "@/lib/portal-url";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { primaryNav } from "@/data/navigation";
import { MobileNav } from "./MobileNav";
import { ThemeToggle } from "./ThemeToggle";
import { analytics } from "@/lib/analytics";
import { cn } from "@/lib/utils";

/**
 * Header: an overlay rule at rest, a compact surface once you move.
 * No pill buttons, no boxed logo — a hairline, a wordmark and one action.
 *
 * The nav renders `primaryNav` in full. It used to filter `/contact` out and
 * carry a "Start your journey" CTA instead; both are gone. Contact is now an
 * ordinary nav item, which removes the odd situation of the primary
 * conversion path being the one link excluded from the primary navigation.
 * Every page still ends on a full CTA section, so nothing was lost.
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(null);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header
        className={cn(
          "site-header fixed inset-x-0 top-0 z-50 transition-all duration-700 ease-[var(--ease-out-expo)]",
          scrolled
            ? "is-scrolled border-b border-line bg-surface/80 backdrop-blur-xl"
            : "border-b border-line bg-transparent"
        )}
      >
        <div
          className={cn(
            "mx-auto flex max-w-[1720px] items-center gap-8 px-5 transition-all duration-700 ease-[var(--ease-out-expo)] sm:px-8 lg:px-12",
            scrolled ? "h-[64px]" : "h-[92px]"
          )}
        >
          {/* Wordmark */}
          <Link
            href="/"
            aria-label="SnZ Ventures — home"
            className="group flex shrink-0 items-center gap-3"
          >
            <Image
              src="/brand/snz-mark.png"
              alt=""
              width={36}
              height={36}
              priority
              className={cn(
                "rounded-full transition-all duration-700 ease-[var(--ease-out-expo)] group-hover:rotate-[8deg]",
                scrolled ? "h-7 w-7" : "h-9 w-9"
              )}
            />
            <span className="hidden flex-col leading-none xs:flex">
              <span className="font-display text-[1.15rem] tracking-[-0.02em] text-fg">
                SnZ Ventures
              </span>
            </span>
          </Link>

          {/* Nav */}
          <nav
            aria-label="Main"
            className="ml-auto hidden items-center gap-1 xl:flex"
            onMouseLeave={() => setOpen(null)}
          >
            {primaryNav.map((item) => {
                const active = isActive(item.href);
                const hasKids = Boolean(item.children?.length);
                return (
                  <div
                    key={item.href}
                    className="relative"
                    onMouseEnter={() => setOpen(hasKids ? item.href : null)}
                  >
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      aria-expanded={hasKids ? open === item.href : undefined}
                      className={cn(
                        "label relative flex items-center gap-1.5 whitespace-nowrap px-3 py-2.5 transition-colors duration-300",
                        active
                          ? "text-fg"
                          : "text-muted hover:text-fg"
                      )}
                    >
                      {item.label}
                      {active && (
                        <motion.span
                          layoutId="nav-dot"
                          className="grad-rule absolute -bottom-0.5 left-3 h-px w-[calc(100%-1.5rem)]"
                          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                        />
                      )}
                    </Link>

                    <AnimatePresence>
                      {hasKids && open === item.href && (
                        <motion.div
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 4 }}
                          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                          className="absolute left-0 top-full w-[22rem] pt-3"
                        >
                          {/*
                            Opaque, not translucent.

                            `bg-surface/95` inherited --surface from <body>,
                            which is the same navy as the hero behind it. At
                            rest the header is a transparent overlay, so the
                            panel dropped onto a near-identical colour and read
                            as part of the page rather than above it. A solid
                            raised surface, a stronger hairline and a real
                            shadow give it an edge to be seen against on every
                            background, in both themes.
                          */}
                          <div className="rounded-[var(--radius-sm)] border border-line-strong bg-raised p-1.5 shadow-[0_24px_60px_-20px_rgba(2,6,16,0.75)]">
                            {item.children!.map((c) => (
                              <Link
                                key={c.href}
                                href={c.href}
                                className="group/i block px-4 py-3 transition-colors hover:bg-white/[0.05]"
                              >
                                <span className="flex items-center justify-between gap-4">
                                  <span className="font-display text-[1.02rem] tracking-[-0.01em] text-fg">
                                    {c.label}
                                  </span>
                                  <svg viewBox="0 0 12 12" fill="none" aria-hidden className="h-2.5 w-2.5 shrink-0 text-accent opacity-0 transition-all duration-400 group-hover/i:translate-x-1 group-hover/i:opacity-100">
                                    <path d="M1 6h9M6.5 2.5L10 6l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                </span>
                                <span className="mt-1 block text-[0.8rem] leading-snug text-faint">
                                  {c.description}
                                </span>
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
          </nav>

          <div className="ml-auto flex items-center gap-3 xl:ml-4">
            <Link
              href={portalUrls.login}
              onClick={() => analytics.loginClick("header")}
              className="label hidden min-h-11 items-center gap-2 rounded-[var(--radius-sm)] border border-line px-4 text-fg transition-all duration-400 hover:border-moss-400/70 hover:text-accent sm:inline-flex"
            >
              <svg viewBox="0 0 16 16" fill="none" aria-hidden className="h-3.5 w-3.5">
                <path d="M6 2h6a2 2 0 012 2v8a2 2 0 01-2 2H6M9 8H2m0 0l2.5-2.5M2 8l2.5 2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Login
            </Link>

            <ThemeToggle />

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              className="group flex h-10 w-10 items-center justify-center border border-line transition-colors hover:border-line xl:hidden"
            >
              <span className="flex flex-col gap-[5px]">
                <span className="block h-px w-4 bg-paper transition-transform duration-400 group-hover:translate-x-0.5" />
                <span className="block h-px w-4 bg-paper" />
                <span className="block h-px w-2.5 bg-paper transition-all duration-400 group-hover:w-4" />
              </span>
            </button>
          </div>
        </div>
      </header>

      <MobileNav
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        pathname={pathname}
      />
    </>
  );
}
