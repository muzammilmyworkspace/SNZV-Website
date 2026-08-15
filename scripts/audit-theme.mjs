/**
 * Theme regression checks.
 *
 *   npm run audit:theme        (the site must already be running)
 *
 * A theme switch is mostly a contrast problem, and contrast bugs are exactly
 * what a screenshot audit sails past.
 *
 * HOW COLOUR IS MEASURED
 * Colours are resolved and composited IN THE PAGE, on a canvas, not parsed
 * from the computed-style string here. Two reasons, both learned the hard way:
 *
 *   • Chrome returns `color(srgb 0.44 0.76 0.23 / 0.6)`, `oklab(...)` and
 *     `lab(...)` as readily as `rgb()`. A regex that assumes rgb reads the
 *     srgb floats as 0–255 and reports nonsense.
 *   • Most of this design system's low-contrast risk is ALPHA — `text-accent/60`,
 *     `text-white/20`. Comparing an alpha colour to a background without
 *     compositing it over that background measures a colour nobody can see.
 *
 * The canvas does both: any CSS colour in, actual painted pixel out.
 *
 * WHAT IS CHECKED
 * Every element owning a direct text node, not just headings and paragraphs —
 * the design system carries eyebrows, chapter markers and stat captions in
 * `<span class="label">`, and an audit blind to those checks the wrong half of
 * the page. Type over a photograph is skipped: the image is the real ground.
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
  "/insights/choosing-a-course-that-leads-to-work",
  "/services/company-formation",
  "/contact",
  "/login",
  "/register",
  "/legal/privacy-policy",
];

let fails = 0;
const bad = (m) => { fails++; console.log("  FAIL  " + m); };
const ok = (m) => console.log("  ok    " + m);

/** Runs inside the page. Returns every text element with its true ratio. */
const COLLECT = () => {
  const cv = document.createElement("canvas");
  cv.width = cv.height = 1;
  const ctx = cv.getContext("2d", { willReadFrequently: true });

  /**
   * Any CSS colour → [r,g,b,a], by PAINTING it and reading the pixel.
   *
   * Reading `ctx.fillStyle` back does not work: Chrome hands back `lab(...)`
   * and `oklab(...)` unchanged rather than normalising them, so a numeric
   * parse reads the L/a/b channels as if they were RGB. That is what made a
   * dark-brown-on-cream notice measure 1.21:1 when it is actually well over
   * 10:1 — a false failure that would have sent me "fixing" working colour.
   *
   * Painting sidesteps the whole problem: whatever the browser can render, it
   * renders, and the pixel is the truth. Alpha is recovered by painting the
   * same colour over black and over white and solving for it.
   */
  const toRGBA = (css) => {
    if (!css || css === "transparent") return [0, 0, 0, 0];

    const paintOver = (base) => {
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = base;
      ctx.fillRect(0, 0, 1, 1);
      ctx.fillStyle = css;
      ctx.fillRect(0, 0, 1, 1);
      return ctx.getImageData(0, 0, 1, 1).data;
    };

    const onBlack = paintOver("#000");
    const onWhite = paintOver("#fff");

    // Where the two agree the colour is opaque; where they diverge, that gap
    // is exactly (1 - alpha) * 255.
    const spread =
      (onWhite[0] - onBlack[0] + (onWhite[1] - onBlack[1]) + (onWhite[2] - onBlack[2])) / 3;
    const a = Math.max(0, Math.min(1, 1 - spread / 255));
    if (a < 0.004) return [0, 0, 0, 0];

    return [onBlack[0] / a, onBlack[1] / a, onBlack[2] / a, a];
  };

  /** Paint fg over bg and read the pixel that results. */
  const composite = (fg, bg) => {
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = `rgb(${bg[0]},${bg[1]},${bg[2]})`;
    ctx.fillRect(0, 0, 1, 1);
    ctx.fillStyle = `rgba(${fg[0]},${fg[1]},${fg[2]},${fg[3]})`;
    ctx.fillRect(0, 0, 1, 1);
    const d = ctx.getImageData(0, 0, 1, 1).data;
    return [d[0], d[1], d[2]];
  };

  const lum = ([r, g, b]) => {
    const f = (c) => {
      c /= 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const ratio = (a, b) => {
    const [hi, lo] = lum(a) > lum(b) ? [lum(a), lum(b)] : [lum(b), lum(a)];
    return (hi + 0.05) / (lo + 0.05);
  };

  /**
   * The ground an element is actually painted on: walk up compositing every
   * background until one is opaque. A 3% tint is part of the ground, not the
   * ground itself, so it must be blended rather than treated as either.
   */
  const groundOf = (el) => {
    const stack = [];
    let n = el;
    while (n && n !== document.documentElement) {
      const c = toRGBA(getComputedStyle(n).backgroundColor);
      if (c[3] > 0) stack.push(c);
      if (c[3] >= 0.999) break;
      n = n.parentElement;
    }
    const base = toRGBA(getComputedStyle(document.body).backgroundColor);
    let out = base[3] >= 0.999 ? [base[0], base[1], base[2]] : [10, 23, 48];
    for (let i = stack.length - 1; i >= 0; i--) out = composite(stack[i], out);
    return out;
  };

  const hasOwnText = (el) =>
    [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());

  const out = [];
  for (const el of document.querySelectorAll("body *")) {
    if (!hasOwnText(el)) continue;
    if (el.closest("script, style, noscript, svg")) continue;
    // Type over a photograph — the image is the ground, not the CSS colour.
    if (el.closest(".plate, .plate-deep")) continue;

    const r = el.getBoundingClientRect();
    if (r.width < 4 || r.height < 4) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === "hidden" || cs.display === "none") continue;
    if (parseFloat(cs.opacity) < 0.5) continue;
    if (cs.clip === "rect(0px, 0px, 0px, 0px)") continue;

    const bg = groundOf(el);
    const fg = composite(toRGBA(cs.color), bg);

    const size = parseFloat(cs.fontSize);
    const weight = parseInt(cs.fontWeight, 10) || 400;
    const large = size >= 24 || (size >= 18.66 && weight >= 700);

    out.push({
      got: ratio(fg, bg),
      need: large ? 3 : 4.5,
      tag: el.tagName,
      cls: (el.getAttribute("class") || "").slice(0, 48),
      color: cs.color,
      text: [...el.childNodes]
        .filter((n) => n.nodeType === 3)
        .map((n) => n.textContent)
        .join(" ")
        .trim()
        .slice(0, 34),
    });
  }
  return out;
};

/** Gradient-clipped emphasis has a transparent `color`; check its stops. */
const COLLECT_EM = () => {
  const cv = document.createElement("canvas");
  cv.width = cv.height = 1;
  const ctx = cv.getContext("2d", { willReadFrequently: true });
  const toRGBA = (css) => {
    ctx.fillStyle = "#000";
    ctx.fillStyle = css;
    const r = ctx.fillStyle;
    if (r.startsWith("#")) {
      const n = parseInt(r.slice(1), 16);
      return [(n >> 16) & 255, (n >> 8) & 255, n & 255, 1];
    }
    const p = r.match(/[\d.]+/g).map(Number);
    return [p[0], p[1], p[2], p[3] ?? 1];
  };
  const lum = ([r, g, b]) => {
    const f = (c) => {
      c /= 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const ratio = (a, b) => {
    const [hi, lo] = lum(a) > lum(b) ? [lum(a), lum(b)] : [lum(b), lum(a)];
    return (hi + 0.05) / (lo + 0.05);
  };

  const out = [];
  for (const el of document.querySelectorAll(".d-em")) {
    if (el.closest(".plate, .plate-deep")) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 4 || r.height < 4) continue;
    let n = el, bg = null;
    while (n && n !== document.documentElement) {
      const c = toRGBA(getComputedStyle(n).backgroundColor);
      if (c[3] >= 0.999) { bg = [c[0], c[1], c[2]]; break; }
      n = n.parentElement;
    }
    if (!bg) {
      const b = toRGBA(getComputedStyle(document.body).backgroundColor);
      bg = [b[0], b[1], b[2]];
    }
    for (const stop of getComputedStyle(el).backgroundImage.match(/(rgba?|color|oklab|lab|oklch)\([^)]+\)/g) ?? []) {
      const c = toRGBA(stop);
      out.push({ got: ratio([c[0], c[1], c[2]], bg), stop, text: el.textContent.trim().slice(0, 24) });
    }
  }
  return out;
};

const browser = await chromium.launch();

for (const theme of ["dark", "light"]) {
  console.log(`\n=== ${theme} theme ===`);
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();

  await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
  await page.evaluate((t) => localStorage.setItem("snz-theme", t), theme);

  for (const route of ROUTES) {
    await page.goto(BASE + route, { waitUntil: "load", timeout: 60000 });

    const applied = await page.evaluate(() =>
      document.documentElement.getAttribute("data-theme")
    );
    if (applied !== theme) {
      bad(`${route}: data-theme is "${applied}", expected "${theme}"`);
      continue;
    }

    const rows = await page.evaluate(COLLECT);
    const failures = rows.filter((w) => w.got < w.need).sort((a, b) => a.got - b.got);

    if (failures.length) {
      bad(`${route}: ${failures.length} element(s) below WCAG AA`);
      failures.slice(0, 5).forEach((f) =>
        console.log(
          `          ${f.got.toFixed(2)}:1 (need ${f.need}) ${f.tag} "${f.text}"  ${f.color}  [${f.cls}]`
        )
      );
    } else {
      ok(`${route}: all text meets WCAG AA (${rows.length} elements)`);
    }

    const em = await page.evaluate(COLLECT_EM);
    const emFails = em.filter((e) => e.got < 3);
    if (emFails.length) {
      bad(`${route}: ${emFails.length} gradient stop(s) on .d-em below 3:1`);
      emFails.slice(0, 3).forEach((f) =>
        console.log(`          ${f.got.toFixed(2)}:1 "${f.text}" ${f.stop}`)
      );
    }

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    if (overflow > 0) bad(`${route}: horizontal overflow of ${overflow}px`);
  }

  await page.goto(BASE + "/", { waitUntil: "load", timeout: 60000 });
  (await page.locator('header button[aria-label*="theme" i]').count()) >= 1
    ? ok("theme toggle present in header")
    : bad("no theme toggle in header");

  await ctx.close();
}

/* The choice must persist across a reload, applied before first paint. */
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "load", timeout: 60000 });
  const before = await page.evaluate(() => document.documentElement.getAttribute("data-theme"));
  await page.locator('header button[aria-label*="theme" i]').first().click();
  await page.waitForTimeout(300);
  const after = await page.evaluate(() => document.documentElement.getAttribute("data-theme"));
  before !== after ? ok(`toggle switches ${before} -> ${after}`) : bad("toggle did not change theme");
  await page.reload({ waitUntil: "domcontentloaded" });
  const persisted = await page.evaluate(() => document.documentElement.getAttribute("data-theme"));
  persisted === after ? ok(`choice persists across reload (${persisted})`) : bad("choice lost on reload");
  await ctx.close();
}

await browser.close();
console.log(fails === 0 ? "\n  ALL THEME CHECKS PASSED\n" : `\n  ${fails} FAILURE(S)\n`);
process.exit(fails === 0 ? 0 : 1);
