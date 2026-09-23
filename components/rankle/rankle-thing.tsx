import { RANKLE_FLOW } from "@/lib/work/rankle-content";
import { RankleRankInteraction } from "./rankle-rank-interaction";

// THE THING — the verified flow, understandable without animation or hover
// for four of its five steps (brief §14/§32). M5A adjustment pass: RANK
// leads as an oversized opening move -- the dominant action, not one of
// five equal boxes -- and SUBMIT -> COMPARE -> SHARE -> RETURN follow as a
// connected, arrow-linked chain (see rankle.css for the desktop staircase
// cascade). M5B: the blank card-fan ornament that used to sit behind RANK
// is now the signature interaction itself (RankleRankInteraction) -- the
// one thing on this page a visitor can actually do, demonstrating the verb
// "rank" with four abstract shapes, never a miniature Rankle client (see
// rankle-rank-interaction.tsx's own header comment). SUBMIT through RETURN
// stay purely typographic on purpose (brief §9 of the M5B milestone): the
// asymmetry is intentional, not an oversight.
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
        <p className="rk-thing-rank-num" aria-hidden="true">
          01
        </p>
        <h3 className="rk-thing-rank-word">{rank.step}</h3>
        <p className="t-small rk-thing-rank-body">{rank.body}</p>
        <RankleRankInteraction />
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
