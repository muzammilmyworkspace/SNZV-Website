# SnZ Ventures — Content & Launch Handoff

Everything on this site that is **not yet confirmed**, in one place.

The guiding rule during the build: **no company fact was invented.** Where a fact
was missing, the UI was built and the gap marked rather than filled with
plausible-sounding text. This document is the list of gaps.

---

## 1. Blockers — must be resolved before launch

| # | Item | Where it surfaces | Why it blocks |
|---|------|-------------------|---------------|
| 1 | **Email transport not configured** | `.env.local` | Delivery IS implemented (`lib/mail.ts` → Resend or webhook). Set `RESEND_API_KEY` **or** `MAIL_WEBHOOK_URL` and enquiries reach info@snzventures.com. Until then the API returns 503 and the form shows direct contact details — it never fakes success. |
| 2 | **Legal pages are structural drafts** | `data/legal.ts` | Privacy Policy, Terms, Cookie Policy and Disclaimer contain `[CONFIRM]` markers where a company fact or legal determination is required. They are `noindex` and carry a visible draft banner until reviewed. |
| 3 | **Registered legal entity details unknown** | Footer, legal pages, schema | Office address is now supplied and live. Still missing: registered legal name, company code and VAT number — required for GDPR and Lithuanian business disclosure. |
| 4 | **Cookie consent not implemented** | `components/layout/AnalyticsScripts.tsx` | No analytics tag loads today, so the site is currently compliant. **The moment a GA4/Clarity/Meta ID is set, a consent solution is legally required for EU visitors.** |
| 5 | **Four headline statistics unverified** | `data/company.ts` → `stats` | See section 3. |

---

## 2. Email delivery — one variable away

Delivery is implemented in `lib/mail.ts` and wired into both the enquiry API
and password resets. Choose a transport in `.env.local`:

| Variable | Transport |
|----------|-----------|
| `RESEND_API_KEY` | Resend REST API |
| `MAIL_WEBHOOK_URL` | Any endpoint — Zapier, Make, n8n, a CRM intake, an SMTP relay |

Also set `MAIL_FROM` (a domain you control and have verified with the provider)
and optionally `MAIL_TO` (defaults to `info@snzventures.com`).

**Until one is set**, `POST /api/enquiry` returns 503 and the form shows the
direct email and WhatsApp details. It never shows a success screen for a
message nobody received.

> ⚠ The in-process rate limiter (`lib/auth/rate-limit.ts`) resets on redeploy
> and does not coordinate across replicas. Move it to Redis/Upstash or a WAF
> rule before running multiple instances.

---

## 2b. Client portal — credentials, not code

The portal now runs on **PostgreSQL**. The gap that used to sit here — JSON
file storage, empty data functions, no document transport — is closed. What
remains is provisioning, and it is covered step by step in
[`DEPLOYMENT.md`](./DEPLOYMENT.md).

**Built and verified:**

| Area | State |
|------|-------|
| **Schema** | 17 tables, 8 enums, `lib/db/migrations/001_init.sql`. Needs no Postgres extensions, so it installs on managed roles that cannot `CREATE EXTENSION`. Verified by `npm run db:verify` — 13 checks against an in-memory Postgres. |
| **Roles** | Six: `student`, `professional`, `business`, `advisor`, `admin`, `super_admin`. |
| **Cases, documents, tasks, appointments, messages, notifications** | Real tables, real queries, authorisation expressed in SQL. |
| **Document storage** | Private object storage (S3-compatible or Vercel Blob). Downloads go through `/api/portal/documents/[id]`, which authorises then mints a ~2-minute signed URL. The storage key never reaches the browser. |
| **Email verification** | Token issued on registration, delivered by the configured transport. |
| **Staff tooling** | `/portal/admin` — users and roles, cases, document review, advisor assignment, audit log. |
| **Audit log** | Every auth event, role change and document decision. Sensitive keys are stripped, with a regex denylist as a backstop. |

**Three credentials are required to switch it on**, and only an account owner
can obtain them:

| Variable | Source |
|----------|--------|
| `DATABASE_URL` | Any PostgreSQL 13+ (Neon, Supabase, Vercel Postgres, RDS) — pooled connection string |
| `AUTH_SECRET` | Generated locally, pasted into Vercel, never committed |
| Storage + email | One of `S3_*` / `BLOB_READ_WRITE_TOKEN`, and one of `RESEND_API_KEY` / `MAIL_WEBHOOK_URL` |

Until they are set the build still succeeds and the public site still serves —
the auth screens say "Portal not yet enabled" and the auth APIs return 503.
Enabling the portal cannot take the marketing site down.

**No seeded accounts.** The first super admin is created by CLI
(`npm run db:bootstrap`), the password is printed once and stored only as a
scrypt hash, and registration can only ever create client roles.

**Deliberately empty rather than seeded.** Showing a client a fabricated case
file — invented applications, documents and messages — would be far worse than
an empty state that explains exactly what will fill it.

---

## 2c. Video content

`data/media.ts` holds three entries, all with `src: null`, so each pillar page
renders a marked placeholder inside the final frame:

- `[STUDY VIDEO REQUIRED]` — /study-abroad
- `[JOBS VIDEO REQUIRED]` — /global-careers
- `[BUSINESS VIDEO REQUIRED]` — /business-setup

Set `src` and `poster` to go live. `provider: "file"` (an mp4/webm in
`/public`) is fastest and makes no third-party request. `youtube` and `vimeo`
are also supported and use the no-cookie / do-not-track hosts, loading **only
after** the visitor presses play. **Supply a WebVTT caption track** — captions
are an accessibility requirement, not an optional extra.

---

## 3. Statistics — confirm or they stay hidden

Four figures appear on the live snzventures.com but could not be independently
verified. They are marked `verified: false` in `data/company.ts` and are
**automatically withheld from render**. Only "27 EU member states" (an objective
fact about the EU, not a company claim) currently displays.

| Figure | Claim | Action |
|--------|-------|--------|
| `400+` | Entities formed | Confirm and set `verified: true`, or amend the number |
| `12` | Talent source hubs | Confirm — the site names 8 source markets, so 12 needs reconciling |
| `48h` | Registration window | Confirm this is typical rather than best-case |
| `27` | EU member states | ✅ Already live (objective fact) |

Flip `verified: true` in `data/company.ts` and the figure appears with no other
change. **Do not enable a figure that cannot be evidenced** — these are exactly
the claims a regulator or competitor would challenge.

---

## 4. Ecosystem institutions — handle with care

`data/company.ts` → `ecosystem` lists Bank of Lithuania, Invest Lithuania,
Vilnius Tech Park, Startup Lithuania, Enterprise Europe Network and the EU Blue
Card Network. These appear on the live site.

They are rendered **strictly as operating context** — under the heading
"Operating within Lithuania's business & fintech ecosystem", with an explicit
disclaimer that they are not endorsements, accreditations or partnerships.

> ⚠ Do **not** relabel this section as "Partners", "Trusted by" or
> "Accredited by" without written confirmation from each named institution.
> Implying a relationship with a national central bank that does not exist is a
> serious reputational and legal risk.

---

## 5. `[CONTENT REQUIRED]` items by page

These render as amber blocks in development and are hidden in production, so a
missed item never reaches a visitor.

### About (`app/about/page.tsx`)
- [ ] Founder / Managing Partner name and short biography
- [ ] Year the company was founded
- [ ] Team size and key roles, if these should be public
- [ ] Registered legal entity name, company code, VAT number (address now supplied)
- [x] ~~Full registered street address~~ — supplied: T. Ševčenkos g. 16, 03223 Vilnius

### Study Abroad (`data/pillars.ts` → `study`)
- [ ] **Exact scope of university application support** — does SnZ submit
      applications, or advise only? The page currently claims advisory only.
- [ ] Whether any institutional partnerships exist (none are claimed today)
- [ ] Which destination countries the study pathway actively covers
- [ ] Student testimonials with written consent, if any

### Global Careers (`data/pillars.ts` → `careers`)
- [ ] **Candidate-side fee policy in exact terms** — the FAQ currently says
      mandates come from employers and any candidate cost is stated in writing.
      Confirm this is accurate.
- [ ] Current live vacancy categories, if these should be public
- [ ] Which professions/sectors are actively recruited per country
- [ ] Placed-candidate testimonials with written consent, if any

### Business Setup (`data/pillars.ts` → `business`)
- [ ] Indicative pricing tiers, if these should be published
- [ ] Named licensed partner firms that may be disclosed publicly
- [ ] Confirm business setup is Lithuania-only (as currently stated)
- [ ] Client case studies with written consent, if any

---

## 5b. Social profiles — all live

`data/company.ts → social` drives the footer icon rail. An entry with a URL
renders as a link; an entry left `null` renders dimmed and non-interactive, so
a network the firm is not on never shows as a dead link.

| Network | State |
|---------|-------|
| Instagram | ✅ live |
| Facebook | ✅ live |
| LinkedIn | ✅ live |
| TikTok | ✅ live |
| YouTube | ✅ live |
| WhatsApp | ✅ live — derived from the published number, no profile URL needed |

All six were confirmed to resolve to a genuine SnZ Ventures profile **in a real
browser**, not with `curl`: Facebook answers plain HTTP clients with a 400 as
bot defence, which looks like a broken link and is not one. `npm run
audit:links` re-runs that check against every internal, external and
`mailto:`/`tel:` link on the site.

X/Twitter is not included — no profile was supplied, and none was assumed.

---

## 6. Testimonials

`data/company.ts` → `testimonials` is an **empty array**, deliberately. No
testimonials are published anywhere, and fabricating them was not an option.

Each entry needs: quote, name, role, pathway (`study` | `careers` | `business`),
and **written consent to publish**. Populate the array and the section switches
to a testimonial slider automatically — no code change.

### What the section shows today

The Trust section (`#proof` on the homepage, and on every pathway page) has
three states, and picks the first one available:

1. **Google reviews** — real ones, pulled from the Places API, shown verbatim
   with author, star rating and date. Requires `GOOGLE_PLACES_API_KEY`; see
   section 6b.
2. **Written testimonials** — the array above, once populated.
3. **The Google panel** — a finished card pointing at the public listing.

State 3 is what renders now. It is a designed panel, not a placeholder: it
carries the Google mark, explains that reviews are published by the reviewer
and cannot be edited by SnZ, and links straight to the listing.

---

## 6b. Google reviews — one credential away

The reviews section is built and wired. It needs **one** value:

```
GOOGLE_PLACES_API_KEY=...    # Places API (New), restricted to that API
```

`GOOGLE_PLACE_ID` is optional — without it the listing is resolved by business
name and office address using the same key.

**Why the share link alone is not enough.** `share.google/MNo5ThKseoiGnDEnF`
cannot be read programmatically: a server-side fetch returns a JavaScript
shell, and a real headless browser is served Google's `/sorry/` CAPTCHA. The
link is a human-facing redirect, not an API. It resolves to the Knowledge Graph
entry `/g/11yqs4kxm4` for **SnZ Ventures**, which confirms the listing but
does not expose the reviews.

So the link is used for what it is good for — sending visitors to the listing,
which works today with no credentials — and the review *content* comes from the
official API, which is also the only version that keeps itself up to date.

---

## 7. Destination service availability

`data/destinations.ts` encodes availability per country, deliberately
conservatively:

- `core` — flagship verified service (**Lithuania only**)
- `available` — verified on the live site (recruitment, 7 countries)
- `enquire` — **not confirmed**; renders as "Ask us"

Only Lithuania is a full-stack market. The other seven are named on the live
site as *recruitment destinations only*, so their Study and Business columns are
`enquire`.

> ⚠ Do not upgrade any country to `available` or `core` without written
> confirmation. Implying you can form companies in Spain when you cannot is a
> mis-selling risk.

---

## 8. Analytics — ready, not enabled

No third-party script loads until an environment variable is set. Copy
`.env.example` to `.env.local` and fill in only what you use:

```
NEXT_PUBLIC_GTM_ID          Google Tag Manager (preferred umbrella)
NEXT_PUBLIC_GA4_ID          GA4 standalone
NEXT_PUBLIC_CLARITY_ID      Microsoft Clarity
NEXT_PUBLIC_META_PIXEL_ID   Meta Pixel
NEXT_PUBLIC_GADS_ID         Google Ads
NEXT_PUBLIC_SITE_URL        Canonical origin (defaults to https://www.snzventures.com)
```

Events already instrumented (`lib/analytics.ts`): `page_view`, `cta_click`,
`pathway_select`, `service_view`, `destination_view`, `article_view`,
`form_start`, `form_step_completed`, `form_submit`, `generate_lead`,
`consultation_request`, `whatsapp_click`, `phone_click`, `email_click`,
`faq_open`, `file_download`, `outbound_click`.

**Privacy:** `sanitise()` strips PII-shaped keys and values before anything is
sent. Analytics record the *pathway and step*, never the answers, name, email or
phone. Do not bypass `lib/analytics.ts` by calling `gtag`/`fbq` directly.

Still to do: **Google Search Console** and **Bing Webmaster Tools** verification
(add the meta tag to `app/layout.tsx` metadata, or verify by DNS).

---

## 9. Imagery

All 18 photographs are stored locally as WebP in `public/images/` — nothing
depends on a remote host at runtime.

- **9 city photographs** — Wikimedia Commons (CC BY-SA 3.0/4.0, CC BY 2.0/2.5/3.0, CC0)
- **9 atmosphere / cinematic plates** — Unsplash Licence
- **Corridor map** — derived from a public-domain equirectangular world map

Photography is rendered through a duotone treatment (`.plate`), graded into
the brand's navy range rather than shown raw. Hero-scale plates use
`.plate-deep`, which darkens further so display type holds contrast over a
bright subject. **If you swap a hero image for a light one, check the lede and
secondary button contrast** — that is the failure mode this grade exists to
prevent.

CC BY / BY-SA licences **require attribution**, which is satisfied by
`/legal/image-credits`, linked from the global footer. **Do not remove that
page or the footer link.**

Re-run `node scripts/fetch-images.mjs` to refresh; it re-verifies licences and
rewrites `data/image-manifest.json`.

> Recommended: replace the Unsplash atmosphere shots with authentic photography
> of SnZ's own work when available. The city photography can stay.

---

## 10. What was deliberately *not* claimed

For transparency, the following were avoided because nothing supported them:

- Any number of students, placements, visas, clients or years in business
- Any success rate, approval rate or processing-time guarantee
- Any university, employer or institutional partnership
- Any award, certification or accreditation
- Any office outside Vilnius
- Any testimonial or case study
- Any guarantee of a job, visa, bank account, licence or admission

The site instead leans on **qualitative trust points** (`data/company.ts` →
`trustPoints`) that are checkable in a first conversation, and on an unusually
candid regulatory disclosure — which is a genuine differentiator in this sector.

---

## 11. Pre-launch checklist

**Configuration**
- [ ] Set `RESEND_API_KEY` **or** `MAIL_WEBHOOK_URL`, plus `MAIL_FROM`, then
      send a real test enquiry end-to-end and confirm it lands at
      info@snzventures.com
- [ ] Set `AUTH_SECRET` (32+ chars) — without it the portal refuses to
      authenticate anyone
- [ ] Set `NEXT_PUBLIC_SITE_URL` to the production origin

**Portal infrastructure** (before any real client registers) — see `DEPLOYMENT.md`
- [ ] Provision PostgreSQL 13+ and set `DATABASE_URL` (pooled connection string)
- [ ] Run `npm run db:migrate` against it
- [ ] Create the first super admin with `npm run db:bootstrap`, then change the
      generated password at first sign-in
- [ ] Configure private document storage (`S3_*` preferred, or Vercel Blob)
- [ ] Walk the live verification steps in `DEPLOYMENT.md § 8`
- [ ] Move rate limiting to a shared store if running more than one instance

**Content**
- [ ] Supply the three pathway videos with WebVTT caption tracks
- [ ] Supply testimonials with written consent, or leave the honest placeholder
- [ ] Confirm or remove the four unverified statistics
- [ ] Replace or confirm each `[CONTENT REQUIRED]` item in section 5
- [ ] Add social profile URLs to `data/company.ts` → `social` (only LinkedIn known)

**Legal**
- [ ] Legal review of all four legal documents; remove `noIndex` from
      `app/legal/[slug]/page.tsx` and the `disallow` entries in `app/robots.ts`
- [ ] Add registered entity name, company code and VAT number to
      `data/company.ts` → `legal`
- [ ] Implement cookie consent **before** enabling any analytics ID
- [ ] Review portal privacy wording — it now stores identity and case data

**Verification**
- [ ] Verify Google Search Console + Bing Webmaster Tools; submit `/sitemap.xml`
- [ ] Confirm the WhatsApp number (`+370 603 05146`) is monitored
- [ ] Confirm the office address is correct: T. Ševčenkos g. 16, 03223 Vilnius
