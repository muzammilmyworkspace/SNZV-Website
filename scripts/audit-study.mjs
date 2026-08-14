/**
 * Study Abroad page regression checks — the things `npm run audit` cannot see.
 *
 *   npm run audit:study        (the site must already be running)
 *
 * The general audit walks routes and viewports looking at the page at rest. It
 * has no notion of in-page anchors, sticky offsets or scroll spy, and all three
 * broke silently while this page was being built:
 *
 *   • `scroll-padding-top` (html) and `scroll-margin-top` (.anchor-target) ADD.
 *     Setting the latter to the full chrome height landed every heading 230px
 *     down with a dead band above it.
 *   • The spy's detection line sat above where anchors actually land, so
 *     clicking "Programmes" highlighted "Universities".
 *
 * Both would have looked fine in a screenshot. Hence this file.
 *
 * Scrolls are awaited by polling until `scrollY` stops moving — `scroll-behavior:
 * smooth` means a click returns long before the scroll finishes, and a fixed
 * timeout measures mid-flight and reports nonsense.
 */
import { chromium } from "playwright";

const BASE = process.env.BASE ?? "http://localhost:3000";
const IDS = [
  "overview",
  "destinations",
  "universities",
  "programmes",
  "scholarships",
  "journey",
  "support",
  "faqs",
];

const browser = await chromium.launch();
let fails = 0;
const bad = (m) => { fails++; console.log("  FAIL  " + m); };
const ok = (m) => console.log("  ok    " + m);

for (const vp of [
  { name: "mobile-360", width: 360, height: 780 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "desktop-1440", width: 1440, height: 900 },
]) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  const page = await ctx.newPage();
  console.log(`\n=== ${vp.name} ===`);
  await page.goto(BASE + "/study-abroad", { waitUntil: "networkidle" });

  // 1. Sub-nav exists and is a nav landmark, not a second header.
  const subnav = page.locator('nav[aria-label="Study Abroad sections"]');
  (await subnav.count()) === 1
    ? ok("sub-nav present, single instance")
    : bad("sub-nav count = " + (await subnav.count()));

  // 2. Every tab points at a section that exists.
  for (const id of IDS) {
    const n = await page.locator(`#${id}`).count();
    if (n !== 1) bad(`#${id} target count = ${n}`);
  }
  ok("all 8 anchor targets resolve");

  // 3. Clicking a tab must land the heading BELOW both fixed bars, not under them.
  //    `scroll-behavior: smooth` means the click returns long before the scroll
  //    finishes, so poll until scrollY stops moving instead of guessing a delay.
  const settle = () =>
    page.evaluate(
      () =>
        new Promise((resolve) => {
          // Tolerate sub-pixel drift: reveal animations near the foot of the
          // page nudge scrollY by fractions of a pixel for a while, so an
          // exact-equality test can wait forever. Also hard-stop after 6s so a
          // page that genuinely never settles fails a real assertion below
          // rather than blowing up the run with a timeout.
          const started = performance.now();
          let last = window.scrollY;
          let still = 0;
          const tick = () => {
            const now = window.scrollY;
            if (Math.abs(now - last) < 1) still++;
            else still = 0;
            last = now;
            if (still >= 6 || performance.now() - started > 6000) resolve(true);
            else requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        })
    );

  for (const id of ["destinations", "scholarships", "faqs"]) {
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await settle();
    await page.locator(`nav[aria-label="Study Abroad sections"] a[href="#${id}"]`).click();
    await settle();
    const top = await page.locator(`#${id}`).evaluate((el) => el.getBoundingClientRect().top);
    // Header (64) + sub-nav (~52) ≈ 116. Section top must clear that, and must
    // not sit so far down that a band of dead space opens above the heading.
    if (top < 110 || top > 190) bad(`#${id} landed at top=${Math.round(top)} (want 110–190)`);
    else ok(`#${id} lands clear of the chrome (top=${Math.round(top)})`);
  }

  // 4. Scroll spy marks exactly one tab current.
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.locator('nav[aria-label="Study Abroad sections"] a[href="#programmes"]').click();
  await settle();
  const current = await page
    .locator('nav[aria-label="Study Abroad sections"] a[aria-current="true"]')
    .allTextContents();
  if (current.length !== 1) {
    bad("aria-current count = " + current.length + " -> " + JSON.stringify(current));
  } else if (current[0].trim() !== "Programmes") {
    // The tab you pressed must be the tab that lights up.
    bad(`clicked Programmes but spy marked "${current[0].trim()}"`);
  } else {
    ok("scroll spy marks the clicked tab (Programmes)");
  }

  // 5. No horizontal overflow anywhere on the page.
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  overflow <= 0 ? ok("no horizontal overflow") : bad(`horizontal overflow of ${overflow}px`);

  // 6. The sub-nav rail itself must scroll on mobile rather than wrap or clip.
  const rail = await page.locator('nav[aria-label="Study Abroad sections"] ul').evaluate((el) => ({
    scrollW: el.scrollWidth,
    clientW: el.clientWidth,
    overflowX: getComputedStyle(el).overflowX,
  }));
  if (vp.width < 900) {
    rail.overflowX === "auto" && rail.scrollW > rail.clientW
      ? ok(`rail scrolls horizontally (${rail.scrollW}px in ${rail.clientW}px)`)
      : bad(`rail not scrollable: ${JSON.stringify(rail)}`);
  }

  // 7. Reduced motion must not break the reveals — content stays visible.
  await ctx.close();
}

// 8. prefers-reduced-motion: everything still rendered and opaque.
const ctx = await browser.newContext({
  viewport: { width: 1280, height: 800 },
  reducedMotion: "reduce",
});
const page = await ctx.newPage();
await page.goto(BASE + "/study-abroad", { waitUntil: "networkidle" });
await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" }));
await page.waitForTimeout(1200);
const hidden = await page.evaluate(() => {
  const els = [...document.querySelectorAll("h2, h3, p")];
  return els.filter((el) => {
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) return false;
    return parseFloat(getComputedStyle(el).opacity) < 0.1;
  }).length;
});
hidden === 0
  ? console.log("\n  ok    reduced motion: no content left invisible")
  : bad(`reduced motion: ${hidden} element(s) stuck at opacity 0`);
await ctx.close();

await browser.close();
console.log(fails === 0 ? "\n  ALL STUDY-NAV CHECKS PASSED\n" : `\n  ${fails} FAILURE(S)\n`);
process.exit(fails === 0 ? 0 : 1);
