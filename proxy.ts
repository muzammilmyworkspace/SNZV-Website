import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth/constants";

/**
 * Route protection, plus the portal-only serving mode.
 *
 * Formerly middleware.ts. Next 16 renamed the convention to `proxy` and the
 * old name is deprecated — the rename also means this now defaults to the
 * Node.js runtime rather than Edge.
 *
 * That does NOT make it the security boundary, and nothing here should start
 * treating it as one. It only checks for the PRESENCE of a session cookie so
 * an unauthenticated visitor is redirected before a page renders; a cookie's
 * presence says nothing about its signature. The real check is verification in
 * `getSession()`, which every portal page and API route performs. Next's own
 * guidance is that this layer may be hoisted to a CDN, so it must never hold
 * logic the app depends on for authorisation.
 *
 * ---------------------------------------------------------------------------
 * PORTAL_ONLY
 *
 * When the PORTAL_ONLY environment variable is set, this deployment serves the
 * CLIENT PORTAL AND NOTHING ELSE: `/` becomes the sign-in screen, and the
 * marketing pages are not reachable.
 *
 * It exists so the portal can be reviewed and approved on its own origin
 * before launch — `npm run dev:portal` runs exactly this on port 3001 while
 * the public site keeps running on 3000, from the same codebase.
 *
 * The same flag is what the portal subdomain will run with in production, so
 * what gets approved locally is the same code path that ships. This is a
 * ROUTING mode, not a security boundary: every guard still runs underneath it.
 */

const PORTAL_ONLY = process.env.PORTAL_ONLY === "1" || process.env.PORTAL_ONLY === "true";

/** Prefixes that stay reachable when the app is serving the portal only. */
const PORTAL_PATHS = [
  "/portal",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/api",
  // Terms and Privacy are linked from the sign-in footer. Serving a portal
  // whose own legal links 404 would be worse than serving one page too many.
  "/legal",
];

const AUTH_SCREENS = ["/login", "/register", "/forgot-password"];

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const hasCookie = Boolean(request.cookies.get(SESSION_COOKIE)?.value);

  if (PORTAL_ONLY) {
    // The root IS the portal here — signed in goes to the dashboard, everyone
    // else to sign-in. No marketing homepage exists on this origin.
    if (pathname === "/") {
      const url = request.nextUrl.clone();
      url.pathname = hasCookie ? "/portal" : "/login";
      url.search = "";
      return NextResponse.redirect(url);
    }

    const allowed = PORTAL_PATHS.some(
      (p) => pathname === p || pathname.startsWith(`${p}/`)
    );

    if (!allowed) {
      // A marketing URL on the portal origin is a wrong turn, not an error
      // page. Send them to the front door rather than to a 404.
      const url = request.nextUrl.clone();
      url.pathname = "/";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  // Portal requires a session.
  if (pathname.startsWith("/portal")) {
    if (!hasCookie) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.search = `?next=${encodeURIComponent(pathname + search)}`;
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Signed-in users shouldn't land back on the auth screens.
  if (hasCookie && AUTH_SCREENS.includes(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/portal";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

/**
 * Broad matcher, because PORTAL_ONLY has to be able to intercept a marketing
 * URL it does not serve — a matcher listing only portal paths could never see
 * one. Everything static is excluded so no asset pays for the check, and the
 * handler above returns immediately for normal requests when the flag is off.
 */
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|images/|brand/|fonts/|favicon|icon|apple-icon|manifest|robots.txt|sitemap.xml|.*\\.(?:png|jpg|jpeg|webp|avif|svg|ico|woff2?|txt|xml)$).*)",
  ],
};
