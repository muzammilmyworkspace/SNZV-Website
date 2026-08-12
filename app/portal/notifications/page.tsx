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
import { getNotifications } from "@/lib/portal/data";

export default async function Page() {
  const { session } = await requireUser();

  if (!isDatabaseConfigured()) {
    return (
      <>
        <PortalHeading eyebrow="Contact" title="Notifications" />
        <NotConfigured what="Notifications" />
      </>
    );
  }

  const notifications = await getNotifications(session.userId);

  return (
    <>
      <PortalHeading
        eyebrow="Contact"
        title="Notifications"
        lead="Document requests, status changes, replies and reminders."
      />
      <Panel padded={notifications.length === 0}>
        {notifications.length === 0 ? (
          <EmptyState
            icon="bell"
            title="You are up to date"
            body="Notifications appear here when something changes on your case. We keep them meaningful — no digests, no noise."
          />
        ) : (
          <div className="p-5">
            {notifications.map((n) => (
              <div key={n.id} className="border-b border-line py-4 last:border-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[0.92rem] font-semibold text-fg">{n.title}</p>
                    {n.body && <p className="mt-1 text-[0.85rem] leading-relaxed text-muted">{n.body}</p>}
                  </div>
                  <span className="label shrink-0 text-faint">
                    {new Date(n.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                  </span>
                </div>
                {n.href && (
                  <Link href={n.href} className="label mt-3 inline-flex text-accent">
                    <span className="draw">Open</span>
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </Panel>
    </>
  );
}
