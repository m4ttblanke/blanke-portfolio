<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:portfolio-design-rules -->
# Public-facing design: read the art direction first

Before making **any** visual decision on a public page (layout, type, color,
texture, motion, imagery), read `docs/ART_DIRECTION.md`. It overrides generic
design defaults and skill defaults. The proof sheet at `/proof` (local and Vercel
previews only; 404 on production) shows the system rendered.

The short version, all enforced by `tests/design`:

- Everything starts aligned; something must earn the right to break alignment.
  Four violations only: bleed, overlap, crop, slight rotation. Never rotate body text.
- Palette is paper, hard white, ink and one red. Project colors live inside a
  project's own spread, never as global tokens. Use tokens, never raw hex.
- Big Shoulders Display is a display instrument (mastheads, major section titles,
  oversized statements, selected labels), not the default heading face. Schibsted
  Grotesk carries most hierarchy. No serif, no third face, no handwriting font.
- Every destructive treatment (circle, tear, tape, halftone, rotation, annotation)
  must answer "why was this altered?". No decorative grunge.
- Deterministic chaos utilities are tools, not a composition system. Hero, major
  photography, flagship spreads and File 001 are art-directed by hand. Global
  effects do not propagate into project spreads.
- Clean Copy is infrastructure only; do not add a public toggle yet. About,
  Experience and Coursework are legacy: do not polish them.
- z-index only via `.layer-*` inside a `.stage`. Chaos only via the named
  primitives in `app/globals.css`, all scaled by `--chaos`. **No `Math.random()`
  for visible design.** No `transition: all`.
- Native cursor always stays. No hover-only information. Every drag has a non-drag
  alternative. `prefers-reduced-motion` must leave a complete static composition.

# Preserve the M0 invariants

Public routes and assets stay public; only `/admin` is protected. Convex enforces
admin authorization. `/plannr/*` and `matthewblanke.com` (canonical) are untouched.
**Never call `redirect()` inside an admin page** (it collides with AuthKit's
session-refresh server actions); use an HTTP redirect in `next.config.ts`.
`tests/` enforces these.
<!-- END:portfolio-design-rules -->
