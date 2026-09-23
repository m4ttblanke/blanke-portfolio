import { PLANNR } from "@/lib/work/projects";

// PLANNR — M4A entry poster only. "Ordered, academic, structured" (M4A brief
// §10 / ART_DIRECTION.md §16): Plannr's own real product palette (navy/gold/
// paper/wave-blue), a plain calendar-grid graphic standing in for the real
// product screenshot until one is available. Deliberately un-rotated and
// orthogonal -- the contrast with Rankle's tilt IS the point (loud vs.
// ordered). Deep Plannr art direction (real screenshots, syllabus/calendar
// interaction) is M6; this is the cover, not the article.
//
// M4B added project-specific hover/focus (selected-work.css, "interaction"):
// a small lift, a marginally deeper contact shadow, and .pl-cell-marked-alt
// below -- a second, always-present but resting-invisible highlighted cell
// that crossfades in on hover/focus while .pl-cell-marked crossfades out, so
// "the schedule changed." Both cells stay inside .pl-grid's own
// aria-hidden="true": decorative either way, never the only place any
// information exists.
export function PlannrWorkPoster() {
  return (
    // Plain anchor on purpose: /plannr/* is a next.config.ts rewrite to the
    // real, external product site (github.io), not a Next.js page route --
    // the same pattern the colophon's "Sign in" link uses for /admin.
    <a
      href={PLANNR.href}
      aria-label={PLANNR.accessibleName}
      className="work-poster wall-plannr"
    >
      <span className="pl-grid ornament" aria-hidden="true">
        {Array.from({ length: 28 }, (_, i) => (
          <span key={i} className="pl-cell" />
        ))}
        <span className="pl-cell pl-cell-marked" />
        <span className="pl-cell pl-cell-marked-alt" />
      </span>

      <span className="work-poster-body">
        <h3 className="t-display pl-title">
          <span>{PLANNR.name}</span>
        </h3>
        <p className="t-meta pl-meta">{PLANNR.meta}</p>
        <p className="t-small pl-descriptor">{PLANNR.descriptor}</p>
      </span>
    </a>
  );
}
