import Link from "next/link";
import { requireUser } from "@/lib/auth/guard";
import { isDatabaseConfigured } from "@/lib/db/client";
import {
  PortalHeading,
  Panel,
  EmptyState,
  StatusPill,
  DataRow,
} from "@/components/portal/Pieces";
import { NotConfigured } from "@/components/portal/NotConfigured";
import { getCases } from "@/lib/portal/data";

export default async function Page() {
  const { session } = await requireUser();

  if (!isDatabaseConfigured()) {
    return (
      <>
        <PortalHeading eyebrow="Your file" title="Applications & requests" />
        <NotConfigured what="Case tracking" />
      </>
    );
  }

  const cases = await getCases(session.userId);

  return (
    <>
      <PortalHeading
        eyebrow="Your file"
        title="Applications & requests"
        lead="Everything we are working on for you, with a status and a named next action on each."
      />
      <Panel padded={cases.length === 0}>
        {cases.length === 0 ? (
          <EmptyState
            icon="file"
            title="Nothing open yet"
            body="When we begin preparing something with you — an application, a formation, a licence file — it appears here with its current status."
            action={{ label: "Start a conversation", href: "/portal/messages" }}
          />
        ) : (
          <div className="p-5">
            {cases.map((c) => (
              <DataRow
                key={c.id}
                label={c.title}
                value={<StatusPill status={c.status} label={c.status.replace(/_/g, " ")} />}
                meta={<span className="label text-faint">{c.country ?? ""}</span>}
              />
            ))}
          </div>
        )}
      </Panel>
    </>
  );
}
