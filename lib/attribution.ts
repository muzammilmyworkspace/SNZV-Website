/**
 * WHERE A VISITOR CAME FROM.
 *
 * Shared by the browser (which captures it) and the server (which re-derives
 * `source` rather than trusting the one the browser sent). No secrets, no
 * server-only imports.
 *
 * First touch is kept for the visit in sessionStorage: the page somebody
 * landed on and the referrer and UTM tags they arrived with. A form filled
 * three pages later still says "came from the Facebook ad", which is the
 * question staff ask. Nothing outlives the tab and nothing identifies a
 * person, so it carries none of the weight of a tracking cookie.
 */

export type Attribution = {
  page: string;
  landing: string | null;
  referrer: string | null;
  utm: Record<string, string>;
  /** Present when the URL carried a click id; says which ad network. */
  clickId: "gclid" | "fbclid" | "ttclid" | "msclkid" | null;
};

export const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

const KEY = "snz-first-touch";
const OWN_HOSTS = /(^|\.)snzventures\.com$|^localhost$|^127\.0\.0\.1$/;

/** Called once per page load. Keeps the FIRST touch of the visit. */
export function captureFirstTouch(): void {
  try {
    if (sessionStorage.getItem(KEY)) return;
    const url = new URL(window.location.href);
    const utm: Record<string, string> = {};
    for (const k of UTM_KEYS) {
      const v = url.searchParams.get(k);
      if (v) utm[k] = v.slice(0, 120);
    }
    const clickId = (["gclid", "fbclid", "ttclid", "msclkid"] as const).find((k) => url.searchParams.has(k)) ?? null;
    let referrer: string | null = null;
    if (document.referrer) {
      try {
        const host = new URL(document.referrer).hostname;
        if (!OWN_HOSTS.test(host)) referrer = host;
      } catch {}
    }
    sessionStorage.setItem(KEY, JSON.stringify({ landing: url.pathname, referrer, utm, clickId }));
  } catch {}
}

/** What a form or a WhatsApp click sends with it. */
export function attribution(): Attribution {
  let first: Partial<Attribution> = {};
  try {
    first = JSON.parse(sessionStorage.getItem(KEY) ?? "{}");
  } catch {}
  return {
    page: typeof window === "undefined" ? "" : window.location.pathname,
    landing: first.landing ?? null,
    referrer: first.referrer ?? null,
    utm: first.utm ?? {},
    clickId: first.clickId ?? null,
  };
}

/**
 * One word for the channel: google, facebook, instagram, whatsapp, tiktok,
 * linkedin, youtube, x, bing, email, direct, or other.
 * UTM wins over the referrer, because a tagged link says what it is on purpose.
 */
export function sourceOf(a: { utm?: Record<string, string>; referrer?: string | null; clickId?: string | null }): string {
  const tag = (a.utm?.utm_source ?? "").toLowerCase();
  const fromTag = matchChannel(tag);
  if (fromTag) return fromTag;
  if (tag) return "other";
  if (a.clickId === "gclid") return "google";
  if (a.clickId === "fbclid") return "facebook";
  if (a.clickId === "ttclid") return "tiktok";
  if (a.clickId === "msclkid") return "bing";
  const host = (a.referrer ?? "").toLowerCase();
  if (!host) return "direct";
  return matchChannel(host) ?? "other";
}

function matchChannel(s: string): string | null {
  if (!s) return null;
  if (/instagram|(^|\W)ig($|\W)/.test(s)) return "instagram";
  if (/facebook|fb\.|(^|\W)fb($|\W)|(^|\W)meta($|\W)/.test(s)) return "facebook";
  if (/whatsapp|wa\.me|(^|\W)wa($|\W)/.test(s)) return "whatsapp";
  if (/google/.test(s)) return "google";
  if (/bing/.test(s)) return "bing";
  if (/tiktok/.test(s)) return "tiktok";
  if (/linkedin|lnkd/.test(s)) return "linkedin";
  if (/youtube|youtu\.be/.test(s)) return "youtube";
  if (/(^|\.)t\.co$|twitter|(^|\.)x\.com$/.test(s)) return "x";
  if (/mail|newsletter/.test(s)) return "email";
  return null;
}

/** Server side: accept only the shape above, trimmed and bounded. */
export function cleanAttribution(raw: unknown): Attribution & { source: string } | null {
  if (typeof raw !== "object" || raw === null) return null;
  const r = raw as Record<string, unknown>;
  const str = (v: unknown, n: number) => (typeof v === "string" && v ? v.slice(0, n) : null);
  const utm: Record<string, string> = {};
  if (r.utm && typeof r.utm === "object") {
    for (const k of UTM_KEYS) {
      const v = str((r.utm as Record<string, unknown>)[k], 120);
      if (v) utm[k] = v;
    }
  }
  const clickId = (["gclid", "fbclid", "ttclid", "msclkid"] as const).find((k) => r.clickId === k) ?? null;
  const out = {
    page: str(r.page, 200) ?? "",
    landing: str(r.landing, 200),
    referrer: str(r.referrer, 200),
    utm,
    clickId,
  };
  return { ...out, source: sourceOf(out) };
}
