import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { DemoStatus } from "@/lib/demo/data";

/**
 * SHARED UI FOR THE DEMO PORTALS
 *
 * One design system, four information architectures. Every role uses these
 * same pieces so the four experiences read as one platform — what differs is
 * the content and the navigation, not the visual language.
 *
 * These deliberately mirror the vocabulary of components/portal/Pieces.tsx
 * rather than importing it: the demo is meant to be deletable in one move, and
 * a two-way dependency between demo and production would prevent that.
 */

/* ------------------------------------------------------------ status pill */

const STATUS_STYLE: Record<DemoStatus, { label: string; className: string }> = {
  new: { label: "New", className: "border-sky-400/40 bg-sky-400/10 text-sky-300" },
  in_progress: { label: "In progress", className: "border-moss-400/45 bg-moss-400/10 text-moss-300" },
  action_required: { label: "Action required", className: "border-amber-400/50 bg-amber-400/12 text-amber-300" },
  under_review: { label: "Under review", className: "border-indigo-400/40 bg-indigo-400/10 text-indigo-300" },
  completed: { label: "Completed", className: "border-moss-400/40 bg-moss-400/10 text-moss-300" },
  scheduled: { label: "Scheduled", className: "border-sky-400/40 bg-sky-400/10 text-sky-300" },
  cancelled: { label: "Cancelled", className: "border-line bg-transparent text-faint" },
  approved: { label: "Approved", className: "border-moss-400/45 bg-moss-400/12 text-moss-300" },
  rejected: { label: "Needs changes", className: "border-red-400/45 bg-red-400/10 text-red-300" },
  pending: { label: "Pending", className: "border-line bg-[color-mix(in_srgb,var(--fg)_6%,transparent)] text-muted" },
};

export function StatusBadge({ status, label }: { status: DemoStatus; label?: string }) {
  const s = STATUS_STYLE[status] ?? STATUS_STYLE.pending;
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center whitespace-nowrap rounded-full border px-2.5 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.08em]",
        s.className
      )}
    >
      {label ?? s.label}
    </span>
  );
}

/* --------------------------------------------------------- card action --- */

/**
 * The "View all" link in a card header.
 *
 * It reads as small type by design, but it is still a control — at `.label`
 * size it measured 17px tall, well under a fingertip. Padding-in / margin-out
 * gives it a 44px hit box without moving it, so the header keeps its
 * proportions while the target becomes reachable on a phone.
 */
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

/* ------------------------------------------------------------------ card */

export function Card({
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

/* ------------------------------------------------------------- stat card */

export function StatCard({
  label,
  value,
  href,
  urgent = false,
}: {
  label: string;
  value: number | string;
  href?: string;
  urgent?: boolean;
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
    </>
  );

  const base =
    "block rounded-[var(--radius-md)] border p-5 transition-all duration-300 " +
    (urgent ? "border-moss-400/35" : "border-line") +
    " bg-[color-mix(in_srgb,var(--fg)_3%,transparent)]";

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

/* --------------------------------------------------------- next action ---- */

/**
 * The single most important thing on any client dashboard: what to do next.
 * Given its own accented card at the top of the page, because a dashboard that
 * answers "what now?" in one glance is the whole point of the product.
 */
export function NextAction({
  title,
  body,
  cta,
  href,
}: {
  title: string;
  body: string;
  cta: string;
  href: string;
}) {
  return (
    <Card accent padded={false} className="overflow-hidden">
      <div className="relative p-6 sm:p-7">
        <span
          aria-hidden
          className="bloom-moss pointer-events-none absolute -right-20 -top-20 h-60 w-60 opacity-40"
        />
        <div className="relative">
          <p className="label flex items-center gap-3 text-accent">
            <span aria-hidden className="inline-block h-px w-5 bg-current opacity-60" />
            Action required
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
    </Card>
  );
}

/* ------------------------------------------------------ progress tracker -- */

export type Stage = { name: string; state: "done" | "current" | "upcoming"; date?: string };

/**
 * The journey, as a rail rather than a percentage.
 *
 * A bar says how far along you are; this says what each step WAS and what
 * comes next, which is the question people actually have. Horizontal on wide
 * screens, vertical on a phone — a six-step horizontal rail at 375px is
 * unreadable, so it changes shape rather than shrinking.
 */
export function ProgressTracker({ stages }: { stages: Stage[] }) {
  return (
    <ol className="flex flex-col gap-0 md:flex-row md:gap-0">
      {stages.map((s, i) => {
        const done = s.state === "done";
        const current = s.state === "current";
        return (
          <li key={s.name} className="relative flex flex-1 gap-4 pb-6 md:flex-col md:gap-0 md:pb-0">
            {/* connector */}
            {i < stages.length - 1 && (
              <span
                aria-hidden
                className={cn(
                  "absolute left-[7px] top-5 h-full w-px md:left-auto md:top-[7px] md:h-px md:w-full",
                  done ? "bg-moss-400/60" : "bg-[color-mix(in_srgb,var(--fg)_14%,transparent)]"
                )}
              />
            )}
            <span
              aria-hidden
              className={cn(
                "relative z-[1] mt-0.5 flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded-full border-2 md:mt-0",
                done && "border-moss-400 bg-moss-400",
                current && "border-moss-400 bg-surface",
                s.state === "upcoming" &&
                  "border-[color-mix(in_srgb,var(--fg)_20%,transparent)] bg-surface"
              )}
            >
              {done && (
                <svg viewBox="0 0 10 10" className="h-2 w-2 text-navy-950">
                  <path d="M1 5l2.5 2.5L9 2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              {current && <span className="h-1.5 w-1.5 rounded-full bg-moss-400" />}
            </span>
            <span className="md:mt-3 md:pr-4">
              <span
                className={cn(
                  "block text-[0.9rem] font-medium",
                  current ? "text-accent" : done ? "text-fg" : "text-faint"
                )}
              >
                {s.name}
              </span>
              <span className="mt-0.5 block text-[0.76rem] text-faint">
                {s.date ?? (current ? "In progress" : done ? "Completed" : "Upcoming")}
              </span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}

/* --------------------------------------------------------------- table ---- */

export function DataTable({
  columns,
  children,
  minWidth = 720,
}: {
  columns: string[];
  children: ReactNode;
  minWidth?: number;
}) {
  return (
    // Scrolls inside its own container so the PAGE never scrolls sideways on
    // a phone — a wide table is the most common cause of that.
    <div className="rail overflow-x-auto">
      <table className="w-full text-left" style={{ minWidth }}>
        <thead>
          <tr className="border-b border-line">
            {columns.map((c) => (
              <th key={c} scope="col" className="label whitespace-nowrap px-5 py-3 text-faint">
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

/* ----------------------------------------------------------------- tabs --- */

export function Tabs({
  items,
  active,
}: {
  items: { key: string; label: string; href: string; count?: number }[];
  active: string;
}) {
  return (
    <nav aria-label="Filter" className="mb-5 flex flex-wrap gap-2">
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

/* ------------------------------------------------------------ empty state - */

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="px-2 py-8 text-center">
      <p className="text-[0.98rem] font-medium text-fg">{title}</p>
      <p className="mx-auto mt-2 max-w-sm text-[0.87rem] leading-relaxed text-muted">{body}</p>
      {action && (
        <Link
          href={action.href}
          className="label mt-5 inline-flex min-h-11 items-center rounded-[var(--radius-sm)] border border-line px-5 text-fg transition-colors hover:border-moss-400/60 hover:text-accent"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}

/* --------------------------------------------------------- page heading --- */

export function PageHeading({
  eyebrow,
  title,
  lead,
  action,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  action?: ReactNode;
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
        {action}
      </div>
    </header>
  );
}

/* ------------------------------------------------------ activity timeline - */

export function ActivityTimeline({
  items,
}: {
  items: { who: string; role: string; what: string; when: string }[];
}) {
  return (
    <ol className="space-y-4">
      {items.map((a, i) => (
        <li key={i} className="flex gap-3.5">
          <span
            aria-hidden
            className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-moss-400/70"
          />
          <span className="min-w-0">
            <span className="block text-[0.88rem] leading-relaxed text-fg">
              <strong className="font-semibold">{a.who}</strong>{" "}
              <span className="text-muted">{a.what}</span>
            </span>
            <span className="mt-0.5 block text-[0.75rem] text-faint">
              {a.role} · {a.when}
            </span>
          </span>
        </li>
      ))}
    </ol>
  );
}

/* ------------------------------------------------------------ doc card ---- */

export function DocumentCard({
  name,
  category,
  status,
  note,
  uploaded,
  owner,
  actions,
}: {
  name: string;
  category?: string;
  status: DemoStatus;
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
          <p className="mt-0.5 text-[0.78rem] text-faint">
            {[owner, category, uploaded].filter(Boolean).join(" · ")}
          </p>
        </div>
        <StatusBadge status={status} />
      </div>
      {note && (
        <p className="mt-2.5 max-w-2xl text-[0.85rem] leading-relaxed text-muted">{note}</p>
      )}
      {actions && <div className="mt-3 flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

/** Non-committal button used across demo screens — nothing here persists. */
export function DemoButton({
  children,
  tone = "line",
}: {
  children: ReactNode;
  tone?: "solid" | "line";
}) {
  return (
    <button
      type="button"
      className={cn(
        "label inline-flex min-h-10 items-center rounded-[var(--radius-sm)] px-4 transition-colors",
        tone === "solid"
          ? "bg-moss-400 text-navy-950 hover:bg-moss-300"
          : "border border-line text-fg hover:border-moss-400/60 hover:text-accent"
      )}
    >
      {children}
    </button>
  );
}

/* ----------------------------------------------------------- chat panel --- */

export function ChatThread({
  messages,
}: {
  messages: { from: string; name: string; body: string; when: string }[];
}) {
  return (
    <div className="flex flex-col">
      <ul className="space-y-4">
        {messages.map((m, i) => {
          const mine = m.from === "client";
          return (
            <li key={i} className={cn("flex", mine ? "justify-end" : "justify-start")}>
              <div className={cn("max-w-[min(85%,34rem)]", mine && "text-right")}>
                {!mine && (
                  <p className="mb-1 px-1 text-[0.74rem] text-faint">
                    {m.name} <span className="text-accent">· SnZ Ventures</span>
                  </p>
                )}
                <div
                  className={cn(
                    "rounded-[var(--radius-md)] px-4 py-2.5 text-left text-[0.9rem] leading-relaxed",
                    mine
                      ? "bg-moss-400 text-navy-950"
                      : "border border-line bg-[color-mix(in_srgb,var(--fg)_5%,transparent)] text-fg"
                  )}
                >
                  {m.body}
                </div>
                <p className="mt-1 px-1 text-[0.7rem] text-faint">{m.when}</p>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-5 flex items-end gap-2 border-t border-line pt-4">
        <label htmlFor="demo-chat" className="sr-only">
          Write a message
        </label>
        <input
          id="demo-chat"
          className="field flex-1"
          placeholder="Write a message…"
          disabled
        />
        <DemoButton tone="solid">Send</DemoButton>
      </div>
      <p className="mt-2 text-[0.72rem] text-faint">
        Preview only — messages are not sent in demo mode.
      </p>
    </div>
  );
}
