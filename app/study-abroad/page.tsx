import type { Metadata } from "next";
import { StudyNav } from "@/components/sections/StudyNav";
import {
  StudyHero,
  StudyOverview,
  StudyDestinations,
  StudyUniversities,
  StudyProgrammes,
  StudyScholarships,
  StudyJourney,
  StudySupport,
} from "@/components/sections/Study";
import { Reviews } from "@/components/sections/Reviews";
import { VideoFeature } from "@/components/sections/VideoFeature";
import { FaqSection, CTASection } from "@/components/sections/PageParts";
import { JsonLd } from "@/components/ui/Primitives";
import { studyFaqs, studyCaveat, studyDestinations } from "@/data/study";
import { videoFeatures } from "@/data/media";
import { company } from "@/data/company";
import { breadcrumbSchema, buildMetadata, faqSchema, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Study Abroad in Europe — Universities, Scholarships & Visas",
  description:
    "Study in Europe with SnZ Ventures. Ten EU destinations, English-taught degrees from €900 a year, and one named advisor from choosing a university through application, scholarships, visa and departure.",
  path: "/study-abroad",
});

/**
 * /study-abroad
 *
 * A dedicated landing experience rather than the shared `PillarPage` renderer.
 * Careers and Business still share that component — this page outgrew it once
 * it needed destinations, programme families, funding and its own in-page
 * navigation, and forcing three structurally different pages through one
 * template would have degraded all three.
 *
 * Section order follows the decision a student actually makes: why → where →
 * which institution → what subject → can I fund it → what happens next → who
 * helps me → proof → objections → act.
 */
export default function StudyAbroadPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Study Abroad", path: "/study-abroad" },
          ]),
          faqSchema(studyFaqs),
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Study Abroad Advisory",
            serviceType: "International education advisory",
            provider: {
              "@type": "Organization",
              name: company.name,
              url: SITE_URL,
            },
            areaServed: studyDestinations.map((d) => ({
              "@type": "Country",
              name: d.country,
            })),
            description:
              "Advisory for international students on European universities, programme choice, scholarships, applications, student visas and arrival.",
          },
        ]}
      />

      <StudyHero />
      <StudyNav />

      <StudyOverview />
      <StudyDestinations />
      <StudyUniversities />
      <StudyProgrammes />

      <VideoFeature data={videoFeatures.study} />

      <StudyScholarships />
      <StudyJourney />
      <StudySupport />

      {/* Renders an honest placeholder until consented quotes exist. */}
      <Reviews />

      <div id="faqs" className="anchor-target">
        <FaqSection
          faqs={studyFaqs}
          page="study-abroad"
          title="Questions Students Actually Ask"
          caveat={studyCaveat}
        />
      </div>

      <CTASection
        title="Start Your Study Abroad Journey."
        lead="Tell us what you want to be doing in five years. We will tell you which European route gets you there — and whether it is realistic."
        primary={{ label: "Book a consultation", href: "/contact#journey" }}
        secondary={{
          label: "Message on WhatsApp",
          href: `https://wa.me/${company.contact.whatsapp}`,
          external: true,
        }}
      />
    </>
  );
}
