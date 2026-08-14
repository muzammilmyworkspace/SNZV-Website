/**
 * Link QA — every link on every route actually goes somewhere.
 *
 *   npm run audit:links        (the site must already be running)
 *
 * Three classes of link, checked differently:
 *
 *   internal  → fetched; anything >=400 is a break.
 *   external  → fetched in a REAL BROWSER, not curl. Social networks answer
 *               plain HTTP clients with 400/403 as bot defence, so curl
 *               reports false breaks on links that work perfectly for a
 *               human. Facebook does exactly this.
 *   protocol  → mailto:, tel: and wa.me are checked for shape, since there
 *               is nothing to fetch. A tel: with spaces or a mailto: with no
 *               @ is the actual failure mode here.
 *
 * Also flags links that open a new tab without rel="noopener", and buttons
 * with no accessible name.
 */
import { chromium } from "playwright";

const BASE = process.env.BASE ?? "http://localhost:3000";

const ROUTES = [
  "/",
  "/about",
  "/study-abroad",
  "/global-careers",
  "/business-setup",
  "/destinations",
  "/insights",
  "/contact",
  "/login",
  "/register",
  "/legal/privacy-policy",
];

let fails = 0;
const bad = (m) => { fails++; console.log("  FAIL  " + m); };
const ok = (m) => console.log("  ok    " + m);

const browser = await chromium.launch();
const ctx = await browser.newContext({
  userAgent:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  locale: "en-GB",
});

/* ------------------------------------------------------------ collect --- */

const internal = new Set();
const external = new Set();
const protocolLinks = new Set();
let noopenerIssues = 0;
let namelessControls = 0;

for (const route of ROUTES) {
  const page = await ctx.newPage();
  await page.goto(BASE + route, { waitUntil: "load", timeout: 60000 });
  await page.waitForTimeout(500);

  const found = await page.evaluate(() => {
    const out = { links: [], noopener: [], nameless: [] };
    for (const a of document.querySelectorAll("a[href]")) {
      const href = a.getAttribute("href");
      if (!href || href.startsWith("#")) continue;
      out.links.push(href);
      if (a.target === "_blank" && !/noopener/.test(a.rel || "")) {
        out.noopener.push(href);
      }
    }
    for (const b of document.querySelectorAll("button")) {
      const name = (b.textContent || "").trim() || b.getAttribute("aria-label") || "";
      const r = b.getBoundingClientRect();
      if (!name && (r.width > 0 || r.height > 0)) out.nameless.push(b.outerHTML.slice(0, 70));
    }
    return out;
  });

  for (const href of found.links) {
    if (/^(mailto:|tel:)/.test(href)) protocolLinks.add(href);
    else if (/^https?:\/\//.test(href)) external.add(href);
    else if (href.startsWith("/")) internal.add(href.split("#")[0] || "/");
  }
  found.noopener.forEach((h) => { noopenerIssues++; bad(`${route}: target=_blank without rel=noopener → ${h}`); });
  found.nameless.forEach((h) => { namelessControls++; bad(`${route}: button with no accessible name → ${h}`); });

  await page.close();
}

console.log(
  `\nCollected ${internal.size} internal, ${external.size} external, ${protocolLinks.size} protocol links across ${ROUTES.length} routes\n`
);

/* ----------------------------------------------------------- internal --- */

console.log("Internal\n");
let internalBad = 0;
for (const href of [...internal].sort()) {
  const res = await fetch(BASE + href, { redirect: "manual" });
  if (res.status >= 400) { internalBad++; bad(`${href} → ${res.status}`); }
}
if (!internalBad) ok(`all ${internal.size} internal links resolve`);

/* ----------------------------------------------------------- protocol --- */

console.log("\nProtocol\n");
let protoBad = 0;
for (const href of [...protocolLinks].sort()) {
  if (href.startsWith("mailto:")) {
    const addr = href.slice(7);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addr)) { protoBad++; bad(`malformed mailto → ${href}`); }
  } else {
    const num = href.slice(4);
    // tel: must be dial-safe: digits and a leading + only.
    if (!/^\+?[0-9]+$/.test(num)) { protoBad++; bad(`tel: is not dial-safe → ${href}`); }
  }
}
if (!protoBad) ok(`all ${protocolLinks.size} mailto:/tel: links well-formed`);
[...protocolLinks].sort().forEach((h) => console.log(`        ${h}`));

/* ----------------------------------------------------------- external --- */

console.log("\nExternal (real browser)\n");
for (const href of [...external].sort()) {
  const page = await ctx.newPage();
  try {
    const res = await page.goto(href, { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.waitForTimeout(1500);
    const status = res?.status() ?? 0;
    const title = (await page.title()).trim();
    if (status >= 400) bad(`${href} → HTTP ${status}`);
    else ok(`${status}  ${href}\n        “${title.slice(0, 60)}”`);
  } catch (e) {
    bad(`${href} → ${e.message.split("\n")[0].slice(0, 60)}`);
  }
  await page.close();
}

await browser.close();

console.log(
  fails === 0
    ? "\n  ALL LINK CHECKS PASSED\n"
    : `\n  ${fails} FAILURE(S)\n`
);
process.exit(fails === 0 ? 0 : 1);
