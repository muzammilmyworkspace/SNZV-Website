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
        title="Appointments"
        lead="Consultations, document reviews and check-ins with your advisor."
      />

      <EmptyState
        icon="calendar"
        title="No appointments scheduled"
        body="Request a consultation and we will confirm a time. Until calendar integration is connected, requests are handled by our team directly."
        action={{ label: "Request by message", href: "/portal/messages" }}
      />

      <div className="mt-8">
        <BackendRequired
          feature="Appointment scheduling"
          needs={["appointments table: type, advisor, start time, status","Advisor availability and a calendar integration (Google/Microsoft)","Confirmation and reminder emails"]}
        />
      </div>
    </>
  );
}
