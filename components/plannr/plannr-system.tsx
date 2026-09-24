import {
  SYSTEM_COLUMNS,
  SYSTEM_HOPS,
  SYSTEM_NOTES,
  SYSTEM_SECURITY,
  SYSTEM_STACK,
} from "@/lib/work/plannr-content";

// UNDER THE HOOD: one precise diagram of how a syllabus travels, drawn the way
// a sequence is drawn: three lanes (the phone, Plannr's server, Google) and
// five numbered hops between them. Real boundaries, plain labels; no logos, no
// cloud icons, no terminal. The diagram is an ordered list of real text (the
// lines are drawn with CSS on a six-track grid, lane centres on the even grid
// lines), so a screen reader gets "1. Syllabus PDF or pasted text..." in order
// and loses nothing.
//
// The two pen notes live INSIDE the hop they annotate (same physical
// vocabulary as the margin notes in The Document): on wide screens each hangs
// off the end of that hop's line on a pen leader, out into the margin, at the
// same height; on narrow screens it sits directly under the hop, inside the
// sheet. The extraction note is pinned to the hop that reaches Gemini, the
// storage note to the hop where the server hands the events back and keeps
// nothing. The black diagram stays primary; the pen is secondary.
//
// The "where things live" legend sits inside the sheet under the lanes it
// describes (three columns on wide screens, a stacked list on narrow ones).
export function PlannrSystem() {
  return (
    <section className="stage page-grid pc-system" aria-labelledby="plannr-system-heading">
      <header className="pc-system-head">
        <p className="t-meta">Under the hood</p>
        <h2 id="plannr-system-heading" className="t-head-2">
          How a syllabus travels.
        </h2>
      </header>

      <figure className="pc-seq">
        <div className="pc-seq-lanes" aria-hidden="true">
          {SYSTEM_COLUMNS.map((c) => (
            <span key={c.key} className="pc-lane-name">
              {c.name}
            </span>
          ))}
        </div>

        <ol className="pc-hops">
          {SYSTEM_HOPS.map((h) => {
            const a = Math.min(h.from, h.to);
            const b = Math.max(h.from, h.to);
            const dir = "both" in h && h.both ? "both" : h.to > h.from ? "right" : "left";
            const note = "note" in h && h.note ? SYSTEM_NOTES[h.note] : null;
            // where the pen leaves the hop: the right-hand end of its line, as a share of the row.
            const leaves = `${(((2 * b - 1) / 6) * 100).toFixed(4)}%`;
            return (
              <li key={h.n} className="pc-hop" data-dir={dir} style={{ "--leaves": leaves } as React.CSSProperties}>
                <p className="pc-hop-label">
                  <span className="pc-hop-n t-meta" aria-hidden="true">
                    {h.n}
                  </span>
                  <span className="pc-hop-text">{h.label}</span>
                </p>
                <span className="pc-hop-line" aria-hidden="true" style={{ gridColumn: `${a * 2} / ${b * 2}` }} />
                {note ? (
                  <>
                    <span className="pc-hop-leader ornament" aria-hidden="true" />
                    <p className="pc-pen pc-hop-note">{note}</p>
                  </>
                ) : null}
              </li>
            );
          })}
        </ol>

        <dl className="pc-lives">
          {SYSTEM_COLUMNS.map((c) => (
            <div key={c.key}>
              <dt className="t-meta">{c.name}</dt>
              <dd className="t-small">{c.holds}</dd>
            </div>
          ))}
        </dl>

        <figcaption className="sr-only">
          A sequence in five steps between the phone, Plannr&rsquo;s server and Google.
        </figcaption>
      </figure>

      <div className="pc-system-foot">
        <p className="t-small">{SYSTEM_SECURITY}</p>
        <p className="t-meta pc-stack">{SYSTEM_STACK}</p>
      </div>
    </section>
  );
}
