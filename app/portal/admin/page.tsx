import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { users } from "@/lib/auth/store";
import { STAFF_ROLES, ROLE_LABEL, type Role } from "@/lib/auth/types";
import {
  PortalHeading,
  Panel,
  EmptyState,
  BackendRequired,
} from "@/components/portal/Pieces";

/**
 * Staff overview.
 *
 * Authorisation happens here on the server, not in the UI. A client-role user
 * who guesses this URL is redirected — hiding the nav link is presentation,
 * this is the actual control.
 *
 * Every figure below is a real count from the user store. Nothing is seeded:
 * a dashboard that invents its own numbers is worse than an empty one.
 */
export default async function AdminPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (!STAFF_ROLES.includes(session.role)) redirect("/portal");

  const [all, byRole] = await Promise.all([users.list(), users.countByRole()]);

  const clientCounts: { role: Role; label: string; count: number }[] = [
    { role: "student", label: "Students", count: byRole.student ?? 0 },
    { role: "professional", label: "Professionals", count: byRole.professional ?? 0 },
    { role: "business", label: "Business clients", count: byRole.business ?? 0 },
  ];

  const recent = [...all]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 8);

  return (
    <>
      <PortalHeading
        title="Administrator overview"
        lead="Live counts from the account store. Case, document and appointment metrics arrive with the database."
      />

      {/* Real counts only */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Panel>
          <p className="label text-faint">Total accounts</p>
          <p className="num mt-2 text-[2.4rem] font-bold leading-none text-fg-strong">
            {all.length}
          </p>
        </Panel>
        {clientCounts.map((c) => (
          <Panel key={c.role}>
            <p className="label text-faint">{c.label}</p>
            <p className="num mt-2 text-[2.4rem] font-bold leading-none text-fg-strong">
              {c.count}
            </p>
          </Panel>
        ))}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <Panel title="Recent registrations">
          {recent.length === 0 ? (
            <EmptyState
              icon="search"
              title="No accounts yet"
              body="Registrations appear here as clients create accounts through the portal."
            />
          ) : (
            <div className="overflow-x-auto rail">
              <table className="w-full min-w-[520px] text-left">
                <caption className="sr-only">Recently registered accounts</caption>
                <thead>
                  <tr className="border-b border-line">
                    {["Name", "Type", "Registered", "Verified"].map((h) => (
                      <th
                        key={h}
                        scope="col"
                        className="label pb-3 pr-4 font-semibold text-faint"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recent.map((u) => (
                    <tr key={u.id} className="border-b border-line last:border-0">
                      <td className="py-3 pr-4">
                        <span className="block text-[0.9rem] text-fg">{u.name}</span>
                        {/* Email shown to staff only — this route is role-gated. */}
                        <span className="block text-[0.78rem] text-faint">{u.email}</span>
                      </td>
                      <td className="py-3 pr-4 text-[0.85rem] text-muted">
                        {ROLE_LABEL[u.role]}
                      </td>
                      <td className="py-3 pr-4 text-[0.85rem] text-muted">
                        {new Date(u.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="py-3 text-[0.85rem] text-muted">
                        {u.emailVerified ? "Yes" : "No"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>

        <Panel title="Pending work">
          <EmptyState
            icon="check"
            title="No queues yet"
            body="Pending document reviews, open requests, upcoming appointments and unread messages will surface here once those tables exist."
          />
        </Panel>
      </div>

      <div className="mt-8 space-y-5">
        <BackendRequired
          feature="Staff tooling"
          needs={[
            "Client search and filtering by type, status and assigned advisor",
            "Case status management with an audit trail of who changed what",
            "Document review queue with approve / request-update actions",
            "Appointment scheduling against advisor availability",
            "Granular staff permissions — advisors should see only assigned clients",
          ]}
        />

        <aside className="rounded-[var(--radius-md)] border border-line bg-raised p-5">
          <p className="label text-accent">Role assignment</p>
          <p className="mt-2 text-[0.86rem] leading-relaxed text-muted">
            Registration only ever creates client roles. Advisor and
            administrator roles must be granted deliberately — set the{" "}
            <span className="font-mono text-[0.8rem]">role</span> field on the
            account record. There is intentionally no self-service route to
            staff privileges.
          </p>
        </aside>
      </div>
    </>
  );
}
