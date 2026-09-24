// @vitest-environment node
import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { DocumentPage } from "../../components/plannr/document-page";
import { TermGrid } from "../../components/plannr/term-grid";
import { TraceCalendar, TracePage, TraceProvider, TraceRecords, TraceSlip, TraceStatus } from "../../components/plannr/plannr-trace";
import { DEADLINES, FLOW_STEPS } from "../../lib/work/plannr-content";
import {
  REST_MESSAGE,
  TRACE_IDS,
  acceptedIds,
  calendarSummary,
  cellFor,
  cellFromTerm,
  cellStates,
  deadlineFor,
  initialTrace,
  isEngaged,
  isTraceId,
  slipNote,
  traceReducer,
  type TraceAction,
  type TraceId,
  type TraceState,
} from "../../lib/work/plannr-trace";

const root = join(__dirname, "../..");
const read = (p: string) => readFileSync(join(root, p), "utf8");
const strip = (src: string) => src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1");
const css = read("components/plannr/plannr.css");
const island = strip(read("components/plannr/plannr-trace.tsx"));
const trace = strip(read("lib/work/plannr-trace.ts"));
const flow = strip(read("components/plannr/plannr-transformation.tsx"));

const run = (...actions: TraceAction[]): TraceState => actions.reduce(traceReducer, initialTrace());
const sel = (id: TraceId): TraceAction => ({ type: "select", id });

describe("M6B trace state: the deadline -> event -> calendar-cell mapping", () => {
  it("traces three deadlines, all from the existing DEADLINES content, one of each kind", () => {
    expect(TRACE_IDS).toEqual(["ps1", "obs1", "mid"]);
    expect(TRACE_IDS.map((id) => deadlineFor(id).type)).toEqual(["Homework", "Lab", "Exam"]);
    for (const id of TRACE_IDS) expect(DEADLINES.map((d) => d.id)).toContain(id);
    expect(isTraceId("ps1")).toBe(true);
    expect(isTraceId("final")).toBe(false);
  });

  it("deadline -> cell: each traced deadline lands on the ISO date the transformation already shows", () => {
    expect(cellFor("ps1")).toBe("2027-01-15");
    expect(cellFor("obs1")).toBe("2027-01-27");
    expect(cellFor("mid")).toBe("2027-02-05");
    for (const id of TRACE_IDS) expect(cellFor(id), id).toBe(cellFromTerm(id));
  });

  it("event -> cell: the term grid marks that exact cell with that exact event id, and no second source of dates exists", () => {
    const html = renderToStaticMarkup(createElement(TermGrid));
    for (const id of TRACE_IDS) expect(html).toContain(`data-pl-cell="${cellFor(id)}" data-pl-event="${id}"`);
    // the trace module holds no date, title or phrase of its own
    expect(trace).not.toMatch(/\d{4}-\d{2}-\d{2}/);
    expect(trace).not.toMatch(/Problem Set|Observation Report|Midterm/);
  });

  it("deadline -> record: every record in the island carries the deadline's own id, title, phrase and date", () => {
    const html = renderToStaticMarkup(createElement(TraceProvider, null, createElement(TraceRecords)));
    for (const d of DEADLINES) {
      expect(html).toContain(`data-pl-event="${d.id}"`);
      expect(html).toContain(d.title);
      expect(html).toContain(d.written);
      expect(html).toContain(`dateTime="${d.iso}"`);
    }
  });
});

describe("M6B trace state: selection, accept, decline, edit, reset", () => {
  it("starts at rest: nothing selected, nothing decided, the cue as the message", () => {
    const s = initialTrace();
    expect(s.selected).toBeNull();
    expect(Object.values(s.verdicts)).toEqual(["unreviewed", "unreviewed", "unreviewed"]);
    expect(s.message).toBe(REST_MESSAGE);
    expect(isEngaged(s)).toBe(false);
    expect(cellStates(s)).toEqual({});
    expect(slipNote(s)).toBe("");
  });

  it("selecting shows the deadline's own words and date; it does not change any verdict", () => {
    const s = run(sel("ps1"));
    expect(s.selected).toBe("ps1");
    expect(s.message).toContain("Problem Set 1");
    expect(s.message).toContain("due Friday of Week 2");
    expect(s.message).toContain("2027-01-15");
    expect(s.verdicts.ps1).toBe("unreviewed");
    expect(cellStates(s)).toEqual({ ps1: "awaiting" });
    expect(isEngaged(s)).toBe(true);
  });

  it("selecting another moves the selection (exactly one at a time); pressing the selected one clears it", () => {
    expect(run(sel("ps1"), sel("obs1")).selected).toBe("obs1");
    const cleared = run(sel("ps1"), sel("ps1"));
    expect(cleared.selected).toBeNull();
    expect(cleared.message).toBe(REST_MESSAGE);
    expect(isEngaged(cleared)).toBe(false);
  });

  it("ACCEPT places the selected event's cell and says so; it is the whole demonstration path", () => {
    const s = run(sel("ps1"), { type: "accept" });
    expect(s.verdicts.ps1).toBe("accepted");
    expect(cellStates(s)).toEqual({ ps1: "accepted" });
    expect(acceptedIds(s)).toEqual(["ps1"]);
    expect(s.message).toMatch(/^Accepted\./);
    expect(s.message).toContain("2027-01-15");
    expect(slipNote(s)).toMatch(/goes on the calendar/);
    expect(calendarSummary(s)).toBe("Accepted for the calendar: Problem Set 1, 2027-01-15.");
  });

  it("accepting is a toggle: pressing ACCEPT again takes it back to unreviewed and off the calendar", () => {
    const s = run(sel("ps1"), { type: "accept" }, { type: "accept" });
    expect(s.verdicts.ps1).toBe("unreviewed");
    expect(cellStates(s)).toEqual({ ps1: "awaiting" });
    expect(calendarSummary(s)).toBe("Nothing accepted for the calendar yet.");
  });

  it("DECLINE excludes the event from the demonstration calendar", () => {
    const s = run(sel("obs1"), { type: "decline" });
    expect(s.verdicts.obs1).toBe("declined");
    expect(cellStates(s)).toEqual({ obs1: "declined" });
    expect(acceptedIds(s)).toEqual([]);
    expect(s.message).toMatch(/^Declined\./);
    expect(slipNote(s)).toMatch(/stays off the calendar/);
    expect(run(sel("obs1"), { type: "decline" }, { type: "decline" }).verdicts.obs1).toBe("unreviewed");
  });

  it("reselecting a decided event and changing its mind works in both directions", () => {
    let s = run(sel("obs1"), { type: "decline" }, sel("mid"), sel("obs1"));
    expect(s.message).toMatch(/declined/);
    s = traceReducer(s, { type: "accept" });
    expect(s.verdicts.obs1).toBe("accepted");
    s = run(sel("mid"), { type: "accept" }, { type: "decline" });
    expect(s.verdicts.mid).toBe("declined");
    s = traceReducer(traceReducer(s, sel("mid")), sel("mid")); // deselect, reselect
    expect(s.selected).toBe("mid");
    expect(s.verdicts.mid).toBe("declined");
  });

  it("EDIT is only an editorial note: it changes no verdict and no cell, and the next action clears it", () => {
    const before = run(sel("ps1"));
    const s = traceReducer(before, { type: "edit" });
    expect(s.edited).toBe("ps1");
    expect(s.verdicts).toEqual(before.verdicts);
    expect(cellStates(s)).toEqual(cellStates(before));
    expect(slipNote(s)).toMatch(/does not rebuild that/);
    expect(s.message).toMatch(/does not rebuild that/);
    expect(traceReducer(s, { type: "accept" }).edited).toBeNull();
    expect(traceReducer(s, sel("obs1")).edited).toBeNull();
  });

  it("several events can be processed independently", () => {
    const s = run(sel("ps1"), { type: "accept" }, sel("obs1"), { type: "decline" }, sel("mid"), { type: "accept" });
    expect(s.verdicts).toEqual({ ps1: "accepted", obs1: "declined", mid: "accepted" });
    expect(cellStates(s)).toEqual({ ps1: "accepted", obs1: "declined", mid: "accepted" });
    expect(acceptedIds(s)).toEqual(["ps1", "mid"]);
    expect(calendarSummary(s)).toBe("Accepted for the calendar: Problem Set 1, 2027-01-15; Midterm Exam, 2027-02-05.");
  });

  it("reset returns to rest and says so", () => {
    const s = run(sel("ps1"), { type: "accept" }, sel("obs1"), { type: "reset" });
    expect(s).toEqual({ ...initialTrace(), message: `Cleared. ${REST_MESSAGE}` });
  });

  it("accept, decline and edit with nothing selected do nothing (the slip that carries them is absent)", () => {
    const rest = initialTrace();
    for (const type of ["accept", "decline", "edit"] as const) expect(traceReducer(rest, { type })).toBe(rest);
    expect(traceReducer(rest, { type: "select", id: "final" as TraceId })).toBe(rest);
  });

  it("is pure: it never mutates the state it was given", () => {
    const s = run(sel("ps1"));
    const snapshot = JSON.stringify(s);
    traceReducer(s, { type: "accept" });
    traceReducer(s, { type: "decline" });
    traceReducer(s, { type: "reset" });
    expect(JSON.stringify(s)).toBe(snapshot);
    expect(Object.isFrozen(initialTrace().verdicts)).toBe(false); // fresh object each time, so two visitors never share state
    expect(initialTrace().verdicts).not.toBe(initialTrace().verdicts);
  });

  it("every message fits the reserved status line (four lines of a narrow column) and is plain, honest text", () => {
    const states = [run(sel("ps1")), run(sel("obs1")), run(sel("mid")), ...TRACE_IDS.flatMap((id) => [
      run(sel(id), { type: "accept" }), run(sel(id), { type: "decline" }), run(sel(id), { type: "edit" }),
      run(sel(id), { type: "accept" }, { type: "accept" }), run(sel(id), { type: "decline" }, { type: "decline" }),
      run(sel(id), { type: "accept" }, sel(id)), run(sel(id), { type: "decline" }, sel(id)),
    ]), run({ type: "reset" })];
    for (const s of states) {
      expect(s.message.length, s.message).toBeLessThanOrEqual(115);
      expect(s.message).not.toMatch(/AI|thinking|scanning|extracting…|accurate|instantly|seconds|users?\b/i);
    }
  });
});

describe("M6B trace: what is rendered (server output at rest, which is what hydration must match)", () => {
  const rest = (el: ReturnType<typeof createElement>) => renderToStaticMarkup(createElement(TraceProvider, null, el));

  it("the syllabus phrases are real buttons named for their meaning, unpressed at rest; the other rows stay plain text", () => {
    const html = rest(createElement(TracePage));
    const buttons = [...html.matchAll(/<button[^>]*>/g)].map((m) => m[0]);
    expect(buttons).toHaveLength(3);
    for (const id of TRACE_IDS) {
      const d = deadlineFor(id);
      const b = buttons.find((x) => x.includes(`data-pl-deadline="${id}"`));
      expect(b, id).toBeDefined();
      expect(b).toContain('type="button"');
      expect(b).toContain('aria-pressed="false"');
      expect(b).toContain(`aria-label="Trace ${d.title}, ${d.written}"`);
    }
    // the untraced rows keep the static hooks and no control
    expect(html).toContain('data-pl-deadline="final"');
    expect(html).toContain('data-pl-deadline-when="ps1"');
    expect(html).not.toMatch(/data-pl-(selected|verdict)/);
  });

  it("at rest there is no review slip, no pressed control, no verdict and no placed cell", () => {
    expect(rest(createElement(TraceSlip))).toBe("");
    expect(rest(createElement(TraceRecords))).not.toMatch(/data-pl-(active|verdict)|aria-current/);
    const cal = rest(createElement(TraceCalendar));
    expect(cal).not.toMatch(/data-pl-state/);
    expect(cal).toContain("Nothing accepted for the calendar yet.");
  });

  it("the status line is the live region and the only place the visitor is told what happened", () => {
    const html = rest(createElement(TraceStatus));
    expect(html).toMatch(/<p class="pc-trace-msg t-caption" role="status">Trace a deadline\./);
    expect(html).toContain("Start over");
    expect(html).not.toContain("data-pl-shown"); // hidden at rest, and out of the tab order with it
  });

  it("the term grid and the syllabus are byte-identical to the static M6A output when no trace state is passed", () => {
    expect(renderToStaticMarkup(createElement(TermGrid, { states: undefined }))).toBe(renderToStaticMarkup(createElement(TermGrid)));
    expect(renderToStaticMarkup(createElement(TermGrid, { states: {} }))).toBe(renderToStaticMarkup(createElement(TermGrid)));
    const plain = renderToStaticMarkup(createElement(DocumentPage, { variant: "lines", hooks: true }));
    expect(renderToStaticMarkup(createElement(DocumentPage, { variant: "lines", hooks: true, trace: undefined }))).toBe(plain);
    expect(plain).not.toMatch(/<button|data-pl-trace|data-pl-selected|data-pl-verdict|aria-pressed/);
    for (const v of ["full", "fragment"] as const) expect(renderToStaticMarkup(createElement(DocumentPage, { variant: v }))).not.toMatch(/<button|data-pl-trace/);
  });

  it("only the traced cells carry state, and only when a state is passed", () => {
    const html = renderToStaticMarkup(createElement(TermGrid, { states: { ps1: "accepted", obs1: "declined", mid: "awaiting" } }));
    expect(html).toContain('data-pl-cell="2027-01-15" data-pl-event="ps1" data-pl-state="accepted"');
    expect(html).toContain('data-pl-cell="2027-01-27" data-pl-event="obs1" data-pl-state="declined"');
    expect(html).toContain('data-pl-cell="2027-02-05" data-pl-event="mid" data-pl-state="awaiting"');
    expect([...html.matchAll(/data-pl-state/g)]).toHaveLength(3);
  });

  it("the review slip's controls are real buttons, with the decisions exposed as pressed state and a described Edit", () => {
    const src = read("components/plannr/plannr-trace.tsx");
    expect(src.match(/<button[\s\S]*?<\/button>/g)?.filter((b) => /pc-rs-btn/.test(b))).toHaveLength(3);
    expect(src).toMatch(/aria-pressed=\{verdict === "accepted"\}/);
    expect(src).toMatch(/aria-pressed=\{verdict === "declined"\}/);
    expect(src).toMatch(/aria-describedby="pc-rs-note"/);
    expect(src).toMatch(/role="group"/);
    expect(src).toMatch(/aria-label=\{`Review slip for \$\{d\.title\}`\}/);
    expect(src).toMatch(/<time className="pc-rs-date" dateTime=\{d\.iso\}>/);
  });
});

describe("M6B trace: the client boundary is narrow, and it keeps no data anywhere", () => {
  it("exactly one file under components/plannr is a client module, and no route, page or parent became one", () => {
    const dir = join(root, "components/plannr");
    const clients = readdirSync(dir).filter((f) => f.endsWith(".tsx") && /^\s*"use client"/.test(read(`components/plannr/${f}`)));
    expect(clients).toEqual(["plannr-trace.tsx"]);
    expect(read("app/(public)/projects/plannr/page.tsx")).not.toMatch(/use client/);
    expect(read("lib/work/plannr-trace.ts")).not.toMatch(/use client/);
  });

  it("the island exports only its provider and five leaves; the section, steps, screenshot and captions stay server-rendered", () => {
    expect([...island.matchAll(/export function (\w+)/g)].map((m) => m[1])).toEqual([
      "TraceProvider", "TracePage", "TraceStatus", "TraceRecords", "TraceSlip", "TraceCalendar",
    ]);
    expect(flow).toMatch(/<TraceProvider>/);
    for (const server of ["<h3", "<Image", "<figcaption", "<ol className=\"pc-steps\">", "<MarkArrow"]) expect(flow).toContain(server);
    expect(island).not.toMatch(/next\/image|<Image|<figure|<figcaption|<h[1-6]/);
  });

  it("never touches storage, cookies, the URL, history, timers or the network", () => {
    const code = island + trace;
    expect(code).not.toMatch(/localStorage|sessionStorage|indexedDB|document\.cookie|cookies?\(|caches\b/);
    expect(code).not.toMatch(/\bfetch\s*\(|XMLHttpRequest|WebSocket|EventSource|sendBeacon|navigator\./);
    expect(code).not.toMatch(/useRouter|usePathname|useSearchParams|URLSearchParams|history\.|location\.|window\./);
    expect(code).not.toMatch(/setTimeout|setInterval|requestAnimationFrame|useEffect|useLayoutEffect/);
    expect(code).not.toMatch(/convex|workos|authkit|plannr-api|onrender|tryplannr/i);
    expect(island).not.toMatch(/Math\.random|Date\.now|new Date/);
  });

  it("imports only React, the shared plannr pieces and its own pure module: no new dependency", () => {
    const imports = [...read("components/plannr/plannr-trace.tsx").matchAll(/from "([^"]+)"/g)].map((m) => m[1]);
    expect(imports.sort()).toEqual(["./document-page", "./term-grid", "@/lib/work/plannr-content", "@/lib/work/plannr-trace", "react"].sort());
    const pkg = JSON.parse(read("package.json"));
    expect(Object.keys(pkg.dependencies).sort()).toEqual(["@workos-inc/authkit-nextjs", "convex", "next", "react", "react-dom"]);
    expect(Object.keys(pkg.devDependencies).sort()).toEqual([
      "@edge-runtime/vm", "@tailwindcss/postcss", "@types/node", "@types/react", "@types/react-dom", "convex-test",
      "eslint", "eslint-config-next", "tailwindcss", "typescript", "vitest",
    ]);
  });

  it("focus is never forced except to send Start over back to the first phrase (which the button is about to hide)", () => {
    expect([...island.matchAll(/\.focus\(/g)]).toHaveLength(1);
    expect(island).toMatch(/closest\("\[data-pl-flow\]"\)\?\.querySelector<HTMLElement>\("button\[data-pl-deadline\]"\)\?\.focus\(\)/);
    expect(island).not.toMatch(/scrollIntoView|scrollTo|\.blur\(/);
  });
});

describe("M6B trace: honesty and the review slip", () => {
  it("the real screenshot stays a bare, inert image; the slip is a sibling laid over its plate, never inside the bitmap", () => {
    expect(flow).toMatch(/<div className="pc-review-plate" data-pl-review>\s*<Image[\s\S]*?\/>\s*<TraceSlip \/>\s*<\/div>/);
    const image = flow.match(/<Image[\s\S]*?\/>/)![0];
    expect(image).not.toMatch(/onClick|role=|tabIndex|useMap|aria-hidden/);
    expect(flow).not.toMatch(/<button|<a\b|onClick/);
    expect(image).toContain('src="/plannr/review-sample.png"');
    expect(image).toContain("Sync button below");
  });

  it("the slip is drawn nothing like the app: white sheet, navy rule, square uppercase buttons; no green, no red, no rounded pills", () => {
    const slip = css.slice(css.indexOf(".pc-rs {"), css.indexOf("/* D: the term grid"));
    expect(slip).toMatch(/\.pc-rs-btn\s*\{[^}]*border-radius:\s*0/);
    expect(slip).toMatch(/text-transform:\s*uppercase/);
    expect([...slip.matchAll(/border-radius:\s*([^;]+);/g)].map((m) => m[1].trim())).toEqual(["0"]);
    expect(slip).not.toMatch(/green|red|purple|rgba?\(|#[0-9a-f]{3,6}/i);
    expect(slip).toMatch(/\.pc-rs::before\s*\{[^}]*background-color:\s*var\(--pc-sheet\)/);
  });

  it("the slip sits on the screenshot's week strip only: it starts below the course title and ends above the first event card", () => {
    expect(css).toMatch(/\.pc-rs\s*\{[^}]*inset-block-start:\s*19%[^}]*block-size:\s*28%/);
    // 19% + 28% = 47%: the week strip ends at 46.6% of the capture, the first card starts at 48.4%
    expect(19 + 28).toBeLessThan(48.4);
  });

  it("its tilt is on the slab behind the words (named step, scaled by --chaos), its overhang is scaled by --chaos, and no text is rotated", () => {
    expect(css).toMatch(/\.pc-rs::before\s*\{[^}]*rotate:\s*calc\(var\(--tilt-1\) \* var\(--chaos\) \* -1\)/);
    expect(css).toMatch(/\.pc-rs\s*\{[^}]*inset-inline:\s*calc\(-0\.6rem \* var\(--chaos\)\)/);
    expect(strip(css)).not.toMatch(/\.pc-rs(?!::before)[^{]*\{[^}]*(?<![-\w])rotate/);
  });

  it("no scene of the extraction is faked: no spinner, no 'thinking', no typewriter, no scanning beam, no particles, no confetti", () => {
    const all = strip(css) + island + trace + flow;
    expect(all).not.toMatch(/spinner|thinking|typewriter|scanning|particle|confetti|shimmer|skeleton|sparkle|glow/i);
    expect(all).not.toMatch(/@keyframes|animation\s*:|animation-name/);
  });

  it("the trace claims nothing the evidence does not: no counts, accuracy, latency or real-user language", () => {
    const words = strip(read("lib/work/plannr-trace.ts")) + island;
    expect(words).not.toMatch(/\d+%|accura|latency|faster|users?\b|customers?|real-time|live data/i);
  });

  it("the four steps are still the same ordered list in the same order", () => {
    expect(FLOW_STEPS.map((s) => s.key)).toEqual(["syllabus", "extract", "review", "calendar"]);
    const order = ["data-pl-step=\"syllabus\"", "data-pl-step=\"extract\"", "data-pl-step=\"review\"", "data-pl-step=\"calendar\""].map((k) => flow.indexOf(k));
    expect(order).toEqual([...order].sort((a, b) => a - b));
    expect(order.every((i) => i > 0)).toBe(true);
  });
});

describe("M6B trace: motion, reduced motion, Clean Copy, touch", () => {
  const trace_css = css.slice(css.lastIndexOf("/*", css.indexOf("THE TRACE (M6B)")), css.lastIndexOf("/*", css.indexOf("THE PRODUCT */")));
  const globals = read("app/globals.css");

  it("every transition names its properties (never `all`) and takes its duration from the motion tokens, at most --dur-quick", () => {
    const transitions = [...strip(trace_css).matchAll(/transition\s*:\s*([^;]+);/g)].map((m) => m[1]);
    expect(transitions.length).toBeGreaterThan(6);
    for (const t of transitions) {
      expect(t).not.toMatch(/\ball\b/);
      for (const part of t.split(/,(?![^(]*\))/)) {
        expect(part, part).toMatch(/^\s*[a-z-]+ var\(--dur-quick\) var\(--ease-out\)\s*$/);
      }
    }
    expect(strip(trace_css)).not.toMatch(/\b\d+(\.\d+)?m?s\b/); // no raw durations
  });

  it("prefers-reduced-motion zeroes every duration token, so every state change is immediate and nothing depends on movement", () => {
    expect(globals).toMatch(/@media \(prefers-reduced-motion: reduce\)\s*\{\s*:root\s*\{[^}]*--dur-quick:\s*0\.01ms/);
    expect(strip(css)).not.toMatch(/prefers-reduced-motion/); // the tokens carry it; a second, competing rule would be a second source of truth
    // the arrival is a transition from @starting-style, not a keyframe animation
    expect(css).toMatch(/@starting-style\s*\{\s*\.pc-rs\s*\{\s*opacity:\s*0;\s*translate:/);
  });

  it("every state is carried by text, outline style or shape as well as colour", () => {
    expect(trace_css).toMatch(/\.pc-cell\[data-pl-state="awaiting"\]\s*\{[^}]*outline-style:\s*dashed/);
    expect(trace_css).toMatch(/\.pc-cell\[data-pl-state="accepted"\]::after\s*\{[^}]*clip-path:\s*polygon/);
    expect(trace_css).toMatch(/\.pc-cell\[data-pl-state="declined"\] \.pc-slip-tag|\.pc-cell\[data-pl-state="declined"\] \.pc-cell-tag\s*\{[^}]*line-through/);
    expect(island).toMatch(/pc-slip-verdict t-meta">\{verdict\}/);
    expect(island).toMatch(/STAMP = \{ unreviewed: "To review", accepted: "Accepted", declined: "Declined" \}/);
  });

  it("Clean Copy: decoration goes, semantic state stays", () => {
    expect(css).toMatch(/:root\[data-copy="clean"\] \.pc-page-list li\[data-pl-selected\]::before,[\s\S]*?\{\s*display:\s*none/);
    expect(css).toMatch(/:root\[data-copy="clean"\] \.pc-page-list li\[data-pl-selected\] \.pc-hl\s*\{[^}]*text-decoration-thickness:\s*4px/);
    // the selected underline (4px) is heavier than the plain highlight's Clean Copy underline (2px)
    expect(css).toMatch(/:root\[data-copy="clean"\] \.pc-hl\s*\{[^}]*text-decoration-thickness:\s*2px/);
    // the slip's tilt and overhang are chaos-scaled, so they are 0 under Clean Copy; nothing else needs hiding
    expect(trace_css).not.toMatch(/data-copy="clean"[^{]*\.pc-rs/);
    // the rest-state affordance (dotted underline) yields to Clean Copy's own solid underline
    expect(trace_css).toMatch(/:root:not\(\[data-copy="clean"\]\) \.pc-trace-btn \.pc-hl/);
  });

  it("touch: the hit area is stretched over the whole row without resizing the type, and rows reach 44px on a coarse pointer", () => {
    expect(trace_css).toMatch(/\.pc-trace-btn::after\s*\{[^}]*position:\s*absolute;[^}]*inset-block:\s*-0\.35rem;[^}]*inset-inline:\s*0/);
    expect(trace_css).toMatch(/\.pc-page-list li\[data-pl-trace\]\s*\{\s*position:\s*relative/);
    expect(trace_css).toMatch(/@media \(pointer: coarse\)\s*\{\s*\.pc-page-list li\[data-pl-trace\]\s*\{\s*padding-block:\s*0\.7rem/);
    expect(trace_css).toMatch(/\.pc-rs-btn\s*\{[^}]*min-block-size:\s*2\.75rem/);
    expect(trace_css).toMatch(/\.pc-trace-clear\s*\{[^}]*min-block-size:\s*2\.75rem/);
    // the phrase button takes on none of a control's look
    expect(trace_css).toMatch(/\.pc-trace-btn\s*\{[^}]*padding:\s*0;[^}]*border:\s*0;[^}]*background:\s*none/);
  });

  it("visible focus is the global rule (3px, offset 3px); nothing here removes an outline", () => {
    expect(strip(css)).not.toMatch(/outline\s*:\s*(none|0)\b/);
    expect(globals).toMatch(/:focus-visible\s*\{\s*outline:\s*3px solid var\(--focus\)/);
  });

  it("the status line's height is reserved, so a longer message never moves the page", () => {
    expect(trace_css).toMatch(/\.pc-trace-status\s*\{[^}]*min-block-size:\s*calc\(4 \* 1\.4em\)/);
    expect(trace_css).toMatch(/\.pc-trace-clear:not\(\[data-pl-shown\]\)\s*\{\s*visibility:\s*hidden/);
  });

  it("uses tokens only: no raw color, no z-index, no cursor other than the native pointer", () => {
    expect(strip(trace_css)).not.toMatch(/#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(|z-index/);
    expect([...strip(trace_css).matchAll(/cursor\s*:\s*(\S+)/g)].map((m) => m[1]).every((v) => v === "pointer;")).toBe(true);
  });
});

// The M6A and M2 to M5 freezes, pinned by content hash of every file at the approved commit (3d36bfa).
// If one of these fails, a frozen file was edited: that needs a deliberate decision, not a test update.
describe("freeze: M6A spreads and M2 to M5 files are byte-identical to the approved commits", () => {
  const sha = (p: string) => createHash("sha256").update(readFileSync(join(root, p))).digest("hex").slice(0, 16);
  const frozen: Record<string, string> = {
    "components/plannr/plannr-hero.tsx": "b747693a900be87b",
    "components/plannr/plannr-document.tsx": "58dbcd94d1046d16",
    "components/plannr/plannr-product.tsx": "b2389b2434a5542b",
    "components/plannr/plannr-decisions.tsx": "d385f9709f66d317",
    "components/plannr/plannr-system.tsx": "d236c21b7a973ccf",
    "components/plannr/plannr-receipt.tsx": "89cad7bc8f767fe6",
    "lib/work/plannr-content.ts": "8d9e26ff85c07447",
    "app/(public)/projects/rankle/page.tsx": "ca8ceaad180545bd",
    "app/layout.tsx": "ccd0514ea23da07c",
    "components/cover/cover.css": "a8de6934f26ddf81",
    "components/cover/cover.tsx": "eee0a718d02a4b74",
    "components/rankle/rank-glyphs.tsx": "82dd0a61d2047359",
    "components/rankle/rankle-argument.tsx": "2773dd15e5699b05",
    "components/rankle/rankle-case.tsx": "8fe50d02c833de30",
    "components/rankle/rankle-hero.tsx": "5a3f554f02e242d9",
    "components/rankle/rankle-rank-interaction.tsx": "7ecceb3c5604c6fe",
    "components/rankle/rankle-receipt.tsx": "5de767b9a04a2952",
    "components/rankle/rankle-system.tsx": "b6e8f323064559f7",
    "components/rankle/rankle-thing.tsx": "d0e04a717a9070ec",
    "components/rankle/rankle.css": "bed6251487c1b6fc",
    "components/shell/page.tsx": "5c038f8a77d46cfc",
    "components/shell/primary-nav.tsx": "422dd27116deb5f9",
    "components/shell/shell.css": "f5316dc51b683aff",
    "components/shell/site-footer.tsx": "d3e3914b25bbb982",
    "components/shell/site-header.tsx": "791a7693d34b3c8b",
    "components/shell/site-shell.tsx": "8bb0ca67d8bc110d",
    "components/work/plannr-poster.tsx": "bead37b0f37fa7d3",
    "components/work/rankle-poster.tsx": "fa2189992c94268f",
    "components/work/selected-work.css": "24b0b76af7482685",
    "components/work/selected-work.tsx": "a97948bd2f1da88a",
    "lib/work/projects.ts": "206fe820c0407874",
    "lib/work/rank-demo.ts": "cbcd56fc59d8a987",
    "lib/work/rankle-content.ts": "a720f662fafffd10",
  };

  it("pins every frozen file", () => {
    for (const [file, hash] of Object.entries(frozen)) expect(sha(file), file).toBe(hash);
  });

  it("the M4 Plannr href is still /projects/plannr and no frozen spread learned about the trace", () => {
    expect(read("lib/work/projects.ts")).toContain('href: "/projects/plannr"');
    for (const f of ["hero", "document", "product", "decisions", "system", "receipt"]) {
      expect(read(`components/plannr/plannr-${f}.tsx`), f).not.toMatch(/plannr-trace|Trace/);
    }
  });

  it("the transformation's approved copy and structure are unchanged: same content module, same headings, same four steps", () => {
    expect(flow).toContain("One document in. A schedule out. The student signs off in the middle.");
    expect(flow).toContain("{syllabus.body}");
    expect(flow).toContain("FLOW_CAPTIONS.review");
    expect(flow).toContain("FLOW_CAPTIONS.calendar");
  });
});
