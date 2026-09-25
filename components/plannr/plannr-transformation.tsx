import Image from "next/image";
import { MarkArrow } from "@/components/design/marks";
import { DEADLINES, FLOW_CAPTIONS, FLOW_STEPS } from "@/lib/work/plannr-content";
import {
  TraceCalendar,
  TracePage,
  TraceProvider,
  TraceReceipt,
  TraceRecords,
  TraceReset,
  TraceSlip,
  TraceStatus,
} from "./plannr-trace";

// THE TRANSFORMATION: SYLLABUS -> EXTRACT -> REVIEW -> CALENDAR, the whole
// product in one static reading. A real sequence, so the four steps are a real
// ordered list and the step words are the page's second (and last) display
// moment. Not four cards: each step is a different KIND of artifact (a marked
// page, extracted records, the real review screen, a term sheet), joined by pen
// arrows that are decoration only (the order is the list's own).
//
// M6B progressively enhances this composition with ONE interaction, "trace a
// deadline": select a highlighted phrase, watch its record activate, review it on
// a portfolio-level slip, accept it, and see its cell placed on the term grid. The
// section, its headings, the four steps, the review screenshot and its plate, and
// every caption stay SERVER-rendered here. Only five small leaves are client
// components (components/plannr/plannr-trace.tsx, the whole client boundary), and
// they reach this file as the pieces below. Hooks:
//   data-pl-flow                    the section root
//   data-pl-step="syllabus|..."     each step
//   data-pl-deadline="ps1"          the phrase on the page (a button for the three traceable ones)
//   data-pl-deadline-when="ps1"     its written date; unique to this section
//   data-pl-event="ps1"             its extracted record (li) AND its marked cell
//   data-pl-cell="2027-01-15"       every cell of the term grid
//   data-pl-review                  the plate around the real review screenshot
// The screenshot is a bitmap of the real app and stays inert: its sample shows the
// app's own Problem Set 1, dated 2026-10-09, not this illustration's 2027-01-15,
// so the review slip (TraceSlip) is drawn separately and laid over the plate, and
// no pixel of the image is ever a control. At rest nothing has been chosen and the
// spread reads exactly as the approved static one.
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

      <TraceProvider>
        <ol className="pc-steps">
          <li className="pc-step pc-step-syllabus" data-pl-step="syllabus">
            <MarkArrow className="pc-step-arrow annotation ornament" />
            <h3 className="pc-step-word t-display">{syllabus.word}</h3>
            <p className="pc-step-body t-small">{syllabus.body}</p>
            <div className="pc-step-art">
              <TracePage />
            </div>
            <TraceReceipt />
            <TraceStatus />
          </li>

          <li className="pc-step pc-step-extract" data-pl-step="extract">
            <MarkArrow className="pc-step-arrow annotation ornament" />
            <h3 className="pc-step-word t-display">{extract.word}</h3>
            <p className="pc-step-body t-small">{extract.body}</p>
            <TraceRecords />
          </li>

          <li className="pc-step pc-step-review" data-pl-step="review">
            <MarkArrow className="pc-step-arrow annotation ornament" />
            <h3 className="pc-step-word t-display">{review.word}</h3>
            <p className="pc-step-body t-small">{review.body}</p>
            <figure className="pc-step-art pc-review">
              <div className="pc-review-plate" data-pl-review>
                <Image
                  src="/plannr/review-sample.png"
                  alt="Plannr's review screen for a sample class. A week strip, then event cards for Problem Set 1 and Problem Set 2, each marked Accepted with Edit, Accept and Decline buttons, and a Sync button below."
                  width={760}
                  height={1652}
                  sizes="(min-width: 64rem) 22vw, (min-width: 48rem) 40vw, 80vw"
                  className="pc-review-img"
                />
                <TraceSlip />
              </div>
              <figcaption className="t-caption">{FLOW_CAPTIONS.review}</figcaption>
            </figure>
          </li>

          <li className="pc-step pc-step-calendar" data-pl-step="calendar">
            <h3 className="pc-step-word t-display">{calendar.word}</h3>
            <p className="pc-step-body t-small">{calendar.body}</p>
            <figure className="pc-step-art pc-calendar">
              <TraceCalendar />
              <p className="sr-only">
                The term, weeks 1 to 11, with these dates marked:{" "}
                {DEADLINES.map((d) => `${d.title}, ${d.iso}`).join("; ")}.
              </p>
              <figcaption className="t-caption">{FLOW_CAPTIONS.calendar}</figcaption>
            </figure>
            <TraceReset />
          </li>
        </ol>
      </TraceProvider>
    </section>
  );
}
