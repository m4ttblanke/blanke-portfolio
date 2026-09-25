// PLANNR CASE STUDY — content source of truth (M6A).
//
// SOURCE MAP. Every claim below traces to docs/planning/m6-plannr-evidence.md
// (the internal inventory), which cites the files inspected on 2026-09-23:
//
//   [REPO]  github.com/m4ttblanke/plannr (public; 118 commits, 2026-08-13 to
//           2026-09-09, all by Matt). backend/app.py, EventReconciler.swift,
//           SyllabusUploadView.swift, CalendarPreviewView.swift, docs/*.md
//   [TEAM]  github.com/ucsb-cs148-w26/pj07-syllabus-to-cal-2pm (299 commits,
//           2026-01-09 to 2026-03-12, seven people); team/contributions/
//   [LIVE]  HTTP checks 2026-09-23: tryplannr.app 200; plannr-api.onrender.com
//           /health 200 with ready:true, database:ok
//   [SIM]   current-build simulator capture of the app's built-in FICTITIOUS
//           sample course (see public/plannr/, inventory "Assets")
//
// DELIBERATELY NOT HERE, because nothing documents it: user, tester, install
// or payment counts; revenue; Google OAuth verification; extraction accuracy;
// time saved; survey or interview results; "production" (it is a beta); App
// Store presence; Word/.docx input; scan or photo import (both are gated
// "coming soon" in the app); "solo build" (it began as a seven-person team
// project); and every roadmap item the product page itself labels "planned".
// pdfplumber, python-docx and dateparser appear only in Sprint 1 planning
// notes and were never dependencies, so they are not listed either.

export const PLANNR_META = {
  status: "Free public TestFlight beta",
  productHref: "/plannr/", // next.config.ts proxies this to the real product site
  repoHref: "https://github.com/m4ttblanke/plannr",
  teamRepoHref: "https://github.com/ucsb-cs148-w26/pj07-syllabus-to-cal-2pm",
  healthHref: "https://plannr-api.onrender.com/health",
  platform: "iOS · SwiftUI",
  origin: "UCSB CS 148 team project, Winter 2026",
  since: "Continued alone, Aug – Sep 2026",
  checkedOn: "23 Sep 2026",
} as const;

export const PLANNR_LEDE =
  "A syllabus is written for people. Plannr turns it into dates a calendar can hold, and makes the student check every one first."; // [REPO README, docs/index.html]

// ------------------------------------------------------------ the term grid

/** The illustrated term. FICTITIOUS: composed from the sample course built into the app (ASTRO 101). */
export const TERM = {
  label: "Winter 2027",
  firstMonday: "2027-01-04",
  weeks: 11,
  weekdays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
} as const;

/** ISO date (UTC-safe) of `weekday` (0 = Mon … 4 = Fri) in `week` (1-based). Week N = start + (N − 1) weeks:
 *  the same rule the extraction prompt gives the model. [REPO parse_with_gemini, Step 3] */
export function termDate(week: number, weekday: number): string {
  const [y, m, d] = TERM.firstMonday.split("-").map(Number);
  const t = new Date(Date.UTC(y, m - 1, d + (week - 1) * 7 + weekday));
  return t.toISOString().slice(0, 10);
}

export type Deadline = {
  id: string;
  /** Three-letter label for the tiny term-grid cell. */
  tag: string;
  title: string;
  type: "Homework" | "Lab" | "Exam";
  /** How the document writes it. */
  written: string;
  /** What the extraction resolves it to. */
  iso: string;
  /** Where it falls in the term grid (for the calendar and for tests). */
  week: number;
  weekday: number;
  /** True when the syllabus doesn't state the date: it has to be worked out, which is what review is for. */
  inferred?: boolean;
  /** The phrase of `written` that gets the pen ring (only the inferred one). */
  ring?: string;
};

export const DEADLINES: readonly Deadline[] = [
  { id: "ps1", tag: "PS1", title: "Problem Set 1", type: "Homework", written: "due Friday of Week 2", iso: "2027-01-15", week: 2, weekday: 4 },
  { id: "obs1", tag: "OR1", title: "Observation Report 1", type: "Lab", written: "due Wednesday, Week 4", iso: "2027-01-27", week: 4, weekday: 2 },
  { id: "mid", tag: "MID", title: "Midterm Exam", type: "Exam", written: "Friday of Week 5, in class", iso: "2027-02-05", week: 5, weekday: 4 },
  { id: "prop", tag: "PRP", title: "Research paper: proposal", type: "Homework", written: "due Monday, February 15", iso: "2027-02-15", week: 7, weekday: 0 },
  { id: "draft", tag: "DFT", title: "Research paper: final draft", type: "Homework", written: "due Wednesday of Week 10", iso: "2027-03-10", week: 10, weekday: 2 },
  { id: "final", tag: "FIN", title: "Final Exam", type: "Exam", written: "Friday of finals week, 8:00–11:00 AM", iso: "2027-03-19", week: 11, weekday: 4, inferred: true, ring: "finals week" },
] as const;

/** The lines of the illustrated page that Plannr is told to ignore. [REPO prompt Step 4: policies, office hours, grading] */
export const DOCUMENT_NOISE = {
  header: "ASTRO 101 · Introduction to the Solar System",
  term: "Winter 2027",
  meets: "Lecture M W F 10:00–10:50 AM · Section Thursday 3:00–3:50 PM",
  start: "Week 1 begins Monday, January 4.",
  ignored: [
    "Late work loses 10% per day.",
    "Office hours are by appointment.",
    "Grading: problem sets 30%, observation reports 15%, midterm 20%, paper 15%, final 20%.",
  ],
} as const;

/** Margin notes, each anchored to the line of the page it is about. Real text that stands without the marks beside it (the ring and the bracket are decoration, hidden by Clean Copy). */
export const DOCUMENT_NOTES = {
  ps1: "Friday of Week 2 is a calculation: the first day of class, plus one week, plus four days.",
  final: "Finals week is never stated as a date. Plannr has to work it out, and the student has to check it.",
  ignored: "Policies, office hours and grading. Plannr is told to leave these alone.",
} as const;

export const DOCUMENT_DISCLAIMER =
  "Illustration: a fictitious course, composed from the sample syllabus built into the app. Not a real course document.";

// ------------------------------------------------------------ the transformation

export const FLOW_STEPS = [
  {
    key: "syllabus",
    word: "Syllabus",
    body: "Six deadlines, written six different ways: a weekday and a week, a plain date, a phrase like finals week.",
  },
  {
    key: "extract",
    word: "Extract",
    body: "Gemini reads the document text and returns each deadline as a record with a title, a date and a type. Friday of Week 2 becomes 2027-01-15. It is told to skip any date it cannot work out.", // [REPO parse_with_gemini]
  },
  {
    key: "review",
    word: "Review",
    body: "Every record lands on a review screen. The student can edit a date, decline an event or accept the lot. Nothing is written to Google Calendar until they press Sync.", // [REPO SyllabusUploadView / CalendarPreviewView]
  },
  {
    key: "calendar",
    word: "Calendar",
    body: "Accepted events sync to a Google Calendar made for that class, in the class's colour.", // [REPO _find_or_create_calendar]
  },
] as const;

export const FLOW_CAPTIONS = {
  review:
    "The review screen in the current build, on the app's built-in sample course. Every event arrives accepted; each can be edited or declined before Sync.",
  calendar: "Diagram of the term. Winter 2027, weeks 1 to 11, Monday to Friday. The same six dates, placed.",
} as const;

// ------------------------------------------------------------ the product

export const PRODUCT_KEEPS = [
  { name: "My Classes", body: "Every course in one list, each with its own colour and sync status. Classes can be filed into a term." },
  { name: "Calendar", body: "A week or month across every class, filterable by exams, homework, labs and quizzes." },
  { name: "Week at a Glance", body: "What is due this week and next, a weekend preview, and a checkbox for each thing done." },
] as const;

/** Callouts on the real screenshots. Text is copied from what the screenshot itself shows. */
export const PRODUCT_NOTES = {
  week: [
    { at: 40, text: "8 due this week, 11 next. The app itself calls it a heavy week." },
    { at: 58, text: "Each day with something due carries a count." },
    { at: 72, text: "A weekend preview: three assignments due early next week." },
  ],
  classes: [{ at: 30, text: "One colour per class. 27 events synced." }],
} as const;

export const PRODUCT_CAPTION =
  "Captured in the week of 30 Aug 2026 from the developer's own account. Profile photo covered; the course codes are real.";

// ------------------------------------------------------------ the decisions

export const DECISIONS = [
  {
    id: "review",
    name: "The student signs off before anything reaches a calendar.",
    /** The phrase of `name` the pen underlines: the review note is attached to it. */
    mark: "signs off",
    constraint:
      "Extraction is inference. Friday of Week 3 is a calculation, and a calculation can be wrong. A wrong date costs a student a deadline.",
    decision:
      "Parsed events land on a review screen first. Each can be edited, declined or accepted, and only accepted events are ever sent. The extraction prompt tells the model to skip a date it cannot work out with confidence instead of guessing.",
    limit: "Events arrive accepted, so review is opt-out: a student who presses Sync without looking gets what the parser found.",
    note: "opt-out, not opt-in",
    code: { label: "CalendarPreviewView.swift", href: "https://github.com/m4ttblanke/plannr/blob/main/Plannr/Plannr/CalendarPreviewView.swift" },
  },
  {
    id: "ownership",
    name: "One calendar per class, and Plannr only patches.",
    /** The phrase of `name` the pen underlines: the review note is attached to it. */
    mark: "only patches",
    constraint: "The calendar it writes to is the student's own. They will add a location, a note, a reminder. A sync must not erase it.",
    decision:
      "Each class gets a dedicated secondary Google Calendar, found or created by name and coloured to match. Existing events are patched, not replaced, so anything added in Google survives a re-sync. If an event has been deleted in Google, only that one is recreated. Every event carries a private id, so a retried request updates the event it already made instead of duplicating it.",
    limit: "Calendars are matched by class name.",
    note: "patch, not update",
    code: { label: "backend/app.py, sync_class_calendar", href: "https://github.com/m4ttblanke/plannr/blob/main/backend/app.py" },
  },
  {
    id: "diff",
    name: "A changed syllabus is a diff, not a rebuild.",
    /** The phrase of `name` the pen underlines: the review note is attached to it. */
    mark: "a diff",
    constraint: "Professors move deadlines. Uploading the new version must not wipe the student's edits or duplicate the term.",
    decision:
      "Re-uploads are reconciled against the class's existing events. Two events are the same when their title and date match; a local edit beats the new parse; only the difference is pushed to Google. Every sync is snapshotted, and a class can be restored to any earlier one.",
    limit: "A renamed or moved assignment reads as a deletion plus an addition. The code says so itself.",
    note: "identity is title + date",
    code: { label: "EventReconciler.swift", href: "https://github.com/m4ttblanke/plannr/blob/main/Plannr/Plannr/EventReconciler.swift" },
  },
] as const;

// ------------------------------------------------------------ under the hood

export const SYSTEM_COLUMNS = [
  { key: "phone", name: "The phone", holds: "Classes, events, review edits and sync snapshots live here." },
  { key: "server", name: "Plannr's server", holds: "A user record and encrypted Google credentials. No syllabi, no events." },
  { key: "google", name: "Google", holds: "Gemini reads the text. Google Calendar holds the result." },
] as const;

/** Hops, in order. `from`/`to` are 1-based columns of SYSTEM_COLUMNS. `note` names the SYSTEM_NOTES entry pinned to that hop: the extraction note to the hop that reaches Gemini, the storage note to the hop where the server hands the events back and keeps nothing. [REPO backend/app.py, DEPLOY.md] */
export const SYSTEM_HOPS = [
  { n: 1, from: 1, to: 2, label: "Syllabus PDF or pasted text, up to 10 MB" },
  { n: 2, from: 2, to: 3, label: "The document's text goes to Gemini; structured events come back", both: true, note: "extraction" },
  { n: 3, from: 2, to: 1, label: "Events go back to the phone for review", note: "storage" },
  { n: 4, from: 1, to: 2, label: "Accepted events, after the student presses Sync" },
  { n: 5, from: 2, to: 3, label: "Insert or patch on the class's own Google Calendar" },
] as const;

export const SYSTEM_NOTES = {
  extraction: "Extraction only. Gemini never touches a calendar.",
  storage: "The server keeps no syllabus and no events.",
} as const;

export const SYSTEM_STACK = "Swift · SwiftUI · Python · FastAPI · PostgreSQL · Gemini · Google OAuth 2.0 · Google Calendar API · Render";

export const SYSTEM_SECURITY =
  "Sign-in is Google OAuth 2.0. The stored refresh tokens are encrypted at rest, the app holds only an opaque session token, and the sign-in callback is bound to the attempt that started it."; // [REPO DEPLOY.md, crypto.py]

// ------------------------------------------------------------ the receipt

export const RECEIPT_ROWS = [
  {
    label: "Source",
    body: "A public repository: 118 commits between 13 Aug and 9 Sep 2026, continuing the team's original code.",
    link: { label: "github.com/m4ttblanke/plannr", href: PLANNR_META.repoHref },
  },
  {
    label: "Backend",
    body: "Deployed on Render and redeployed on every push to main. Database migrations run on deploy. Its health check returned 200 with the database ready when checked.",
    link: { label: "The health check", href: PLANNR_META.healthHref },
  },
  {
    label: "Beta",
    body: "A free, public TestFlight beta. The invitation is linked from the product page.",
    link: { label: "The product page", href: PLANNR_META.productHref },
  },
  {
    label: "Tests",
    body: "97 backend and 199 iOS test functions. CI is set up to run both suites on every push to main and every pull request.",
  },
  {
    label: "Crashes",
    body: "Beta builds report crashes to Sentry.",
  },
  {
    label: "Payments",
    body: "A Stripe checkout and webhook path was built and tested, then set aside. The beta is free.",
  },
] as const;

export const RECEIPT_CREDITS = [
  {
    label: "The team project",
    body: "UCSB CS 148, Winter 2026, seven people. Matt was product owner and built Google sign-in, the first Google Calendar sync, the accept and decline controls, exports, guest mode and class editing. Teammates built the first Gemini extraction, the week view and the input handling.",
    link: { label: "The original repository", href: PLANNR_META.teamRepoHref },
  },
  {
    label: "After the course",
    body: "Matt continued it alone: hosting and the database, authentication hardening, sync retries and restore, term folders, the product page, and the TestFlight beta.",
  },
] as const;

export const RECEIPT_NOT_ON_FILE =
  "User counts, revenue, extraction accuracy and Google's OAuth verification are not documented anywhere in the project, so this page does not claim them.";
