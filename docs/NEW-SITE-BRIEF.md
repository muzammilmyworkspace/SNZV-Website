# Build brief — SnZ Ventures, new website

**How to use this.** Open a session in this repository and say:

> Read `NEW-SITE-BRIEF.md` end to end, then build it. Work on the `new-site`
> branch, on localhost only. Nothing goes to production until I say so.

Everything the build needs is below. Read all of it before writing a line —
several sections contradict the obvious approach on purpose, and the reasons
are given.

---

## 0. Ground rules

1. **Branch `new-site`. Localhost only.** `main` auto-deploys to
   snzventures.com through Vercel. Do not merge, do not push to `main`, do not
   touch the Vercel dashboard. The owner decides when this goes live.
2. **Read the Next.js docs in `node_modules/next/dist/docs/` first.** This is
   Next 16.3 with Turbopack and React 19. Patterns from memory will be wrong.
   See `AGENTS.md`.
3. **This is a redesign, not a rewrite.** The content layer, the design
   tokens, the tone system and the audit scripts are good and stay. §1 lists
   what already exists; building a second version of any of it is the main way
   this job goes wrong.
4. **No invented facts. Ever.** §6 is the hardest constraint in this brief and
   the one most likely to be broken by accident. Read it before you write a
   single number.
5. **Every gate passes before you report done:** `npm run typecheck`,
   `npm run build`, `npm run audit:theme`, `npm run audit:mobile`,
   `npm run audit:links`, `npm run audit`. These exist because this site has
   already been caught by each of them.
6. **Comment the reasoning, not the syntax.** Match the surrounding files:
   they explain *why* a decision was made, including what was tried and
   rejected. A future reader needs the trade-off, not a restatement of the
   code.

---

## 1. What already exists — build on it

### Stack
Next 16.3 App Router · React 19.2 · Tailwind v4 (CSS-first `@theme`) ·
TypeScript · `motion` v13 (`motion/react`) · `sharp` · `playwright` (dev).

**`motion` is already a dependency and already used correctly.** No new
animation library. No GSAP, no Lenis, no Locomotive — `useScroll` /
`useTransform` / `useReducedMotion` already do everything in §4, and a second
scroll system fighting the native one is how smooth-scroll sites end up with
broken anchor links and a janky back button.

### Design system — `app/globals.css` (1300 lines, read it)
- **Tokens only.** Colours live in `@theme`: `navy-950…100`, `moss-800…50`,
  `paper`, `mist-50…700`, `ink`, `void`. Eases: `--ease-out-expo`,
  `--ease-in-out-quart`, `--ease-out-quint`. Radii `--radius-xs…xl`.
- **`bg-accent` does not exist.** Nor does any class whose token is not in
  `@theme` — Tailwind emits nothing and the element silently inherits. Use
  `bg-moss-400`. If a colour is needed, add the token first.
- **Four semantic surfaces:** `.tone-deep`, `.tone-soft`, `.tone-light`,
  `.tone-white`. A section sets a tone; children read `--fg`, `--fg-muted`,
  `--line`, `--surface` from it. The same component works on navy and on white
  with no conditional props. Keep this.
- **The surface wash never animates.** Each band carries wide radial pools of
  brand hue. They are large blurred areas: animating them repaints most of the
  viewport every frame. Movement comes from content reveals, not wallpaper.
  This rule is written in the stylesheet; do not quietly reverse it.

### Content layer — `data/` (everything renders from here)
| File | Holds |
|---|---|
| `company.ts` | Single source of truth for company facts. Address, contact, `stats` (see §6) |
| `study.ts` | 10 study destinations, 7 programme families, 12 scholarships, **`studyJourney` — the 5 student stages** |
| `destinations.ts` | Destination markets and recruitment corridors |
| `pathways.ts` | The three pathways: study / careers / business. The spine of the site |
| `partners.ts` | The 3 named university partnerships + the "more coming" countries |
| `services.ts` | 4 core services |
| `stats.ts` | Counter sets — **derived figures only** |
| `insights.ts` | Articles |
| `media.ts` | Video slots. All `src: null` today → placeholder state |
| `google-reviews.ts` | Reviews |
| `image-manifest.json` | Every image with source, licence, artist, page, blur |
| `legal.ts` | Legal pages (drafts with `[CONFIRM]` markers) |
| `navigation.ts` | Header and footer navigation |

### Components worth reusing rather than replacing
- `visuals/Meridian.tsx` — the line rail that tracks chapters as you descend.
  **This is already the "line-based background" instinct; extend it.**
- `visuals/RouteField.tsx`, `visuals/CorridorMap.tsx` — existing line/route
  artwork and a built map (`scripts/build-map.mjs`, `data/map-geo.json`).
- `ui/Reveal.tsx` — scroll reveal, collapses to a plain fade under reduced
  motion. Use it instead of hand-rolling `whileInView`.
- `ui/Primitives.tsx` — `Container`, `Section`, `Chapter`, `MaskedLines`,
  `Caveat`.
- `sections/StatsBand.tsx` (counters), `sections/VideoFeature.tsx` (video with
  a real placeholder state), `sections/Testimonials.tsx`,
  `sections/ReviewMarquee.tsx`, `sections/Partners.tsx` +
  `PartnerScroller.tsx`, `forms/JourneyForm.tsx`.
- `layout/Header.tsx`, `MobileNav.tsx`, `Footer.tsx`, `ThemeToggle.tsx`.

### Pages
`/` · `/about` · `/study-abroad` · `/global-careers` · `/business-setup` ·
`/destinations` · `/insights` + `/insights/[slug]` · `/services/[slug]` ·
`/contact` · `/legal/[slug]` · `/legal/image-credits` · `/demo/*`

---

## 2. Design direction

**One sentence:** a premium, line-drawn, dark-navy editorial site where the
student's journey is drawn on screen as you scroll — closer to an architect's
drawing coming to life than to a marketing page.

**Line-based, everywhere, as the structural idea — not a texture.** The owner
asked for a background "full lines based". Do it as *drawing*, not as a tiled
pattern:

- A **persistent thin-line field**: a sparse grid or set of meridian arcs,
  one hairline weight (0.5–1px at 1×), sitting at very low opacity behind
  content. One `position: fixed` SVG for the whole page, not one per section.
- **Lines that are paths with meaning.** Flight routes, the journey spine, the
  connections between countries. They *draw themselves* as the section enters —
  `strokeDasharray` + `strokeDashoffset` driven by scroll progress. This is the
  signature of the whole site and it is cheap: stroke animation on an SVG path
  is GPU-friendly and does not reflow.
- **Nodes on the lines.** Each journey stage is a point on a drawn path. The
  path connects them; the dot fills as the stage becomes current.
- Hairlines must survive dark **and** light theme — define them as a token
  (`--line` already exists per tone), never a hardcoded rgba.

**Type.** Plus Jakarta Sans is already loaded as both `--font-sans` and
`--font-display`. Hierarchy comes from weight, size and tracking, not from a
decorative second face. The existing `d-1`/`d-2` display scale and `.label`
eyebrow are established — keep them.

**Restraint is what makes it look expensive.** Award-winning sites are not
busier; they are more confident. One idea per screen, generous whitespace, a
single accent (`moss-400`) used sparingly. If a section has three animations,
two of them are probably noise.

---

## 3. Home page, in order

Each item below is a section. Build them as `components/sections/*.tsx` and
compose in `app/page.tsx`, as it is composed today.

### 3.1 Header — with a Login button
Keep the existing six nav items. Add, right-aligned:
- **`Portal Login`** → `https://portal.snzventures.com` — visually the primary
  action: filled `bg-moss-400` with `text-void` (that token exists precisely
  because `text-void` was in use with nothing behind it and button labels were
  silently inheriting white-on-green at 1.9:1 contrast).
- `Contact` stays as a nav item — it is the conversion path.
- It must be reachable on mobile: in `MobileNav`, pinned, not buried at the
  bottom of a scroll.
- Fire `analytics.portalLogin` — the event already exists in `lib/analytics.ts`.
- `rel="noopener"`; it is a different origin.

### 3.2 Hero
Keep `HeroMeridian`'s structure. The line field initialises here — the
meridian draws in on load, then the hero copy masks up (`MaskedLines`). One
clear promise, one primary CTA, one secondary. No carousel.

### 3.3 Countries + HD flags — immediately after the hero
**Which ten.** `data/study.ts → studyDestinations` already names exactly ten,
and they are the ten SnZ actually works in: **Lithuania, Poland, Hungary,
Latvia, Germany, Malta, Spain, Italy, France, Estonia.** Use those. Read them
from the data file; do not hardcode a list.

> **Do not build a "top 10 countries" ranking.** "Top" is a factual claim
> about student numbers or quality, it needs a cited source, and inventing
> the order would break §6. If the owner wants a ranked list, it needs a
> source (e.g. an OECD or Eurostat table) cited on the page. Until then the
> honest framing is *"Where our students go"* — which is true, checkable by
> scrolling, and a stronger line anyway.

**The section.** A row/grid of ten flags, each a card that reveals the
destination's existing data on hover and focus: capital, language of
instruction, tuition band, post-study work rights — all already in
`study.ts`. Flags animate in on a stagger, lines connecting them to the
meridian. Clicking goes to that destination.

**Flag assets** — see §7.1. Crisp at every size means **SVG**, not PNG.

### 3.4 Counters
Use `StatsBand` with a counter set from `data/stats.ts`.

The owner asked for **total students** and **university partnerships**.
- **University partnerships: yes** — `partners.length` is 3 and each one is
  evidenced by SnZ's own published announcement. Derive it; never hardcode 3.
- **Total students: not yet.** There is no verified figure. Add it to
  `data/company.ts → stats` with `verified: false`, which withholds it from
  render automatically, and list it in `CONTENT-HANDOFF.md` as needed from the
  client in writing. The moment they confirm it, flip the flag — no code
  change. §6 explains why this is not negotiable.
- Pad the set with derived figures that are already there and already true:
  study destinations (10), funding schemes (12), programme families (7), EU
  member states (27 — an objective fact about the EU, not a company claim).

Count up on first view only, and skip the count entirely under reduced motion
(show the final number).

### 3.5 The portal section — the centrepiece
This is where the site stops describing and starts showing. The owner's
priority is pushing students into the portal.

- **A video slot.** `media.ts` already models this: `src: null` renders
  `VideoFeature`'s clearly-marked placeholder instead of a broken player. Add
  a `portal` entry the same way. **Do not invent a URL.** When the video
  arrives: a file in `/public` is best (no third-party requests, no cookies);
  YouTube goes through `youtube-nocookie.com` and only loads after a click.
  A WebVTT caption track is required, not optional.
- **Portal screenshots** — §7.2. **No real client data, ever.** Not blurred,
  not cropped, not "it's only a name". Screenshots come from a local portal
  instance seeded with invented people.
- **What to show:** the student dashboard, the application form, document
  upload, status tracking. Frame them in a device shell that tilts slightly on
  scroll; stagger the frames; let a drawn line run from the "added to portal"
  stage of §4.1 into this section so the two connect.
- **CTA:** `Log in to your portal` + `Ask how it works` → `/contact`.

### 3.6 The student flow — §4.1
### 3.7 The business flow — §4.2

### 3.8 Partnerships
`Partners variant="home"` already does this and the artwork is in place. Keep
it. Read `data/partners.ts`'s header before touching anything in it.

### 3.9 Success stories
Real, attributed, with permission — or clearly presentational.

A named student with a named university and an outcome is a factual claim
about a real person: it needs their consent and it needs to be true. There are
none on file today. So: build the section, source it from a new
`data/success-stories.ts` where every entry carries `verified: boolean`, ship
with `verified: false` on everything, and let it render the gap the way
`media.ts` and `company.ts` already do — visibly marked, never invented. Add
it to `CONTENT-HANDOFF.md`.

### 3.10 Testimonials
`Testimonials.tsx`, `ReviewMarquee.tsx` and `data/google-reviews.ts` exist.
Reuse. Real Google reviews are the strongest asset here because they are
checkable.

### 3.11 Closing + the moving form
`JourneyForm` with the "forms move" treatment from §5.4. Then the footer.

---

## 4. The two animated flows

These are the heart of the brief. Both are **scroll-driven**: the viewer's
scroll position *is* the timeline. Nothing autoplays, nothing advances on a
timer.

### 4.1 The student journey

**Stages — already in `data/study.ts → studyJourney`. Read them from there.**

1. **Discovery Call** — the student reaches out
2. **University Shortlist**
3. **Applications & SOP** — the admission form
4. **Offer & Scholarships**
5. **Visa & Departure** — flies out

The owner described it as: *reaches out → we add them to the portal → the
admission form → visa → flies to the university.* That maps onto the five
published stages. Insert the portal as the bridge between 1 and 2 — being
added to the portal is what makes the rest of it visible to the student, and
it is the thing this site is selling.

**How it should feel.** A single continuous line is drawn across the section
as you scroll. Each stage is a node on it. The node fills, its card rises and
its copy masks in as it becomes current; the previous one dims but stays
visible, so the viewer can see the whole path, not just one step. The line
lengthens ahead of the current node — never behind — so progress is legible.

**The flight.** On the last stage the line arcs upward, and a small aeroplane
glyph travels the path from the origin corridor to the destination country,
leaving the drawn trail behind it. One plane, one arc, one time, on the
viewer's scroll. (The existing corridor data gives real origins:
`destinations.ts → corridors`, South Asia and the Middle East.)

**Build it as:** one SVG path, `pathLength` normalised to 1,
`strokeDashoffset` bound to `useScroll` progress; the plane positioned with
`offsetPath`/`offset-distance` (or `getPointAtLength` as a fallback) on the
same path, rotating to the tangent. No per-frame React state — bind motion
values directly so the component does not re-render while scrolling.

### 4.2 The business journey

The owner's sequence: *a businessman contacts us → we process → he becomes the
owner of a new business in Lithuania.*

Ground it in the real service, from `data/pathways.ts → business` and
`data/services.ts`:

1. **First conversation** — what the business actually needs
2. **UAB / MB formation** — VAT, EORI, payroll
3. **Licensing where relevant** — EMI, PI, specialised bank, crypto
4. **Banking and operations** — the gap founders underestimate
5. **Residence permit and relocation** — family included
6. **Operating across 27 member states** from one Lithuanian entity

Same drawn-line mechanic, deliberately different in character: the student
line is a **flight arc** — it leaves. The business line should **build** —
orthogonal segments assembling into a structure, ending on a company that
reaches outward across the EU. Same visual language, opposite gesture. That
contrast is what makes two long animated sections feel composed rather than
repeated.

---

## 5. Animation engineering

These are the rules that separate "award-winning" from "slow and broken".

### 5.1 Reduced motion is not a fallback, it is a requirement
Every animated component calls `useReducedMotion()` and has a defined still
state. Already done throughout — `Reveal.tsx`, `Dream.tsx`, `Closing.tsx`,
`HeroMeridian.tsx`, `Journeys.tsx`, `HeroSlideshow.tsx` — match that.

Under reduced motion: paths render **complete**, nodes render **filled**,
counters show their **final** value, the plane is **static at its
destination**. Never an empty section, never content that cannot be reached.

### 5.2 Animate `transform` and `opacity`. And stroke.
Those three are compositor-friendly. Animating `width`, `height`, `top`,
`left`, `margin`, `filter: blur` or `box-shadow` on scroll will drop frames on
the mid-range Android a student is actually browsing on.

### 5.3 Scroll binding
- One `useScroll` per section, not per element. Pass the progress down.
- Bind `MotionValue`s straight into `style` — never `useState` in a scroll
  handler. A `setState` per frame re-renders the subtree sixty times a second.
- `will-change` only on the handful of elements actually transforming, and
  removed when they are not. Blanket `will-change` eats GPU memory.
- `viewport={{ once: true }}` for reveals. Re-animating on scroll-up is the
  single most common reason a "premium" site feels cheap on the second pass.
- Never animate scroll position itself. No scroll hijacking, no smooth-scroll
  library: it breaks anchors, the back button, keyboard paging and find-in-page.

### 5.4 "Forms that move"
Honest reading: the form should feel **alive and responsive**, not that the
inputs slide around. Moving targets are a usability failure and an
accessibility one.
- Fields reveal on a stagger as the form enters.
- Focus draws a line along the field's underside — the same hairline language
  as the rest of the site.
- Step transitions on the multi-step journey form slide horizontally, with the
  progress line drawing forward.
- Validation and success states animate in place.
- An input never moves while the cursor is in it. Non-negotiable.

### 5.5 Budgets
- **LCP under 2.5s** on a throttled 4G mobile profile. The hero's largest
  element is a real measured target, not an aspiration.
- **CLS under 0.1.** Every image gets explicit dimensions; every animated
  element reserves its space. Reveals start at `opacity: 0` + `translateY`,
  which does not shift layout — keep it that way.
- **No layout thrash.** Read then write; never measure inside a scroll handler.
- `next/image` for every raster image, with the blur placeholders already in
  `image-manifest.json`.
- Flags as inline SVG or `next/image` with `priority` on the visible row only.
- Section components are `"use client"` **only** where they need to be. The
  page stays a server component; animated leaves are the clients. This is how
  it is structured today.

---

## 6. Content and claims — the hard constraint

This codebase has a rule, written at the top of `data/company.ts` and enforced
in render:

```
verified: true   → confirmed on the live snzventures.com site.
verified: false  → appears on the live site but NOT independently confirmed.
                   Withheld from render until the client signs off.
unknown          → typed as null, rendered as a visible [CONTENT REQUIRED]
                   marker. Never silently invented.
```

`data/stats.ts` explains why the counters count inventory rather than
performance: *"Counting real inventory is not a weaker proposition than an
unevidenced number — it is the one a sceptical reader can actually verify."*

**What this means for this build:**

| The ask | What ships |
|---|---|
| "Total students" counter | `verified: false` → withheld. Logged in `CONTENT-HANDOFF.md`. Flip the flag when the client confirms in writing |
| "University partnerships" counter | Ships — derived from `partners.length`, each one evidenced by SnZ's own announcement |
| "Top 10 countries" | Ships as *"Where our students go"*, read from `study.ts`. A ranking needs a cited source |
| Success stories | Section built, entries `verified: false` until consent and facts are in hand |
| Visa success rates, placement numbers | Not without written evidence. These are the claims that draw regulatory attention |
| Portal screenshots | Invented data only (§7.2) |

Reuse the existing copy. The old site's writing is good — specific, unsalesy,
and it already says the hard things ("we tell candidates when their profile
isn't competitive yet"). That honesty is the brand. Carry the words across;
change the container.

---

## 7. Assets to produce

### 7.1 Flags — HD, and legally clean
- **SVG.** A flag is flat vector art; an SVG is sharp at 24px and at 2400px
  and weighs about a kilobyte. HD is a resolution problem that vectors delete.
- **Source:** a public-domain / CC0 set, e.g. the Wikimedia Commons national
  flag SVGs (most are PD as official state insignia — **check each one**) or
  `flag-icons` (MIT). Ten files.
- **Record every one in `data/image-manifest.json`** with `source`, `licence`,
  `artist` and `page`, exactly like the existing entries. `/legal/image-credits`
  renders from that file — an asset not in the manifest is an attribution the
  site silently fails to make.
- Optimise and store in `public/flags/`. Follow `scripts/fetch-images.mjs`:
  there is already a convention for bringing images in with their provenance.
- Correct proportions (several are not 3:2). A squashed national flag is the
  kind of detail a student from that country notices immediately.

### 7.2 Portal screenshots — no real data, by construction
The portal is at `../SNZ Portal`. It ships a local Postgres and Playwright is
already a devDependency here, so this is a scripted job, not a manual one:

```bash
cd "../SNZ Portal"
npm run devdb:start                              # local Postgres, port 5433
npm run db:migrate                               # build the schema
npm run db:bootstrap -- --email demo@example.test --name "Demo Admin"
# seed invented students, then screenshot with Playwright
```

Rules:
1. **Never point this at production.** `npm run devdb:start` prints the local
   `DATABASE_URL` and it must go in `.env.development.local`, which wins over
   `.env.local`. The portal's own `scripts/lib/env.mjs` explains why that
   ordering exists: someone once ran a migration against the live database by
   following the setup instructions.
2. **Invented people only.** Obvious placeholder names, `@example.test`
   addresses, no real universities tied to real individuals.
3. A real client's name, email, passport number or document in a marketing
   screenshot is a data breach. Blurring is not a defence — crops get
   un-cropped and blurs get reversed. The data must never be in the file.
4. Script it as `scripts/portal-shots.mjs` so it is repeatable when the portal
   UI changes.
5. There is also `/demo/*` in this repo — four portal demo shells with a
   shared design system. Check whether these can be screenshotted directly;
   if so, that is cleaner still, because there is no database at all.

### 7.3 Video
`src: null` until a file exists. The placeholder state is already built and
already tells the client exactly what is needed. Do not fake it.

---

## 8. Accessibility — the part that makes it genuinely award-winning

Awards go to sites that are beautiful *and* usable. The existing codebase
already takes this seriously; hold the line.

- **Contrast.** `npm run audit:theme` measures every heading and paragraph
  against the surface it actually lands on, in both themes. It must pass. Note
  the lesson already in the stylesheet: wash alpha is capped by contrast, not
  by taste.
- **Keyboard.** Every interactive element reachable and visibly focused. The
  flag cards, the portal CTA, the carousel controls, every form step. Hover-only
  information is information that does not exist for a keyboard or touch user —
  so every hover reveal has a focus equivalent.
- **Screen readers.** Decorative SVG gets `aria-hidden`. The drawn journey is
  decorative; the stage names and copy beside it are the content and must be
  real text, not baked into artwork. (`PartnerScroller.tsx` already states this
  rule and follows it.)
- **Mobile.** `npm run audit:mobile` must pass. 44px minimum touch targets, no
  horizontal page scroll, a 16px side gutter. Carousels scroll inside their own
  container so the page never moves sideways.
- `prefers-reduced-motion` honoured everywhere (§5.1).
- Captions on every video.

---

## 9. Definition of done

- [ ] `npm run typecheck` — zero errors
- [ ] `npm run build` — succeeds
- [ ] `npm run audit:theme` — passes in both themes
- [ ] `npm run audit:mobile` — passes
- [ ] `npm run audit:links` — no broken links
- [ ] `npm run audit` — passes
- [ ] Every section reviewed at 375px, 768px, 1440px and 2560px
- [ ] Every section reviewed with `prefers-reduced-motion: reduce` on
- [ ] Tab through the whole home page: nothing unreachable, focus always visible
- [ ] Lighthouse mobile: LCP < 2.5s, CLS < 0.1
- [ ] No real client data in any asset, anywhere
- [ ] Every new image in `data/image-manifest.json` and on `/legal/image-credits`
- [ ] `CONTENT-HANDOFF.md` updated with every new gap
- [ ] Still on `new-site`. Nothing pushed to `main`

---

## 10. What to ask the owner for

These block specific pieces. Build around them, mark them, and list them —
do not fill them in.

1. **Total students placed** — the number, confirmed in writing. Unlocks the
   counter the owner asked for.
2. **The portal video** — file plus a WebVTT caption track.
3. **Success stories** — names, universities, outcomes, and written consent
   from each person.
4. **Any performance claim** to be used: visa success rate, placement numbers,
   partner-university count beyond the three announced.
5. Whether a "top destinations" *ranking* is wanted, and from which source.

Already open in `CONTENT-HANDOFF.md` and still blocking launch: email
transport, legal-page review, registered entity details (legal name, company
code, VAT), cookie consent before any analytics tag loads, and the four
unverified headline statistics.
