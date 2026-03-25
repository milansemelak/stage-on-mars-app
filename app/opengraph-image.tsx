import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Stage on Mars — The Playmaker";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a0a0a",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* Orange glow at top */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: 600,
            height: 4,
            background: "#FF5500",
          }}
        />

        {/* Logo circle with stage icon */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 120,
            height: 120,
            borderRadius: "50%",
            border: "3px solid white",
            marginBottom: 40,
          }}
        >
          {/* Stage/triangle shape */}
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: "30px solid transparent",
              borderRight: "30px solid transparent",
              borderBottom: "50px solid white",
              display: "flex",
            }}
          />
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 900,
            color: "white",
            letterSpacing: "-2px",
            marginBottom: 12,
            display: "flex",
          }}
        >
          The Playmaker
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 28,
            color: "#FF5500",
            display: "flex",
            marginBottom: 40,
          }}
        >
          by Stage on Mars
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 22,
            color: "rgba(255,255,255,0.5)",
            display: "flex",
          }}
        >
          Turn your question into a systemic play
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              fontSize: 18,
              color: "rgba(255,255,255,0.3)",
              display: "flex",
            }}
          >
            playbook.stageonmars.com
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
