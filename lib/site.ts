// Public base URL of the site. On Vercel this is the production domain
// (VERCEL_PROJECT_PRODUCTION_URL, set automatically); NEXT_PUBLIC_SITE_URL overrides it
// once a custom domain is connected.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")
).replace(/\/$/, "");
