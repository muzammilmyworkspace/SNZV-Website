import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { PortalShell } from "@/components/portal/PortalShell";

export const metadata: Metadata = {
  title: "Client Portal",
  robots: { index: false, follow: false },
};

/**
 * Server-side authorisation for every /portal route.
 *
 * Middleware only checks that a cookie is present; this is where the signature
 * is actually verified. Every page under /portal is therefore guaranteed a
 * real session and none of them needs to re-check.
 */
export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login?next=/portal");

  return (
    <PortalShell name={session.name} role={session.role}>
      {children}
    </PortalShell>
  );
}
