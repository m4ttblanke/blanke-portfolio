import { MarkCircle } from "@/components/design/marks";
import { DEADLINES, DOCUMENT_NOISE, DOCUMENT_NOTES } from "@/lib/work/plannr-content";

// THE DOCUMENT: the syllabus as the page's protagonist. An ILLUSTRATION, and
// labelled so where it is used (DOCUMENT_DISCLAIMER): a fictitious course
// composed from the sample syllabus built into the app, because every real
// syllabus in the workspace carries instructor names, emails or private
// Canvas URLs (docs/planning/m6-plannr-evidence.md, "Privacy"). Never rotated:
// it is body text. It earns its physical cues one by one:
//   - binder holes  : it is a paper handout, punched for a binder
//   - highlighter   : the deadlines, marked the way a student would mark them
//   - one pen ring  : the single date the syllabus never states (review's job)
//   - bracket       : the lines Plannr is told to ignore
// Decorative marks are .ornament + aria-hidden; each mark's meaning also exists
// as real text (the margin notes). Real text stays real text, so reading order
// is the document's own.
/** full: the whole page. fragment: the top of it, three lines (hero). lines: only the schedule, all six (transformation). */
export function DocumentPage({
  variant = "full",
  notes = false,
  hooks = false,
}: {
  variant?: "full" | "fragment" | "lines";
  notes?: boolean;
  /** Carry the data-pl-deadline hooks. Only the copy inside the transformation does: the hooks must be unique on the page, so hero and document leave them off. */
  hooks?: boolean;
}) {
  const full = variant === "full";
  const shown = variant === "fragment" ? DEADLINES.slice(0, 3) : DEADLINES;
  return (
    <div className={`pc-page pc-page-${variant}`}>
      <span className="pc-holes ornament" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>

      {variant !== "lines" ? (
        <>
          <p className="pc-page-code">{DOCUMENT_NOISE.header}</p>
          <p className="pc-page-line">
            {DOCUMENT_NOISE.term} · {DOCUMENT_NOISE.meets}
          </p>
          <p className="pc-page-line">{DOCUMENT_NOISE.start}</p>
        </>
      ) : null}

      <p className="pc-page-rule t-meta">Schedule of graded work</p>
      <ul className="pc-page-list">
        {shown.map((d) => (
          <li key={d.id}>
            <span className="pc-hl" {...(hooks ? { "data-pl-deadline": d.id } : {})}>
              {d.title}
            </span>
            {" — "}
            <span className="pc-hl" {...(hooks ? { "data-pl-deadline-when": d.id } : {})}>
              {d.ring && d.written.includes(d.ring) ? (
                <>
                  {d.written.split(d.ring)[0]}
                  <span className="pc-mark-host">
                    {d.ring}
                    <span className="annotation pc-ring ornament" aria-hidden="true">
                      <MarkCircle />
                    </span>
                  </span>
                  {d.written.split(d.ring)[1]}
                </>
              ) : (
                d.written
              )}
            </span>
            {notes && d.id in DOCUMENT_NOTES ? (
              <span className={d.id === "final" ? "pc-pen pc-line-note pc-line-note-up" : "pc-pen pc-line-note"}>
                <span className="pc-pen-tick ornament" aria-hidden="true" />
                {DOCUMENT_NOTES[d.id as "ps1" | "final"]}
              </span>
            ) : null}
          </li>
        ))}
      </ul>

      {full ? (
        <div className="pc-page-ignored">
          <div className="pc-ignored-lines">
            <span className="pc-bracket ornament" aria-hidden="true" />
            {DOCUMENT_NOISE.ignored.map((line) => (
              <p key={line} className="pc-page-line">
                {line}
              </p>
            ))}
          </div>
          {notes ? (
            <p className="pc-pen pc-line-note">
              <span className="pc-pen-tick ornament" aria-hidden="true" />
              {DOCUMENT_NOTES.ignored}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
