import { requireAdmin } from "@/lib/auth/guard";
import { listAdvisors, listUsers } from "@/lib/db/repos/users";
import { getAssignedClients } from "@/lib/db/repos/portal";
import { isDatabaseConfigured } from "@/lib/db/client";
import { PortalHeading, Panel, EmptyState, DataRow } from "@/components/portal/Pieces";
import { NotConfigured } from "@/components/portal/NotConfigured";
import { ROLE_LABEL } from "@/lib/auth/types";

export default async function StaffPage() {
  await requireAdmin();

  if (!isDatabaseConfigured()) {
    return (
      <>
        <PortalHeading eyebrow="Staff" title="Advisors" />
        <NotConfigured what="Staff management" />
      </>
    );
  }

  const advisors = await listAdvisors();
  const withClients = await Promise.all(
    advisors.map(async (a) => ({ advisor: a, clients: await getAssignedClients(a.id) }))
  );

  return (
    <>
      <PortalHeading
        eyebrow="Staff"
        title="Advisors & assignments"
        lead="Who handles which clients. Advisors can only ever see the clients assigned to them."
      />
      {withClients.length === 0 ? (
        <Panel>
          <EmptyState
            icon="search"
            title="No advisors yet"
            body="Promote a user to the advisor role from Users & roles, then assign clients to them."
            action={{ label: "Go to users", href: "/portal/admin/users" }}
          />
        </Panel>
      ) : (
        <div className="grid items-start gap-5 md:grid-cols-2">
          {withClients.map(({ advisor, clients }) => (
            <Panel key={advisor.id} title={`${advisor.name} · ${ROLE_LABEL[advisor.role]}`}>
              {clients.length === 0 ? (
                <p className="text-[0.86rem] text-muted">No clients assigned.</p>
              ) : (
                clients.map((c) => (
                  <DataRow key={c.id} label={c.name} value={ROLE_LABEL[c.role]} />
                ))
              )}
            </Panel>
          ))}
        </div>
      )}
    </>
  );
}
