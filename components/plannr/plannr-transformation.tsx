import Image from "next/image";
import { DocumentPage } from "./document-page";
import { TermGrid } from "./term-grid";
import { MarkArrow } from "@/components/design/marks";
import { DEADLINES, FLOW_CAPTIONS, FLOW_STEPS } from "@/lib/work/plannr-content";

// THE TRANSFORMATION: SYLLABUS -> EXTRACT -> REVIEW -> CALENDAR, the whole
// product in one static reading. A real sequence, so the four steps are a real
// ordered list and the step words are the page's second (and last) display
// moment. Not four cards: each step is a different KIND of artifact (a marked
// page, extracted records, the real review screen, a term sheet), joined by pen
// arrows that are decoration only (the order is the list's own).
//
// This is the STATIC FOUNDATION for M6B, which will progressively enhance it
// without redesigning it. The hooks are already in the markup:
//   data-pl-flow                    the island root
//   data-pl-step="syllabus|..."     each step
//   data-pl-deadline="ps1"          a highlighted phrase on the page
//   data-pl-event="ps1"             its extracted record AND its marked cell
//   data-pl-cell="2027-01-15"       every cell of the term grid
// Nothing here listens, animates or holds state.
export function PlannrTransformation() {
  const [syllabus, extract, review, calendar] = FLOW_STEPS;
  return (
    <section className="stage page-grid pc-flow" aria-labelledby="plannr-flow-heading" data-pl-flow>
      <header className="pc-flow-head">
        <p className="t-meta">The transformation</p>
        <h2 id="plannr-flow-heading" className="t-head-2">
          One document in. A schedule out. The student signs off in the middle.
        </h2>
      </header>

      <ol className="pc-steps">
        <li className="pc-step pc-step-syllabus" data-pl-step="syllabus">
          <MarkArrow className="pc-step-arrow annotation ornament" />
          <h3 className="pc-step-word t-display">{syllabus.word}</h3>
          <p className="pc-step-body t-small">{syllabus.body}</p>
          <div className="pc-step-art">
            <DocumentPage variant="lines" />
          </div>
        </li>

        <li className="pc-step pc-step-extract" data-pl-step="extract">
          <MarkArrow className="pc-step-arrow annotation ornament" />
          <h3 className="pc-step-word t-display">{extract.word}</h3>
          <p className="pc-step-body t-small">{extract.body}</p>
          <ul className="pc-step-art pc-slips">
            {DEADLINES.map((d) => (
              <li key={d.id} className="pc-slip" data-pl-event={d.id}>
                <span className="pc-slip-type t-meta">{d.type}</span>
                <span className="pc-slip-title">{d.title}</span>
                <span className="pc-slip-from">{d.written}</span>
                <time className="pc-slip-date" dateTime={d.iso}>
                  {d.iso}
                </time>
                {d.inferred ? <span className="pc-slip-flag">Worked out, not stated</span> : null}
              </li>
            ))}
          </ul>
        </li>

        <li className="pc-step pc-step-review" data-pl-step="review">
          <MarkArrow className="pc-step-arrow annotation ornament" />
          <h3 className="pc-step-word t-display">{review.word}</h3>
          <p className="pc-step-body t-small">{review.body}</p>
          <figure className="pc-step-art pc-review">
            <Image
              src="/plannr/review-sample.png"
              alt="Plannr's review screen for a sample class. A week strip, then event cards for Problem Set 1 and Problem Set 2, each marked Accepted with Edit, Accept and Decline buttons, and a Sync button below."
              width={760}
              height={1652}
              sizes="(min-width: 64rem) 22vw, (min-width: 48rem) 40vw, 80vw"
              className="pc-review-img"
            />
            <figcaption className="t-caption">{FLOW_CAPTIONS.review}</figcaption>
          </figure>
        </li>

        <li className="pc-step pc-step-calendar" data-pl-step="calendar">
          <h3 className="pc-step-word t-display">{calendar.word}</h3>
          <p className="pc-step-body t-small">{calendar.body}</p>
          <figure className="pc-step-art pc-calendar">
            <TermGrid />
            <p className="sr-only">
              The term, weeks 1 to 11, with these dates marked:{" "}
              {DEADLINES.map((d) => `${d.title}, ${d.iso}`).join("; ")}.
            </p>
            <figcaption className="t-caption">{FLOW_CAPTIONS.calendar}</figcaption>
          </figure>
        </li>
      </ol>

    </section>
  );
}
