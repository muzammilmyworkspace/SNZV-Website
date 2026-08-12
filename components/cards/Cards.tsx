"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { analytics } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import type { Pathway } from "@/data/pathways";
import type { Destination } from "@/data/destinations";
import { availabilityLabel } from "@/data/destinations";
import type { Article } from "@/data/insights";
import type { Service } from "@/data/services";

/**
 * Editorial plates, not cards.
 *
 * Everything here shares one construction: a duotone plate, type set over or
 * beneath it, a hairline rule and a numeric marker. No boxed containers, no
 * drop shadows, no rounded corners — the composition does the work.
 */

const reveal = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "320px 0px -5% 0px" },
};

/* -------------------------------------------------------------- Pathway -- */

export function PathwayCard({
  pathway,
  index,
}: {
  pathway: Pathway;
  index: number;
}) {
  return (
    <motion.article
      {...reveal}
      transition={{ duration: 0.8, delay: index * 0.09, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col"
    >
      <Link href={pathway.href} onClick={() => analytics.pathwaySelect(pathway.key, "pathway_plates")}>
        <div className="plate relative aspect-[4/3] overflow-hidden">
          <Image
            src={pathway.image}
            alt={pathway.imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            loading="lazy"
            className="object-cover transition-transform duration-[1200ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.06]"
          />
          <span className="absolute left-4 top-4 z-[3] label text-muted">
            {String(index + 1).padStart(2, "0")} / {pathway.eyebrow}
          </span>
        </div>

        <h3 className="mt-6 font-display text-[1.9rem] leading-none tracking-[-0.022em] text-fg transition-colors duration-500 group-hover:text-accent">
          {pathway.title}
        </h3>
        <p className="mt-3 text-[0.92rem] leading-snug text-fg">
          {pathway.hook}
        </p>
        <p className="mt-3 max-w-md text-[0.86rem] leading-relaxed text-faint">
          {pathway.body}
        </p>

        <ul className="mt-5 border-t border-line">
          {pathway.bullets.map((b) => (
            <li
              key={b}
              className="border-b border-line py-2.5 text-[0.83rem] leading-snug text-muted"
            >
              {b}
            </li>
          ))}
        </ul>

        <span className="label mt-5 inline-flex items-center gap-2 text-accent">
          <span className="draw">{pathway.cta}</span>
          <svg viewBox="0 0 12 12" fill="none" aria-hidden className="h-2.5 w-2.5 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1">
            <path d="M1 6h9M6.5 2.5L10 6l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </Link>
    </motion.article>
  );
}

/* ---------------------------------------------------------- Destination -- */

export function DestinationCard({
  destination,
  index = 0,
}: {
  destination: Destination;
  index?: number;
}) {
  const rows = [
    { label: "Study", value: destination.study },
    { label: "Careers", value: destination.careers },
    { label: "Business", value: destination.business },
  ] as const;

  return (
    <motion.article
      {...reveal}
      transition={{ duration: 0.75, delay: (index % 4) * 0.07, ease: [0.16, 1, 0.3, 1] }}
      onViewportEnter={() => analytics.destinationView(destination.slug)}
      className="group"
    >
      <div className="plate relative aspect-[4/5] overflow-hidden">
        <Image
          src={destination.image}
          alt={`${destination.city}, ${destination.country}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          loading="lazy"
          className="object-cover transition-transform duration-[1200ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.07]"
        />
        {destination.featured && (
          <span className="absolute right-3 top-3 z-[3] label bg-moss-400 px-2 py-1 text-void">
            Core
          </span>
        )}
        <div className="absolute inset-x-4 bottom-4 z-[3]">
          <h3 className="font-display text-[1.55rem] leading-none tracking-[-0.02em] text-fg">
            {destination.country}
          </h3>
          <span className="label mt-1.5 block text-muted">
            {destination.city}
          </span>
        </div>
      </div>

      <p className="mt-4 text-[0.85rem] leading-relaxed text-muted">
        {destination.blurb}
      </p>

      <dl className="mt-4">
        {rows.map((r) => (
          <div
            key={r.label}
            className="flex items-center justify-between border-t border-line py-2"
          >
            <dt className="label text-faint">{r.label}</dt>
            <dd
              className={cn(
                "label",
                r.value === "core"
                  ? "text-moss-400"
                  : r.value === "available"
                    ? "text-fg"
                    : "text-faint"
              )}
            >
              {availabilityLabel[r.value]}
            </dd>
          </div>
        ))}
      </dl>

      <p className="mt-3 border-t border-line pt-3 text-[0.76rem] leading-snug text-faint">
        {destination.marketNote}
      </p>
    </motion.article>
  );
}

/* -------------------------------------------------------------- Insight -- */

export function InsightCard({
  article,
  index = 0,
  featured = false,
}: {
  article: Article;
  index?: number;
  featured?: boolean;
}) {
  return (
    <motion.article
      {...reveal}
      transition={{ duration: 0.75, delay: (index % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="group relative"
    >
      <Link
        href={`/insights/${article.slug}`}
        onClick={() => analytics.articleView(article.slug, article.category)}
        className={cn("block", featured && "md:grid md:grid-cols-2 md:items-center md:gap-10")}
      >
        <div
          className={cn(
            "plate relative overflow-hidden",
            featured ? "aspect-[16/10]" : "aspect-[16/9]"
          )}
        >
          <Image
            src={article.image}
            alt={article.imageAlt}
            fill
            sizes={featured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 33vw"}
            loading="lazy"
            className="object-cover transition-transform duration-[1200ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.05]"
          />
          <span className="absolute left-4 top-4 z-[3] label bg-moss-400 px-2.5 py-1 text-void">
            {article.category}
          </span>
        </div>

        <div className={cn(!featured && "mt-5")}>
          <span className="label text-faint">{article.readMinutes} min read</span>
          <h3
            className={cn(
              "mt-3 font-display leading-tight tracking-[-0.02em] text-fg transition-colors duration-500 group-hover:text-accent",
              featured ? "text-[2rem]" : "text-[1.3rem]"
            )}
          >
            {article.title}
          </h3>
          <p className="mt-3 max-w-md text-[0.87rem] leading-relaxed text-faint">
            {article.excerpt}
          </p>
          <span className="label mt-5 inline-flex items-center gap-2 text-accent">
            <span className="draw">Read the guide</span>
          </span>
        </div>
      </Link>
    </motion.article>
  );
}

/* -------------------------------------------------------------- Service -- */

export function ServiceCard({
  service,
  index = 0,
}: {
  service: Service;
  index?: number;
}) {
  return (
    <motion.article
      {...reveal}
      transition={{ duration: 0.75, delay: (index % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="group border-t border-line pt-6"
    >
      <Link href={`/services/${service.slug}`} onClick={() => analytics.serviceView(service.slug)}>
        <span className="label num text-moss-400/60">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3 className="mt-3 font-display text-[1.5rem] leading-tight tracking-[-0.02em] text-fg transition-colors duration-500 group-hover:text-accent">
          {service.name}
        </h3>
        <p className="mt-3 max-w-sm text-[0.87rem] leading-relaxed text-faint">
          {service.tagline}
        </p>
        <span className="label mt-5 inline-flex items-center gap-2 text-accent">
          <span className="draw">Explore</span>
          <svg viewBox="0 0 12 12" fill="none" aria-hidden className="h-2.5 w-2.5 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1">
            <path d="M1 6h9M6.5 2.5L10 6l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </Link>
    </motion.article>
  );
}
