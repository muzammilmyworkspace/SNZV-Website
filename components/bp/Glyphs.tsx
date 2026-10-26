/**
 * The small drawn marks the Boarding Pass system repeats: the aircraft, the
 * paper plane, the arrow. Defined once so every plane on the site is the same
 * plane. All point RIGHT (0°), so a parent can rotate them to a path tangent.
 */

export function PlaneGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M22.5 12c0-.8-.7-1.4-1.6-1.4h-5.4L10.3 2.3a.8.8 0 00-.7-.4H8.2c-.4 0-.6.4-.5.7l2.6 8H5.1L3.4 8.2a.6.6 0 00-.5-.3H1.8c-.3 0-.5.3-.4.6L2.6 12l-1.2 3.5c-.1.3.1.6.4.6h1.1c.2 0 .4-.1.5-.3l1.7-2.4h5.2l-2.6 8c-.1.3.1.7.5.7h1.4c.3 0 .5-.2.7-.4l5.2-8.3h5.4c.9 0 1.6-.6 1.6-1.4z" />
    </svg>
  );
}

export function PaperPlaneGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden className={className}>
      <path d="M2 22.5L46 4 34 44 22.5 29.5z" fill="var(--color-ticket)" />
      <path d="M22.5 29.5L46 4 17 33z" fill="#D9D3C4" />
      <path d="M17 33l5.5-3.5L46 4" fill="none" stroke="#B9B2A2" strokeWidth="0.8" />
    </svg>
  );
}

export function Arrow({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className={`bp-arrow ${className}`}>
      <path d="M2 8h11M9 3.5L13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
