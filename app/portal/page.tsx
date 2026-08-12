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
  ProgressBar,
  BackendRequired,
} from "@/components/portal/Pieces";

const GREETING: Record<string, { title: string; lead: string }> = {
  student: {
    title: "Your study journey",
    lead: "Everything we hold on your case, and the one thing worth doing next.",
  },
  professional: {
    title: "Your career journey",
    lead: "Your profile, your eligibility, and where you are in the process.",
  },
  business: {
    title: "Your setup journey",
    lead: "Where your entity stands, what is outstanding, and what happens next.",
  },
  advisor: {
    title: "Advisor overview",
    lead: "Your assigned clients and open actions.",
  },
  admin: {
    title: "Administrator overview",
    lead: "Portal activity across all client types.",
  },
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
   * "Your next step" is derived from real state, in priority order. It is the
   * single most useful thing the portal can tell someone, so it never shows a
   * placeholder.
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

  return (
    <>
      <PortalHeading
        title={`${greeting.title}, ${session.name.split(" ")[0]}.`}
        lead={greeting.lead}
      />

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <section className="relative overflow-hidden rounded-[var(--radius-lg)] border border-moss-400/30 bg-raised p-6">
            <span
              aria-hidden
              className="bloom-moss pointer-events-none absolute -right-16 -top-16 h-56 w-56 opacity-40"
            />
            <div className="relative">
              <p className="label text-accent">Your next step</p>
              <h2 className="d-3 mt-3 text-fg-strong">{nextStep.title}</h2>
              <p className="mt-2 max-w-xl text-[0.92rem] leading-relaxed text-muted">
                {nextStep.body}
              </p>
              <Link
                href={nextStep.href}
                className="label mt-6 inline-flex items-center gap-2 rounded-[var(--radius-sm)] bg-moss-400 px-5 py-3 text-navy-950 transition-colors hover:bg-moss-300"
              >
                {nextStep.cta}
                <svg viewBox="0 0 12 12" fill="none" aria-hidden className="h-3 w-3">
                  <path
                    d="M1 6h9M6.5 2.5L10 6l-3.5 3.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>
          </section>
        </div>

        {completion && (
          <Panel title="Profile completion">
            <ProgressBar value={completion.percent} />
            <p className="mt-4 text-[0.85rem] leading-relaxed text-muted">
              {completion.percent === 100
                ? "Complete — thank you. This makes our assessment far more useful."
                : `${completion.total - completion.filled} details still to add.`}
            </p>
            {completion.missing.length > 0 && (
              <ul className="mt-4 space-y-1.5 border-t border-line pt-4">
                {completion.missing.slice(0, 4).map((m) => (
                  <li
                    key={m}
                    className="flex items-center gap-2.5 text-[0.83rem] text-faint"
                  >
                    <span aria-hidden className="h-1 w-1 rounded-full bg-current" />
                    {m}
                  </li>
                ))}
              </ul>
            )}
            <Link
              href="/portal/profile"
              className="label mt-5 inline-flex items-center gap-2 text-accent"
            >
              <span className="draw">Update profile</span>
            </Link>
          </Panel>
        )}
      </div>

      {journey && (
        <section className="mt-5">
          <Panel title="Where you are">
            <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {journey.map((stage, i) => (
                <li key={stage.key} className="border-t border-line pt-4">
                  <span className="label num text-accent opacity-60">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="mt-2 text-[0.92rem] font-semibold text-fg">
                    {stage.name}
                  </p>
                  <p className="mt-1 text-[0.8rem] leading-relaxed text-muted">
                    {stage.description}
                  </p>
                </li>
              ))}
            </ol>
            <p className="mt-6 border-t border-line pt-4 text-[0.8rem] text-faint">
              Your current stage is set by your advisor as the case progresses.
            </p>
          </Panel>
        </section>
      )}

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Panel title={role === "business" ? "Requests" : "Applications"}>
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

        <Panel title="Documents">
          {documents.length === 0 && (
            <div>
              <p className="text-[0.88rem] leading-relaxed text-muted">
                Nothing uploaded yet. For your pathway we typically need:
              </p>
              <ul className="mt-4 space-y-2">
                {required.map((d) => (
                  <li
                    key={d.name}
                    className="flex items-center justify-between gap-4 border-b border-line pb-2 text-[0.86rem]"
                  >
                    <span className="text-fg">{d.name}</span>
                    <span className="label text-faint">{d.category}</span>
                  </li>
                ))}
              </ul>
              <Link href="/portal/documents" className="label mt-5 inline-flex text-accent">
                <span className="draw">Go to documents</span>
              </Link>
            </div>
          )}
        </Panel>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
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
            "Database tables: cases, documents, tasks, conversations, messages, appointments, notifications",
            "Access-controlled file storage — documents must never be served from public URLs",
            "Advisor assignment and case status management in the admin area",
          ]}
        />
      </div>
    </>
  );
}
