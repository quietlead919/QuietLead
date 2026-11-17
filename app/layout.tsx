import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "./globals.css";
import { CookieNotice } from "@/components/CookieNotice";
import { SoundLayer } from "@/components/SoundLayer";

export const metadata: Metadata = {
  title: "QuietLead · Finding leads without the noise",
  description:
    "QuietLead is an AI tool for B2B lead generation. It finds the right prospects, spots buying signals and drafts personal outreach you approve. Quietly.",
  openGraph: {
    title: "QuietLead · Finding leads without the noise",
    description:
      "AI that finds, qualifies and drafts personal outreach to your next customers. You approve every message.",
    images: ["/brand/quietlead-icon.png"],
  },
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
            },
            variables: {
              colorPrimary: "#1d1d1f",
              colorForeground: "#1d1d1f",
              colorMutedForeground: "#6e6e73",
              colorBackground: "#ffffff",
              colorInput: "#f5f5f7",
              colorInputForeground: "#1d1d1f",
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
          {children}
          <CookieNotice />
          <SoundLayer />
        </ClerkProvider>
      </body>
    </html>
  );
}
