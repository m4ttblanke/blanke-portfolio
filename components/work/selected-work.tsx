import "./selected-work.css";
import { RankleWorkPoster } from "./rankle-poster";
import { PlannrWorkPoster } from "./plannr-poster";
import { WorkIndex } from "./work-index";

// SELECTED WORK — the wall (M4A, static art direction only; see
// docs/ART_DIRECTION.md §2/§16 and lib/work/projects.ts for the content
// truth). The first physical intrusion into the publication: Rankle's poster
// (selected-work.css, .work-rankle) is the object that crosses up into M3's
// closing whitespace, because the wall of work is what invades the clean
// cover -- M3's own markup and CSS are untouched (see cover.tsx/cover.css).
//
// Rankle and Plannr are hand-art-directed flagships, not a card grid: they
// differ in geometry, rotation and palette on purpose (§43). No deterministic
// chaos utility placed either of them (§45) -- only Rankle's own scoped
// tilt-ccw-1 is used, hand-chosen, the same way the cover's overlap was.
export function SelectedWork() {
  return (
    <section className="selected-work stage page-grid" aria-labelledby="selected-work-heading">
      <header className="sw-header">
        <p className="t-meta t-soft">Issue 001</p>
        <h2 id="selected-work-heading" className="sw-title t-head-2">
          Selected Work
        </h2>
      </header>

      <div className="sw-wall">
        <RankleWorkPoster />
        <PlannrWorkPoster />
      </div>

      <WorkIndex />
    </section>
  );
}
