import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import "@fontsource/open-sauce-one/400.css";
import "@fontsource/open-sauce-one/500.css";
import "@fontsource/open-sauce-one/600.css";
import "@fontsource/open-sauce-one/700.css";
import "@fontsource/open-sauce-one/500-italic.css";
import "./globals.css";
import { CookieNotice } from "@/components/CookieNotice";

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
            variables: {
              colorPrimary: "#004CAD",
              fontFamily: "'Open Sauce One', system-ui, sans-serif",
              borderRadius: "0.9rem",
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
        </ClerkProvider>
      </body>
    </html>
  );
}
