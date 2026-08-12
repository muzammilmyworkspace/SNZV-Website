import { requireAdmin } from "@/lib/auth/guard";
import { listUsers, listAdvisors } from "@/lib/db/repos/users";
import { isDatabaseConfigured } from "@/lib/db/client";
import { PortalHeading, Panel } from "@/components/portal/Pieces";
import { NotConfigured } from "@/components/portal/NotConfigured";
import { UserTable } from "@/components/portal/UserTable";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; role?: string; status?: string }>;
}) {
  const { session } = await requireAdmin();
  const params = await searchParams;

  if (!isDatabaseConfigured()) {
    return (
      <>
        <PortalHeading eyebrow="Staff" title="Users & roles" />
        <NotConfigured what="User management" />
      </>
    );
  }

  const [users, advisors] = await Promise.all([
    listUsers({
      q: params.q,
      role: (params.role as never) ?? "all",
      status: (params.status as never) ?? "all",
      limit: 100,
    }),
    listAdvisors(),
  ]);

  return (
    <>
      <PortalHeading
        eyebrow="Staff"
        title="Users & roles"
        lead="Search, suspend, assign an advisor or change a role. Every change is written to the audit log."
      />
      <Panel padded={false}>
        <UserTable
          users={users}
          advisors={advisors.map((a) => ({ id: a.id, name: a.name }))}
          actorRole={session.role}
          actorId={session.userId}
        />
      </Panel>
    </>
  );
}
