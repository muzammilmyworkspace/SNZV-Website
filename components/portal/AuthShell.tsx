import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { company } from "@/data/company";

/**
 * Shared frame for login / register / password screens.
 *
 * Split composition: brand and reassurance on the left, the form on the right.
 * It reads as a continuation of the public site — same palette, same type,
 * same corridor imagery — so signing in doesn't feel like leaving the brand.
 */
export function AuthShell({
  title,
  lead,
  children,
  footer,
}: {
  title: string;
  lead: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="tone-deep grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      {/* Brand panel */}
      <aside className="plate plate-deep relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between lg:p-12">
        <Image
          src="/images/dest-vilnius.webp"
          alt=""
          fill
          priority
          sizes="50vw"
          className="object-cover"
        />
        <div aria-hidden className="graticule pointer-events-none absolute inset-0 z-[2] opacity-50" />
        <div
          aria-hidden
          className="bloom-moss pointer-events-none absolute -bottom-40 left-1/4 z-[2] h-96 w-96 opacity-35"
        />

        <Link href="/" className="relative z-[3] inline-flex items-center gap-3">
          <Image
            src="/brand/snz-mark.png"
            alt=""
            width={40}
            height={40}
            className="no-grade h-10 w-10 rounded-full ring-1 ring-white/15"
          />
          <span className="text-[1.15rem] font-bold tracking-[-0.02em] text-paper">
            SnZ Ventures
          </span>
        </Link>

        <div className="relative z-[3] max-w-md">
          <p className="d-2 text-paper">Your journey, in one place.</p>
          <p className="mt-4 text-[0.95rem] leading-relaxed text-navy-200">
            Documents, applications, appointments and the honest next step —
            tracked by the same people you speak to.
          </p>
          <ul className="mt-8 space-y-3 border-t border-white/15 pt-6">
            {[
              "One place for every document you send us",
              "A visible next action, always",
              "Direct messages with your advisor",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-[0.88rem] text-navy-100">
                <span aria-hidden className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-moss-400" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-[3] text-[0.75rem] text-navy-300">
          {company.contact.city}, {company.contact.country} · 54.6872° N, 25.2797° E
        </p>
      </aside>

      {/* Form panel */}
      <main id="main" className="flex flex-col justify-center px-5 py-12 sm:px-10 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          <Link href="/" className="mb-10 inline-flex items-center gap-3 lg:hidden">
            <Image
              src="/brand/snz-mark.png"
              alt=""
              width={36}
              height={36}
              className="h-9 w-9 rounded-full"
            />
            <span className="text-[1.05rem] font-bold tracking-[-0.02em] text-fg">
              SnZ Ventures
            </span>
          </Link>

          <h1 className="d-2 text-fg-strong">{title}</h1>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">{lead}</p>

          <div className="mt-8">{children}</div>

          {footer && <div className="mt-8 border-t border-line pt-6">{footer}</div>}

          <p className="mt-10 text-[0.75rem] leading-relaxed text-faint">
            By continuing you agree to our{" "}
            <Link href="/legal/terms" className="underline underline-offset-2 hover:text-muted">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/legal/privacy-policy" className="underline underline-offset-2 hover:text-muted">
              Privacy Policy
            </Link>
            . We never share your documents outside your case.
          </p>
        </div>
      </main>
    </div>
  );
}
