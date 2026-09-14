import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { site } from "@/src/config/constants";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// metadataBase lets every route use relative URLs for canonical/OG fields,
// and app/opengraph-image.tsx is picked up automatically as the preview card.
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — free typing test`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  keywords: [
    "typing test",
    "typing game",
    "wpm test",
    "words per minute",
    "typing speed",
    "typing practice",
    "free typing test",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — free typing test`,
    description: site.description,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — free typing test`,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

// Search engines and link previews can read this even though the pages
// themselves are client components.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: site.name,
  url: site.url,
  description: site.description,
  applicationCategory: "GameApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires a desktop browser and a physical keyboard",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased w-full flex flex-col min-h-screen justify-center items-center`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
