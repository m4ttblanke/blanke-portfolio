// THE WORK INDEX (M7): content truth for /projects, separate from art direction.
//
// Every claim is tagged with a source from docs/planning/m7-work-evidence.md
// (the internal inventory; read it before adding or changing an entry). The two
// features only restate facts their own case studies already verify
// (lib/work/rankle-content.ts, lib/work/plannr-content.ts); nothing new about
// them is claimed here.
//
// Hierarchy is the point of this file. FEATURES are the two flagships and get
// the case studies. ARCHIVE entries are shorter: what it is, what Matthew did,
// one technical note, and what a reader can check. An entry is here because
// it adds a signal the others do not, never to fill a slot. What was rejected,
// and why, is in the evidence document.

import { PLANNR_LEDE, PLANNR_META } from "./plannr-content";
import { PLANNR, RANKLE } from "./projects";
import { RANKLE_META, RANKLE_TAGLINE } from "./rankle-content";

export type Link = {
  /** Visible label. */
  label: string;
  href: string;
  /** Extra words for assistive tech so the link makes sense out of context. */
  context?: string;
  external?: boolean;
};

export type Fact = { term: string; detail: string };

export type Feature = {
  id: "rankle" | "plannr";
  number: string;
  name: string;
  year: string;
  thesis: string;
  facts: readonly Fact[];
  caseStudy: Link;
  more: readonly Link[];
};

export const FEATURES: readonly Feature[] = [
  {
    id: "rankle",
    number: "01",
    name: RANKLE.name,
    year: "2026",
    thesis: RANKLE_TAGLINE, // [rankle-content README]
    facts: [
      { term: "Status", detail: `${RANKLE_META.status} at rankle.io` },
      { term: "Built", detail: RANKLE_META.built },
      { term: "Stack", detail: RANKLE_META.stack },
    ],
    caseStudy: { label: "Read the Rankle case study", href: RANKLE.href },
    more: [
      { label: "Play at rankle.io", href: RANKLE_META.liveHref, external: true },
      { label: "Source", href: RANKLE_META.repoHref, context: "Rankle source code on GitHub", external: true },
    ],
  },
  {
    id: "plannr",
    number: "02",
    name: PLANNR.name,
    year: "2026",
    thesis: PLANNR_LEDE, // [plannr-content README, docs/index.html]
    facts: [
      { term: "Status", detail: PLANNR_META.status },
      { term: "Built", detail: `${PLANNR_META.origin}. ${PLANNR_META.since}.` },
      { term: "Stack", detail: `${PLANNR_META.platform}, Python · FastAPI` },
    ],
    caseStudy: { label: "Read the Plannr case study", href: PLANNR.href },
    more: [
      // Plain /plannr/ is proxied to the live product site (next.config.ts).
      { label: "Product page", href: PLANNR_META.productHref, context: "Plannr product page" },
      { label: "Source", href: PLANNR_META.repoHref, context: "Plannr source code on GitHub", external: true },
    ],
  },
];

export type ArchiveEntry = {
  id: string;
  number: string;
  title: string;
  /** When, as precisely as the evidence allows. */
  period: string;
  /** Where it came from: course, team or personal. */
  context: string;
  /** Matthew's part, stated no more strongly than the evidence. */
  role: string;
  /** What it is. */
  summary: string;
  /** What Matthew did. */
  work: string;
  /** The one technical or product note worth a reader's time. */
  note: string;
  stack: readonly string[];
  links: readonly Link[];
  /** Said plainly when nothing can be linked. */
  unlinked?: string;
};

const COURSES_REPO = "https://github.com/ucsb-cs156-f25/proj-courses-f25-02";

export const ARCHIVE: readonly ArchiveEntry[] = [
  {
    id: "ucsb-courses-search",
    number: "03",
    title: "UCSB Courses Search",
    period: "Fall 2025",
    context: "CMPSC 156, UCSB · Team project", // [156-COURSES] [CV]
    role: "Contributor to an inherited codebase",
    summary:
      "A full-stack UCSB course search, handed from cohort to cohort since 2021. It already held over 2,200 commits from earlier students and instructors when Matthew's team arrived.", // [156-COURSES] 2,290 commits before 2025-09-01
    work:
      "Four merged pull requests: a clear “no courses found” state (an empty search had looked like a slow one), course IDs that link to their details pages, a paginated admin job log with sort and page-size controls, and a fix for a blank details page.", // [156-PRS] #23 #28 #38 #39
    note:
      "The course's CI runs coverage and mutation testing (PIT for Java, Stryker for React); several of his commits exist only to close the last gaps. In the earlier team exercises he built one resource end to end: database table, REST controller, React pages, integration and end-to-end tests.", // [156-COURSES] 5319d43 dd82ade 8125a04; [156-TEAM]
    stack: ["Java", "Spring Boot", "React", "JavaScript"],
    links: [
      { label: "PR #23", href: `${COURSES_REPO}/pull/23`, context: "UCSB Courses Search pull request 23, “no courses found” feedback", external: true },
      { label: "PR #28", href: `${COURSES_REPO}/pull/28`, context: "UCSB Courses Search pull request 28, course ID links", external: true },
      { label: "PR #38", href: `${COURSES_REPO}/pull/38`, context: "UCSB Courses Search pull request 38, paginated job log", external: true },
      { label: "PR #39", href: `${COURSES_REPO}/pull/39`, context: "UCSB Courses Search pull request 39, blank details page fix", external: true },
      { label: "Repository", href: COURSES_REPO, context: "UCSB Courses Search repository on GitHub", external: true },
    ],
  },
  {
    id: "network-protocols",
    number: "04",
    title: "Network protocols",
    period: "Spring 2026",
    context: "CMPSC 176A, UCSB · Course projects", // [176A]
    role: "The protocol side of each project. Specs and simulators came from the course",
    summary:
      "Five projects that work up the network stack: mail sent over SMTP and read back over POP3, an HTTP/1.1 file server on raw sockets, reliable Go-Back-N transport in C, distance-vector routing, and a hangman server in C for three players at once.", // [176A] p01-p04, hangman
    work:
      "Matthew wrote each protocol to the course's spec. The routing project is shown here because its result is easy to read: every node starts out knowing only its neighbors and ends with the cheapest route to every other node.",
    note:
      "Each node sends only when its own table changes. There is no timer, so the simulation ends by itself once every node agrees.", // [176A] p4.md "triggered updates only"
    stack: ["C", "Python", "Sockets"],
    links: [],
    unlinked: "Source not published: these are current course assignments.",
  },
  {
    id: "this-publication",
    number: "05",
    title: "This publication",
    period: "2026",
    context: "matthewblanke.com · Personal project", // [PORT]
    role: "Designed and built by Matthew",
    summary:
      "The site you're reading: an editorial portfolio built with Next.js, with its content in Convex behind an authenticated admin (WorkOS AuthKit sign-in, authorization enforced in Convex).", // [PORT]
    work:
      "Its art direction is written down, and most of the rules a machine can check are tests that run before every production deploy.", // [PORT] docs/ART_DIRECTION.md, tests/design, .github/workflows/ci.yml
    note:
      "Visible “chaos” (the tilts, overlaps and torn edges) is deterministic, and one variable, ‑‑chaos, scales all of it. Setting it to zero realigns the whole page.", // [PORT] app/globals.css
    stack: ["Next.js", "TypeScript", "Convex", "WorkOS AuthKit", "Vitest"],
    links: [
      { label: "Source", href: "https://github.com/m4ttblanke/blanke-portfolio", context: "This site's source code on GitHub", external: true },
    ],
  },
];

// ---------------------------------------------------------------- artifacts

/** 03 — cropped from the screenshot Matthew attached to PR #28. */
export const COURSES_SHOT = {
  src: "/work/courses-search-pr28.png",
  width: 954,
  height: 770,
  alt: "UCSB Courses Search results for Winter 2022 computer science courses. Columns: Quarter, Course ID, Title and Status. Each course ID, from CMPSC 5A to CMPSC 24, is an underlined link.",
  caption:
    "Main search results after PR #28: each course ID now opens that course's details page. Cropped from the pull request's own screenshot; instructor and room columns removed.",
} as const;

/**
 * 04 — real output of Matthew's distance-vector implementation on the course's
 * four-node test topology ("network 1", seed 499). [176A] p04 `python3 project.py`
 */
export const DV_RUN = {
  links: [
    { a: 0, b: 1, cost: 1 },
    { a: 0, b: 2, cost: 3 },
    { a: 0, b: 3, cost: 7 },
    { a: 1, b: 2, cost: 1 },
    { a: 2, b: 3, cost: 2 },
  ],
  route: [0, 1, 2, 3],
  table: [
    { dest: "E0", cost: 0, via: "E0" },
    { dest: "E1", cost: 1, via: "E1" },
    { dest: "E2", cost: 2, via: "E1" },
    { dest: "E3", cost: 4, via: "E1" },
  ],
  packets: 54,
  caption:
    "E0's forwarding table when the run ended, after 54 packets. Its direct link to E3 costs 7. The protocol settled on 4, through E1 and E2. The topology is the course's test network, redrawn.",
} as const;

/** 05 — the verbatim names of the design-rule tests. [PORT] tests/design/rules.test.ts */
export const RULE_TESTS = {
  file: "tests/design/rules.test.ts",
  suite: "things we never do",
  names: [
    "no Math.random anywhere: visible chaos is deterministic",
    "no raw z-index outside the token file: use .layer-* inside a .stage",
    "no raw hex colors outside the token file, the palette mirror, and OG images",
    "no gradient text or glow effects",
    "no backdrop blur / glass outside the admin",
    "annotation marks are always hidden from assistive tech",
  ],
} as const;
