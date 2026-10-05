"use client";

import { useEffect } from "react";
import { attribution, captureFirstTouch } from "@/lib/attribution";

/**
 * Renders nothing. Keeps the visit's first touch (see lib/attribution) and
 * reports every press of a WhatsApp link to /api/whatsapp-click, so the portal
 * can count the chats that never went through the form.
 *
 * One listener on the document rather than a handler on each link: there are
 * WhatsApp links in the header, footer, floating button, contact page and in
 * page copy, and any added later is counted without anybody remembering to.
 *
 * Placement comes from `data-wa` on the link or an ancestor, else from where
 * the link sits. `data-enquiry-id` ties the post-form "Send on WhatsApp" to
 * the enquiry it repeats.
 */
export function AttributionTracker() {
  useEffect(() => {
    captureFirstTouch();

    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || !/wa\.me|api\.whatsapp\.com|whatsapp:\/\//i.test(a.href)) return;
      const tagged = a.closest("[data-wa]") as HTMLElement | null;
      const placement =
        tagged?.dataset.wa ??
        (a.closest("footer") ? "footer" : a.closest("header") ? "header" : "page");
      const body = JSON.stringify({
        placement,
        enquiryId: a.dataset.enquiryId ?? null,
        ...attribution(),
      });
      try {
        const blob = new Blob([body], { type: "application/json" });
        if (!navigator.sendBeacon?.("/api/whatsapp-click", blob)) {
          void fetch("/api/whatsapp-click", { method: "POST", body, keepalive: true, headers: { "Content-Type": "application/json" } });
        }
      } catch {}
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);
  return null;
}
