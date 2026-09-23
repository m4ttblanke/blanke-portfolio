import "./cover.css";

// THE COVER — the homepage's opening composition, and the first major
// hand-art-directed piece of the site (docs/ART_DIRECTION.md §9, "Tools, not a
// composition system": no seeded or deterministic-chaos utility chose anything
// here). One thing, read three ways: the name, a human subject standing inside
// it, one statement. The static hierarchy (MATTHEW → BLANKE → subject →
// statement → metadata) is approved and frozen; see cover.css for the M3B
// production pass (entrance motion, responsive hardening) on top of it.
//
// Big Shoulders is used here because the name and the statement are exactly
// the "oversized statements" the display instrument exists for
// (ART_DIRECTION.md §4). Everything factual stays Schibsted. Do not propagate
// Big Shoulders into the masthead, footer or ordinary headings because of this
// page — see the same section.
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

      <CoverPortrait />

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

/**
 * THE PORTRAIT SLOT — replacement contract.
 *
 * Today this renders a deliberately abstract development figure (a plain SVG:
 * head, shoulders, torso, legs), so the OVERLAP with BLANKE could be
 * art-directed before the real photograph exists. It is not a rendering of a
 * person, is not final artwork, and must not be mistaken for either. It stays
 * in production, visibly, until the real asset replaces it — this is not a
 * dev-only element hidden by environment, because a half-built placeholder
 * shown honestly to visitors is preferable to gating it behind logic that
 * would need to be un-gated later; see docs/ART_DIRECTION.md, "Photography".
 *
 * The final asset is a real photograph of Matthew: full-body, portrait
 * orientation, high-resolution source, transparent background/cutout
 * preferred, the body meant to interact directly with BLANKE the way this
 * placeholder already does. Replacing it:
 *
 * 1. Render it with `next/image` in place of the `<svg>` below, inside the
 *    same `.cover-subject` wrapper. Keep `.cover-figure`'s `inline-size: 64%`
 *    (or re-tune it once real proportions exist) — the wrapper's grid
 *    placement in cover.css is what's actually tuned per breakpoint, and nothing
 *    else needs to change to keep the same position, sizing responsively via
 *    `sizes`.
 * 2. Give the `next/image` explicit `width`/`height` matching the photo's own
 *    aspect ratio (this placeholder's 2:3 viewBox is a stand-in, not a target
 *    to match) so nothing shifts when it swaps in — no CLS.
 * 3. Remove `aria-hidden` from `.cover-subject` and give the image real,
 *    concise alt text describing what's actually in the photo. Do not invent
 *    this now, and do not restate the H1's name or the statement below it in
 *    the alt text.
 * 4. Desktop/tablet/mobile placement may need to change to fit Matthew's
 *    actual pose (x/y position, scale, crop, object-position) — see
 *    cover.css's file header on what's frozen and what's allowed to move.
 */
function CoverPortrait() {
  return (
    <div className="cover-subject layer-subject" aria-hidden="true">
      <svg className="cover-figure" viewBox="0 0 200 300" preserveAspectRatio="xMidYMax meet" focusable="false">
        <circle cx="100" cy="44" r="27" />
        <path d="M 63 98 C 63 83 137 83 137 98 L 148 192 L 52 192 Z" />
        <path d="M 71 192 L 66 292 L 84 292 L 88 198 Z" />
        <path d="M 129 192 L 134 292 L 116 292 L 112 198 Z" />
      </svg>
      <span className="cover-subject-label t-meta t-soft">Portrait — final asset pending</span>
    </div>
  );
}
