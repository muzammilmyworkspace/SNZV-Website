"use client";

import { useEffect, useRef, useState } from "react";

/**
 * THE GOOGLE REVIEWS WIDGET (Elfsight).
 *
 * The script is fetched only when the section comes within a screen of the
 * viewport, so the homepage's first load does not pay for a third-party bundle
 * most visitors never scroll to. On the free plan every load counts against a
 * monthly view allowance, which is a second reason not to load it eagerly.
 *
 * Elfsight fills the div itself after React has rendered it; React never
 * re-renders its contents, so the two do not fight.
 */
const SRC = "https://elfsightcdn.com/platform.js";

export function ElfsightReviews({ appId }: { appId: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "800px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!near || document.querySelector(`script[src="${SRC}"]`)) return;
    const s = document.createElement("script");
    s.src = SRC;
    s.async = true;
    document.body.appendChild(s);
  }, [near]);

  return (
    <div ref={ref} className="min-h-[200px]">
      {near && <div className={`elfsight-app-${appId}`} data-elfsight-app-lazy />}
    </div>
  );
}
