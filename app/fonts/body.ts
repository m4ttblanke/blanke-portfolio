import localFont from "next/font/local";

// Body / UI / captions / metadata / long-form reading. One variable file, normal
// style only: italic is deliberately not loaded until a real need appears
// (see docs/ART_DIRECTION.md, "Typography").
export const schibsted = localFont({
  src: "./SchibstedGrotesk-Variable.woff2",
  weight: "400 900",
  style: "normal",
  display: "swap",
  variable: "--font-body-face",
  adjustFontFallback: "Arial",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});
