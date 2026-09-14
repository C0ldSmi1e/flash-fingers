import { ImageResponse } from "next/og";
import { site } from "@/src/config/constants";

// Link preview for every page: shared results, the home page, and the
// leaderboard all land people here, so the card sells the game itself.
export const alt = `${site.name} — free typing test`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const sample = "the quick brown fox jumps over the lazy dog";
const typedUpTo = 26;

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#ffffff",
        fontFamily: "monospace",
        gap: 36,
      }}
    >
      <div style={{ fontSize: 96, fontWeight: 700, color: "#6b7280" }}>
        {site.name}
      </div>
      <div style={{ display: "flex", fontSize: 40, letterSpacing: 1 }}>
        <span style={{ color: "#10b981" }}>{sample.slice(0, typedUpTo)}</span>
        <span
          style={{
            color: "#6b7280",
            borderLeft: "4px solid #f59e0b",
            paddingLeft: 2,
          }}
        >
          {sample.slice(typedUpTo)}
        </span>
      </div>
      <div style={{ fontSize: 34, color: "#6b7280", opacity: 0.7 }}>
        {site.tagline}
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 40,
          fontSize: 28,
          color: "#10b981",
        }}
      >
        {site.url.replace("https://", "")}
      </div>
    </div>,
    { ...size },
  );
}
