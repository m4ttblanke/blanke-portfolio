import "./selected-work.css";
import { RankleWorkPoster } from "./rankle-poster";
import { PlannrWorkPoster } from "./plannr-poster";

// SELECTED WORK — the wall (M4A, static art direction only; see
// docs/ART_DIRECTION.md §2/§16 and lib/work/projects.ts for the content
// truth). The first physical intrusion into the publication: Rankle's poster
// (selected-work.css, .wall-rankle) is the object that crosses up into M3's
// closing whitespace, because the wall of work is what invades the clean
// cover -- M3's own markup and CSS are untouched (see cover.tsx/cover.css).
//
// Rankle and Plannr are hand-art-directed flagships, not a card grid: they
// differ in geometry, rotation and palette on purpose (§43). No deterministic
// chaos utility placed either of them (§45) -- only Rankle's own scoped
// tilt-ccw-1 is used, hand-chosen, the same way the cover's overlap was.
//
// M4A adjustment pass (visual review): the heading is no longer a full-width
// row separating the two posters. It now lives beside Rankle, in the
// negative space the poster composition creates (selected-work.css), and
// Plannr moved up/left into a small, real overlap with Rankle's lower-right
// corner so the two flagships read as one cluster. "More in the index" was
// removed -- only two projects are verified, and WORK in the masthead
// already reaches /projects; a "more" CTA implied content this wall doesn't
// have.
export function SelectedWork() {
  return (
    <section className="selected-work stage page-grid" aria-labelledby="selected-work-heading">
      {/* DOM/reading order stays header -> Rankle -> Plannr (unchanged from
          the first M4A pass): "Selected Work" is announced before either
          project, a boring and predictable order for screen readers and
          keyboard users. Only CSS grid placement (grid-row/grid-column, no
          `order` property) moves the header visually beside Rankle instead
          of below it -- the same "visual z-order need not equal DOM order"
          approach the first pass used, applied to position, not stacking. */}
      <header className="sw-header">
        <p className="t-meta t-soft">Issue 001</p>
        <h2 id="selected-work-heading" className="sw-title t-head-3">
          Selected Work
        </h2>
      </header>

      <RankleWorkPoster />
      <PlannrWorkPoster />
    </section>
  );
}
