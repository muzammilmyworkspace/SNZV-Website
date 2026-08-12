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
        title="Documents"
        lead="Everything you send us, in one place — with its review status."
      />

      <EmptyState
        icon="file"
        title="No documents uploaded"
        body="Upload is disabled until secure storage is connected. Documents contain identity data, so they must never be served from public URLs."
        
      />

      <div className="mt-8">
        <BackendRequired
          feature="Secure document storage"
          needs={["Private object storage (S3/R2) with server-signed, short-lived download URLs","documents table: owner, category, status, storage key, reviewer","Virus scanning on upload and an audit trail of every access"]}
        />
      </div>
    </>
  );
}
