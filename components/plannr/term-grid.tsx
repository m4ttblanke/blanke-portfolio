import { DEADLINES, TERM, termDate } from "@/lib/work/plannr-content";

// THE TERM GRID: one academic quarter as a registrar's planning sheet, weeks
// down, Monday to Friday across. It is the calendar half of the syllabus ->
// calendar story and deliberately NOT the app's own UI (no app chrome, no
// screenshot mimicry): a diagram of the idea, labelled as one wherever it is
// used. Every cell carries its ISO date (data-pl-cell) and each marked cell its
// deadline id (data-pl-event), which is the static hook M6B will enhance.
//
// Decorative for assistive tech (aria-hidden): the same six dates exist as real
// text in the extraction column and in the sr-only sentence beside each use.
// Color is never the only carrier: a marked cell also gets a pen outline and a
// text tag.

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function TermGrid({
  fromWeek = 1,
  toWeek = TERM.weeks,
  marked = DEADLINES.map((d) => d.id),
  className = "",
  states,
}: {
  fromWeek?: number;
  toWeek?: number;
  /** Deadline ids to mark. */
  marked?: readonly string[];
  className?: string;
  /** M6B: per deadline id, "accepted" | "declined" | "awaiting". Only the copy inside the transformation passes it; without it the grid renders exactly as before. */
  states?: Readonly<Partial<Record<string, string>>>;
}) {
  const byIso = new Map(DEADLINES.filter((d) => marked.includes(d.id)).map((d) => [d.iso, d]));
  const weeks = Array.from({ length: toWeek - fromWeek + 1 }, (_, i) => fromWeek + i);

  return (
    <div className={`pc-term ${className}`.trim()} aria-hidden="true" data-pl-term>
      <div className="pc-term-head">
        <span className="pc-term-corner">Wk</span>
        {TERM.weekdays.map((d) => (
          <span key={d} className="pc-term-day">
            {d}
          </span>
        ))}
      </div>
      {weeks.map((w) => (
        <div key={w} className="pc-term-row">
          <span className="pc-term-week">W{w}</span>
          {TERM.weekdays.map((_, wd) => {
            const iso = termDate(w, wd);
            const day = Number(iso.slice(8));
            const month = Number(iso.slice(5, 7)) - 1;
            const hit = byIso.get(iso);
            const state = hit ? states?.[hit.id] : undefined;
            const showMonth = day === 1 || (w === fromWeek && wd === 0);
            return (
              <span
                key={iso}
                className={hit ? "pc-cell pc-cell-marked" : "pc-cell"}
                data-pl-cell={iso}
                {...(hit ? { "data-pl-event": hit.id } : {})}
                {...(state ? { "data-pl-state": state } : {})}
              >
                <span className="pc-cell-day">
                  {showMonth ? <span className="pc-cell-month">{MONTHS[month]} </span> : null}
                  {day}
                </span>
                {hit ? <span className="pc-cell-tag">{hit.tag}</span> : null}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
}
