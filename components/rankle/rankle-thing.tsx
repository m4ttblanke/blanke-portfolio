import { RANKLE_FLOW } from "@/lib/work/rankle-content";

// THE THING — the verified flow, understandable without animation or hover
// (brief §14/§32): a visitor should read Rank -> Submit -> Compare -> Share
// -> Return tomorrow as plain typeset steps, on a grid, with a rule between
// each. Every word here traces to the Rankle README (see rankle-content.ts's
// source map); nothing implies the interaction itself (no drag, no board --
// that is M5B).
export function RankleThing() {
  return (
    <section className="stage page-grid rk-thing" aria-labelledby="rankle-thing-heading">
      <header className="rk-thing-heading">
        <p className="t-meta">The thing</p>
        <h2 id="rankle-thing-heading" className="t-head-2">
          One topic a day. Rank it, then see who agrees.
        </h2>
      </header>

      <ol className="rk-thing-flow">
        {RANKLE_FLOW.map((item, i) => (
          <li key={item.step} className="rk-thing-step">
            <p className="rk-thing-step-label">
              <span className="rk-thing-step-num" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="rk-thing-step-name">{item.step}</span>
            </p>
            <p className="t-small">{item.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
