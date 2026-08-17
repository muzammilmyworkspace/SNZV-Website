import { notFound } from "next/navigation";
import { isDemoRole } from "@/lib/demo/config";
import { DemoShell } from "@/components/demo/DemoShell";

export default async function RoleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ role: string }>;
}) {
  const { role } = await params;
  // The role comes out of the URL, so it is validated against the known set
  // before it reaches anything that indexes by it.
  if (!isDemoRole(role)) notFound();

  return <DemoShell role={role}>{children}</DemoShell>;
}
