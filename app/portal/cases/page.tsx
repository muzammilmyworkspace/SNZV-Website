import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import {
  PortalHeading,
  Panel,
  EmptyState,
  BackendRequired,
} from "@/components/portal/Pieces";

export default async function Page() {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <>
      <PortalHeading
        eyebrow="Your file"
        title="Applications & requests"
        lead="Everything we are working on for you, with a status and a named next action on each."
      />

      <Panel>
      <EmptyState
        icon="file"
        title="Nothing open yet"
        body="When we begin preparing something with you — an application, a formation, a licence file — it appears here with its current status."
        action={{ label: "Start a conversation", href: "/portal/messages" }}
      />
      </Panel>

      <div className="mt-8">
        <BackendRequired
          feature="Case management"
          needs={["cases table: title, country, status, next action, assigned advisor, updated timestamp","Status transitions restricted to staff roles"]}
        />
      </div>
    </>
  );
}
