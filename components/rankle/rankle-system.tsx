import { Fragment } from "react";
import { RANKLE_ARCHITECTURE, RANKLE_DECISIONS } from "@/lib/work/rankle-content";

// THE SYSTEM — the quiet spread (brief §16/§51, ~20-30% chaos): paper, one
// rule-and-typography architecture diagram (no cloud icons, no 3D, no fake
// terminal -- brief §17), and three CONSTRAINT -> DECISION -> WHY IT
// MATTERED stories. Every decision here has a direct citation in
// rankle-content.ts's source map (docs/SECURITY.md); nothing is inferred
// rationale invented after the fact. The countable stats (migrations, tests,
// CI checks) live once, in RankleReceipt -- not repeated here.
export function RankleSystem() {
  return (
    <section className="stage page-grid rk-system" aria-labelledby="rankle-system-heading">
      <header className="rk-system-heading">
        <p className="t-meta">The system</p>
        <h2 id="rankle-system-heading" className="t-head-2">
          Three decisions the database actually enforces
        </h2>
      </header>

      {/* Real informative text, read in order by assistive tech -- no role="img"
          summary that would hide it. Only the connecting arrow is decorative. */}
      <div className="rk-system-diagram">
        <p className="sr-only">A simple architecture: the browser, then Next.js, then Supabase.</p>
        {RANKLE_ARCHITECTURE.map((layer, i) => (
          <Fragment key={layer.layer}>
            {i > 0 && <span className="rk-arch-arrow" aria-hidden="true" />}
            <div className="rk-arch-layer">
              <p className="rk-arch-layer-name">{layer.layer}</p>
              <p className="rk-arch-layer-detail">{layer.detail}</p>
            </div>
          </Fragment>
        ))}
      </div>

      <ol className="rk-system-decisions">
        {RANKLE_DECISIONS.map((d) => (
          <li key={d.constraint} className="rk-decision">
            <p className="rk-decision-label">Constraint</p>
            <p className="t-body">{d.constraint}</p>
            <p className="rk-decision-label">Decision</p>
            <p className="t-body">{d.decision}</p>
            <p className="rk-decision-label">Why it mattered</p>
            <p className="t-body">{d.why}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
