import { NextResponse, type NextRequest } from "next/server";

/**
 * PORTAL REDIRECTS — this deployment is the marketing site only.
 *
 * Formerly middleware.ts. Next 16 renamed the convention to `proxy` and the
 * old name is deprecated — the rename also means this now defaults to the
 * Node.js runtime rather than Edge.
 *
 * ---------------------------------------------------------------------------
 * WHAT USED TO BE HERE
 *
 * A session-cookie check that redirected unauthenticated visitors away from
 * /portal, plus a PORTAL_ONLY mode that let this same codebase serve the
 * portal on its own origin. Both are gone: the portal moved to its own
 * repository and its own host, so there is nothing here to guard.
 *
 * ---------------------------------------------------------------------------
 * WHY REDIRECT RATHER THAN 404
 *
 * These paths were live on this domain for months. They are in browser
 * bookmarks, in password managers, and — the case that actually matters — in
 * password-reset and email-verification links already sitting in people's
 * inboxes, which were generated while the portal still lived here.
 *
 * Letting those 404 would lock people out of an account with no explanation
 * and no way forward. Forwarding the FULL path and query string means an old
 * reset link still lands on the reset form, token intact, on the host that can
 * now actually complete it.
 *
 * `NEXT_PUBLIC_PORTAL_URL` is the same variable `lib/portal-url.ts` uses to
 * re-point every portal CTA on the site, so the two cannot disagree about
 * where the portal is. If it is unset these paths simply 404, which is the
 * honest failure: better a missing page than a redirect to a host nobody has
 * told us about.
 */

const PORTAL_ORIGIN = process.env.NEXT_PUBLIC_PORTAL_URL?.trim().replace(/\/+$/, "");

/** Paths that belonged to the portal while it lived on this domain. */
const MOVED = [
  "/portal",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];

export function proxy(request: NextRequest) {
  if (!PORTAL_ORIGIN) return NextResponse.next();

  const { pathname, search } = request.nextUrl;
  const moved = MOVED.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  if (moved) {
    /*
      308, not 307 or 302. This is permanent — the portal is not coming back to
      this domain — and 308 preserves the method, so a client that had queued a
      POST to an old auth endpoint is not silently downgraded to a GET.
    */
    return NextResponse.redirect(`${PORTAL_ORIGIN}${pathname}${search}`, 308);
  }

  return NextResponse.next();
}

/**
 * Only the moved prefixes are matched. Everything else on this site is a
 * static marketing page that should not pay for a middleware hop at all.
 */
export const config = {
  matcher: [
    "/portal/:path*",
    "/login/:path*",
    "/register/:path*",
    "/forgot-password/:path*",
    "/reset-password/:path*",
    "/verify-email/:path*",
    "/portal",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/verify-email",
  ],
};
