# MVP Plan
 
Personal portfolio website — phased build from scaffolding to polished, deployed product.
 
---
 
## North star: MVP definition
 
A publicly accessible portfolio site where any visitor can browse projects, experience, and coursework. Authenticated (you only) admin access to manage content without touching code. Fully automated deploy pipeline — merge to `main` ships to production.
 
**Done means:**
- Live at a real domain
- Auth-gated admin panel for content edits
- At least 3 real projects with descriptions, stack, and links
- Mobile-responsive
- CI pipeline running (safety check → Convex deploy → Vercel deploy)
- No placeholder content anywhere visible to the public
 
---
 
## Phase 1 — Days 1–2: Foundation
 
Get a working skeleton deployed end-to-end. Nothing is polished; everything is wired.
 
- [ ] Init Next.js project (App Router) and push to GitHub
- [ ] Connect Vercel to the repo — confirm preview deploy works on PR
- [ ] Set up Convex project, define an initial `schema.ts` (even if just a `projects` table with stub fields)
- [ ] Install and configure WorkOS `authkitMiddleware` — lock `/admin` behind auth
- [ ] Confirm the full deploy pipeline: push to `main` → GitHub Actions runs → Convex deploys → Vercel deploys
- [ ] Add all required secrets to GitHub (`CONVEX_DEPLOY_KEY`, `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`)
- [ ] Verify the destructive migration safety check fires correctly on a test schema change
 
**Exit condition:** `main` branch is live at a Vercel URL. `/admin` requires WorkOS login. Pipeline is green.
 
---
 
## Phase 2 — Days 2–4: Content model + data layer
 
Define what the site actually stores and build the admin plumbing to manage it.
 
- [ ] Finalize `schema.ts` — tables for `projects`, `experience`, `coursework` (fields: title, description, stack, links, dates, visibility)
- [ ] Write Convex queries and mutations for each table (list, get, create, update, delete)
- [ ] Build minimal admin UI at `/admin` — CRUD forms for projects, experience, coursework (unstyled is fine)
- [ ] Seed with real content: at least 3 projects, current experience, relevant coursework
- [ ] Confirm real-time updates work — edit in admin, see change on the public page immediately via `useQuery`
 
**Exit condition:** All real content lives in Convex and is editable without touching code.
 
---
 
## Phase 3 — Days 4–10: Public-facing UI
 
Build the pages visitors actually see. Prioritize clarity and completeness over visual polish.
 
- [ ] Home / landing page — name, one-line description, nav to sections
- [ ] Projects page — list view with title, short description, stack badges, links (live + GitHub)
- [ ] Project detail page — full description, screenshots or demo, technical writeup
- [ ] Experience page — roles, dates, responsibilities
- [ ] Coursework / education page — courses, relevant work (ties to Plannr, DSA, CV coursework)
- [ ] About page — short bio, what you're working on, contact
- [ ] Mobile-responsive layout across all pages
- [ ] Set up Convex `isDraft` / visibility flag so content can be staged without going live
 
**Exit condition:** A stranger can navigate the full site and understand who you are and what you've built.
 
---
 
## Phase 4 — Days 10–20: Design + polish
 
Elevate the UI from functional to intentional. This is the phase where the site starts to feel like yours.
 
- [ ] Commit to a design direction — typography, color palette, spacing system (CSS variables in `globals.css`)
- [ ] Polish the home page — the first thing anyone sees should be memorable
- [ ] Add transitions and page animations (keep them subtle — this is a portfolio, not a demo reel)
- [ ] Dark mode support
- [ ] Favicon, OG image, page titles, and meta descriptions on every route
- [ ] Custom 404 page
- [ ] Project screenshots or visuals — real ones, not placeholders
- [ ] Accessibility pass: semantic HTML, keyboard nav, sufficient color contrast
 
**Exit condition:** You'd be comfortable sharing the URL in a job application or to a professor.
 
---
 
## Phase 5 — Days 20–25: Productionize
 
Lock down the remaining gaps between "it works" and "it's shipped."
 
- [ ] Connect a real domain (custom domain in Vercel settings, DNS propagation)
- [ ] Environment variable audit — nothing hardcoded, all secrets in Vercel env config
- [ ] Performance pass: image optimization (`next/image`), lazy loading, Lighthouse score ≥ 90
- [ ] Security pass: WorkOS session expiry configured, no public Convex mutations callable without auth
- [ ] Write `README.md` — setup instructions, stack overview, deploy process
- [ ] Finalize `ARCHITECTURE.md` with any changes from build
- [ ] Final content review — read every page out loud, fix anything awkward
- [ ] Smoke test the deploy pipeline end-to-end one more time from a clean branch
 
**Exit condition:** MVP is live at your domain. Pipeline is stable. You're ready to share it.
 
---
 
## Ongoing (post-MVP)
 
Things intentionally deferred to keep scope tight:
 
- Analytics (Vercel Analytics or Plausible)
- Blog / writing section
- RSS feed
- Figma MCP integration for design iteration
- Convex branch environments for PR preview stacks
- Contact form with email delivery
 