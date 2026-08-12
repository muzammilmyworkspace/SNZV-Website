import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Brand lockup: the authentic circular SnZ mark plus a typographic wordmark.
 * The mark is cropped to the "SnZ" lettering only — the logo's small
 * letterspaced "VENTURES" turns to mush below ~64px, so the wordmark carries
 * it at header sizes instead.
 */
export function Logo({
  tone = "light",
  className,
  href = "/",
  showWordmark = true,
  size = 38,
}: {
  tone?: "light" | "dark";
  className?: string;
  href?: string | null;
  showWordmark?: boolean;
  size?: number;
}) {
  const inner = (
    <span className={cn("group flex items-center gap-2.5", className)}>
      <Image
        src="/brand/snz-mark.png"
        alt=""
        width={size}
        height={size}
        priority
        className="shrink-0 rounded-full transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
        style={{ width: size, height: size }}
      />
      {showWordmark && (
        <span className="flex flex-col leading-none">
          <span
            className={cn(
              "font-display text-[1.15rem] tracking-[-0.02em] whitespace-nowrap",
              tone === "dark" ? "text-white" : "text-navy-700"
            )}
          >
            SnZ Ventures
          </span>
          {/* Hidden on the narrowest screens, where it wraps and crowds the bar. */}
          <span
            className={cn(
              "mt-[3px] hidden text-[0.56rem] font-medium uppercase tracking-[0.2em] whitespace-nowrap xs:block",
              tone === "dark" ? "text-faint" : "text-mist-500"
            )}
          >
            Vilnius · Lithuania
          </span>
        </span>
      )}
    </span>
  );

  if (!href) return inner;

  return (
    <Link href={href} aria-label="SnZ Ventures — home" className="inline-flex">
      {inner}
    </Link>
  );
}
