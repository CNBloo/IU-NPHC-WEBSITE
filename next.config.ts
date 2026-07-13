import type { NextConfig } from "next";

// Content-Security-Policy is intentionally NOT set here. Next.js injects
// inline hydration scripts on every page, so a static script-src (even
// 'self') blocks React from ever hydrating client components — CSP is set
// per-request in src/proxy.ts (Next 16's middleware file) instead, where a
// fresh nonce can be issued
// and threaded through to those inline scripts.
const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      // Sanity-hosted images (org logos, event flyers, hero photos)
      { protocol: "https", hostname: "cdn.sanity.io", pathname: "/images/**" },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
