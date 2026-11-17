// Public base URL of the site. On Vercel this is the production domain
// (VERCEL_PROJECT_PRODUCTION_URL, set automatically); NEXT_PUBLIC_SITE_URL overrides it
// once a custom domain is connected.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")
).replace(/\/$/, "");

// Only the real production deployment may be indexed; preview/branch deployments get noindex.
export const INDEXABLE = process.env.VERCEL_ENV ? process.env.VERCEL_ENV === "production" : false;

export const SITE_NAME = "QuietLead";
export const SITE_TITLE = "QuietLead · Finding leads without the noise";
export const SITE_DESCRIPTION =
  "QuietLead is an AI tool for B2B lead generation. It finds the right prospects, spots buying signals and drafts personal outreach you approve. Quietly.";
