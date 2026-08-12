import type { Metadata } from "next";
import { Container, Section, JsonLd, Eyebrow, Caveat } from "@/components/ui/Primitives";
import { Breadcrumbs } from "@/components/sections/PageParts";
import { JourneyForm } from "@/components/forms/JourneyForm";
import { ContactLinks } from "@/components/layout/ContactLinks";
import { Reveal } from "@/components/ui/Reveal";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contact — Start Your Journey",
  description:
    "Tell us roughly where you want to end up and we'll tell you what the route looks like. Three short steps, no obligation. Vilnius, Lithuania.",
  path: "/contact",
});

const expectations = [
  {
    title: "A real person reads it",
    body: "Not an autoresponder sequence. Someone who can actually assess your case.",
  },
  {
    title: "You'll get an honest read",
    body: "Including when we think the route is weak, or when you don't need us at all.",
  },
  {
    title: "No obligation, no hard sell",
    body: "You'll get an answer and the option to take it further. Nothing is committed by asking.",
  },
];

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />

      <section className="grain relative overflow-hidden bg-surface pb-16 pt-36 text-fg md:pb-20 md:pt-44">
        <div aria-hidden className="graticule mask-radial absolute inset-0 opacity-55" />
        <div
          aria-hidden
          className="bloom-moss pointer-events-none absolute -bottom-40 left-1/4 h-[420px] w-[420px] opacity-30"
        />

        <Container className="relative">
          <Breadcrumbs
            items={[
              { name: "Home", path: "/" },
              { name: "Contact", path: "/contact" },
            ]}
          />

          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
            {/* Left: context */}
            <div>
              <Eyebrow tone="dark" className="mb-4">
                Start your journey
              </Eyebrow>
              <h1 className="d-1 text-fg">
                Tell us where you want to end up.
              </h1>
              <p className="lede mt-5 max-w-lg text-muted">
                You don&rsquo;t need a plan. You need to know whether the one
                you&rsquo;re considering is realistic — and what it would
                actually involve. That&rsquo;s what this form starts.
              </p>

              <ul className="mt-9 space-y-5 border-t border-line pt-7">
                {expectations.map((e) => (
                  <li key={e.title} className="flex items-start gap-3.5">
                    <span
                      aria-hidden
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-moss-400"
                    />
                    <span>
                      <span className="block text-[0.95rem] font-semibold tracking-[-0.01em] text-fg">
                        {e.title}
                      </span>
                      <span className="mt-0.5 block text-[0.86rem] leading-relaxed text-muted">
                        {e.body}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-9 border-t border-line pt-7">
                <Eyebrow tone="dark" className="mb-3">
                  Prefer to reach us directly
                </Eyebrow>
                {/* ContactLinks already renders the city/country. */}
                <ContactLinks location="contact_page" />
              </div>
            </div>

            {/* Right: the form */}
            <Reveal>
              <div
                id="journey"
                className="scroll-mt-28 border border-line bg-raised p-6 text-fg shadow-[0_30px_70px_-40px_rgba(0,0,0,0.6)] md:p-8"
              >
                <JourneyForm />
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <Section tone="light" size="tight">
        <Container size="narrow">
          <Caveat>
            SnZ Ventures is an advisory firm and does not guarantee admission,
            employment, banking, licensing or immigration outcomes. Regulated
            activities are delivered by licensed partner firms. Information you
            submit is handled in line with our{" "}
            <a
              href="/legal/privacy-policy"
              className="font-medium underline underline-offset-2"
            >
              Privacy Policy
            </a>
            .
          </Caveat>
        </Container>
      </Section>
    </>
  );
}
