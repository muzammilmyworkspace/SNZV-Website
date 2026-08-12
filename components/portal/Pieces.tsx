import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------ PageHeading */

export function PortalHeading({
  title,
  lead,
  action,
}: {
  title: string;
  lead?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="d-2 text-fg-strong">{title}</h1>
        {lead && <p className="mt-2 max-w-2xl text-[0.94rem] leading-relaxed text-muted">{lead}</p>}
      </div>
      {action}
    </div>
  );
}

/* ------------------------------------------------------------------ Panel */

export function Panel({
  children,
  className,
  title,
  action,
}: {
  children: ReactNode;
  className?: string;
  title?: string;
  action?: ReactNode;
}) {
  return (
    <section className={cn("rounded-[var(--radius-lg)] border border-line bg-raised", className)}>
      {(title || action) && (
        <header className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
          {title && <h2 className="text-[0.95rem] font-semibold tracking-[-0.01em] text-fg">{title}</h2>}
          {action}
        </header>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}

/* ------------------------------------------------------------- EmptyState */

/**
 * Honest empty state. Every portal collection uses this rather than seeded
 * sample data — showing a client an invented case file would be worse than
 * showing them nothing.
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
    <div className="flex flex-col items-center justify-center rounded-[var(--radius-md)] border border-dashed border-line px-6 py-14 text-center">
      <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-line text-faint">
        <svg viewBox="0 0 22 22" fill="none" aria-hidden className="h-5 w-5">
          <path d={paths[icon]} stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <p className="text-[1rem] font-semibold text-fg">{title}</p>
      <p className="mt-2 max-w-md text-[0.88rem] leading-relaxed text-muted">{body}</p>
      {action && (
        <Link
          href={action.href}
          className="label mt-6 inline-flex items-center gap-2 rounded-[var(--radius-sm)] bg-moss-400 px-5 py-2.5 text-navy-950 transition-colors hover:bg-moss-300"
        >
          {action.label}
        </Link>
      )}
      {note && <p className="mt-5 max-w-sm text-[0.75rem] leading-relaxed text-faint">{note}</p>}
    </div>
  );
}

/* ----------------------------------------------------------------- Status */

const STATUS_TONE: Record<string, string> = {
  approved: "text-moss-400 border-moss-400/40",
  completed: "text-moss-400 border-moss-400/40",
  confirmed: "text-moss-400 border-moss-400/40",
  in_progress: "text-navy-200 border-line",
  submitted: "text-navy-200 border-line",
  under_review: "text-navy-200 border-line",
  pending_review: "text-navy-200 border-line",
  uploaded: "text-navy-200 border-line",
  awaiting_response: "text-amber-300 border-amber-400/40",
  documents_required: "text-amber-300 border-amber-400/40",
  needs_update: "text-amber-300 border-amber-400/40",
  required: "text-amber-300 border-amber-400/40",
  draft: "text-faint border-line",
  requested: "text-faint border-line",
  cancelled: "text-faint border-line",
};

export function StatusPill({ status, label }: { status: string; label: string }) {
  return (
    <span
      className={cn(
        "label inline-flex shrink-0 items-center rounded-full border px-2.5 py-1",
        STATUS_TONE[status] ?? "text-faint border-line"
      )}
    >
      {label}
    </span>
  );
}

/* --------------------------------------------------------------- Progress */

export function ProgressBar({
  value,
  label,
}: {
  value: number;
  label?: string;
}) {
  return (
    <div>
      {label && (
        <div className="mb-2 flex items-baseline justify-between">
          <span className="label text-muted">{label}</span>
          <span className="num text-[0.85rem] font-semibold text-fg">{value}%</span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? "Progress"}
        className="h-1.5 w-full overflow-hidden rounded-full bg-raised"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-moss-500 to-moss-300 transition-[width] duration-700 ease-[var(--ease-out-expo)]"
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------- BackendRequired */

/**
 * Shown once per screen where the feature genuinely needs server
 * infrastructure that does not exist yet. Better an explicit note than a
 * convincing-looking mock.
 */
export function BackendRequired({ feature, needs }: { feature: string; needs: string[] }) {
  return (
    <aside className="rounded-[var(--radius-md)] border border-amber-400/35 bg-amber-400/[0.07] p-5">
      <p className="label text-amber-300">Backend required — {feature}</p>
      <p className="mt-2 text-[0.85rem] leading-relaxed text-amber-100/90">
        The interface is complete and reads from{" "}
        <span className="font-mono text-[0.8rem]">lib/portal/data.ts</span>. It
        will populate as soon as these are implemented:
      </p>
      <ul className="mt-3 space-y-1 pl-4 text-[0.83rem] text-amber-100/80 marker:text-amber-400/60 list-disc">
        {needs.map((n) => (
          <li key={n}>{n}</li>
        ))}
      </ul>
    </aside>
  );
}
