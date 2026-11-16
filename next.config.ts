import type { NextConfig } from "next";
import { SITE_URL } from "./lib/site";

const isDev = process.env.NODE_ENV !== "production";

// Content-Security-Policy.
// - Next.js inlines small bootstrap scripts, so script-src needs 'unsafe-inline' unless every
//   page is rendered per request with a nonce. The page is static, so we allow inline scripts
//   from our own document only and block every third-party script (and eval in production).
// - form-action includes Stripe because /api/checkout answers the pricing form with a redirect
//   to checkout.stripe.com, and browsers check form redirects against form-action.
// - vercel.live is the Vercel preview toolbar (only injected on preview deployments).
// - Clerk (waitlist modal): its Frontend API is *.clerk.accounts.dev for development keys and
//   clerk.<site domain> for a production instance; Cloudflare Turnstile is its bot check and
//   img.clerk.com serves avatars/logos. Clerk also starts a blob: worker.
const clerkFapi = `https://*.clerk.accounts.dev https://clerk.${new URL(SITE_URL).hostname.replace(/^www\./, "")} https://cdn.protect.clerk.com`;
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://vercel.live ${clerkFapi} https://challenges.cloudflare.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://img.clerk.com",
  "font-src 'self' data:",
  `connect-src 'self'${isDev ? " ws: wss:" : ""} https://vercel.live wss://ws-us3.pusher.com ${clerkFapi} https://*.protect.clerk.com:*`,
  "worker-src 'self' blob:",
  "frame-src https://vercel.live https://challenges.cloudflare.com",
  "frame-ancestors 'none'",
  "form-action 'self' https://checkout.stripe.com",
  "base-uri 'self'",
  "object-src 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
  },
  // Vercel sends "Access-Control-Allow-Origin: *" on static files by default. Nothing here
  // is meant to be read cross-origin, so limit it to our own origin.
  { key: "Access-Control-Allow-Origin", value: SITE_URL },
  { key: "Vary", value: "Origin" },
];

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
