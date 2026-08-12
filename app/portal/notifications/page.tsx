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
        title="Notifications"
        lead="Document requests, status changes, replies and reminders."
      />

      <EmptyState
        icon="bell"
        title="You are up to date"
        body="Notifications appear here when something changes on your case. We keep them meaningful — no digests, no noise."
        
      />

      <div className="mt-8">
        <BackendRequired
          feature="Notifications"
          needs={["notifications table with read state per user","Emitters on case status change, document review and new messages","Optional email delivery preferences"]}
        />
      </div>
    </>
  );
}
