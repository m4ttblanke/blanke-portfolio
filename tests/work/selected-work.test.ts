// @vitest-environment node
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { FLAGSHIPS, PLANNR, RANKLE } from "../../lib/work/projects";

const root = join(__dirname, "../..");
const read = (p: string) => readFileSync(join(root, p), "utf8");
const strip = (src: string) => src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1");

const selectedWork = strip(read("components/work/selected-work.tsx"));
const rankle = strip(read("components/work/rankle-poster.tsx"));
const plannr = strip(read("components/work/plannr-poster.tsx"));
const home = read("app/(public)/page.tsx");

describe("Selected Work — content truth", () => {
  it("ships exactly the two verified flagships, nothing invented", () => {
    expect(FLAGSHIPS.map((p) => p.id)).toEqual(["rankle", "plannr"]);
  });

  it("does not claim unverified facts (metrics, launch status, dates)", () => {
    const text = JSON.stringify(FLAGSHIPS);
    expect(text).not.toMatch(/\d{4}|users?|downloads?|stars?|%|launch(ed)?/i);
  });

  it("Plannr's platform claim matches the one verified in docs/PRD.md", () => {
    expect(RANKLE.meta).not.toMatch(/ios|swift|web|android/i);
    expect(PLANNR.meta).toMatch(/ios/i);
    expect(read("docs/PRD.md")).toMatch(/SwiftUI \+ FastAPI iOS app/);
  });

  it("Rankle's descriptor is plainly explanatory, not interpretive (M4A adjustment pass)", () => {
    expect(RANKLE.descriptor).toBe("A daily ranking game.");
    expect(RANKLE.accessibleName).toMatch(/daily ranking game/i);
  });

  it("keeps Plannr's copy unchanged", () => {
    expect(PLANNR.descriptor).toBe("Turns a syllabus into a calendar.");
    expect(PLANNR.meta).toBe("iOS · SwiftUI");
  });

  it("every flagship links somewhere real: no route is fabricated", () => {
    // Rankle has no dedicated route yet (M5); /projects is real and functional.
    expect(RANKLE.href).toBe("/projects");
    // Plannr links straight to the real, live product (next.config.ts rewrite).
    expect(PLANNR.href).toBe("/plannr/");
    expect(read("next.config.ts")).toMatch(/plannr/);
  });
});

describe("Selected Work — the homepage", () => {
  it("renders after the cover, on the homepage only", () => {
    expect(home).toMatch(/<Cover \/>/);
    expect(home).toMatch(/<SelectedWork \/>/);
  });

  it("does not modify the cover's own files", () => {
    // Nothing here asserts file mtimes (not available to a content diff), but
    // the cover's own test suite (tests/cover/cover.test.ts) still passes
    // unmodified, and no file in components/cover was touched by this change
    // (verified by review, not scriptable from content alone).
    expect(read("components/cover/cover.tsx")).toContain("cover-name-blanke");
  });
});

describe("Selected Work — M4A adjustment pass", () => {
  it("no 'More in the index' CTA on the wall (removed; WORK nav still reaches /projects)", () => {
    expect(selectedWork).not.toMatch(/more in the index/i);
    expect(read("lib/shell/nav.ts")).toMatch(/href: "\/projects"/);
  });

  it("the work-index component was removed, not just unused", () => {
    expect(() => read("components/work/work-index.tsx")).toThrow();
  });

  it("DOM order stays header -> Rankle -> Plannr; only grid placement (not the `order` property) moves the header visually", () => {
    const headerIdx = selectedWork.indexOf("<header");
    const rankleIdx = selectedWork.indexOf("<RankleWorkPoster");
    const plannrIdx = selectedWork.indexOf("<PlannrWorkPoster");
    expect(headerIdx).toBeLessThan(rankleIdx);
    expect(rankleIdx).toBeLessThan(plannrIdx);
    const css = read("components/work/selected-work.css");
    expect(css).not.toMatch(/(?<!--)\border\s*:\s*\d/); // no flex/grid `order` property
  });

  it("Plannr sits in the same grid row the header vacates at >=48rem (no silent double row-gap)", () => {
    const css = read("components/work/selected-work.css");
    const tabletBlock = css.slice(css.indexOf("48rem"), css.indexOf("64rem"));
    expect(tabletBlock).toMatch(/\.wall-plannr\s*\{[^}]*grid-row:\s*2/);
  });
});

describe("Selected Work — semantics and accessibility", () => {
  it("has a real, meaningful section heading", () => {
    expect(selectedWork).toMatch(/aria-labelledby="selected-work-heading"/);
    expect(selectedWork).toMatch(/id="selected-work-heading"/);
    expect(selectedWork).toContain("Selected Work");
  });

  it("each flagship poster is a real link with a meaningful accessible name", () => {
    for (const [src, name] of [
      [rankle, "Rankle"],
      [plannr, "Plannr"],
    ] as const) {
      expect(src, name).toMatch(/aria-label=\{[A-Z]+\.accessibleName\}/);
      expect(src, name).toMatch(/href=\{[A-Z]+\.href\}/);
    }
  });

  it("decorative poster layers (tier bands, calendar grid) are aria-hidden and non-semantic", () => {
    for (const [src, cls] of [
      [rankle, "rk-bands"],
      [plannr, "pl-grid"],
    ] as const) {
      expect(src).toMatch(new RegExp(`className="${cls} ornament"[^>]*aria-hidden="true"`));
    }
  });

  it("no deterministic-chaos seed utility places a flagship: hand-art-directed only", () => {
    for (const src of [selectedWork, rankle, plannr]) {
      expect(src).not.toMatch(/Math\.random|hashString|lib\/design\/seed|blockTilt|stickerTilt/);
    }
  });

  it("no client component was introduced: the wall is static", () => {
    for (const src of [selectedWork, rankle, plannr]) {
      expect(src).not.toMatch(/"use client"/);
    }
  });
});

describe("Selected Work — project color containment", () => {
  const css = read("app/globals.css");
  const cssCode = strip(css); // comments may legitimately mention "Rankle"/"Plannr" by name

  it("Rankle and Plannr's palettes are scoped to their own poster classes, not :root or @theme", () => {
    expect(css).toMatch(/\.wall-rankle\s*\{[^}]*--rankle-red/);
    expect(css).toMatch(/\.wall-plannr\s*\{[^}]*--plannr-navy/);
    const themeBlock = cssCode.slice(cssCode.indexOf("@theme"), cssCode.indexOf("@theme inline"));
    expect(themeBlock).not.toMatch(/rankle|plannr/i);
  });

  it("no project color leaks into the global --color- token names", () => {
    for (const m of css.matchAll(/--color-([a-z-]+):/g)) {
      expect(m[1]).not.toMatch(/rankle|plannr|yellow|blue|navy|gold/);
    }
  });

  it("Rankle's palette does not appear inside Plannr's poster CSS, or vice-versa", () => {
    const workCss = read("components/work/selected-work.css");
    const rankleBlock = workCss.slice(workCss.indexOf(".wall-rankle"), workCss.indexOf("/* ---------------------------------------------------------------- Plannr"));
    const plannrBlock = workCss.slice(workCss.indexOf(".wall-plannr"));
    expect(rankleBlock).not.toMatch(/--plannr-/);
    expect(plannrBlock).not.toMatch(/--rankle-/);
  });
});

describe("Selected Work — the M3 -> M4 transition", () => {
  const css = read("components/work/selected-work.css");

  it("only Rankle's poster owns the intrusion; the section itself carries no negative margin", () => {
    expect(css).toMatch(/\.wall-rankle\s*\{[^}]*margin-block-start:\s*var\(--sw-intrusion\)/);
    expect(css.slice(0, css.indexOf(".wall-rankle"))).not.toMatch(/margin-block-start:\s*-/);
  });

  it("M3's own files are untouched by this milestone", () => {
    const cover = read("components/cover/cover.tsx");
    const coverCss = read("components/cover/cover.css");
    expect(cover).not.toMatch(/selected-work|work-poster|rankle|plannr/i);
    expect(coverCss).not.toMatch(/selected-work|work-poster|rankle|plannr/i);
  });
});

describe("route regression", () => {
  it("/projects still activates the WORK section and stays functional", () => {
    const projects = read("app/(public)/projects/page.tsx");
    expect(projects).toMatch(/section="work"/);
  });

  it("the homepage nav still has no active section (unaffected by this change)", () => {
    // lib/shell/nav.ts matches only /projects, /about, /experience|/coursework,
    // /contact -- "/" matches none of them, so PrimaryNav marks nothing active.
    const nav = read("lib/shell/nav.ts");
    expect(nav).not.toMatch(/"\/"/);
  });
});

describe("Selected Work — M4B interaction", () => {
  const css = read("components/work/selected-work.css");

  it("is CSS-only: no client component was introduced for hover/focus behavior", () => {
    for (const src of [selectedWork, rankle, plannr]) {
      expect(src).not.toMatch(/"use client"/);
      expect(src).not.toMatch(/onClick|onMouseEnter|onMouseLeave|onTouchStart|addEventListener/);
    }
  });

  it("no new dependency was added for interaction (no animation/drag/cursor library)", () => {
    const pkg = JSON.parse(read("package.json"));
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };
    expect(deps).not.toHaveProperty("framer-motion");
    expect(deps).not.toHaveProperty("gsap");
    expect(deps).not.toHaveProperty("motion");
    expect(deps).not.toHaveProperty("react-spring");
  });

  it("hover motion is gated behind (hover: hover) and (pointer: fine); focus-visible is not pointer-gated", () => {
    const hoverBlock = css.slice(css.indexOf("(hover: hover) and (pointer: fine) {\n  .wall-rankle:hover"));
    expect(hoverBlock).toMatch(/\.wall-rankle:hover\s*\{/);
    expect(hoverBlock).toMatch(/\.wall-plannr:hover\s*\{/);
    // :focus-visible rules exist outside any (hover: hover) block, so keyboard
    // users on any device (including touch/no-hover) still get the state.
    const focusRule = css.match(/@media \(prefers-reduced-motion: no-preference\) \{\s*\.wall-rankle:focus-visible/);
    expect(focusRule).toBeTruthy();
  });

  it("all meaningful hover/focus motion is gated behind prefers-reduced-motion: no-preference", () => {
    // The whole "interaction" section (everything between its own header
    // comment and the next section, "tablet, 48rem+") must contain nothing
    // at the top level except two no-preference-gated @media blocks: walk
    // the text by brace depth and collect every top-level (depth-0) chunk of
    // non-whitespace, non-comment text. If any .wall-*:hover/:focus-visible
    // rule sat outside a gate, it would show up here as a top-level chunk
    // starting with a selector instead of `@media`.
    const interactionSection = css.slice(
      css.indexOf("@media (prefers-reduced-motion: no-preference) {\n  .wall-rankle:focus-visible"),
      css.indexOf("-------------------------------------------------------------- tablet, 48rem+")
    );
    const noComments = interactionSection.replace(/\/\*[\s\S]*?\*\//g, "");

    let depth = 0;
    let chunk = "";
    const topLevelChunks: string[] = [];
    for (const ch of noComments) {
      if (ch === "{") {
        if (depth === 0 && chunk.trim()) topLevelChunks.push(chunk.trim());
        chunk = "";
        depth++;
      } else if (ch === "}") {
        depth--;
      } else if (depth === 0) {
        chunk += ch;
      }
    }
    expect(depth).toBe(0); // braces balance

    expect(topLevelChunks.length).toBe(2);
    for (const c of topLevelChunks) {
      expect(c).toMatch(/^@media/);
      expect(c).toContain("prefers-reduced-motion: no-preference");
    }
  });

  it("Plannr never rotates: no `rotate:` in any .wall-plannr rule, including hover/focus", () => {
    const plannrRules = [...css.matchAll(/\.wall-plannr(?::\S+)?\s*\{[^}]*\}/g)].map((m) => m[0]);
    expect(plannrRules.length).toBeGreaterThan(0);
    for (const rule of plannrRules) expect(rule).not.toMatch(/\brotate\s*:/);
  });

  it("hover/focus keep each poster's own text color pinned (no generic red link-hover leak)", () => {
    expect(css).toMatch(/\.wall-rankle:hover[^{]*\{[^}]*color:\s*var\(--color-paper\)/);
    expect(css).toMatch(/\.wall-plannr:hover[^{]*\{[^}]*color:\s*var\(--plannr-navy\)/);
  });

  it("decorative interaction elements (the alt calendar cell) stay inside .pl-grid's aria-hidden ornament", () => {
    expect(plannr).toMatch(/pl-cell pl-cell-marked-alt/);
    const gridSpan = plannr.slice(plannr.indexOf('className="pl-grid'), plannr.indexOf("</span>", plannr.indexOf("pl-cell-marked-alt")));
    expect(gridSpan).toContain('aria-hidden="true"');
  });

  it("Rankle/Plannr accessible names are unchanged from the approved M4A composition", () => {
    expect(RANKLE.accessibleName).toBe("Rankle — a daily ranking game");
    expect(PLANNR.accessibleName).toBe("Plannr — turns a syllabus into a calendar, iOS, SwiftUI");
  });
});
