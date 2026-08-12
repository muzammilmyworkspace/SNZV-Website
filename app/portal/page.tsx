import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { users } from "@/lib/auth/store";
import { JOURNEYS, type Role } from "@/lib/auth/types";
import {
  getCases,
  getTasks,
  getDocuments,
  getAppointments,
  profileCompletion,
  REQUIRED_DOCUMENTS,
} from "@/lib/portal/data";
import {
  PortalHeading,
  Panel,
  EmptyState,
  ProgressRing,
  JourneyTrack,
  SummaryStat,
  DataRow,
  StatusPill,
  BackendRequired,
} from "@/components/portal/Pieces";

const GREETING: Record<string, { eyebrow: string; lead: string }> = {
  student: {
    eyebrow: "Study journey",
    lead: "Everything we hold on your case, and the one thing worth doing next.",
  },
  professional: {
    eyebrow: "Career journey",
    lead: "Your profile, your eligibility, and where you are in the process.",
  },
  business: {
    eyebrow: "Setup journey",
    lead: "Where your entity stands, what is outstanding, and what happens next.",
  },
  advisor: { eyebrow: "Advisor", lead: "Your assigned clients and open actions." },
  admin: { eyebrow: "Administrator", lead: "Portal activity across all client types." },
};

const isClientRole = (r: Role): r is "student" | "professional" | "business" =>
  r === "student" || r === "professional" || r === "business";

export default async function PortalDashboard() {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await users.findById(session.userId);
  const role = session.role;
  const greeting = GREETING[role] ?? GREETING.student;

  const [cases, tasks, documents, appointments] = await Promise.all([
    getCases(session.userId),
    getTasks(session.userId),
    getDocuments(session.userId),
    getAppointments(session.userId),
  ]);

  const completion = isClientRole(role)
    ? profileCompletion(role, user?.profile ?? {})
    : null;
  const journey = isClientRole(role) ? JOURNEYS[role] : null;
  const required = REQUIRED_DOCUMENTS[role] ?? [];

  const openTask = tasks.find((t) => !t.done);

  /**
   * "Your next step" is derived from real state, in priority order — it is the
   * single most useful thing this page can say, so it never shows a placeholder.
   */
  const nextStep =
    completion && completion.percent < 100
      ? {
          title: "Complete your profile",
          body: `${completion.filled} of ${completion.total} details so far. The rest is what lets us give you a real assessment rather than a general one.`,
          href: "/portal/profile",
          cta: "Continue your profile",
        }
      : openTask
        ? {
            title: openTask.title,
            body: openTask.detail,
            href: "/portal/tasks",
            cta: "View tasks",
          }
        : {
            title: "Book your first conversation",
            body: "Your profile is in good shape. The next step is a short call so we can tell you honestly what your options look like.",
            href: "/portal/appointments",
            cta: "Request an appointment",
          };

  const firstName = session.name.split(" ")[0];

  return (
    <>
      <PortalHeading
        eyebrow={greeting.eyebrow}
        title={`Welcome back, ${firstName}.`}
        lead={greeting.lead}
        meta={
          <div className="flex flex-wrap gap-x-10 gap-y-5">
            <SummaryStat
              label={role === "business" ? "Open requests" : "Applications"}
              value={cases.length}
            />
            <SummaryStat label="Documents" value={documents.length} hint={`${required.length} typically needed`} />
            <SummaryStat label="Open tasks" value={tasks.filter((t) => !t.done).length} />
            <SummaryStat label="Appointments" value={appointments.length} />
          </div>
        }
      />

      {/* Next step + completion */}
      <div className="grid items-start gap-5 lg:grid-cols-[1.55fr_1fr]">
        <Panel accent padded={false} className="overflow-hidden">
          <div className="relative p-6 sm:p-7">
            <span
              aria-hidden
              className="bloom-moss pointer-events-none absolute -right-20 -top-20 h-60 w-60 opacity-40"
            />
            <div className="relative">
              <p className="label flex items-center gap-3 text-accent">
                <span aria-hidden className="inline-block h-px w-5 bg-current opacity-60" />
                Your next step
              </p>
              <h2 className="mt-4 text-[1.4rem] font-bold leading-tight tracking-[-0.025em] text-fg-strong sm:text-[1.7rem]">
                {nextStep.title}
              </h2>
              <p className="mt-3 max-w-xl text-[0.92rem] leading-relaxed text-muted">
                {nextStep.body}
              </p>
              <Link
                href={nextStep.href}
                className="label group mt-7 inline-flex items-center gap-2.5 rounded-[var(--radius-sm)] bg-moss-400 px-5 py-3 text-navy-950 shadow-[0_8px_24px_-10px_rgba(114,196,60,0.6)] transition-all duration-400 hover:-translate-y-px hover:bg-moss-300"
              >
                {nextStep.cta}
                <svg viewBox="0 0 12 12" fill="none" aria-hidden className="h-3 w-3 transition-transform duration-400 group-hover:translate-x-1">
                  <path d="M1 6h9M6.5 2.5L10 6l-3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>
        </Panel>

        {completion && (
          <Panel title="Profile completion">
            <ProgressRing
              value={completion.percent}
              label={
                completion.percent === 100
                  ? "Complete — thank you. This makes our assessment far more useful."
                  : `${completion.total - completion.filled} details still to add.`
              }
            />
            {completion.missing.length > 0 && (
              <ul className="mt-6 space-y-2 border-t border-line pt-5">
                {completion.missing.slice(0, 4).map((m) => (
                  <li key={m} className="flex items-center gap-2.5 text-[0.83rem] text-muted">
                    <span aria-hidden className="h-1 w-1 shrink-0 rounded-full bg-current opacity-50" />
                    {m}
                  </li>
                ))}
                {completion.missing.length > 4 && (
                  <li className="text-[0.78rem] text-faint">
                    +{completion.missing.length - 4} more
                  </li>
                )}
              </ul>
            )}
          </Panel>
        )}
      </div>

      {/* Journey */}
      {journey && (
        <div className="mt-5">
          <Panel title="Where you are">
            {/* current = -1 until an advisor sets a stage — the honest default */}
            <JourneyTrack stages={journey} current={-1} />
            <p className="mt-6 border-t border-line pt-4 text-[0.8rem] text-faint">
              Your current stage is set by your advisor as the case progresses.
            </p>
          </Panel>
        </div>
      )}

      {/* Collections */}
      <div className="mt-5 grid items-start gap-5 lg:grid-cols-2">
        <Panel
          title={role === "business" ? "Requests" : "Applications"}
          action={
            <Link href="/portal/cases" className="label text-faint transition-colors hover:text-accent">
              View all
            </Link>
          }
        >
          {cases.length === 0 && (
            <EmptyState
              icon="file"
              title="Nothing open yet"
              body={
                role === "business"
                  ? "Requests you raise with us appear here, each with a status and a named next action."
                  : "Applications we prepare with you appear here, each with a status and a named next action."
              }
              action={{ label: "Talk to us", href: "/portal/messages" }}
            />
          )}
        </Panel>

        <Panel
          title="Documents"
          action={
            <Link href="/portal/documents" className="label text-faint transition-colors hover:text-accent">
              View all
            </Link>
          }
        >
          {documents.length === 0 ? (
            <div>
              <p className="mb-4 text-[0.86rem] leading-relaxed text-muted">
                Nothing uploaded yet. For your pathway we typically need:
              </p>
              {required.map((d) => (
                <DataRow
                  key={d.name}
                  label={d.name}
                  value={<StatusPill status="required" label="Required" />}
                  meta={<span className="label text-faint">{d.category}</span>}
                />
              ))}
            </div>
          ) : null}
        </Panel>
      </div>

      <div className="mt-5 grid items-start gap-5 lg:grid-cols-2">
        <Panel title="Appointments">
          {appointments.length === 0 && (
            <EmptyState
              icon="calendar"
              title="No appointments scheduled"
              body="Request a consultation and we will confirm a time with an advisor."
              action={{ label: "Request one", href: "/portal/appointments" }}
            />
          )}
        </Panel>
        <Panel title="Tasks">
          {tasks.length === 0 && (
            <EmptyState
              icon="check"
              title="Nothing outstanding"
              body="Tasks your advisor assigns — documents to send, details to confirm — appear here."
            />
          )}
        </Panel>
      </div>

      <div className="mt-8">
        <BackendRequired
          feature="Case, document and messaging data"
          needs={[
            "Tables: cases, documents, tasks, conversations, messages, appointments, notifications",
            "Access-controlled file storage — documents must never be served from public URLs",
            "Advisor assignment and case stage management in the admin area",
          ]}
        />
      </div>
    </>
  );
}
