// SELECTED WORK — content truth, separate from art direction (M4A).
//
// Every fact here is verified against the repository, not invented:
//
// - Rankle: documented in docs/ART_DIRECTION.md §16 ("Project color worlds")
//   as a real flagship with an established palette and vibe (ranking/tier
//   language, social-game energy). M5A built its real case-study route
//   (/projects/rankle, lib/work/rankle-content.ts) against the live product
//   at github.com/m4ttblanke/rankle and rankle.io, so the poster now links
//   there instead of the placeholder /projects index -- the only M4
//   behavior change M5A makes; the poster's own visuals are untouched.
// - Plannr: confirmed in docs/PRD.md ("Plannr, a SwiftUI + FastAPI iOS app
//   with Google Calendar integration") and has a real, working destination
//   already wired in this repo (next.config.ts proxies /plannr/* to the
//   live product site). Its deep case study is M6.
//
// The single Convex `projects` record that exists today (slug
// "tempproject123") is an unpublished draft placeholder ("temp project"),
// not a real project, so it is not surfaced here or anywhere on the wall.
// No other secondary project is verified in the repository, so M4A ships
// only the two flagships plus a link to the (currently empty) /projects
// index, rather than inventing filler.

export type FlagshipProject = {
  id: "rankle" | "plannr";
  /** Real, accessible project name -- also the visible poster title. */
  name: string;
  /** Terse, factual descriptor. No invented metrics, dates or claims. */
  descriptor: string;
  /** A short category/meta line, Schibsted, never a technology chip cloud. */
  meta: string;
  /** Where the whole poster links. See the file header for why. */
  href: string;
  /** Full accessible name for the poster's link. */
  accessibleName: string;
};

export const RANKLE: FlagshipProject = {
  id: "rankle",
  name: "Rankle",
  // Kept plainly descriptive on the wall (visual review, M4A adjustment
  // pass): explain the product immediately. The social/argumentative
  // personality documented in ART_DIRECTION.md §16 is for M5 to communicate
  // through actual interaction and artifacts, not wall copy.
  descriptor: "A daily ranking game.",
  meta: "Ranking · Tiers",
  // The real case-study route, built in M5A. See lib/work/rankle-content.ts.
  href: "/projects/rankle",
  accessibleName: "Rankle — a daily ranking game",
};

export const PLANNR: FlagshipProject = {
  id: "plannr",
  name: "Plannr",
  descriptor: "Turns a syllabus into a calendar.",
  meta: "iOS · SwiftUI",
  // The real, live product site, already proxied by this repo.
  href: "/plannr/",
  accessibleName: "Plannr — turns a syllabus into a calendar, iOS, SwiftUI",
};

export const FLAGSHIPS: readonly FlagshipProject[] = [RANKLE, PLANNR];
