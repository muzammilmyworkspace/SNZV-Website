import { Container, Button, Arrow } from "@/components/ui/Primitives";
import { primaryNav } from "@/data/navigation";
import Link from "next/link";

export default function NotFound() {
  return (
    <section className="grain relative flex min-h-[76vh] items-center overflow-hidden bg-void pt-[104px] text-paper">
      <div aria-hidden className="graticule mask-radial absolute inset-0 opacity-55" />
      <div
        aria-hidden
        className="bloom-moss pointer-events-none absolute -bottom-32 left-1/3 h-96 w-96 opacity-30"
      />
      <Container className="relative py-16">
        <div className="max-w-2xl">
          <p className="label text-moss-300">404</p>
          <h1 className="d-1 mt-4 text-paper">
            This route doesn&rsquo;t exist.
          </h1>
          <p className="lede mt-4 text-navy-200">
            The page you were looking for has moved or was never here. Here are
            the ones that are.
          </p>

          <nav aria-label="Suggested pages" className="mt-8">
            <ul className="flex flex-wrap gap-2">
              {primaryNav
                .filter((n) => n.href !== "/")
                .map((n) => (
                  <li key={n.href}>
                    <Link
                      href={n.href}
                      className="inline-flex rounded-[var(--radius-sm)] border border-white/15 px-3.5 py-2 text-[0.85rem] text-navy-200 transition-colors hover:border-white/40 hover:text-paper"
                    >
                      {n.label}
                    </Link>
                  </li>
                ))}
            </ul>
          </nav>

          <div className="mt-8">
            <Button href="/" size="lg">
              Back to home
              <Arrow />
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
