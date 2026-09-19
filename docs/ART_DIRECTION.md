# Art Direction: Matthew Blanke, Issue 001

Read this before making any visual decision on a public page. It overrides
generic design defaults, skill defaults and habit. The evidence behind the
decisions is on the proof sheet (`/proof`, local and Vercel previews only).

## 1. Manifesto

A professionally art-directed independent magazine about one person, partially
vandalized.

Two layers. The **disciplined layer** is a real grid, strong type, controlled
spacing, obvious navigation, readable writing and credible evidence. The
**human layer** interferes with it: marker, photocopy, torn paper, tape,
overprint, odd crops, a sticker. The disciplined layer is the publication. The
human layer is what happened to it.

> **Everything starts aligned. Something must earn the right to break
> alignment.**

Applies to type, layout, color, texture, overlap, rotation, motion and
project-specific art direction. Chaos is applied to a designed composition by a
person. It is never random, and it is never the reason the page works.

This is a magazine about Matthew, not a developer portfolio dressed as one.
Editorial first. Vandalism second.

### Semantic vandalism

> **Every destructive treatment must answer: why was this altered?**

The human layer is evidence that a person intervened, not decoration. Every
circle, underline, tear, piece of tape, halftone, overprint, rotation and
annotation has to imply an editorial or physical reason.

| Treatment | A reason that works | Not a reason |
|---|---|---|
| Circle | circling a meaningful word | circling a word because it is big |
| Underline | an important phrase or claim | marker underline "for texture" |
| Tape | something that appears physically attached | tape on every image |
| Tear | tearing something to reveal, remove or interrupt information | torn edges on every container |
| Halftone | a photograph whose reproduction treatment is intentionally changing | halftone as an "old print" filter |
| Overprint | two things printed on one sheet on purpose | a red overlay to add energy |
| Rotation | something pasted down slightly crooked by a hand | tilting to look dynamic |
| Annotation | a specific claim, object, decision or piece of evidence | a scribble with no target |

If the only justification is "it makes the page look punk or zine," do not use it.
The goal is evidence of human intervention, not decorative grunge. To check a
treatment, remove it in your head: if you cannot say what the page loses in
*meaning* (not just in mood), it was decoration.

Plate 6 of the proof sheet demonstrates the *mechanics* on placeholder content.
It is not a template: on a real page each treatment needs its own reason.

### The test

> Does this already look like Matthew Blanke's publication before the flashy
> parts are added?

That answer must come from type, hierarchy, spacing, grid, proportion and one
red. If the identity only appears after torn paper, stickers, grain, rotation,
animation or project color, the foundation is too weak. Plate 5 of the proof
sheet (the clean composition) is the standing example: keep it excellent on its
own.

## 2. Clarity and chaos: 60/40 across the site, not per screen

The ratio is for the whole experience. It varies on purpose; a page that is
loud all the way through is as flat as one that is quiet all the way through.

| Section | Clarity / chaos | Character |
|---|---|---|
| Reading sections (About body, case-study prose) | ~90 / 10 | Pure editorial. Almost nothing interrupts. |
| Cover | ~80 / 20 | Pristine. One deliberate collision (type behind the figure). |
| Tear (cover to work) | the first big disruption | Torn-edge transition. This is where the vandalism starts. |
| Selected Work wall | ~45 / 55 | The loudest place on the site. Posters, overlap, drag. |
| Flagship features | each its own | Rankle louder and playful; Plannr more ordered. |
| File 001 | ~70 / 30 | Personal, editorial, warmer, marker used like an editor's marks. |
| Colophon | ~95 / 5 | Resolves cleanly. The last feeling is calm and confident. |

### Homepage rhythm (not built yet)

```
COVER  ->  TEAR  ->  SELECTED WORK WALL  ->  FLAGSHIP FEATURES  ->  FILE 001  ->  COLOPHON
pristine   first     loudest                 expressive, per       personal,    resolves
           break                             project               editorial    cleanly
```

Nothing above is implemented. It is the emotional rhythm later milestones
serve.

## 3. Grid

Defined in `app/globals.css` (`.page-grid`, `--cols`, `--margin`, `--gutter`).

| | Value |
|---|---|
| Columns | **12** from 1024px, **8** from 768px, **4** below |
| Outer margin | `clamp(1rem, 4.2vw, 4.5rem)` |
| Gutter | `clamp(0.75rem, 1.7vw, 1.75rem)` |
| Frame | 90rem maximum; bleeds run past it |
| Reading measure | 64 characters (`--measure`) |
| Rhythm | One 8px unit. Sections breathe: 3-5rem, 4-8rem, 6-13rem |

Place items with Tailwind's `col-span-*` / `col-start-*`. Never arbitrary
column values.

### The four ways to break the grid

There are exactly four. Anything else is not allowed.

1. **Bleed.** Runs to the viewport edge from inside the grid (`.bleed-*`).
2. **Overlap.** An element is pulled over its neighbor, on a higher layer
   (`.overlap-*`).
3. **Crop.** A fixed frame; the picture or type is cut to fit (`.crop`).
4. **Slight rotation.** Named steps only (`.tilt-*`): 0.8deg and 1.6deg for
   blocks, 3deg and 6deg for tape and stickers. **Body text is never rotated.**
   Rotate the slab behind it, never the words.

Each violation has to be earned by the composition. Each is multiplied by
`--chaos`, so Clean Copy realigns it.

### Compositions respond to their own width

Compositions that must work at any size use **container queries**
(`container-type: inline-size`) so they re-compose by their own width, not the
viewport's. This is how the proof sheet shows one component full-width and in a
375px frame. Use `cqw` units for type that fits a column.

## 4. Typography

Two faces. No serif. Do not add a third without a genuine reason.

### Body, UI, captions, metadata: Schibsted Grotesk

`app/fonts/body.ts`. One variable file (400-900), normal style. **Italic is
deliberately not loaded**; `em` renders as weight 650 until a real need appears.
Body is 17px (1.0625rem), leading 1.55, never below 16px for reading text.

| Role | Class | Spec |
|---|---|---|
| Head 1 | `.t-head-1` | 800, -0.03em, leading 1.0, fluid 2.5-6.25rem |
| Head 2 | `.t-head-2` | 750, -0.025em, 1.06, fluid 1.75-3rem |
| Head 3 | `.t-head-3` | 700, -0.015em, 1.2 |
| Lede | `.t-lede` | 500, -0.01em, 1.32, fluid 1.25-1.75rem |
| Body | `.t-body` | 400, 1.55 |
| Small | `.t-small` | 400, 1.5, 0.9375rem |
| Caption | `.t-caption` | 450, 1.4, 0.8125rem |
| Meta | `.t-meta` | 650, caps, +0.09em, 0.75rem. Folios, credits, plate numbers only |

### Display: Big Shoulders Display

`app/fonts/display.ts`. Weight 800, uppercase, tracking -0.01em, leading 0.86
(`.t-display`, sizes `-s`, `-m`, `-l`). Never for reading.

**A display instrument, not the personality of every section.** Big Shoulders is
for high-impact editorial typography:

- mastheads
- major section titles (Selected Work, File 001)
- oversized statements (the cover headline)
- selected labels, where they earn it (a project's name on its own poster)

It is **not** the default heading face. **Schibsted Grotesk carries substantial
hierarchy throughout the site**: most subheads, the informational and technical
sections (architecture, stack, decisions, credits, evidence), headings inside
prose, and navigation. `.t-head-1..3` are Schibsted on purpose.

The contrast between the two families is part of the identity, and it only exists
while the display face is scarce. A screen with more than one or two display
moments, or a case study whose every heading is condensed caps, is overusing it.
When unsure, set the heading in Schibsted.

**Chosen over Anybody from rendered specimens** (plates 1a, 1b, 1c). Measured at
weight 800:

- "BUILDS THINGS" is 4.92em in Big Shoulders and 5.86em in Anybody at width 75:
  in the same column Big Shoulders sets type **19% larger**.
- Anybody's counters close below width 62 and width 50 is a block; its usable
  range (75-150) is a wide, heavy grotesque common on contemporary brand sites.
- Big Shoulders reads as a front-page headline; its tall stems survive being
  half covered by a photograph; it gives a portrait phone a masthead with height.
- 35.5 KB against 56.9 KB (latin woff2).
- Given up: the width axis. Not worth a second display face.
- Known risk: condensed all-caps can read as a concert poster. The guard is the
  clean composition. Set at column scale with Schibsted doing the reading and one
  red doing the pointing, it reads as a front page. Keep it that way.

"Big Shoulders Display" is no longer in `next/font/google`'s catalog (Google
merged it into "Big Shoulders" with an `opsz` axis), which is one reason all
fonts are **self-hosted woff2 loaded with `next/font/local`** (see
`app/fonts/README.md`). It also makes CI and Vercel builds deterministic.

### Fitting a word to a column

Measured advance widths at weight 800, -0.01em, in em: BLANKE **2.546**, MATTHEW
**3.369**, MATTHEW BLANKE **6.121**, BUILDS THINGS **4.923**, PEOPLE USE. **4.093**.
A word fills its container at `font-size = 100 / width-em` in `cqw`. Re-measure
in a real browser if the face or tracking changes.

### Rules

- Display is uppercase. Never letter-space it open; tight or neutral only.
- Display is an instrument, not the default heading. Reach for Schibsted first.
- Do not accent one word of a headline with a different color, weight or
  italic. Red is a pointer, not a highlighter. (A marker circle drawn *over* a
  word is different: it is vandalism laid on top of finished type, removable and
  hidden by Clean Copy, not a typographic treatment baked into the headline.)
- Numbered markers only when the content really is a sequence (folios, plate
  numbers, a genuine process).
- All type sizes are `rem`. Display and headings may be fluid; body stays fixed.

### Handwriting

The final marker layer will be **Matthew's real handwriting**, scanned. **No
handwriting font is part of the identity, and none may imitate it.** Until the
scans exist, use plain geometric SVG marks (`components/design/marks.tsx`),
which are visibly temporary. Needed scans: letters, numbers, arrows, circles,
underlines, X marks, stars, brackets, scribbles, short phrases.

## 5. Color

Restrained on purpose: **warm paper, hard white, toner ink, one assertive red.**
Tokens in `app/globals.css` (`@theme`); mirrored in `lib/design/palette.ts` and
kept in sync by a test.

| Token | Value | Use |
|---|---|---|
| `paper` | `#F4F3EF` | The ground. Every page starts here. |
| `white` | `#FFFFFF` | Hard white surfaces that sit on paper. |
| `ink` | `#10100F` | Type, rules, black fields. |
| `red` | `#D42A1E` | The one global accent: pointers, links, marks, the one button. |
| `paper-shade` | `#E7E5DD` | Paper on paper: torn slabs, placeholders. |
| `ink-soft` | `#5A5954` | Secondary text and captions (6.3:1 on paper). |
| `red-deep` | `#A82016` | Hover and pressed red. |

Contrast (computed, tested): ink on paper 17.2, ink-soft on paper 6.3, **red on
paper 4.56**, red on white 5.06, **white on red 5.06**, paper on ink 17.2.
**Red on ink is 3.76: marks and large type only, never small text.** On ink
surfaces text accents fall back to paper (`--accent`), while rules and marks stay
red (`--accent-graphic`). On red, use white text, never ink.

Yellow, cobalt, pink, green and the rest are **not** global. They exist only
inside a project's own spread. Use `.surface-paper|white|ink|red` to rebind the
semantic tokens (`--surface`, `--on`, `--on-soft`, `--accent`, `--rule`,
`--focus`) instead of hard-coding colors.

The default Tailwind palette remains available only because the admin UI is
authored with it. **Public and design code must not use it** (a test enforces
this).

## 6. Texture

Allowed vocabulary: subtle photocopy grain, halftone, torn paper masks, black
marker, physical paper, restrained tape, wheatpaste wrinkles, and print
registration imperfection when justified.

Use one or two per composition. Not all at once. **Never**: staples everywhere,
tape on every image, torn edges on every container, heavy full-screen noise,
fake distressed type, random scratches, downloaded grunge overlays.

Everything in `globals.css` is a **temporary stand-in** built from CSS or SVG so
the system could be judged: torn edges (`.torn-*`, static polygons generated once
from a seeded PRNG), tape (`.tape`), grain (`.grain`, an SVG turbulence tile),
halftone (`.halftone`). Scanned paper, tape, edges and grain replace them in a
later real-asset milestone. Keep temporary and final assets clearly separated.

## 7. Photography

No photography is in the codebase yet, and none may be faked. The hero image will
be real photography of Matthew: full-body, editorial rather than corporate,
fashion/streetwear-campaign influenced, natural proportions, clean enough to
layer type behind. No AI-headshot look. No stock. The cover is one of the
cleaner parts of the site; rougher environmental, street and direct-flash
photography belongs deeper in.

The hero will probably be the LCP element: **do not spend the performance
budget on foundation assets.**

## 8. Layers

Type can sit behind a photograph, in front of it, or between physical layers,
without z-index values spreading through the code. The only z-index values in the
codebase are these tokens (`--layer-*`); use `.layer-*` inside a `.stage`, which
creates an isolated stacking context.

`ground 0 · paper 10 · type-back 20 · subject 30 · type-front 40 · collage 50 ·
annotation 60 · grain 70 · navigation 80 · cursor 90 · modal 100`

## 9. Controlled-chaos primitives

A small vocabulary, not an engine. All in `app/globals.css`, all multiplied by
`--chaos`:

`.tilt-cw-1..4 / .tilt-ccw-1..4` · `.nudge-{r,l,d,u}-1..3` · `.overlap-{t,l}-1..3` ·
`.bleed-{start,end,x}` · `.crop-*` · `.torn-*` · `.paper-shade` · `.tape` ·
`.grain` · `.halftone` · `.annotation` · `.stage` · `.layer-*` · `.ornament`

**Chaos is deterministic. Never use `Math.random()` for visible design** (a test
enforces it). Hand-built pages pick classes by eye. For repeatable collections,
`lib/design/seed.ts` picks from the same fixed presets by hashing a stable id
(a slug), so the same item always gets the same tilt on server and client. Do not
build a collage framework or page builder.

### Tools, not a composition system

The deterministic utilities and `seed.ts` exist so that *repeatable* variation is
stable. They compose nothing. **Major compositions are art-directed by hand**:

- the cover
- major photography
- flagship project spreads
- important typography
- File 001 layouts
- major transitions

Choose each tilt, overlap and crop deliberately, for a reason, by looking at the
result. **Do not hash important elements into random-looking positions because
presets exist.** Seeded variation is appropriate only for repeatable collections
where the variation is part of the concept (for example a future poster wall of
many similar items), and even there the output is reviewed, not accepted unseen.

Marks are anchored to a **specific word or phrase** (`.mark-host`) so they point
at something. A mark that floats free, or crosses body text, is a bug.
Decoration is `aria-hidden` and `.ornament`; anything a mark "says" must also
exist as real text.

## 10. Clean Copy

Implemented as infrastructure (it stayed small). `html[data-copy="clean"]` sets `--chaos: 0`, hides
`.ornament`, tape, grain and halftone, and straightens torn edges. Every word,
image and control remains. A viewer preference, not a second site.

- Set **before first paint** by a tiny inline script in `app/layout.tsx` from
  `localStorage`, so it never flashes and needs no cookie or dynamic rendering.
- `components/design/clean-copy-toggle.tsx` reads and flips it (`aria-pressed`).
  Only the proof sheet mounts it.
- **Whether Clean Copy ever becomes a visitor-facing control is undecided and
  deferred** until the real site compositions exist. Do not add it to navigation
  or the site shell. The mechanism stays available for development,
  accessibility and later experimentation.
- Independent of `prefers-reduced-motion`, which separately zeroes motion.

## 11. Interaction vocabulary (six patterns; none built in M1)

1. **Layered depth.** Small relative movement between editorial layers.
2. **Draggable physical objects.** Selectively: posters, cards, stickers.
3. **Marker vandalism / reveal.** Marks appearing in response to interaction.
4. **Contextual cursor label.** A small label on interactive objects. **The native
   cursor stays visible.** Never replace it.
5. **Torn-edge / mask transition.** For meaningful section changes.
6. **Scoped kinetic headline.** Type reacts only in selected high-value moments.

Rules: pointer-only behavior may never carry unique required information. Every
drag has a non-drag alternative (keyboard and buttons). Every hover reveal also
works on focus and on touch. Touch targets are at least 44px.

## 12. Motion

Tokens: two easings (`--ease-out`, `--ease-in-out`), four durations
(`--dur-instant|quick|base|slow`). Motion communicates depth, state,
physicality or story. Use `transform`, `opacity`, `clip-path`, masks.

Never: `transition: all` (a test enforces it), fade-up on every section,
animation because an element entered the viewport, content hidden behind
animation, perpetual decorative movement, a giant intro before content,
scroll-jacking.

`prefers-reduced-motion: reduce` zeroes every duration and must leave a complete
static composition. Verified: zero running animations under reduced motion.

No animation library is installed. GSAP, Three.js, Lenis and Motion are not
added until a specific interaction justifies one.

## 13. Responsive art direction

Mobile is not scaled-down desktop. Identity, type, materials and tone are shared;
compositions differ.

- **Cover.** Desktop: full spatial layering around the full-body photograph.
  Mobile: stacked masthead, an intentionally cropped figure, simpler layering.
- **Selected Work wall.** Desktop: may support dragging. Mobile: a deliberate,
  tappable, stacked poster composition.
- No horizontal scrolling of the main document at any width (verified 1440 down
  to 320, and 200%/400% zoom). No layout that is a desktop squeezed to 375px. No
  hover-only information. Type can be re-composed, not just scaled.

## 14. Accessibility

Expressive design does not excuse inaccessible structure. Required: semantic
headings in DOM order (visual order never fights reading order), a skip link,
visible focus (3px, offset 3px, bound to the surface: ink on paper, paper on
ink), keyboard operation, contrast (see Color), 200% zoom, 320px width, reduced
motion, touch, honest alt text, and content that is understandable without any
decorative asset. Decorative handwriting or marker is never the only
representation of required information.

## 15. Performance

- Fonts: Schibsted 46.9 KB (preloaded) + Big Shoulders 35.5 KB, total site-wide
  82 KB. **Display is not preloaded until the cover lands** (M3): no public page
  sets display type yet. Public pages currently fetch 45.8 KB of font.
- CSS: about 8 KB gzipped for the whole foundation. No live filters over large
  areas; grain and halftone are opted in per surface.
- Layout shift: 0.0 measured on public pages and the proof sheet.
- Do not consume the hero's LCP budget with foundation assets. Lazy-load
  noncritical visual assets.

## 16. Project color worlds (documented, not built)

The global site is restrained and becomes more colorful only when the viewer
enters a product.

- **Rankle.** Red, yellow, blue, black, white. Tier bands, physical ranking
  cards, arguments in the margins, stamped or marked results, social-game
  energy. Louder and more playful than the global portfolio.
- **Plannr.** Its real product palette (navy `#002e61`, gold `#fdb814`, paper
  `#f7f2e7`, wave blue `#3d7ede`, and type-coded chips). Syllabus, calendar,
  highlighted dates, annotation, structured information. More ordered than
  Rankle.
- **RankTheRef.** Provisional until its details are confirmed.

A spread may override the semantic tokens on its own `.stage`; it may not add
global tokens.

### Global effects do not propagate into spreads

Halftone, torn edges, tape and red annotations are *global* materials. They are
not applied to project assets automatically. Rankle and Plannr establish their
own visual rules while living inside the editorial system: their own palette,
their own kind of mark (a Rankle mark might be a stamp on a tier card, a Plannr
mark a highlighter on a date), their own treatment of screenshots.

- Red annotations are the *global* accent. Inside Rankle, where red is part of the
  palette, they would carry no meaning.
- Product screenshots are evidence: keep them legible. Do not halftone, tear or
  tape them unless the alteration is itself the point.
- A spread may use a global treatment only when it passes the semantic test in
  section 1, never by default.

## 17. Never do this

Generic software-engineer portfolio aesthetics. A centered "Hi, I'm Matt" hero.
Glowing gradients. Gradient text. Glassmorphism. Fake terminals. Matrix or hacker
visuals. Cards for everything. Bento-everything. Generic shadcn styling on public
pages. Excessive rounded rectangles. Random blobs. Generic "AI portfolio" design.
3D merely to show technical ability. Floating tech logos. Skill bars. Scrolling
code backgrounds. Fake metrics, testimonials or user counts. Stock photography.
Distressed type everywhere. Animation on every section. A custom cursor that
replaces the native one. Random chaos. A giant intro animation before content.
Unnecessary scroll-jacking. A serif added for variety. Everything distressed.

## 18. Working in this codebase

| Where | What |
|---|---|
| `app/globals.css` | Every token and primitive. The only place for z-index values and hex colors. |
| `app/fonts/` | Self-hosted fonts and their README. |
| `lib/design/` | `contrast.ts`, `palette.ts`, `seed.ts`. |
| `components/design/` | Marks and the Clean Copy toggle. |
| `app/proof/` | The proof sheet: `/proof` locally and on previews, 404 on production. |
| `tests/design/` | Guards for the rules above. |

### Legacy pages

Home, Projects, About, Experience and Coursework are M0 structures that only
inherit the foundation's base styles (paper, Schibsted, a framed `<main>`). They
are placeholders and will be replaced or substantially recomposed in later
milestones. **Do not polish them.** Change them only to fix a functional or
accessibility regression.

Preserve the M0 invariants: public routes stay public, `/admin` stays protected,
Convex enforces admin, `/plannr/*` is untouched, `matthewblanke.com` is canonical,
and **never `redirect()` inside an admin page**.

## 19. Decision log

- **M1.** Display face: Big Shoulders Display over Anybody, from rendered
  compositions (not theory). Poster red settled at `#D42A1E` after computing
  contrast (a brighter `#E8322B` fails 4.5:1 as text on paper). Fonts self-hosted.
  Italic not loaded. Instrument Serif not adopted. Clean Copy implemented.
  Marks anchored to words after a first version's marks crossed body text.
  Bleed made subject to Clean Copy after review showed it was the one grid
  violation that survived.
- **M1 guardrail pass.** Big Shoulders clarified as a display instrument, not the
  default heading face. Added the semantic-vandalism principle ("why was this
  altered?"). Clarified that deterministic utilities are tools, not a composition
  system: major compositions are art-directed by hand. Clean Copy stays as
  infrastructure; the public toggle is deferred. Global effects do not propagate
  into project spreads. Legacy public pages are not to be polished.
