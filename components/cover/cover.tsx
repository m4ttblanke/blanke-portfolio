import "./cover.css";

// THE COVER (M3A) — the homepage's opening composition, and the first major
// hand-art-directed piece of the site (docs/ART_DIRECTION.md §9, "Tools, not a
// composition system": no seeded or deterministic-chaos utility chose anything
// here). One thing, read three ways: the name, a human subject standing inside
// it, one statement.
//
// Big Shoulders is used here because the name and the statement are exactly
// the "oversized statements" the display instrument exists for
// (ART_DIRECTION.md §4). Everything factual stays Schibsted. Do not propagate
// Big Shoulders into the masthead, footer or ordinary headings because of this
// page — see the same section.
//
// Final asset: a full-body editorial photograph of Matthew (a controlled-
// background cutout, portrait orientation). Until it exists, `.cover-subject`
// holds a deliberately abstract development figure — head, shoulders, torso,
// legs — so the OVERLAP with BLANKE can be judged now. It is not a rendering
// of a person and must not be mistaken for one. Replacing it: swap
// `.cover-figure`'s children in this file for a `next/image`/`<picture>` with
// real alt text; the frame is sized entirely by `.crop.crop-tall` (a fixed 2:3
// frame) plus the grid placement in cover.css, so the layout does not change.
export function Cover() {
  return (
    <section className="cover stage page-grid">
      <h1 className="cover-name" aria-label="Matthew Blanke">
        <div className="cover-name-line cover-name-matthew fit layer-type-back" aria-hidden="true">
          <span className="t-display cv-matthew">Matthew</span>
        </div>
        <div className="cover-name-line cover-name-blanke fit layer-type-back" aria-hidden="true">
          <span className="t-display cv-blanke">Blanke</span>
        </div>
      </h1>

      <div className="cover-subject crop crop-tall layer-subject" aria-hidden="true">
        <svg className="cover-figure" viewBox="0 0 200 300" preserveAspectRatio="xMidYMax meet" focusable="false">
          <circle cx="100" cy="44" r="27" />
          <path d="M 63 98 C 63 83 137 83 137 98 L 148 192 L 52 192 Z" />
          <path d="M 71 192 L 66 292 L 84 292 L 88 198 Z" />
          <path d="M 129 192 L 134 292 L 116 292 L 112 198 Z" />
        </svg>
        <span className="cover-subject-label t-meta t-soft">Portrait — final asset pending</span>
      </div>

      <div className="cover-lower layer-type-front">
        <p className="cover-statement fit">
          <span className="t-display cv-builds">Builds things</span>
          <span className="t-display cv-people">people use.</span>
        </p>

        <div className="cover-meta">
          <p className="t-meta t-soft">Computer Science</p>
          <p className="t-meta t-soft">Software Engineer</p>
          <p className="t-meta t-soft">Issue 001 · 2026</p>
        </div>
      </div>
    </section>
  );
}
