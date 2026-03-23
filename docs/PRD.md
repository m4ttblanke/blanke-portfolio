# Product Requirements Document
## Personal Portfolio Website
 
| Field | Value |
|---|---|
| Author | Matt |
| Status | In Progress |
| Version | 1.0 |
| Created | 2026-03-23 |
| Last Updated | 2026-03-23 |
 
---
 
## Table of Contents
 
1. [Purpose and Goals](#1-purpose-and-goals)
2. [Target Audience and Personas](#2-target-audience-and-personas)
3. [Features and Requirements](#3-features-and-requirements)
4. [User Experience](#4-user-experience)
5. [Success Metrics](#5-success-metrics)
6. [Out of Scope](#6-out-of-scope)
7. [Risks, Constraints, and Dependencies](#7-risks-constraints-and-dependencies)
8. [Timeline and Milestones](#8-timeline-and-milestones)
 
---
 
## 1. Purpose and Goals
 
### Problem Statement
 
A GitHub profile and resume are static — they require a viewer to already know what to look for, and they provide no narrative. Recruiters, collaborators, and professors encountering Matt's work for the first time have no single place to understand the full picture: who he is, what he builds, how he thinks, and what he's currently working on.
 
### Context
 
Matt is a CS student with active coursework in data structures and algorithms, computer vision, and applied software development. He has shipped real projects (including Plannr, a SwiftUI + FastAPI iOS app with Google Calendar integration) and has strong opinions about technical architecture. None of this is visible at a glance today.
 
### Objectives
 
- **Credibility** — Establish a polished, professional presence that holds up under scrutiny from technical hiring managers, professors, and collaborators.
- **Discoverability** — Create a canonical home for Matt's work that can be linked in applications, emails, and GitHub profiles.
- **Autonomy** — Enable ongoing content updates (new projects, coursework, experience) without code changes, through an authenticated admin interface.
- **Demonstration** — The site itself serves as a portfolio artifact — its architecture, tooling choices, and CI/CD pipeline are intentional technical signals.
 
---
 
## 2. Target Audience and Personas
 
### Persona 1 — Technical Recruiter
 
**Name:** Jordan, University Recruiting, mid-to-large tech company  
**Goal:** Quickly assess whether Matt is a credible candidate for a SWE internship or new grad role.  
**Behavior:** Spends 60–90 seconds on the page. Skimming for: real projects, recognizable tech stack, evidence of shipped work, GitHub link.  
**Pain point:** Most student portfolios are either empty or full of tutorial projects. Jordan needs signals of genuine initiative.  
**What they need from the site:** Project list with stack, brief writeups, links to live work and code, a clear "about" with current status (student, graduation date).
 
### Persona 2 — Engineering Hiring Manager
 
**Name:** Priya, Staff Engineer turned EM at a startup  
**Goal:** Evaluate technical depth — does Matt think carefully about architecture? Does he understand tradeoffs?  
**Behavior:** Goes deeper than Jordan. Reads project descriptions, clicks to GitHub repos, may read the README or ARCHITECTURE.md linked from the site.  
**What they need from the site:** Enough technical detail to spark a conversation. Stack choices explained, not just listed. Evidence of end-to-end ownership (design → build → deploy).
 
### Persona 3 — Professor or Academic Collaborator
 
**Name:** Prof. Chen, CS faculty  
**Goal:** Understand Matt's work outside class — is he a good candidate for a research position or recommendation letter?  
**Behavior:** Low-frequency, high-intent. Likely arriving from a direct link Matt shared.  
**What they need from the site:** Coursework section showing depth of engagement, project work that connects academic and applied domains, clear contact path.
 
### Persona 4 — Matt (Admin)
 
**Name:** Matt, site owner  
**Goal:** Add new projects, update experience, publish coursework notes — without opening a code editor or waiting for a deploy.  
**Behavior:** Occasional updates, probably monthly. Needs a fast, low-friction admin flow behind authentication.  
**What they need:** Auth-gated CRUD interface for all content types. Draft/published states so content can be staged. No knowledge of Convex internals required to make updates.
 
---
 
## 3. Features and Requirements
 
### Priority Tiers
 
| Label | Meaning |
|---|---|
| **P0 — Must Have** | MVP is not shippable without this |
| **P1 — Should Have** | Significantly reduces value if absent; targeted for MVP |
| **P2 — Nice to Have** | Deferred post-MVP without meaningful loss |
 
---
 
### 3.1 Authentication and Admin
 
**P0 — WorkOS Auth**
> As Matt, I want to log in securely to an admin panel so that I can manage site content without it being publicly accessible.
 
- WorkOS `authkitMiddleware` protects all `/admin/**` routes
- Unauthenticated access to `/admin` redirects to WorkOS-hosted login
- Session managed via HTTP-only cookies with configurable expiry
- All Convex mutations for content management require authenticated identity
 
**P0 — Content Management (Admin CRUD)**
> As Matt, I want to create, edit, and delete projects, experience entries, and coursework items from a browser UI so that I never need to touch the codebase to update content.
 
- Admin UI at `/admin` with sections for: Projects, Experience, Coursework
- Each content type supports: create, edit, delete, draft/published toggle
- Changes reflect on the public site immediately (Convex real-time)
- No unstyled raw JSON or direct database access required
 
---
 
### 3.2 Public Pages
 
**P0 — Home / Landing**
> As a visitor, I want to immediately understand who Matt is and what he does so that I can decide whether to explore further.
 
- Name, one-line professional description, current status (student, graduation year)
- Clear navigation to all major sections
- Loads in under 2 seconds on a standard connection
- Works on mobile
 
**P0 — Projects**
> As a recruiter or hiring manager, I want to browse Matt's projects with enough detail to assess scope and quality so that I can evaluate fit without opening GitHub.
 
- List view: project name, short description (2–3 sentences), tech stack as visual badges, links (live demo + GitHub repo)
- Detail view per project: full description, technical decisions, role, outcome, screenshots or demo embed
- Projects filterable by status (live / in progress) or tech (stretch P1)
- Draft projects hidden from public view
 
**P0 — Experience**
> As a hiring manager, I want to see Matt's work history and roles so that I can understand his professional trajectory.
 
- Chronological list of roles: company/org, title, date range, 2–4 bullet responsibilities
- Distinguishes internships, part-time roles, research positions
 
**P0 — Coursework / Education**
> As a professor or technical hiring manager, I want to see Matt's academic work so that I can gauge depth of formal CS training.
 
- Current and completed relevant courses (DSA, computer vision, etc.)
- Links to associated projects (e.g., Plannr as a course project)
- Degree, institution, expected graduation
 
**P1 — About**
> As any visitor, I want to read a personal bio so that I can understand who Matt is beyond his project list.
 
- Short narrative bio (3–5 sentences): background, interests, what he's working on now
- Links to GitHub, LinkedIn, email
- Optional: photo
 
**P1 — Contact**
> As a recruiter or professor, I want a clear way to reach Matt so that I can initiate a conversation.
 
- Visible email address or mailto link
- Links to LinkedIn, GitHub
- P2: contact form with email delivery
 
---
 
### 3.3 Infrastructure and Pipeline
 
**P0 — CI/CD Pipeline**
> As Matt, I want every push to `main` to automatically deploy the correct parts of the stack so that I never have to manually deploy.
 
- GitHub Actions workflow triggers on push to `main`
- Path filtering: Convex jobs only when `convex/**` changes; Vercel jobs only when app files change
- Destructive schema migration safety check: blocks deploy if `schema.ts` has removed lines without `[allow-destructive]` in commit message
- Convex deploys before Vercel when both are triggered
- Concurrency group prevents racing deploys
 
**P0 — Environment Configuration**
- All secrets stored in GitHub repository secrets and Vercel environment config
- No credentials hardcoded anywhere in the repo
- Local dev uses Convex's isolated dev deployment, never touching production data
 
**P1 — Preview Deployments**
> As Matt, I want Vercel to generate a preview URL for every pull request so that I can verify changes before merging.
 
- Vercel preview deploys enabled on all branches
- Preview URLs shareable for review
 
---
 
### 3.4 Design and UX
 
**P1 — Responsive Layout**
- All public pages fully functional on mobile (320px+), tablet, and desktop
- No horizontal overflow on any viewport
 
**P1 — Design System**
- Typography, color, and spacing defined as CSS variables
- Consistent component style across all pages (cards, badges, nav)
- Dark mode support
 
**P1 — Performance**
- Lighthouse performance score ≥ 90 on desktop
- All images served via `next/image` with proper sizing
- No layout shift on page load (CLS < 0.1)
 
**P2 — Page Transitions and Animations**
- Subtle entrance animations on content sections
- Does not impede usability or accessibility
 
---
 
### 3.5 SEO and Metadata
 
**P1 — Page Metadata**
> As a search engine or link-preview renderer, I want accurate titles, descriptions, and OG images so that shared links look professional.
 
- Unique `<title>` and `<meta description>` on every route
- OG image for home page and each project detail page
- Favicon and Apple touch icon
 
**P2 — Sitemap and robots.txt**
- Auto-generated sitemap at `/sitemap.xml`
- `robots.txt` permitting indexing of public routes, blocking `/admin`
 
---
 
## 4. User Experience
 
### 4.1 Information Architecture
 
```
/                        ← Home (landing, nav, brief intro)
/projects                ← All projects (list)
/projects/[slug]         ← Individual project detail
/experience              ← Work history
/coursework              ← Education and coursework
/about                   ← Bio and contact links
 
/admin                   ← Auth-gated root (redirects to /admin/projects)
/admin/projects          ← CRUD: projects
/admin/experience        ← CRUD: experience
/admin/coursework        ← CRUD: coursework
```
 
### 4.2 Public User Flow
 
```
Visitor lands on /
    │
    ├── Reads name + headline → gets context
    ├── Clicks "Projects" → scans list → clicks one → reads detail
    ├── Clicks "Experience" → scans history
    └── Clicks "About" → finds contact link → emails or connects
```
 
### 4.3 Admin User Flow
 
```
Matt navigates to /admin
    │
    ├── Not logged in → redirected to WorkOS login
    ├── Logs in → redirected back to /admin
    │
    ├── Creates new project → fills form → sets to draft
    ├── Previews on public site → confirms it looks right
    └── Publishes → immediately visible
```
 
### 4.4 Key UX Principles
 
- **Fast to scan** — every page should communicate its core value in under 10 seconds without scrolling.
- **Technical without being dense** — stack badges, links to repos, and architectural notes for the people who want depth; clean descriptions for those who don't.
- **No dead ends** — every page has a clear next step (nav, contact, GitHub).
- **Admin is functional, not beautiful** — the admin UI is for one user (Matt). Clarity and speed matter more than aesthetics there.
 
---
 
## 5. Success Metrics
 
This is a personal site, not a product with usage SLAs. Metrics are oriented toward validation that the site is doing its job.
 
| Metric | Target | How to Measure |
|---|---|---|
| Site is live at custom domain | Yes | Manual verification |
| All P0 features shipped | 100% | Checklist against this doc |
| Lighthouse performance (desktop) | ≥ 90 | Lighthouse CLI in CI or manual |
| Lighthouse accessibility | ≥ 90 | Lighthouse CLI |
| Mobile layout passes visual QA | No broken layouts | Manual test on iOS Safari + Android Chrome |
| CI pipeline green on first real deploy | Yes | GitHub Actions run |
| At least 3 real projects published | Yes | Content audit |
| No placeholder content on public routes | Zero instances | Manual review |
| First meaningful use (shared in application or to a professor) | ≤ 30 days post-launch | Self-tracked |
 
---
 
## 6. Out of Scope
 
The following are explicitly excluded from the MVP. They are not rejected — they are deferred to keep scope achievable.
 
| Feature | Rationale |
|---|---|
| Blog / writing section | Requires content strategy; adds schema complexity |
| Contact form with email delivery | Adds backend complexity; email link is sufficient for MVP |
| Analytics (Vercel Analytics, Plausible) | Nice visibility, zero functional value at MVP |
| RSS feed | No blog, no RSS |
| Multi-user auth (other admins) | Single-user site; not needed |
| Comments or social features | Out of character for a portfolio |
| Convex branch environments per PR | Valuable but complex; deferred until pipeline is stable |
| Figma MCP integration | Design iteration tool; not needed during initial build |
| Third-party agent orchestration (RuFlo, Agency Agents) | Evaluated and rejected — adds complexity without clear benefit at this scale |
| Search across content | Low value for a site this size |
| Internationalization | N/A |
 
---
 
## 7. Risks, Constraints, and Dependencies
 
### Technical Dependencies
 
| Dependency | Version / Notes | Risk if unavailable |
|---|---|---|
| Convex | Latest stable | Data layer goes down; all dynamic content unavailable |
| WorkOS | Hosted auth | Admin access blocked |
| Vercel | Hobby or Pro plan | Frontend deployment fails |
| GitHub Actions | Free tier (2000 min/month) | CI pipeline blocked |
| Next.js App Router | v14+ | Core framework dependency |
 
### Assumptions
 
- Matt is the only person merging PRs to `main` and the only admin user.
- Convex's free tier is sufficient for a personal portfolio's read/write volume.
- WorkOS's free tier covers single-user authentication.
- The deploy pipeline described in `deploy.yml` is the canonical deploy path — no manual `vercel deploy` or direct Convex pushes outside of local dev.
 
### Known Risks
 
| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Destructive schema change shipped without a migration function | Medium | Data loss in production | The `[allow-destructive]` safety check in CI blocks this; documented in `ARCHITECTURE.md` |
| Claude Code generates a breaking schema change | Medium | Pipeline fails or data corrupts | Safety check catches it; Matt reviews all PRs before merge |
| WorkOS free tier limits hit | Low | Auth breaks | Monitor; upgrade plan is straightforward |
| Convex API changes break `convex deploy` in CI | Low | Deploy fails silently | Pin Convex CLI version in `package.json`; monitor Convex changelog |
| Design phase expands scope and delays launch | High | MVP slips | Design system is P1 not P0; functional site ships before polish is complete |
 
### Constraints
 
- **Solo developer** — no parallel workstreams; everything is sequential.
- **AI-assisted development** — Claude Code is a force multiplier but introduces a review obligation on every PR. Greptile review is a gate, not a rubber stamp.
- **Student timeline** — active coursework (DSA, computer vision) runs concurrently. Available hours per day are variable.
 
---
 
## 8. Timeline and Milestones
 
Full task breakdown lives in `PLAN.md`. This section captures the phase gates that matter for go/no-go decisions.
 
| Milestone | Target Day | Exit Condition |
|---|---|---|
| **M1 — Skeleton deployed** | Day 2 | Live Vercel URL, WorkOS auth on `/admin`, CI pipeline green |
| **M2 — Content model complete** | Day 4 | All content types in Convex, real data seeded, admin CRUD working |
| **M3 — Public site feature complete** | Day 10 | All public pages live with real content, mobile-responsive |
| **M4 — Design complete** | Day 20 | Typography, color system, dark mode, OG images, no placeholder content |
| **M5 — MVP shipped** | Day 25 | Live at custom domain, pipeline stable, README and ARCHITECTURE.md final |
 
### Phase Summary
 
| Phase | Days | Focus |
|---|---|---|
| Foundation | 1–2 | Repo, CI pipeline, auth, skeleton deploy |
| Data layer | 2–4 | Schema, Convex queries, admin CRUD, real content seeded |
| Public UI | 4–10 | All visitor-facing pages, real data, mobile layout |
| Polish | 10–20 | Design system, dark mode, performance, accessibility, SEO metadata |
| Productionize | 20–25 | Custom domain, security audit, final content review, smoke test |
 
---
 
*This document should be treated as a living reference. Update version and `Last Updated` on any substantive change to requirements or scope.*
 