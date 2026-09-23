# M6 — Plannr: evidence and asset inventory (internal)

Inspected **2026-09-23**, read-only. This constrains `/projects/plannr` to what is
demonstrably true. It is internal: nothing here is published wholesale, and the
public copy lives in `lib/work/plannr-content.ts` with a source map back to this
document.

Status words: **IMPLEMENTED** (in source, and exercised or tested) ·
**PARTIAL** (in source, gated or dormant) · **PLANNED** (only in roadmap/TODO) ·
**NOT VERIFIED** (no evidence available).

## Sources inspected

| Tag | Source | Notes |
|---|---|---|
| `[REPO]` | `~/personal/plannr` (`github.com/m4ttblanke/plannr`, public) | 118 commits, 2026-08-13 → 2026-09-09, **all by Matt Blanke**. iOS app, FastAPI backend, marketing site (`docs/`), Render blueprint, CI. |
| `[TEAM]` | `~/cs148/pj07-syllabus-to-cal-2pm` (`ucsb-cs148-w26/pj07-syllabus-to-cal-2pm`) | 299 commits, 2026-01-09 → 2026-03-12, ~10 git identities (7 people). `team/` holds leadership, per-person contribution files, sprint notes. |
| `[DESK]` | `~/Desktop/Plannr` | Logo, launch banner, 5 social slides, 3 screenshots, 4 real syllabi, 3 videos. |
| `[LIVE]` | HTTP checks 2026-09-23 | `tryplannr.app` 200; `plannr-api.onrender.com/health` 200 (`ready: true`, `database: ok`); TestFlight invitation page resolves. |
| `[SIM]` | iPhone 17 Pro simulator, current `main` build | Captured for this milestone in a scratch copy; see Assets. |

## PRODUCT

**IMPLEMENTED**

- Syllabus **PDF upload** (text layer) or **pasted text**; 10 MB cap. `[REPO backend/app.py POST /syllabus]`
- **Extraction** by Gemini from the document text into structured events (title, ISO date, type, description, course name) plus an optional weekly meeting schedule (lecture/section days and times, final exam). Not-a-syllabus check. `[REPO parse_with_gemini]`
- **Review before sync**: parsed events arrive **auto-accepted** (`SyllabusUploadView.swift`: "Auto-accept all parsed events; user can decline individually"); the student can edit title/date/type/description, decline or re-accept any event, or Accept/Decline all, then presses **Sync**. Only accepted events are sent. Nothing reaches Google Calendar before that press. This is opt-out review, not opt-in: do not write "events wait for approval". `[REPO CalendarPreviewView.swift:210, EventStatus]`
- **My Classes**, per-class colour, **class detail** with events, editing, delete. Term folders (quarter/semester/custom); a class goes inactive when its term ends. `[REPO ClassEditView, Term.swift, ClassStatus ACTIVE/INACTIVE/NO_SYLLABUS]`
- **Calendar** (week/month) across all classes and **Week at a Glance** (counts per day, weekend preview, type filters, completion checkboxes). `[SCREENSHOTS, REPO WeeklyDashboardView]`
- **Google Calendar sync** to a dedicated **secondary calendar per class**, coloured to match; recurring class-meeting events; incremental re-sync; delete; hide/show calendar when a class goes inactive/active. `[REPO /calendar/sync, /calendar/meetings, /calendar/visibility]`
- **Re-upload reconciliation**, **sync snapshots** and **restore** to a past sync. `[REPO EventReconciler, ClassRestore, SyncSessionsView]`
- **Export** `.ics` / `.csv`. **Guest mode** (no sign-in, no calendar writes). First-run **onboarding** and a built-in **sample-syllabus walkthrough** (simulated, no server call).
- **Google sign-in** (OAuth 2.0 through `ASWebAuthenticationSession`, returning to the app on a `plannr://` URL scheme), bearer session tokens, encrypted stored refresh tokens, account deletion. `[REPO DEPLOY.md, TODO.md, crypto.py]`
- Retries with backoff for transient network and Gemini 429/503 failures; auto-resync on reconnect; idempotent inserts. `[REPO]`
- Accessibility pass (Dynamic Type, VoiceOver labels, scalable grids); haptics; Sentry crash reporting (DSN set).

**PARTIAL**

- **Camera scan / Photos import**: plumbing exists, both buttons show a "coming soon" notice because OCR needs `tesseract`/`poppler`, which the Render Python runtime lacks. Scanned/image-only PDFs therefore fail in production.
- **Stripe** Checkout / Payment Link fulfilment + webhook + `BetaPurchaser` table: built and tested, **dormant**. The public beta is free. No payment evidence exists.

**PLANNED** (landing page and TODO label these "planned, not in the current beta")
Canvas integration, Apple Calendar, workload estimates, conflict detection, daily agenda, grade-weight priority, project breakdown, syllabus Q&A, natural-language edits, deadline verification, shared study groups.

**NOT VERIFIED**
Word/`.docx` input (no code path); extraction accuracy of any kind; user counts; App Store release; Google OAuth verification status; any survey/interview results; that Google or Gemini do not retain syllabus text (the backend does not persist it, which is all that is provable).

## TECH STACK

| Group | Items | Evidence |
|---|---|---|
| **Current product** | Swift / SwiftUI (iOS 18+); Python 3.12 / FastAPI; PostgreSQL via SQLAlchemy + Alembic; Google Gemini (`google-genai`, model `gemini-3.7-flash`, temperature 0.1, JSON-schema response); Google OAuth 2.0 + Google Calendar API; PyPDF2 for text extraction; `icalendar` for export; slowapi rate limiting; Fernet (`cryptography`) token encryption | `requirements.txt`, `app.py`, `models.py` |
| **Infrastructure** | Render (web service + managed Postgres, paid plans, auto-deploy on push to `main`, migrations on deploy); GitHub Actions CI (backend `pytest` + iOS `xcodebuild test`) + `/health` keep-warm; Sentry (`sentry-cocoa`); TestFlight | `render.yaml`, `.github/workflows`, `Package.resolved` |
| **Marketing site** | Static HTML/CSS/JS on GitHub Pages at `tryplannr.app`; Cloudflare Web Analytics | `docs/`, `CNAME` |
| **Dormant** | Stripe | above |
| **Historical / replaced** | SQLite (`DBNAME.db`) → PostgreSQL (2026-08-14); `google-generativeai==0.8.3` → `google-genai` (2026-08-17) | `[TEAM]` `backend/requirements.txt`, `[REPO]` first commits |
| **Planned, never built** | `pdfplumber`, `python-docx`, `dateparser`, regex date parsing. They appear only in Sprint 1 planning notes (`team/sprint01/lect04.md`) and were never in any `requirements.txt`. **Do not list them.** | `git log -S` on both repos |
| **Not present** | AWS / Route 53, Vercel-for-Plannr, Google Cloud as hosting. (Google Cloud project exists only for OAuth/Calendar/Gemini credentials.) | |

Doc drift to be aware of (not published): `docs/DEPLOY.md` says the iOS app has "no SPM dependencies"; `project.pbxproj`, `Package.resolved` and the README show `sentry-cocoa`. The README is right.

## ARCHITECTURE (derived from source)

```
iPhone (SwiftUI)  ── classes, events, settings live ON DEVICE
   │  PDF / pasted text
   ▼
FastAPI on Render ── POST /syllabus: PyPDF2 text → Gemini → validated JSON
   │                  POST /calendar/*: proxies the user's Google Calendar calls
   │                  /auth/*: Google OAuth, session token
   ├──► Gemini API            extraction only; not involved in sync
   ├──► Google Calendar API   per-class secondary calendar + events
   └──► PostgreSQL            users + encrypted Google credentials. No syllabi, no events.
```

- Client/server boundary: the **server is stateless with respect to syllabus data**; the phone is the system of record for classes and events. `[DEPLOY.md, models.py: User, GoogleCredentials, BetaPurchaser]`
- **Gemini's exact role**: turn extracted document text into a list of graded deliverables with resolved dates (week-relative → calendar dates using a stated or inferred term start), plus a meeting pattern only if stated outright. It is told to skip a date it cannot compute confidently. It does not touch calendars.
- **OAuth tokens** (high level): stored server-side, encrypted at rest; the app holds only an opaque session token whose hash is stored; the OAuth `state` is signed and bound to a per-attempt nonce echoed back on the app callback. Residual risk of custom-scheme callbacks is documented by the project itself.

## AUTHORSHIP (must not be overstated)

- **Origin:** UCSB CS 148 (Winter 2026), team `pj07-syllabus-to-cal-2pm`, seven people. Git shows Matt Blanke at 123 of 299 commits (plus merges as repo integrator/product owner). Contribution file: `team/contributions/contrib_Matt.md`. Other members' files credit the Gemini parsing engine and prompt work (Arya Sadeghi), weekly dashboard (Arya), input handling/scanning (Avaneesh Kannan), and further UI/backend/QA work by the rest. A contribution file also credits Arya with "the original idea behind Plannr". **Do not claim the idea, the team parser, or the whole app.**
- **Matt, in the team phase** (his own file + git): Product Owner role; Google OAuth flow and the OAuth `state` CSRF fix with tests; Accept/Decline/Sync in the calendar preview and the first Google Calendar sync; `.ics`/`.csv` export with tests; guest mode; class editing, end/inactive dates; UI flow and unified calendar view; the first landing page, privacy policy, terms.
- **Matt, alone, after the course** (`[REPO]`, 2026-08-13 → 2026-09-09; every commit is his): PostgreSQL migration, Render deployment, `google-genai` migration, request authentication (bearer sessions), token encryption, OAuth nonce, rate limiting, CI, health checks, sync resilience (retry, idempotent inserts, auto-resync), restore-a-sync, term folders, meeting auto-sync, onboarding, sample walkthrough, accessibility pass, Sentry, marketing-site redesign at `tryplannr.app`, Stripe flow (later set aside), free TestFlight beta, launch links. Note that some file headers still credit teammates (e.g. `ClassManager.swift`), because the code base is a continuation, not a rewrite.
- **Accurate one-liner:** *Started as a seven-person UCSB CS 148 team project; Matt continued it alone into a free TestFlight beta.* "Solo build" would be false.

## DECISIONS (real, cited)

1. **Review before anything reaches a calendar.** Extraction is inference. Every parsed event lands on a review screen (auto-accepted, individually editable or declinable) and nothing is written to Google Calendar until the student presses Sync; only accepted events are sent; the prompt says to skip dates it cannot compute confidently; the landing page states "Parsing is close, not perfect — so the last word is yours." `[SyllabusUploadView.swift:~412, CalendarPreviewView.swift:210, parse_with_gemini prompt Step 3]`
2. **One secondary calendar per class, and Plannr only patches.** Find-or-create by class name; colour set through `calendarList`; existing events are `patch`ed, not replaced, so location/notes/attendees the student added in Google survive; a 404/410 recreates only that event; new events carry a private `plannrLocalId` so a retried request patches instead of duplicating; inactive classes are hidden, not deleted. `[app.py sync_class_calendar]`
3. **Re-upload is a diff, not a rebuild.** `EventReconciler`: identity is case-insensitive title + date; a local edit beats the new parse; only the difference is pushed; unmatched already-synced events are deleted; every sync is snapshotted and can be restored. The code states the limit itself: a renamed or moved assignment reads as delete + insert. `[EventReconciler.swift]`
4. *(kept for the system spread, not a card)* **The server holds no syllabi.** Classes/events stay on device; the server keeps a user row and encrypted credentials.

## VALIDATION / RECEIPTS

Verified and publishable:

- Public source repository (`gh repo view`: PUBLIC).
- Backend deployed and healthy (`/health` 200, `database: ok`, version = a git commit, 2026-09-23); Render blueprint with migrations on deploy.
- Marketing site live at `tryplannr.app` (200).
- **Free public TestFlight beta**: the invitation page resolves ("Join the Plannr — Syllabus to Calendar beta"). Tester count, installs and capacity are not verifiable and **must not be stated**.
- CI defined for backend and iOS on every push/PR; **97** backend test functions and **179 + 20** iOS unit/UI test functions (counted by grep, 2026-09-23; definitions, not pass counts).
- Sentry crash reporting configured. Apple Developer signing/TestFlight distribution present in the project.
- Running costs are modelled in `docs/COSTS.md` (~$285/yr fixed); the same doc states plainly that there is **no active revenue**.

**Excluded**: "OAuth verification completed" (no evidence anywhere), any user/tester/download/payment count, any survey or interview result (`USER_FEEDBACK_NEEDS.md` is a plan for gathering them, not results), any accuracy or time-saved figure, "production" (it is a beta), "App Store", "paying customers", "launched at UCSB".

## ASSETS

| # | Path | Dimensions / type | Current? | Sensitive? | Verdict |
|---|---|---|---|---|---|
| 1 | `plannr/Plannr/Plannr/Assets.xcassets/AppIcon.appiconset/icon-1024.png` | 1024², PNG | yes (shipping icon) | no | **USE** as the mark |
| 2 | `~/Desktop/Plannr/Plannr Logo.png` | 1024², PNG, alpha | yes; same design as #1 | no | duplicate of #1, rejected |
| 3 | `Plannr Screenshots/Week at a Glance.png` (= `docs/screenshots/week-glance.png`, byte-identical) | 1206×2622 PNG | yes (Aug 30 – Sep 5 2026) | **profile photo** (Matt's own) top right; real course codes and assignment titles (TMP124, CMPSC 111, ENGR 101); no email, no IDs | **USE**, avatar covered |
| 4 | `Plannr Screenshots/My Classes.png` (= `docs/screenshots/my-classes.png`) | 1206×2622 PNG | yes | same profile photo; real course codes | **USE**, avatar covered |
| 5 | `Plannr Screenshots/Calendar.png` (= `docs/screenshots/calendar.png`) | 1206×2622 PNG | yes | same profile photo; real assignment titles and descriptions | held back (the Week at a Glance screen already carries this story); avatar would need covering |
| 6 | `[SIM]` upload screen, **review screen**, scrolled review (`D1`, `D3`, `D4`) | 1206×2622 PNG | yes (current `main`, iOS 26.2 simulator) | none: fictitious built-in sample course "Astronomy 101 (Sample)", guest avatar "G" | **USE `D3`** as the Review artifact; `D1` (shows the app's own "Waking the server…" progress state) available |
| 7 | `docs/MANUAL_IMAGES/*.png` (10) | ~850×1740 PNG, framed on a forest wallpaper | **March 2026, team-era UI** | generic course codes (CMPSC 181/130A, TMP 120) | rejected: older build, device-framed, superseded by #6 |
| 8 | `Plannr Banner.png` | 1734×907 PNG | launch graphic | contains avatar | rejected: marketing composite with a tilted-syllabus mock and a phone ad; wrong register for this page |
| 9 | `Plannr Post/Slide 1–5.png` | 1122–1254² PNG | launch carousel | contains avatar | rejected as imagery; slide 5's line "Beta access link is in the bio." corroborates a beta announcement (not quoted) |
| 10 | `docs/assets/plannr-og.png` | 1200×630 | yes | no | not needed |
| 11 | `Syllabi/CMPSC 111 Syllabus{,Edited}.pdf`, `ENGR 101 Syllabus.pdf`, `TMP 124 Syllabus.pdf` | PDF (1, 1, 15, 17 pp) | real | **YES**: `ENGR 101` names the instructor and TA with `@ucsb.edu` emails; `TMP 124` names the professor with email, phone and a TA email; `CMPSC 111` files embed private Canvas course/assignment URLs | **REJECTED for public use.** Not copied, not excerpted. |
| 12 | `Plannr Demo Trimmed.mp4`, two viral videos, `docs/PlannrDemo.mp4` | video | | avatar; some real syllabi | out of scope for a static milestone |

`[SIM]` provenance (disclosed): captured on 2026-09-23 from an unmodified copy of the app **except** that a launch-flag in the scratch copy hides the sample-tour's coach-mark overlay (the real flow with a real PDF has none) and auto-acknowledges the first step. The Plannr repository itself was not modified. Data on screen is the app's built-in fictitious sample.

## PRIVACY / SANITIZATION

- Real syllabi: **not publishable** (instructor/TA names, emails, a phone number, private Canvas URLs). The Document section uses a labelled illustration instead, composed from the app's own fictitious sample (ASTRO 101), never a real course.
- Real screenshots #3/#4: cover the profile photo (a flat disc; recorded in the alt text and here). Real course codes/assignment titles remain: no instructor, no student, no email, no URL, no token; course codes are not sensitive.
- Never published: the TestFlight link ID, Apple team ID, Render/Stripe identifiers, Sentry DSN, emails, OAuth values, `TOKEN_ENC_KEY`.

## UNVERIFIED CLAIMS (do not publish)

Users/testers/installs/downloads, OAuth verification, revenue or paying customers, extraction accuracy, time saved, survey/interview counts, "AI-powered" as a headline (Gemini is described by its role instead), "production", "launched", App Store presence, `.docx` support, scan/photo import as shipped.

## MISSING ASSETS THAT WOULD IMPROVE M6 LATER

1. A **Google Calendar** capture showing the per-class secondary calendars (the payoff of the whole product; no such capture exists).
2. A **sanitized real syllabus** (a public course page or a teammate/professor-approved document) to replace the illustration.
3. A current **Calendar** and **class-detail** capture without the avatar.
4. A TestFlight screenshot / App Store Connect summary (with permission) if Matt wants tester counts to be publishable.
5. Real survey/interview artifacts, if they exist outside these repos.
6. Matt's real handwriting scans (M11): the pen layer here is deliberately geometric.

## ASSETS AS SHIPPED (M6A)

Served from `public/plannr/`, all downscaled to 760 px wide (source files untouched; next/image serves AVIF/WebP at 1 to 38 KB):

| File | From | Change |
|---|---|---|
| `plannr-icon.png` (256²) | app icon `icon-1024.png` | resized |
| `week-at-a-glance.png` | `Plannr Screenshots/Week at a Glance.png` | profile photo covered with a flat disc; resized |
| `my-classes.png` | `Plannr Screenshots/My Classes.png` | same; shown cropped by CSS |
| `review-sample.png` | `[SIM]` capture `D3` | resized. Sample course, no private data |

Held back: `Calendar.png` (the Week at a Glance screen already carries the story). Rejected: the banner, the five slides, the ten older MANUAL images, all four real syllabi.
