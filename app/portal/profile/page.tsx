import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { users } from "@/lib/auth/store";
import { PROFILE_FIELDS } from "@/lib/portal/data";
import { PortalHeading } from "@/components/portal/Pieces";
import { ProfileForm } from "@/components/portal/ProfileForm";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await users.findById(session.userId);
  const fields = PROFILE_FIELDS[session.role] ?? [];

  return (
    <>
      <PortalHeading
        title="Your profile"
        lead="The more of this we have, the more specific our answer can be. Add what you know — you can return to it any time."
      />
      <ProfileForm
        fields={fields}
        initial={user?.profile ?? {}}
        name={session.name}
        email={session.email}
      />
    </>
  );
}
