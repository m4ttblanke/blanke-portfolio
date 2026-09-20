import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CleanCopyToggle } from "@/components/design/clean-copy-toggle";
import { MarkArrow, MarkCircle, MarkUnderline, MarkX } from "@/components/design/marks";
import { contrastRatio, grade } from "@/lib/design/contrast";
import { PAIRS, PALETTE, type PaletteName } from "@/lib/design/palette";
import { anybody } from "./candidates";
import "./proof.css";

// Internal proof sheet. Hidden on the production deployment, visible locally and
// on Vercel previews. Not in the sitemap, not indexable.
export const metadata: Metadata = {
  title: "Proof sheet: Matthew Blanke, Issue 001",
  robots: { index: false, follow: false },
};

// Full class names, written out, so Tailwind's scanner can see every one.
const BG: Record<PaletteName, string> = {
  paper: "bg-paper", "paper-shade": "bg-paper-shade", white: "bg-white", ink: "bg-ink",
  "ink-soft": "bg-ink-soft", red: "bg-red", "red-deep": "bg-red-deep",
};
const FG: Record<PaletteName, string> = {
  paper: "text-paper", "paper-shade": "text-paper-shade", white: "text-white", ink: "text-ink",
  "ink-soft": "text-ink-soft", red: "text-red", "red-deep": "text-red-deep",
};

const WIDTHS = [50, 75, 100, 125, 150] as const;
const WEIGHTS = [500, 600, 700, 800, 900] as const;
const TITLES = ["Selected Work", "File 001", "Rankle", "Plannr", "Currently Building", "How I Think About Software"] as const;

const PLATES = [
  ["1a", "candidate-a", "Display candidate A: Anybody"],
  ["1b", "candidate-b", "Display candidate B: Big Shoulders Display"],
  ["1c", "verdict", "Verdict on the display face"],
  ["2", "reading", "Reading type: Schibsted Grotesk"],
  ["3", "color", "Color"],
  ["4", "grid", "Grid and the four violations"],
  ["5", "comp-clean", "Clean composition"],
  ["6", "comp-marked", "Marked-up composition"],
  ["7", "materials", "Materials and layers"],
  ["8", "small", "Small screens"],
] as const;

const ROLES = [
  ["Display", "Big Shoulders Display 800, caps, tracking −0.01em, leading 0.86, fluid 2.75 to 19rem", "t-display t-display-s", "Builds things"],
  ["Head 1", "Schibsted Grotesk 800, −0.03em, leading 1.0, fluid 2.5 to 6.25rem", "t-head-1", "Head one"],
  ["Head 2", "Schibsted Grotesk 750, −0.025em, leading 1.06, fluid 1.75 to 3rem", "t-head-2", "Head two"],
  ["Head 3", "Schibsted Grotesk 700, −0.015em, leading 1.2, 1.25 to 1.5rem", "t-head-3", "Head three"],
  ["Lede", "Schibsted Grotesk 500, −0.01em, leading 1.32, 1.25 to 1.75rem", "t-lede", "A standfirst under a headline."],
  ["Body", "Schibsted Grotesk 400, leading 1.55, 1.0625rem, measure 64ch", "t-body", "Body copy for reading."],
  ["Small", "Schibsted Grotesk 400, leading 1.5, 0.9375rem", "t-small", "Secondary information."],
  ["Caption", "Schibsted Grotesk 450, leading 1.4, 0.8125rem", "t-caption", "Fig. 1. A caption under a figure."],
  ["Meta", "Schibsted Grotesk 650, caps +0.09em, 0.75rem. Folios, credits, plate numbers only", "t-meta", "Issue 001"],
] as const;

const LAYERS = [
  ["ground", 0, "The page itself"],
  ["paper", 10, "Sheets of paper laid on the ground"],
  ["type-back", 20, "Type that sits behind the subject"],
  ["subject", 30, "The photograph or main object"],
  ["type-front", 40, "Type that crosses in front of the subject"],
  ["collage", 50, "Tape, stickers, torn pieces"],
  ["annotation", 60, "Marker marks"],
  ["grain", 70, "Photocopy grain over a surface"],
  ["navigation", 80, "Site navigation"],
  ["cursor", 90, "Contextual cursor label"],
  ["modal", 100, "Dialogs and the skip link"],
] as const;

function PlateHead({ id, no, title, note }: { id: string; no: string; title: string; note?: string }) {
  return (
    <div className="plate-head">
      <p className="plate-no t-meta">Plate {no}</p>
      <h2 id={`${id}-h`} className="t-head-2">{title}</h2>
      {note ? <p className="t-small">{note}</p> : null}
    </div>
  );
}

function DisplayPlate({ id, no, variant, name, axisNote }: { id: string; no: string; variant: "display-a" | "display-b"; name: string; axisNote: string }) {
  const isA = variant === "display-a";
  return (
    <section id={id} aria-labelledby={`${id}-h`} className={`plate ${variant}`}>
      <div className="page-grid">
        <div className="plate-head">
          <p className="plate-no t-meta">Plate {no}</p>
          <h2 id={`${id}-h`} className="t-head-2">{name}</h2>
          <p className="t-small">{axisNote}</p>
        </div>

        <div className="dp-tests">
          <div>
            <span className="t-meta t-soft dp-label">Masthead: MATTHEW / BLANKE, fitted to the column</span>
            <div className="fit">
              <span className="t-display fit-matthew">Matthew</span>
              <span className="t-display fit-blanke">Blanke</span>
            </div>
          </div>

          <div>
            <span className="t-meta t-soft dp-label">Occlusion: BLANKE behind a photo block, a line in front (the block is a placeholder, not the subject)</span>
            <div className="occlude fit stage">
              <div className="back layer-type-back"><span className="t-display fit-blanke" style={{ display: "block", whiteSpace: "nowrap" }}>Blanke</span></div>
              <div className="block layer-subject placeholder"><span>Photo placeholder</span></div>
              <p className="front layer-type-front t-display"><span>Builds things</span></p>
            </div>
          </div>

          <div>
            <span className="t-meta t-soft dp-label">Headline, uppercase, two sizes</span>
            <p className="t-display t-display-m">Builds things<br />people use.</p>
            <p className="t-display t-display-s" style={{ marginBlockStart: "1.5rem" }}>Builds things people use.</p>
          </div>

          <div>
            <span className="t-meta t-soft dp-label">{isA ? "Width axis (wdth 50 to 150), same word" : "Weight axis (500 to 900), same word. This face has no width axis"}</span>
            <div className="ladder">
              {(isA ? WIDTHS : WEIGHTS).map((v) => (
                <div className="ladder-row" key={v}>
                  <span className="t-meta t-soft">{isA ? `wdth ${v}` : `wght ${v}`}</span>
                  <span className="t-display" style={isA ? { fontVariationSettings: `"wdth" ${v}` } : { fontWeight: v }}>Blanke</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <span className="t-meta t-soft dp-label">Section titles as they will be set</span>
            <div className="title-list">
              {TITLES.map((t) => (
                <div className="title-row" key={t}>
                  <span className="t-meta t-soft">Title</span>
                  <span className="t-display">{t}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <span className="t-meta t-soft dp-label">Leaving the viewport: MATTHEW BLANKE cropped by the frame</span>
            <div className="leave"><p className="t-display">Matthew Blanke</p></div>
          </div>

          <div>
            <span className="t-meta t-soft dp-label">Case test: the display face is never asked to set lowercase, but here is how it copes</span>
            <p className="t-display t-display-s" style={{ textTransform: "none", letterSpacing: "-0.01em" }}>Builds things people use.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// One composition, two treatments. The clean one is the design; the marked-up
// one is the SAME skeleton with a few earned interruptions. Marks and slabs are
// decorative (aria-hidden / .ornament) and vanish under Clean Copy.
function Composition({ variant }: { variant: "clean" | "marked" }) {
  const m = variant === "marked";
  return (
    <article className={`comp ${m ? "comp-bleed" : ""} surface-paper stage`} aria-label={m ? "Composition B, marked up" : "Composition A, clean"}>
      <div className="comp-grid">
        <div className="c-folio t-meta">
          <span>Matthew Blanke</span>
          <span>Issue 001</span>
          <span>{m ? "Composition B" : "Composition A"}</span>
        </div>

        <h3 className="c-head t-display">
          <span className="rule-accent" aria-hidden="true" />
          <span className="line">Builds things</span>
          <span className="line">
            {m ? (
              <span className="mark-host">
                people
                <span className="annotation ornament mark-circle" aria-hidden="true"><MarkCircle /></span>
              </span>
            ) : "people"}{" "}
            use.
          </span>
        </h3>

        <p className="c-dek t-lede">
          Everything begins aligned. Something must{" "}
          {m ? (
            <span className="mark-host">
              earn the right to break.
              <span className="annotation ornament mark-underline" aria-hidden="true"><MarkUnderline /></span>
            </span>
          ) : "earn the right to break."}
        </p>

        <figure className={`c-fig ${m ? "layer-subject tilt-cw-2 tape overlap-l-1" : ""}`}>
          <div className={`crop crop-portrait placeholder ${m ? "halftone" : ""}`}>
            <span>Image placeholder 4:5</span>
          </div>
          <figcaption className="t-caption t-soft">Fig. 1. Placeholder. Real photography arrives in a later milestone.</figcaption>
        </figure>

        <dl className="c-meta t-caption">
          <dt>Format</dt><dd>Proof sheet</dd>
          <dt>Body face</dt><dd>Schibsted Grotesk</dd>
          <dt>Display face</dt><dd>Big Shoulders Display</dd>
          <dt>Status</dt><dd>Temporary</dd>
        </dl>

        <div className={`c-body ${m ? "slab" : ""}`}>
          {m ? <span className="slab-bg ornament layer-paper paper-shade torn-bottom-a grain tilt-ccw-1" aria-hidden="true" /> : null}
          <div className={`copy t-body ${m ? "slab-body layer-type-front" : ""}`}>
            <div className="cols">
              <p>This is a proof, not a page. It exists to answer one question before any photograph, project or texture arrives: does the publication already look like itself when it is only type, a grid and paper? If the answer depends on a torn edge, the foundation is too weak.</p>
              <p>Type carries the structure. A tall display face sets the headline, a plain grotesque does the reading, and a single red does the pointing. Nothing else has been permitted to talk yet.</p>
              <p>Composition B is this same page after it has been marked up. Compare them. The second should feel like the first, interrupted.</p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function ProofPage() {
  if (process.env.VERCEL_ENV === "production") notFound();

  const core: PaletteName[] = ["paper", "white", "ink", "red"];
  const support: PaletteName[] = ["paper-shade", "ink-soft", "red-deep"];
  const roleNote: Record<string, string> = {
    paper: "The ground. Every page starts here.",
    white: "Hard white. Surfaces that sit on paper.",
    ink: "Type, rules, black fields.",
    red: "The one global accent: pointers, links, marks, the one button.",
    "paper-shade": "Paper on paper: torn slabs, placeholders.",
    "ink-soft": "Secondary text and captions.",
    "red-deep": "Hover and pressed states for red.",
  };

  return (
    <div className={`${anybody.variable} proof surface-paper`}>
      <a className="skip-link" href="#main-content">Skip to content</a>

      <header className="page-grid" style={{ paddingBlockStart: "1rem" }}>
        <div className="plate-head" style={{ marginBlockEnd: "1rem" }}>
          <p className="plate-no t-meta">Matthew Blanke</p>
          <p className="t-meta" style={{ gridColumn: "3 / -1" }}>Issue 001 · Proof sheet · M1 · Not for publication</p>
        </div>
        <div className="plate-body">
          <h1 className="t-display t-display-m">Proof sheet</h1>
          <p className="t-lede measure" style={{ marginBlockStart: "1.25rem" }}>
            What a Matthew Blanke page looks like before photography, projects, collage and interaction are doing the work.
          </p>
          <div className="controls" style={{ marginBlockStart: "1.5rem" }}>
            <CleanCopyToggle />
            <span className="t-small t-soft">Removes rotation, tape, grain, halftone, marks and torn edges. Every word stays.</span>
          </div>
          <nav aria-label="Plates">
            <ol className="proof-toc t-small">
              {PLATES.map(([no, id, title]) => (
                <li key={id}><a href={`#${id}`}><span className="t-meta" style={{ inlineSize: "2.5rem" }}>{no}</span>{title}</a></li>
              ))}
            </ol>
          </nav>
        </div>
      </header>

      <main id="main-content">
        <DisplayPlate id="candidate-a" no="1a" variant="display-a" name="Anybody (variable)" axisNote="Width 50 to 150, weight 100 to 900. Shown at width 75, weight 800, tracking 0. Width 62 with negative tracking was tried first and the letters collided." />
        <DisplayPlate id="candidate-b" no="1b" variant="display-b" name="Big Shoulders Display (variable)" axisNote="Weight 100 to 900, condensed by design, no width axis. Shown at weight 800, tracking −0.01em." />

        <section id="verdict" aria-labelledby="verdict-h" className="plate">
          <div className="page-grid">
            <PlateHead id="verdict" no="1c" title="Verdict on the display face" />
            <div className="plate-body verdict">
              <div className="lead stack-gap">
                <h3 className="t-display t-display-s">Big Shoulders Display</h3>
                <p className="t-lede">Chosen from the renders above and the compositions in plates 5 and 6, not from theory.</p>
                <p className="t-body measure">It reads as a front-page headline, where Anybody at readable widths reads as the same heavy contemporary grotesque found on countless brand sites. Its tall stems survive being half covered by a photograph, and it gives a portrait phone a masthead with real height.</p>
              </div>
              <ul className="facts t-small">
                <li><b>Measured.</b> At weight 800, BUILDS THINGS is 4.92em in Big Shoulders and 5.86em in Anybody at width 75. In the same column Big Shoulders sets type 19% larger.</li>
                <li><b>Anybody’s counters close.</b> Below width 62 it turns to a block; width 50 is unreadable. Its usable range is 75 to 150, where it is a wide, heavy grotesque.</li>
                <li><b>Payload.</b> 35.5 KB against 56.9 KB (latin woff2), 21 KB lighter.</li>
                <li><b>What was given up.</b> The width axis, which would suit a kinetic headline. Not worth a second display face; weight is animatable instead.</li>
                <li><b>Use.</b> An instrument, not the default heading face: mastheads, major section titles, oversized statements. Schibsted carries the rest of the hierarchy.</li>
                <li><b>Risk.</b> Condensed all-caps can read as a concert poster. The clean composition is the guard: at column scale, with Schibsted doing the reading and one red doing the pointing, it reads as a front page.</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="reading" aria-labelledby="reading-h" className="plate">
          <div className="page-grid">
            <PlateHead id="reading" no="2" title="Reading type: Schibsted Grotesk" note="One variable file, normal style, weight 400 to 900. Body 17px, never below 16 for reading text." />
            <div className="plate-body reading">
              <div>
                <table className="roles t-small">
                  <caption className="t-meta t-soft">Type roles</caption>
                  <tbody>
                    {ROLES.map(([role, spec, cls, sample]) => (
                      <tr key={role}>
                        <th scope="row">{role}</th>
                        <td><span className={cls}>{sample}</span><br /><span className="t-caption t-soft">{spec}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="stack-gap">
                <div className="copy">
                  <h2>A reading page</h2>
                  <p className="t-lede">Long-form text sits at a fixed 64 characters, in a plain grotesque, on paper.</p>
                  <p>Body copy is set at 17 pixels with generous leading. Links are underlined and turn red on hover; <a href="#reading">this one goes nowhere</a>. Emphasis is <em>weight, not a synthesized italic</em>, because an italic face is not loaded until something needs it.</p>
                  <h3>A third-level heading</h3>
                  <ul>
                    <li>Lists keep their markers and their spacing.</li>
                    <li>Nothing here is decorative.</li>
                  </ul>
                </div>

                <div>
                  <span className="t-meta t-soft dp-label">Navigation</span>
                  <nav aria-label="Sample navigation" className="nav-sample">
                    <a href="#reading" aria-current="page">Work</a>
                    <a href="#reading">About</a>
                    <a href="#reading">Résumé</a>
                    <a href="#reading">Contact</a>
                  </nav>
                </div>

                <div>
                  <span className="t-meta t-soft dp-label">Controls: square, 44px minimum, no shadow</span>
                  <div className="controls">
                    <a className="btn" href="#reading">Send an email</a>
                    <a className="btn-quiet" href="#reading">Résumé</a>
                    <a className="btn-quiet force-focus" href="#reading">Focus ring (forced)</a>
                  </div>
                  <p className="t-caption t-soft" style={{ marginBlockStart: "0.75rem" }}>Tab through this sheet to see the real ring. It is 3px, offset 3px, and follows the surface: ink on paper, paper on ink.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="color" aria-labelledby="color-h" className="plate">
          <div className="page-grid">
            <PlateHead id="color" no="3" title="Color" note="Warm paper, hard white, toner ink, one assertive red. Yellow, blue and the rest arrive only inside a project's own spread." />
            <div className="plate-body">
              <div className="swatches core">
                {core.map((n) => (
                  <div key={n} className={`swatch ${BG[n]} ${n === "paper" || n === "white" ? FG.ink : n === "ink" ? FG.paper : FG.white}`}>
                    <b>{n}</b>
                    <span className="t-caption">{PALETTE[n].toUpperCase()}</span>
                    <span className="t-caption">{roleNote[n]}</span>
                  </div>
                ))}
              </div>
              <div className="swatches support" style={{ marginBlockStart: "var(--gutter)" }}>
                {support.map((n) => (
                  <div key={n} className={`swatch ${BG[n]} ${n === "paper-shade" ? FG.ink : FG.white}`} style={{ minBlockSize: "7rem" }}>
                    <b>{n}</b>
                    <span className="t-caption">{PALETTE[n].toUpperCase()}</span>
                    <span className="t-caption">{roleNote[n]}</span>
                  </div>
                ))}
              </div>

              <table className="contrast t-small">
                <caption className="t-meta t-soft">Contrast, computed from the palette (WCAG 2)</caption>
                <thead>
                  <tr><th scope="col">Sample</th><th scope="col">Pair</th><th scope="col">Ratio</th><th scope="col">Good for</th></tr>
                </thead>
                <tbody>
                  {PAIRS.map((p) => {
                    const r = contrastRatio(PALETTE[p.fg], PALETTE[p.bg]);
                    const g = grade(r);
                    return (
                      <tr key={`${p.fg}-${p.bg}`} className={r < 4.5 ? "warn" : undefined}>
                        <td><span className={`chip ${BG[p.bg]} ${FG[p.fg]}`} aria-hidden="true">Aa</span></td>
                        <td>{p.fg} on {p.bg}<br /><span className="t-caption t-soft">{p.use}</span></td>
                        <td className="num">{r.toFixed(2)}:1</td>
                        <td>{g}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section id="grid" aria-labelledby="grid-h" className="plate">
          <div className="grid-demo">
            <div className="gcols" aria-hidden="true">
              {Array.from({ length: 12 }, (_, i) => (<span key={i}>{i + 1}</span>))}
            </div>
            <div className="page-grid">
              <PlateHead id="grid" no="4" title="Grid and the four violations" note="12 columns from 1024px, 8 from 768px, 4 below. Everything starts on the grid; a violation has to be earned, and there are only four ways to earn one." />
              <div className="col-span-4 md:col-span-6 lg:col-span-8 bleed-end viol viol-ink">1 · Bleed. Runs to the viewport edge from inside the grid.</div>
              <div className="col-span-4 md:col-span-5 lg:col-span-5 viol viol-shade" style={{ minBlockSize: "6rem" }}>2 · Overlap. The next block is pulled up over this one, on a higher layer.</div>
              <div className="col-span-3 col-start-2 md:col-span-4 md:col-start-3 lg:col-span-4 lg:col-start-4 viol viol-red layer-collage overlap-t-2 nudge-r-2">Overlap lands here.</div>
              <div className="col-span-4 md:col-span-4 lg:col-span-4">
                <div className="crop viol-crop viol-shade"><p className="t-display" aria-hidden="true">Cropped</p></div>
                <span className="viol viol-cap">3 · Crop. A fixed frame; the picture is cut to fit it.</span>
              </div>
              <div className="col-span-4 md:col-span-4 lg:col-span-4 lg:col-start-9 viol viol-red tilt-cw-2" style={{ minBlockSize: "5rem" }}>4 · Slight rotation. Named steps only. Body text is never rotated.</div>
            </div>
          </div>
          <div className="page-grid">
            <dl className="plate-body measure-list t-small">
              <div><dt>Columns</dt><dd>12 at 1024px and up · 8 at 768px · 4 below</dd></div>
              <div><dt>Outer margin</dt><dd>clamp(1rem, 4.2vw, 4.5rem)</dd></div>
              <div><dt>Gutter</dt><dd>clamp(0.75rem, 1.7vw, 1.75rem)</dd></div>
              <div><dt>Frame</dt><dd>90rem maximum; bleeds run past it</dd></div>
              <div><dt>Reading measure</dt><dd>64 characters</dd></div>
              <div><dt>Rhythm</dt><dd>8px unit · sections 3–5, 4–8, 6–13rem</dd></div>
            </dl>
          </div>
        </section>

        <section id="comp-clean" aria-labelledby="comp-clean-h" className="plate">
          <div className="page-grid">
            <PlateHead id="comp-clean" no="5" title="Clean composition" note="The design itself: type, grid, paper, one red. If the identity only appears after plate 6, the foundation is too weak." />
            <div className="frame plate-body"><Composition variant="clean" /></div>
          </div>
        </section>

        <section id="comp-marked" aria-labelledby="comp-marked-h" className="plate">
          <div className="page-grid">
            <PlateHead id="comp-marked" no="6" title="Marked-up composition" note="The same page. A bleed, an overlap, a slight rotation, a torn slab, tape, two marks: the mechanics, on placeholder content. About a quarter of the page, not all of it. On a real page each treatment needs a reason it was altered." />
            <div className="frame plate-body"><Composition variant="marked" /></div>
          </div>
        </section>

        <section id="materials" aria-labelledby="materials-h" className="plate">
          <div className="page-grid">
            <PlateHead id="materials" no="7" title="Materials and layers" note="Everything here is a temporary stand-in built from CSS or SVG. Scanned paper, tape, grain and handwriting replace these in a later real-asset milestone." />
            <div className="plate-body">
              <div className="tiles">
                <div className="tile">
                  <span className="temp-flag">Temporary</span>
                  <div className="tile-stage"><div className="paper-shade torn-bottom-a t-small" style={{ paddingInline: "1.25rem", paddingBlockStart: "1.5rem" }}>Torn edge A. A slab of paper laid on paper.</div></div>
                </div>
                <div className="tile">
                  <span className="temp-flag">Temporary</span>
                  <div className="tile-stage"><div className="paper-shade torn-bottom-b t-small" style={{ paddingInline: "1.25rem", paddingBlockStart: "1.5rem" }}>Torn edge B. A second seed so edges do not repeat.</div></div>
                </div>
                <div className="tile">
                  <span className="temp-flag">Temporary</span>
                  <div className="tile-stage"><div className="paper-shade torn-top-a t-small" style={{ paddingInline: "1.25rem", paddingBlockEnd: "1.5rem" }}>Torn top edge, for a section that begins with a rip.</div></div>
                </div>
                <div className="tile">
                  <span className="temp-flag">Temporary</span>
                  <div className="tile-stage"><div className="paper-shade tape tilt-cw-1 t-small" style={{ padding: "1.5rem 1.25rem" }}>Restrained tape: one strip, in one place.</div></div>
                </div>
                <div className="tile">
                  <span className="temp-flag">Temporary</span>
                  <div className="tile-stage"><div className="paper-shade grain t-small" style={{ padding: "1.5rem 1.25rem" }}>Photocopy grain on one surface, never the whole screen.</div></div>
                </div>
                <div className="tile">
                  <span className="temp-flag">Temporary</span>
                  <div className="tile-stage"><div className="placeholder halftone" style={{ minBlockSize: "7rem" }}><span>Halftone treatment</span></div></div>
                </div>
                <div className="tile">
                  <span className="temp-flag">Temporary</span>
                  <div className="tile-stage sunk">
                    <div className="marks surface-paper" style={{ backgroundColor: "transparent" }}>
                      <span className="swatch-mark"><MarkCircle /></span>
                      <span className="swatch-mark"><MarkUnderline /></span>
                      <span className="swatch-mark"><MarkArrow /></span>
                      <span className="swatch-mark"><MarkX /></span>
                    </div>
                  </div>
                  <p className="t-caption t-soft">Plain SVG marks. Not handwriting: real marks will be scans of Matthew’s own.</p>
                </div>
              </div>

              <table className="layers t-small" style={{ marginBlockStart: "clamp(2rem, 5vw, 4rem)" }}>
                <caption className="t-meta t-soft">Layer stack: the only z-index values in the codebase (use inside a .stage)</caption>
                <thead><tr><th scope="col">Layer</th><th scope="col">Value</th><th scope="col">For</th></tr></thead>
                <tbody>
                  {LAYERS.map(([name, value, use]) => (
                    <tr key={name}><th scope="row">{name}</th><td className="num">{value}</td><td>{use}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section id="small" aria-labelledby="small-h" className="plate" style={{ paddingBlockEnd: "var(--space-section-l)" }}>
          <div className="page-grid">
            <PlateHead id="small" no="8" title="Small screens" note="Not scaled-down desktop. The same compositions re-compose at 375px because they respond to their own width." />
            <div className="plate-body phones">
              <div>
                <p className="phone-label t-meta">Clean · 375px</p>
                <div className="phone"><Composition variant="clean" /></div>
              </div>
              <div>
                <p className="phone-label t-meta">Marked up · 375px</p>
                <div className="phone"><Composition variant="marked" /></div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
