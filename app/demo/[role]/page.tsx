import Link from "next/link";
import { notFound } from "next/navigation";
import { isDemoRole, type DemoRole } from "@/lib/demo/config";
import { roleContext } from "@/lib/demo/nav";
import {
  demoIdentities,
  adminMetrics,
  adminActivity,
  adminRequests,
  adminDocuments,
  studentJourney,
  studentNextAction,
  studentApplications,
  studentDocuments,
  jobSeekerJourney,
  jobSeekerNextAction,
  jobSeekerHighlights,
  jobSeekerApplications,
  jobSeekerInterviews,
  businessRequests,
  businessNextAction,
  businessServices,
} from "@/lib/demo/data";
import {
  Card,
  StatCard,
  NextAction,
  ProgressTracker,
  StatusBadge,
  DataTable,
  Row,
  Cell,
  PageHeading,
  ActivityTimeline,
  DocumentCard,
  DemoButton,
  CardLink,
} from "@/components/demo/DemoUI";

/**
 * THE FOUR DASHBOARDS.
 *
 * Every one is built around a single question — "what do I need to do next?" —
 * and answers it before showing anything else. The differences between them
 * are not cosmetic:
 *
 *   • The three CLIENT dashboards lead with one action and a journey rail.
 *     A client has one case and wants to know where it stands.
 *   • The ADMIN dashboard leads with counts and a queue. An operator has many
 *     cases and wants to know which one to open first.
 *
 * That is why the admin screen has no "next action" card: there is no single
 * next action across 245 people, and inventing one would be a worse answer
 * than a well-ordered list.
 */

function firstName(full: string) {
  return full.split(" ")[0];
}

/* ─────────────────────────────────────────────────────────── SUPER ADMIN ─ */

function AdminDashboard() {
  const urgent = adminRequests.filter(
    (r) => r.status === "action_required" || r.status === "new"
  );

  return (
    <>
      <PageHeading
        eyebrow={roleContext.admin.eyebrow}
        title="Platform overview"
        lead={roleContext.admin.greeting}
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {adminMetrics.map((m) => (
          <StatCard key={m.label} {...m} />
        ))}
      </div>

      <div className="mt-5 grid items-start gap-5 lg:grid-cols-[1.4fr_1fr]">
        <Card
          title="Needs attention first"
          action={
            <CardLink href="/demo/admin/requests">All requests</CardLink>
          }
          padded={false}
        >
          <DataTable columns={["Reference", "Client", "Type", "Waiting", "Status"]} minWidth={660}>
            {urgent.map((r) => (
              <Row key={r.ref}>
                <Cell>
                  <span className="num text-[0.84rem] text-accent">{r.ref}</span>
                </Cell>
                <Cell>{r.who}</Cell>
                <Cell muted>{r.type}</Cell>
                <Cell muted>{r.waiting}</Cell>
                <Cell>
                  <StatusBadge status={r.status} />
                </Cell>
              </Row>
            ))}
          </DataTable>
        </Card>

        <Card title="Recent activity">
          <ActivityTimeline items={adminActivity.slice(0, 6)} />
        </Card>
      </div>

      <div className="mt-5">
        <Card
          title="Documents awaiting review"
          action={
            <CardLink href="/demo/admin/documents">Review queue</CardLink>
          }
        >
          {adminDocuments
            .filter((d) => d.status === "pending")
            .map((d) => (
              <DocumentCard
                key={`${d.owner}-${d.document}`}
                name={d.document}
                owner={d.owner}
                category={d.role}
                uploaded={d.uploaded}
                status={d.status}
                actions={
                  <>
                    <DemoButton>View</DemoButton>
                    <DemoButton tone="solid">Approve</DemoButton>
                    <DemoButton>Request changes</DemoButton>
                  </>
                }
              />
            ))}
        </Card>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────── STUDENT ─ */

function StudentDashboard() {
  const who = demoIdentities.student;

  return (
    <>
      <PageHeading
        eyebrow={roleContext.student.eyebrow}
        title={`Welcome back, ${firstName(who.name)}.`}
        lead={roleContext.student.greeting}
      />

      <NextAction {...studentNextAction} />

      <div className="mt-5">
        <Card title="Your journey">
          <ProgressTracker stages={studentJourney} />
        </Card>
      </div>

      <div className="mt-5 grid items-start gap-5 lg:grid-cols-[1.3fr_1fr]">
        <Card
          title="Applications"
          action={
            <CardLink href="/demo/student/applications">View all</CardLink>
          }
        >
          <ul className="space-y-4">
            {studentApplications.map((a) => (
              <li
                key={a.university}
                className="flex flex-wrap items-start justify-between gap-3 border-b border-line pb-4 last:border-0 last:pb-0"
              >
                <span className="min-w-0">
                  <span className="block text-[0.98rem] font-medium text-fg">{a.university}</span>
                  <span className="mt-0.5 block text-[0.85rem] text-muted">{a.programme}</span>
                  <span className="mt-0.5 block text-[0.76rem] text-faint">
                    {a.country} · {a.intake}
                  </span>
                </span>
                <StatusBadge status={a.status} />
              </li>
            ))}
          </ul>
        </Card>

        <Card
          title="Documents"
          action={
            <CardLink href="/demo/student/documents">View all</CardLink>
          }
        >
          {studentDocuments.slice(0, 4).map((d) => (
            <DocumentCard key={d.name} name={d.name} category={d.category} status={d.status} />
          ))}
        </Card>
      </div>
    </>
  );
}

/* ──────────────────────────────────────────────────────────── JOB SEEKER ─ */

function JobSeekerDashboard() {
  const who = demoIdentities["job-seeker"];

  return (
    <>
      <PageHeading
        eyebrow={roleContext["job-seeker"].eyebrow}
        title={`Welcome back, ${firstName(who.name)}.`}
        lead={roleContext["job-seeker"].greeting}
      />

      <NextAction {...jobSeekerNextAction} />

      <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {jobSeekerHighlights.map((h) => (
          <StatCard key={h.label} label={h.label} value={h.value} />
        ))}
      </div>

      <div className="mt-5">
        <Card title="Your search">
          <ProgressTracker stages={jobSeekerJourney} />
        </Card>
      </div>

      <div className="mt-5 grid items-start gap-5 lg:grid-cols-[1.3fr_1fr]">
        <Card
          title="Applications"
          action={
            <CardLink href="/demo/job-seeker/applications">View all</CardLink>
          }
        >
          <ul className="space-y-4">
            {jobSeekerApplications.slice(0, 4).map((a) => (
              <li
                key={`${a.employer}-${a.role}`}
                className="flex flex-wrap items-start justify-between gap-3 border-b border-line pb-4 last:border-0 last:pb-0"
              >
                <span className="min-w-0">
                  <span className="block text-[0.98rem] font-medium text-fg">{a.role}</span>
                  <span className="mt-0.5 block text-[0.85rem] text-muted">{a.employer}</span>
                  <span className="mt-0.5 block text-[0.76rem] text-faint">
                    {a.city}, {a.country}
                    {a.note ? ` · ${a.note}` : ""}
                  </span>
                </span>
                <StatusBadge status={a.status} />
              </li>
            ))}
          </ul>
        </Card>

        <Card
          title="Interviews"
          action={
            <CardLink href="/demo/job-seeker/interviews">View all</CardLink>
          }
        >
          <ul className="space-y-4">
            {jobSeekerInterviews.map((i) => (
              <li key={i.employer} className="border-b border-line pb-4 last:border-0 last:pb-0">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <span className="min-w-0">
                    <span className="block text-[0.95rem] font-medium text-fg">{i.employer}</span>
                    <span className="mt-0.5 block text-[0.83rem] text-muted">{i.role}</span>
                  </span>
                  <StatusBadge status={i.status} />
                </div>
                <p className="mt-1.5 text-[0.78rem] text-faint">
                  {i.when} · {i.format}
                </p>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}

/* ────────────────────────────────────────────────────────────── BUSINESS ─ */

function BusinessDashboard() {
  const who = demoIdentities.business;

  return (
    <>
      <PageHeading
        eyebrow={roleContext.business.eyebrow}
        title={`Welcome back, ${who.name}`}
        lead={roleContext.business.greeting}
      />

      <NextAction {...businessNextAction} />

      <div className="mt-5 grid items-start gap-5 lg:grid-cols-[1.3fr_1fr]">
        <Card
          title="Active requests"
          action={
            <CardLink href="/demo/business/requests">View all</CardLink>
          }
        >
          <ul className="space-y-4">
            {businessRequests.map((r) => (
              <li
                key={r.ref}
                className="flex flex-wrap items-start justify-between gap-3 border-b border-line pb-4 last:border-0 last:pb-0"
              >
                <span className="min-w-0">
                  <span className="block text-[0.98rem] font-medium text-fg">{r.name}</span>
                  <span className="mt-0.5 block text-[0.85rem] text-muted">{r.detail}</span>
                  <span className="num mt-0.5 block text-[0.75rem] text-faint">
                    {r.ref} · updated {r.updated}
                  </span>
                </span>
                <StatusBadge status={r.status} />
              </li>
            ))}
          </ul>
        </Card>

        <Card
          title="Your services"
          action={
            <CardLink href="/demo/business/services">All services</CardLink>
          }
        >
          <ul className="space-y-3.5">
            {businessServices.slice(0, 4).map((s) => (
              <li
                key={s.name}
                className="flex items-center justify-between gap-3 border-b border-line pb-3.5 last:border-0 last:pb-0"
              >
                <span className="text-[0.9rem] text-fg">{s.name}</span>
                <StatusBadge status={s.status} />
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}

/* ──────────────────────────────────────────────────────────────── router ─ */

const DASHBOARDS: Record<DemoRole, () => React.ReactElement> = {
  admin: AdminDashboard,
  student: StudentDashboard,
  "job-seeker": JobSeekerDashboard,
  business: BusinessDashboard,
};

export default async function DemoDashboard({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const { role } = await params;
  if (!isDemoRole(role)) notFound();
  const Dashboard = DASHBOARDS[role];
  return <Dashboard />;
}
