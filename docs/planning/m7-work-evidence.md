# M7 — Work index: evidence and selection inventory (internal)

Inspected **2026-09-24**, read-only. This decides what `/projects` may say about
work other than the two flagships. It is internal: the public copy lives in
`lib/work/archive.ts`, with a source tag on each claim pointing back here.
Rankle and Plannr keep their own inventories (`lib/work/rankle-content.ts`,
`docs/planning/m6-plannr-evidence.md`); the Work index only restates facts
those already verify.

## Sources inspected

| Tag | Source | What it is |
|---|---|---|
| `[GH]` | `gh repo list m4ttblanke` | Three repositories: `blanke-portfolio`, `rankle`, `plannr`. All public. No other personal repos. |
| `[156-COURSES]` | `~/cs156/proj-courses` = `github.com/ucsb-cs156-f25/proj-courses-f25-02` (public) | UCSB Courses Search. 2,290 commits from 147 author emails between 2021-03-06 and 2025-09-01, before the Fall 2025 cohort arrived. |
| `[156-PRS]` | `gh pr list --author m4ttblanke` on the three CMPSC 156 repos | Matthew's pull requests, with titles, bodies, diffs and merge dates. |
| `[156-TEAM]` | `~/cs156/team01-f25-02`, `~/cs156/team02-f25-02` (both public) | CMPSC 156 team exercises. CI runs JaCoCo, PIT (pitest) and Stryker mutation testing (`.github/workflows/13,14,33,34`). |
| `[156-JPA]` | `~/cs156/jpa00..04-m4ttblanke` | Individual onboarding labs. Instructor starter code with 1–8 commits by Matthew each. |
| `[176A]` | `~/cs176a/{p01,p02,p03,p04,hangman}` | CMPSC 176A (computer networks) projects, Spring 2026. The course specs are in each folder. No git history and no public repository. |
| `[165B]` | `~/cs165b/hw2` | Machine learning homework notebooks (regression, clustering, random forest). |
| `[148]` | `~/cs148/pj07-syllabus-to-cal-2pm` | Plannr's team origin, already covered by M6. |
| `[RTR]` | `~/novaccelerate/ranktheref` = `github.com/novaccelerate/Rank-The-Ref` (private) | Seven commits on 2026-03-19: README, conventions, planning docs, `.env.SAMPLE`. No application code. |
| `[PORT]` | this repository | The publication itself. 89 commits by Matt Blanke since 2026-03-23. |
| `[RESUME]` | `~/Desktop/Stuff/Blanke, Matt Resume.pdf` (2026-09-18) | Résumé: used only to find candidates and cross-check dates. It is **not** evidence on its own (M6 found it overstates Plannr). |
| `[CV]` | `~/Downloads/Blanke - Undergraduate Student Research Assistant CV.pdf` (2026-09-23) | Research-assistant CV: lists CMPSC 111 work and two Cabrillo honors modeling projects. Same caveat. |

## Candidates

### SELECTED — UCSB Courses Search (CMPSC 156, Fall 2025)

- **What it is.** A full-stack course-search app for UCSB (Spring Boot backend, React
  frontend, UCSB course data), maintained by successive CMPSC 156 cohorts since
  2021. `[156-COURSES]`
- **Context.** CMPSC 156 (Advanced Applications Programming) team project,
  Fall 2025. Issues, pull requests, code review and CI gates. `[156-COURSES]`, `[CV]`
- **Authorship.** A team contribution to an inherited codebase. Matthew's
  **four merged PRs**: `[156-PRS]`
  - #23 "No courses found" feedback on Course Descriptions search (+122 −2, merged 2025-11-21).
    The empty result used to look the same as a slow or failed request.
  - #28 Course ID in the main results links to the course's details page (+74 −3, merged 2025-11-22).
  - #38 Paginated admin Job Log table, with page size and sort controls (+453 −42, merged 2025-11-23).
  - #39 Fixed a blank page when opening the details of some special courses (+2 −1, merged 2025-11-23).
  - Commit messages show tests rewritten to reach 100% mutation coverage and code
    refactored so it no longer needed Stryker-disable comments. `[156-COURSES]` `5319d43`, `dd82ade`, `8125a04`
- **Earlier in the same course (team01/team02, Oct–Nov 2025).** Matthew owned one
  resource, `UCSBOrganization`, end to end: database table, Spring REST controller
  (GET, POST, PUT, DELETE), React forms, table, create/edit/index pages, an
  integration test and an end-to-end test. That is 6 merged PRs in team01 and 11 in team02.
  One commit adds a test "for 100% pitest mutation coverage". `[156-TEAM]`, `[156-PRS]`
  Folded into this entry rather than listed separately: same course, same stack,
  and the course's own scaffold (every teammate built a parallel resource).
- **Technologies.** Java, Spring Boot, React, JavaScript. Tests: JUnit, Vitest, PIT, Stryker. `[156-COURSES]` `pom.xml`, `frontend/package.json`
- **Repository.** Public. PR links are the verifiable record.
- **Live demo.** None stable (the course's dokku instances did not respond on 2026-09-24).
- **Artifact.** A screenshot Matthew attached to PR #28 (public GitHub attachment),
  cropped to Quarter / Course ID / Title / Status. The instructor, location and
  enrolment columns are cut out. Winter 2022 public schedule data.
  → `public/work/courses-search-pr28.png` (954×770).
- **Claims excluded.** Résumé: "improving … mobile usability" (no PR touches
  responsive layout). "Responsive React interfaces" (not shown). Any team size figure.

### SELECTED — Network protocols (CMPSC 176A, Spring 2026)

- **What it is.** The course's five programming projects. The course supplied each
  spec and harness; Matthew wrote the protocol side: `[176A]`
  - p01: sends mail over SMTP and reads it back over POP3 (Python). The spec requires individual work.
  - p02: "Jewel", an HTTP/1.1 file server on raw sockets (Python).
  - p03: reliable transport in C against the course's network simulator. The spec asks for alternating-bit then Go-Back-N; the final `entity.c` is Go-Back-N with a configurable window, so the public copy says Go-Back-N only.
  - p04: distance-vector routing, with triggered updates only (Python, course simulator).
  - Extra credit: a hangman game server and client in C, up to three concurrent players.
- **Date.** File dates 2026-04-19 to 2026-05-30 (Spring 2026).
- **Authorship.** Only p01's spec says "work individually"; the others do not
  mention partners. The public copy says "course projects" and says which parts the course supplied. It does not claim sole authorship.
- **Technologies.** C, Python, sockets. SMTP, POP3, HTTP/1.1.
- **Repository.** None. The source is **not published**: these are live course
  assignments. The public copy says so, and neither links nor quotes solution code.
- **Artifact.** Real output: `python3 project.py` in `p04` (course topology
  "network 1", seed 499). The simulation ends at t≈53.8 after 54 packets are
  handled. Final table for E0: to E1 cost 1 via 1; to E2 cost 2 via 1; to E3 cost 4 via 1.
  The direct E0–E3 link costs 7; `route_packet(0, 3)` returns `[0, 1, 2, 3]`.
  The diagram is redrawn from the topology comment in the course's `project.py`.
  Only the output is shown, never `entity.py`.
- **Claims excluded.** "Alternating-bit" (not separately in the final code). A course harness for p01/p02 (they have specs only, so the copy says "to the course's spec"). Grades. Gradescope results. Anything about p03's
  performance under loss or corruption, because it was not re-run.

### SELECTED — This publication (2026)

- **What it is.** matthewblanke.com: Next.js 16, Convex (content, with admin
  authorization enforced in Convex), WorkOS AuthKit for `/admin`, self-hosted
  fonts. The design rules in `docs/ART_DIRECTION.md` are enforced by the test
  suite (`tests/design/rules.test.ts`: no `Math.random`, no `transition: all`, no raw
  z-index, no raw hex outside the token file, no gradient text, …). `[PORT]`
- **Authorship.** Every commit is authored by Matt Blanke. The colophon already says
  "Designed & built by". The entry makes no stronger claim than that.
- **Artifact.** The verbatim test names from `describe("things we never do")`,
  printed as a list (Schibsted, no monospace face). No code wallpaper.
- **Claims excluded.** Test counts (they go stale), traffic, Lighthouse scores.

### REJECTED

| Candidate | Why not |
|---|---|
| Rankle, Plannr | Flagships, not archive material. They lead the page as Features. |
| CS148 `pj07-syllabus-to-cal-2pm` | Plannr's origin. M6 already tells that story. |
| CMPSC 156 `jpa00–04` | Individual onboarding labs, mostly instructor starter code (1–8 commits by Matthew each). Add no signal beyond the Courses Search entry. |
| CMPSC 156 team01/team02 as a separate entry | Real and verifiable, but the same course and stack as Courses Search. Folded into that entry. |
| CMPSC 165B hw2 | Standard ML homework notebooks. Exercises, not projects. Would be included only to fill an "ML" slot. |
| RankTheRef | Private. Documentation and conventions only, no code. A concept, not a build. (ART_DIRECTION §16 already marks it provisional.) |
| CMPSC 111 two-ball collision (forward Euler) and SVD image compression | **Missing evidence.** Mentioned only in `[CV]`. No notebook, output or repository found anywhere on this machine (`find` for `*.ipynb`, "billiard", "svd", "collision"). Could be reconsidered if the original notebooks or files are recovered: it is the one computational-science signal the archive lacks. Not an M7 blocker, and no placeholder. |
| Cabrillo honors modeling: crossed E and B fields (Fall 2024); wave–particle duality (Spring 2025) | **Missing evidence**, same as above: `[CV]` only. Could be reconsidered if the original files are recovered. |
| ARM / computer organization (West Valley College) | `[CV]` lists the course only. No project material. |
| Earlier data-structures / algorithms work | Nothing found beyond course titles on the résumé. |

## Tiers

- **A, Features:** Rankle, Plannr.
- **B, Archive:** UCSB Courses Search, Network protocols, This publication.
- **C, Index:** none. Nothing verified is left over that deserves recording.
  The Convex `projects` table (the admin CMS) still has only the unpublished
  "tempproject123" draft. The page keeps a hook for published CMS records, and
  it renders nothing while there are none.

## Secondary detail routes

None. Each archive entry is fully explained by its entry plus the linked PRs
(or, for 176A, cannot link anything). No entry has enough material to fill a
route without padding.
