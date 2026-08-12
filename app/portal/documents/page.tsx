import { requireUser } from "@/lib/auth/guard";
import { isDatabaseConfigured } from "@/lib/db/client";
import { NotConfigured } from "@/components/portal/NotConfigured";
import { getDocuments, REQUIRED_DOCUMENTS } from "@/lib/portal/data";
import {
  PortalHeading,
  Panel,
  DataRow,
  StatusPill,
  BackendRequired,
} from "@/components/portal/Pieces";

export default async function DocumentsPage() {
  const { session } = await requireUser();

  const documents = await getDocuments(session.userId);
  const configured = isDatabaseConfigured();
  const required = REQUIRED_DOCUMENTS[session.role] ?? [];

  const categories = [...new Set(required.map((r) => r.category))];

  return (
    <>
      <PortalHeading
        eyebrow="Your file"
        title="Documents"
        lead="Everything you send us, in one place — with its review status."
      />

      {documents.length === 0 && required.length > 0 && (
        <div className="grid gap-5 lg:grid-cols-2">
          {categories.map((cat) => (
            <Panel key={cat} title={cat}>
              {required
                .filter((r) => r.category === cat)
                .map((r) => (
                  <DataRow
                    key={r.name}
                    label={r.name}
                    value={<StatusPill status="required" label="Required" />}
                  />
                ))}
            </Panel>
          ))}
        </div>
      )}

      <div className="mt-5">
        <Panel title="Uploading">
          <p className="text-[0.88rem] leading-relaxed text-muted">
            Upload is disabled until secure storage is connected. These files
            contain identity data, so they will be stored privately and served
            only through short-lived, access-controlled links — never from a
            public URL.
          </p>
          <p className="mt-4 text-[0.86rem] leading-relaxed text-muted">
            In the meantime, send documents by reply to your advisor and we will
            file them against your case.
          </p>
        </Panel>
      </div>

      <div className="mt-8">
        <BackendRequired
          feature="Secure document storage"
          needs={[
            "Private object storage (S3/R2) with server-signed, short-lived download URLs",
            "documents table: owner, category, status, storage key, reviewer",
            "Virus scanning on upload and an audit trail of every access",
          ]}
        />
      </div>
    </>
  );
}
