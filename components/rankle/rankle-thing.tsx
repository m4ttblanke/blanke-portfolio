import { RANKLE_FLOW } from "@/lib/work/rankle-content";

// THE THING — the verified flow, understandable without animation or hover
// (brief §14/§32). M5A adjustment pass: RANK leads as an oversized opening
// move -- the dominant action, not one of five equal boxes -- and SUBMIT ->
// COMPARE -> SHARE -> RETURN follow as a connected, arrow-linked chain (see
// rankle.css for the desktop staircase cascade). Every word still traces to
// the Rankle README (see rankle-content.ts's source map); nothing here
// implies the interaction itself (no drag, no board -- that is M5B). The
// card fan behind RANK is deliberately blank: no invented item names, no
// tier color (items have no tier until a person ranks them).
export function RankleThing() {
  const [rank, ...chain] = RANKLE_FLOW;

  return (
    <section className="stage page-grid rk-thing" aria-labelledby="rankle-thing-heading">
      <header className="rk-thing-heading">
        <p className="t-meta">The thing</p>
        <h2 id="rankle-thing-heading" className="t-head-2">
          One topic a day. Rank it, then see who agrees.
        </h2>
      </header>

      <div className="rk-thing-rank">
        <span className="rk-thing-cards ornament" aria-hidden="true">
          <span className="rk-thing-card rk-thing-card-1" />
          <span className="rk-thing-card rk-thing-card-2" />
          <span className="rk-thing-card rk-thing-card-3" />
        </span>
        <p className="rk-thing-rank-num" aria-hidden="true">
          01
        </p>
        <h3 className="rk-thing-rank-word">{rank.step}</h3>
        <p className="t-small rk-thing-rank-body">{rank.body}</p>
      </div>

      <ol className="rk-thing-chain">
        {chain.map((item, i) => (
          <li key={item.step} className="rk-thing-link">
            <span className="rk-thing-arrow" aria-hidden="true" />
            <p className="rk-thing-link-label">
              <span className="rk-thing-link-num" aria-hidden="true">
                {String(i + 2).padStart(2, "0")}
              </span>
              <span className="rk-thing-link-name">{item.step}</span>
            </p>
            <p className="t-small">{item.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
