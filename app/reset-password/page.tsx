import type { Metadata } from "next";
import { AuthShell } from "@/components/portal/AuthShell";
import { ResetForm, AuthUnavailable } from "@/components/portal/AuthForms";
import { authConfigured } from "@/lib/auth/session";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Set a New Password",
  description: "Choose a new password for your SnZ Ventures account.",
  path: "/reset-password",
  noIndex: true,
});

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <AuthShell
      title="Set a new password."
      lead="Choose something you haven't used elsewhere."
    >
      {authConfigured() ? <ResetForm token={token ?? ""} /> : <AuthUnavailable />}
    </AuthShell>
  );
}
