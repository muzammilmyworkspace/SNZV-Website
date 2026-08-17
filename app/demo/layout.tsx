import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isDemoEnabled } from "@/lib/demo/config";

/**
 * THE GATE.
 *
 * Every /demo route passes through here. When demo mode is off the segment
 * calls notFound(), so the routes do not exist rather than existing and
 * refusing — a production deployment gives no sign a demo mode was ever built.
 *
 * `force-dynamic` matters: without it Next could statically prerender these
 * pages at build time, when the environment may differ from the environment
 * they would be served in. The gate must be evaluated per request.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Portal preview",
  // Never indexed under any circumstances.
  robots: { index: false, follow: false, nocache: true },
};

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  if (!isDemoEnabled()) notFound();
  return <>{children}</>;
}
