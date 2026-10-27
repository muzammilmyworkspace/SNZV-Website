/**
 * Inner-page primitives.
 *
 * `Section` is the tone boundary: it sets one of four surface classes and
 * every descendant reads --fg / --fg-muted / --line / --surface from it. That
 * is what lets the same card work on deep navy and on white.
 *
 * Legacy tone names are mapped rather than removed so existing call sites keep
 * working; long-form reading surfaces are routed to the light bands.
 */
import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Action as MeridianAction } from "./Editorial";
import { SectionSky } from "@/components/fx/SkyLines";

/**
 * The last word of a heading in the italic serif (`.d-em`, app/skin.css), the
 * way the homepage headlines carry one word. Trailing punctuation stays upright.
 */
export function accentLast(title: string): ReactNode {
  const m = title.match(/^(.*\s)(\S+?)([.!?]?)$/);
  if (!m) return title;
  // Keyed: it is also passed inside the `lines` array of MaskedLines.
  return (
    <Fragment key="accent">
      {m[1]}
      <span className="d-em">{m[2]}</span>
      {m[3]}
    </Fragment>
  );
}

export {
  Reveal,
  RevealGroup,
  RevealItem,
  MaskedLines,
  Chapter,
  Magnetic,
  Action,
  TextLink,
  Caveat,
  ContentRequired,
  JsonLd,
  Shell,
} from "./Editorial";

/* ---------------------------------------------------------------- Container */

export function Container({
  children,
  className,
  size = "default",
}: {
  children: ReactNode;
  className?: string;
  size?: "default" | "wide" | "narrow";
}) {
  const w = {
    narrow: "max-w-[46rem]",
    default: "max-w-[1320px]",
    wide: "max-w-[1680px]",
  }[size];
  return (
    <div className={cn("mx-auto w-full px-5 sm:px-8 lg:px-10", w, className)}>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ Section */

export type Tone = "deep" | "soft" | "paper" | "white";

/** Legacy names from the previous system. */
const TONE_ALIAS: Record<string, Tone> = {
  dark: "deep",
  light: "deep",
  navy: "soft",
  mist: "soft",
  deep: "deep",
  soft: "soft",
  paper: "paper",
  white: "white",
};

const TONE_CLASS: Record<Tone, string> = {
  deep: "tone-deep",
  soft: "tone-soft",
  paper: "tone-light",
  white: "tone-white",
};

export function Section({
  children,
  className,
  tone = "deep",
  id,
  size = "default",
  edge = false,
  decor = true,
}: {
  children: ReactNode;
  className?: string;
  tone?: Tone | "light" | "mist" | "dark" | "navy";
  id?: string;
  size?: "default" | "tight" | "loose";
  /** Adds the gradient hairline used to separate tone bands. */
  edge?: boolean;
  /** Flight routes, a plane and waves behind the content (on by default). */
  decor?: boolean;
}) {
  // Rhythm tightened for density — the old scale left large dead bands.
  const pad = {
    tight: "py-12 md:py-14",
    default: "py-16 md:py-20",
    loose: "py-20 md:py-28",
  }[size];

  const resolved = TONE_ALIAS[tone] ?? "deep";

  return (
    <section
      id={id}
      className={cn("relative", pad, TONE_CLASS[resolved], edge && "edge-top", className)}
    >
      {/* A different flight per tone, so neighbouring bands never repeat. */}
      {decor && <SectionSky variant={{ deep: 1, soft: 2, paper: 3, white: 1 }[resolved]} />}
      {children}
    </section>
  );
}

/* ------------------------------------------------------------------ Eyebrow */

export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
  tone?: "light" | "dark";
}) {
  return (
    <p className={cn("label flex items-center gap-3 text-accent", className)}>
      <span aria-hidden className="inline-block h-[2px] w-7 rounded-full bg-[#6CBF3B]" />
      {children}
    </p>
  );
}

/* ----------------------------------------------------------- SectionHeading */

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  className,
  as: As = "h2",
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  tone?: "light" | "dark";
  align?: "left" | "center";
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && (
        <Eyebrow className={cn("mb-4", align === "center" && "justify-center")}>
          {eyebrow}
        </Eyebrow>
      )}
      <As className={cn(As === "h1" ? "d-1" : "d-2", "text-fg-strong")}>
        {typeof title === "string" ? accentLast(title) : title}
      </As>
      {lead && <p className="lede mt-4">{lead}</p>}
    </div>
  );
}

/* ------------------------------------------------------------------- Button */

/** Legacy alias so existing pages keep working. */
export function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  className,
  onClick,
  type = "button",
  ariaLabel,
  external,
}: {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "ghost" | "onDark";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  ariaLabel?: string;
  external?: boolean;
}) {
  const mapped = (
    { primary: "solid", secondary: "solid", ghost: "line", onDark: "line" } as const
  )[variant];

  return (
    <MeridianAction
      href={href}
      onClick={onClick}
      variant={mapped}
      size={size}
      className={className}
      external={external}
      type={type}
      ariaLabel={ariaLabel}
    >
      {children}
    </MeridianAction>
  );
}

export function Arrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden className={cn("h-3 w-3", className)}>
      <path
        d="M1 6h9M6.5 2.5L10 6l-3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PlateLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link href={href} className={cn("group block", className)}>
      {children}
    </Link>
  );
}
