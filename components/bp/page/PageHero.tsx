"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useReduced } from "@/components/bp/useReduced";
import { Arrow } from "../Glyphs";

/**
 * THE INNER-PAGE HERO.
 *
 * Same grammar as the homepage hero, so every page opens like the same
 * product: a mono breadcrumb, an eyebrow, a headline that masks up line by
 * line, one lede, two actions, and a visual on the right. The headline is
 * real text in the HTML from the first byte — it is the LCP element.
 */

export type HeroLine = { text: string; mark?: boolean };

export function PageHero({
  crumbs,
  eyebrow,
  lines,
  lede,
  primary,
  secondary,
  visual,
  children,
}: {
  crumbs: { name: string; href: string }[];
  eyebrow: string;
  lines: HeroLine[];
  lede: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string; external?: boolean };
  visual?: React.ReactNode;
  children?: React.ReactNode;
}) {
  const reduce = useReduced();
  const ease = [0.16, 1, 0.3, 1] as const;
  const rise = (delay: number) =>
    reduce ? {} : { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { delay, duration: 0.9, ease } };

  return (
    <section className="relative z-10 overflow-hidden pt-28 sm:pt-32">
      <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-4 pb-6 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-12 lg:px-10 lg:pb-10">
        <div>
          <motion.nav aria-label="Breadcrumb" {...rise(0)}>
            <ol className="bp-mono flex flex-wrap items-center gap-2 text-[var(--bp-faint)]">
              {crumbs.map((c, i) => (
                <li key={c.href} className="flex items-center gap-2">
                  {i > 0 && <span aria-hidden>/</span>}
                  {i < crumbs.length - 1 ? (
                    <Link href={c.href} className="-my-3 inline-flex min-h-11 items-center hover:text-[var(--bp-strong)]">
                      {c.name}
                    </Link>
                  ) : (
                    <span aria-current="page" className="text-[var(--bp-muted)]">
                      {c.name}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </motion.nav>

          <motion.p className="bp-eyebrow mt-8" {...rise(0.05)}>
            {eyebrow}
          </motion.p>

          <h1 className="bp-display bp-h1 mt-5">
            {lines.map((l, i) => (
              <span key={l.text} className="block overflow-hidden pb-[0.06em]">
                <motion.span
                  className={l.mark ? "block bp-mark" : "block"}
                  initial={reduce ? false : { y: "105%" }}
                  animate={{ y: "0%" }}
                  transition={{ delay: 0.12 + i * 0.1, duration: 1, ease }}
                >
                  {l.text}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p className="bp-lede mt-6" {...rise(0.5)}>
            {lede}
          </motion.p>

          {(primary || secondary) && (
            <motion.div className="mt-8 flex flex-wrap gap-3" {...rise(0.62)}>
              {primary && (
                <Link href={primary.href} className="bp-btn bp-btn-primary">
                  {primary.label} <Arrow />
                </Link>
              )}
              {secondary &&
                (secondary.external ? (
                  <a href={secondary.href} target="_blank" rel="noopener noreferrer" className="bp-btn bp-btn-ghost">
                    {secondary.label}
                  </a>
                ) : (
                  <Link href={secondary.href} className="bp-btn bp-btn-ghost">
                    {secondary.label}
                  </Link>
                ))}
            </motion.div>
          )}
          {children && <motion.div {...rise(0.75)}>{children}</motion.div>}
        </div>

        {visual && <div className="relative">{visual}</div>}
      </div>
    </section>
  );
}
