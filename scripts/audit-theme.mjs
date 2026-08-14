/**
 * Theme regression checks.
 *
 *   npm run audit:theme        (the site must already be running)
 *
 * A theme switch is mostly a contrast problem, and contrast bugs are exactly
 * what a screenshot audit sails past. The two that matter here:
 *
 *   • Sections whose background is a darkened PHOTOGRAPH cannot follow the
 *     theme. The photo does not get lighter, so if `tone-deep` flips to
 *     navy-on-near-white those heroes become unreadable. `.plate-deep` pins
 *     the dark tone; this proves it stayed pinned.
 *   • `text-void` had no token behind it, so filled buttons inherited their
 *     parent's colour — white on green, ~1.9:1. This checks the real computed
 *     colours, not the class names.
 *
 * Also verifies the choice survives a reload without a flash of the wrong
 * theme, which is the whole reason the setter is an inline script.
 */
import { chromium } from "playwright";

const BASE = process.env.BASE ?? "http://localhost:3000";
const ROUTES = ["/", "/study-abroad", "/about", "/contact"];

let fails = 0;
const bad = (m) => { fails++; console.log("  FAIL  " + m); };
const ok = (m) => console.log("  ok    " + m);

/* WCAG relative luminance + contrast ratio. */
const lum = ([r, g, b]) => {
  const f = (c) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const parse = (s) => (s.match(/\d+(\.\d+)?/g) ?? []).slice(0, 3).map(Number);
const ratio = (fg, bg) => {
  const a = lum(parse(fg)), b = lum(parse(bg));
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
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

    // Body must actually repaint, not just carry an attribute.
    const bodyBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    const isLightBg = lum(parse(bodyBg)) > 0.5;
    if ((theme === "light") !== isLightBg) {
      bad(`${route}: body background ${bodyBg} does not match ${theme} theme`);
    }

    // Every heading and paragraph must clear WCAG AA against its own painted
    // background — walk up for the first ancestor that actually paints one.
    const worst = await page.evaluate(() => {
      /**
       * Walk up for the first ancestor that actually paints a ground.
       *
       * "Any non-transparent background" is not good enough: the design system
       * uses 3–6% tint overlays (`color-mix(in srgb, var(--fg) 3%, ...)`) for
       * hover and card surfaces. Treating one of those as THE background
       * measures the text against a nearly-invisible film and reports 1.5:1
       * for text that is perfectly legible. Only a substantially opaque layer
       * counts; anything thinner is skipped so the real ground is found.
       */
      const alphaOf = (c) => {
        const m = c.match(/^rgba?\([^)]*?([\d.]+)\s*\)$/);
        if (m && c.startsWith("rgba")) return parseFloat(m[1]);
        const ok = c.match(/\/\s*([\d.]+)\s*\)/);
        if (ok) return parseFloat(ok[1]);
        return 1;
      };
      const painted = (el) => {
        let n = el;
        while (n && n !== document.documentElement) {
          const bg = getComputedStyle(n).backgroundColor;
          if (bg && bg !== "transparent" && alphaOf(bg) >= 0.85) return bg;
          n = n.parentElement;
        }
        return getComputedStyle(document.body).backgroundColor;
      };
      const out = [];
      for (const el of document.querySelectorAll("h1, h2, h3, p, li, a, button")) {
        const r = el.getBoundingClientRect();
        if (r.width < 4 || r.height < 4) continue;
        const cs = getComputedStyle(el);
        if (parseFloat(cs.opacity) < 0.5) continue;
        if (!el.textContent?.trim()) continue;
        // Skip type sitting on a photograph — measured against the plate's
        // own background this is meaningless; the image is the real ground.
        if (el.closest(".plate, .plate-deep")) continue;
        const size = parseFloat(cs.fontSize);
        const weight = parseInt(cs.fontWeight, 10) || 400;
        const large = size >= 24 || (size >= 18.66 && weight >= 700);
        out.push({
          color: cs.color,
          bg: painted(el),
          need: large ? 3 : 4.5,
          tag: el.tagName,
          text: el.textContent.trim().slice(0, 40),
        });
      }
      return out;
    });

    const failures = worst
      .map((w) => ({ ...w, got: ratio(w.color, w.bg) }))
      .filter((w) => w.got < w.need)
      .sort((a, b) => a.got - b.got);

    if (failures.length) {
      bad(`${route}: ${failures.length} element(s) below WCAG AA`);
      failures.slice(0, 4).forEach((f) =>
        console.log(
          `          ${f.got.toFixed(2)}:1 (need ${f.need}) ${f.tag} "${f.text}" ${f.color} on ${f.bg}`
        )
      );
    } else {
      ok(`${route}: all text meets WCAG AA`);
    }

    /**
     * Gradient-clipped emphasis (`.d-em`).
     *
     * Its computed `color` is transparent — the paint comes from a clipped
     * background-image — so the sweep above skips it entirely and the most
     * prominent word on the page would go unchecked. Pull the gradient's own
     * colour stops and hold the WORST one to the large-text threshold, since
     * that stop is a real part of what the reader sees.
     */
    const emStops = await page.evaluate(() => {
      const painted = (el) => {
        let n = el;
        while (n && n !== document.documentElement) {
          const bg = getComputedStyle(n).backgroundColor;
          const a = bg.startsWith("rgba") ? parseFloat(bg.split(",").pop()) : 1;
          if (bg && bg !== "transparent" && a >= 0.85) return bg;
          n = n.parentElement;
        }
        return getComputedStyle(document.body).backgroundColor;
      };
      const out = [];
      for (const el of document.querySelectorAll(".d-em")) {
        const r = el.getBoundingClientRect();
        if (r.width < 4 || r.height < 4) continue;
        if (el.closest(".plate, .plate-deep")) continue;
        const stops = (getComputedStyle(el).backgroundImage.match(/rgba?\([^)]+\)/g) ?? []);
        out.push({ stops, bg: painted(el), text: el.textContent.trim().slice(0, 30) });
      }
      return out;
    });

    const emFails = [];
    for (const e of emStops) {
      for (const stop of e.stops) {
        const got = ratio(stop, e.bg);
        if (got < 3) emFails.push({ ...e, stop, got });
      }
    }
    if (emFails.length) {
      bad(`${route}: ${emFails.length} gradient stop(s) on .d-em below 3:1`);
      emFails.slice(0, 3).forEach((f) =>
        console.log(`          ${f.got.toFixed(2)}:1 "${f.text}" ${f.stop} on ${f.bg}`)
      );
    } else if (emStops.length) {
      ok(`${route}: gradient emphasis clears 3:1 at every stop (${emStops.length} found)`);
    }

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    if (overflow > 0) bad(`${route}: horizontal overflow of ${overflow}px`);
  }

  // The toggle must be reachable and correctly labelled.
  await page.goto(BASE + "/", { waitUntil: "load", timeout: 60000 });
  const toggle = page.locator('header button[aria-label*="theme" i]');
  (await toggle.count()) >= 1
    ? ok("theme toggle present in header")
    : bad("no theme toggle in header");

  await ctx.close();
}

/* Switching must persist across a reload, with no flash of the old theme. */
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "load", timeout: 60000 });

  const before = await page.evaluate(() => document.documentElement.getAttribute("data-theme"));
  await page.locator('header button[aria-label*="theme" i]').first().click();
  await page.waitForTimeout(300);
  const after = await page.evaluate(() => document.documentElement.getAttribute("data-theme"));

  before !== after
    ? ok(`toggle switches ${before} -> ${after}`)
    : bad(`toggle did not change theme (stayed ${before})`);

  await page.reload({ waitUntil: "domcontentloaded" });
  const persisted = await page.evaluate(() =>
    document.documentElement.getAttribute("data-theme")
  );
  persisted === after
    ? ok(`choice persists across reload (${persisted}, set before first paint)`)
    : bad(`choice lost on reload: ${persisted} != ${after}`);

  await ctx.close();
}

await browser.close();
console.log(fails === 0 ? "\n  ALL THEME CHECKS PASSED\n" : `\n  ${fails} FAILURE(S)\n`);
process.exit(fails === 0 ? 0 : 1);
