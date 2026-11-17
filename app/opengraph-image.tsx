import { ImageResponse } from "next/og";

// Share/preview image (1200x630) for Google, LinkedIn, X and messengers.
export const alt = "QuietLead · Finding leads without the noise";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#000",
          color: "#fff",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 30, letterSpacing: -0.5 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 11,
              background: "#fff",
              color: "#000",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            QL
          </div>
          QuietLead
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 84, lineHeight: 1.02, letterSpacing: -3, fontWeight: 600, maxWidth: 960 }}>
            Find Your Next Customers Without the Noise
          </div>
          <div style={{ marginTop: 28, fontSize: 30, color: "#a1a1a6", maxWidth: 900 }}>
            AI that finds well-matched leads and drafts personal outreach you approve.
          </div>
        </div>
        <div style={{ display: "flex", gap: 36, fontSize: 22, color: "#86868b", textTransform: "uppercase" }}>
          <span>Up to 50 leads a day</span>
          <span>You approve every message</span>
          <span>Built in Frankfurt</span>
        </div>
      </div>
    ),
    size,
  );
}
