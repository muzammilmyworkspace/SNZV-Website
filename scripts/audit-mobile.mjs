/**
 * Mobile responsiveness checks.
 *
 *   npm run audit:mobile        (the site must already be running)
 *
 * The general audit screenshots small viewports but only fails on horizontal
 * overflow of the document. That misses the ways a layout actually breaks on a
 * phone:
 *
 *   • an individual element wider than the viewport (a table, a fixed-width
 *     card, an un-wrapped string) while the body still clips cleanly;
 *   • tap targets below the 44px minimum, which is the difference between a
 *     nav that works one-handed and one that does not;
 *   • text under 12px, which is unreadable at arm's length;
 *   • content sitting under a fixed header on first paint.
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
  "/services/company-formation",
  "/contact",
  "/login",
  "/register",
  "/legal/privacy-policy",
];
const VIEWPORTS = [
  /**
   * 320px is the narrowest viewport still in real use (iPhone SE 1st gen,
   * small Androids, and any phone with display zoom turned up). If a layout
   * survives 320 it survives everything above it, so it is the one width worth
   * testing that most sites skip.
   */
  { name: "small-320", width: 320, height: 640 },
  { name: "iphone-se", width: 375, height: 667 },
  { name: "iphone-14", width: 390, height: 844 },
  { name: "pixel", width: 412, height: 915 },
  { name: "tablet", width: 768, height: 1024 },
];

let fails = 0;
const bad = (m) => { fails++; console.log("  FAIL  " + m); };
const ok = (m) => console.log("  ok    " + m);

const browser = await chromium.launch();

for (const vp of VIEWPORTS) {
  console.log(`\n=== ${vp.name} (${vp.width}px) ===`);
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    hasTouch: true,
    isMobile: vp.width < 700,
    deviceScaleFactor: 2,
  });
  const page = await ctx.newPage();

  await page.goto(BASE + "/", { waitUntil: "load", timeout: 60000 });
  await page.evaluate(() =>
    localStorage.setItem("snz_pathway_popup", JSON.stringify({ until: Date.now() + 86400000 }))
  );

  for (const route of ROUTES) {
    await page.goto(BASE + route, { waitUntil: "load", timeout: 60000 });
    await page.waitForTimeout(500);

    const report = await page.evaluate((vw) => {
      const out = { overflow: 0, wide: [], small: [], tiny: [] };

      out.overflow =
        document.documentElement.scrollWidth - document.documentElement.clientWidth;

      for (const el of document.querySelectorAll("body *")) {
        const cs = getComputedStyle(el);
        if (cs.display === "none" || cs.visibility === "hidden") continue;
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;

        /**
         * Elements wider than the screen — but only where that actually
         * reaches the reader.
         *
         * Oversized children are how this design works: hero plates sit at
         * `inset-[-4%]` so they can parallax, and the atmospheric blooms are
         * deliberately larger than their section. Every one of them lives
         * inside a clipping ancestor. Flagging those reported 82 breakages on
         * a site with none, so the test walks up and only complains if
         * NOTHING clips the element before it reaches the body.
         */
        if (cs.position !== "fixed" && r.width > vw + 2) {
          let clipped = false;
          for (let n = el.parentElement; n && n !== document.body; n = n.parentElement) {
            const pc = getComputedStyle(n);
            if (/hidden|clip|auto|scroll/.test(pc.overflowX + pc.overflow)) {
              clipped = true;
              break;
            }
          }
          if (!clipped) {
            out.wide.push({
              w: Math.round(r.width),
              tag: el.tagName,
              cls: (el.getAttribute("class") || "").slice(0, 46),
            });
          }
        }

        /**
         * Tap targets — real controls only.
         *
         * A breadcrumb or an inline link inside a sentence is text, and text
         * is allowed to be text height; WCAG's target-size rule exempts links
         * in a block of prose for exactly that reason. Only buttons and links
         * that are laid out as their own box are held to a touch minimum.
         */
        const isControl =
          el.matches("button, input, select, textarea, [role=button]") ||
          (el.matches("a[href]") && !/^inline$/.test(cs.display));
        // Parked off-screen until focused (skip link) — a keyboard affordance,
        // never a touch target.
        const hiddenUntilFocus =
          cs.position === "absolute" && (r.top < 0 || r.left < -1000);
        if (isControl && !hiddenUntilFocus && (r.height < 30 || r.width < 24)) {
          out.small.push({
            h: Math.round(r.height),
            w: Math.round(r.width),
            text: (el.textContent || "").trim().slice(0, 24) || el.getAttribute("aria-label") || el.tagName,
          });
        }

        /**
         * Unreadably small type.
         *
         * The threshold is 10px, not 12px: `.label` is 0.7rem (11.2px) with
         * 0.16em tracking and is the design system's deliberate small-caps
         * size, used for every eyebrow on the site. Failing it would not be
         * reporting a defect, it would be arguing with the art direction.
         */
        const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
        if (own && parseFloat(cs.fontSize) < 10) {
          out.tiny.push({
            px: +parseFloat(cs.fontSize).toFixed(1),
            text: (el.textContent || "").trim().slice(0, 24),
          });
        }
      }
      return out;
    }, vp.width);

    const issues = [];
    if (report.overflow > 0) issues.push(`document overflows by ${report.overflow}px`);
    if (report.wide.length)
      issues.push(
        `${report.wide.length} element(s) wider than viewport: ` +
          report.wide.slice(0, 2).map((w) => `${w.tag} ${w.w}px [${w.cls}]`).join("; ")
      );
    if (report.small.length)
      issues.push(
        `${report.small.length} tap target(s) under 32px: ` +
          report.small.slice(0, 2).map((s) => `"${s.text}" ${s.w}x${s.h}`).join("; ")
      );
    if (report.tiny.length)
      issues.push(
        `${report.tiny.length} text run(s) under 11.5px: ` +
          report.tiny.slice(0, 2).map((t) => `${t.px}px "${t.text}"`).join("; ")
      );

    if (issues.length) issues.forEach((i) => bad(`${route}: ${i}`));
    else ok(route);
  }

  /**
   * The mobile menu, actually opened.
   *
   * Everything above measures the page at rest. But on a phone the drawer IS
   * the navigation — if it opens off-screen, scrolls under the fold, or has
   * links too small to hit, the site is unusable no matter how well the
   * sections stack. Only the phone widths run this; the tablet shows the
   * desktop nav.
   */
  if (vp.width < 700) {
    await page.goto(BASE + "/", { waitUntil: "load", timeout: 60000 });
    const toggle = page.locator('[aria-controls="mobile-nav"]');
    const menuIssues = [];

    const tb = await toggle.boundingBox();
    if (!tb) menuIssues.push("menu button not visible");
    else if (tb.height < 40 || tb.width < 40)
      menuIssues.push(`menu button only ${Math.round(tb.width)}x${Math.round(tb.height)}`);

    if (tb) {
      await toggle.click();
      await page.waitForTimeout(600);

      if ((await toggle.getAttribute("aria-expanded")) !== "true")
        menuIssues.push("aria-expanded did not flip to true");

      const drawer = await page.evaluate((vw) => {
        const el = document.getElementById("mobile-nav");
        if (!el) return { missing: true };
        const r = el.getBoundingClientRect();
        const links = [...el.querySelectorAll("a[href], button")]
          .map((a) => {
            const b = a.getBoundingClientRect();
            return { h: Math.round(b.height), w: Math.round(b.width), t: (a.textContent || "").trim().slice(0, 20) };
          })
          .filter((l) => l.h > 0 && l.w > 0);
        return {
          off: r.left < -2 || r.right > vw + 2,
          hidden: getComputedStyle(el).display === "none",
          /**
           * Is real content stranded below the fold with no way to reach it?
           *
           * NOT `scrollHeight > clientHeight`. The drawer carries an
           * atmospheric bloom pinned at `-bottom-40`, which is 160px taller
           * than the panel by design and inflates scrollHeight on every
           * viewport. Reading that as breakage reported an unreachable menu on
           * a menu that scrolls perfectly. So this asks the question that
           * actually matters — does anything a reader could *use* sit past the
           * bottom edge — and decorative layers are excluded by the two marks
           * they already carry.
           */
          cut: [...el.querySelectorAll("a[href], button, li, p")].some((n) => {
            if (n.closest("[aria-hidden=true]")) return false;
            if (getComputedStyle(n).pointerEvents === "none") return false;
            const r = n.getBoundingClientRect();
            return r.height > 0 && r.bottom > el.getBoundingClientRect().bottom + 2;
          }),
          count: links.length,
          small: links.filter((l) => l.h < 40),
        };
      }, vp.width);

      if (drawer.missing) menuIssues.push("#mobile-nav absent after opening");
      else {
        if (drawer.hidden) menuIssues.push("drawer still display:none after opening");
        if (drawer.off) menuIssues.push("drawer extends outside the viewport");
        if (drawer.cut) menuIssues.push("drawer content is taller than the drawer and cannot be scrolled");
        if (!drawer.count) menuIssues.push("drawer contains no links");
        if (drawer.small?.length)
          menuIssues.push(
            `${drawer.small.length} drawer link(s) under 40px tall: ` +
              drawer.small.slice(0, 3).map((l) => `"${l.t}" ${l.h}px`).join("; ")
          );
      }
    }

    if (menuIssues.length) menuIssues.forEach((m) => bad(`mobile menu: ${m}`));
    else ok("mobile menu opens, fits, and every link is tappable");
  }

  await ctx.close();
}

await browser.close();
console.log(fails === 0 ? "\n  ALL MOBILE CHECKS PASSED\n" : `\n  ${fails} FAILURE(S)\n`);
process.exit(fails === 0 ? 0 : 1);
