import type { RankDemoShape } from "@/lib/work/rank-demo";

// Four abstract, unlabeled shapes -- the rank demo's rankable objects. Plain
// geometry only (no fake items, no Rankle data): the same stroke-based,
// currentColor SVG convention as components/design/marks.tsx. Always
// aria-hidden by the caller; the shape's real name is the visible text next
// to it (RankSlip in rankle-rank-interaction.tsx), never encoded only here.

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function RankGlyph({ shape }: { shape: RankDemoShape }) {
  switch (shape) {
    case "circle":
      return (
        <svg viewBox="0 0 24 24" focusable="false">
          <circle {...stroke} cx="12" cy="12" r="9" />
        </svg>
      );
    case "square":
      return (
        <svg viewBox="0 0 24 24" focusable="false">
          <rect {...stroke} x="4" y="4" width="16" height="16" />
        </svg>
      );
    case "triangle":
      return (
        <svg viewBox="0 0 24 24" focusable="false">
          <path {...stroke} d="M 12 3 L 21 20 L 3 20 Z" />
        </svg>
      );
    case "diamond":
      return (
        <svg viewBox="0 0 24 24" focusable="false">
          <path {...stroke} d="M 12 3 L 21 12 L 12 21 L 3 12 Z" />
        </svg>
      );
  }
}
