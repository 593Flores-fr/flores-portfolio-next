import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0e0c0a",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "72px 80px 80px",
          position: "relative",
        }}
      >
        {/* Top separator */}
        <div
          style={{
            position: "absolute",
            top: "72px",
            left: "80px",
            right: "80px",
            height: "1px",
            background: "rgba(255,255,255,0.08)",
            display: "flex",
          }}
        />
        {/* Accent line */}
        <div
          style={{
            position: "absolute",
            top: "72px",
            right: "80px",
            width: "80px",
            height: "1px",
            background: "#5c5cf5",
            display: "flex",
          }}
        />

        {/* Label */}
        <div
          style={{
            fontFamily: "sans-serif",
            fontSize: "13px",
            letterSpacing: "5px",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.30)",
            marginBottom: "22px",
            display: "flex",
          }}
        >
          Graphiste &amp; Développeur Web
        </div>

        {/* Main name */}
        <div
          style={{
            fontFamily: "sans-serif",
            fontSize: "148px",
            fontWeight: 700,
            lineHeight: 0.85,
            letterSpacing: "16px",
            textTransform: "uppercase",
            color: "white",
            marginBottom: "36px",
            display: "flex",
          }}
        >
          FLORES
        </div>

        {/* Tagline */}
        <div
          style={{
            fontFamily: "sans-serif",
            fontSize: "17px",
            color: "rgba(255,255,255,0.38)",
            letterSpacing: "1px",
            display: "flex",
          }}
        >
          Identité visuelle · Direction artistique · Développement web
        </div>

        {/* Bottom right — domain */}
        <div
          style={{
            position: "absolute",
            bottom: "80px",
            right: "80px",
            fontFamily: "sans-serif",
            fontSize: "13px",
            letterSpacing: "3px",
            color: "rgba(255,255,255,0.22)",
            display: "flex",
          }}
        >
          flores.fr
        </div>
      </div>
    ),
    { ...size }
  );
}
