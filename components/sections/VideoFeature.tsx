"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { Container, Section, Chapter, Reveal, MaskedLines } from "@/components/ui/Primitives";
import { analytics } from "@/lib/analytics";
import type { VideoFeatureData } from "@/data/media";

/**
 * Cinematic video section.
 *
 * Performance and privacy are the design constraints:
 *  • Nothing but a poster image loads until the visitor presses play.
 *  • YouTube/Vimeo embeds use their no-cookie / do-not-track hosts and are
 *    only injected on click, so no third-party request happens on page load.
 *  • Native <video> gets preload="none" and controls.
 *
 * With no `src` supplied it renders a clearly-marked placeholder rather than a
 * broken player — the frame, motion and layout are all final, so dropping the
 * real video in later is a one-line data change.
 */
export function VideoFeature({ data }: { data: VideoFeatureData }) {
  const [playing, setPlaying] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);

  const hasVideo = Boolean(data.src);

  const start = () => {
    if (!hasVideo) return;
    analytics.videoPlay(data.pathway);
    setPlaying(true);
  };

  const embedSrc = () => {
    if (!data.src) return "";
    if (data.provider === "youtube") {
      return `https://www.youtube-nocookie.com/embed/${data.src}?autoplay=1&rel=0&modestbranding=1`;
    }
    if (data.provider === "vimeo") {
      return `https://player.vimeo.com/video/${data.src}?autoplay=1&dnt=1`;
    }
    return data.src;
  };

  return (
    <Section tone="soft" edge className="overflow-hidden">
      <div aria-hidden className="graticule pointer-events-none absolute inset-0 opacity-40" />
      <div
        aria-hidden
        className="bloom-royal pointer-events-none absolute -right-40 top-1/4 h-[32rem] w-[32rem] opacity-30"
      />

      <Container className="relative">
        <Chapter index="—" label={data.eyebrow} className="mb-6" />

        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-14">
          <MaskedLines as="h2" className="d-2 max-w-[18ch] text-fg-strong" lines={[data.title]} />
          <Reveal delay={0.1}>
            <p className="max-w-sm text-[0.95rem] leading-relaxed text-muted">
              {data.lead}
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.12} className="mt-10">
          <div ref={ref} className="relative">
            <motion.div
              style={reduced ? undefined : { y }}
              className="plate relative aspect-[16/9] overflow-hidden rounded-[var(--radius-lg)] border border-line"
            >
              {playing && hasVideo ? (
                data.provider === "file" ? (
                  <video
                    className="absolute inset-0 h-full w-full object-cover"
                    src={data.src!}
                    poster={data.poster}
                    controls
                    autoPlay
                    playsInline
                    preload="none"
                  >
                    Your browser does not support the video element.
                  </video>
                ) : (
                  <iframe
                    className="absolute inset-0 h-full w-full"
                    src={embedSrc()}
                    title={data.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                  />
                )
              ) : (
                <>
                  <Image
                    src={data.poster}
                    alt={data.posterAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 80vw"
                    loading="lazy"
                    className="object-cover"
                  />

                  {hasVideo ? (
                    <button
                      type="button"
                      onClick={start}
                      className="group absolute inset-0 z-[3] flex items-center justify-center bg-navy-950/25 transition-colors duration-500 hover:bg-navy-950/40"
                      aria-label={`Play video: ${data.title}`}
                    >
                      <span className="relative flex h-20 w-20 items-center justify-center rounded-full border border-white/40 bg-navy-950/50 backdrop-blur-sm transition-all duration-500 ease-[var(--ease-out-expo)] group-hover:scale-110 group-hover:border-moss-400 group-hover:bg-navy-950/70">
                        <span className="breathe absolute inset-0 rounded-full bg-moss-400/30" />
                        <svg viewBox="0 0 24 24" aria-hidden className="relative ml-1 h-7 w-7 fill-white">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </span>
                    </button>
                  ) : (
                    /* Placeholder — the frame is final, the media is not. */
                    <div className="absolute inset-0 z-[3] flex flex-col items-center justify-center gap-4 bg-navy-950/78 px-6 text-center backdrop-blur-[2px]">
                      <span className="flex h-16 w-16 items-center justify-center rounded-full border border-dashed border-white/40">
                        <svg viewBox="0 0 24 24" aria-hidden className="ml-1 h-6 w-6 fill-white/60">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </span>
                      <p className="label text-moss-300">{data.requirement}</p>
                      <p className="max-w-md text-[0.85rem] leading-relaxed text-white/80">
                        Supply the film and a poster frame in{" "}
                        <span className="font-mono text-[0.8rem]">data/media.ts</span>.
                        The player, framing and motion are already in place.
                      </p>
                    </div>
                  )}
                </>
              )}

              {/* corner ticks */}
              <span aria-hidden className="pointer-events-none absolute left-3 top-3 z-[4] h-5 w-5 border-l border-t border-moss-400/50" />
              <span aria-hidden className="pointer-events-none absolute bottom-3 right-3 z-[4] h-5 w-5 border-b border-r border-moss-400/50" />
            </motion.div>

            <p className="mt-3 text-[0.75rem] text-faint">
              {hasVideo
                ? "Video loads only when you press play — nothing is requested from a third party before that."
                : data.captionsNote}
            </p>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
