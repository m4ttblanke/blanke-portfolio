import { MarkUnderline } from "@/components/design/marks";
import { DECISIONS } from "@/lib/work/plannr-content";

// THE DECISIONS: "what was actually difficult?" Three findings on ONE
// engineering-review sheet, not three documentation sections. The sheet is the
// same white, hairline-edged paper as the syllabus page and the receipt; each
// finding is a band on it, separated by a heavy rule, with the claim on the
// left and the reasoning ruled out on the right.
//
// The pen note is a review mark, not a subtitle: the phrase in the headline it
// is about is underlined in pen (decoration, hidden by Clean Copy) and the note
// hangs directly beneath on a pen leader. Its words are real text; each finding
// has exactly one. The code reference sits under the note, where a review sheet
// keeps its reference, so the left column carries weight instead of dead space.
//
// Content is unchanged from the approved version: constraint, what it does,
// where it stops, and a link into the public repository per decision. Every
// limit is a limitation the code or the product itself admits.
export function PlannrDecisions() {
  return (
    <section className="stage page-grid pc-decisions" aria-labelledby="plannr-decisions-heading">
      <header className="pc-decisions-head">
        <p className="t-meta">The decisions</p>
        <h2 id="plannr-decisions-heading" className="t-head-2">
          What was actually difficult.
        </h2>
        <p className="t-lede pc-decisions-lede">
          Three choices, each made because the calendar isn&rsquo;t Plannr&rsquo;s. It&rsquo;s the student&rsquo;s.
        </p>
      </header>

      <ul className="pc-decision-list">
        {DECISIONS.map((d, i) => {
          const [before, after] = d.name.split(d.mark);
          return (
            <li key={d.id} className="pc-decision">
              <div className="pc-decision-claim">
                <p className="t-meta pc-decision-ref">Finding {i + 1}</p>
                <h3 className="t-head-2 pc-decision-name">
                  {before}
                  <span className="pc-uline">
                    {d.mark}
                    <MarkUnderline className="annotation pc-uline-mark ornament" />
                  </span>
                  {after}
                </h3>
                <p className="pc-pen pc-decision-note">
                  <span className="pc-decision-leader ornament" aria-hidden="true" />
                  {d.note}
                </p>
                <p className="pc-decision-code">
                  <span className="t-meta">In the code</span>
                  <a className="pc-link-plain" href={d.code.href} target="_blank" rel="noopener noreferrer">
                    {d.code.label} ↗
                  </a>
                </p>
              </div>
              <dl className="pc-decision-rows">
                <div>
                  <dt className="t-meta">The constraint</dt>
                  <dd className="t-body">{d.constraint}</dd>
                </div>
                <div>
                  <dt className="t-meta">What it does</dt>
                  <dd className="t-body">{d.decision}</dd>
                </div>
                <div>
                  <dt className="t-meta">Where it stops</dt>
                  <dd className="t-body">{d.limit}</dd>
                </div>
              </dl>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
