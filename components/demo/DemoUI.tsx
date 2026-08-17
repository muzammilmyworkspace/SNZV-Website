import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { DemoStatus } from "@/lib/demo/data";
import {
  Panel,
  StatusPill,
  StatCard as KitStatCard,
  NextAction as KitNextAction,
  DataTable as KitDataTable,
  Row as KitRow,
  Cell as KitCell,
  Tabs as KitTabs,
  EmptyState as KitEmptyState,
  PortalHeading,
  DocumentCard as KitDocumentCard,
  CardLink as KitCardLink,
  ActivityTimeline as KitActivityTimeline,
} from "@/components/portal/Pieces";

/**
 * DEMO UI — a thin adapter over the real portal design system.
 *
 * WHY THIS IS NOW AN ADAPTER RATHER THAN ITS OWN COMPONENT SET
 *
 * These components were originally written standalone so the demo could be
 * deleted in one move. Then the real portal adopted this design — at which
 * point duplicating it here would have meant two copies of every card and badge
 * drifting apart, and the production portal is the one that matters.
 *
 * So the components were PROMOTED into components/portal/Pieces.tsx, and this
 * file maps the demo's vocabulary onto them. The dependency runs one way —
 * demo → portal — so deleting app/demo/, lib/demo/ and components/demo/ still
 * removes the feature completely and leaves the portal untouched.
 *
 * Anything genuinely demo-only (an inert chat box, a button that does nothing)
 * stays here, because it has no business in the production design system.
 */

/* Re-exported unchanged. */
export const Card = Panel;
export const StatCard = KitStatCard;
export const NextAction = KitNextAction;
export const DataTable = KitDataTable;
export const Row = KitRow;
export const Cell = KitCell;
export const Tabs = KitTabs;
export const EmptyState = KitEmptyState;
export const PageHeading = PortalHeading;
export const CardLink = KitCardLink;

/* ------------------------------------------------------------ status badge */

/**
 * The demo's status vocabulary is slightly wider than the database's — it has
 * `action_required`, which the real schema expresses as `awaiting_client`. The
 * mapping lives here rather than in the shared component, so the production
 * design system does not carry a status only the demo uses.
 */
export function StatusBadge({ status, label }: { status: DemoStatus; label?: string }) {
  const LABEL: Record<DemoStatus, string> = {
    new: "New",
    in_progress: "In progress",
    action_required: "Action required",
    under_review: "Under review",
    completed: "Completed",
    scheduled: "Scheduled",
    cancelled: "Cancelled",
    approved: "Approved",
    rejected: "Needs changes",
    pending: "Pending",
  };
  return <StatusPill status={status} label={label ?? LABEL[status] ?? status} />;
}

/* ----------------------------------------------------------- document card */

export function DocumentCard(props: {
  name: string;
  category?: string;
  status: DemoStatus;
  note?: string;
  uploaded?: string;
  owner?: string;
  actions?: ReactNode;
}) {
  const LABEL: Record<string, string> = {
    action_required: "Action required",
    rejected: "Needs changes",
    under_review: "Under review",
    in_progress: "In progress",
  };
  return <KitDocumentCard {...props} statusLabel={LABEL[props.status]} />;
}

/* ------------------------------------------------------- activity timeline */

/** The demo's activity shape is who/role/what/when; the kit's is title/meta. */
export function ActivityTimeline({
  items,
}: {
  items: { who: string; role: string; what: string; when: string }[];
}) {
  return (
    <KitActivityTimeline
      items={items.map((a) => ({
        title: `${a.who} ${a.what}`,
        meta: `${a.role} · ${a.when}`,
      }))}
    />
  );
}

/* -------------------------------------------------------- progress tracker */

export type Stage = { name: string; state: "done" | "current" | "upcoming"; date?: string };

/**
 * The demo tracker carries a per-stage state and date; the portal's JourneyTrack
 * takes a stage list plus a `current` index, because that is what the database
 * actually stores (`cases.stage_index`). Converting here keeps the demo data
 * readable while the shared component stays honest about its source.
 */
export function ProgressTracker({ stages }: { stages: Stage[] }) {
  return (
    <ol className="flex flex-col lg:flex-row">
      {stages.map((s, i) => {
        const done = s.state === "done";
        const current = s.state === "current";
        const last = i === stages.length - 1;
        return (
          <li
            key={s.name}
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
            <span className="min-w-0 lg:mt-3 lg:pr-4">
              <span
                className={cn(
                  "block text-[0.92rem] font-medium",
                  current ? "text-accent" : done ? "text-fg" : "text-faint"
                )}
              >
                {s.name}
              </span>
              <span className="mt-1 block text-[0.78rem] text-faint">
                {s.date ?? (current ? "In progress" : done ? "Completed" : "Upcoming")}
              </span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}

/* -------------------------------------------------------- demo-only pieces */

/** Inert by design — nothing in the preview persists. */
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
        <input id="demo-chat" className="field flex-1" placeholder="Write a message…" disabled />
        <DemoButton tone="solid">Send</DemoButton>
      </div>
      <p className="mt-2 text-[0.72rem] text-faint">
        Preview only — messages are not sent in demo mode.
      </p>
    </div>
  );
}
