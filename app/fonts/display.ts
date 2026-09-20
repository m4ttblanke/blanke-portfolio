import localFont from "next/font/local";

// Display face: Big Shoulders Display, chosen over Anybody from rendered
// specimens (see docs/ART_DIRECTION.md, "Typography", and /proof on a preview).
// Used only for large uppercase headlines, mastheads and section titles.
//
// preload is off on purpose: no public page sets display type yet, so preloading
// would spend bytes for nothing. The face still loads the moment text uses it.
// Turn preload on when the cover lands (M3), because the masthead will be on
// screen at first paint.
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
