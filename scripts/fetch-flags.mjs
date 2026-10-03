/**
 * NATIONAL FLAGS FOR THE STUDY DESTINATIONS.
 *
 *   npm run build:flags
 *
 * Downloads one SVG per destination in `data/study.ts` and writes it to
 * public/flags/<slug>.svg, then records every file in data/image-manifest.json
 * so /legal/image-credits renders the attribution. An asset that is not in the
 * manifest is an attribution the site silently fails to make.
 *
 * WHY SVG AND NOT A RASTER. A flag is flat vector art. One SVG is sharp at
 * 24px and at 2400px and weighs about a kilobyte, so "HD flags" is a problem
 * that vectors delete rather than solve — there is no @2x, no srcset and no
 * resampling to get wrong. The two that carry an emblem (Spain, Malta) are
 * larger because the emblem is real geometry, and they are still smaller than
 * the PNG would be.
 *
 * WHY NOT DRAW THEM HERE. Eight of the ten are two or three bands and could be
 * hand-written in an afternoon. Spain's coat of arms and Malta's George Cross
 * could not, and a Spanish flag missing its arms is a different flag — it is
 * the civil ensign. Getting a national flag subtly wrong is the detail a
 * student from that country notices first, on the page that is meant to tell
 * them they are understood.
 *
 * SOURCE: flag-icons (MIT), by Panayiotis Lipiridis.
 * https://github.com/lipis/flag-icons — pinned to an exact version, because
 * "latest" means the artwork can change under a build that is otherwise
 * identical.
 *
 * The 4x3 set, not 1x1. Squares crop the design; several of these flags are
 * 2:1 or 3:2 and a squashed national flag is worse than no flag.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { studyDestinations } from "../data/study.ts";

const VERSION = "7.2.3";
const BASE = `https://cdn.jsdelivr.net/npm/flag-icons@${VERSION}/flags/4x3`;
const OUT = path.join(process.cwd(), "public", "flags");
const MANIFEST = path.join(process.cwd(), "data", "image-manifest.json");

/**
 * Destination slug → ISO 3166-1 alpha-2.
 *
 * Written out rather than derived from the slug: "czechia" is `cz` and
 * "estonia" is `ee`, so any rule clever enough to guess both is a rule that
 * will one day guess wrong silently. A destination with no entry here fails
 * the run rather than shipping without a flag.
 */
const ISO = {
  lithuania: "lt",
  poland: "pl",
  hungary: "hu",
  latvia: "lv",
  germany: "de",
  malta: "mt",
  spain: "es",
  italy: "it",
  france: "fr",
  estonia: "ee",
};

await fs.mkdir(OUT, { recursive: true });

const manifest = JSON.parse(await fs.readFile(MANIFEST, "utf8"));
const entries = [];
let failures = 0;

for (const d of studyDestinations) {
  const iso = ISO[d.slug];
  if (!iso) {
    console.log(`  FAIL  ${d.slug} — no ISO code. Add it to ISO in this file.`);
    failures++;
    continue;
  }

  try {
    const res = await fetch(`${BASE}/${iso}.svg`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    let svg = await res.text();

    /*
      A <title> inside the SVG is read aloud by a screen reader even when the
      <img> has its own alt text, so the country is announced twice. The alt
      on the element is the one the page controls, so this one goes.
    */
    svg = svg.replace(/<title>[\s\S]*?<\/title>/g, "");

    const file = path.join(OUT, `${d.slug}.svg`);
    await fs.writeFile(file, svg, "utf8");

    entries.push({
      key: `flag-${d.slug}`,
      file: `/flags/${d.slug}.svg`,
      source: `flag-icons ${VERSION}`,
      licence: "MIT",
      artist: "Panayiotis Lipiridis and contributors",
      page: "https://github.com/lipis/flag-icons",
    });

    console.log(`  ${String(Math.round(svg.length / 1024)).padStart(4)} KB  ${d.slug} (${iso})`);
  } catch (error) {
    console.log(`  FAIL  ${d.slug} — ${error.message}`);
    failures++;
  }
}

/* Replace any previous flag rows rather than appending duplicates. */
const kept = manifest.filter((m) => !String(m.key).startsWith("flag-"));
await fs.writeFile(MANIFEST, JSON.stringify([...kept, ...entries], null, 2) + "\n", "utf8");

console.log(
  `\n  ${entries.length} flags, ${entries.length} manifest entries${
    failures ? ` — ${failures} FAILED` : ""
  }\n`
);
process.exit(failures ? 1 : 0);
