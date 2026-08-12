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

## 2b. Client portal — backend requirements

The portal is **functionally real**: registration, login, logout, password
reset, protected routes, role-based access and progressive profile saving all
work today. Verified by test — passwords are scrypt-hashed, tampered session
cookies are rejected, arbitrary profile fields are ignored (no role
escalation), and a client-role account is redirected away from
`/portal/admin`.

**What is NOT production-ready:**

| Area | Current state | Needed |
|------|---------------|--------|
| **User storage** | JSON file under `.data/` (gitignored) via `lib/auth/store.ts` | Replace the `UserStore` implementation with Postgres/Prisma. That interface is the only thing the app depends on. File writes are not transactional and will not survive a serverless filesystem. |
| **Cases, documents, messages, appointments, tasks, notifications** | `lib/portal/data.ts` returns empty arrays; every screen renders an honest empty state | Implement each function against real tables. No component changes needed. |
| **Document storage** | Upload disabled | Private object storage (S3/R2) with server-signed, short-lived URLs. Documents contain identity data and must never be publicly addressable. |
| **Email verification** | `emailVerified` flag exists, always false | Send a verification link on registration and gate sensitive actions on it. |
| **Messaging** | UI complete, no transport | Realtime (WebSocket/SSE) or polling, plus unread state. |
| **Staff roles** | Assigned manually on the account record | Admin tooling. There is deliberately **no self-service route to staff privileges** — registration only ever creates client roles. |

Suggested schema: `users`, `profiles`, `cases`, `documents`, `tasks`,
`conversations`, `messages`, `appointments`, `notifications`,
`opportunities`, `audit_log`.

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

## 6. Testimonials

`data/company.ts` → `testimonials` is an **empty array**, deliberately. No
testimonials are published anywhere, and fabricating them was not an option.

The Stories section renders an honest alternative ("Your story could be next")
that explains we don't publish unverified testimonials. **Populate the array and
the section switches to a testimonial grid automatically** — no code change.

Each entry needs: quote, name, role, pathway (`study` | `careers` | `business`),
and **written consent to publish**.

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

**Portal infrastructure** (before any real client registers)
- [ ] Replace the JSON user store (`lib/auth/store.ts`) with a real database
- [ ] Implement `lib/portal/data.ts` against real tables
- [ ] Connect private document storage before enabling uploads
- [ ] Enable email verification on registration
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
