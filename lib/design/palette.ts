// Mirror of the palette in app/globals.css (@theme), for the proof sheet only.
// The CSS is the source of truth: tests/design/tokens.test.ts fails if these
// drift from it.
export const PALETTE = {
  paper: "#f4f3ef",
  "paper-shade": "#e7e5dd",
  white: "#ffffff",
  ink: "#10100f",
  "ink-soft": "#5a5954",
  red: "#d42a1e",
  "red-deep": "#a82016",
} as const;

export type PaletteName = keyof typeof PALETTE;

/** The foreground/background pairs the design actually uses. */
export const PAIRS: ReadonlyArray<{ fg: PaletteName; bg: PaletteName; use: string }> = [
  { fg: "ink", bg: "paper", use: "body text on paper" },
  { fg: "ink", bg: "white", use: "body text on hard white" },
  { fg: "ink-soft", bg: "paper", use: "captions, secondary text" },
  { fg: "red", bg: "paper", use: "accent text and links on paper" },
  { fg: "red", bg: "white", use: "accent text on hard white" },
  { fg: "white", bg: "red", use: "text on a red field, buttons" },
  { fg: "paper", bg: "ink", use: "text on an ink field" },
  { fg: "red", bg: "ink", use: "red on ink: marks and large type only" },
  { fg: "ink", bg: "red", use: "ink on red: never for small text" },
];
