"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useSafeReducedMotion } from "@/lib/use-safe-reduced-motion";
import { Container, MaskedLines, Action } from "@/components/ui/Primitives";
import { company } from "@/data/company";
import { analytics } from "@/lib/analytics";

/**
 * THE CLOSING — where the page's line finally lands.
 *
 * Replaces the previous closing, which was a full-bleed photograph of an
 * aircraft wing with the type laid over it. On a site whose whole visual
 * argument is a drawn line, ending on a stock plate undoes the argument in
 * the last screen — and it was the fourth photographic plate on one page.
 *
 * The route that opened the hero arrives here and stops on a node. That is
 * the only reason this section has artwork at all: it closes the through-line
 * rather than decorating the call to action.
 *
 * TWO ACTIONS, FOR TWO PEOPLE. Somebody who has read the whole page wants to
 * talk to us; somebody who is already a client wants their file. Both are
 * here, and the one that still has to persuade is the filled one.
 */

/**
 * The arriving route, in this section's own 1200×180 space.
 *
 * Confined to a band ABOVE the type, not laid behind it. The first version
 * spanned 300px and the heading sat inside that band, so a 2px gradient stroke
 * ran straight through "Tell us where" — the same mistake the hero made, and
 * the same fix: the line gets its own air and the words get theirs.
 */
const LANDING = "M -40 168 C 300 168 520 112 760 72 C 940 42 1080 28 1240 22";

export function Invitation() {
  const reduced = useSafeReducedMotion();
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "end 0.95"],
  });
  const draw = useTransform(scrollYProgress, (v) => 1 - v);

  return (
    <section
      ref={ref}
      /* Top padding clears the route band above; see LANDING. */
      className="tone-deep relative overflow-hidden pb-24 pt-48 md:pb-32 md:pt-56"
    >
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[180px]">
        <svg
          viewBox="0 0 1200 180"
          fill="none"
          preserveAspectRatio="xMidYMin slice"
          className="h-full w-full"
        >
          <defs>
            <linearGradient id="landing-route" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--brand-blue)" />
              <stop offset="50%" stopColor="var(--brand-teal)" />
              <stop offset="100%" stopColor="var(--brand-green)" />
            </linearGradient>
          </defs>
          <path
            d={LANDING}
            stroke="var(--line-strong)"
            strokeWidth={1}
            strokeDasharray="2 7"
            strokeLinecap="round"
          />
          <motion.path
            d={LANDING}
            pathLength={1}
            stroke="url(#landing-route)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeDasharray={1}
            style={{ strokeDashoffset: reduced ? 0 : draw }}
          />
          <circle cx={1240} cy={22} r={4} fill="var(--brand-green)" />
          <circle
            cx={1240}
            cy={22}
            r={4}
            fill="none"
            stroke="var(--brand-green)"
            strokeOpacity={0.5}
            className="breathe"
          />
        </svg>
      </div>

      <div
        aria-hidden
        className="bloom-royal pointer-events-none absolute -left-40 bottom-0 h-[34rem] w-[34rem] opacity-40"
      />

      <Container className="relative">
        <div className="max-w-3xl">
          <span className="label text-accent">Your move</span>

          <MaskedLines
            as="h2"
            className="d-1 mt-6 max-w-[16ch] text-fg-strong"
            lines={["Tell us where", "you want to end up."]}
          />

          <p className="lede mt-6 max-w-xl">
            Not which course, not which company structure — where you want to
            be. The route is the part we work out, and the first conversation
            costs nothing.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Action
              href="/contact#journey"
              size="lg"
              onClick={() => analytics.ctaClick("Book a consultation", "closing")}
            >
              Book a consultation
            </Action>
            <Action
              href={company.portalUrl}
              external
              variant="line"
              size="lg"
              onClick={() => analytics.ctaClick("Portal login", "closing")}
            >
              I already have an account
            </Action>
          </div>

          {/*
            The direct routes, under the form-shaped one. Somebody who has
            scrolled this far and still wants to phone a human should not have
            to find the footer to do it.
          */}
          <dl className="mt-14 grid gap-x-10 gap-y-6 border-t border-line pt-8 sm:grid-cols-3">
            <div>
              <dt className="label text-faint">Call</dt>
              <dd className="mt-1.5">
                <a
                  href={`tel:${company.contact.phoneHref}`}
                  onClick={() => analytics.phone("closing")}
                  className="num inline-flex min-h-11 items-center text-[0.95rem] text-fg transition-colors hover:text-accent"
                >
                  {company.contact.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="label text-faint">Email</dt>
              <dd className="mt-1.5">
                <a
                  href={`mailto:${company.contact.email}`}
                  onClick={() => analytics.email("closing")}
                  className="inline-flex min-h-11 items-center break-all text-[0.95rem] text-fg transition-colors hover:text-accent"
                >
                  {company.contact.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="label text-faint">Office</dt>
              <dd className="mt-1.5 text-[0.95rem] leading-snug text-muted">
                {company.contact.streetAddress}
                <br />
                {company.contact.city}, {company.contact.country}
              </dd>
            </div>
          </dl>
        </div>
      </Container>
    </section>
  );
}
