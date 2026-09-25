import Image from "next/image";
import { MarkCircle } from "@/components/design/marks";
import { COURSES_SHOT, DV_RUN, RULE_TESTS } from "@/lib/work/archive";

// The Work index's visual artifacts (M7). Each one is real material, not
// branding: two flagship plates set in each product's own language, and three
// archive exhibits (a pull request's screenshot, a simulation's output, a
// test file's rule names). The one red mark per archive exhibit points at the
// fact its caption states, so removing it loses emphasis, never information.

// ------------------------------------------------------------------ features

/**
 * RANKLE: an empty tier sheet, the thing a player fills in. One card is
 * still loose: it sits across the S/A line because someone has not decided
 * yet, and that indecision is the game (the case study's argument). Its tilt is
 * the one rotation on the plate, scaled by --chaos, so Clean Copy lands it.
 * Decorative: the feature's text carries everything.
 */
export function RanklePlate() {
  return (
    <div className="wi-plate wi-plate-rankle stage" aria-hidden="true">
      <div className="wi-rk-sheet layer-paper">
        {(["S", "A", "B"] as const).map((tier, i) => (
          <div key={tier} className={`wi-rk-row wi-rk-row-${tier.toLowerCase()}`}>
            <span className="wi-rk-label">{tier}</span>
            <span className="wi-rk-cards">
              {Array.from({ length: [2, 3, 1][i] }, (_, n) => (
                <span key={n} className="wi-rk-card" />
              ))}
            </span>
          </div>
        ))}
      </div>
      <span className="wi-rk-card wi-rk-loose tilt-cw-2 layer-collage" />
    </div>
  );
}

/**
 * PLANNR: the real Week at a Glance capture (also used by the case study),
 * cropped to the week itself and printed on Plannr's paper. Ordered and
 * level: there is no rotation on Plannr's feature, as on its case study.
 */
export function PlannrPlate() {
  return (
    <figure className="wi-plate wi-plate-plannr">
      <div className="wi-pl-print crop">
        <Image
          src="/plannr/week-at-a-glance.png"
          alt="Plannr's Week at a Glance screen for 30 August to 5 September: 8 items due this week, 11 next week, and a strip of days, each with a count of what is due."
          width={760}
          height={1652}
          sizes="(min-width: 64rem) 22vw, (min-width: 48rem) 40vw, 70vw"
        />
      </div>
      <figcaption className="wi-pl-caption t-caption">
        Week at a Glance, from the developer&rsquo;s own account, August 2026.
      </figcaption>
    </figure>
  );
}

// ------------------------------------------------------------------- archive

/** 03: the screenshot from PR #28, circled where the change is. */
export function CoursesShot() {
  return (
    <figure className="wi-exhibit wi-exhibit-shot">
      <div className="wi-shot stage">
        <Image
          src={COURSES_SHOT.src}
          alt={COURSES_SHOT.alt}
          width={COURSES_SHOT.width}
          height={COURSES_SHOT.height}
          sizes="(min-width: 64rem) 30vw, (min-width: 48rem) 70vw, 92vw"
          className="layer-paper"
        />
        {/* The link PR #28 added. The caption says the same in words. */}
        <span className="wi-shot-mark annotation ornament" style={{ "--mark-tilt": "-2deg" } as React.CSSProperties}>
          <MarkCircle />
        </span>
      </div>
      <figcaption className="t-caption t-soft">{COURSES_SHOT.caption}</figcaption>
    </figure>
  );
}

// Node positions in a 240 x 180 box, laid out as the course's own ASCII
// drawing of "network 1" lays them out: E0 E1 on top, E3 E2 below.
const NODE = [
  { x: 36, y: 34 },
  { x: 204, y: 34 },
  { x: 204, y: 146 },
  { x: 36, y: 146 },
] as const;

const onRoute = (a: number, b: number) =>
  DV_RUN.route.some((n, i) => i > 0 && ((DV_RUN.route[i - 1] === a && n === b) || (DV_RUN.route[i - 1] === b && n === a)));

/** 04: the routing run. The diagram is the topology; the table is the output. */
export function RoutingRun() {
  const described = DV_RUN.links.map((l) => `E${l.a} to E${l.b} costs ${l.cost}`).join(", ");
  return (
    <figure className="wi-exhibit wi-exhibit-run">
      <div className="wi-run">
        <svg className="wi-run-map" viewBox="0 0 240 180" role="img" aria-labelledby="wi-run-map-title">
          <title id="wi-run-map-title">
            {`The course's four-node test network. ${described}. The route from E0 to E3 through E1 and E2 is marked in red.`}
          </title>
          {DV_RUN.links.map((l) => {
            const a = NODE[l.a];
            const b = NODE[l.b];
            const route = onRoute(l.a, l.b);
            // Cost labels sit just off the midpoint, outside the square.
            const mx = (a.x + b.x) / 2;
            const my = (a.y + b.y) / 2;
            const dx = l.a === 0 && l.b === 2 ? 10 : a.x === b.x ? (a.x < 120 ? -14 : 14) : 0;
            const dy = l.a === 0 && l.b === 2 ? -6 : a.y === b.y ? (a.y < 90 ? -10 : 18) : 4;
            return (
              <g key={`${l.a}-${l.b}`} className={route ? "wi-run-link is-route" : "wi-run-link"}>
                <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
                <text x={mx + dx} y={my + dy} textAnchor="middle">
                  {l.cost}
                </text>
              </g>
            );
          })}
          {NODE.map((n, i) => (
            <g key={i} className="wi-run-node">
              <rect x={n.x - 15} y={n.y - 11} width="30" height="22" />
              <text x={n.x} y={n.y + 4.5} textAnchor="middle">{`E${i}`}</text>
            </g>
          ))}
        </svg>

        <table className="wi-run-table">
          <caption className="t-meta">E0 forwarding table</caption>
          <thead>
            <tr>
              <th scope="col">To</th>
              <th scope="col">Cost</th>
              <th scope="col">Next hop</th>
            </tr>
          </thead>
          <tbody>
            {DV_RUN.table.map((row) => (
              <tr key={row.dest}>
                <th scope="row">{row.dest}</th>
                <td>
                  {row.dest === "E3" ? (
                    <span className="wi-run-settled stage">
                      <span className="layer-paper">{row.cost}</span>
                      {/* The number the caption is about: 4, not the direct link's 7. */}
                      <span className="wi-run-mark annotation ornament" style={{ "--mark-tilt": "4deg" } as React.CSSProperties}>
                        <MarkCircle />
                      </span>
                    </span>
                  ) : (
                    row.cost
                  )}
                </td>
                <td>{row.via}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <figcaption className="t-caption t-soft">{DV_RUN.caption}</figcaption>
    </figure>
  );
}

/** 05: the rules, named exactly as the test file names them. */
export function RuleSheet() {
  return (
    <figure className="wi-exhibit wi-exhibit-rules">
      <div className="wi-rules">
        <p className="wi-rules-file t-soft">{RULE_TESTS.file}</p>
        <p className="wi-rules-suite">
          describe(&ldquo;{RULE_TESTS.suite}&rdquo;)
        </p>
        <ul className="wi-rules-list">
          {RULE_TESTS.names.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
      </div>
      <figcaption className="t-caption t-soft">
        Six of the rules, named as the test file names them. A change that breaks one does not deploy.
      </figcaption>
    </figure>
  );
}
