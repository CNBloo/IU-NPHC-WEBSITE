import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Sanity serves uploaded images from this CDN host; every other
// image/connect source is restricted to same-origin.
const SANITY_CDN = "https://cdn.sanity.io";

export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  // React dev mode (Fast Refresh) and webpack's dev source maps call
  // eval(), which production React/webpack never does — so 'unsafe-eval'
  // is scoped to development only and never reaches the deployed site.
  const scriptSrc = [
    `'self'`,
    `'nonce-${nonce}'`,
    `'strict-dynamic'`,
    process.env.NODE_ENV === "development" ? `'unsafe-eval'` : "",
  ]
    .filter(Boolean)
    .join(" ");

  // 'strict-dynamic' tells modern browsers to trust only nonce'd scripts
  // (and scripts those scripts load) — the 'self' fallback below is for
  // older browsers that don't understand strict-dynamic yet.
  const csp = [
    `default-src 'self'`,
    `script-src ${scriptSrc}`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' ${SANITY_CDN} data:`,
    `font-src 'self'`,
    `connect-src 'self' https://*.api.sanity.io`,
    `object-src 'none'`,
    `frame-ancestors 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
  ].join("; ");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });
  response.headers.set("Content-Security-Policy", csp);

  return response;
}

export const config = {
  matcher: [
    // Skip static assets and image optimization files — they don't need
    // a per-request nonce and skipping them keeps middleware overhead down.
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
