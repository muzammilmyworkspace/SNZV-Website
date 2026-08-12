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
        title="Messages"
        lead="Talk to the people handling your case, with the whole thread in one place."
      />

      <EmptyState
        icon="message"
        title="No messages yet"
        body="Your conversation with your advisor will appear here. In the meantime you can reach us by email or WhatsApp."
        action={{ label: "Contact us", href: "/contact" }}
      />

      <div className="mt-8">
        <BackendRequired
          feature="Messaging"
          needs={["conversations and messages tables scoped to the client and their advisor","Realtime transport (WebSocket/SSE) or polling, plus unread state","Attachment handling that reuses the secure document storage"]}
        />
      </div>
    </>
  );
}
