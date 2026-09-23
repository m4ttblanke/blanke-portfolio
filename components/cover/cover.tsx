import "./cover.css";

// THE COVER (M3A) — the homepage's opening composition, and the first major
// hand-art-directed piece of the site (docs/ART_DIRECTION.md §9, "Tools, not a
// composition system": no seeded or deterministic-chaos utility chose anything
// here). Three things only: the name, a human subject, one statement.
//
// Big Shoulders is used here because the name and the statement are exactly
// the "oversized statements" the display instrument exists for
// (ART_DIRECTION.md §4). Everything factual stays Schibsted. Do not propagate
// Big Shoulders into the masthead, footer or ordinary headings because of this
// page — see the same section.
//
// Final asset: a full-body editorial photograph of Matthew (transparent or a
// controlled-background cutout, portrait orientation). Until it exists,
// `.cover-subject` only reserves that geometry — see the file-level comment
// on cover.css for the replacement path.
export function Cover() {
  return (
    <>
      <section className="cover stage page-grid">
        <h1 className="cover-name" aria-label="Matthew Blanke">
          <div className="cover-name-line cover-name-matthew fit layer-type-back" aria-hidden="true">
            <span className="t-display cv-matthew">Matthew</span>
          </div>
          <div className="cover-name-line cover-name-blanke fit layer-type-back" aria-hidden="true">
            <span className="t-display cv-blanke">Blanke</span>
          </div>
        </h1>

        <div className="cover-subject crop crop-tall placeholder layer-subject" aria-hidden="true">
          <span>Portrait — final asset pending</span>
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

      {/* The cover exit seam: the first sign the publication is about to be
          physically disturbed — the section below is beginning to intrude on
          the pristine cover (ART_DIRECTION.md, "Semantic vandalism": a
          justified reason, not decoration). Pure ornament, no unique content,
          fully removed by Clean Copy. M4 attaches to this seam; it does not
          reveal anything from M4. */}
      <div className="cover-seam ornament torn-top-a" aria-hidden="true" />
    </>
  );
}
