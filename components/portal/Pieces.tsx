import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * THE PORTAL DESIGN SYSTEM
 * ---------------------------------------------------------------------------
 * Every portal surface — client and staff — is built from these. The visual
 * language was reworked to match the role-preview design; EVERY EXPORT KEPT ITS
 * NAME AND SIGNATURE so the twenty-two pages that import from here inherited
 * the new look without a single page edit. A prop rename here would have meant
 * twenty-two chances to break a working page for a cosmetic change.
 *
 * COLOUR LIVES IN CSS, NOT IN CLASS LISTS. Status tones resolve through the
 * `.pill-*` classes in globals.css, which are defined per theme. They were
 * previously Tailwind utilities like `text-moss-300`, picked when the site was
 * dark by default — on the light theme that is now the default, a 300-weight
 * colour on near-white is barely readable, and an unreadable status badge is
 * worse than none because the reader assumes they understood it.
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
    <header className="mb-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          {eyebrow && (
            <p className="label mb-3 flex items-center gap-3 text-accent">
              <span aria-hidden className="inline-block h-px w-6 bg-current opacity-50" />
              {eyebrow}
            </p>
          )}
          <h1 className="text-[1.7rem] font-bold leading-[1.1] tracking-[-0.03em] text-fg-strong sm:text-[2.1rem]">
            {title}
          </h1>
          {lead && (
            <p className="mt-3 max-w-2xl text-[0.98rem] leading-relaxed text-muted">{lead}</p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      {meta && <div className="mt-6">{meta}</div>}
    </header>
  );
}

/* ------------------------------------------------------------------ Panel */

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
        accent ? "border-moss-400/35" : "border-line",
        className
      )}
    >
      {(title || action) && (
        <header className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
          {title && <h2 className="label text-faint">{title}</h2>}
          {action}
        </header>
      )}
      <div className={cn(padded && "p-5")}>{children}</div>
    </section>
  );
}

/** Small "View all" link in a card header — padded out to a real touch target. */
export function CardLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="label -my-3 inline-flex min-h-11 items-center py-3 text-faint transition-colors hover:text-accent"
    >
      {children}
    </Link>
  );
}

/* -------------------------------------------------------------- EmptyState */

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
    <div className="flex items-start gap-4 py-3">
      <span
        aria-hidden
        className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line text-accent"
      >
        <svg viewBox="0 0 22 22" fill="none" className="h-[18px] w-[18px]">
          <path
            d={paths[icon]}
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <div className="min-w-0">
        <p className="text-[0.98rem] font-semibold text-fg">{title}</p>
        <p className="mt-1.5 max-w-md text-[0.88rem] leading-relaxed text-muted">{body}</p>
        {action && (
          <Link
            href={action.href}
            className="label mt-4 inline-flex min-h-11 items-center rounded-[var(--radius-sm)] border border-line px-4 text-fg transition-colors hover:border-moss-400/60 hover:text-accent"
          >
            {action.label}
          </Link>
        )}
        {note && <p className="mt-3 text-[0.78rem] leading-relaxed text-faint">{note}</p>}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ Status */

/**
 * Status → semantic tone.
 *
 * Covers every value in the case, document, application, task and appointment
 * enums from lib/db/migrations, plus the intake statuses from 003. Anything
 * unmapped falls back to neutral rather than rendering unstyled.
 */
const STATUS_TONE: Record<string, string> = {
  // settled / good
  approved: "pill-ok",
  completed: "pill-ok",
  confirmed: "pill-ok",
  accepted: "pill-ok",
  active: "pill-ok",
  done: "pill-ok",
  // in flight
  in_progress: "pill-work",
  under_review: "pill-work",
  pending_review: "pill-work",
  assessment: "pill-work",
  // received, not started
  new: "pill-info",
  submitted: "pill-info",
  uploaded: "pill-info",
  scheduled: "pill-info",
  open: "pill-info",
  // waiting on the client
  action_required: "pill-warn",
  awaiting_client: "pill-warn",
  awaiting_response: "pill-warn",
  documents_required: "pill-warn",
  needs_update: "pill-warn",
  required: "pill-warn",
  returned: "pill-warn",
  pending: "pill-warn",
  // stopped
  rejected: "pill-danger",
  withdrawn: "pill-danger",
  suspended: "pill-danger",
  // inert
  draft: "pill-neutral",
  requested: "pill-neutral",
  cancelled: "pill-neutral",
  closed: "pill-neutral",
};

export function StatusPill({ status, label }: { status: string; label: string }) {
  return <span className={cn("pill", STATUS_TONE[status] ?? "pill-neutral")}>{label}</span>;
}

/* ---------------------------------------------------------------- StatCard */

/** A single figure, given room. Optionally a link to whatever it counts. */
export function StatCard({
  label,
  value,
  href,
  urgent = false,
  hint,
}: {
  label: string;
  value: number | string;
  href?: string;
  urgent?: boolean;
  hint?: string;
}) {
  const inner = (
    <>
      <span
        className={cn(
          "num block text-[2rem] leading-none tracking-[-0.03em]",
          urgent ? "text-accent" : "text-fg-strong"
        )}
      >
        {value}
      </span>
      <span className="mt-2.5 block text-[0.82rem] leading-snug text-muted">{label}</span>
      {hint && <span className="mt-1 block text-[0.74rem] text-faint">{hint}</span>}
    </>
  );

  const base = cn(
    "block rounded-[var(--radius-md)] border p-5 bg-[color-mix(in_srgb,var(--fg)_3%,transparent)] transition-all duration-300",
    urgent ? "border-moss-400/35" : "border-line"
  );

  return href ? (
    <Link
      href={href}
      className={cn(base, "hover:-translate-y-0.5 hover:border-moss-400/60 motion-reduce:transform-none")}
    >
      {inner}
    </Link>
  ) : (
    <div className={base}>{inner}</div>
  );
}

/* -------------------------------------------------------------- NextAction */

/**
 * The one thing to do next, given its own card at the top of the page.
 * A dashboard that answers "what now?" at a glance is the product.
 */
export function NextAction({
  title,
  body,
  cta,
  href,
  eyebrow = "Your next step",
}: {
  title: string;
  body: string;
  cta: string;
  href: string;
  eyebrow?: string;
}) {
  return (
    <Panel accent padded={false} className="overflow-hidden">
      <div className="relative p-6 sm:p-7">
        <span
          aria-hidden
          className="bloom-moss pointer-events-none absolute -right-20 -top-20 h-60 w-60 opacity-40"
        />
        <div className="relative">
          <p className="label flex items-center gap-3 text-accent">
            <span aria-hidden className="inline-block h-px w-5 bg-current opacity-60" />
            {eyebrow}
          </p>
          <h2 className="mt-4 text-[1.4rem] font-bold leading-tight tracking-[-0.025em] text-fg-strong sm:text-[1.7rem]">
            {title}
          </h2>
          <p className="mt-3 max-w-xl text-[0.95rem] leading-relaxed text-muted">{body}</p>
          <Link
            href={href}
            className="label group mt-7 inline-flex min-h-11 items-center gap-2.5 rounded-[var(--radius-sm)] bg-moss-400 px-5 text-navy-950 shadow-[0_8px_24px_-10px_rgba(114,196,60,0.6)] transition-all duration-300 hover:-translate-y-px hover:bg-moss-300 motion-reduce:transform-none"
          >
            {cta}
            <svg viewBox="0 0 12 12" fill="none" aria-hidden className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1">
              <path d="M1 6h9M6.5 2.5L10 6l-3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </Panel>
  );
}

/* ---------------------------------------------------------------- Progress */

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
        className="h-1.5 w-full overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--fg)_10%,transparent)]"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-moss-600 via-moss-400 to-moss-300 transition-[width] duration-[900ms] ease-[var(--ease-out-expo)] motion-reduce:transition-none"
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
  const stroke = 6;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;

  return (
    <div className="flex items-center gap-5">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="color-mix(in srgb, var(--fg) 11%, transparent)"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="var(--color-moss-400)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={c - (c * v) / 100}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="num text-[1.35rem] font-bold leading-none text-fg-strong">{v}%</span>
        </span>
      </div>
      {label && <p className="text-[0.88rem] leading-relaxed text-muted">{label}</p>}
    </div>
  );
}

/* ------------------------------------------------------------- JourneyTrack */

/**
 * The stage sequence, as a rail rather than a bar.
 *
 * A bar says how far along you are; this says what each step WAS and what comes
 * next, which is the question people actually have. `current` is the index of
 * the active stage; -1 means an advisor has not set one yet, which stays the
 * honest default rather than implying progress nobody recorded.
 *
 * Horizontal on wide screens, vertical on a phone. A seven-step horizontal rail
 * at 375px is unreadable, so it changes shape rather than shrinking.
 */
export function JourneyTrack({
  stages,
  current = -1,
}: {
  stages: readonly { key: string; name: string; description: string }[];
  current?: number;
}) {
  return (
    <ol className="flex flex-col lg:flex-row">
      {stages.map((stage, i) => {
        const done = current > -1 && i < current;
        const active = i === current;
        const last = i === stages.length - 1;

        return (
          <li
            key={stage.key}
            className="relative flex flex-1 gap-4 pb-6 last:pb-0 lg:flex-col lg:gap-0 lg:pb-0"
          >
            {!last && (
              <span
                aria-hidden
                className={cn(
                  "absolute left-[7px] top-5 h-full w-px lg:left-auto lg:top-[7px] lg:h-px lg:w-full",
                  done ? "bg-moss-400/60" : "bg-[color-mix(in_srgb,var(--fg)_13%,transparent)]"
                )}
              />
            )}
            <span
              aria-hidden
              className={cn(
                "relative z-[1] mt-0.5 flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded-full border-2 lg:mt-0",
                done && "border-moss-400 bg-moss-400",
                active && "border-moss-400 bg-surface",
                !done && !active && "border-[color-mix(in_srgb,var(--fg)_20%,transparent)] bg-surface"
              )}
            >
              {done && (
                <svg viewBox="0 0 10 10" className="h-2 w-2 text-navy-950">
                  <path d="M1 5l2.5 2.5L9 2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              {active && <span className="h-1.5 w-1.5 rounded-full bg-moss-400" />}
            </span>
            <span className="min-w-0 lg:mt-3 lg:pr-4">
              <span
                className={cn(
                  "block text-[0.92rem] font-medium",
                  active ? "text-accent" : done ? "text-fg" : "text-faint"
                )}
              >
                {stage.name}
              </span>
              <span className="mt-1 block text-[0.78rem] leading-snug text-muted">
                {stage.description}
              </span>
            </span>
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
      <p className="num mt-1.5 text-[1.7rem] font-bold leading-none text-fg-strong">{value}</p>
      {hint && <p className="mt-1 text-[0.76rem] text-faint">{hint}</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ DataRow */

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
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-line py-3.5 last:border-0">
      <span className="min-w-0 text-[0.92rem] text-fg">{label}</span>
      <span className="flex shrink-0 items-center gap-3">
        {meta}
        {typeof value === "string" ? <span className="label text-faint">{value}</span> : value}
      </span>
    </div>
  );
}

/* -------------------------------------------------------------- DataTable -- */

/** Scrolls inside its own container, so the PAGE never scrolls sideways. */
export function DataTable({
  columns,
  children,
  minWidth = 720,
  caption,
}: {
  columns: string[];
  children: ReactNode;
  minWidth?: number;
  caption?: string;
}) {
  return (
    <div className="rail overflow-x-auto">
      <table className="w-full text-left" style={{ minWidth }}>
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead>
          <tr className="border-b border-line">
            {columns.map((c, i) => (
              <th key={`${c}-${i}`} scope="col" className="label whitespace-nowrap px-5 py-3 text-faint">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function Row({ children }: { children: ReactNode }) {
  return (
    <tr className="border-b border-line transition-colors last:border-0 hover:bg-[color-mix(in_srgb,var(--fg)_4%,transparent)]">
      {children}
    </tr>
  );
}

export function Cell({
  children,
  muted = false,
  className,
}: {
  children: ReactNode;
  muted?: boolean;
  className?: string;
}) {
  return (
    <td className={cn("px-5 py-3.5 text-[0.88rem]", muted ? "text-muted" : "text-fg", className)}>
      {children}
    </td>
  );
}

/* ------------------------------------------------------------------- Tabs -- */

/** Filters as links, so a filtered view is bookmarkable and survives reload. */
export function Tabs({
  items,
  active,
  label = "Filter",
}: {
  items: { key: string; label: string; href: string; count?: number }[];
  active: string;
  label?: string;
}) {
  return (
    <nav aria-label={label} className="mb-5 flex flex-wrap gap-2">
      {items.map((t) => {
        const on = t.key === active;
        return (
          <Link
            key={t.key}
            href={t.href}
            aria-current={on ? "true" : undefined}
            className={cn(
              "inline-flex min-h-10 items-center rounded-full px-4 text-[0.83rem] transition-colors",
              on
                ? "bg-moss-400 font-medium text-navy-950"
                : "border border-line text-muted hover:border-moss-400/60 hover:text-fg"
            )}
          >
            {t.label}
            {t.count !== undefined && <span className="ml-1.5 opacity-65">{t.count}</span>}
          </Link>
        );
      })}
    </nav>
  );
}

/* -------------------------------------------------------- ActivityTimeline - */

export function ActivityTimeline({
  items,
}: {
  items: { title: string; meta?: string; body?: string }[];
}) {
  return (
    <ol className="space-y-4">
      {items.map((a, i) => (
        <li key={i} className="flex gap-3.5">
          <span aria-hidden className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-moss-400/70" />
          <span className="min-w-0">
            <span className="block text-[0.88rem] leading-relaxed text-fg">{a.title}</span>
            {a.body && (
              <span className="mt-0.5 block text-[0.83rem] leading-relaxed text-muted">{a.body}</span>
            )}
            {a.meta && <span className="mt-0.5 block text-[0.75rem] text-faint">{a.meta}</span>}
          </span>
        </li>
      ))}
    </ol>
  );
}

/* ----------------------------------------------------------- DocumentCard -- */

export function DocumentCard({
  name,
  category,
  status,
  statusLabel,
  note,
  uploaded,
  owner,
  actions,
}: {
  name: string;
  category?: string;
  status: string;
  statusLabel?: string;
  note?: string;
  uploaded?: string;
  owner?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="border-b border-line py-4 last:border-0">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[0.95rem] font-medium text-fg">{name}</p>
          {(owner || category || uploaded) && (
            <p className="mt-0.5 text-[0.78rem] text-faint">
              {[owner, category, uploaded].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>
        <StatusPill status={status} label={statusLabel ?? status.replace(/_/g, " ")} />
      </div>
      {note && <p className="mt-2.5 max-w-2xl text-[0.85rem] leading-relaxed text-muted">{note}</p>}
      {actions && <div className="mt-3 flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

/* --------------------------------------------------------- BackendRequired - */

/**
 * Development-only build note.
 *
 * Hidden in production: a client signing in to their own workspace should never
 * be shown an engineering to-do list. The gap is still visible in every empty
 * state, phrased for them rather than for us.
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
      className="rounded-[var(--radius-md)] border border-dashed border-line p-5"
    >
      <p className="label text-faint">Dev note — {feature}</p>
      <p className="mt-2 text-[0.83rem] leading-relaxed text-muted">
        Hidden in production. Populates once these exist:
      </p>
      <ul className="mt-3 list-disc space-y-1 pl-4 text-[0.81rem] text-muted marker:text-faint">
        {needs.map((n) => (
          <li key={n}>{n}</li>
        ))}
      </ul>
    </aside>
  );
}
