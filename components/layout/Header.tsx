"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { primaryNav } from "@/data/navigation";
import { Action } from "@/components/ui/Editorial";
import { MobileNav } from "./MobileNav";
import { analytics } from "@/lib/analytics";
import { cn } from "@/lib/utils";

/**
 * Header: an overlay rule at rest, a compact surface once you move.
 * No pill buttons, no boxed logo — a hairline, a wordmark and one action.
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
          "fixed inset-x-0 top-0 z-50 transition-all duration-700 ease-[var(--ease-out-expo)]",
          scrolled
            ? "border-b border-white/10 bg-void/80 backdrop-blur-xl"
            : "border-b border-white/0 bg-transparent"
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
              <span className="font-display text-[1.15rem] tracking-[-0.02em] text-paper">
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
            {primaryNav
              .filter((n) => n.href !== "/contact")
              .map((item) => {
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
                          ? "text-paper"
                          : "text-navy-200 hover:text-paper"
                      )}
                    >
                      {item.label}
                      {active && (
                        <motion.span
                          layoutId="nav-dot"
                          className="absolute -bottom-0.5 left-3 h-px w-[calc(100%-1.5rem)] bg-moss-400"
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
                          <div className="border border-white/12 bg-abyss/95 p-1.5 backdrop-blur-2xl">
                            {item.children!.map((c) => (
                              <Link
                                key={c.href}
                                href={c.href}
                                className="group/i block px-4 py-3 transition-colors hover:bg-white/[0.05]"
                              >
                                <span className="flex items-center justify-between gap-4">
                                  <span className="font-display text-[1.02rem] tracking-[-0.01em] text-paper">
                                    {c.label}
                                  </span>
                                  <svg viewBox="0 0 12 12" fill="none" aria-hidden className="h-2.5 w-2.5 shrink-0 text-moss-400 opacity-0 transition-all duration-400 group-hover/i:translate-x-1 group-hover/i:opacity-100">
                                    <path d="M1 6h9M6.5 2.5L10 6l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                </span>
                                <span className="mt-1 block text-[0.8rem] leading-snug text-navy-300">
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
            <div className="hidden sm:block">
              <Action
                href="/contact#journey"
                size="sm"
                onClick={() => analytics.ctaClick("Start Your Journey", "header")}
              >
                Start your journey
              </Action>
            </div>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              className="group flex h-10 w-10 items-center justify-center border border-white/15 transition-colors hover:border-white/40 xl:hidden"
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
