import type { Metadata } from "next";
import { JsonLd } from "@/components/ui/Primitives";
import { BpPage } from "@/components/bp/page/BpPage";
import { PageHero } from "@/components/bp/page/PageHero";
import { PhotoStack } from "@/components/bp/page/PhotoStack";
import { Band, SectionHead } from "@/components/bp/page/SectionHead";
import { Faq } from "@/components/bp/page/Faq";
import { DepartureBoard } from "@/components/bp/DepartureBoard";
import { DestinationGates } from "@/components/bp/DestinationGates";
import { Journey } from "@/components/bp/journey/Journey";
import { PartnerPosters } from "@/components/bp/PartnerPosters";
import { FinalCall } from "@/components/bp/FinalCall";
import { InlineCta } from "@/components/bp/InlineCta";
import { Programmes } from "@/components/bp/study/Programmes";
import { FundingBoard } from "@/components/bp/study/FundingBoard";
import { Support } from "@/components/bp/study/Support";
import { homeStats } from "@/data/stats";
import { studyFaqs, studyCaveat, studyDestinations } from "@/data/study";
import { partnerCaveat } from "@/data/partners";
import { company } from "@/data/company";
import { breadcrumbSchema, buildMetadata, faqSchema, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Study Abroad in Europe | Degrees, Scholarships & Visas",
  description:
    "Ten European destinations, English-taught degrees, twelve funding schemes and one named consultant from your first message to your first week abroad.",
  path: "/study-abroad",
});

/**
 * /study-abroad — the student's page, on the Boarding Pass system.
 *
 * Section order follows the decision a student actually makes:
 *   proof → where → what subject → what happens → can I fund it →
 *   who vouches → what's included → objections → act.
 *
 * Everything renders from data/ (study.ts, stats.ts, partners.ts); the
 * shared homepage pieces (board, gates, journey, partner posters, final call)
 * are reused rather than copied, so the two pages cannot disagree.
 */
export default function StudyAbroadPage() {
  return (
    <BpPage>
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
            provider: { "@type": "Organization", name: company.name, url: SITE_URL },
            areaServed: studyDestinations.map((d) => ({ "@type": "Country", name: d.country })),
            description:
              "Advisory for international students on European universities, programme choice, scholarships, applications, student visas and arrival.",
          },
        ]}
      />

      <PageHero
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Study Abroad", href: "/study-abroad" },
        ]}
        eyebrow="Study abroad in Europe"
        lines={[{ text: "An EU degree," }, { text: "planned properly" }, { text: "from day one.", mark: true }]}
        lede="Ten countries, English-taught programmes, twelve funding schemes, and one named consultant who stays with you from the first WhatsApp message to your first week on campus."
        primary={{ label: "Book a free consultation", href: "/contact#journey" }}
        secondary={{ label: "Explore destinations", href: "#destinations" }}
        visual={
          <PhotoStack
            photos={[
              { src: "/images/study-vienna.webp", alt: "Arcaded courtyard of a historic European university", caption: "Your campus" },
              { src: "/images/study-campus.webp", alt: "Neoclassical university building on a sunny day", caption: "Your university" },
              { src: "/images/study-graduation.webp", alt: "Graduates raising mortarboards and rolled diplomas", caption: "Your graduation" },
            ]}
          />
        }
      />

      <DepartureBoard stats={homeStats} />
      <DestinationGates />
      <Programmes />
      <Journey />
      <FundingBoard />

      <Band id="universities" labelledBy="unis-title">
        <SectionHead
          id="unis-title"
          eyebrow="Partner universities"
          title={
            <>
              Institutions we work with <span className="bp-outline">directly.</span>
            </>
          }
          aside="Every partnership is publicly announced. More are being signed. New partners appear here first."
        />
        <PartnerPosters />
        <InlineCta className="mt-2" lead="Want a place at one of these?" label="Apply through SnZ" href="/contact#journey" />
        <p className="mt-5 max-w-3xl text-[0.85rem] leading-relaxed text-[var(--bp-faint)]">{partnerCaveat}</p>
      </Band>

      <Support />

      <Band id="faqs" labelledBy="faq-title">
        <SectionHead
          id="faq-title"
          eyebrow="Questions students ask"
          title={
            <>
              Straight answers, <span className="bp-outline">before you ask.</span>
            </>
          }
          aside={
            <>
              Something else on your mind? Email{" "}
              <a href={`mailto:${company.contact.email}`} className="font-semibold text-[var(--bp-strong)] underline decoration-[var(--color-runway)] underline-offset-4">
                {company.contact.email}
              </a>
              .
            </>
          }
        />
        <Faq items={studyFaqs} />
        <p className="mt-8 max-w-4xl text-[0.85rem] leading-relaxed text-[var(--bp-faint)]">{studyCaveat}</p>
      </Band>

      <FinalCall />
    </BpPage>
  );
}
