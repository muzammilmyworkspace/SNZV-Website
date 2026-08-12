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
        title="Opportunities"
        lead="Roles we are actively mandated on, filtered to what you are genuinely eligible for."
      />

      <EmptyState
        icon="search"
        title="No opportunities listed"
        body="We only publish roles we hold a live mandate for. When one matches your profile and eligibility, it appears here — we will not pad this list."
        action={{ label: "Complete your profile", href: "/portal/profile" }}
      />

      <div className="mt-8">
        <BackendRequired
          feature="Opportunity listings"
          needs={["opportunities table with employer, country, permit category and requirements","Eligibility matching against the candidate profile","Employer consent before any role is published"]}
        />
      </div>
    </>
  );
}
