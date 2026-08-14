/**
 * Site audit: every route × key breakpoints.
 * Reports console errors, page errors, failed requests, broken images,
 * horizontal overflow, missing alt text, heading order and metadata gaps.
 */
import { chromium } from "playwright";
import fs from "node:fs/promises";

const BASE = process.env.BASE ?? "http://localhost:3000";
const SHOTS = "audit-shots";

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
  "/legal/image-credits",
  "/login",
  "/register",
  "/forgot-password",
  "/this-route-does-not-exist",
];

const VIEWPORTS = [
  { name: "mobile-360", width: 360, height: 780 },
  { name: "mobile-390", width: 390, height: 844 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "laptop-1280", width: 1280, height: 800 },
  { name: "desktop-1920", width: 1920, height: 1080 },
];

const findings = [];
const record = (route, viewport, type, detail) =>
  findings.push({ route, viewport, type, detail });

await fs.mkdir(SHOTS, { recursive: true });

const browser = await chromium.launch();

for (const vp of VIEWPORTS) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 1,
  });

  for (const route of ROUTES) {
    const page = await context.newPage();

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        record(route, vp.name, "console", msg.text().slice(0, 220));
      }
    });
    page.on("pageerror", (err) =>
      record(route, vp.name, "pageerror", String(err).slice(0, 220))
    );
    page.on("requestfailed", (req) => {
      const url = req.url();
      if (url.startsWith("data:")) return;
      record(
        route,
        vp.name,
        "requestfailed",
        `${req.failure()?.errorText ?? "?"} ${url.slice(0, 140)}`
      );
    });
    page.on("response", (res) => {
      if (res.status() >= 400 && !route.includes("does-not-exist")) {
        record(route, vp.name, "http", `${res.status()} ${res.url().slice(0, 140)}`);
      }
    });

    /**
     * Wait for `load`, not `networkidle`.
     *
     * `networkidle` needs 500ms with no in-flight requests, and Next.js
     * prefetches every <Link> that enters the viewport. On a wide viewport the
     * whole header and footer are visible at once, so prefetches trickle in
     * long enough that idle may never arrive — the run then fails on a page
     * that is perfectly healthy. None of the checks below depend on idle
     * anyway: the scroll-and-dwell pass that follows gives lazy content far
     * more time to arrive than idle ever would.
     */
    try {
      await page.goto(`${BASE}${route}`, { waitUntil: "load", timeout: 45000 });
    } catch (e) {
      record(route, vp.name, "navigation", String(e).slice(0, 160));
      await page.close();
      continue;
    }

    // NOTE: html has scroll-behavior:smooth, so scrollTo ANIMATES. Every hop
    // must pass behavior:"instant" or the harness measures the page mid-flight
    // and reports scroll-driven opacity (the hero fade) as a stuck reveal.
    // Scroll the whole page so every whileInView reveal fires, then return to
    // the top. IntersectionObserver only fires on painted frames, so each step
    // waits for two rAFs — scrolling faster than this makes headless Chromium
    // skip reveals and every section screenshots as empty.
    // 220ms per half-viewport is the point at which headless Chromium reliably
    // paints a frame and IntersectionObserver fires. Below ~150ms reveals are
    // missed by the harness even though they fire fine at human scroll speed.
    const dwell = 220;
    await page.evaluate(async (dwellMs) => {
      const frame = () =>
        new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      const step = window.innerHeight * 0.4;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo({ top: y, behavior: 'instant' });
        await frame();
        await new Promise((r) => setTimeout(r, dwellMs));
      }
      // Content in the last screenful only gets a single dwell before the jump
      // back to the top, which is not always enough for IO to fire. Settle at
      // the bottom first.
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' });
      await frame();
      await new Promise((r) => setTimeout(r, 700));

      window.scrollTo({ top: 0, behavior: 'instant' });
      await frame();
      await new Promise((r) => setTimeout(r, 300));
    }, dwell);
    await page.waitForTimeout(600);

    // Anything still transparent after a full pass means a reveal never fired.
    const unrevealed = await page.evaluate(
      () =>
        [...document.querySelectorAll("article, section, li, div")].filter((el) => {
            // [data-stack] layers are intentionally hidden cross-fade members.
            if (el.closest("[data-stack]")) return false;
            const cs = getComputedStyle(el);
            return cs.opacity === "0" && el.getBoundingClientRect().height > 40;
          }).length
    );
    if (unrevealed > 0) {
      record(route, vp.name, "unrevealed", `${unrevealed} element(s) stuck at opacity 0`);
    }

    // Horizontal overflow — the page body must never scroll sideways
    const overflow = await page.evaluate(() => {
      const de = document.documentElement;
      return {
        scrollW: de.scrollWidth,
        clientW: de.clientWidth,
        culprits: [...document.querySelectorAll("*")]
          .filter((el) => {
            const r = el.getBoundingClientRect();
            return r.right > de.clientWidth + 2 && r.width > 24;
          })
          .slice(0, 4)
          .map(
            (el) =>
              `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 60)}`
          ),
      };
    });
    if (overflow.scrollW > overflow.clientW + 2) {
      record(
        route,
        vp.name,
        "overflow",
        `${overflow.scrollW}>${overflow.clientW} :: ${overflow.culprits.join(" | ")}`
      );
    }

    // Accessibility + SEO spot checks (once per route, at laptop width)
    if (vp.name === "laptop-1280") {
      const a11y = await page.evaluate(() => {
        const imgs = [...document.querySelectorAll("img")];
        const brokenImgs = imgs
          .filter((i) => i.complete && i.naturalWidth === 0)
          .map((i) => i.currentSrc || i.src);
        const noAlt = imgs
          .filter((i) => !i.hasAttribute("alt"))
          .map((i) => (i.currentSrc || i.src).slice(-60));

        const h1s = [...document.querySelectorAll("h1")].map((h) =>
          h.textContent?.trim().slice(0, 60)
        );

        const headings = [...document.querySelectorAll("h1,h2,h3,h4")].map((h) =>
          Number(h.tagName[1])
        );
        const jumps = [];
        for (let i = 1; i < headings.length; i++) {
          if (headings[i] - headings[i - 1] > 1) {
            jumps.push(`h${headings[i - 1]}→h${headings[i]}`);
          }
        }

        const buttonsNoName = [
          ...document.querySelectorAll("button, a"),
        ].filter(
          (el) =>
            !el.textContent?.trim() &&
            !el.getAttribute("aria-label") &&
            !el.querySelector("img[alt]:not([alt=''])")
        ).length;

        return {
          brokenImgs,
          noAlt,
          h1Count: h1s.length,
          h1: h1s[0],
          jumps,
          buttonsNoName,
          title: document.title,
          desc: document
            .querySelector('meta[name="description"]')
            ?.getAttribute("content"),
          canonical: document
            .querySelector('link[rel="canonical"]')
            ?.getAttribute("href"),
          og: document
            .querySelector('meta[property="og:image"]')
            ?.getAttribute("content"),
          jsonLd: document.querySelectorAll('script[type="application/ld+json"]')
            .length,
          contentRequired: document.querySelectorAll("[data-content-required]")
            .length,
        };
      });

      if (a11y.brokenImgs.length)
        record(route, "meta", "broken-image", a11y.brokenImgs.join(", "));
      if (a11y.noAlt.length)
        record(route, "meta", "missing-alt", a11y.noAlt.join(", "));
      if (a11y.h1Count !== 1)
        record(route, "meta", "h1-count", `${a11y.h1Count} h1 elements`);
      if (a11y.jumps.length)
        record(route, "meta", "heading-order", a11y.jumps.join(", "));
      if (a11y.buttonsNoName)
        record(
          route,
          "meta",
          "unnamed-control",
          `${a11y.buttonsNoName} controls without accessible name`
        );
      if (!a11y.title) record(route, "meta", "seo", "missing <title>");
      if (!a11y.desc) record(route, "meta", "seo", "missing description");
      if (!a11y.canonical && !route.includes("does-not-exist"))
        record(route, "meta", "seo", "missing canonical");
      if (!a11y.og && !route.includes("does-not-exist"))
        record(route, "meta", "seo", "missing og:image");
      if (a11y.contentRequired)
        record(
          route,
          "meta",
          "content-required",
          `${a11y.contentRequired} placeholder block(s)`
        );
    }

    const slug = route === "/" ? "home" : route.replace(/\//g, "_").slice(1);
    // Full-page capture of a long route (/study-abroad runs to several
    // viewports) can exceed Playwright's 30s default and abort the whole run.
    // A slow screenshot is not a site defect, so it must not fail the audit —
    // record it and carry on.
    try {
      await page.screenshot({
        path: `${SHOTS}/${vp.name}__${slug}.png`,
        fullPage: vp.name === "laptop-1280",
        timeout: 90_000,
      });
    } catch (error) {
      record(
        route,
        vp.name,
        "screenshot",
        error instanceof Error ? error.message.split("\n")[0] : String(error)
      );
    }

    await page.close();
  }

  await context.close();
}

await browser.close();

/* ------------------------------------------------------------- report --- */

const byType = findings.reduce((acc, f) => {
  (acc[f.type] ??= []).push(f);
  return acc;
}, {});

console.log(`\n=== AUDIT: ${ROUTES.length} routes × ${VIEWPORTS.length} viewports ===`);
if (!findings.length) {
  console.log("No issues found.");
} else {
  for (const [type, items] of Object.entries(byType)) {
    console.log(`\n── ${type.toUpperCase()} (${items.length})`);
    const seen = new Set();
    for (const i of items) {
      const key = `${i.route}|${i.detail}`;
      if (seen.has(key)) continue;
      seen.add(key);
      console.log(`   ${i.route} [${i.viewport}] ${i.detail}`);
    }
  }
}
await fs.writeFile("audit-report.json", JSON.stringify(findings, null, 2));
console.log(`\nscreenshots → ${SHOTS}/`);
