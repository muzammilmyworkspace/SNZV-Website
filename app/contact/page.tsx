import type { Metadata } from "next";
import Image from "next/image";
import { JsonLd } from "@/components/ui/Primitives";
import { BpPage } from "@/components/bp/page/BpPage";
import { Band, SectionHead } from "@/components/bp/page/SectionHead";
import { Faq } from "@/components/bp/page/Faq";
import { FinalCall } from "@/components/bp/FinalCall";
import { Reveal } from "@/components/bp/Reveal";
import { ContactHero } from "@/components/bp/contact/ContactHero";
import { company } from "@/data/company";
import { studyFaqs } from "@/data/study";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contact | Book a Free Consultation",
  description:
    "Book a free consultation with SnZ Ventures, or message a counsellor on WhatsApp. Office in Vilnius, Lithuania.",
  path: "/contact",
});

/**
 * /contact — the page every CTA on the site points at.
 *
 * The boarding-pass form is the page, at `#journey` (the anchor every
 * "Book a consultation" link already uses). Above it, the four ways to reach a
 * person; below it, what happens after you press send, and the questions
 * people ask before they do.
 *
 * The form posts to /api/enquiry like every other form on the site. The
 * multi-pathway JourneyForm (careers / business) stays in the codebase for the
 * pillar pages; this page leads with the student enquiry because that is who
 * the site is for now.
 */

const AFTER = [
  { t: "A person reads it", b: "A consultant reads your request (not an autoresponder) and replies by email or WhatsApp, whichever you prefer." },
  { t: "Your free consultation", b: "A call about where you want to end up, your budget and your timing. An honest read on your options, including when the answer is no." },
  { t: "Your shortlist, in writing", b: "If you go ahead: a short list of programmes and countries, with the costs and the trade-offs stated plainly." },
  { t: "Your portal login", b: "Your file opens in the SnZ portal, so every document, deadline and decision is visible to you from then on." },
];

export default function ContactPage() {
  const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${company.contact.streetAddress}, ${company.contact.postalCode} ${company.contact.city}`
  )}`;

  return (
    <BpPage>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />

      <ContactHero />

      <Band labelledBy="form-title" className="!pt-4">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <div>
            <p className="bp-eyebrow">Check in</p>
            <h2 id="form-title" className="bp-display bp-h3 mt-4">
              Your boarding pass to a free consultation.
            </h2>
            <div className="mt-6">
              <FinalCall compact anchorId="journey" />
            </div>
          </div>

          <aside className="lg:pt-16">
            <Reveal>
              <a
                href={maps}
                target="_blank"
                rel="noopener noreferrer"
                className="bp-pass-dark group block overflow-hidden"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[#04070F]">
                  <Image
                    src="/images/dest-vilnius-old.webp"
                    alt="Rooftops of Vilnius old town"
                    fill
                    sizes="(min-width: 1024px) 30vw, 92vw"
                    className="object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <span className="absolute bottom-3 left-4 flex items-center gap-2 font-mono text-[0.75rem] uppercase tracking-[0.14em] text-white">
                    <span className="h-2 w-2 rounded-full bg-[#72C43C] shadow-[0_0_10px_#72C43C]" /> Our office · VNO
                  </span>
                </div>
                <div className="p-5">
                  <address className="not-italic text-[1rem] leading-relaxed text-[var(--bp-fg)]">
                    {company.contact.streetAddress}
                    <br />
                    {company.contact.postalCode} {company.contact.city}, {company.contact.country}
                  </address>
                  <p className="mt-3 text-[0.9rem] font-semibold text-[var(--bp-strong)] underline decoration-[var(--color-runway)] underline-offset-4">
                    Open in Google Maps
                  </p>
                </div>
              </a>
            </Reveal>
          </aside>
        </div>
      </Band>

      <Band id="after" labelledBy="after-title">
        <SectionHead
          id="after-title"
          eyebrow="What happens next"
          title={
            <>
              You press send. <span className="bp-outline">Here&apos;s the rest.</span>
            </>
          }
        />
        <ol className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {AFTER.map((a, i) => (
            <li key={a.t}>
              <Reveal delay={i * 0.08} className="h-full">
                <article className="bp-pass-dark h-full p-6">
                  <span className="bp-mono text-[var(--color-runway)]">Step {String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-3 font-[family-name:var(--font-grotesk)] text-[1.25rem] font-semibold text-[var(--bp-strong)]">{a.t}</h3>
                  <p className="bp-body mt-2 text-[0.95rem]">{a.b}</p>
                </article>
              </Reveal>
            </li>
          ))}
        </ol>
      </Band>

      <Band id="faqs" labelledBy="cfaq-title">
        <SectionHead
          id="cfaq-title"
          eyebrow="Before you ask"
          title={
            <>
              The questions <span className="bp-outline">everyone asks first.</span>
            </>
          }
        />
        <Faq items={studyFaqs.slice(0, 4)} />
        <p className="mt-8 max-w-4xl text-[0.85rem] leading-relaxed text-[var(--bp-faint)]">
          SnZ Ventures is an advisory firm and does not guarantee admission, employment, banking, licensing or
          immigration outcomes. Regulated activities are delivered by licensed partner firms. Information you submit
          is handled in line with our{" "}
          <a href="/legal/privacy-policy" className="underline underline-offset-2">
            Privacy Policy
          </a>
          .
        </p>
      </Band>
    </BpPage>
  );
}
