import { ImageResponse } from "next/og";

export const alt = "IU National Pan-Hellenic Council";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Sitewide social-share card: council name on IU crimson. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#990000",
          color: "#eeedeb",
          padding: 80,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.15 }}>
          IU National Pan-Hellenic Council
        </div>
        <div style={{ fontSize: 34, marginTop: 32, opacity: 0.9 }}>
          The Divine Nine at Indiana University Bloomington
        </div>
        <div
          style={{
            marginTop: 48,
            width: 220,
            height: 8,
            backgroundColor: "#b9975b",
            borderRadius: 4,
          }}
        />
      </div>
    ),
    { ...size },
  );
}
