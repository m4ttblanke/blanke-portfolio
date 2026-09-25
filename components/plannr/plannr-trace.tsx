"use client";

import { createContext, useContext, useMemo, useReducer, type Dispatch, type ReactNode } from "react";
import { DocumentPage } from "./document-page";
import { TermGrid } from "./term-grid";
import { DEADLINES } from "@/lib/work/plannr-content";
import {
  TRACE_IDS,
  calendarSummary,
  cellStates,
  deadlineFor,
  initialTrace,
  isEngaged,
  isTraceId,
  receipt,
  slipNote,
  traceReducer,
  VERDICT_LABEL,
  type TraceAction,
  type TraceState,
} from "@/lib/work/plannr-trace";

// THE TRACE (M6B): the one client island on the Plannr case study, and the whole
// of its interaction. A visitor follows ONE deadline through the transformation
// the static spread already draws: a phrase on the syllabus, the record it became,
// a review slip, and its cell on the term grid. It is an editorial demonstration
// of the verified workflow, not Plannr running in the page.
//
// BOUNDARY. This file is the client boundary, and it is deliberately small:
//   TraceProvider   holds the state (a useReducer over lib/work/plannr-trace.ts) and renders no DOM
//   TracePage       the syllabus lines, the traced phrases as buttons
//   TraceStatus     the visible status line (the live region)
//   TraceReceipt    below 80rem only: a one-line, controlless echo of the traced deadline's state
//   TraceRecords    the extracted records, the active one marked
//   TraceSlip       the portfolio-level review slip that sits over the screenshot's plate
//   TraceCalendar   the term grid, with the accepted events placed
//   TraceReset      "Start over", after the review actions in DOM order (see its comment)
// Everything else in the transformation (the section, its headings, the four
// steps, the review screenshot and its plate, every caption) stays a server
// component in plannr-transformation.tsx and reaches this file only as children.
// State is in memory: no storage, no cookie, no URL, no request. A reload resets it.
//
// THE REVIEW SLIP is not part of the screenshot. The screenshot is a real bitmap
// of the app whose sample data (Problem Set 1, 2026-10-09) does not match this
// illustration (2027-01-15), so no pixel of it is a control. The slip is an
// editor's sheet laid over the spread: square registrar buttons on white paper,
// nothing like the app's dark rounded pills, on a part of the screenshot that
// carries no review information (the week strip).

type Trace = { state: TraceState; dispatch: Dispatch<TraceAction> };
const TraceContext = createContext<Trace | null>(null);

function useTrace(): Trace {
  const ctx = useContext(TraceContext);
  if (!ctx) throw new Error("Trace pieces must sit inside <TraceProvider>");
  return ctx;
}

export function TraceProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(traceReducer, undefined, initialTrace);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <TraceContext value={value}>{children}</TraceContext>;
}

/** A: the syllabus lines. Same page as the static spread; the first three titles are buttons. */
export function TracePage() {
  const { state, dispatch } = useTrace();
  return (
    <DocumentPage
      variant="lines"
      hooks
      trace={{
        ids: TRACE_IDS,
        selected: state.selected,
        verdicts: state.verdicts,
        onSelect: (id) => {
          if (isTraceId(id)) dispatch({ type: "select", id });
        },
      }}
    />
  );
}

/** The status line under the syllabus: the last thing that happened, in words. It is also the live region, so what is announced is what is shown. */
export function TraceStatus() {
  const { state } = useTrace();
  return (
    <div className="pc-trace-status">
      <p className="pc-trace-msg t-caption" role="status">
        {state.message}
      </p>
    </div>
  );
}

/**
 * The mobile trace receipt. Below 80rem the syllabus, the slip and the calendar are
 * a screen or more apart, so a selection would show nothing without scrolling. This
 * is a filing line under the syllabus that answers "what happened to the thing I
 * just selected?": tag, resolved date, verdict, and where it lands (or that it is not
 * sent). It is an ECHO: derived from the same state, no controls, no state of its own.
 * Plain text and not a live region: the status line above already announces every
 * change, so a screen reader hears each event once. The slot is always rendered (and
 * reserves two quiet lines) so a selection never moves the page; at 80rem and up the
 * four columns already read spatially and the slot is display: none.
 */
export function TraceReceipt() {
  const { state } = useTrace();
  const r = receipt(state);
  return (
    <div className="pc-tr-slot">
      {r ? (
        <p className="pc-tr" data-pl-receipt={r.tag} data-pl-verdict={r.verdict}>
          <span className="pc-tr-reg ornament" aria-hidden="true" />
          <span className="pc-tr-seg pc-tr-tag">
            <span aria-hidden="true">{r.tag}</span>
            <span className="sr-only">{r.title}</span>
          </span>{" "}
          <span className="pc-tr-seg pc-tr-date">
            <time dateTime={r.iso}>{r.iso}</time>
          </span>{" "}
          <span className="pc-tr-seg pc-tr-verdict">
            <span className="pc-tr-word">{r.verdictLabel}</span>
          </span>
          {r.tail ? (
            <>
              {" "}
              <span className="pc-tr-seg pc-tr-tail" data-kind={r.tail.kind}>
                {r.tail.text}
                {r.tail.kind === "cell" ? <span className="pc-tr-check ornament" aria-hidden="true" /> : null}
              </span>
            </>
          ) : null}
          {r.note ? (
            <>
              {" "}
              <span className="pc-tr-seg pc-tr-note">{r.note}</span>
            </>
          ) : null}
        </p>
      ) : null}
    </div>
  );
}

/** B: the extracted records. The active one gains ink, a pen rule and the phrase highlighted; the rest go quieter, never hidden. */
export function TraceRecords() {
  const { state } = useTrace();
  return (
    <ul className="pc-step-art pc-slips" data-pl-focus={state.selected ? "" : undefined}>
      {DEADLINES.map((d) => {
        const active = state.selected === d.id;
        const verdict = isTraceId(d.id) ? state.verdicts[d.id] : "unreviewed";
        return (
          <li
            key={d.id}
            className="pc-slip"
            data-pl-event={d.id}
            {...(active ? { "data-pl-active": "", "aria-current": "true" as const } : {})}
            {...(verdict !== "unreviewed" ? { "data-pl-verdict": verdict } : {})}
          >
            <span className="pc-slip-type t-meta">{d.type}</span>
            {verdict !== "unreviewed" ? <span className="pc-slip-verdict t-meta">{verdict}</span> : null}
            <span className="pc-slip-title">{d.title}</span>
            <span className="pc-slip-from">{d.written}</span>
            <time className="pc-slip-date" dateTime={d.iso}>
              {d.iso}
            </time>
            {d.inferred ? <span className="pc-slip-flag">Worked out, not stated</span> : null}
          </li>
        );
      })}
    </ul>
  );
}

/** C: the review slip. Present only while a deadline is selected. */
export function TraceSlip() {
  const { state, dispatch } = useTrace();
  if (!state.selected) return null;
  const d = deadlineFor(state.selected);
  const verdict = state.verdicts[state.selected];
  return (
    <div
      className="pc-rs"
      role="group"
      aria-label={`Review slip for ${d.title}`}
      data-pl-slip={d.id}
      data-pl-verdict={verdict}
    >
      <p className="pc-rs-head t-meta">
        <span>Review slip</span>
        <span className="pc-rs-stamp">{VERDICT_LABEL[verdict]}</span>
      </p>
      <p className="pc-rs-line">
        <span className="pc-rs-title">{d.title}</span>
        <time className="pc-rs-date" dateTime={d.iso}>
          {d.iso}
        </time>
      </p>
      <div className="pc-rs-actions">
        <button type="button" className="pc-rs-btn" aria-pressed={verdict === "accepted"} onClick={() => dispatch({ type: "accept" })}>
          Accept
        </button>
        <button type="button" className="pc-rs-btn" aria-describedby="pc-rs-note" onClick={() => dispatch({ type: "edit" })}>
          Edit
        </button>
        <button type="button" className="pc-rs-btn" aria-pressed={verdict === "declined"} onClick={() => dispatch({ type: "decline" })}>
          Decline
        </button>
      </div>
      <p className="pc-rs-note t-caption" id="pc-rs-note">
        {slipNote(state)}
      </p>
    </div>
  );
}

/** D: the term grid. Accepted events are placed; a declined one is struck; the one under review waits. */
export function TraceCalendar() {
  const { state } = useTrace();
  return (
    <>
      <TermGrid className={isEngaged(state) ? "pc-term-traced" : ""} states={cellStates(state)} />
      <p className="sr-only">{calendarSummary(state)}</p>
    </>
  );
}

/**
 * Start over. It lives at the end of the flow, after the review actions in DOM
 * order, so the primary keyboard path is phrase -> the other phrases -> Accept, Edit,
 * Decline -> Start over -> whatever follows, with no positive tabindex and no
 * forced focus. When it clears, the button hides itself (nothing is left to
 * clear), so focus goes to where the trace begins (the first phrase) before it
 * does: predictable, and never lost to <body>.
 */
export function TraceReset() {
  const { state, dispatch } = useTrace();
  return (
    <button
      type="button"
      className="pc-trace-clear t-meta"
      data-pl-shown={isEngaged(state) ? "" : undefined}
      onClick={(e) => {
        e.currentTarget.closest("[data-pl-flow]")?.querySelector<HTMLElement>("button[data-pl-deadline]")?.focus();
        dispatch({ type: "reset" });
      }}
    >
      Start over
    </button>
  );
}
