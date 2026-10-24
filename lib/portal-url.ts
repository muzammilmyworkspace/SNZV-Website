/**
 * Where the client portal's sign-in lives. Set NEXT_PUBLIC_PORTAL_URL to an
 * origin only (e.g. https://portal.snzventures.com); the default is that
 * address, so the Login button works even if the variable is missing.
 */
const base = (process.env.NEXT_PUBLIC_PORTAL_URL || "https://portal.snzventures.com").replace(/\/+$/, "");

export const portalLoginUrl = `${base}/login`;
