import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import {
  PortalHeading,
  EmptyState,
  BackendRequired,
} from "@/components/portal/Pieces";

export default async function Page() {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <>
      <PortalHeading
        title="Your journey"
        lead="Each stage, what it involves, and where your case currently sits."
      />

      <EmptyState
        icon="check"
        title="Your stage hasn't been set yet"
        body="Once an advisor picks up your case they will mark your current stage here, so you always know what is happening and what comes next."
        action={{ label: "Message an advisor", href: "/portal/messages" }}
      />

      <div className="mt-8">
        <BackendRequired
          feature="Journey stage tracking"
          needs={["cases table with a stage column per client","Advisor tooling to advance a stage and record the reason"]}
        />
      </div>
    </>
  );
}
