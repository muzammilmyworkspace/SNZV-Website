import Link from "next/link";
import { notFound } from "next/navigation";
import { isDemoRole, type DemoRole } from "@/lib/demo/config";
import { demoNav } from "@/lib/demo/nav";
import * as d from "@/lib/demo/data";
import {
  Card,
  StatusBadge,
  DataTable,
  Row,
  Cell,
  Tabs,
  PageHeading,
  EmptyState,
  DocumentCard,
  DemoButton,
  ProgressTracker,
  ChatThread,
  StatCard,
} from "@/components/demo/DemoUI";

/**
 * EVERY SECTION PAGE, for every role.
 *
 * One route rather than roughly thirty files. The sections are data-driven and
 * mostly presentational, so thirty near-identical page components would be
 * thirty places to keep a heading style consistent — and thirty files to
 * delete when the demo comes out.
 *
 * A section is only reachable if it appears in that role's navigation
 * (lib/demo/nav.ts). `/demo/student/users` 404s rather than rendering the
 * admin's user list under a student's chrome, which is the sort of thing that
 * makes a reviewer distrust everything else on screen.
 */

type Props = { params: Promise<{ role: string; section: string }> };

/* ---------------------------------------------------------------- pieces */

function ConsultationsPage({ role }: { role: DemoRole }) {
  const items =
    role === "admin"
      ? d.adminConsultations.map((c) => ({
          title: c.type,
          meta: `${c.who} · ${c.when}`,
          status: c.status,
        }))
      : d.demoConsultations.map((c) => ({
          title: c.type,
          meta: `${c.advisor} · ${c.when}`,
          status: c.status,
        }));

  const groups = [
    { key: "scheduled", label: "Upcoming" },
    { key: "new", label: "Requested" },
    { key: "completed", label: "Completed" },
    { key: "cancelled", label: "Cancelled" },
  ] as const;

  return (
    <>
      <PageHeading
        eyebrow="Consultations"
        title="Consultations"
        lead={
          role === "admin"
            ? "Every requested, scheduled and completed session across the platform."
            : "Your sessions with a SnZ advisor."
        }
        action={role !== "admin" ? <DemoButton tone="solid">Request a consultation</DemoButton> : undefined}
      />
      <div className="space-y-5">
        {groups.map((g) => {
          const rows = items.filter((i) => i.status === g.key);
          if (!rows.length) return null;
          return (
            <Card key={g.key} title={g.label}>
              <ul className="space-y-3.5">
                {rows.map((r, i) => (
                  <li
                    key={i}
                    className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3.5 last:border-0 last:pb-0"
                  >
                    <span className="min-w-0">
                      <span className="block text-[0.95rem] font-medium text-fg">{r.title}</span>
                      <span className="mt-0.5 block text-[0.8rem] text-faint">{r.meta}</span>
                    </span>
                    <StatusBadge status={r.status} />
                  </li>
                ))}
              </ul>
            </Card>
          );
        })}
      </div>
    </>
  );
}

function MessagesPage({ role }: { role: DemoRole }) {
  if (role === "admin") {
    const groups = ["Students", "Job Seekers", "Businesses"];
    return (
      <>
        <PageHeading
          eyebrow="Desk"
          title="Messages"
          lead="Client conversations, grouped by who is asking."
        />
        <div className="space-y-5">
          {groups.map((g) => {
            const rows = d.adminConversations.filter((c) => c.group === g);
            if (!rows.length) return null;
            return (
              <Card key={g} title={g} padded={false}>
                <ul className="divide-y divide-line">
                  {rows.map((c) => (
                    <li
                      key={c.who}
                      className="flex min-h-16 items-center justify-between gap-4 px-5 py-4"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-[0.93rem] font-medium text-fg">
                          {c.who}
                        </span>
                        <span className="mt-0.5 block truncate text-[0.83rem] text-muted">
                          {c.preview}
                        </span>
                      </span>
                      <span className="flex shrink-0 items-center gap-3">
                        {c.unread > 0 && (
                          <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-moss-400 px-1.5 text-[0.7rem] font-semibold text-navy-950">
                            {c.unread}
                          </span>
                        )}
                        <span className="text-[0.75rem] text-faint">{c.when}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </Card>
            );
          })}
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeading
        eyebrow="Contact"
        title="Messages"
        lead="Your thread with the SnZ desk — one conversation, whole history."
      />
      <Card>
        <ChatThread messages={d.demoThread} />
      </Card>
    </>
  );
}

function SettingsPage() {
  return (
    <>
      <PageHeading
        eyebrow="Account"
        title="Settings"
        lead="Contact details, security and what we notify you about."
      />
      <div className="grid items-start gap-5 lg:grid-cols-2">
        <Card title="Notifications">
          <ul className="space-y-4">
            {[
              ["Email notifications", "Document decisions and status changes"],
              ["Message alerts", "When your advisor replies"],
              ["Status updates", "When your application moves stage"],
            ].map(([label, hint]) => (
              <li key={label} className="flex items-start justify-between gap-4">
                <span>
                  <span className="block text-[0.9rem] text-fg">{label}</span>
                  <span className="mt-0.5 block text-[0.78rem] text-faint">{hint}</span>
                </span>
                <span
                  aria-hidden
                  className="mt-1 flex h-6 w-11 shrink-0 items-center rounded-full bg-moss-400 px-0.5"
                >
                  <span className="ml-auto h-5 w-5 rounded-full bg-white" />
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Security">
          <p className="text-[0.88rem] leading-relaxed text-muted">
            Password and sign-in settings live here in the real portal. In this
            preview they are shown but inactive.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <DemoButton>Change password</DemoButton>
            <DemoButton>Sign out everywhere</DemoButton>
          </div>
        </Card>
      </div>
    </>
  );
}

function DocumentsPage({ role }: { role: DemoRole }) {
  if (role === "admin") {
    return (
      <>
        <PageHeading
          eyebrow="Operations"
          title="Document review"
          lead="Everything clients have sent, newest first. Approve, or say what needs changing."
        />
        <Card>
          {d.adminDocuments.map((doc) => (
            <DocumentCard
              key={`${doc.owner}-${doc.document}`}
              name={doc.document}
              owner={doc.owner}
              category={doc.role}
              uploaded={doc.uploaded}
              status={doc.status}
              note={doc.note}
              actions={
                doc.status === "pending" ? (
                  <>
                    <DemoButton>View</DemoButton>
                    <DemoButton tone="solid">Approve</DemoButton>
                    <DemoButton>Request changes</DemoButton>
                  </>
                ) : (
                  <DemoButton>View</DemoButton>
                )
              }
            />
          ))}
        </Card>
      </>
    );
  }

  const docs =
    role === "student"
      ? d.studentDocuments
      : role === "job-seeker"
        ? d.jobSeekerDocuments
        : d.businessDocuments;

  const needsAction = docs.filter(
    (x) => x.status === "action_required" || x.status === "rejected"
  );

  return (
    <>
      <PageHeading
        eyebrow="Your file"
        title={role === "job-seeker" ? "CV & documents" : "Documents"}
        lead="Everything you send us, with where each one has got to."
        action={<DemoButton tone="solid">Upload document</DemoButton>}
      />

      {needsAction.length > 0 && (
        <div className="mb-5">
          <Card accent title="Needs your attention">
            {needsAction.map((x) => (
              <DocumentCard
                key={x.name}
                name={x.name}
                category={x.category}
                status={x.status}
                note={"note" in x ? x.note : undefined}
                actions={<DemoButton tone="solid">Upload replacement</DemoButton>}
              />
            ))}
          </Card>
        </div>
      )}

      <Card title="All documents">
        {docs.map((x) => (
          <DocumentCard
            key={x.name}
            name={x.name}
            category={x.category}
            status={x.status}
            uploaded={"uploaded" in x ? x.uploaded : undefined}
          />
        ))}
      </Card>
    </>
  );
}

function ProfilePage({ role }: { role: DemoRole }) {
  if (role === "business") {
    const p = d.businessProfile;
    return (
      <>
        <PageHeading
          eyebrow="Company"
          title="Company profile"
          lead="What we hold about your business. Keeping it current is what lets us advise accurately."
          action={<DemoButton>Edit profile</DemoButton>}
        />
        <Card>
          <dl>
            {Object.entries({
              "Company name": p.company,
              "Incorporation status": p.incorporation,
              Industry: p.industry,
              Headcount: p.headcount,
              "Current markets": p.currentMarkets,
              "Target markets": p.targetMarkets,
              "Primary contact": p.contact,
            }).map(([k, v]) => (
              <div
                key={k}
                className="grid gap-1 border-b border-line py-3 last:border-0 sm:grid-cols-[14rem_1fr] sm:gap-4"
              >
                <dt className="text-[0.82rem] text-faint">{k}</dt>
                <dd className="text-[0.9rem] text-fg">{v}</dd>
              </div>
            ))}
          </dl>
        </Card>
      </>
    );
  }

  const who = d.demoIdentities[role];
  return (
    <>
      <PageHeading
        eyebrow="Your details"
        title={role === "job-seeker" ? "My profile" : "Profile"}
        lead="What we hold about you. The fuller this is, the more useful our advice."
        action={<DemoButton>Edit profile</DemoButton>}
      />
      <div className="grid items-start gap-5 lg:grid-cols-[1fr_20rem]">
        <Card title="Details">
          <dl>
            {Object.entries(
              role === "student"
                ? {
                    "Full name": who.name,
                    Email: who.email,
                    Nationality: "Pakistani",
                    "Country of residence": "Pakistan",
                    "Highest qualification": "Bachelor's degree",
                    "Field of study": "Computer Science",
                    "Intended level": "Master's",
                    "Preferred intake": "September 2026",
                  }
                : {
                    "Full name": who.name,
                    Email: who.email,
                    "Current title": "Software Engineer",
                    "Total experience": "5–10 years",
                    Industry: "Technology & software",
                    "Target roles": "Backend / Platform Engineer",
                    "Work authorisation": "None — would need sponsorship",
                    "Relocation readiness": "1–3 months",
                  }
            ).map(([k, v]) => (
              <div
                key={k}
                className="grid gap-1 border-b border-line py-3 last:border-0 sm:grid-cols-[13rem_1fr] sm:gap-4"
              >
                <dt className="text-[0.82rem] text-faint">{k}</dt>
                <dd className="text-[0.9rem] text-fg">{v}</dd>
              </div>
            ))}
          </dl>
        </Card>
        <Card title="Profile completion">
          <p className="num text-[2.4rem] leading-none text-accent">82%</p>
          <p className="mt-3 text-[0.85rem] leading-relaxed text-muted">
            A few details still to add. They are what turn a general answer into
            one about your actual case.
          </p>
        </Card>
      </div>
    </>
  );
}

/* -------------------------------------------------------- role sections */

function adminSection(section: string, search: Record<string, string>) {
  switch (section) {
    case "users": {
      const tab = search.tab ?? "all";
      const byTab: Record<string, string | null> = {
        all: null,
        students: "Student",
        "job-seekers": "Job Seeker",
        businesses: "Business",
      };
      const filter = byTab[tab] ?? null;
      const rows = filter ? d.adminUsers.filter((u) => u.role === filter) : d.adminUsers;

      return (
        <>
          <PageHeading
            eyebrow="Operations"
            title="Users"
            lead="Everyone on the platform, with what they are and when they were last here."
          />
          <Tabs
            active={tab}
            items={[
              { key: "all", label: "All", href: "/demo/admin/users", count: d.adminUsers.length },
              { key: "students", label: "Students", href: "/demo/admin/users?tab=students", count: d.adminUsers.filter((u) => u.role === "Student").length },
              { key: "job-seekers", label: "Job Seekers", href: "/demo/admin/users?tab=job-seekers", count: d.adminUsers.filter((u) => u.role === "Job Seeker").length },
              { key: "businesses", label: "Businesses", href: "/demo/admin/users?tab=businesses", count: d.adminUsers.filter((u) => u.role === "Business").length },
            ]}
          />
          <Card padded={false}>
            <DataTable columns={["Name", "Email", "Role", "Status", "Registered", "Last activity", ""]} minWidth={900}>
              {rows.map((u) => (
                <Row key={u.email}>
                  <Cell>{u.name}</Cell>
                  <Cell muted>{u.email}</Cell>
                  <Cell>
                    <span className="label text-faint">{u.role}</span>
                  </Cell>
                  <Cell>
                    <StatusBadge
                      status={u.status === "active" ? "completed" : u.status === "pending" ? "pending" : "cancelled"}
                      label={u.status}
                    />
                  </Cell>
                  <Cell muted>{u.registered}</Cell>
                  <Cell muted>{u.lastActive}</Cell>
                  <Cell>
                    <DemoButton>Open</DemoButton>
                  </Cell>
                </Row>
              ))}
            </DataTable>
          </Card>
        </>
      );
    }

    case "requests": {
      const status = search.status ?? "all";
      const rows = status === "all" ? d.adminRequests : d.adminRequests.filter((r) => r.status === status);
      const count = (s: string) => (s === "all" ? d.adminRequests.length : d.adminRequests.filter((r) => r.status === s).length);

      return (
        <>
          <PageHeading
            eyebrow="Operations"
            title="Requests"
            lead="Every open request, longest-waiting first — the one at the top has been waiting most."
          />
          <Tabs
            active={status}
            items={[
              { key: "all", label: "All", href: "/demo/admin/requests", count: count("all") },
              { key: "new", label: "New", href: "/demo/admin/requests?status=new", count: count("new") },
              { key: "in_progress", label: "In progress", href: "/demo/admin/requests?status=in_progress", count: count("in_progress") },
              { key: "action_required", label: "Action required", href: "/demo/admin/requests?status=action_required", count: count("action_required") },
              { key: "completed", label: "Completed", href: "/demo/admin/requests?status=completed", count: count("completed") },
            ]}
          />
          <Card padded={false}>
            <DataTable columns={["Reference", "Client", "Type", "Subject", "Waiting", "Priority", "Status"]} minWidth={980}>
              {rows.map((r) => (
                <Row key={r.ref}>
                  <Cell>
                    <span className="num text-[0.84rem] text-accent">{r.ref}</span>
                  </Cell>
                  <Cell>{r.who}</Cell>
                  <Cell>
                    <span className="label text-faint">{r.type}</span>
                  </Cell>
                  <Cell muted>{r.subject}</Cell>
                  <Cell muted>{r.waiting}</Cell>
                  <Cell muted className="capitalize">{r.priority}</Cell>
                  <Cell>
                    <StatusBadge status={r.status} />
                  </Cell>
                </Row>
              ))}
            </DataTable>
          </Card>
        </>
      );
    }

    default:
      return null;
  }
}

function studentSection(section: string) {
  switch (section) {
    case "journey":
      return (
        <>
          <PageHeading
            eyebrow="Progress"
            title="My journey"
            lead="Where you are, what is done, and what comes next."
          />
          <Card>
            <ProgressTracker stages={d.studentJourney} />
          </Card>
          <div className="mt-5">
            <Card title="What happens next">
              <p className="text-[0.9rem] leading-relaxed text-muted">
                Your application is with Vilnius University. Once your passport
                is on file they can issue a conditional offer, and the visa
                stage begins from there.
              </p>
            </Card>
          </div>
        </>
      );

    case "applications":
      return (
        <>
          <PageHeading
            eyebrow="Study"
            title="Applications"
            lead="Every course we are preparing or have submitted for you."
          />
          <div className="grid gap-4 md:grid-cols-2">
            {d.studentApplications.map((a) => (
              <Card key={a.university}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[1.05rem] font-bold tracking-[-0.02em] text-fg-strong">
                      {a.university}
                    </p>
                    <p className="mt-1 text-[0.9rem] text-muted">{a.programme}</p>
                  </div>
                  <StatusBadge status={a.status} />
                </div>
                <dl className="mt-4 border-t border-line pt-3.5 text-[0.83rem]">
                  <div className="flex justify-between py-1">
                    <dt className="text-faint">Country</dt>
                    <dd className="text-fg">{a.country}</dd>
                  </div>
                  <div className="flex justify-between py-1">
                    <dt className="text-faint">Intake</dt>
                    <dd className="text-fg">{a.intake}</dd>
                  </div>
                </dl>
              </Card>
            ))}
          </div>
        </>
      );

    case "universities":
      return (
        <>
          <PageHeading
            eyebrow="Study"
            title="Universities"
            lead="Your shortlist, and what your advisor has suggested alongside it."
          />
          <div className="grid gap-4 md:grid-cols-2">
            {d.studentUniversities.map((u) => (
              <Card key={u.name}>
                <p className="text-[1.05rem] font-bold tracking-[-0.02em] text-fg-strong">{u.name}</p>
                <p className="mt-1 text-[0.85rem] text-muted">
                  {u.city}, {u.country} · founded {u.founded}
                </p>
                <p className="mt-3 border-t border-line pt-3 text-[0.85rem] text-muted">{u.note}</p>
              </Card>
            ))}
          </div>
        </>
      );

    case "scholarships":
      return (
        <>
          <PageHeading
            eyebrow="Funding"
            title="Scholarships"
            lead="Schemes relevant to your level and destinations. Award values are confirmed by the provider, not by us."
          />
          <div className="grid gap-4 md:grid-cols-2">
            {d.studentScholarships.map((s) => (
              <Card key={s.name} accent={s.eligible}>
                <div className="flex items-start justify-between gap-3">
                  <p className="text-[1.05rem] font-bold tracking-[-0.02em] text-fg-strong">{s.name}</p>
                  <StatusBadge
                    status={s.eligible ? "completed" : "pending"}
                    label={s.eligible ? "Eligible" : "Not eligible"}
                  />
                </div>
                <p className="mt-1 text-[0.83rem] text-faint">{s.provider}</p>
                <dl className="mt-4 border-t border-line pt-3.5 text-[0.85rem]">
                  <div className="flex justify-between gap-4 py-1">
                    <dt className="text-faint">Value</dt>
                    <dd className="text-right text-fg">{s.value}</dd>
                  </div>
                  <div className="flex justify-between gap-4 py-1">
                    <dt className="text-faint">Level</dt>
                    <dd className="text-fg">{s.level}</dd>
                  </div>
                  <div className="flex justify-between gap-4 py-1">
                    <dt className="text-faint">Deadline</dt>
                    <dd className="text-fg">{s.deadline}</dd>
                  </div>
                </dl>
              </Card>
            ))}
          </div>
        </>
      );

    default:
      return null;
  }
}

function jobSeekerSection(section: string) {
  switch (section) {
    case "jobs":
      return (
        <>
          <PageHeading
            eyebrow="Opportunities"
            title="Jobs"
            lead="Roles matched to your profile. We only list roles we are actually mandated on."
          />
          <div className="grid gap-4 md:grid-cols-2">
            {d.jobSeekerMatches.map((m) => (
              <Card key={`${m.employer}-${m.role}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[1.05rem] font-bold tracking-[-0.02em] text-fg-strong">{m.role}</p>
                    <p className="mt-1 text-[0.88rem] text-muted">
                      {m.employer} · {m.country}
                    </p>
                  </div>
                  <StatusBadge status="new" label={m.match} />
                </div>
                <p className="mt-3 border-t border-line pt-3 text-[0.85rem] text-muted">
                  Indicative range {m.salary}
                </p>
                <div className="mt-4">
                  <DemoButton tone="solid">Express interest</DemoButton>
                </div>
              </Card>
            ))}
          </div>
        </>
      );

    case "applications":
      return (
        <>
          <PageHeading
            eyebrow="Career"
            title="Applications"
            lead="Every role we have put you forward for, and where each one stands."
          />
          <Card padded={false}>
            <DataTable columns={["Role", "Employer", "Location", "Status", "Note"]} minWidth={820}>
              {d.jobSeekerApplications.map((a) => (
                <Row key={`${a.employer}-${a.role}`}>
                  <Cell>{a.role}</Cell>
                  <Cell muted>{a.employer}</Cell>
                  <Cell muted>
                    {a.city}, {a.country}
                  </Cell>
                  <Cell>
                    <StatusBadge status={a.status} />
                  </Cell>
                  <Cell muted>{a.note ?? "—"}</Cell>
                </Row>
              ))}
            </DataTable>
          </Card>
        </>
      );

    case "interviews":
      return (
        <>
          <PageHeading
            eyebrow="Career"
            title="Interviews"
            lead="Scheduled and pending. Preparation notes arrive from your advisor before each one."
          />
          <div className="grid gap-4 md:grid-cols-2">
            {d.jobSeekerInterviews.map((i) => (
              <Card key={i.employer} accent={i.status === "scheduled"}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[1.05rem] font-bold tracking-[-0.02em] text-fg-strong">{i.employer}</p>
                    <p className="mt-1 text-[0.88rem] text-muted">{i.role}</p>
                  </div>
                  <StatusBadge status={i.status} />
                </div>
                <p className="mt-3 border-t border-line pt-3 text-[0.85rem] text-muted">
                  {i.when} · {i.format}
                </p>
              </Card>
            ))}
          </div>
        </>
      );

    default:
      return null;
  }
}

function businessSection(section: string) {
  switch (section) {
    case "requests":
      return (
        <>
          <PageHeading
            eyebrow="Business"
            title="My requests"
            lead="Everything you have asked us to do, with a reference you can quote."
            action={<DemoButton tone="solid">New request</DemoButton>}
          />
          <Card padded={false}>
            <DataTable columns={["Reference", "Request", "Detail", "Updated", "Status"]} minWidth={860}>
              {d.businessRequests.map((r) => (
                <Row key={r.ref}>
                  <Cell>
                    <span className="num text-[0.84rem] text-accent">{r.ref}</span>
                  </Cell>
                  <Cell>{r.name}</Cell>
                  <Cell muted>{r.detail}</Cell>
                  <Cell muted>{r.updated}</Cell>
                  <Cell>
                    <StatusBadge status={r.status} />
                  </Cell>
                </Row>
              ))}
            </DataTable>
          </Card>
        </>
      );

    case "services":
      return (
        <>
          <PageHeading
            eyebrow="Business"
            title="Services"
            lead="What SnZ can take on for you. Regulated work is delivered through licensed partner firms."
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {d.businessServices.map((s) => (
              <Card key={s.name} className="flex flex-col">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-[1.02rem] font-bold tracking-[-0.02em] text-fg-strong">{s.name}</p>
                  <StatusBadge status={s.status} />
                </div>
                <p className="mt-2.5 flex-1 text-[0.86rem] leading-relaxed text-muted">{s.blurb}</p>
                <div className="mt-4">
                  <DemoButton tone={s.status === "new" ? "solid" : "line"}>{s.action}</DemoButton>
                </div>
              </Card>
            ))}
          </div>
        </>
      );

    default:
      return null;
  }
}

/* ---------------------------------------------------------------- router */

export default async function DemoSection({
  params,
  searchParams,
}: Props & { searchParams: Promise<Record<string, string | string[]>> }) {
  const { role, section } = await params;
  if (!isDemoRole(role)) notFound();

  // A section must belong to this role's own navigation, so one role's screens
  // can never render inside another's chrome.
  const allowed = demoNav[role].some((i) => i.href === section);
  if (!allowed) notFound();

  const raw = await searchParams;
  const search: Record<string, string> = {};
  for (const [k, v] of Object.entries(raw)) search[k] = Array.isArray(v) ? v[0] : v;

  // Shared sections first — these look the same wherever they appear.
  if (section === "messages") return <MessagesPage role={role} />;
  if (section === "consultations") return <ConsultationsPage role={role} />;
  if (section === "settings") return <SettingsPage />;
  if (section === "documents") return <DocumentsPage role={role} />;
  if (section === "profile") return <ProfilePage role={role} />;

  const content =
    role === "admin"
      ? adminSection(section, search)
      : role === "student"
        ? studentSection(section)
        : role === "job-seeker"
          ? jobSeekerSection(section)
          : businessSection(section);

  if (content) return content;

  // In the navigation but not yet drawn. Says so plainly rather than showing a
  // blank page that looks broken.
  return (
    <>
      <PageHeading eyebrow="Preview" title="Not in this preview yet" />
      <Card>
        <EmptyState
          title="This screen hasn't been designed yet"
          body="It's in the navigation so the information architecture can be reviewed as a whole. Everything else in this role is live."
          action={{ label: "Back to dashboard", href: `/demo/${role}` }}
        />
      </Card>
    </>
  );
}
