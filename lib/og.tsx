import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const ogSize = { width: 1200, height: 630 };

/** System fonts only: no network, no extra bytes. */
export function renderOg() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#0f0f0d",
          color: "#f3f0e8",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", gap: 12 }}>
          {["#ff6b4a", "#c8f169", "#c3b2ff", "#8ecbff", "#ffd75e"].map((c) => (
            <div key={c} style={{ width: 28, height: 28, borderRadius: 14, background: c }} />
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 96, fontWeight: 800, letterSpacing: -4, lineHeight: 1 }}>
            {site.name}
          </div>
          <div style={{ fontSize: 60, fontWeight: 700, letterSpacing: -2, color: "#c8f169", marginTop: 12 }}>
            Software Engineer · Full Stack · AI
          </div>
          <div style={{ marginTop: 28, fontSize: 30, color: "#a5a296" }}>
            React · Next.js · TypeScript · Node.js · PostgreSQL
          </div>
        </div>
      </div>
    ),
    ogSize,
  );
}
