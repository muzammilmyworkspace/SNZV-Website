# SnZ Ventures — Content & Launch Handoff

Everything on this site that is **not yet confirmed**, in one place.

The guiding rule during the build: **no company fact was invented.** Where a fact
was missing, the UI was built and the gap marked rather than filled with
plausible-sounding text. This document is the list of gaps.

---

## 1. Blockers — must be resolved before launch

| # | Item | Where it surfaces | Why it blocks |
|---|------|-------------------|---------------|
| 1 | **Lead delivery is not wired up** | `app/api/enquiry/route.ts` | The form validates and returns success, but submissions are only logged server-side. **Real enquiries will be lost.** No mail/CRM credentials were supplied, and inventing them would silently drop leads. |
| 2 | **Legal pages are structural drafts** | `data/legal.ts` | Privacy Policy, Terms, Cookie Policy and Disclaimer contain `[CONFIRM]` markers where a company fact or legal determination is required. They are `noindex` and carry a visible draft banner until reviewed. |
| 3 | **Registered legal entity details unknown** | Footer, legal pages, schema | Registered name, company code, VAT number and full street address are not published anywhere. Required for GDPR compliance and Lithuanian business disclosure. |
| 4 | **Cookie consent not implemented** | `components/layout/AnalyticsScripts.tsx` | No analytics tag loads today, so the site is currently compliant. **The moment a GA4/Clarity/Meta ID is set, a consent solution is legally required for EU visitors.** |
| 5 | **Four headline statistics unverified** | `data/company.ts` → `stats` | See section 3. |

---

## 2. Lead delivery (blocker #1)

`deliver()` in `app/api/enquiry/route.ts` is the single function to implement.
Pick one:

- **Email** — Resend, Postmark, SendGrid or SMTP to `info@snzventures.com`
- **CRM** — HubSpot, Pipedrive or Zoho lead creation
- **Spreadsheet** — Google Sheets append via a service account

The route already handles validation, field limits, consent enforcement and
rate limiting (6 submissions / 10 min / IP). Only the delivery call is missing.

> ⚠ The in-memory rate limiter resets on redeploy and is per-instance. If the
> site is deployed to multiple instances or a serverless platform, move it to a
> shared store (Upstash/Redis) or a platform WAF rule.

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
- [ ] Registered legal entity name, company code, VAT number
- [ ] Full registered street address

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

- [ ] Implement `deliver()` and send a real test enquiry end-to-end
- [ ] Legal review of all four legal documents; remove `noIndex` from
      `app/legal/[slug]/page.tsx` and the `disallow` entries in `app/robots.ts`
- [ ] Add registered entity details to `data/company.ts` → `legal`
- [ ] Confirm or remove the four unverified statistics
- [ ] Set `NEXT_PUBLIC_SITE_URL` to the production origin
- [ ] Implement cookie consent **before** enabling any analytics ID
- [ ] Verify Google Search Console + Bing Webmaster Tools; submit `/sitemap.xml`
- [ ] Confirm the WhatsApp number (`+370 603 05146`) is monitored
- [ ] Replace or confirm each `[CONTENT REQUIRED]` item in section 5
- [ ] Add social profile URLs to `data/company.ts` → `social` (only LinkedIn known)
