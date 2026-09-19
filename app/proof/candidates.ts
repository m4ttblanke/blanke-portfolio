import localFont from "next/font/local";

// The losing display candidate, kept only so the proof sheet (/proof) can show
// the comparison. Only this route loads it. The winner, Big Shoulders Display,
// is app/fonts/display.ts and is reused by the sheet (no second download).

export const anybody = localFont({
  src: "../fonts/Anybody-Variable.woff2",
  weight: "100 900",
  style: "normal",
  display: "swap",
  variable: "--font-display-anybody",
  adjustFontFallback: "Arial",
  declarations: [{ prop: "font-stretch", value: "50% 150%" }],
});
