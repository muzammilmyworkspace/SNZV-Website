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
      <section className="relative overflow-hidden bg-surface pb-12 pt-36 text-fg md:pt-44">
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
          <h1 className="d-1 text-fg">Image credits</h1>
          <p className="mt-5 text-[0.95rem] leading-relaxed text-muted">
            Every photograph and map on this site is used under a licence that
            permits commercial use. Creative Commons assets are credited below
            as their licences require.
          </p>
        </Container>
      </section>

      <Section tone="paper" edge>
        <Container size="narrow">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-left">
              <caption className="sr-only">
                Photography and cartography credits with source and licence
              </caption>
              <thead>
                <tr className="border-b border-line">
                  <th
                    scope="col"
                    className="py-3 pr-4 text-[0.74rem] font-semibold uppercase tracking-wider text-faint"
                  >
                    Asset
                  </th>
                  <th
                    scope="col"
                    className="py-3 pr-4 text-[0.74rem] font-semibold uppercase tracking-wider text-faint"
                  >
                    Author
                  </th>
                  <th
                    scope="col"
                    className="py-3 pr-4 text-[0.74rem] font-semibold uppercase tracking-wider text-faint"
                  >
                    Source
                  </th>
                  <th
                    scope="col"
                    className="py-3 text-[0.74rem] font-semibold uppercase tracking-wider text-faint"
                  >
                    Licence
                  </th>
                </tr>
              </thead>
              <tbody>
                {entries.map((e) => (
                  <tr key={e.key} className="border-b border-line">
                    <td className="py-3 pr-4 align-top font-mono text-[0.78rem] text-fg">
                      {e.key}
                    </td>
                    <td className="py-3 pr-4 align-top text-[0.83rem] text-muted">
                      {e.artist?.split("\n")[0] ?? "—"}
                    </td>
                    <td className="py-3 pr-4 align-top text-[0.83rem]">
                      {e.page ? (
                        <a
                          href={e.page}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent underline underline-offset-2"
                        >
                          {e.source}
                        </a>
                      ) : (
                        <span className="text-muted">{e.source}</span>
                      )}
                    </td>
                    <td className="py-3 align-top text-[0.83rem] text-muted">
                      {e.licence ?? "—"}
                    </td>
                  </tr>
                ))}
                <tr className="border-b border-line">
                  <td className="py-3 pr-4 align-top font-mono text-[0.78rem] text-fg">
                    corridor-map
                  </td>
                  <td className="py-3 pr-4 align-top text-[0.83rem] text-muted">
                    Wikimedia contributors
                  </td>
                  <td className="py-3 pr-4 align-top text-[0.83rem]">
                    <a
                      href="https://commons.wikimedia.org/wiki/File:BlankMap-World-Equirectangular.svg"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent underline underline-offset-2"
                    >
                      Wikimedia Commons
                    </a>
                  </td>
                  <td className="py-3 align-top text-[0.83rem] text-muted">
                    {mapGeo.licence}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mt-8 text-[0.83rem] leading-relaxed text-faint">
            The SnZ Ventures logo and brand marks are the property of SnZ
            Ventures. The corridor map is derived from a public-domain
            equirectangular world map, resampled as a dot matrix.
          </p>
        </Container>
      </Section>
    </>
  );
}
