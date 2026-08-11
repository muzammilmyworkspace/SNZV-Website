/**
 * Inner-page primitives, ported to the MERIDIAN system.
 *
 * The site is now dark-first, so the historical tone names map onto the new
 * depth scale rather than onto light surfaces:
 *   light → void      mist → abyss      dark → void + graticule    navy → navy-900
 * Keeping the names avoids churning every page while the surfaces change.
 */
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Action as MeridianAction } from "./Editorial";

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
    default: "max-w-[1360px]",
    wide: "max-w-[1720px]",
  }[size];
  return (
    <div className={cn("mx-auto w-full px-5 sm:px-8 lg:px-12", w, className)}>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ Section */

export function Section({
  children,
  className,
  tone = "light",
  id,
  size = "default",
}: {
  children: ReactNode;
  className?: string;
  tone?: "light" | "mist" | "dark" | "navy";
  id?: string;
  size?: "default" | "tight" | "loose";
}) {
  const pad = {
    tight: "py-16 md:py-20",
    default: "py-20 md:py-28",
    loose: "py-24 md:py-36",
  }[size];

  const tones = {
    light: "bg-void",
    mist: "bg-abyss",
    dark: "bg-void",
    navy: "bg-navy-900",
  }[tone];

  return (
    <section id={id} className={cn("relative text-paper", pad, tones, className)}>
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
    <p className={cn("label flex items-center gap-3 text-moss-400", className)}>
      <span aria-hidden className="inline-block h-px w-8 bg-moss-400/50" />
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
        <Eyebrow className={cn("mb-5", align === "center" && "justify-center")}>
          {eyebrow}
        </Eyebrow>
      )}
      <As className={cn(As === "h1" ? "d-1" : "d-2", "text-paper")}>{title}</As>
      {lead && <p className="lede mt-5">{lead}</p>}
    </div>
  );
}

/* ------------------------------------------------------------------- Button */

/** Legacy alias so existing pages keep working; renders the MERIDIAN action. */
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

/** Retained for call sites that render an arrow inline; the Action supplies its own. */
export function Arrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden className={cn("h-3 w-3", className)}>
      <path
        d="M1 6h9M6.5 2.5L10 6l-3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* -------------------------------------------------------------- PlateLink */

/** Editorial link block used where a card would previously have been. */
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
