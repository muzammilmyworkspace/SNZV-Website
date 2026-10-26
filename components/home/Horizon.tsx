import Image from "next/image";
import Link from "next/link";
import { pathways } from "@/data/pathways";
import { partners } from "@/data/partners";
import { studyDestinations, studyJourney } from "@/data/study";
import { homeStats } from "@/data/stats";
import { trustPoints, company } from "@/data/company";
import { articles } from "@/data/insights";
import { Reveal } from "@/components/ui/Reveal";
import { Rail } from "./Rail";
import { CtaLink, WhatsAppLink, PhoneLink, EmailLink } from "./Tracked";
import { Arrow, Check, Globe, Shield, Handshake, Message, Route } from "./Icons";
import { HzCollage, CountUp } from "./HzCollage";
import { Stamp } from "@/components/fx/Stamp";
import { FlagArt } from "@/components/cards/FlagArt";

const BOOK = "/contact#journey";

/* ------------------------------------------------------------------ hero */
export function HzHero() {
  return (
    <section className="hz-hero" aria-labelledby="hz-title">
      <div className="hz-wrap relative grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <div>
          <Reveal>
            <span className="hz-eyebrow">Study · Work · Build in Europe</span>
          </Reveal>
          <Reveal delay={0.06}>
            <h1 id="hz-title" className="hz-display mt-6">
              Your ambition
              <br />
              has <span className="hz-serif">no</span>{" "}
              <span className="hz-underline">
                borders.
                <svg viewBox="0 0 200 20" preserveAspectRatio="none" aria-hidden>
                  <path d="M3 14C40 5 120 3 197 9" stroke="currentColor" strokeWidth="5" strokeLinecap="round" fill="none" />
                </svg>
              </span>
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="hz-lead mt-7 max-w-[34rem]">
              SnZ Ventures takes students, professionals and founders into Europe, from Vilnius. One named advisor
              plans the course, the job or the company with you, and stays with you until you arrive.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="mt-9 flex flex-wrap gap-3">
              <CtaLink href={BOOK} label="Book a free consultation" location="home_hero" className="hz-btn hz-btn-primary">
                Book a free consultation <Arrow />
              </CtaLink>
              <WhatsAppLink location="home_hero" className="hz-btn hz-btn-ghost" />
            </div>
          </Reveal>
          <Reveal delay={0.24}>
            <div className="hz-trustline">
              {company.attributes.map((a) => (
                <span key={a}>
                  <Check size={16} /> {a}
                </span>
              ))}
            </div>
          </Reveal>
        </div>

        <HzCollage euStates={homeStats[0].value} studyCountries={studyDestinations.length} />
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- marquee */
export function HzMarquee() {
  const items = studyDestinations.map((d) => ({ city: d.city, country: d.country }));
  const row = [...items, ...items];
  const words = ["Study", "Work", "Build", "Relocate", "Belong"];
  const row2 = [...words, ...words, ...words, ...words];
  return (
    <div className="hz-marquee" aria-hidden>
      <div className="hz-marquee-track">
        {row.map((d, i) => (
          <span className="hz-marquee-item" key={i}>
            <i /> {d.city} <small>{d.country}</small>
          </span>
        ))}
      </div>
      <div className="hz-marquee-track hz-marquee-rev">
        {row2.map((w, i) => (
          <span className="hz-marquee-word" key={i}>
            {w} <em className="hz-serif">in Europe</em> <i />
          </span>
        ))}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- paths */
const PATH_TAGS = { study: "For students", careers: "For professionals", business: "For founders" } as const;

export function HzPaths() {
  return (
    <section className="hz-section" aria-labelledby="hz-paths">
      <div className="hz-wrap">
        <div className="hz-head">
          <Reveal>
            <span className="hz-eyebrow">Three ways in</span>
            <h2 id="hz-paths" className="hz-display hz-h2 mt-5">
              Pick the road that <span className="hz-serif">fits</span> your plan.
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="hz-lead">
              A degree, a job or a company. They look different from the outside, but each starts with the same honest
              question: what is really available to you, and what does it take?
            </p>
          </Reveal>
        </div>
        <div className="hz-paths">
          {pathways.map((p, i) => (
            <Reveal key={p.key} delay={i * 0.08} className="h-full">
              <article className="hz-path h-full">
                <div className="hz-path-img" data-fx="unveil" style={{ ["--fx-delay" as string]: `${i * 0.12}s` }}>
                  <Image src={p.image} alt={p.imageAlt} fill sizes="(min-width:900px) 33vw, 100vw" />
                  <span className="hz-path-tag">{PATH_TAGS[p.key]}</span>
                </div>
                <div className="hz-path-body">
                  <h3>{p.title}</h3>
                  <p>{p.hook}</p>
                  <ul>
                    {p.bullets.map((b) => (
                      <li key={b}>
                        <Check /> {b}
                      </li>
                    ))}
                  </ul>
                  <Link href={p.href} className="hz-path-link">
                    {p.cta} <Arrow />
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- partners */
export function HzPartners() {
  return (
    <section className="hz-section pt-0" aria-labelledby="hz-partners">
      <div className="hz-wrap">
        <div className="hz-head">
          <Reveal>
            <span className="hz-eyebrow">University partners</span>
            <h2 id="hz-partners" className="hz-display hz-h2 mt-5">
              Institutions we work <span className="hz-serif">with</span>.
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="hz-lead">
              Signed agreements, not a list scraped from a website. Each one is shown here only after it exists.
            </p>
          </Reveal>
        </div>
        <div className="hz-partners">
          {partners.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.06} className="h-full">
              <article className="hz-partner h-full">
                <div className="hz-partner-img">
                  <Image src={p.poster} alt={p.posterAlt} width={600} height={750} sizes="(min-width:1024px) 25vw, (min-width:700px) 50vw, 100vw" />
                </div>
                <div className="hz-partner-body">
                  <small>
                    {p.city} · {p.country}
                  </small>
                  <h3>{p.name}</h3>
                  <p>{p.blurb}</p>
                </div>
              </article>
            </Reveal>
          ))}
          <Reveal delay={0.18} className="h-full">
            <div className="hz-partner-more h-full">
              <div>
                <span className="hz-eyebrow">In progress</span>
                <h3 className="mt-4">More partnerships on the way.</h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed">
                  Each one is added here once it is signed, never before.
                </p>
              </div>
              <div className="hz-flags">
                {["Germany", "Austria", "Cyprus", "Australia", "Azerbaijan", "Türkiye"].map((c) => (
                  <span key={c}>{c}</span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
        <p className="hz-note">
          A partnership means SnZ Ventures works directly with the institution on admissions and student support.
          Admission decisions remain entirely the institution&rsquo;s, and visa decisions remain with the relevant authority.
        </p>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- journey */
export function HzJourney() {
  return (
    <section className="hz-band hz-section" aria-labelledby="hz-journey">
      <div className="hz-wrap relative">
        <div className="hz-head">
          <Reveal>
            <span className="hz-eyebrow">How it works</span>
            <h2 id="hz-journey" className="hz-display hz-h2 mt-5">
              From first call to <span className="hz-serif">first day</span>.
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="hz-lead">
              Five clear stages, the same advisor all the way through, and every step tracked in your own SnZ portal.
            </p>
          </Reveal>
        </div>
        <span aria-hidden className="hz-steps-line" data-fx="grow" />
        <ol className="hz-steps">
          {studyJourney.map((s, i) => (
            <Reveal key={s.step} as="li" delay={i * 0.07} className="hz-step">
              <span className="hz-step-n">{s.step}</span>
              <h3>{s.name}</h3>
              <p>{s.body}</p>
            </Reveal>
          ))}
        </ol>
        <Reveal delay={0.2}>
          <div className="mt-10 flex flex-wrap gap-3">
            <CtaLink href={BOOK} label="Start with a free call" location="home_journey" className="hz-btn hz-btn-green">
              Start with a free call <Arrow />
            </CtaLink>
            <Link href="/study-abroad" className="hz-btn hz-btn-ghost !text-white ![box-shadow:inset_0_0_0_1.5px_rgb(255_255_255/0.3)]">
              See the study pathway
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- routes */
const ROUTES = [
  {
    tag: "Balkans & Cyprus",
    title: "Closer to home, still in Europe.",
    body: "Universities across the Balkans and in Cyprus teach in English and look at a wider range of profiles.",
    countries: ["Albania", "Bosnia & Herzegovina", "Montenegro", "Serbia", "Cyprus"],
  },
  {
    tag: "Non-Schengen",
    title: "Routes outside the Schengen area.",
    body: "Countries with their own entry rules, which can suit a profile that the Schengen route does not.",
    countries: ["Serbia", "Albania", "Georgia", "Türkiye"],
  },
];

/**
 * Where the university partners used to sit (removed on the owner's
 * request, 2026-10-26): the routes for students whose grades are under 50%
 * or who hold a diploma rather than a degree. No outcome is promised; the
 * section says these routes exist and that we check the fit first.
 */
export function HzRoutes() {
  return (
    <section className="hz-section pt-0" aria-labelledby="hz-routes">
      <div className="hz-wrap">
        <div className="hz-head">
          <Reveal>
            <span className="hz-eyebrow">More routes</span>
            <h2 id="hz-routes" className="hz-display hz-h2 mt-5">
              Under 50%? A diploma? There is <span className="hz-serif">still a route</span>.
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="hz-lead">
              A lower percentage or a diploma instead of a degree does not end the conversation. These countries consider
              a wider range of profiles, and we tell you honestly which one fits yours before you apply anywhere.
            </p>
          </Reveal>
        </div>

        <div className="hz-routes">
          {ROUTES.map((r, i) => (
            <Reveal key={r.tag} delay={i * 0.1} className="h-full">
              <article className="hz-route h-full" data-fx="watch">
                <span className="hz-route-tag">{r.tag}</span>
                <h3>{r.title}</h3>
                <p>{r.body}</p>
                <ul className="hz-route-flags">
                  {r.countries.map((c, j) => (
                    <li key={c} style={{ animationDelay: `${0.15 + j * 0.08}s` }}>
                      <Globe /> {c}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}

          <Reveal delay={0.2} className="h-full">
            <article className="hz-route hz-route-who h-full">
              <span className="hz-route-tag">Who it is for</span>
              <h3>Made for profiles like these.</h3>
              <ul className="hz-route-list">
                <li><Check /> Grades under 50% in your last qualification</li>
                <li><Check /> A diploma instead of a bachelor&rsquo;s degree</li>
                <li><Check /> Refused or unsure about a Schengen route</li>
              </ul>
              <div className="mt-auto flex flex-wrap gap-3 pt-6">
                <CtaLink href={BOOK} label="Check my options" location="home_routes" className="hz-btn hz-btn-primary">
                  Check my options <Arrow />
                </CtaLink>
                <WhatsAppLink location="home_routes" className="hz-btn hz-btn-ghost" />
              </div>
            </article>
          </Reveal>
        </div>
        <p className="hz-note">
          Admission decisions are always the institution&rsquo;s and visa decisions the authority&rsquo;s. We assess your
          profile first and only suggest a route that is realistic for it.
        </p>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------- destinations */
export function HzDestinations() {
  return (
    <section className="hz-section" aria-labelledby="hz-dest">
      <div className="hz-wrap">
        <div className="hz-head">
          <Reveal>
            <span className="hz-eyebrow">Study destinations</span>
            <h2 id="hz-dest" className="hz-display hz-h2 mt-5">
              {studyDestinations.length} European <span className="hz-serif">starting points</span>.
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="hz-lead">
              Indicative yearly tuition is shown where it is published, so you can compare honestly before you commit. For the rest, ask us for current fees.
            </p>
          </Reveal>
        </div>
        <Reveal>
          <Rail label="Study destinations">
            {studyDestinations.map((d) => (
              <Link key={d.slug} href="/study-abroad" className="hz-dest">
                {d.image ? <Image src={d.image} alt={d.imageAlt} fill sizes="300px" /> : <FlagArt colours={d.flag ?? []} />}
                <span className="hz-dest-fee">{d.tuitionFrom}</span>
                <span className="hz-dest-body">
                  <small>{d.city}</small>
                  <h3>{d.country}</h3>
                  <p>{d.draw}</p>
                </span>
              </Link>
            ))}
          </Rail>
        </Reveal>
        <p className="hz-note">
          Tuition figures are indicative annual amounts published for guidance, not quotations. Actual fees depend on the
          institution, the programme and your nationality.
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- stats+why */
const WHY_ICONS = [Route, Handshake, Message, Shield];

export function HzWhy() {
  return (
    <section className="hz-section pt-0" aria-labelledby="hz-why">
      <div className="hz-wrap">
        <div className="hz-head">
          <Reveal>
            <span className="hz-eyebrow">Why SnZ Ventures</span>
            <h2 id="hz-why" className="hz-display hz-h2 mt-5">
              Your next move deserves more than <span className="hz-serif">guesswork</span>.
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="hz-lead">
              Straight answers on what fits your case, partners named upfront, and one person who knows your file.
            </p>
          </Reveal>
        </div>

        <div className="hz-bento">
          {homeStats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.06}>
              <div className={`hz-tile h-full ${i === 0 ? "hz-tile-green" : ""}`}>
                <div className="hz-tile-num">
                  <CountUp value={s.value} suffix={s.suffix} />
                </div>
                <div className="hz-tile-label">{s.label}</div>
                <p>{s.detail}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="hz-why">
          <Reveal className="hz-why-photo">
            <span aria-hidden className="hz-why-sweep" data-fx="sweep" />
            <Image src="/images/study-campus.webp" alt="Students walking across a European university campus" fill sizes="(min-width:900px) 36vw, 100vw" />
            <blockquote>
              <span className="hz-serif">&ldquo;{company.missionQuote}&rdquo;</span>
            </blockquote>
          </Reveal>
          {trustPoints.map((t, i) => {
            const Icon = WHY_ICONS[i % WHY_ICONS.length];
            return (
              <Reveal key={t.title} delay={i * 0.06}>
                <div className="hz-tile hz-why-item h-full">
                  <span className="hz-chip-icon">
                    <Icon />
                  </span>
                  <h3>{t.title}</h3>
                  <p>{t.body}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- insights */
export function HzInsights() {
  const posts = [...articles].sort((a, b) => b.updated.localeCompare(a.updated)).slice(0, 3);
  return (
    <section className="hz-section pt-0" aria-labelledby="hz-insights">
      <div className="hz-wrap">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <span className="hz-eyebrow">Insights</span>
            <h2 id="hz-insights" className="hz-display hz-h2 mt-5">
              Read before you <span className="hz-serif">decide</span>.
            </h2>
          </Reveal>
          <Link href="/insights" className="hz-btn hz-btn-ghost">
            All articles <Arrow />
          </Link>
        </div>
        <div className="hz-posts">
          {posts.map((a, i) => (
            <Reveal key={a.slug} delay={i * 0.07}>
              <article className="hz-post">
                <div className="hz-post-img">
                  <Image src={a.image} alt={a.imageAlt} width={640} height={440} sizes="(min-width:900px) 33vw, 100vw" />
                </div>
                <div className="hz-post-meta">
                  <b>{a.category}</b> · <span>{a.readMinutes} min read</span>
                </div>
                <h3>
                  <Link href={`/insights/${a.slug}`}>{a.title}</Link>
                </h3>
                <p>{a.excerpt}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- final cta */
export function HzCta() {
  return (
    <section className="hz-wrap pb-24 lg:pb-32" aria-labelledby="hz-cta">
      <Reveal>
        <div className="hz-cta">
          <div aria-hidden className="hz-cta-stamp hidden md:block">
            <Stamp className="sk-float" text="Your ambition · has no borders · " />
          </div>
          <div className="relative">
            <h2 id="hz-cta" className="hz-display mx-auto max-w-[16ch]">
              Let&rsquo;s plan your move to <span className="hz-serif">Europe</span>.
            </h2>
            <p className="mx-auto mt-6 max-w-[38rem] text-[1.1rem] leading-relaxed">
              A free first conversation about your profile, your budget and where you want to be. No forms to decode,
              no fee before we know it fits.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <CtaLink href={BOOK} label="Book a free consultation" location="home_final" className="hz-btn hz-btn-primary">
                Book a free consultation <Arrow />
              </CtaLink>
              <WhatsAppLink location="home_final" className="hz-btn hz-btn-ghost" />
            </div>
            <div className="hz-cta-contacts">
              <PhoneLink location="home_final" />
              <EmailLink location="home_final" />
              <span>
                {company.contact.streetAddress}, {company.contact.postalCode} {company.contact.city}
              </span>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
