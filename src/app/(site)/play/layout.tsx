import type { Metadata } from "next";
import { site } from "@/src/config/constants";

// The page itself is a client component, so its metadata lives here.
export const metadata: Metadata = {
  title: "Play",
  description: `Take a free typing test. ${site.tagline}`,
  alternates: { canonical: "/play" },
  openGraph: { url: "/play", title: `Play · ${site.name}` },
};

const PlayLayout = ({ children }: { children: React.ReactNode }) => children;

export default PlayLayout;
