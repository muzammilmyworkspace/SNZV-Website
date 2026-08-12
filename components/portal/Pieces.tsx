import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * PORTAL UI VOCABULARY
 * ---------------------------------------------------------------------------
 * Classic rather than trendy: layered surfaces with a hairline top highlight,
 * small-caps labels, tabular numerals, and accent colour reserved almost
 * entirely for the single primary action and for progress. Restraint is what
 * makes a workspace feel expensive — not more colour.
 */

/* ---------------------------------------------------------- PortalHeading */

export function PortalHeading({
  eyebrow,
  title,
  lead,
  action,
  meta,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  action?: ReactNode;
  meta?: ReactNode;
}) {
  return (
    <header className="mb-9">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          {eyebrow && (
            <p className="label mb-3 flex items-center gap-3 text-accent">
              <span aria-hidden className="inline-block h-px w-6 bg-current opacity-50" />
              {eyebrow}
            </p>
          )}
          <h1 className="text-[1.75rem] font-bold leading-[1.1] tracking-[-0.03em] text-fg-strong sm:text-[2.15rem]">
            {title}
          </h1>
          {lead && (
            <p className="mt-2.5 max-w-2xl text-[0.94rem] leading-relaxed text-muted">
              {lead}
            </p>
          )}
        </div>
        {action}
      </div>
      {meta && <div className="mt-6">{meta}</div>}
      <div
        aria-hidden
        className="mt-7 h-px bg-gradient-to-r from-[color:var(--line-strong)] via-[color:var(--line)] to-transparent"
      />
    </header>
  );
}

/* -------------------------------------------------------------------- Panel */

/**
 * Layered surface. The inset top highlight is what separates it from the page
 * without needing a heavy border or a drop shadow.
 */
export function Panel({
  children,
  className,
  title,
  action,
  accent = false,
  padded = true,
}: {
  children: ReactNode;
  className?: string;
  title?: string;
  action?: ReactNode;
  accent?: boolean;
  padded?: boolean;
}) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-[var(--radius-lg)] border",
        "bg-gradient-to-b from-[color-mix(in_srgb,var(--fg)_5%,transparent)] to-[color-mix(in_srgb,var(--fg)_2%,transparent)]",
        "shadow-[inset_0_1px_0_color-mix(in_srgb,var(--fg)_9%,transparent)]",
        accent ? "border-moss-400/30" : "border-line",
        className
      )}
    >
      {(title || action) && (
        <header className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
          {title && (
            <h2 className="label text-faint">{title}</h2>
          )}
          {action}
        </header>
      )}
      <div className={cn(padded && "p-5")}>{children}</div>
    </section>
  );
}

/* --------------------------------------------------------------- EmptyState */

/**
 * Compact and calm. The previous version used a large dashed box, which read
 * as unfinished rather than deliberate — several of them on one screen made
 * the whole workspace look broken.
 */
export function EmptyState({
  icon = "file",
  title,
  body,
  action,
  note,
}: {
  icon?: "file" | "message" | "calendar" | "bell" | "check" | "search";
  title: string;
  body: string;
  action?: { label: string; href: string };
  note?: string;
}) {
  const paths: Record<string, string> = {
    file: "M6 3h6l4 4v11H6zM12 3v4h4",
    message: "M3 4h16v11h-9l-4 4v-4H3z",
    calendar: "M4 5h14v13H4zM4 9h14M8 3v3M14 3v3",
    bell: "M11 3a5 5 0 00-5 5c0 4-2 5.5-2 5.5h14S16 12 16 8a5 5 0 00-5-5zM9 17a2 2 0 004 0",
    check: "M4 11l4 4 9-9",
    search: "M9.5 15a5.5 5.5 0 100-11 5.5 5.5 0 000 11zM13.5 13.5L18 18",
  };

  return (
    <div className="flex items-start gap-4 py-2">
      <span
        aria-hidden
        className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-faint"
      >
        <svg viewBox="0 0 22 22" fill="none" className="h-4 w-4">
          <path
            d={paths[icon]}
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <div className="min-w-0">
        <p className="text-[0.94rem] font-semibold text-fg">{title}</p>
        <p className="mt-1.5 max-w-md text-[0.86rem] leading-relaxed text-muted">
          {body}
        </p>
        {action && (
          <Link
            href={action.href}
            className="label mt-4 inline-flex items-center gap-2 text-accent transition-opacity hover:opacity-80"
          >
            <span className="draw">{action.label}</span>
            <svg viewBox="0 0 12 12" fill="none" aria-hidden className="h-2.5 w-2.5">
              <path d="M1 6h9M6.5 2.5L10 6l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        )}
        {note && <p className="mt-3 text-[0.76rem] leading-relaxed text-faint">{note}</p>}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------- Status */

const STATUS_TONE: Record<string, string> = {
  approved: "text-moss-300 border-moss-400/35 bg-moss-400/10",
  completed: "text-moss-300 border-moss-400/35 bg-moss-400/10",
  confirmed: "text-moss-300 border-moss-400/35 bg-moss-400/10",
  in_progress: "text-navy-100 border-line bg-transparent",
  submitted: "text-navy-100 border-line bg-transparent",
  under_review: "text-navy-100 border-line bg-transparent",
  pending_review: "text-navy-100 border-line bg-transparent",
  uploaded: "text-navy-100 border-line bg-transparent",
  awaiting_response: "text-amber-200 border-amber-400/35 bg-amber-400/10",
  documents_required: "text-amber-200 border-amber-400/35 bg-amber-400/10",
  needs_update: "text-amber-200 border-amber-400/35 bg-amber-400/10",
  required: "text-amber-200 border-amber-400/35 bg-amber-400/10",
  draft: "text-faint border-line bg-transparent",
  requested: "text-faint border-line bg-transparent",
  cancelled: "text-faint border-line bg-transparent",
};

export function StatusPill({ status, label }: { status: string; label: string }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full border px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.1em]",
        STATUS_TONE[status] ?? "text-faint border-line"
      )}
    >
      {label}
    </span>
  );
}

/* ----------------------------------------------------------------- Progress */

export function ProgressBar({ value, label }: { value: number; label?: string }) {
  const v = Math.min(100, Math.max(0, value));
  return (
    <div>
      {label && (
        <div className="mb-2.5 flex items-baseline justify-between">
          <span className="label text-faint">{label}</span>
          <span className="num text-[0.9rem] font-bold text-fg">{v}%</span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={v}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? "Progress"}
        className="h-1 w-full overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--fg)_10%,transparent)]"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-moss-600 via-moss-400 to-moss-300 transition-[width] duration-[900ms] ease-[var(--ease-out-expo)]"
          style={{ width: `${v}%` }}
        />
      </div>
    </div>
  );
}

/** Circular progress — used where a figure deserves more weight than a bar. */
export function ProgressRing({
  value,
  size = 96,
  label,
}: {
  value: number;
  size?: number;
  label?: string;
}) {
  const v = Math.min(100, Math.max(0, value));
  const stroke = 5;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;

  return (
    <div className="flex items-center gap-4">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90"
          width={size}
          height={size}
          role="progressbar"
          aria-valuenow={v}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={label ?? "Completion"}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="currentColor"
            strokeWidth={stroke}
            className="text-[color-mix(in_srgb,var(--fg)_10%,transparent)]"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="url(#ring)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={c - (c * v) / 100}
            style={{ transition: "stroke-dashoffset 900ms cubic-bezier(0.16,1,0.3,1)" }}
          />
          <defs>
            <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#4F9628" />
              <stop offset="100%" stopColor="#93D667" />
            </linearGradient>
          </defs>
        </svg>
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="num text-[1.35rem] font-bold leading-none text-fg-strong">
            {v}
            <span className="text-[0.8rem] font-semibold text-faint">%</span>
          </span>
        </span>
      </div>
      {label && <span className="text-[0.88rem] leading-snug text-muted">{label}</span>}
    </div>
  );
}

/* ------------------------------------------------------------- JourneyTrack */

/**
 * The stage sequence, drawn as a connected track rather than a flat grid so
 * progression is legible at a glance. `current` is the index of the active
 * stage; -1 means an advisor has not set one yet, which is the honest default.
 */
export function JourneyTrack({
  stages,
  current = -1,
}: {
  stages: readonly { key: string; name: string; description: string }[];
  current?: number;
}) {
  return (
    <ol className="relative">
      {stages.map((stage, i) => {
        const done = current > -1 && i < current;
        const active = i === current;
        const last = i === stages.length - 1;

        return (
          <li key={stage.key} className="relative flex gap-5 pb-7 last:pb-0">
            {/* connector */}
            {!last && (
              <span
                aria-hidden
                className={cn(
                  "absolute left-[15px] top-8 bottom-0 w-px",
                  done ? "bg-moss-400/50" : "bg-[color-mix(in_srgb,var(--fg)_12%,transparent)]"
                )}
              />
            )}

            {/* marker */}
            <span
              aria-hidden
              className={cn(
                "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-[0.68rem] font-bold tabular-nums",
                active
                  ? "border-moss-400 bg-moss-400 text-navy-950"
                  : done
                    ? "border-moss-400/50 bg-moss-400/15 text-moss-300"
                    : "border-line bg-[color-mix(in_srgb,var(--fg)_4%,transparent)] text-faint"
              )}
            >
              {done ? (
                <svg viewBox="0 0 12 12" fill="none" className="h-3 w-3">
                  <path d="M2 6.2l2.6 2.6L10 3.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                String(i + 1).padStart(2, "0")
              )}
            </span>

            <div className="min-w-0 pt-1">
              <p
                className={cn(
                  "text-[0.98rem] font-semibold tracking-[-0.01em]",
                  active ? "text-accent" : "text-fg"
                )}
              >
                {stage.name}
                {active && (
                  <span className="label ml-3 rounded-full border border-moss-400/40 bg-moss-400/10 px-2 py-0.5 align-middle text-moss-300">
                    Current
                  </span>
                )}
              </p>
              <p className="mt-1 max-w-xl text-[0.85rem] leading-relaxed text-muted">
                {stage.description}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/* -------------------------------------------------------------- SummaryStat */

export function SummaryStat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="border-l border-line pl-4 first:border-l-0 first:pl-0">
      <p className="label text-faint">{label}</p>
      <p className="num mt-1.5 text-[1.6rem] font-bold leading-none text-fg-strong">
        {value}
      </p>
      {hint && <p className="mt-1 text-[0.76rem] text-faint">{hint}</p>}
    </div>
  );
}

/* ------------------------------------------------------------- DataRow */

export function DataRow({
  label,
  value,
  meta,
}: {
  label: string;
  value: ReactNode;
  meta?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-line py-3 last:border-0">
      <span className="min-w-0 text-[0.89rem] text-fg">{label}</span>
      <span className="flex shrink-0 items-center gap-3">
        {meta}
        {typeof value === "string" ? (
          <span className="label text-faint">{value}</span>
        ) : (
          value
        )}
      </span>
    </div>
  );
}

/* ------------------------------------------------------- BackendRequired */

/**
 * Development-only build note.
 *
 * Hidden in production: a client signing in to their own workspace should
 * never be shown an engineering to-do list. The gap is still visible in every
 * empty state, phrased for them rather than for us.
 */
export function BackendRequired({
  feature,
  needs,
}: {
  feature: string;
  needs: string[];
}) {
  if (process.env.NODE_ENV === "production") return null;
  return (
    <aside
      data-dev-note
      className="rounded-[var(--radius-md)] border border-dashed border-amber-400/30 bg-amber-400/[0.05] p-5"
    >
      <p className="label text-amber-300/80">Dev note — {feature}</p>
      <p className="mt-2 text-[0.83rem] leading-relaxed text-amber-100/70">
        Interface complete, reading from{" "}
        <span className="font-mono text-[0.78rem]">lib/portal/data.ts</span>.
        Hidden in production. Populates once these exist:
      </p>
      <ul className="mt-3 list-disc space-y-1 pl-4 text-[0.81rem] text-amber-100/60 marker:text-amber-400/40">
        {needs.map((n) => (
          <li key={n}>{n}</li>
        ))}
      </ul>
    </aside>
  );
}
