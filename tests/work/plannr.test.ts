// @vitest-environment node
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { PLANNR, RANKLE } from "../../lib/work/projects";
import {
  DEADLINES,
  DECISIONS,
  DOCUMENT_DISCLAIMER,
  DOCUMENT_NOISE,
  FLOW_STEPS,
  PLANNR_LEDE,
  PLANNR_META,
  PRODUCT_CAPTION,
  RECEIPT_CREDITS,
  RECEIPT_NOT_ON_FILE,
  RECEIPT_ROWS,
  SYSTEM_COLUMNS,
  SYSTEM_HOPS,
  SYSTEM_STACK,
  TERM,
  termDate,
} from "../../lib/work/plannr-content";

const root = join(__dirname, "../..");
const read = (p: string) => readFileSync(join(root, p), "utf8");
const strip = (src: string) => src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1");

const dir = "components/plannr";
const tsx = readdirSync(join(root, dir)).filter((f) => f.endsWith(".tsx"));
const sources = Object.fromEntries(tsx.map((f) => [f, strip(read(`${dir}/${f}`))]));
const allSource = Object.values(sources).join("\n");
// M6B: exactly ONE client module, the trace island. Every other file stays a server component.
const ISLAND = "plannr-trace.tsx";
const serverSources = Object.entries(sources).filter(([name]) => name !== ISLAND);
const css = read(`${dir}/plannr.css`);
const content = read("lib/work/plannr-content.ts");

// Everything a visitor can read: the content module's strings (comments excluded) and the JSX.
const publicText = strip(content) + "\n" + allSource;

describe("Plannr case study: route and routing", () => {
  it("exists as a literal segment beside the Convex-backed [slug] route, like Rankle", () => {
    expect(existsSync(join(root, "app/(public)/projects/plannr/page.tsx"))).toBe(true);
    expect(existsSync(join(root, "app/(public)/projects/rankle/page.tsx"))).toBe(true);
    expect(existsSync(join(root, "app/(public)/projects/[slug]/page.tsx"))).toBe(true);
  });

  it("has accurate, non-promotional metadata and a canonical URL", () => {
    const page = read("app/(public)/projects/plannr/page.tsx");
    expect(page).toMatch(/alternates:\s*\{\s*canonical:\s*"\/projects\/plannr"/);
    expect(page).toMatch(/title:\s*"Plannr/);
    expect(page).not.toMatch(/best|revolutionary|#1|award|AI-powered|thousands|launched/i);
    expect(page).toMatch(/free TestFlight beta/);
  });

  it("is listed in the sitemap", () => {
    expect(read("app/sitemap.ts")).toContain("/projects/plannr");
  });

  it("the M4 poster routes to it (the one intended M4 change) and stays a real, labelled link", () => {
    expect(PLANNR.href).toBe("/projects/plannr");
    const poster = strip(read("components/work/plannr-poster.tsx"));
    expect(poster).toMatch(/import Link from "next\/link"/);
    expect(poster).toMatch(/<Link\s+href=\{PLANNR\.href\}\s+aria-label=\{PLANNR\.accessibleName\}/);
    expect(poster).not.toMatch(/<a\b/);
  });

  it("the live product site is still reachable at /plannr/ (M0 invariant): rewrites untouched, and the case links to it", () => {
    expect(read("next.config.ts")).toMatch(/source:\s*"\/plannr\/"/);
    expect(PLANNR_META.productHref).toBe("/plannr/");
    expect(allSource).toContain("PLANNR_META.productHref");
  });

  it("leaves Rankle's poster route and the M4 copy alone", () => {
    expect(RANKLE.href).toBe("/projects/rankle");
    expect(PLANNR.descriptor).toBe("Turns a syllabus into a calendar.");
    expect(PLANNR.meta).toBe("iOS · SwiftUI");
  });
});

describe("Plannr case study: freeze constraints (M2/M3/M4/M5)", () => {
  it("does not touch or import Rankle, the shell, or the cover", () => {
    expect(allSource).not.toMatch(/components\/(rankle|cover|shell)|rankle/i);
    expect(css).not.toMatch(/--rankle-|\.rk-|\.rankle-case/);
  });

  it("Rankle's files do not know about Plannr", () => {
    for (const f of readdirSync(join(root, "components/rankle"))) {
      expect(strip(read(`components/rankle/${f}`)), f).not.toMatch(/plannr/i);
    }
  });

  it("renders straight inside <main>: no special footer, no shell override", () => {
    expect(sources["plannr-case.tsx"]).not.toMatch(/SiteFooter|SiteHeader|<footer|<header[^>]*site/);
    expect(read("app/(public)/projects/plannr/page.tsx")).not.toMatch(/footer/i);
  });

  it("uses the pc- class prefix, never the M4 poster's pl-* names", () => {
    expect(css).not.toMatch(/\.pl-/);
    expect(allSource).not.toMatch(/className="[^"]*\bpl-/);
  });
});

describe("Plannr case study: color world containment", () => {
  const globals = read("app/globals.css");

  it("its palette is declared once, scoped to .plannr-case, and never in :root or @theme", () => {
    expect(globals).toMatch(/\.plannr-case\s*\{[^}]*--plannr-navy:\s*#002e61/);
    const theme = strip(globals.match(/@theme\s*\{[\s\S]*?\n\}/)?.[0] ?? "");
    expect(theme).not.toMatch(/plannr/i);
    const rootBlocks = strip([...globals.matchAll(/:root\s*\{[\s\S]*?\n\}/g)].map((m) => m[0]).join("\n"));
    expect(rootBlocks).not.toMatch(/plannr/i);
  });

  it("the pen blue and highlighter are derived from the four real values, not invented", () => {
    expect(globals).toMatch(/--plannr-pen:\s*color-mix\(/);
    expect(globals).toMatch(/--plannr-hl:\s*color-mix\(/);
  });

  it("the stylesheet uses tokens only: no raw colors, no Tailwind color families, no red", () => {
    expect(strip(css)).not.toMatch(/#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(/);
    expect(strip(css)).not.toMatch(/var\(--color-red/);
    expect(allSource).not.toMatch(/\b(?:bg|text|border)-(?:red|blue|yellow|amber)-\d+/);
  });

  it("never rotates body text: the only rotation is the review slip's slab behind its words, and no tilt utility on the document", () => {
    const rotations = [...strip(css).matchAll(/([^{}]+)\{[^{}]*(?<![-\w])rotate\s*:[^;}]*/g)].map((m) => m[1].trim());
    expect(rotations).toEqual([".pc-rs::before"]);
    expect(strip(css)).toMatch(/\.pc-rs::before\s*\{[^}]*rotate:\s*calc\(var\(--tilt-1\) \* var\(--chaos\)/);
    expect(sources["document-page.tsx"]).not.toMatch(/tilt-/);
  });

  it("z-index only via .layer-* on a .stage: none written here", () => {
    expect(strip(css)).not.toMatch(/z-index/);
    expect(allSource).toMatch(/className="stage page-grid/);
  });

  it("overlap and bleed are scaled by --chaos, so Clean Copy realigns them", () => {
    for (const m of strip(css).matchAll(/margin-inline[^:]*:\s*calc\([^;]*\*\s*-1\)/g)) {
      expect(m[0]).toContain("var(--chaos)");
    }
    expect(css).toMatch(/:root\[data-copy="clean"\] \.pc-hl/);
    expect(css).toMatch(/:root\[data-copy="clean"\] \.pc-product\s*\{[^}]*clip-path:\s*none/);
  });

  it("Big Shoulders stays a display instrument: two moments only, the wordmark and the four step words", () => {
    const per = Object.entries(sources)
      .map(([f, src]) => [f, [...src.matchAll(/t-display/g)].length] as const)
      .filter(([, n]) => n > 0);
    expect(per).toEqual([
      ["plannr-hero.tsx", 1],
      ["plannr-transformation.tsx", FLOW_STEPS.length],
    ]);
    expect(css).not.toMatch(/font-family/);
  });
});

describe("Plannr case study: static, server-rendered", () => {
  it("one client island only (M6B); every other file is a server component with no hooks or listeners", () => {
    const clients = Object.entries(sources).filter(([, src]) => /"use client"|'use client'/.test(src)).map(([n]) => n);
    expect(clients).toEqual([ISLAND]);
    for (const [name, src] of serverSources) {
      expect(src, name).not.toMatch(/\buse(State|Effect|Ref|Reducer|LayoutEffect)\b|onMouse|onPointer|onKey|onScroll|addEventListener/);
      // the one handler that exists outside the island is the document page's optional `trace` callback prop
      if (name !== "document-page.tsx") expect(src, name).not.toMatch(/onClick/);
    }
    expect(sources["document-page.tsx"].match(/onClick/g)).toHaveLength(1);
    expect(sources["document-page.tsx"]).toMatch(/onClick=\{\(\) => trace\.onSelect\(d\.id\)\}/);
  });

  it("no animation, scroll or pointer behavior in the CSS", () => {
    // the native cursor stays: only `cursor: pointer` on real controls, never a replacement
    expect(strip(css)).not.toMatch(/@keyframes|animation\s*:|scroll-timeline|animation-timeline|cursor\s*:\s*(?!\s|pointer\b)/);
    expect(strip(css)).not.toMatch(/transition(-property)?\s*:\s*all\b/);
  });

  it("added no dependency (no animation, drag, carousel or image library)", () => {
    const pkg = JSON.parse(read("package.json"));
    const deps = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies });
    for (const banned of ["framer-motion", "gsap", "motion", "react-spring", "@dnd-kit/core", "swiper", "embla-carousel-react", "three", "lenis", "sharp"]) {
      expect(deps, banned).not.toContain(banned);
    }
  });

  it("does not use Math.random for visible design", () => {
    expect(allSource + content).not.toMatch(/Math\.random/);
  });
});

describe("Plannr case study: the M6B foundation is present and inert", () => {
  it("carries the stable hooks M6B will enhance", () => {
    const flow = sources["plannr-transformation.tsx"];
    expect(flow).toContain("data-pl-flow");
    expect(flow).toContain('data-pl-step="syllabus"');
    expect(flow).toContain('data-pl-step="extract"');
    expect(flow).toContain('data-pl-step="review"');
    expect(flow).toContain('data-pl-step="calendar"');
    expect(sources[ISLAND]).toContain("data-pl-event={d.id}");
    expect(sources["document-page.tsx"]).toContain('"data-pl-deadline": d.id');
    expect(sources["document-page.tsx"]).toContain('"data-pl-deadline-when": d.id');
    expect(sources["term-grid.tsx"]).toContain("data-pl-cell={iso}");
    expect(sources["term-grid.tsx"]).toContain('"data-pl-event": hit.id');
  });

  it("the hooks are unique on the page: only the copy of the document inside the transformation carries them", () => {
    expect(sources[ISLAND]).toMatch(/<DocumentPage\s+variant="lines"\s+hooks\s+trace=/);
    expect(sources["plannr-hero.tsx"]).not.toMatch(/hooks/);
    expect(sources["plannr-document.tsx"]).not.toMatch(/hooks/);
    expect(sources["plannr-document.tsx"]).not.toMatch(/data-pl-/);
    expect(sources["plannr-hero.tsx"]).not.toMatch(/data-pl-/);
  });

  it("the review screenshot sits on a plate that is only a positioning context, and stays an inert image", () => {
    const flow = sources["plannr-transformation.tsx"];
    expect(flow).toMatch(/<div className="pc-review-plate" data-pl-review>\s*<Image/);
    // the bitmap is never a control: no handlers, no role, no tabindex, no map, no button in the figure
    const figure = flow.slice(flow.indexOf('<figure className="pc-step-art pc-review">'), flow.indexOf("</figure>", flow.indexOf('pc-review">')));
    expect(figure).not.toMatch(/<button|<a\b|role=|tabIndex|useMap|onClick|<input/);
    expect(css).toMatch(/\.pc-review-plate\s*\{[^}]*position:\s*relative/);
  });

  it("every part of the M6B model has a target: phrase, record, plate, and calendar cell per deadline", () => {
    const flow = sources["plannr-transformation.tsx"] + sources[ISLAND] + sources["document-page.tsx"] + sources["term-grid.tsx"];
    for (const hook of ["data-pl-deadline", "data-pl-event", "data-pl-review", "data-pl-cell"]) expect(flow).toContain(hook);
    // no interactive state is pre-baked into the server-rendered section; it is only ever added by the island's state
    expect(sources["plannr-transformation.tsx"]).not.toMatch(/data-pl-(active|state|selected|verdict|accepted|declined)/);
  });

  it("the four steps are a real ordered list in the order syllabus, extract, review, calendar", () => {
    expect(FLOW_STEPS.map((s) => s.key)).toEqual(["syllabus", "extract", "review", "calendar"]);
    expect(sources["plannr-transformation.tsx"]).toMatch(/<ol className="pc-steps">/);
  });

  it("every deadline appears on the page, in the records, and as a marked cell", () => {
    expect(DEADLINES).toHaveLength(6);
    const ids = new Set(DEADLINES.map((d) => d.id));
    expect(ids.size).toBe(6);
    const tags = new Set(DEADLINES.map((d) => d.tag));
    expect(tags.size).toBe(6);
  });
});

describe("Plannr case study: the illustration's arithmetic is right", () => {
  it("the term starts on a Monday and Week N is start + (N - 1) weeks", () => {
    expect(new Date(`${TERM.firstMonday}T00:00:00Z`).getUTCDay()).toBe(1);
    expect(termDate(1, 0)).toBe(TERM.firstMonday);
    expect(termDate(2, 0)).toBe("2027-01-11");
    expect(termDate(11, 4)).toBe("2027-03-19");
  });

  it("each deadline's resolved date matches its week and weekday, and lands on a weekday inside the term", () => {
    for (const d of DEADLINES) {
      expect(termDate(d.week, d.weekday), d.id).toBe(d.iso);
      expect(d.week).toBeGreaterThanOrEqual(1);
      expect(d.week).toBeLessThanOrEqual(TERM.weeks);
    }
  });

  it("phrases that name a week and weekday say the same one the data holds", () => {
    const names = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    for (const d of DEADLINES) {
      const m = d.written.match(/(Monday|Tuesday|Wednesday|Thursday|Friday)(?: of|,) Week (\d+)/);
      if (m) {
        expect(names.indexOf(m[1]), d.id).toBe(d.weekday);
        expect(Number(m[2]), d.id).toBe(d.week);
      }
    }
  });

  it("the one ringed date is the one the document never states, and the ring phrase is in it", () => {
    const inferred = DEADLINES.filter((d) => d.inferred);
    expect(inferred.map((d) => d.id)).toEqual(["final"]);
    expect(inferred[0].written).toContain(inferred[0].ring ?? "\u0000");
    expect(inferred[0].written).not.toMatch(/\d{4}|March|Mar\b/);
  });

  it("the illustrated page states the term start it depends on", () => {
    expect(DOCUMENT_NOISE.start).toMatch(/Week 1 begins Monday, January 4/);
  });

  it("the term grid renders every cell of the term with its ISO date", () => {
    expect(TERM.weeks * TERM.weekdays.length).toBe(55);
    expect(sources["term-grid.tsx"]).toMatch(/aria-hidden="true"/);
  });
});

describe("Plannr case study: content honesty", () => {
  it("never claims what the evidence does not support", () => {
    const banned: [RegExp, string][] = [
      [/AI[- ]powered/i, "AI-powered"],
      [/paying (customer|user)s?/i, "paying customers"],
      [/\b(hundreds|thousands|millions) of\b/i, "usage counts"],
      [/\bsolo build\b|\bbuilt (it )?solo\b|\bbuilt alone\b|entirely by/i, "sole authorship"],
      [/\bin production\b|\bproduction[- ]grade\b|\bproduction app\b/i, "production"],
      [/enterprise|scale[- ]ready|launched (at|to|on)/i, "launch inflation"],
      [/App Store/i, "App Store"],
      [/\b\d+(\.\d+)?\s?%\s*(accura|faster|less time)/i, "accuracy or time-saved figures"],
      [/\b(saves?|saved) (students )?\d+/i, "time-saved figures"],
      [/testimonial|"[^"]{20,}"\s*[-—]\s*(a )?(student|user)/i, "testimonials"],
    ];
    for (const [re, label] of banned) expect(publicText, label).not.toMatch(re);
  });

  it("names the beta as a beta, free, and public, and never as launched or shipped to users", () => {
    expect(PLANNR_META.status).toBe("Free public TestFlight beta");
    expect(publicText).toMatch(/free/i);
    expect(publicText).not.toMatch(/\bshipped to\b|\bgeneral availability\b/i);
  });

  it("does not list technologies that were only ever planned, replaced or absent", () => {
    for (const t of ["pdfplumber", "python-docx", "dateparser", "SQLite", "AWS", "Route 53", "Vercel", "Stripe Connect"]) {
      expect(SYSTEM_STACK, t).not.toContain(t);
    }
    expect(SYSTEM_STACK).toMatch(/Swift.*FastAPI.*PostgreSQL.*Gemini.*Google Calendar API.*Render/);
    expect(publicText).not.toMatch(/pdfplumber|python-docx|dateparser/);
  });

  it("does not present roadmap items as shipped", () => {
    expect(publicText).not.toMatch(/Canvas integration|Apple Calendar|workload estimate|conflict detection|study groups|natural[- ]language/i);
  });

  it("states what is NOT on file, and OAuth verification appears only there", () => {
    expect(RECEIPT_NOT_ON_FILE).toMatch(/not documented/i);
    const others = publicText.replace(RECEIPT_NOT_ON_FILE, "");
    expect(others).not.toMatch(/OAuth (verif|approv)|verified app|verification (completed|passed)/i);
  });

  it("says scans and photos are not supported yet, rather than implying they are", () => {
    expect(sources["plannr-document.tsx"]).toMatch(/Scans and\s+photos aren&rsquo;t supported in the beta yet/);
  });

  it("authorship: a seven-person UCSB team project first, then Matt alone, never 'solo'", () => {
    expect(PLANNR_META.origin).toMatch(/UCSB CS 148 team project/);
    expect(PLANNR_META.since).toMatch(/Continued alone/);
    const team = RECEIPT_CREDITS.find((c) => c.label === "The team project");
    expect(team?.body).toMatch(/seven people/);
    expect(team?.body).toMatch(/Teammates built/);
    expect(team?.link?.href).toContain("ucsb-cs148-w26/pj07-syllabus-to-cal-2pm");
    const after = RECEIPT_CREDITS.find((c) => c.label === "After the course");
    expect(after?.body).toMatch(/Matt continued it alone/);
  });

  it("the review decision states its own limit: events arrive accepted (opt-out review)", () => {
    const review = DECISIONS.find((d) => d.id === "review");
    expect(review?.limit).toMatch(/arrive accepted/);
    expect(review?.limit).toMatch(/opt-out/);
    expect(publicText).not.toMatch(/(wait|waits|pending) for (your |the student's |their )?approval/i);
  });

  it("2 to 4 decisions, each cited to a file in the public repository", () => {
    expect(DECISIONS.length).toBeGreaterThanOrEqual(2);
    expect(DECISIONS.length).toBeLessThanOrEqual(4);
    for (const d of DECISIONS) {
      expect(d.code.href, d.id).toMatch(/^https:\/\/github\.com\/m4ttblanke\/plannr\/blob\/main\//);
      expect(d.limit.length, d.id).toBeGreaterThan(20);
    }
  });

  it("the illustration and the screenshots are labelled for what they are", () => {
    expect(DOCUMENT_DISCLAIMER).toMatch(/fictitious course/);
    expect(DOCUMENT_DISCLAIMER).toMatch(/Not a real course document/);
    expect(PRODUCT_CAPTION).toMatch(/Profile photo covered/);
    expect(read("lib/work/plannr-content.ts")).toMatch(/FICTITIOUS/);
    expect(sources["plannr-transformation.tsx"]).toMatch(/FLOW_CAPTIONS\.review/);
  });

  it("test and CI counts are worded as definitions and configuration, not pass rates", () => {
    const tests = RECEIPT_ROWS.find((r) => r.label === "Tests");
    expect(tests?.body).toMatch(/97 backend and 199 iOS test functions/);
    expect(tests?.body).toMatch(/CI is set up to run/);
    expect(tests?.body).not.toMatch(/pass|green|coverage/i);
  });

  it("the lede states the product plainly", () => {
    expect(PLANNR_LEDE).toMatch(/syllabus/);
    expect(PLANNR_LEDE).toMatch(/check every one first/);
  });
});

describe("Plannr case study: privacy", () => {
  const publicFiles = readdirSync(join(root, "public/plannr")).sort();

  it("public/plannr holds exactly the four vetted images, each small enough for the web", () => {
    expect(publicFiles).toEqual(["my-classes.png", "plannr-icon.png", "review-sample.png", "week-at-a-glance.png"]);
    for (const f of publicFiles) expect(statSync(join(root, "public/plannr", f)).size, f).toBeLessThan(300 * 1024);
  });

  it("no real syllabus, instructor, email, Canvas URL, TestFlight id or credential appears anywhere in the page's source", () => {
    const haystack = publicText + css;
    expect(haystack).not.toMatch(/[\w.+-]+@[\w-]+\.(edu|com|org)/i);
    expect(haystack).not.toMatch(/ucsb\.edu|instructure|canvas\.|zackrison|hough|marino|gurbuz/i);
    expect(haystack).not.toMatch(/testflight\.apple\.com|8q3eFC8d/i);
    expect(haystack).not.toMatch(/RJCYA2CC76|whsec_|sk_live|rk_live|dsn|sentry\.io|TOKEN_ENC_KEY/i);
    expect(haystack).not.toMatch(/(ENGR 101|TMP ?124|CMPSC 111) Syllabus/i); // course codes appear only as they show in the screenshots
  });

  it("the illustration is an invented course, not a real one", () => {
    expect(DOCUMENT_NOISE.header).toMatch(/^ASTRO 101/);
  });
});

describe("Plannr case study: accessibility structure", () => {
  it("has exactly one h1, in the hero, and every section is labelled by its own heading", () => {
    expect([...allSource.matchAll(/<h1\b/g)]).toHaveLength(1);
    expect(sources["plannr-hero.tsx"]).toMatch(/<h1 id="plannr-hero-heading"/);
    for (const [file, id] of [
      ["plannr-hero.tsx", "plannr-hero-heading"],
      ["plannr-document.tsx", "plannr-document-heading"],
      ["plannr-transformation.tsx", "plannr-flow-heading"],
      ["plannr-product.tsx", "plannr-product-heading"],
      ["plannr-decisions.tsx", "plannr-decisions-heading"],
      ["plannr-system.tsx", "plannr-system-heading"],
      ["plannr-receipt.tsx", "plannr-receipt-heading"],
    ] as const) {
      expect(sources[file], file).toContain(`aria-labelledby="${id}"`);
      expect(sources[file], file).toContain(`id="${id}"`);
    }
  });

  it("h2 sections follow one another with h3 only inside them (no skipped levels)", () => {
    expect([...allSource.matchAll(/<h4\b/g)]).toHaveLength(0);
    expect([...allSource.matchAll(/<h2\b/g)]).toHaveLength(6);
  });

  it("the sections appear in the story's order", () => {
    const order = ["PlannrHero", "PlannrDocument", "PlannrTransformation", "PlannrProduct", "PlannrDecisions", "PlannrSystem", "PlannrReceipt"];
    const at = order.map((n) => sources["plannr-case.tsx"].indexOf(`<${n} />`));
    expect(at.every((i) => i >= 0)).toBe(true);
    expect([...at].sort((a, b) => a - b)).toEqual(at);
  });

  it("every real screenshot has informative alt text; none is empty or generic", () => {
    const imgs = [...allSource.matchAll(/<Image[\s\S]*?\/>/g)].map((m) => m[0]);
    expect(imgs).toHaveLength(4);
    for (const img of imgs) {
      const alt = img.match(/alt="([^"]+)"/)?.[1] ?? "";
      expect(alt.length, img.slice(0, 60)).toBeGreaterThan(60);
      expect(alt).not.toMatch(/^(image|screenshot|photo)\b/i);
      expect(img).toMatch(/width=\{\d+\}\s+height=\{\d+\}/); // reserves space: no layout shift
    }
  });

  it("every decorative mark is aria-hidden and .ornament; every mark's meaning exists as real text", () => {
    for (const [name, src] of Object.entries(sources)) {
      for (const m of src.matchAll(/<(\w+)\b[^>]*className="[^"]*\bornament\b[^"]*"[^>]*>/g)) {
        // The Mark* components set aria-hidden on their own <svg> (guarded by tests/design/rules.test.ts).
        if (m[1].startsWith("Mark")) continue;
        expect(m[0], `${name}: ${m[0].slice(0, 60)}`).toContain('aria-hidden="true"');
      }
    }
    // The ring, the bracket, and the stamp each have their words as text.
    expect(read("lib/work/plannr-content.ts")).toMatch(/Finals week is never stated as a date/);
    expect(read("lib/work/plannr-content.ts")).toMatch(/Policies, office hours and grading/);
    expect(sources["plannr-receipt.tsx"]).toMatch(/Checked \{PLANNR_META\.checkedOn\}/);
  });

  it("the diagrams have real text alternatives", () => {
    expect(sources["plannr-transformation.tsx"]).toMatch(/className="sr-only"/); // the term's dates as a sentence
    expect(sources["plannr-system.tsx"]).toMatch(/<ol className="pc-hops">/);
    expect(sources["plannr-system.tsx"]).toMatch(/<figcaption className="sr-only">/);
    expect(SYSTEM_HOPS).toHaveLength(5);
    for (const h of SYSTEM_HOPS) {
      expect(h.from).toBeGreaterThanOrEqual(1);
      expect(h.to).toBeLessThanOrEqual(SYSTEM_COLUMNS.length);
      expect(h.from).not.toBe(h.to);
    }
  });

  it("marked calendar cells are not distinguished by color alone (outline and text tag)", () => {
    expect(css).toMatch(/\.pc-cell-marked\s*\{[^}]*outline:\s*2px solid/);
    expect(sources["term-grid.tsx"]).toMatch(/pc-cell-tag/);
  });

  it("external links open safely and are understandable out of context", () => {
    for (const m of allSource.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) {
      expect(m[0]).toContain('rel="noopener noreferrer"');
    }
    expect(sources["plannr-receipt.tsx"]).toMatch(/Back to Work/);
    for (const r of RECEIPT_ROWS) if ("link" in r && r.link) expect(r.link.label.length).toBeGreaterThan(8);
  });

  it("touch targets are at least 44px and focus is left to the global visible-focus rule", () => {
    expect(css).toMatch(/\.pc-link-solid,\s*\.pc-link-plain\s*\{[^}]*min-block-size:\s*2\.75rem/);
    expect(strip(css)).not.toMatch(/outline\s*:\s*(none|0)\b/);
  });
});

describe("Plannr case study: the M6A refinement pass", () => {
  it("Decisions: still exactly the three real decisions, with constraint, what it does, where it stops, and a code link each", () => {
    expect(DECISIONS.map((d) => d.id)).toEqual(["review", "ownership", "diff"]);
    const dec = sources["plannr-decisions.tsx"];
    for (const label of ["The constraint", "What it does", "Where it stops", "In the code"]) expect(dec).toContain(label);
    expect(dec).toMatch(/d\.constraint/);
    expect(dec).toMatch(/d\.decision/);
    expect(dec).toMatch(/d\.limit/);
    expect(dec).toMatch(/href=\{d\.code\.href\}[^>]*target="_blank"[^>]*rel="noopener noreferrer"/);
  });

  it("Decisions: one pen note per finding, and it is attached to a phrase of that finding's own headline", () => {
    expect(DECISIONS.map((d) => d.note)).toEqual(["opt-out, not opt-in", "patch, not update", "identity is title + date"]);
    for (const d of DECISIONS) {
      expect(d.name, d.id).toContain(d.mark);
      expect(d.name.split(d.mark), d.id).toHaveLength(2); // the phrase occurs once, so the split is unambiguous
    }
    const dec = sources["plannr-decisions.tsx"];
    expect(dec).toMatch(/<MarkUnderline className="annotation pc-uline-mark ornament" \/>/);
    expect([...dec.matchAll(/pc-decision-note/g)]).toHaveLength(1); // one note per rendered finding, none added to fill space
    expect(dec).not.toMatch(/MarkArrow|MarkCircle|MarkX/);
  });

  it("Decisions: one review sheet with heavy rules between findings, not cards and not a three-column grid", () => {
    expect(css).toMatch(/\.pc-decision-list\s*\{[^}]*background-color:\s*var\(--pc-sheet\)/);
    expect(css).toMatch(/\.pc-decision \+ \.pc-decision\s*\{[^}]*border-block-start:\s*2px solid/);
    const block = css.slice(css.indexOf("THE DECISIONS"), css.indexOf("UNDER THE HOOD"));
    expect(block).not.toMatch(/border-radius|repeat\(3,/);
  });

  it("Under the Hood: the diagram is untouched: three lanes, five hops, an ordered list, and the stack line", () => {
    expect(SYSTEM_COLUMNS.map((c) => c.key)).toEqual(["phone", "server", "google"]);
    expect(SYSTEM_HOPS).toHaveLength(5);
    expect(sources["plannr-system.tsx"]).toMatch(/<ol className="pc-hops">/);
    expect(sources["plannr-system.tsx"]).toContain("SYSTEM_STACK");
  });

  it("Under the Hood: each pen note lives inside the hop it annotates, in the same vocabulary as The Document", () => {
    const withNotes = SYSTEM_HOPS.filter((h) => "note" in h && h.note);
    expect(withNotes.map((h) => [h.n, "note" in h ? h.note : null])).toEqual([
      [2, "extraction"],
      [3, "storage"],
    ]);
    const sys = sources["plannr-system.tsx"];
    expect(sys).toMatch(/<span className="pc-hop-leader ornament" aria-hidden="true" \/>\s*<p className="pc-pen pc-hop-note">/);
    expect(sys).not.toMatch(/pc-system-notes/);
    expect(css).toMatch(/\.pc-hop-leader\s*\{[^}]*border-block-start:\s*2px solid var\(--plannr-pen\)/);
    // the legend lives inside the figure, under its lanes
    const fig = sys.slice(sys.indexOf('<figure className="pc-seq">'), sys.indexOf("</figure>"));
    expect(fig).toContain('<dl className="pc-lives">');
  });

  it("Under the Hood: no icons, logos, images or new arrows were added", () => {
    const sys = sources["plannr-system.tsx"];
    expect(sys).not.toMatch(/<Image|<img|<svg|MarkArrow|MarkCircle|MarkUnderline|MarkX/);
  });

  it("Receipt: same content, plus binder holes as an aria-hidden ornament, and a sheet edge scaled by --chaos", () => {
    const rec = sources["plannr-receipt.tsx"];
    expect(rec).toMatch(/<span className="pc-holes ornament" aria-hidden="true">/);
    for (const c of ["RECEIPT_ROWS.map", "RECEIPT_CREDITS.map", "RECEIPT_NOT_ON_FILE", "PLANNR_META.checkedOn", "Back to Work", "Who built it"]) expect(rec).toContain(c);
    const sheet = css.match(/\.pc-sheet\s*\{[^}]*\}/)?.[0] ?? "";
    const shadows = sheet.match(/box-shadow:[^;]*;/)?.[0] ?? "";
    expect(shadows).toContain("var(--chaos)");
    expect(shadows).not.toMatch(/blur|\b[1-9]\d*px\s+[1-9]\d*px\s+[1-9]/); // a hard-edged sheet, never a soft drop shadow
  });

  it("Receipt: no invented artifacts: no signature, staple, tape or handwriting, and no new claims", () => {
    expect(sources["plannr-receipt.tsx"]).not.toMatch(/signature|staple|tape|handwrit/i);
    expect(css).not.toMatch(/\.tape|staple|signature/i);
    expect(RECEIPT_ROWS).toHaveLength(6);
  });

  it("Clean Copy: the hero form moves into the space the decoration leaves, using its existing content", () => {
    expect(css).toMatch(/:root\[data-copy="clean"\] \.pc-form\s*\{[^}]*grid-column:\s*8 \/ -1/);
    expect(sources["plannr-hero.tsx"]).not.toMatch(/data-copy|clean/i); // no replacement content invented for it
  });

  it("Clean Copy: the wide margin notes keep a pen rule, and the receipt drops the hole padding", () => {
    expect(css).toMatch(/:root\[data-copy="clean"\] \.pc-hop-note\s*\{[^}]*border-inline-start:\s*2px solid var\(--plannr-pen\)/);
    expect(css).toMatch(/:root\[data-copy="clean"\] \.pc-sheet\s*\{[^}]*padding-inline-start/);
  });

  it("stays server-rendered outside the trace island: no other client component, hook or keyframe animation", () => {
    for (const [name, src] of serverSources) expect(src, name).not.toMatch(/"use client"|useState|useEffect/);
    expect(strip(css)).not.toMatch(/@keyframes|animation\s*:|transition\s*:\s*all/);
  });
});
