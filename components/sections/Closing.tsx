"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, Fragment } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import {
  Shell,
  Chapter,
  MaskedLines,
  Reveal,
  RevealGroup,
  RevealItem,
  Action,
  TextLink,
  Caveat,
} from "@/components/ui/Editorial";
import { articles } from "@/data/insights";
import {
  trustPoints,
  stats,
  ecosystem,
  ecosystemDisclaimer,
  company,
} from "@/data/company";
import { analytics } from "@/lib/analytics";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════ CHAPTER 06 — WHY SNZ ═══ */

export function Why() {
  const shown = stats.filter((s) => s.verified);

  return (
    <section id="why" className="relative overflow-hidden tone-soft py-16 md:py-20">
      <div aria-hidden className="graticule pointer-events-none absolute inset-0 opacity-40" />

      <Shell className="relative">
        <Chapter index="07" label="Why SnZ" className="mb-10" />

        <MaskedLines
          as="h2"
          className="d-1 max-w-[18ch] text-fg"
          lines={[
            "Because Your Next Move",
            <Fragment key="Guesswork">
              Deserves More Than <span className="d-em">Guesswork</span>.
            </Fragment>,
          ]}
        />

        {/* Principles as an indexed list, set large */}
        <RevealGroup as="ol" className="mt-16 rule border-t">
          {trustPoints.map((t, i) => (
            <RevealItem
              as="li"
              key={t.title}
              className="group grid gap-3 border-b border-line py-8 md:grid-cols-[4rem_1fr_1fr] md:items-baseline md:gap-10"
            >
              <span className="label num text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display text-[1.6rem] leading-[1.05] tracking-[-0.02em] text-fg transition-colors duration-500 group-hover:text-accent sm:text-[2rem]">
                {t.title}
              </h3>
              <p className="max-w-md text-[0.9rem] leading-relaxed text-muted">
                {t.body}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* Only figures the client can substantiate ever render */}
        {shown.length > 0 && (
          <Reveal className="mt-14">
            <dl className="flex flex-wrap gap-x-16 gap-y-8">
              {shown.map((s) => (
                <div key={s.label} className="max-w-[16rem]">
                  <dt className="sr-only">{s.label}</dt>
                  <dd>
                    <span className="block font-display text-[3.4rem] leading-none tracking-[-0.03em] text-accent">
                      {s.value}
                      {s.suffix}
                    </span>
                    <span className="label mt-3 block text-fg">{s.label}</span>
                    <span className="mt-1.5 block text-[0.82rem] leading-snug text-faint">
                      {s.detail}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        )}

        {/* Ecosystem — context, never endorsement */}
        <Reveal className="mt-16">
          <div className="rule border-t pt-8">
            <span className="label text-faint">
              Operating within Lithuania&rsquo;s business &amp; fintech ecosystem
            </span>
            <ul className="mt-5 flex flex-wrap gap-x-10 gap-y-3">
              {ecosystem.map((e) => (
                <li
                  key={e}
                  className="font-display text-[1.05rem] tracking-[-0.01em] text-faint"
                >
                  {e}
                </li>
              ))}
            </ul>
            <Caveat>{ecosystemDisclaimer}</Caveat>
          </div>
        </Reveal>
      </Shell>
    </section>
  );
}


/* ═══════════════════════════════════════ CHAPTER 08 — INSIGHTS ═══ */

export function Insights() {
  const [lead, ...rest] = articles.slice(0, 4);

  return (
    <section id="insights" className="relative overflow-hidden tone-light py-16 md:py-20">
      <div aria-hidden className="graticule pointer-events-none absolute inset-0 opacity-40" />

      <Shell className="relative">
        <Chapter index="09" label="Insights" className="mb-10" />

        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <MaskedLines
            as="h2"
            className="d-1 max-w-[14ch] text-fg"
            lines={["Know Before", "You Go."]}
          />
          <Reveal delay={0.12}>
            <p className="max-w-sm text-[0.95rem] leading-relaxed text-muted">
              Orientation on the parts people get wrong — written to be useful
              whether or not you ever contact us.
            </p>
          </Reveal>
        </div>

        {/* Lead feature */}
        <Reveal className="mt-14">
          <Link
            href={`/insights/${lead.slug}`}
            onClick={() => analytics.articleView(lead.slug, lead.category)}
            className="group grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-14"
          >
            <div className="plate relative aspect-[16/10] overflow-hidden">
              <Image
                src={lead.image}
                alt={lead.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 55vw"
                loading="lazy"
                className="object-cover transition-transform duration-[1200ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.05]"
              />
              <span className="absolute left-4 top-4 z-[3] label bg-moss-400 px-2.5 py-1 text-void">
                {lead.category}
              </span>
            </div>
            <div>
              <span className="label text-faint">
                {lead.readMinutes} min read
              </span>
              <h3 className="d-2 mt-4 text-fg transition-colors duration-500 group-hover:text-accent">
                {lead.title}
              </h3>
              <p className="mt-5 max-w-md text-[0.93rem] leading-relaxed text-muted">
                {lead.excerpt}
              </p>
              <span className="label mt-7 inline-flex items-center gap-2 text-accent">
                <span className="draw">Read the guide</span>
              </span>
            </div>
          </Link>
        </Reveal>

        {/* Secondary */}
        <RevealGroup className="mt-14 grid gap-px rule border-t sm:grid-cols-3">
          {rest.map((a) => (
            <RevealItem key={a.slug}>
              <Link
                href={`/insights/${a.slug}`}
                onClick={() => analytics.articleView(a.slug, a.category)}
                className="group block border-b border-line py-7 pr-6 sm:border-b-0 sm:border-r sm:pr-8 sm:last:border-r-0"
              >
                <span className="label text-accent">{a.category}</span>
                <h3 className="mt-3 font-display text-[1.25rem] leading-snug tracking-[-0.015em] text-fg transition-colors duration-500 group-hover:text-accent">
                  {a.title}
                </h3>
                <p className="mt-2.5 text-[0.85rem] leading-relaxed text-faint">
                  {a.excerpt}
                </p>
                <span className="label mt-4 block text-faint">
                  {a.readMinutes} min
                </span>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>

        <div className="mt-12">
          <TextLink href="/insights">Read every guide</TextLink>
        </div>
      </Shell>
    </section>
  );
}

/* ══════════════════════════════════════════ CHAPTER 09 — FINAL ═══ */

export function Final() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["12%", "0%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.15, 1]);

  return (
    <section
      ref={ref}
      className="plate plate-deep grain relative flex min-h-[70svh] items-center overflow-hidden tone-deep py-20"
    >
      <motion.div
        className="absolute inset-0 -z-10"
        style={reduced ? undefined : { y, scale }}
      >
        <Image
          src="/images/plate-departure.webp"
          alt=""
          fill
          sizes="100vw"
          loading="lazy"
          className="object-cover"
        />
      </motion.div>

      <div
        aria-hidden
        className="bloom-moss pointer-events-none absolute -bottom-40 right-[18%] -z-10 h-[34rem] w-[34rem] opacity-45"
      />
      <div
        aria-hidden
        className="graticule mask-radial pointer-events-none absolute inset-0 -z-10 opacity-60"
      />

      <Shell className="relative">
        <div className="max-w-4xl">
          <Chapter index="10" label="Your move" className="mb-10" />

          <MaskedLines
            as="h2"
            className="d-hero text-fg"
            lines={[
              "Your Next Chapter",
              <Fragment key="Waiting">
                Is <span className="d-em">Waiting</span>.
              </Fragment>,
            ]}
          />

          <Reveal delay={0.2}>
            <p className="lede mt-9 max-w-xl">
              You don&rsquo;t need to have everything figured out. You just need
              to know you&rsquo;re ready to find out what&rsquo;s next.
            </p>
          </Reveal>

          <Reveal delay={0.28}>
            <div className="mt-11 flex flex-wrap items-center gap-3">
              <Action
                href="/contact#journey"
                size="lg"
                magnetic
                onClick={() => analytics.ctaClick("Start Your Journey", "final")}
              >
                Start your journey
              </Action>
              <Action
                href={`https://wa.me/${company.contact.whatsapp}`}
                external
                variant="line"
                size="lg"
                onClick={() => analytics.whatsapp("final")}
              >
                Talk to SnZ Ventures
              </Action>
            </div>
          </Reveal>

          <Reveal delay={0.36}>
            <p className="mt-8 text-[0.82rem] text-faint">
              A real person replies. If we&rsquo;re not the right fit,
              we&rsquo;ll tell you that too.
            </p>
          </Reveal>
        </div>
      </Shell>
    </section>
  );
}
