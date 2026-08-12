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
        title="Tasks"
        lead="What we need from you, in the order it actually matters."
      />

      <Panel>
      <EmptyState
        icon="check"
        title="Nothing outstanding"
        body="When your advisor needs something specific — a transcript, a confirmation, a decision — it appears here rather than getting lost in email."
        
      />
      </Panel>

      <div className="mt-8">
        <BackendRequired
          feature="Task assignment"
          needs={["tasks table: owner, title, detail, due date, completion state","Advisor tooling to assign and close tasks"]}
        />
      </div>
    </>
  );
}
