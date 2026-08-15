"use client";

import Link from "next/link";
import { useRef, type ReactNode, type MouseEvent } from "react";
import { motion, useReducedMotion, useInView } from "motion/react";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════ Shell ═══ */

export function Shell({
  children,
  className,
  bleed = false,
}: {
  children: ReactNode;
  className?: string;
  bleed?: boolean;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full",
        bleed ? "max-w-[1720px] px-4 sm:px-6" : "max-w-[1360px] px-5 sm:px-8 lg:px-12",
        className
      )}
    >
      {children}
    </div>
  );
}

/* ═════════════════════════════════════════════════════ Chapter ═══ */

/**
 * Chapter marker — the atlas voice. A number, a rule and a label.
 * Replaces the conventional "eyebrow" and gives the page its spine.
 */
export function Chapter({
  index,
  label,
  tone = "dark",
  className,
}: {
  index: string;
  label: string;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      {/*
        `tone` is retained for call-site compatibility but no longer selects a
        colour: the accent, the rule and the label all read from the tone band
        they sit in, so they follow the theme automatically.
      */}
      <span className="label num text-accent">{index}</span>
      <motion.span
        aria-hidden
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "320px 0px -5% 0px" }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="grad-rule h-px w-10 origin-left opacity-80 sm:w-16"
      />
      <span className="label text-muted">{label}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════ MaskedLines ═══ */

/**
 * Display type revealed line-by-line from behind a mask.
 * Each line is a separate overflow-hidden block, so the type appears to rise
 * off the page rather than fade in — the entrance the whole site is built on.
 */
export function MaskedLines({
  lines,
  className,
  delay = 0,
  as: As = "h2",
  animate = "inView",
}: {
  lines: ReactNode[];
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p" | "div";
  animate?: "inView" | "mount";
}) {
  const reduced = useReducedMotion();
  const hostRef = useRef<HTMLElement>(null);

  /**
   * The observer watches the HEADING, not the individual lines.
   *
   * Each line starts translated 104% down, which places it entirely outside
   * its own `overflow-hidden` wrapper. IntersectionObserver intersects with
   * ancestor clip rects, so a per-line `whileInView` observer would report zero
   * intersection forever and the reveal would never fire. Observing the
   * unclipped host and driving every line from that one flag avoids it.
   */
  const inView = useInView(hostRef, { once: true, margin: "320px 0px -5% 0px" });
  const play = animate === "mount" || inView;

  return (
    <As className={className} ref={hostRef as never}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden">
          <motion.span
            className="block"
            initial={{ y: reduced ? 0 : "104%" }}
            animate={play ? { y: 0 } : { y: reduced ? 0 : "104%" }}
            transition={{
              duration: reduced ? 0.2 : 1.05,
              delay: play ? delay + i * 0.085 : 0,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </As>
  );
}

/* ═══════════════════════════════════════════════════ Reveal ═══ */

export function Reveal({
  children,
  delay = 0,
  y = 18,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "p" | "article" | "section";
}) {
  const reduced = useReducedMotion();
  const M = motion[as] as typeof motion.div;
  return (
    <M
      className={className}
      initial={{ opacity: 0, y: reduced ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "320px 0px -5% 0px" }}
      transition={{ duration: reduced ? 0.2 : 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </M>
  );
}

/* ═══════════════════════════════════════════════ RevealGroup ═══ */

export function RevealGroup({
  children,
  className,
  stagger = 0.09,
  delay = 0,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  as?: "div" | "ul" | "ol" | "dl";
}) {
  const M = motion[as] as typeof motion.div;
  return (
    <M
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "320px 0px -5% 0px" }}
      variants={{
        hidden: {},
        show: { transition: { delayChildren: delay, staggerChildren: stagger } },
      }}
    >
      {children}
    </M>
  );
}

export function RevealItem({
  children,
  className,
  y = 16,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  y?: number;
  as?: "div" | "li" | "article";
}) {
  const reduced = useReducedMotion();
  const M = motion[as] as typeof motion.div;
  return (
    <M
      className={className}
      variants={{
        hidden: { opacity: 0, y: reduced ? 0 : y },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: reduced ? 0.2 : 0.8, ease: [0.16, 1, 0.3, 1] },
        },
      }}
    >
      {children}
    </M>
  );
}

/* ═════════════════════════════════════════════════ Magnetic ═══ */

/**
 * Cursor-magnetic wrapper. The child leans toward the pointer, then springs
 * back on exit. Disabled for reduced motion and on touch (no hover).
 */
export function Magnetic({
  children,
  strength = 0.28,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  const onMove = (e: MouseEvent<HTMLSpanElement>) => {
    if (reduced || !ref.current) return;
    if (!window.matchMedia("(hover: hover)").matches) return;
    const r = ref.current.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    ref.current.style.transform = `translate3d(${x * strength}px, ${y * strength}px, 0)`;
  };

  const reset = () => {
    if (!ref.current) return;
    ref.current.style.transform = "translate3d(0,0,0)";
  };

  return (
    <span
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      className={cn("inline-block will-change-transform", className)}
      style={{ transition: "transform 0.55s cubic-bezier(0.16,1,0.3,1)" }}
    >
      {children}
    </span>
  );
}

/* ═══════════════════════════════════════════════════ Action ═══ */

type ActionVariant = "solid" | "line" | "ghost" | "quiet";

/**
 * The CTA. A slab with a travelling sheen and an arrow that departs its slot —
 * deliberately not a rounded pill.
 */
export function Action({
  children,
  href,
  onClick,
  variant = "solid",
  size = "md",
  className,
  external,
  type = "button",
  magnetic = false,
  ariaLabel,
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: ActionVariant;
  size?: "sm" | "md" | "lg";
  className?: string;
  external?: boolean;
  type?: "button" | "submit";
  magnetic?: boolean;
  ariaLabel?: string;
}) {
  const sizes = {
    sm: "h-9 px-4 text-[0.74rem]",
    md: "h-12 px-6 text-[0.78rem]",
    lg: "h-14 px-8 text-[0.8rem]",
  }[size];

  const variants = {
    /**
     * Brand gradient fill. `bg-moss-400` stays as the base layer so the label
     * never sits on a bare surface if the gradient fails to paint, and the
     * shadow blends both hues so the glow reads as the mark rather than as a
     * green light source.
     */
    solid:
      "grad-brand bg-moss-400 text-void shadow-[0_10px_34px_-14px_rgba(61,113,201,0.55),0_10px_34px_-14px_rgba(114,196,60,0.55)] hover:shadow-[0_14px_40px_-12px_rgba(61,113,201,0.7),0_14px_40px_-12px_rgba(114,196,60,0.7)]",
    line: "border border-line text-fg hover:border-moss-400/70 hover:text-accent backdrop-blur-[2px]",
    ghost: "border border-ink/15 text-ink hover:border-moss-600/60 hover:text-accent",
    quiet: "text-muted hover:text-fg",
  }[variant];

  const inner = (
    <span
      className={cn(
        "group/act relative inline-flex items-center justify-center gap-3 overflow-hidden whitespace-nowrap rounded-[var(--radius-sm)] font-semibold uppercase tracking-[0.12em] transition-all duration-500 ease-[var(--ease-out-expo)]",
        sizes,
        variants,
        className
      )}
    >
      {/* travelling sheen */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-[900ms] ease-[var(--ease-out-expo)] group-hover/act:translate-x-full"
      />
      <span className="relative">{children}</span>
      <span aria-hidden className="relative h-3 w-3 overflow-hidden">
        <svg
          viewBox="0 0 12 12"
          fill="none"
          className="absolute inset-0 h-3 w-3 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/act:translate-x-4"
        >
          <path
            d="M1 6h9M6.5 2.5L10 6l-3.5 3.5"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <svg
          viewBox="0 0 12 12"
          fill="none"
          className="absolute inset-0 h-3 w-3 -translate-x-4 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/act:translate-x-0"
        >
          <path
            d="M1 6h9M6.5 2.5L10 6l-3.5 3.5"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </span>
  );

  const wrapped = magnetic ? <Magnetic>{inner}</Magnetic> : inner;

  if (href) {
    return external ? (
      <a
        href={href}
        onClick={onClick}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
        className="inline-block"
      >
        {wrapped}
      </a>
    ) : (
      <Link href={href} onClick={onClick} aria-label={ariaLabel} className="inline-block">
        {wrapped}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} aria-label={ariaLabel} className="inline-block">
      {wrapped}
    </button>
  );
}

/* ══════════════════════════════════════════════════ TextLink ═══ */

export function TextLink({
  href,
  children,
  tone = "dark",
  className,
  onClick,
  external,
}: {
  href: string;
  children: ReactNode;
  tone?: "dark" | "light";
  className?: string;
  onClick?: () => void;
  external?: boolean;
}) {
  const cls = cn(
    "group inline-flex items-center gap-2 label transition-colors",
    tone === "dark" ? "text-accent hover:text-accent" : "text-accent hover:text-moss-600",
    className
  );
  const body = (
    <>
      <span className="draw">{children}</span>
      <svg viewBox="0 0 12 12" fill="none" aria-hidden className="h-2.5 w-2.5 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1">
        <path d="M1 6h9M6.5 2.5L10 6l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </>
  );

  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" onClick={onClick} className={cls}>
      {body}
    </a>
  ) : (
    <Link href={href} onClick={onClick} className={cls}>
      {body}
    </Link>
  );
}

/* ══════════════════════════════════════════════════ Notices ═══ */

export function Caveat({
  children,
  tone = "dark",
  className,
}: {
  children: ReactNode;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <p
      className={cn(
        "mt-8 max-w-2xl border-l pl-5 text-[0.78rem] leading-relaxed",
        "border-line text-faint",
        className
      )}
    >
      {children}
    </p>
  );
}

/** Visible in development only — never ships a gap to a visitor. */
export function ContentRequired({
  label,
  items,
}: {
  label: string;
  items?: string[];
}) {
  if (process.env.NODE_ENV === "production") return null;
  return (
    <aside
      data-content-required
      className="my-8 rounded-[var(--radius-sm)] border border-dashed border-amber-400/60 bg-amber-400/10 p-5 text-[0.82rem] text-amber-200"
    >
      <p className="label text-amber-300">[Content required] — {label}</p>
      {items && (
        <ul className="mt-3 space-y-1.5 pl-4 list-disc marker:text-amber-500/70">
          {items.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      )}
    </aside>
  );
}

export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
