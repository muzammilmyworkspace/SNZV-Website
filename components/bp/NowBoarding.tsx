import Image from "next/image";
import Link from "next/link";
import { studyDestinations, type StudyDestination } from "@/data/study";
import { partnerCaveat } from "@/data/partners";
import { PartnerPosters } from "./PartnerPosters";
import { Reveal } from "./Reveal";

/**
 * NOW BOARDING — where students fly, and who we work with when they land.
 *
 * WHY NOT "TOP 10 COUNTRIES". "Top" is a ranking — a factual claim about
 * student numbers or quality that needs a cited source. These ten are the
 * destinations SnZ actually works in (data/study.ts → studyDestinations),
 * which is true, checkable, and the stronger line anyway: "where our students
 * fly". If a sourced ranking is ever supplied, cite it on the page first.
 *
 * Flags are SVG (public/flags), so they are crisp at every density. Two rows
 * travel in opposite directions; both pause on hover and on keyboard focus,
 * and under reduced motion they become a static wrapped grid (boarding.css).
 * The second copy of each row is aria-hidden and untabbable — it exists only
 * to make the loop seamless.
 */

export function NowBoarding() {
  const half = Math.ceil(studyDestinations.length / 2);
  const rowA = studyDestinations.slice(0, half);
  const rowB = studyDestinations.slice(half);

  return (
    <section aria-labelledby="boarding-title" className="relative z-10 py-10 sm:py-14">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <Reveal>
          <p className="bp-eyebrow">Now boarding · {studyDestinations.length} destinations</p>
          <h2 id="boarding-title" className="bp-display bp-h2 mt-5 max-w-4xl">
            Where our students <span className="bp-mark">fly.</span>
          </h2>
          <p className="bp-lede mt-6">
            {studyDestinations.length} European countries, each with English-taught degrees. Hover a flag
            to hold the board.
          </p>
        </Reveal>
      </div>

      <div className="mt-8 space-y-4">
        <Row items={rowA} speed="52s" />
        <Row items={rowB} speed="58s" reverse />
      </div>

      {/* Partnerships */}
      <div id="partners" className="mx-auto mt-12 max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <Reveal>
          <p className="bp-eyebrow">Partnerships</p>
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <h3 className="bp-display bp-h2 mt-5 max-w-3xl">Universities we work with directly.</h3>
            <p className="bp-body max-w-md">
              Every partnership is announced publicly, and more are being signed. New partners land here first.
            </p>
          </div>
        </Reveal>

        <PartnerPosters />
        <p className="mt-5 max-w-3xl text-[0.85rem] leading-relaxed text-[var(--bp-faint)]">{partnerCaveat}</p>
      </div>
    </section>
  );
}

function Row({ items, speed, reverse }: { items: StudyDestination[]; speed: string; reverse?: boolean }) {
  // Repeated so one copy is always wider than the viewport, then doubled for the seamless loop.
  const set = [...items, ...items];
  return (
    <div className="bp-marquee overflow-hidden">
      <div className={`bp-marquee-track${reverse ? " is-rev" : ""}`} style={{ ["--bp-speed" as string]: speed }}>
        <ul className="flex shrink-0 gap-5 pr-5">
          {set.map((d, i) => (
            <Chip key={`${d.slug}-${i}`} d={d} hidden={i >= items.length} />
          ))}
        </ul>
        <ul className="flex shrink-0 gap-5 pr-5" aria-hidden="true">
          {set.map((d, i) => (
            <Chip key={`${d.slug}-b${i}`} d={d} hidden />
          ))}
        </ul>
      </div>
    </div>
  );
}

function Chip({ d, hidden }: { d: StudyDestination; hidden?: boolean }) {
  return (
    <li aria-hidden={hidden || undefined}>
      <Link
        href="/study-abroad#destinations"
        tabIndex={hidden ? -1 : undefined}
        className="group flex w-[340px] items-center gap-4 rounded-2xl border border-[var(--bp-line)] bg-[image:var(--bp-card)] p-3 pr-5 transition-colors duration-300 hover:border-[var(--color-aurora)]"
      >
        <span className="relative h-[52px] w-[78px] shrink-0 overflow-hidden rounded-lg shadow-[0_8px_20px_-8px_rgba(0,0,0,0.8)]">
          <Image src={`/flags/${d.slug}.svg`} alt={`Flag of ${d.country}`} fill sizes="78px" className="object-cover transition-transform duration-700 group-hover:scale-110" />
          <span className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/25" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-baseline justify-between gap-2">
            <span className="truncate font-[family-name:var(--font-grotesk)] text-[1.1rem] font-semibold">{d.country}</span>
            <span className="bp-mono text-[var(--color-runway)]">{d.airport}</span>
          </span>
          <span className="mt-0.5 block truncate text-[0.85rem] text-[var(--bp-muted)]">
            {d.city}
          </span>
        </span>
      </Link>
    </li>
  );
}
