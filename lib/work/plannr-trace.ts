// THE TRACE: pure state for M6B, the one interaction on the Plannr case study.
//
// A visitor follows ONE deadline through the transformation the static spread
// already draws:
//
//   phrase on the syllabus  ->  its extracted record  ->  a review slip  ->  its cell on the term grid
//   (data-pl-deadline)          (data-pl-event)           (portfolio-level)   (data-pl-cell)
//
// It is an editorial demonstration of the verified workflow, NOT Plannr running
// in the page, so it holds no data of its own: every title, phrase and date is
// read from DEADLINES (lib/work/plannr-content.ts), the same source the static
// markup renders. The only thing added here is WHICH of those deadlines can be
// traced, and what a visitor's choices do to them.
//
// Framework-free on purpose (like lib/work/rank-demo.ts): the React layer in
// components/plannr/plannr-trace.tsx only wires these functions up, so every
// transition is tested without a DOM. No persistence and no network: the state
// lives in memory and a reload resets it.

import { DEADLINES, termDate, type Deadline } from "./plannr-content";

/** The three deadlines that can be traced: the first three on the page, one homework, one lab, one exam. */
export const TRACE_IDS = ["ps1", "obs1", "mid"] as const;
export type TraceId = (typeof TRACE_IDS)[number];

/** What the student has decided about one event. Selection is separate: an event can be looked at without changing its verdict. */
export type Verdict = "unreviewed" | "accepted" | "declined";

export type TraceState = {
  /** The deadline being followed, or none. */
  selected: TraceId | null;
  verdicts: Readonly<Record<TraceId, Verdict>>;
  /** Set when EDIT was pressed on the selected event: it only shows a note, it changes nothing. */
  edited: TraceId | null;
  /** The last thing that happened, in words. The visible status line AND the live region. */
  message: string;
};

export type TraceAction =
  | { type: "select"; id: TraceId }
  | { type: "accept" }
  | { type: "decline" }
  | { type: "edit" }
  | { type: "reset" };

export const REST_MESSAGE = "Trace a deadline. Select a highlighted one to follow it through.";

export function isTraceId(id: string): id is TraceId {
  return (TRACE_IDS as readonly string[]).includes(id);
}

/** The one deadline record a trace id stands for. Throws on an id the content does not hold, which a test would catch. */
export function deadlineFor(id: TraceId): Deadline {
  const d = DEADLINES.find((x) => x.id === id);
  if (!d) throw new Error(`No deadline "${id}" in DEADLINES`);
  return d;
}

/** deadline -> event -> cell. The record and the marked cell share the deadline's id; the cell is addressed by the resolved date. */
export function cellFor(id: TraceId): string {
  return deadlineFor(id).iso;
}

/** The cell a deadline lands on, worked out again from its week and weekday: what a test compares `cellFor` against. */
export function cellFromTerm(id: TraceId): string {
  const d = deadlineFor(id);
  return termDate(d.week, d.weekday);
}

export function initialTrace(): TraceState {
  return {
    selected: null,
    verdicts: { ps1: "unreviewed", obs1: "unreviewed", mid: "unreviewed" },
    edited: null,
    message: REST_MESSAGE,
  };
}

/** Any choice made yet. Drives the quieter treatment of everything not being traced. */
export function isEngaged(s: TraceState): boolean {
  return s.selected !== null || TRACE_IDS.some((id) => s.verdicts[id] !== "unreviewed");
}

export function acceptedIds(s: TraceState): TraceId[] {
  return TRACE_IDS.filter((id) => s.verdicts[id] === "accepted");
}

// ------------------------------------------------------------------ messages
// One line each, under ~110 characters: it is a visible status line under the
// syllabus, so a narrow column shows it in three lines at most.

function said(d: Deadline) {
  return `${d.title}, ${d.written}`;
}

const messages = {
  select: (d: Deadline, v: Verdict) =>
    v === "accepted"
      ? `${d.title} is accepted for the calendar, ${d.iso}. Select another to trace it.`
      : v === "declined"
        ? `${d.title} is declined and stays off the calendar. Accept it to bring it back.`
        : `${said(d)}, became ${d.iso}. The student decides: accept, edit or decline.`,
  deselect: () => REST_MESSAGE,
  accept: (d: Deadline) => `Accepted. ${d.title} goes on the calendar: ${d.iso}. Select another to trace it.`,
  unaccept: (d: Deadline) => `${d.title} is back to unreviewed and off the calendar.`,
  decline: (d: Deadline) => `Declined. ${d.title} stays off the calendar.`,
  undecline: (d: Deadline) => `${d.title} is back to unreviewed.`,
  edit: (d: Deadline) => `Edit. In Plannr the student changes the date of ${d.title} here. This page does not rebuild that.`,
  reset: () => `Cleared. ${REST_MESSAGE}`,
} as const;

// ------------------------------------------------------------------- reducer

function withVerdict(s: TraceState, id: TraceId, verdict: Verdict): Readonly<Record<TraceId, Verdict>> {
  return { ...s.verdicts, [id]: verdict };
}

/**
 * Pressing the selected deadline again clears the selection (the buttons are
 * toggles, so they say so with aria-pressed). Accept and decline are toggles
 * too: pressing the verdict you already gave takes it back to unreviewed. Edit
 * only ever shows its note. With nothing selected, accept, decline and edit do
 * nothing (the slip that carries them is not there).
 */
export function traceReducer(s: TraceState, a: TraceAction): TraceState {
  switch (a.type) {
    case "select": {
      if (!isTraceId(a.id)) return s;
      if (s.selected === a.id) return { ...s, selected: null, edited: null, message: messages.deselect() };
      return { ...s, selected: a.id, edited: null, message: messages.select(deadlineFor(a.id), s.verdicts[a.id]) };
    }
    case "accept": {
      if (!s.selected) return s;
      const id = s.selected;
      const d = deadlineFor(id);
      const undo = s.verdicts[id] === "accepted";
      return {
        ...s,
        verdicts: withVerdict(s, id, undo ? "unreviewed" : "accepted"),
        edited: null,
        message: undo ? messages.unaccept(d) : messages.accept(d),
      };
    }
    case "decline": {
      if (!s.selected) return s;
      const id = s.selected;
      const d = deadlineFor(id);
      const undo = s.verdicts[id] === "declined";
      return {
        ...s,
        verdicts: withVerdict(s, id, undo ? "unreviewed" : "declined"),
        edited: null,
        message: undo ? messages.undecline(d) : messages.decline(d),
      };
    }
    case "edit": {
      if (!s.selected) return s;
      return { ...s, edited: s.selected, message: messages.edit(deadlineFor(s.selected)) };
    }
    case "reset":
      return { ...initialTrace(), message: messages.reset() };
  }
}

// ------------------------------------------------------------------- reading

/** What one marked cell of the term grid should show. Only accepted events are placed; a declined one is struck; the one being reviewed waits. */
export type CellState = "accepted" | "declined" | "awaiting";

export function cellStates(s: TraceState): Partial<Record<TraceId, CellState>> {
  const out: Partial<Record<TraceId, CellState>> = {};
  for (const id of TRACE_IDS) {
    const v = s.verdicts[id];
    if (v === "accepted") out[id] = "accepted";
    else if (v === "declined") out[id] = "declined";
    else if (s.selected === id) out[id] = "awaiting";
  }
  return out;
}

/** The slip's own note: what it means for the selected event, in the slip's voice. */
export function slipNote(s: TraceState): string {
  if (!s.selected) return "";
  if (s.edited === s.selected) return "In Plannr the student can change the date here. This page does not rebuild that.";
  const v = s.verdicts[s.selected];
  if (v === "accepted") return "Accepted. This one goes on the calendar.";
  if (v === "declined") return "Declined. This one stays off the calendar.";
  return "Extracted from the syllabus. The student gets the final say.";
}

/** The sentence for people who cannot see the term grid (it is decorative): what has been placed on it. */
export function calendarSummary(s: TraceState): string {
  const placed = acceptedIds(s).map((id) => `${deadlineFor(id).title}, ${deadlineFor(id).iso}`);
  return placed.length === 0
    ? "Nothing accepted for the calendar yet."
    : `Accepted for the calendar: ${placed.join("; ")}.`;
}
