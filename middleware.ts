import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth/constants";

/**
 * Route protection.
 *
 * Middleware runs on the Edge runtime, which has no node:crypto — so it only
 * checks for the PRESENCE of a session cookie and redirects unauthenticated
 * visitors early. It is a UX guard, not the security boundary.
 *
 * The real check is signature verification in `getSession()`, which every
 * portal page and API route performs on the Node runtime. Never rely on this
 * file alone for authorisation.
 */
export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const hasCookie = Boolean(request.cookies.get(SESSION_COOKIE)?.value);

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
  if (
    hasCookie &&
    ["/login", "/register", "/forgot-password"].includes(pathname)
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/portal";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/portal/:path*", "/login", "/register", "/forgot-password"],
};
