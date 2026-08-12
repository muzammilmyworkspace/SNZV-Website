# SnZ Ventures

International advisory platform and client portal for students, professionals
and founders moving into Europe. Next.js 16 (App Router), TypeScript,
Tailwind v4, Motion.

> **Before launch, read [`CONTENT-HANDOFF.md`](./CONTENT-HANDOFF.md).**
> It lists every unconfirmed fact and every remaining blocker.

## Getting started

```bash
npm install
cp .env.example .env.local     # then set AUTH_SECRET to enable the portal
npm run dev                    # http://localhost:3000
npm run build
npm start
```

Generate an `AUTH_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Without it the portal refuses to authenticate anyone and the auth screens say
so plainly, rather than falling back to a predictable signing key.

## Structure

```
app/
  (public)             home, pillars, services, destinations, insights, legal
  login|register|forgot-password|reset-password
  portal/              authenticated client workspace (noindex, role-gated)
  api/auth/            register, login, logout, forgot-password, reset-password
  api/portal/profile/  progressive profile save
  api/enquiry/         public enquiry intake → info@snzventures.com
components/
  brand/ cards/ forms/ layout/ sections/ ui/ visuals/ portal/
data/                  ALL content and company facts
lib/
  auth/                password, session, store, rate-limit, types, constants
  portal/              portal data access (the DB seam)
  mail.ts              provider-agnostic email
middleware.ts          early redirect for /portal and the auth screens
```

**Content is separated from presentation.** Copy, services, destinations,
articles and company facts live in `data/`. To change wording, edit `data/`.

## Design system

Editorial and typographic. Chaptered structure, hairline rules, coordinate
marginalia, full-bleed duotone plates, and a scroll-tracked meridian rail on
the homepage.

**Type** — a single family, **Plus Jakarta Sans**. Weight, tracking and scale
carry the hierarchy; there is no decorative display face.

**Surfaces are semantic.** A section sets one of four tone classes and every
descendant reads `--fg` / `--fg-muted` / `--line` / `--surface` from it, so the
same component renders correctly on deep navy or on white:

| Tone | Surface | Used for |
|------|---------|----------|
| `tone-deep` | `#0A1730` | Page ground, hero, atlas |
| `tone-soft` | `#102142` | Alternating bands, video, why |
| `tone-light` | `#EEF2F7` | Method, insights, FAQs |
| `tone-white` | `#FFFFFF` | Long-form reading — articles, legal |

Use `text-fg`, `text-muted`, `text-faint`, `text-accent`, `border-line`,
`bg-surface`, `bg-raised`. **Never hard-code `text-white` or `border-white/12`**
— it will break the moment the section changes tone.

Palette is derived from the logo (navy `#1E2D56`, green `#7ABF40`), deepened
into an atmospheric range. Accent is `moss-400` `#72C43C`.

### Three subtleties worth knowing before editing

1. **`.plate` deliberately does not set `position`.** The rule is emitted after
   Tailwind's utilities, so `position: relative` there would beat `absolute` on
   stacked plates and collapse them to zero height.

2. **`MaskedLines` observes the heading, not each line.** Lines start
   translated 104% outside their own `overflow-hidden` wrapper, and
   IntersectionObserver intersects with ancestor clip rects — a per-line
   observer reports zero intersection forever and never fires.

3. **Cookie constants live in `lib/auth/constants.ts`.** The Edge middleware
   cannot import `lib/auth/session.ts` because that pulls in `node:crypto`.

## Client portal

Registration, login, logout, password reset, protected routes, role-based
access and progressive profile saving all work today.

**Roles** — `student`, `professional`, `business` (client, chosen at
registration) plus `advisor` and `admin` (assigned manually; there is no
self-service route to staff privileges).

**Security**
- scrypt password hashing (N=2^16, r=8, p=1) via `node:crypto`
- HMAC-SHA256 signed session cookies, httpOnly + SameSite=Lax + Secure in prod
- Server-side authorisation in `app/portal/layout.tsx`; middleware is only an
  early UX redirect, never the security boundary
- Rate limiting on login, registration and password reset
- Profile writes accept only whitelisted keys for the caller's own role

**Not production-ready:** user storage is a JSON file adapter, and case /
document / message data returns empty. Both are behind interfaces —
`lib/auth/store.ts` and `lib/portal/data.ts`. See `CONTENT-HANDOFF.md § 2b`.

## Scripts

```bash
npm run audit           # 19 routes x 5 viewports (site must be running)
npm run typecheck
npm run build:images    # re-fetch + re-verify image licences
npm run build:hero      # cinematic plates
npm run build:brand     # favicons and header mark
npm run build:map       # corridor dot map
```

The audit checks console errors, failed requests, broken images, horizontal
overflow, missing alt text, heading order, unnamed controls, stuck reveal
animations and SEO metadata, writing screenshots to `audit-shots/`.

> It scrolls with `behavior: "instant"` and a 220 ms dwell per 0.4 viewport.
> `scroll-behavior: smooth` would otherwise make it measure mid-flight, and
> IntersectionObserver only fires on painted frames — both produce false
> "unrevealed" findings.

## Content integrity

No company fact was invented. Unverifiable statistics are marked
`verified: false` in `data/company.ts` and withheld from render automatically.
Testimonials are an empty array by design — the section renders an honest
placeholder rather than fabricated quotes. Videos are `null` in `data/media.ts`
and render marked placeholders. Portal collections are empty rather than seeded
with a plausible-looking case file. Destination availability is conservative:
"Ask us" means not confirmed.

## Accessibility

Semantic landmarks, skip link, visible focus states, focus trapping in the
mobile nav, CTA drawer, portal menu and pathway popup, `aria-expanded` /
`aria-controls` on disclosures, labelled fields with `aria-invalid` and error
associations, keyboard-operable testimonial carousel, and full
`prefers-reduced-motion` support.
