# SnZ Ventures

International advisory platform for students, professionals and founders
moving into Europe. Next.js 16 (App Router), TypeScript, Tailwind v4, Motion.

> **Before launch, read [`CONTENT-HANDOFF.md`](./CONTENT-HANDOFF.md).**
> It lists every unconfirmed fact and the blockers that must be resolved —
> most importantly that **lead delivery is not yet wired up**.

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm start          # serve the production build
```

## Structure

```
app/                 routes (App Router)
  api/enquiry/       enquiry intake endpoint  ⚠ delivery not implemented
  legal/[slug]/      legal documents (noindex drafts)
components/
  brand/             logo lockup
  cards/             editorial plates (pathway / destination / insight / service)
  forms/             JourneyForm — the 3-step conversion form
  layout/            Header, MobileNav, Footer, FloatingCTA, AnalyticsScripts
  sections/          homepage chapters + shared inner-page sections
  ui/                Editorial primitives, Accordion
  visuals/           Meridian, RouteField, CorridorMap
data/                ALL content and company facts live here
lib/                 analytics, SEO helpers, utils
scripts/             asset generation, token migration, site audit
```

**Content is separated from presentation.** Copy, services, destinations,
articles and company facts live in `data/`; components render them. To change
wording, edit `data/` — not the components.

## Design system — "MERIDIAN"

A meridian is the line that defines where you are. SnZ moves people across
them. The system is **editorial and typographic**, not card-based: chaptered
structure, hairline rules, coordinate marginalia, full-bleed duotone plates,
and one continuous meridian rail threading the homepage.

**Palette** — derived from the logo (navy `#1E2D56`, green `#7ABF40`) but
deepened into an atmospheric range. Never used as flat blocks.

| Token | Value | Role |
|-------|-------|------|
| `void` / `abyss` | `#03060D` / `#050A16` | Page grounds, alternating |
| `navy-600` / `navy-500` | `#1B3A72` / `#24509B` | Royal / professional blue |
| `moss-400` | `#72C43C` | Accent (logo green, matured) |
| `paper` | `#FBFAF8` | Warm white type |

**Type** — **Instrument Serif** carries emotion (display lines, the italic
accent word); **Inter** carries precision (navigation, labels, body, forms,
data). The serif never appears below ~1.15rem: it ships weight 400 only and
reads weak at small sizes, where `font-medium` is also a no-op.

**Geometry** — near-sharp (2–6px). Rounded corners are reserved for dots and
tags; containers are square, which is much of what separates editorial from
SaaS.

**Signature components**

- `components/visuals/Meridian.tsx` — scroll-tracked chapter rail
- `components/visuals/RouteField.tsx` — the hero's corridor overlay
- `components/visuals/CorridorMap.tsx` — the dot-matrix atlas
- `components/ui/Editorial.tsx` — Chapter, MaskedLines, Action, Magnetic

### Two subtleties worth knowing before editing

1. **`.plate` deliberately does not set `position`.** The rule is emitted
   after Tailwind's utilities, so a `position: relative` there would beat
   `absolute` on stacked plates and collapse them to zero height. Every caller
   sets its own positioning.

2. **`MaskedLines` observes the heading, not each line.** Lines start
   translated 104% outside their own `overflow-hidden` wrapper, and
   IntersectionObserver intersects with ancestor clip rects — so a per-line
   `whileInView` observer reports zero intersection forever and the reveal
   never fires.

## Scripts

```bash
node scripts/fetch-images.mjs        # re-fetch + re-verify image licences
node scripts/fetch-hero-images.mjs   # cinematic plates for the art direction
node scripts/brand-assets.mjs        # regenerate favicons and the header mark
node scripts/build-map.mjs           # regenerate the corridor dot map
node scripts/audit.mjs               # full audit: 16 routes x 5 viewports
```

`scripts/audit.mjs` needs the site running (`npm start`). It checks console
errors, failed requests, broken images, horizontal overflow, missing alt text,
heading order, unnamed controls, stuck reveal animations and SEO metadata, and
writes screenshots to `audit-shots/`.

> The audit scrolls each page with a 220 ms dwell per half-viewport.
> IntersectionObserver only fires on painted frames, so scrolling faster makes
> headless Chromium skip reveals and report false "unrevealed" findings.

## Content integrity

No company fact on this site was invented. Unverifiable statistics are marked
`verified: false` in `data/company.ts` and are withheld from render
automatically. Testimonials are an empty array by design, and the Proof
chapter renders an honest alternative rather than fabricated quotes.
Destination service availability is deliberately conservative — "Ask us" means
the service is not confirmed for that market. See `CONTENT-HANDOFF.md`.

## Accessibility

Semantic landmarks, skip link, visible focus states, focus trapping in the
mobile nav and CTA drawer, `aria-expanded`/`aria-controls` on disclosures,
labelled form fields with `aria-invalid` and error associations, and full
`prefers-reduced-motion` support (parallax, magnetic cursor, beacons and
masked reveals all stand down).
