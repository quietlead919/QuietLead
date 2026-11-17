import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "./globals.css";
import { CookieNotice } from "@/components/CookieNotice";
import { SoundLayer } from "@/components/SoundLayer";
import { INDEXABLE, SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: { canonical: "/" },
  robots: INDEXABLE ? { index: true, follow: true } : { index: false, follow: false },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
    url: "/",
    title: SITE_TITLE,
    description:
      "AI that finds, qualifies and drafts personal outreach to your next customers. You approve every message.",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description:
      "AI that finds, qualifies and drafts personal outreach to your next customers. You approve every message.",
  },
  // Optional: Google Search Console HTML-tag verification (DNS verification needs no code).
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } }
    : {}),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full overflow-x-hidden">
        <ClerkProvider
          telemetry={false}
          appearance={{
            options: {
              // Hides the orange "Development mode" strip (only shown while on Clerk's dev instance).
              unsafe_disableDevelopmentModeWarnings: true,
              // Our own entrance animation runs on the glass card (see .ql-cardbox in globals.css).
              animations: false,
            },
            variables: {
              colorPrimary: "#ffffff",
              colorPrimaryForeground: "#000000",
              colorForeground: "#f5f5f7",
              colorMutedForeground: "#a1a1a6",
              colorBackground: "#1c1c1e",
              colorNeutral: "#ffffff",
              colorInput: "#2c2c2e",
              colorInputForeground: "#ffffff",
              fontFamily:
                "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Inter Variable', 'Helvetica Neue', Arial, sans-serif",
              fontSize: "15px",
              borderRadius: "14px",
            },
            elements: {
              modalBackdrop: "ql-backdrop",
              modalContent: "ql-modal",
              cardBox: "ql-cardbox",
              card: "ql-card",
              headerTitle: "ql-title",
              headerSubtitle: "ql-subtitle",
              formFieldLabel: "ql-label",
              formFieldInput: "ql-input",
              formButtonPrimary: "ql-button",
              spinner: "ql-spinner",
              footer: "ql-footer",
              footerAction: "ql-footer-action",
              footerActionLink: "ql-footer-link",
            },
          }}
        >
          <a
            href="#top"
            className="sr-only z-[60] rounded-lg bg-white px-4 py-2 font-semibold text-brand focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
          >
            Skip to content
          </a>
          {/* SVG lens for the liquid-glass waitlist card (used via backdrop-filter in Chromium). */}
          <svg aria-hidden="true" width="0" height="0" style={{ position: "absolute" }}>
            <filter id="ql-glass" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
              <feTurbulence type="fractalNoise" baseFrequency="0.008 0.012" numOctaves="2" seed="4" result="noise" />
              <feGaussianBlur in="noise" stdDeviation="2" result="soft" />
              <feDisplacementMap in="SourceGraphic" in2="soft" scale="38" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </svg>
          {children}
          <CookieNotice />
          <SoundLayer />
        </ClerkProvider>
      </body>
    </html>
  );
}
