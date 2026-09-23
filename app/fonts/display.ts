import localFont from "next/font/local";

// Display face: Big Shoulders Display, chosen over Anybody from rendered
// specimens (see docs/ART_DIRECTION.md, "Typography", and /proof on a preview).
// Used only for large uppercase headlines, mastheads and section titles.
//
// preload stays false, permanently (M3 decision, reviewed again in M3B). This
// module is imported by the root layout to wire `--font-display-face` for
// every route, but the actual bytes are fetched per page, driven by whether
// that page paints any text in the family -- not by the import. Verified: the
// cover (the only page that uses `.t-display`) fetches Big Shoulders; every
// other public page fetches only Schibsted. Setting preload:true here would
// preload it on every route through the root layout, including ones that
// never render it -- exactly what this is avoiding.
export const display = localFont({
  src: "./BigShouldersDisplay-Variable.woff2",
  weight: "100 900",
  style: "normal",
  display: "swap",
  variable: "--font-display-face",
  adjustFontFallback: "Arial",
  fallback: ["Arial Narrow", "ui-sans-serif", "sans-serif"],
  preload: false,
});
