import type { Metadata } from "next";
import { Container, Section, Eyebrow } from "@/components/ui/Primitives";
import { Breadcrumbs } from "@/components/sections/PageParts";
import manifest from "@/data/image-manifest.json";
import mapGeo from "@/data/map-geo.json";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Image Credits",
  description:
    "Attribution for the photography and cartography used on snzventures.com, with source and licence for each asset.",
  path: "/legal/image-credits",
});

type Entry = {
  key: string;
  file: string;
  source: string;
  licence: string | null;
  artist?: string | null;
  page?: string;
};

/**
 * Several images are Creative Commons BY / BY-SA, which require attribution.
 * This page satisfies that obligation and is linked from the global footer.
 */
export default function ImageCreditsPage() {
  const entries = manifest as Entry[];

  return (
    <>
      <section className="relative overflow-hidden bg-void pb-12 pt-[104px] text-paper md:pt-[128px]">
        <div aria-hidden className="graticule mask-radial absolute inset-0 opacity-45" />
        <Container className="relative" size="narrow">
          <Breadcrumbs
            items={[
              { name: "Home", path: "/" },
              { name: "Image credits", path: "/legal/image-credits" },
            ]}
          />
          <Eyebrow tone="dark" className="mb-4">
            Attribution
          </Eyebrow>
          <h1 className="d-1 text-paper">Image credits</h1>
          <p className="mt-5 text-[0.95rem] leading-relaxed text-navy-200">
            Every photograph and map on this site is used under a licence that
            permits commercial use. Creative Commons assets are credited below
            as their licences require.
          </p>
        </Container>
      </section>

      <Section tone="light">
        <Container size="narrow">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-left">
              <caption className="sr-only">
                Photography and cartography credits with source and licence
              </caption>
              <thead>
                <tr className="border-b border-white/15">
                  <th
                    scope="col"
                    className="py-3 pr-4 text-[0.74rem] font-semibold uppercase tracking-wider text-navy-300"
                  >
                    Asset
                  </th>
                  <th
                    scope="col"
                    className="py-3 pr-4 text-[0.74rem] font-semibold uppercase tracking-wider text-navy-300"
                  >
                    Author
                  </th>
                  <th
                    scope="col"
                    className="py-3 pr-4 text-[0.74rem] font-semibold uppercase tracking-wider text-navy-300"
                  >
                    Source
                  </th>
                  <th
                    scope="col"
                    className="py-3 text-[0.74rem] font-semibold uppercase tracking-wider text-navy-300"
                  >
                    Licence
                  </th>
                </tr>
              </thead>
              <tbody>
                {entries.map((e) => (
                  <tr key={e.key} className="border-b border-white/12">
                    <td className="py-3 pr-4 align-top font-mono text-[0.78rem] text-paper">
                      {e.key}
                    </td>
                    <td className="py-3 pr-4 align-top text-[0.83rem] text-navy-200">
                      {e.artist?.split("\n")[0] ?? "—"}
                    </td>
                    <td className="py-3 pr-4 align-top text-[0.83rem]">
                      {e.page ? (
                        <a
                          href={e.page}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-moss-300 underline underline-offset-2"
                        >
                          {e.source}
                        </a>
                      ) : (
                        <span className="text-navy-200">{e.source}</span>
                      )}
                    </td>
                    <td className="py-3 align-top text-[0.83rem] text-navy-200">
                      {e.licence ?? "—"}
                    </td>
                  </tr>
                ))}
                <tr className="border-b border-white/12">
                  <td className="py-3 pr-4 align-top font-mono text-[0.78rem] text-paper">
                    corridor-map
                  </td>
                  <td className="py-3 pr-4 align-top text-[0.83rem] text-navy-200">
                    Wikimedia contributors
                  </td>
                  <td className="py-3 pr-4 align-top text-[0.83rem]">
                    <a
                      href="https://commons.wikimedia.org/wiki/File:BlankMap-World-Equirectangular.svg"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-moss-300 underline underline-offset-2"
                    >
                      Wikimedia Commons
                    </a>
                  </td>
                  <td className="py-3 align-top text-[0.83rem] text-navy-200">
                    {mapGeo.licence}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mt-8 text-[0.83rem] leading-relaxed text-navy-300">
            The SnZ Ventures logo and brand marks are the property of SnZ
            Ventures. The corridor map is derived from a public-domain
            equirectangular world map, resampled as a dot matrix.
          </p>
        </Container>
      </Section>
    </>
  );
}
