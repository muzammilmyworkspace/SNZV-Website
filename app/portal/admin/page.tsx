import Link from "next/link";
import { requireStaff } from "@/lib/auth/guard";
import { isAdmin } from "@/lib/auth/guard";
import {
  getAdminOverview,
  getCasesForAdvisor,
  getAssignedClients,
} from "@/lib/db/repos/portal";
import { isDatabaseConfigured } from "@/lib/db/client";
import { ROLE_LABEL, type Role } from "@/lib/auth/types";
import {
  PortalHeading,
  Panel,
  EmptyState,
  SummaryStat,
  StatusPill,
  DataRow,
} from "@/components/portal/Pieces";
import { NotConfigured } from "@/components/portal/NotConfigured";

/**
 * STAFF OVERVIEW
 *
 * Two views from one route:
 *   • advisor      → only clients and cases assigned to them
 *   • admin/super  → everything
 *
 * The scoping is done in SQL (see lib/db/repos/portal.ts), not by filtering in
 * this component, so an authorization mistake here still cannot leak rows.
 * Every figure is a real COUNT — nothing is seeded or estimated.
 */
export default async function AdminPage() {
  const { session, role } = await requireStaff();
  const admin = isAdmin(role);

  if (!isDatabaseConfigured()) {
    return (
      <>
        <PortalHeading
          eyebrow="Staff"
          title={admin ? "Administrator overview" : "Advisor overview"}
        />
        <NotConfigured what="Staff tooling" />
      </>
    );
  }

  /*
    ONE query for the admin view, not five.

    Five independent reads through Promise.all opened five connections at once,
    and Supabase's transaction pooler starves rather than refuses: it completes
    the handshake before it has a backend, so the connection looks established
    and the query never starts. `connect_timeout` is already satisfied by then
    and `statement_timeout` has not begun, so nothing fires and the request
    hangs until the platform kills it. Every other admin page issues two reads
    and was fine; this one timed out at thirty seconds, every time, with a
    platform timeout in the logs and no database error to explain it.

    `getAdminOverview` returns the counts, the recent cases, the review queue
    and the newest users as JSON from a single statement — one connection, one
    round trip, ~200ms. The advisor view still uses its own scoped queries,
    which are two, not five.
  */
  const overview = admin ? await getAdminOverview(12, 10, 8) : null;

  const [advisorCases, myClients] = admin
    ? [[], []]
    : await Promise.all([
        getCasesForAdvisor(session.userId),
        getAssignedClients(session.userId),
      ]);

  const metrics = (overview?.metrics ?? {}) as Record<string, number>;
  const cases = admin ? (overview?.cases ?? []) : advisorCases;
  const pendingDocs = overview?.pendingDocuments ?? [];
  const recentUsers = overview?.recentUsers ?? [];

  return (
    <>
      <PortalHeading
        eyebrow="Staff"
        title={admin ? "Administrator overview" : "Advisor overview"}
        lead={
          admin
            ? "Live figures from the database. Every number is a real count."
            : "Your assigned clients and the cases you are responsible for."
        }
        meta={
          metrics ? (
            <div className="flex flex-wrap gap-x-9 gap-y-5">
              <SummaryStat label="Total users" value={metrics.totalUsers} />
              <SummaryStat label="Students" value={metrics.students} />
              <SummaryStat label="Professionals" value={metrics.professionals} />
              <SummaryStat label="Businesses" value={metrics.businesses} />
              <SummaryStat label="Open cases" value={metrics.openCases} />
              <SummaryStat label="Docs to review" value={metrics.pendingDocuments} />
              <SummaryStat label="Appointments" value={metrics.appointments} />
              <SummaryStat label="Unread" value={metrics.unreadMessages} />
            </div>
          ) : (
            <div className="flex flex-wrap gap-x-9 gap-y-5">
              <SummaryStat label="My clients" value={myClients.length} />
              <SummaryStat label="My cases" value={cases.length} />
            </div>
          )
        }
      />

      <div className="grid items-start gap-5 lg:grid-cols-[1.5fr_1fr]">
        <Panel
          title={admin ? "Recent cases" : "My cases"}
          action={
            <Link href="/portal/admin/cases" className="label text-faint transition-colors hover:text-accent">
              View all
            </Link>
          }
        >
          {cases.length === 0 ? (
            <EmptyState
              icon="file"
              title="No cases yet"
              body={
                admin
                  ? "Cases appear here as they are opened for clients."
                  : "Cases assigned to you appear here."
              }
            />
          ) : (
            <div className="rail overflow-x-auto">
              <table className="w-full min-w-[560px] text-left">
                <caption className="sr-only">Cases</caption>
                <thead>
                  <tr className="border-b border-line">
                    {["Client", "Case", "Status", "Updated"].map((h) => (
                      <th key={h} scope="col" className="label pb-3 pr-4 text-faint">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cases.map((c) => (
                    <tr key={c.id} className="border-b border-line last:border-0">
                      <td className="py-3 pr-4">
                        <Link
                          href={`/portal/admin/cases/${c.id}`}
                          className="text-[0.9rem] text-fg hover:text-accent"
                        >
                          {c.clientName}
                        </Link>
                      </td>
                      <td className="py-3 pr-4 text-[0.86rem] text-muted">{c.title}</td>
                      <td className="py-3 pr-4">
                        <StatusPill status={c.status} label={c.status.replace(/_/g, " ")} />
                      </td>
                      <td className="py-3 text-[0.82rem] text-faint">
                        {new Date(c.updatedAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>

        <Panel
          title={admin ? "Documents awaiting review" : "My clients"}
          action={
            admin ? (
              <Link href="/portal/admin/documents" className="label text-faint transition-colors hover:text-accent">
                Review
              </Link>
            ) : undefined
          }
        >
          {admin ? (
            pendingDocs.length === 0 ? (
              <EmptyState
                icon="check"
                title="Nothing awaiting review"
                body="Documents clients upload appear here for approval."
              />
            ) : (
              pendingDocs.map((d) => (
                <DataRow
                  key={d.id}
                  label={d.name}
                  value={<StatusPill status={d.status} label={d.status.replace(/_/g, " ")} />}
                  meta={<span className="label text-faint">{d.ownerName}</span>}
                />
              ))
            )
          ) : myClients.length === 0 ? (
            <EmptyState
              icon="search"
              title="No clients assigned"
              body="An administrator assigns clients to you. They will appear here."
            />
          ) : (
            myClients.map((c) => (
              <DataRow
                key={c.id}
                label={c.name}
                value={ROLE_LABEL[c.role as Role]}
              />
            ))
          )}
        </Panel>
      </div>

      {admin && (
        <div className="mt-5 grid items-start gap-5 lg:grid-cols-2">
          <Panel
            title="Recent registrations"
            action={
              <Link href="/portal/admin/users" className="label text-faint transition-colors hover:text-accent">
                Manage users
              </Link>
            }
          >
            {recentUsers.length === 0 ? (
              <EmptyState
                icon="search"
                title="No accounts yet"
                body="Registrations appear here as clients create accounts."
              />
            ) : (
              recentUsers.map((u) => (
                <DataRow
                  key={u.id}
                  label={u.name}
                  value={
                    <StatusPill
                      status={u.status === "active" ? "approved" : "needs_update"}
                      label={u.status}
                    />
                  }
                  meta={<span className="label text-faint">{ROLE_LABEL[u.role]}</span>}
                />
              ))
            )}
          </Panel>

          <Panel title="Operations">
            <div className="grid gap-2">
              {[
                { href: "/portal/admin/users", label: "Users & roles" },
                { href: "/portal/admin/cases", label: "Cases" },
                { href: "/portal/admin/documents", label: "Document review" },
                { href: "/portal/admin/staff", label: "Advisor assignments" },
                { href: "/portal/admin/audit", label: "Audit log" },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="group flex items-center justify-between rounded-[var(--radius-sm)] border border-line px-4 py-3 text-[0.88rem] text-fg transition-colors hover:border-moss-400/50"
                >
                  {l.label}
                  <svg viewBox="0 0 12 12" fill="none" aria-hidden className="h-3 w-3 text-accent opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100">
                    <path d="M1 6h9M6.5 2.5L10 6l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              ))}
            </div>
          </Panel>
        </div>
      )}
    </>
  );
}
