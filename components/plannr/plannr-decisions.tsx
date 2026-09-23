import { MarkArrow } from "@/components/design/marks";
import { DECISIONS } from "@/lib/work/plannr-content";

// THE DECISION: "what was actually difficult?" Three decisions, each cited to
// real code in the public repository (lib/work/plannr-content.ts holds the
// source map). Not cards: a ruled specification sheet, one decision per band,
// the claim on the left in Schibsted, the reasoning on the right as labelled
// rows, and one pen note per decision that says, in real text, the phrase to
// remember. Every "limit" is a limitation the code or the product itself
// admits; nothing is invented rationale.
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
        {DECISIONS.map((d) => (
          <li key={d.id} className="pc-decision">
            <div className="pc-decision-claim">
              <h3 className="t-head-2 pc-decision-name">{d.name}</h3>
              <p className="pc-pen pc-decision-note">
                <span className="pc-pen-arrow ornament annotation" aria-hidden="true">
                  <MarkArrow />
                </span>
                {d.note}
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
              <div>
                <dt className="t-meta">In the code</dt>
                <dd className="t-body">
                  <a className="pc-link-plain" href={d.code.href} target="_blank" rel="noopener noreferrer">
                    {d.code.label} ↗
                  </a>
                </dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
    </section>
  );
}
