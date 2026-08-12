import { Container, Button, Arrow } from "@/components/ui/Primitives";
import { primaryNav } from "@/data/navigation";
import Link from "next/link";

export default function NotFound() {
  return (
    <section className="grain relative flex min-h-[76vh] items-center overflow-hidden bg-surface pt-36 text-fg">
      <div aria-hidden className="graticule mask-radial absolute inset-0 opacity-55" />
      <div
        aria-hidden
        className="bloom-moss pointer-events-none absolute -bottom-32 left-1/3 h-96 w-96 opacity-30"
      />
      <Container className="relative py-16">
        <div className="max-w-2xl">
          <p className="label text-accent">404</p>
          <h1 className="d-1 mt-4 text-fg">
            This route doesn&rsquo;t exist.
          </h1>
          <p className="lede mt-4 text-muted">
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
                      className="inline-flex rounded-[var(--radius-sm)] border border-line px-3.5 py-2 text-[0.85rem] text-muted transition-colors hover:border-line hover:text-fg"
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
