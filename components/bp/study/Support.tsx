"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { supportServices } from "@/data/study";
import { useReduced } from "@/components/bp/useReduced";
import { Band, SectionHead } from "../page/SectionHead";

/**
 * WHAT'S INCLUDED — the six support services, as an itinerary.
 *
 * A real photograph of a departure hall on one side; on the other, the six
 * services from data/study.ts as stops on a drawn route that fills as it is
 * scrolled past. "From first call to first week" is the promise; this is the
 * list of what that actually means.
 */
export function Support() {
  const reduce = useReduced();
  return (
    <Band id="support" labelledBy="support-title">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHead
            id="support-title"
            eyebrow="What's included"
            title={
              <>
                First call to first week. <span className="bp-outline">One team.</span>
              </>
            }
          />
          <motion.figure
            className="relative mt-8 aspect-[4/3] overflow-hidden rounded-[22px]"
            initial={reduce ? false : { clipPath: "inset(12% 12% 12% 12% round 22px)" }}
            whileInView={{ clipPath: "inset(0% 0% 0% 0% round 22px)" }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image src="/images/careers-airport.webp" alt="A bright, empty airport departure hall" fill sizes="(min-width: 1024px) 40vw, 92vw" className="object-cover" />
            <figcaption className="absolute bottom-3 left-3 rounded-full bg-black/55 px-3 py-1.5 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-white backdrop-blur">
              Where the journey ends and starts
            </figcaption>
          </motion.figure>
        </div>

        <ol className="relative">
          <span aria-hidden className="absolute bottom-6 left-[19px] top-6 w-px bg-[var(--bp-line-strong)]" />
          {supportServices.map((s, i) => (
            <motion.li
              key={s.title}
              className="relative flex gap-6 pb-8 last:pb-0"
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -15% 0px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[var(--color-runway)] bg-[var(--bp-bg)] font-mono text-[0.8rem] text-[var(--color-runway)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="bp-pass-dark flex-1 p-5">
                <h3 className="font-[family-name:var(--font-grotesk)] text-[1.2rem] font-semibold text-[var(--bp-strong)]">{s.title}</h3>
                <p className="bp-body mt-1.5">{s.body}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </Band>
  );
}
