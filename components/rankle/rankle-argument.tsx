import { MarkX } from "@/components/design/marks";
import { RANKLE_ARGUMENT } from "@/lib/work/rankle-content";

// THE ARGUMENT — the loudest spread (brief §15, ~60-70% chaos), but every
// sentence still traces to verified product behavior (guest access, the
// spoiler gate, guest-to-account claiming -- see rankle-content.ts's source
// map). The S/F opposition is real tier vocabulary (docs/DESIGN.md, the
// product's own S-A-B-C-F scale), used as design language, not as a claim
// about any real disagreement or real user data. The mark is MarkX -- the
// site's own temporary marker vocabulary (components/design/marks.tsx) --
// recolored to Rankle red via currentColor, never the global red accent
// (ART_DIRECTION.md §16: red carries no meaning inside Rankle's own red).
export function RankleArgument() {
  return (
    <section className="stage page-grid rk-argument" aria-labelledby="rankle-argument-heading">
      <h2 id="rankle-argument-heading" className="rk-argument-lede t-head-2">
        {RANKLE_ARGUMENT.lede}
      </h2>

      <div className="rk-argument-marks ornament" aria-hidden="true">
        <span className="rk-argument-letter">S</span>
        <span className="rk-argument-vs">
          <MarkX />
        </span>
        <span className="rk-argument-letter">F</span>
      </div>

      <ul className="rk-argument-points">
        {RANKLE_ARGUMENT.points.map((point) => (
          <li key={point} className="rk-argument-point">
            {point}
          </li>
        ))}
      </ul>
    </section>
  );
}
