import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

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
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full overflow-x-hidden">{children}</body>
    </html>
  );
}
