/**
 * Generates favicons, app icons and the header mark from the authentic
 * SnZ Ventures logo artwork (public/brand/snz-logo-original.png).
 *
 * The full logo contains a small letterspaced "VENTURES" that becomes
 * illegible noise below ~64px. The mark therefore isolates the "SnZ"
 * lettering inside the navy ring, which stays recognisable at 16px.
 */
import sharp from "sharp";
import fs from "node:fs/promises";

const SRC = "public/brand/snz-logo-original.png";
const OUT = "public/brand";
await fs.mkdir(OUT, { recursive: true });

const NAVY = "#1E2D56";

/** Crop of the "SnZ" lettering within the 1563px source artwork. */
const CROP = { left: 195, top: 462, width: 1222, height: 610 };

async function buildMark(size, { ring = true, bg = "#FFFFFF" } = {}) {
  const inner = Math.round(size * 0.74);
  const letters = await sharp(SRC)
    .extract(CROP)
    .resize(inner, null, { fit: "inside" })
    .toBuffer();
  const meta = await sharp(letters).metadata();

  const ringW = Math.max(1, Math.round(size * 0.035));
  const r = size / 2 - ringW / 2;
  const plate = Buffer.from(
    `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
       <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="${bg}"/>
       ${ring ? `<circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${NAVY}" stroke-width="${ringW}"/>` : ""}
     </svg>`
  );

  return sharp(plate)
    .composite([
      {
        input: letters,
        left: Math.round((size - meta.width) / 2),
        top: Math.round((size - meta.height) / 2),
      },
    ])
    .png()
    .toBuffer();
}

// Header / footer mark (transparent-friendly white plate)
await fs.writeFile(`${OUT}/snz-mark.png`, await buildMark(512));

// Favicon set — app/icon.png drives <link rel=icon> in Next's metadata
await fs.writeFile("app/icon.png", await buildMark(512));
await fs.writeFile("app/apple-icon.png", await buildMark(180));

// Multi-resolution .ico for legacy browsers and bookmark bars
const ico16 = await buildMark(16);
const ico32 = await buildMark(32);
const ico48 = await buildMark(48);
await fs.writeFile(`${OUT}/favicon-32.png`, ico32);

// Minimal ICO container (16/32/48)
function ico(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  const entries = [];
  const datas = [];
  let offset = 6 + images.length * 16;
  for (const { size, buf } of images) {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0);
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt8(0, 2);
    e.writeUInt8(0, 3);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(buf.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += buf.length;
    entries.push(e);
    datas.push(buf);
  }
  return Buffer.concat([header, ...entries, ...datas]);
}

await fs.writeFile(
  "app/favicon.ico",
  ico([
    { size: 16, buf: ico16 },
    { size: 32, buf: ico32 },
    { size: 48, buf: ico48 },
  ])
);

// Preview sheet so the mark can be eyeballed at real sizes
const previewSizes = [16, 32, 64, 128];
const tiles = [];
let x = 8;
for (const s of previewSizes) {
  tiles.push({ input: await buildMark(s), left: x, top: Math.round((140 - s) / 2) });
  x += s + 16;
}
await sharp({ create: { width: x + 8, height: 140, channels: 3, background: "#F4F6F8" } })
  .composite(tiles)
  .png()
  .toFile("brand-preview.png");

console.log("brand assets written");
