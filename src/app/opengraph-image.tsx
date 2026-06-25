import { ImageResponse } from "next/og";

export const alt = "ResuMatch AI — Optimize Your Resume for ATS";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Inter, sans-serif",
          padding: "60px",
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              background: "white",
              borderRadius: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
              fontWeight: 800,
              color: "#4f46e5",
            }}
          >
            R
          </div>
          <span
            style={{
              fontSize: "40px",
              fontWeight: 800,
              color: "white",
              letterSpacing: "-1px",
            }}
          >
            ResuMatch AI
          </span>
        </div>

        {/* Headline */}
        <h1
          style={{
            fontSize: "64px",
            fontWeight: 900,
            color: "white",
            textAlign: "center",
            lineHeight: 1.15,
            margin: "0 0 20px 0",
            letterSpacing: "-2px",
          }}
        >
          Land Your Dream Job
        </h1>

        {/* Subheadline */}
        <p
          style={{
            fontSize: "28px",
            color: "rgba(255,255,255,0.85)",
            textAlign: "center",
            maxWidth: "700px",
            margin: 0,
            lineHeight: 1.4,
          }}
        >
          AI-powered resume optimization & cover letter generation
        </p>

        {/* Score indicator */}
        <div
          style={{
            display: "flex",
            gap: "32px",
            marginTop: "40px",
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.15)",
              borderRadius: "16px",
              padding: "16px 32px",
              fontSize: "24px",
              fontWeight: 700,
              color: "white",
            }}
          >
            ATS Score Analysis
          </div>
          <div
            style={{
              background: "rgba(255,255,255,0.15)",
              borderRadius: "16px",
              padding: "16px 32px",
              fontSize: "24px",
              fontWeight: 700,
              color: "white",
            }}
          >
            Keyword Matching
          </div>
          <div
            style={{
              background: "rgba(255,255,255,0.15)",
              borderRadius: "16px",
              padding: "16px 32px",
              fontSize: "24px",
              fontWeight: 700,
              color: "white",
            }}
          >
            AI Cover Letters
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}