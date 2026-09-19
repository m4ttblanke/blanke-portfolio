// TEMPORARY marker graphics for evaluating the annotation layer. They are plain
// SVG strokes, not handwriting, and they are decorative: aria-hidden, never the
// only place a fact appears. Final marks will be scans of Matthew's own hand.
//
// Each mark is drawn in a 200 x 100 box and scales to its container. Color is
// currentColor, set by .annotation from --accent-graphic.

type MarkProps = { className?: string };

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 4,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  vectorEffect: "non-scaling-stroke",
} as const;

export function MarkCircle({ className }: MarkProps) {
  return (
    <svg className={className} viewBox="0 0 200 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path {...stroke} d="M 34 58 C 26 22, 84 8, 132 12 C 182 17, 197 44, 184 68 C 171 92, 118 96, 72 91 C 30 86, 8 64, 24 38 C 34 22, 64 12, 98 9" />
    </svg>
  );
}

export function MarkUnderline({ className }: MarkProps) {
  return (
    <svg className={className} viewBox="0 0 200 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path {...stroke} d="M 4 30 C 58 22, 122 38, 196 26 M 20 66 C 80 58, 132 72, 184 60" />
    </svg>
  );
}

export function MarkArrow({ className }: MarkProps) {
  return (
    <svg className={className} viewBox="0 0 200 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path {...stroke} d="M 6 84 C 34 30, 92 14, 168 30 M 140 8 L 172 32 L 138 52" />
    </svg>
  );
}

export function MarkX({ className }: MarkProps) {
  return (
    <svg className={className} viewBox="0 0 200 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path {...stroke} d="M 20 8 L 178 92 M 172 10 L 26 90" />
    </svg>
  );
}
