/**
 * Generates a dot-matrix map of the SnZ corridor region from a public-domain
 * equirectangular blank world map (File:BlankMap-World-Equirectangular.svg).
 *
 * Two things about the source that are easy to get wrong:
 *  1. The map is INSET inside a framed canvas with white margins — it does not
 *     fill the image. The frame is detected and used to calibrate lat/lon.
 *  2. Land is grey (185), ocean white (255), and country borders are drawn in
 *     WHITE on top of land, so the land threshold must sit between them.
 *
 * A validation gate at the end checks known land/ocean coordinates and fails
 * the build rather than silently shipping a wrong map.
 *
 * Outputs:
 *   public/brand/corridor-map-{dark,light}.svg   static dot field (<img>)
 *   data/map-geo.json                            transform for the React overlay
 */
import sharp from "sharp";
import fs from "node:fs/promises";

const UA = { "User-Agent": "SNZVenturesSite/1.0" };
const TITLE = "File:BlankMap-World-Equirectangular.svg";
const RENDER_W = 3600;

/** Corridor region: Atlantic coast through Bangladesh, Gulf up to the Baltic. */
const BOUNDS = { lonMin: -12, lonMax: 96, latMin: 4, latMax: 66 };
const LAND_MAX_LUM = 210;

/* ------------------------------------------------------------- fetch source */

const api = new URL("https://en.wikipedia.org/w/api.php");
api.search = new URLSearchParams({
  action: "query",
  titles: TITLE,
  prop: "imageinfo",
  iiprop: "url|extmetadata",
  iiurlwidth: String(RENDER_W),
  format: "json",
});
const meta = Object.values((await (await fetch(api, { headers: UA })).json()).query.pages)[0]
  .imageinfo[0];
const licence = meta.extmetadata?.LicenseShortName?.value ?? "Public domain";

const src = Buffer.from(
  await (await fetch(meta.thumburl, { headers: UA })).arrayBuffer()
);

const { data, info } = await sharp(src)
  .flatten({ background: "#ffffff" })
  .greyscale()
  .removeAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

if (info.channels !== 1) {
  throw new Error(`expected single-channel raster, got ${info.channels}`);
}

const IW = info.width;
const IH = info.height;
const lum = (x, y) => data[Math.round(y) * IW + Math.round(x)];

/* --------------------------------------------- detect the inset map frame */

let x0 = IW,
  x1 = 0,
  y0 = IH,
  y1 = 0;
for (let y = 0; y < IH; y++) {
  for (let x = 0; x < IW; x++) {
    if (data[y * IW + x] < 250) {
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
    }
  }
}

// Frame width spans a full 360°; a plate-carrée world is exactly 2:1, so the
// height for 180° is derived rather than taken from the bbox (Antarctica and
// the frame stroke both overshoot the bottom edge).
const MAP_X = x0;
const MAP_W = x1 - x0;
const MAP_Y = y0;
const MAP_H = MAP_W / 2;

const lonToPx = (lon) => MAP_X + ((lon + 180) / 360) * MAP_W;
const latToPx = (lat) => MAP_Y + ((90 - lat) / 180) * MAP_H;

console.log(`source ${IW}x${IH} — frame x${x0}..${x1} y${y0}..${y1} [${licence}]`);

/* ------------------------------------------------ validate the calibration */

const CHECKS = [
  ["Paris", 2.35, 48.85, "land"],
  ["Madrid", -3.7, 40.4, "land"],
  ["Cairo", 31.2, 30.0, "land"],
  ["Delhi", 77.2, 28.6, "land"],
  ["Vilnius", 25.28, 54.69, "land"],
  ["Dhaka", 90.4, 23.8, "land"],
  ["Warsaw", 21.0, 52.23, "land"],
  ["Mid-Atlantic", -30, 40, "ocean"],
  ["Mediterranean", 18, 35, "ocean"],
  ["Arabian Sea", 63, 15, "ocean"],
  ["Bay of Bengal", 89, 15, "ocean"],
  ["Pacific", -140, 0, "ocean"],
];

const failures = [];
for (const [name, lon, lat, expected] of CHECKS) {
  const got = lum(lonToPx(lon), latToPx(lat)) < LAND_MAX_LUM ? "land" : "ocean";
  if (got !== expected) failures.push(`${name}: expected ${expected}, got ${got}`);
}
if (failures.length > 2) {
  throw new Error(`map calibration failed:\n  ${failures.join("\n  ")}`);
}
console.log(
  failures.length
    ? `calibration ok (${CHECKS.length - failures.length}/${CHECKS.length}; coastal tolerance: ${failures.join("; ")})`
    : `calibration ok (${CHECKS.length}/${CHECKS.length})`
);

/* ------------------------------------------------------ sample the corridor */

const W = 1000;
const H = Math.round(
  (W * (latToPx(BOUNDS.latMin) - latToPx(BOUNDS.latMax))) /
    (lonToPx(BOUNDS.lonMax) - lonToPx(BOUNDS.lonMin))
);
const STEP = 7;

const dots = [];
for (let oy = 0; oy < H; oy += STEP) {
  for (let ox = 0; ox < W; ox += STEP) {
    const lon = BOUNDS.lonMin + (ox / W) * (BOUNDS.lonMax - BOUNDS.lonMin);
    const lat = BOUNDS.latMax - (oy / H) * (BOUNDS.latMax - BOUNDS.latMin);
    if (lum(lonToPx(lon), latToPx(lat)) < LAND_MAX_LUM) dots.push([ox, oy]);
  }
}

/* ------------------------------------------------------------------ output */

function svgFor(fill, opacity) {
  const circles = dots
    .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.5"/>`)
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"><g fill="${fill}" fill-opacity="${opacity}">${circles}</g></svg>`;
}

await fs.mkdir("public/brand", { recursive: true });
await fs.writeFile("public/brand/corridor-map-dark.svg", svgFor("#FFFFFF", 0.24));
await fs.writeFile("public/brand/corridor-map-light.svg", svgFor("#1E2D56", 0.16));

await fs.writeFile(
  "data/map-geo.json",
  JSON.stringify({ w: W, h: H, bounds: BOUNDS, source: TITLE, licence }, null, 2)
);

await sharp(Buffer.from(svgFor("#0A1226", 0.6)))
  .flatten({ background: "#F4F6F8" })
  .png()
  .toFile("map-preview.png");

console.log(`viewBox 0 0 ${W} ${H} — ${dots.length} dots`);
