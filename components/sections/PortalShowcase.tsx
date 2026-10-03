"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { useSafeReducedMotion } from "@/lib/use-safe-reduced-motion";
import {
  Container,
  Section,
  Eyebrow,
  MaskedLines,
  Reveal,
  Action,
} from "@/components/ui/Primitives";
import { portalShots, portalPoints, portalVideo } from "@/data/portal";
import { company } from "@/data/company";
import { analytics } from "@/lib/analytics";

/**
 * THE CLIENT PORTAL — the section this homepage exists to feed.
 *
 * Everything above it argues that SnZ is worth talking to. This is the thing a
 * student actually gets, so it shows the software rather than describing it.
 *
 * THE SCREENSHOTS ARE THE REAL PORTAL and contain nobody real. They are
 * captured against a throwaway database of invented people by
 * scripts/portal-shots.mjs — not the live portal with the names blurred,
 * because a blur is a filter over data that is still in the file. A student's
 * name, email, passport number and documents are all on those screens.
 *
 * TABBED, NOT A CAROUSEL. Four screens on a timer is four screens nobody
 * chooses to look at, and the one somebody wants is always the one that just
 * slid away. Tabs put the reader in charge and cost one click.
 *
 * ONE IMAGE IS LOADED EAGERLY, the rest on demand — four 1600px screenshots
 * eagerly loaded is most of a mobile page budget spent on pictures of a
 * product the reader has not asked to see yet.
 */
export function PortalShowcase() {
  const reduced = useSafeReducedMotion();
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  /*
    A small parallax lift on the frame as the section passes. Transform only,
    on one element — the budget version of the tilt that makes a product shot
    look placed rather than pasted.
  */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const lift = useTransform(scrollYProgress, [0, 1], ["3%", "-3%"]);

  const shot = portalShots[active];

  return (
    <Section id="portal" tone="deep" className="anchor-target overflow-hidden">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start lg:gap-14">
          {/* ---------------------------------------------------- the pitch */}
          <div className="lg:sticky lg:top-28">
            <Eyebrow className="mb-5">Your client portal</Eyebrow>
            <MaskedLines
              as="h2"
              className="d-2 max-w-[13ch] text-fg-strong"
              lines={["Your whole", "application,", "in one place."]}
            />
            <p className="lede mt-5 max-w-md">
              Every student we take on gets an account. It is the same record
              your advisor works from, which is what makes &ldquo;where are we
              up to?&rdquo; a question you can answer yourself.
            </p>

            <ul className="mt-9 space-y-6 border-t border-line pt-8">
              {portalPoints.map((p, i) => (
                <motion.li
                  key={p.title}
                  initial={{ opacity: 0, y: reduced ? 0 : 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                  transition={{
                    duration: reduced ? 0.2 : 0.55,
                    delay: reduced ? 0 : i * 0.07,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <h3 className="text-[1rem] font-semibold tracking-[-0.01em] text-fg-strong">
                    {p.title}
                  </h3>
                  <p className="mt-1.5 text-[0.88rem] leading-relaxed text-muted">
                    {p.body}
                  </p>
                </motion.li>
              ))}
            </ul>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Action
                href={company.portalUrl}
                external
                onClick={() => analytics.ctaClick("Portal login", "portal_section")}
              >
                Log in
              </Action>
              <Action href="/contact#journey" variant="line">
                Ask how it works
              </Action>
            </div>
          </div>

          {/* ------------------------------------------------- the product */}
          <div ref={ref}>
            {/*
              TABS, WIRED PROPERLY. role="tab" with aria-selected and a
              tabpanel, so a screen reader is told there are four screens and
              which one is showing — a row of buttons that silently swaps an
              image announces nothing at all.
            */}
            <div
              role="tablist"
              aria-label="Portal screens"
              className="scrollbar-none -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:px-0"
            >
              {portalShots.map((s, i) => (
                <button
                  key={s.key}
                  type="button"
                  role="tab"
                  id={`portal-tab-${s.key}`}
                  aria-selected={i === active}
                  aria-controls="portal-panel"
                  onClick={() => setActive(i)}
                  className={
                    i === active
                      ? "label relative shrink-0 rounded-[var(--radius-sm)] border border-moss-400/60 px-4 py-2.5 text-accent"
                      : "label relative shrink-0 rounded-[var(--radius-sm)] border border-line px-4 py-2.5 text-muted transition-colors hover:border-line-strong hover:text-fg"
                  }
                >
                  {s.tab}
                </button>
              ))}
            </div>

            <motion.div
              id="portal-panel"
              role="tabpanel"
              aria-labelledby={`portal-tab-${shot.key}`}
              style={{ y: reduced ? 0 : lift }}
              className="mt-5"
            >
              {/*
                A browser chrome around the shot. Three dots and a bar is the
                cheapest, most legible way to say "this is a screen you will
                see", and it stops a flat screenshot reading as a diagram.
              */}
              <div className="overflow-hidden rounded-[var(--radius-lg)] border border-line-strong bg-raised shadow-[0_40px_90px_-40px_rgba(2,6,16,0.75)]">
                <div className="flex items-center gap-2 border-b border-line px-4 py-3">
                  <span aria-hidden className="flex gap-1.5">
                    <span className="block h-2 w-2 rounded-full bg-[var(--line-strong)]" />
                    <span className="block h-2 w-2 rounded-full bg-[var(--line-strong)]" />
                    <span className="block h-2 w-2 rounded-full bg-[var(--line-strong)]" />
                  </span>
                  <span className="num ml-2 truncate text-[0.72rem] text-faint">
                    portal.snzventures.com
                  </span>
                </div>

                {/*
                  The aspect ratio is fixed to what the shots are captured at
                  (1280×900 → 32:22.5), so switching tabs cannot resize the
                  frame and shove the page around. That is the CLS this section
                  would otherwise contribute all by itself.
                */}
                <div className="relative aspect-[1280/900] w-full bg-raised">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={shot.key}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: reduced ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={shot.file}
                        alt={shot.alt}
                        fill
                        sizes="(max-width: 1024px) 100vw, 56rem"
                        /* Only the first screen is worth the bytes up front. */
                        priority={active === 0}
                        className="object-cover object-top"
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              <p
                /* aria-live, because changing a tab changes this sentence and
                   a sighted user sees that happen while a screen-reader user
                   would not be told. */
                aria-live="polite"
                className="mt-4 max-w-xl text-[0.88rem] leading-relaxed text-muted"
              >
                {shot.caption}
              </p>

              <p className="mt-3 text-[0.78rem] leading-relaxed text-faint">
                Real screens from the portal. Every name, document and figure in
                them is invented — no client&rsquo;s record appears on this site.
              </p>
            </motion.div>

            <PortalVideo />
          </div>
        </div>
      </Container>
    </Section>
  );
}

/**
 * The walkthrough video.
 *
 * NOTHING LOADS UNTIL PLAY IS PRESSED — not a player, not a third-party
 * script, not a cookie. With no `src` it renders the gap honestly rather than
 * a broken player, which is the same contract components/sections/VideoFeature
 * holds to for the three pathway videos.
 */
function PortalVideo() {
  const [playing, setPlaying] = useState(false);
  const has = Boolean(portalVideo.src);

  const embed = () => {
    if (!portalVideo.src) return "";
    if (portalVideo.provider === "youtube") {
      return `https://www.youtube-nocookie.com/embed/${portalVideo.src}?autoplay=1&rel=0&modestbranding=1`;
    }
    if (portalVideo.provider === "vimeo") {
      return `https://player.vimeo.com/video/${portalVideo.src}?autoplay=1&dnt=1`;
    }
    return portalVideo.src;
  };

  return (
    <Reveal delay={0.1}>
      <div className="mt-8 rounded-[var(--radius-lg)] border border-line bg-raised p-5 sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <div>
            <span className="label text-accent">{portalVideo.eyebrow}</span>
            <h3 className="mt-1.5 text-[1.05rem] font-semibold tracking-[-0.015em] text-fg-strong">
              {portalVideo.title}
            </h3>
          </div>
          <span className="num text-[0.75rem] text-faint">{portalVideo.durationLabel}</span>
        </div>

        <p className="mt-2.5 max-w-xl text-[0.88rem] leading-relaxed text-muted">
          {portalVideo.lead}
        </p>

        <div className="relative mt-5 aspect-video w-full overflow-hidden rounded-[var(--radius-md)] border border-line bg-surface">
          {playing && has ? (
            portalVideo.provider === "file" ? (
              // eslint-disable-next-line jsx-a11y/media-has-caption
              <video
                src={portalVideo.src!}
                controls
                autoPlay
                preload="none"
                className="h-full w-full object-cover"
              />
            ) : (
              <iframe
                src={embed()}
                title={portalVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            )
          ) : (
            <>
              <Image
                src={portalVideo.poster}
                alt={portalVideo.posterAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 56rem"
                loading="lazy"
                className="object-cover object-top opacity-35"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
                {has ? (
                  <button
                    type="button"
                    onClick={() => setPlaying(true)}
                    aria-label={`Play: ${portalVideo.title}`}
                    className="flex h-16 w-16 items-center justify-center rounded-full border border-moss-400/60 bg-surface/80 text-accent backdrop-blur transition-transform duration-500 ease-[var(--ease-out-expo)] hover:scale-110"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="ml-1 h-6 w-6">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                ) : (
                  <>
                    {/*
                      THE GAP, STATED. Not a dead play button and not a stock
                      clip standing in for one — either would be a promise the
                      page cannot keep. The frame, the ratio and the layout are
                      final, so arriving at the real file is a one-line change
                      in data/portal.ts.
                    */}
                    <span className="label rounded-[var(--radius-sm)] border border-dashed border-line-strong px-3 py-2 text-faint">
                      {portalVideo.requirement}
                    </span>
                    <p className="max-w-sm text-[0.8rem] leading-relaxed text-faint">
                      {portalVideo.captionsNote}
                    </p>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </Reveal>
  );
}
