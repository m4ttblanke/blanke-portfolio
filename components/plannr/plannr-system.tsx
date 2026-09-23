import { SYSTEM_COLUMNS, SYSTEM_HOPS, SYSTEM_NOTES, SYSTEM_SECURITY, SYSTEM_STACK } from "@/lib/work/plannr-content";

// UNDER THE HOOD: one precise diagram of how a syllabus travels, drawn the way
// a sequence is drawn: three lanes (the phone, Plannr's server, Google), and
// five numbered hops between them. Real boundaries, plain labels; no logos, no
// cloud icons, no terminal. The diagram is an ordered list of real text (the
// lines are drawn with CSS on a six-track grid, lane centres on the even grid
// lines), so a screen reader gets "1. Syllabus PDF or pasted text..." in order
// and loses nothing. Pen notes sit beside it and never touch the lines.
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
            return (
              <li key={h.n} className="pc-hop" data-dir={dir}>
                <p className="pc-hop-label">
                  <span className="pc-hop-n t-meta" aria-hidden="true">
                    {h.n}
                  </span>
                  <span className="pc-hop-text">{h.label}</span>
                </p>
                <span
                  className="pc-hop-line"
                  aria-hidden="true"
                  style={{ gridColumn: `${a * 2} / ${b * 2}` }}
                />
              </li>
            );
          })}
        </ol>

        <figcaption className="sr-only">
          A sequence in five steps between the phone, Plannr&rsquo;s server and Google.
        </figcaption>
      </figure>

      <dl className="pc-lives">
        {SYSTEM_COLUMNS.map((c) => (
          <div key={c.key}>
            <dt className="t-meta">{c.name}</dt>
            <dd className="t-small">{c.holds}</dd>
          </div>
        ))}
      </dl>

      <ul className="pc-system-notes">
        <li className="pc-pen">{SYSTEM_NOTES.extraction}</li>
        <li className="pc-pen">{SYSTEM_NOTES.storage}</li>
      </ul>

      <div className="pc-system-foot">
        <p className="t-small">{SYSTEM_SECURITY}</p>
        <p className="t-meta pc-stack">{SYSTEM_STACK}</p>
      </div>
    </section>
  );
}
