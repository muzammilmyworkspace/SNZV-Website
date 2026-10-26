# SnZ Ventures — website

The public website of **SnZ Ventures** ([snzventures.com](https://snzventures.com)), a Lithuania-based advisory that helps students, professionals and founders move into Europe: study abroad, careers with European employers, and company formation and relocation.

The client portal is a separate application at `portal.snzventures.com`; this site links to it through `NEXT_PUBLIC_PORTAL_URL`.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Motion · deployed on Vercel.

> Next.js 16 has breaking changes from earlier versions. Read the guides in `node_modules/next/dist/docs/` before using an unfamiliar API (see `AGENTS.md`).

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in only what you need, see below
npm run dev                  # http://localhost:3000
```

Production build:

```bash
npm run build
npm start
```

The site builds and runs with no environment variables at all. Anything not configured degrades visibly instead of failing silently: for example the enquiry form shows the phone, email and WhatsApp details if no mail transport is set.

## Environment variables

| Variable | What it does |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL used for SEO, sitemap and Open Graph (`https://snzventures.com`) |
| `NEXT_PUBLIC_PORTAL_URL` | Where the Login button goes (`https://portal.snzventures.com`) |
| `RESEND_API_KEY`, `MAIL_FROM`, `MAIL_TO` | Sends website enquiries by email through Resend |
| `MAIL_WEBHOOK_URL`, `MAIL_WEBHOOK_SECRET` | Alternative enquiry delivery through a signed webhook |
| `DATABASE_URL` | Records enquiries in the portal database so they appear in the portal queue |
| `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_GA4_ID`, `NEXT_PUBLIC_GADS_ID`, `NEXT_PUBLIC_META_PIXEL_ID`, `NEXT_PUBLIC_CLARITY_ID` | Analytics and ad tracking (each loads only when set) |
| `GOOGLE_PLACES_API_KEY`, `GOOGLE_PLACE_ID` | Live Google reviews |

Never commit real values. `.env*` files other than `.env.example` are git-ignored.

## Project structure

```
app/
  page.tsx            homepage (Horizon design)
  horizon.css         homepage styles, scoped to .hz
  about/ study-abroad/ global-careers/ business-setup/
  destinations/ services/ insights/ contact/ legal/
  api/enquiry/        public enquiry form endpoint
components/
  home/               homepage sections (Horizon)
  layout/             header, footer, mobile nav, floating WhatsApp/CTA, popup
  sections/ cards/ forms/ ui/ visuals/   inner-page building blocks
data/                 ALL content and company facts
lib/                  analytics, mail, SEO, reviews, utilities
public/               images (WebP), brand assets, fonts
scripts/              audits and asset build scripts
docs/                 briefs, deployment and content hand-off notes
```

**Content is separate from design.** Company details, services, destinations, partners, articles and statistics live in `data/`. To change wording or contact details, edit `data/` — never hard-code them in a component. Contact details are in `data/company.ts`.

## Design

- **Homepage — "Horizon" (October 2026):** warm paper ground in light mode and a soft navy in dark mode, the brand navy `#1F2D5C` and green `#6CBF3B`, large photographs in arch shapes, Bricolage Grotesque for headings with an Instrument Serif italic accent, Plus Jakarta Sans for body text.
- **Inner pages:** the earlier MERIDIAN system in `app/globals.css` (semantic tone classes `tone-deep`, `tone-soft`, `tone-light`, `tone-white`).
- **Dark theme is the default.** The choice is stored in `localStorage` (`snz-theme`) and toggled from the header.
- Images are WebP only; AVIF is deliberately disabled in `next.config.ts` because on-demand AVIF encoding of large images was far too slow.

## Scripts

```bash
npm run dev            # development server
npm run build          # production build
npm run typecheck      # TypeScript
npm run audit          # pages x viewports: console errors, broken images, overflow, a11y basics (site must be running)
npm run audit:theme    # WCAG AA contrast in both themes
npm run audit:mobile   # phone/tablet overflow, tap targets, type size
npm run audit:links    # every internal and external link resolves
npm run audit:study    # Study Abroad anchors and scroll spy
npm run build:images   # re-fetch images and verify licences (data/image-manifest.json)
```

## Deployment

Vercel deploys the `main` branch to production automatically. Work happens on a branch, is checked locally (`npm run typecheck`, `npm run build`), then merged to `main`. See `DEPLOYMENT.md` for the Vercel set-up and domain notes.

## Contact

SnZ Ventures · Lėlių g. 6, Lėlių k., LT-33157 Molėtų r., Lithuania · +370 603 05146 · study@snzventures.com

© SnZ Ventures. All rights reserved.
