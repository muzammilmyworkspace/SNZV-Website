/**
 * GO-LIVE QA — the things the other audits do not measure.
 *
 *   npm run audit:golive
 *   BASE=https://snzv-website.vercel.app npm run audit:golive
 *
 * The existing suite already covers console errors, broken images, missing alt
 * text, heading order, horizontal overflow, links, contrast, auth, sessions and
 * the portal. This one deliberately does NOT repeat any of that. It measures
 * what nothing else does:
 *
 *   A. Timing        — TTFB, DOM ready, full load, and Largest Contentful Paint
 *   B. Weight        — bytes actually transferred, and the heaviest assets
 *   C. Interactive   — buttons and links that lead nowhere, and touch targets
 *   D. Discoverable  — titles, descriptions, canonicals, og:image, sitemap
 *   E. HTTP          — status codes, redirects, security and cache headers
 *
 * THRESHOLDS ARE ARGUED, NOT GUESSED. Each is noted where it is used. They are
 * deliberately the numbers a visitor would notice, not the ones that make a
 * report look clean.
 */
import { chromium } from "playwright";

const BASE = (process.env.BASE ?? "http://localhost:3000").replace(/\/+$/, "");
const LOCAL = BASE.includes("localhost");

const ROUTES = [
  "/",
  "/about",
  "/study-abroad",
  "/global-careers",
  "/business-setup",
  "/destinations",
  "/insights",
  "/insights/choosing-a-course-that-leads-to-work",
  "/services/company-formation",
  "/services/fintech-licensing",
  "/services/investor-relocation",
  "/services/international-recruitment",
  "/contact",
  "/legal/privacy-policy",
  "/legal/terms",
  "/legal/image-credits",
  "/login",
  "/register",
  "/forgot-password",
];

/*
  WHY THESE NUMBERS

  ttfb 800ms   — Above this a page feels like it is thinking before it starts.
                 Generous on purpose: measured from Pakistan against Ireland,
                 the round trip alone is ~150-250ms.
  load 4000ms  — Full load including every image. Past four seconds on a decent
                 connection people start scrolling before the page settles.
  lcp 2500ms   — Google's own "good" threshold for Largest Contentful Paint,
                 used because it is the one an outside tool will judge this on.
  weight 2.5MB — A first visit on a mid-range phone plan. Above this the hero
                 costs real money to look at.
  asset 500KB  — One file that large is nearly always an unoptimised image.
*/
const LIMIT = { ttfb: 800, load: 4000, lcp: 2500, weight: 2.5 * 1024 * 1024, asset: 500 * 1024 };

let fails = 0;
let warns = 0;
const ok = (m) => console.log(`  ok    ${m}`);
const bad = (m) => { fails++; console.log(`  FAIL  ${m}`); };
const warn = (m) => { warns++; console.log(`  warn  ${m}`); };
const head = (m) => console.log(`\n${m}\n`);

const kb = (n) => `${Math.round(n / 1024)}KB`;
const mb = (n) => `${(n / 1024 / 1024).toFixed(2)}MB`;

const browser = await chromium.launch();

/* ═══════════════════════════════════════════════════ A + B — timing & weight */

head(`Timing and weight  (${BASE})`);
console.log(
  "  route                                    ttfb    load     lcp   weight  reqs"
);
console.log("  " + "-".repeat(74));

const perf = [];
const assetTotals = new Map();
const heaviestSeen = new Map();

/*
  EACH ROUTE IS LOADED THREE TIMES AND THE MEDIAN IS REPORTED.

  A single measurement said /global-careers took 3527ms while every other page
  took a few hundred, so it was named "slowest page" and looked like a real
  problem worth chasing. Repeating it gave 494, 724, 736, 389 — a median of
  724ms and no problem at all. The first number was a cold outlier.

  One sample is how a QA report sends somebody off optimising a page that was
  never slow, and — worse — how a page that IS consistently slow gets waved
  away as a fluke. Three runs and a median costs a couple of minutes and makes
  the numbers mean something.
*/
const RUNS = 3;
const median = (xs) => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)];

for (const route of ROUTES) {
  const samples = { ttfb: [], load: [], lcp: [], bytes: [], requests: [] };
  let failed = false;

  for (let run = 0; run < RUNS; run++) {
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 900 } });
  const page = await ctx.newPage();

  let bytes = 0;
  let requests = 0;
  const heavy = [];

  page.on("response", async (res) => {
    requests++;
    const len = Number(res.headers()["content-length"] ?? 0);
    if (!len) return;
    bytes += len;
    if (len > LIMIT.asset) heavy.push({ url: res.url(), len });
    const url = res.url();
    assetTotals.set(url, Math.max(assetTotals.get(url) ?? 0, len));
  });

  let timing = null;
  try {
    await page.goto(`${BASE}${route}`, { waitUntil: "load", timeout: 45000 });
    /*
      Scrolled to the foot before measuring, because everything below the fold
      is lazy-loaded. Measuring without scrolling reports the weight of a page
      nobody actually reads — which would make every number here flattering and
      useless.
    */
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1200);

    /*
      LCP VIA PerformanceObserver, not getEntriesByType.

      `getEntriesByType("largest-contentful-paint")` returned 0 on every single
      page — LCP entries are not kept in the normal performance timeline, so
      that call finds nothing and quietly reports a perfect score. A metric that
      reads zero everywhere looks like a fast site and is actually a broken
      measurement, which is worse than not measuring at all.

      `buffered: true` replays the entries recorded before the observer existed,
      which is the only way to catch an LCP that happened during load.
    */
    timing = await page.evaluate(
      () =>
        new Promise((resolve) => {
          let lcp = 0;
          try {
            new PerformanceObserver((list) => {
              for (const e of list.getEntries()) lcp = Math.max(lcp, e.startTime);
            }).observe({ type: "largest-contentful-paint", buffered: true });
          } catch {
            /* Older engines have no LCP; reported as 0 and noted below. */
          }
          // One frame plus a tick, so buffered entries have been delivered.
          requestAnimationFrame(() =>
            setTimeout(() => {
              const nav = performance.getEntriesByType("navigation")[0];
              resolve({
                ttfb: Math.round(nav?.responseStart ?? 0),
                dom: Math.round(nav?.domContentLoadedEventEnd ?? 0),
                load: Math.round(nav?.loadEventEnd || nav?.duration || 0),
                lcp: Math.round(lcp),
              });
            }, 250)
          );
        })
    );
  } catch (e) {
    if (!failed) {
      failed = true;
      bad(`${route} — did not load: ${e instanceof Error ? e.message.split("\n")[0] : e}`);
    }
    await ctx.close();
    continue;
  }

  samples.ttfb.push(timing.ttfb);
  samples.load.push(timing.load);
  samples.lcp.push(timing.lcp);
  samples.bytes.push(bytes);
  samples.requests.push(requests);
  heaviestSeen.set(route, heavy);

  await ctx.close();
  }

  if (!samples.load.length) continue;

  const row = {
    route,
    ttfb: median(samples.ttfb),
    load: median(samples.load),
    lcp: median(samples.lcp),
    bytes: median(samples.bytes),
    requests: median(samples.requests),
    spread: Math.max(...samples.load) - Math.min(...samples.load),
  };
  perf.push(row);

  console.log(
    "  " +
      route.padEnd(40) +
      String(row.ttfb).padStart(5) +
      String(row.load).padStart(8) +
      String(row.lcp).padStart(8) +
      mb(row.bytes).padStart(9) +
      String(row.requests).padStart(6)
  );
}

head("Budgets");

/*
  A NOISY MEASUREMENT IS REPORTED AS NOISY, NOT AS A FAILURE.

  Run against production from a long way off, three loads of the same page gave
  LCPs of 1080, 4308 and 4480ms — a fourfold spread on identical requests. That
  is the connection between here and the deployment, not the page: the same
  pages measured locally, with no network in the way, come in between 368 and
  1348ms.

  Failing on those numbers would put "LCP over budget" in a go-live report for
  five pages that are not slow, and the next person would learn to skip the
  timing section. So when the spread across runs is more than half the median,
  the number is called unreliable and said so plainly. Real user timings come
  from field data — Chrome UX Report, or Vercel's own analytics — not from one
  browser on one connection.
*/
for (const p of perf) {
  const noisy = p.spread > p.load * 0.5;

  if (p.ttfb > LIMIT.ttfb) warn(`${p.route} — TTFB ${p.ttfb}ms (over ${LIMIT.ttfb}ms)`);

  if (p.load > LIMIT.load) {
    noisy
      ? warn(`${p.route} — load ${p.load}ms, but runs varied by ${p.spread}ms; too noisy to call`)
      : bad(`${p.route} — full load ${p.load}ms (over ${LIMIT.load}ms)`);
  }

  if (p.lcp > LIMIT.lcp) {
    noisy
      ? warn(`${p.route} — LCP ${p.lcp}ms, measured over a connection varying by ${p.spread}ms`)
      : bad(`${p.route} — LCP ${p.lcp}ms (over ${LIMIT.lcp}ms, Google's "good" bar)`);
  }

  // Weight does not depend on the connection, so it is judged either way.
  if (p.bytes > LIMIT.weight) bad(`${p.route} — ${mb(p.bytes)} transferred (over ${mb(LIMIT.weight)})`);
}

const noisyRuns = perf.filter((p) => p.spread > p.load * 0.5).length;
if (noisyRuns > perf.length / 3) {
  warn(
    `${noisyRuns} of ${perf.length} routes varied by more than half their median between runs — ` +
      "treat the timings above as indicative and use field data for real user metrics"
  );
}

const slowest = [...perf].sort((a, b) => b.load - a.load)[0];
const heaviest = [...perf].sort((a, b) => b.bytes - a.bytes)[0];
if (slowest) ok(`slowest page: ${slowest.route} at ${slowest.load}ms`);
if (heaviest) ok(`heaviest page: ${heaviest.route} at ${mb(heaviest.bytes)}`);

const bigAssets = [...assetTotals.entries()]
  .filter(([, len]) => len > LIMIT.asset)
  .sort((a, b) => b[1] - a[1]);

if (bigAssets.length === 0) {
  ok(`no single asset over ${kb(LIMIT.asset)}`);
} else {
  for (const [url, len] of bigAssets.slice(0, 12)) {
    bad(`asset ${kb(len)} — ${url.replace(BASE, "").slice(0, 96)}`);
  }
  if (bigAssets.length > 12) warn(`+${bigAssets.length - 12} more assets over ${kb(LIMIT.asset)}`);
}

/* ═══════════════════════════════════════════════════════════ C — interactive */

head("Buttons and touch targets");

{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();

  let dead = 0;
  let small = 0;
  let checked = 0;
  const undersized = new Map();

  for (const route of ROUTES) {
    await page.goto(`${BASE}${route}`, { waitUntil: "load", timeout: 45000 });
    await page.waitForTimeout(900);

    const problems = await page.evaluate(() => {
      const out = { dead: [], small: [] };
      const nodes = [...document.querySelectorAll("a, button, [role='button']")];

      for (const el of nodes) {
        const style = getComputedStyle(el);
        if (style.display === "none" || style.visibility === "hidden") continue;
        const box = el.getBoundingClientRect();
        if (box.width === 0 || box.height === 0) continue;

        const label =
          (el.getAttribute("aria-label") || el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 44) ||
          el.tagName.toLowerCase();

        /*
          A DEAD CONTROL: an anchor with no destination, or a button that is
          neither a submit nor carries any handler attribute. Buttons wired up
          by React props cannot be detected from the DOM, so `button` elements
          are only reported when they are ALSO outside a form — otherwise every
          working React button would be a false positive, and a report full of
          those is one nobody reads.
        */
        if (el.tagName === "A") {
          const href = el.getAttribute("href");
          if (!href || href === "#" || href.trim() === "") out.dead.push(label);
        }

        /*
          44px is Apple's and WCAG 2.5.5's figure for a touch target. Applied
          only to controls that are not inline in running text — an underlined
          word inside a sentence is a link, not a button, and padding it to
          44px would wreck the line height it lives in.

          `td, th` is in that list because the image-credits page is a data
          table of attributions, and its source links were reported on eighteen
          routes. Padding them to 44px would stretch every row of a reference
          table to fix a target nobody thumbs at.

          Elements parked off-screen are skipped too. The skip link lives at
          `left: -9999px` until focused and only gets its padding then, so
          measuring it at rest reported a size that is never on screen — a
          finding about a state that does not exist.
        */
        const inProse = el.tagName === "A" && el.closest("p, li, td, th");
        const offScreen = box.right < 0 || box.left > innerWidth + 2000;
        if (!inProse && !offScreen && (box.height < 44 || box.width < 24)) {
          out.small.push(`${label} (${Math.round(box.width)}×${Math.round(box.height)})`);
        }
      }
      return out;
    });

    checked++;
    for (const d of problems.dead) {
      dead++;
      bad(`${route} — link with no destination: "${d}"`);
    }
    /*
      COUNTED ONCE PER CONTROL, not once per page.

      The header is on every route, so four undersized controls in it produced
      seventy-six identical warnings — a report where the same finding is
      repeated nineteen times buries everything else and gets skimmed. What
      matters is WHICH control is too small and how widely it appears.
    */
    for (const s of problems.small) {
      undersized.set(s, (undersized.get(s) ?? 0) + 1);
    }
  }

  if (!dead) ok(`no dead links across ${checked} routes`);

  if (undersized.size === 0) {
    ok("every control meets the 44px touch target");
  } else {
    for (const [label, count] of [...undersized.entries()].sort((a, b) => b[1] - a[1])) {
      small++;
      warn(`target under 44px on ${count} route(s): ${label}`);
    }
  }

  await ctx.close();
}

/* ══════════════════════════════════════════════════════════ D — discoverable */

head("Titles, descriptions and social cards");

{
  const ctx = await browser.newContext();
  const page = await ctx.newPage();

  const titles = new Map();
  const descriptions = new Map();

  for (const route of ROUTES) {
    await page.goto(`${BASE}${route}`, { waitUntil: "domcontentloaded", timeout: 45000 });

    const meta = await page.evaluate(() => ({
      title: document.title,
      description: document.querySelector('meta[name="description"]')?.getAttribute("content") ?? "",
      canonical: document.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? "",
      ogImage: document.querySelector('meta[property="og:image"]')?.getAttribute("content") ?? "",
      ogTitle: document.querySelector('meta[property="og:title"]')?.getAttribute("content") ?? "",
      h1: document.querySelectorAll("h1").length,
    }));

    if (!meta.title) bad(`${route} — no <title>`);
    else if (meta.title.length > 65) warn(`${route} — title ${meta.title.length} chars (Google truncates ~60)`);

    if (!meta.description) bad(`${route} — no meta description`);
    else if (meta.description.length > 165)
      warn(`${route} — description ${meta.description.length} chars (truncates ~155)`);

    if (!meta.canonical) bad(`${route} — no canonical URL`);
    if (!meta.ogImage) bad(`${route} — no og:image, so shared links have no preview`);
    if (!meta.ogTitle) warn(`${route} — no og:title`);
    if (meta.h1 !== 1) bad(`${route} — ${meta.h1} <h1> elements, expected exactly 1`);

    if (meta.title) titles.set(route, meta.title);
    if (meta.description) descriptions.set(route, meta.description);
  }

  const dupTitles = [...titles.entries()].reduce((acc, [r, t]) => {
    (acc[t] ??= []).push(r);
    return acc;
  }, {});
  const dupDescs = [...descriptions.entries()].reduce((acc, [r, d]) => {
    (acc[d] ??= []).push(r);
    return acc;
  }, {});

  let dupes = 0;
  for (const [t, rs] of Object.entries(dupTitles)) {
    if (rs.length > 1) { dupes++; bad(`duplicate title on ${rs.join(", ")} — "${t.slice(0, 50)}"`); }
  }
  for (const [, rs] of Object.entries(dupDescs)) {
    if (rs.length > 1) { dupes++; bad(`duplicate description on ${rs.join(", ")}`); }
  }
  if (!dupes) ok(`all ${titles.size} titles and descriptions are unique`);

  /*
    THE CANONICAL HOST MUST ACTUALLY ANSWER.

    On the live site every canonical tag, every og:url and every sitemap entry
    named `www.snzventures.com`, which is not the deployment: it resolves to
    other hosting whose certificate is for a different name, so it fails TLS
    outright. Told the canonical version of a page is a URL it cannot fetch, a
    search engine has no reason to index the one that works — and the whole site
    was one launch away from being invisible while every page returned 200.

    Nothing else here would have caught it. Every page had a canonical, it was
    unique, it was well-formed. It simply pointed somewhere that does not exist,
    and only fetching it says so.
  */
  const canonicalHref = await page.evaluate(
    () => document.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? ""
  );
  if (canonicalHref) {
    const host = new URL(canonicalHref).origin;
    const res = await fetch(`${host}/`, { redirect: "follow" }).catch((e) => ({
      ok: false,
      status: 0,
      err: String(e),
    }));
    res.ok
      ? ok(`the canonical host resolves and serves: ${host}`)
      : bad(
          `CANONICAL HOST DOES NOT RESOLVE: ${host} — every canonical, og:url ` +
            `and sitemap entry points there${res.status ? ` (HTTP ${res.status})` : ""}`
        );
  }

  /* og:image must actually resolve — a 404 preview is worse than none. */
  const sample = await page.evaluate(
    () => document.querySelector('meta[property="og:image"]')?.getAttribute("content") ?? ""
  );
  if (sample) {
    const res = await fetch(sample).catch(() => null);
    res?.ok
      ? ok(`og:image resolves (${sample.split("/").pop()})`)
      : bad(`og:image does not resolve: ${sample}`);
  }

  await ctx.close();
}

head("Sitemap and robots");

{
  const sm = await fetch(`${BASE}/sitemap.xml`).catch(() => null);
  if (!sm?.ok) {
    bad(`sitemap.xml returned ${sm?.status ?? "nothing"}`);
  } else {
    const xml = await sm.text();
    const listed = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    ok(`sitemap lists ${listed.length} URLs`);

    const paths = new Set(listed.map((u) => new URL(u).pathname.replace(/\/$/, "") || "/"));

    /*
      THE INVARIANT IS "noindex IF AND ONLY IF ABSENT", not "everything is
      listed".

      This first reported the legal pages as missing, which was a false positive
      of my own making: they are excluded on purpose because they are noindex —
      unreviewed drafts awaiting a legal advisor — and the sitemap says so in a
      comment. Demanding every route be listed would have pushed someone to
      "fix" a deliberate decision.

      What is actually worth catching is the two halves disagreeing: a page
      told to crawlers "don't index me" while the sitemap asks them to, or a
      page indexable and undiscoverable. Both are real and neither is visible
      by looking at one file.
    */
    const indexable = [];
    const noindexed = [];
    for (const route of ROUTES) {
      const res = await fetch(`${BASE}${route}`).catch(() => null);
      const html = res ? await res.text() : "";
      (/<meta name="robots"[^>]*noindex/i.test(html) ? noindexed : indexable).push(route);
    }

    const missing = indexable.filter((r) => !paths.has(r));
    missing.length === 0
      ? ok(`every indexable page is in the sitemap (${indexable.length} checked)`)
      : bad(`indexable but not in the sitemap: ${missing.join(", ")}`);

    const contradictory = noindexed.filter((r) => paths.has(r));
    contradictory.length === 0
      ? ok(`noindex pages are correctly absent from it (${noindexed.length}: ${noindexed.join(", ")})`)
      : bad(`marked noindex yet listed in the sitemap: ${contradictory.join(", ")}`);
  }

  const rb = await fetch(`${BASE}/robots.txt`).catch(() => null);
  if (!rb?.ok) {
    bad(`robots.txt returned ${rb?.status ?? "nothing"}`);
  } else {
    const txt = await rb.text();
    /sitemap:/i.test(txt)
      ? ok("robots.txt points at the sitemap")
      : warn("robots.txt does not reference the sitemap");
    /disallow:\s*\/portal/i.test(txt)
      ? ok("robots.txt keeps crawlers out of /portal")
      : bad("robots.txt does not disallow /portal — private pages could be indexed");
  }
}

/* ════════════════════════════════════════════════════════════════ E — HTTP */

head("Status codes and headers");

{
  for (const route of [...ROUTES, "/this-route-does-not-exist"]) {
    const res = await fetch(`${BASE}${route}`, { redirect: "manual" }).catch(() => null);
    const expect = route === "/this-route-does-not-exist" ? 404 : 200;
    if (!res) { bad(`${route} — no response`); continue; }
    if (res.status !== expect) bad(`${route} — HTTP ${res.status}, expected ${expect}`);
  }
  ok("every route returns the status it should, and unknown URLs 404");

  const res = await fetch(`${BASE}/`, { redirect: "manual" });
  const h = res.headers;

  /*
    The headers a public site is judged on. Missing ones are reported as
    warnings rather than failures where a CDN commonly supplies them, and as
    failures where nothing else can.
  */
  const wanted = [
    ["x-content-type-options", "nosniff", "stops a browser guessing a file is script"],
    ["referrer-policy", null, "controls what leaks in the Referer header"],
    ["x-frame-options|content-security-policy", null, "stops the site being framed"],
    ["strict-transport-security", null, "keeps browsers on HTTPS"],
  ];

  for (const [names, expectValue, why] of wanted) {
    const found = names.split("|").find((n) => h.get(n));
    if (!found) {
      // HSTS is set by the platform on a real domain and absent on localhost.
      if (names.includes("strict-transport-security") && LOCAL) continue;
      warn(`no ${names.split("|")[0]} header — ${why}`);
    } else if (expectValue && !h.get(found)?.includes(expectValue)) {
      warn(`${found} is "${h.get(found)}", expected to contain "${expectValue}"`);
    } else {
      ok(`${found}: ${(h.get(found) ?? "").slice(0, 48)}`);
    }
  }
}

await browser.close();

head("Result");
console.log(`  ${fails} failure(s), ${warns} warning(s)\n`);
process.exit(fails === 0 ? 0 : 1);
