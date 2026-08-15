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
  portal/admin/        staff console: users, cases, documents, advisors, audit
  api/auth/            register, login, logout, verify-email, forgot/reset-password
  api/admin/users/     role and status administration (super-admin gated)
  api/portal/          profile, documents (upload + authorised download)
  api/enquiry/         public enquiry intake → info@snzventures.com
components/
  brand/ cards/ forms/ layout/ sections/ ui/ visuals/ portal/
data/                  ALL content and company facts
lib/
  auth/                password, session, guard (RBAC), rate-limit, constants
  db/                  client, migrations/, repos/ (users, portal, audit)
  storage.ts           S3 SigV4 / Vercel Blob + signed URLs
  mail.ts              provider-agnostic email
scripts/               migrate, verify-schema, bootstrap-admin, audit
middleware.ts          early redirect for /portal and the auth screens
```

**Content is separated from presentation.** Copy, services, destinations,
articles and company facts live in `data/`. To change wording, edit `data/`.

## Design system

Editorial and typographic. Chaptered structure, hairline rules, coordinate
marginalia, full-bleed duotone plates, and a scroll-tracked meridian rail on
the homepage.

**Type** — a single family, **Plus Jakarta Sans**. Weight, tracking and scale
carry the hierarchy; there is no decorative display face. Headings are Title
Case; body copy and FAQ questions stay sentence case.

**Heroes cycle.** `components/sections/HeroSlideshow.tsx` crossfades up to four
frames with a Ken Burns drift and scroll parallax. The cap is enforced in the
component, only the first frame is `priority`, and `prefers-reduced-motion`
stops the cycle entirely and shows one static image. Frames live in
`data/pillars.ts → hero.images`; the homepage keeps its own copy because that
hero already owns a cursor lean and nesting a second parallax would compound
the transforms.

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

**Avoid alpha on text colours.** `text-accent/60` on a numeral measured 1.2:1
on navy; the same class in light mode measured 2.3:1. If a label needs to
recede, use `text-faint`, which is a designed step in every tone rather than a
transparency that lands wherever the background happens to be.

**Geography visuals are not interchangeable.** The arced connection animation
(`RouteField`) belongs to the home hero and nowhere else — repeated in every
map section it stopped reading as a signature. Other sections use
`<CorridorMap variant="pins" />`, which keeps the same accurate projection but
drops the arcs for located, pulsing markers. `activeSlug` lets a selection
drive the map, which is what gives the homepage atlas its own identity.

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

Backed by **PostgreSQL**. Registration, login, logout, email verification,
password reset, cases, documents, tasks, appointments, messaging,
notifications, audit logging and the full staff/admin console all run against
real tables. Nothing is seeded and nothing is simulated: an empty database
renders designed empty states.

To take it live, follow [`DEPLOYMENT.md`](./DEPLOYMENT.md).

**Roles** — `student`, `professional`, `business` (clients, chosen at
registration) plus `advisor`, `admin` and `super_admin` (assigned by a super
admin; there is no self-service route to a staff role, and the first one is
created by CLI).

**Security**
- scrypt password hashing (N=2^16, r=8, p=1) via `node:crypto`
- HMAC-SHA256 signed session cookies, httpOnly + SameSite=Lax + Secure in prod
- Authorisation is expressed **in SQL** — client reads carry `client_id = $viewer`,
  advisor reads join `staff_assignments`, so unauthorised rows are never fetched
- Role is read from the signed session and re-checked against the database each
  request, so suspending an account takes effect immediately
- Five layered defences against privilege escalation in `app/api/admin/users/route.ts`
- Documents live in private object storage; downloads go through
  `/api/portal/documents/[id]`, which authorises then mints a ~2-minute signed
  URL. The storage key never reaches the browser.
- Audit logs strip sensitive keys, with a regex denylist as a backstop
- Rate limiting on login, registration and password reset
- Middleware is an Edge-runtime UX redirect only, never the security boundary

**Deploy safety** — the build succeeds and the public site serves with *no*
portal credentials at all. Enabling the portal can never take the marketing
site down; unconfigured features return 503 with a human explanation rather
than falling back to a predictable key.

## Scripts

```bash
npm run db:verify       # apply migrations to in-memory Postgres + test queries
npm run db:status       # show pending migrations without applying them
npm run db:migrate      # apply migrations (transactional, checksummed)
npm run db:bootstrap -- --email you@example.com --name "Your Name"
npm run audit           # 19 routes x 5 viewports (site must be running)
npm run audit:study     # Study Abroad anchors, sticky offsets, scroll spy
npm run audit:theme     # WCAG AA contrast in BOTH themes, toggle, persistence
npm run audit:links     # every internal, external and mailto:/tel: link resolves
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

`audit:study` covers what the general audit structurally cannot: in-page anchor
landing positions, sticky-offset arithmetic and scroll-spy correctness. Those
are invisible in a screenshot, and two real bugs shipped past the main audit
before this existed — see the header comment in `scripts/audit-study.mjs`.

`audit:theme` measures computed foreground against the first genuinely opaque
ancestor background, for every heading, paragraph, list item, link and button,
in both themes. It ignores type set over photography, where the image rather
than the CSS background is the real ground.

## Theming

Dark is the designed default. Light is opt-in via the header switch, stored in
`localStorage` and applied by a blocking inline script in `app/layout.tsx` —
setting it from an effect would paint dark first and repaint on hydration.

The four tone classes in `app/globals.css` *are* the dark theme; the light
theme redefines their tokens under `[data-theme="light"]`. Two rules matter
when adding sections:

- **Never hard-code an accent colour.** Use `text-accent` (and the `/50`–`/80`
  variants). `text-moss-400` is correct on navy and 2.1:1 on near-white; 41
  call sites had to be converted once this theme existed.
- **Type over a photograph belongs on `.plate-deep`.** That class pins the dark
  tone in light mode. The photograph does not get lighter when the theme does,
  so the type on it must not either.

## Google reviews

`components/sections/Reviews.tsx` renders the real Google reviews when
`GOOGLE_PLACES_API_KEY` and `GOOGLE_PLACE_ID` are set, and the honest
placeholder otherwise. It never synthesises a review. The key is server-side
only — `lib/reviews.ts` imports `server-only`, so an accidental client import
is a build error rather than a leaked billable credential. The upstream call is
cached for 24 hours.

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
