import Link from "next/link";
import { PLANNR_META, RECEIPT_CREDITS, RECEIPT_NOT_ON_FILE, RECEIPT_ROWS } from "@/lib/work/plannr-content";

// THE RECEIPT: is this real? A filing sheet, not a dashboard. Each row is one
// thing that exists and where to check it; the stamp records WHEN it was
// checked (the reason the mark exists: an approval stamp carries a date). The
// sheet is punched for the same binder as the syllabus page above (it is the
// same file: the document, then the evidence) and sits on a second sheet whose
// edge shows beneath it, so it reads as a filed page, not a floating panel. No
// user counts, no revenue, no accuracy figures: the last row says plainly what
// is not on file. Credits keep the authorship honest: a seven-person course
// project first, then Matt alone. Exits to Work, not to a made-up "next".
export function PlannrReceipt() {
  return (
    <section className="stage page-grid pc-receipt" aria-labelledby="plannr-receipt-heading">
      <header className="pc-receipt-head">
        <p className="t-meta">The receipt</p>
        <h2 id="plannr-receipt-heading" className="t-head-2">
          A beta, running, with the code in public.
        </h2>
        <p className="t-small pc-receipt-checked">Checked {PLANNR_META.checkedOn}.</p>
      </header>

      <div className="pc-sheet">
        <span className="pc-holes ornament" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="pc-stamp ornament tilt-ccw-2" aria-hidden="true">
          Checked
          <br />
          {PLANNR_META.checkedOn}
        </span>

        <dl className="pc-ledger">
          {RECEIPT_ROWS.map((r) => (
            <div key={r.label} className="pc-ledger-row">
              <dt className="t-meta">{r.label}</dt>
              <dd>
                <span className="t-body">{r.body}</span>
                {"link" in r && r.link ? (
                  <a className="pc-link-plain" href={r.link.href} target="_blank" rel="noopener noreferrer">
                    {r.link.label} ↗
                  </a>
                ) : null}
              </dd>
            </div>
          ))}
        </dl>

        <p className="pc-not-on-file t-small">
          <span className="t-meta">Not on file</span> {RECEIPT_NOT_ON_FILE}
        </p>
      </div>

      <div className="pc-credits">
        <h3 className="t-head-3">Who built it</h3>
        <dl className="pc-ledger">
          {RECEIPT_CREDITS.map((c) => (
            <div key={c.label} className="pc-ledger-row">
              <dt className="t-meta">{c.label}</dt>
              <dd>
                <span className="t-body">{c.body}</span>
                {"link" in c && c.link ? (
                  <a className="pc-link-plain" href={c.link.href} target="_blank" rel="noopener noreferrer">
                    {c.link.label} ↗
                  </a>
                ) : null}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="pc-exit">
        <Link href="/projects">← Back to Work</Link>
      </div>
    </section>
  );
}
