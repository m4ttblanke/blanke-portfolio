import { MarkX } from "@/components/design/marks";
import { RANKLE_ARGUMENT } from "@/lib/work/rankle-content";

// THE ARGUMENT — the loudest spread (brief §15, ~60-70% chaos), but every
// sentence still traces to verified product behavior (see rankle-content.ts's
// source map). M5A adjustment pass: YOU vs EVERYONE ELSE, the same five tier
// letters stacked in two different orders -- the composition itself shows
// "people disagree" without inventing a single number, name or result. The
// order below is fixed presentation-only design grammar, not a claim about
// any real ranking. Fully decorative (ornament + aria-hidden): the real
// claim already exists as real text in the lede and the three points.
export function RankleArgument() {
  return (
    <section className="stage page-grid rk-argument" aria-labelledby="rankle-argument-heading">
      <h2 id="rankle-argument-heading" className="rk-argument-lede t-head-2">
        {RANKLE_ARGUMENT.lede}
      </h2>

      <div className="rk-argument-compare ornament" aria-hidden="true">
        <div className="rk-argument-side">
          <p className="rk-argument-side-label">You</p>
          <ol className="rk-argument-stack">
            {(["S", "A", "B", "C", "F"] as const).map((t) => (
              <li key={t} className={`rk-tier-block rk-tier-${t.toLowerCase()}`}>
                {t}
              </li>
            ))}
          </ol>
        </div>

        <span className="rk-argument-clash">
          <MarkX />
        </span>

        <div className="rk-argument-side">
          <p className="rk-argument-side-label">Everyone else</p>
          <ol className="rk-argument-stack">
            {(["B", "F", "S", "C", "A"] as const).map((t) => (
              <li key={t} className={`rk-tier-block rk-tier-${t.toLowerCase()}`}>
                {t}
              </li>
            ))}
          </ol>
        </div>
      </div>

      <ul className="rk-argument-points">
        {RANKLE_ARGUMENT.points.map((point, i) => (
          <li key={point} className={`rk-argument-point rk-argument-point-${i + 1}`}>
            {point}
          </li>
        ))}
      </ul>
    </section>
  );
}
