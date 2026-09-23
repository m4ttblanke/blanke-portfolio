// @vitest-environment node
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { RANKLE } from "../../lib/work/projects";
import {
  RANKLE_ARCHITECTURE,
  RANKLE_ARGUMENT,
  RANKLE_DECISIONS,
  RANKLE_FLOW,
  RANKLE_META,
  RANKLE_RECEIPT_STATS,
} from "../../lib/work/rankle-content";

const root = join(__dirname, "../..");
const read = (p: string) => readFileSync(join(root, p), "utf8");
const strip = (src: string) => src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1");

const rankleDir = "components/rankle";
const files = ["rankle-case.tsx", "rankle-hero.tsx", "rankle-thing.tsx", "rankle-argument.tsx", "rankle-system.tsx", "rankle-receipt.tsx"];
const sources = Object.fromEntries(files.map((f) => [f, strip(read(`${rankleDir}/${f}`))]));
const allSource = Object.values(sources).join("\n");

describe("Rankle case study — route", () => {
  it("exists as a literal segment beside the Convex-backed [slug] route", () => {
    expect(existsSync(join(root, "app/(public)/projects/rankle/page.tsx"))).toBe(true);
    expect(existsSync(join(root, "app/(public)/projects/[slug]/page.tsx"))).toBe(true);
  });

  it("has accurate, non-promotional metadata", () => {
    const page = read("app/(public)/projects/rankle/page.tsx");
    expect(page).toMatch(/alternates:\s*\{\s*canonical:\s*"\/projects\/rankle"/);
    expect(page).toMatch(/title:\s*"Rankle/);
    expect(page).not.toMatch(/best|revolutionary|#1|award/i);
  });

  it("is listed in the sitemap", () => {
    expect(read("app/sitemap.ts")).toContain("/projects/rankle");
  });

  it("the five editorial sections stay server-rendered (M5B's one client island lives elsewhere)", () => {
    for (const [name, src] of Object.entries(sources)) {
      expect(src, name).not.toMatch(/"use client"/);
    }
  });

  it("added no new dependency (no drag/animation/cursor library, no new devDependency either)", () => {
    const pkg = JSON.parse(read("package.json"));
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };
    for (const banned of [
      "framer-motion",
      "gsap",
      "motion",
      "react-spring",
      "@dnd-kit/core",
      "@dnd-kit/sortable",
      "react-dnd",
      "jsdom",
      "@testing-library/react",
    ]) {
      expect(deps, banned).not.toHaveProperty(banned);
    }
  });
});

describe("Rankle case study — M4 poster (the only sanctioned M4 change)", () => {
  it("the poster now points at the real case study, not /projects", () => {
    expect(RANKLE.href).toBe("/projects/rankle");
  });

  it("the M4 poster's own component is visually and behaviorally untouched", () => {
    const poster = read("components/work/rankle-poster.tsx");
    const posterCss = read("components/work/selected-work.css");
    // No literal href was hardcoded in the poster -- it reads RANKLE.href, so
    // updating the destination required editing lib/work/projects.ts only.
    expect(poster).toMatch(/href=\{RANKLE\.href\}/);
    expect(poster).toContain("tilt-ccw-1");
    expect(poster).toContain("rk-band-1");
    expect(posterCss).toMatch(/\.wall-rankle\s*\{[^}]*--sw-intrusion/);
  });
});

describe("Rankle case study — content truth", () => {
  it("the flow is the five verified steps, in order", () => {
    expect(RANKLE_FLOW.map((s) => s.step)).toEqual(["Rank", "Submit", "Compare", "Share", "Return tomorrow"]);
  });

  it("exposes only verified, publicly-appropriate destinations", () => {
    expect(RANKLE_META.liveHref).toBe("https://rankle.io");
    expect(RANKLE_META.repoHref).toBe("https://github.com/m4ttblanke/rankle");
  });

  it("architecture is exactly three layers: browser, Next.js, Supabase", () => {
    expect(RANKLE_ARCHITECTURE.map((l) => l.layer)).toEqual(["Browser", "Next.js", "Supabase"]);
  });

  it("every engineering decision cites its own source", () => {
    expect(RANKLE_DECISIONS.length).toBeGreaterThanOrEqual(2);
    expect(RANKLE_DECISIONS.length).toBeLessThanOrEqual(4);
    for (const d of RANKLE_DECISIONS) {
      expect(d.source, d.constraint).toMatch(/docs\/(SECURITY|DESIGN|MANUAL)\.md/);
    }
  });

  it("the receipt stats are plain countable facts, not claimed usage/traction", () => {
    const text = JSON.stringify(RANKLE_RECEIPT_STATS);
    expect(text).not.toMatch(/user|player|download|install|revenue|\$/i);
  });

  it("does not fabricate metrics, users, testimonials or launch dates anywhere in the copy", () => {
    const contentText = [
      RANKLE_META,
      RANKLE_ARGUMENT,
      RANKLE_FLOW,
      RANKLE_DECISIONS,
      RANKLE_ARCHITECTURE,
      RANKLE_RECEIPT_STATS,
    ]
      .map((x) => JSON.stringify(x))
      .join(" ");
    expect(contentText).not.toMatch(/\b\d[\d,]*\+?\s*(users?|players?|downloads?|installs?)\b/i);
    expect(contentText).not.toMatch(/testimonial|"[^"]{0,3}said\b/i);
  });

  it("avoids the banned promotional vocabulary (brief §28)", () => {
    const banned =
      /revolutioniz|seamless|cutting-edge|engaging platform|innovative solution|gamifies|leverag|\bpassionate about\b|showcases\b|robust solution|user-centric\b/i;
    expect(allSource).not.toMatch(banned);
    const contentText = JSON.stringify({ RANKLE_META, RANKLE_ARGUMENT, RANKLE_FLOW, RANKLE_DECISIONS });
    expect(contentText).not.toMatch(banned);
  });
});

describe("Rankle case study — M5A adjustment pass", () => {
  it("The Thing: RANK leads, the remaining four form the chain -- same five verified steps, no step invented or dropped", () => {
    const thing = sources["rankle-thing.tsx"];
    expect(thing).toMatch(/const \[rank, \.\.\.chain\] = RANKLE_FLOW;/);
  });

  it("The Argument: YOU and EVERYONE ELSE are the same five tier letters in a different order -- a reorder, not new data", () => {
    const arg = sources["rankle-argument.tsx"];
    const you = arg.match(/\["S", "A", "B", "C", "F"\] as const/);
    const others = arg.match(/\["B", "F", "S", "C", "A"\] as const/);
    expect(you, "you order").toBeTruthy();
    expect(others, "everyone-else order").toBeTruthy();
    expect([...(you as RegExpMatchArray)[0].matchAll(/[A-Z]/g)].map((m) => m[0]).sort()).toEqual(
      [...(others as RegExpMatchArray)[0].matchAll(/[A-Z]/g)].map((m) => m[0]).sort()
    );
  });

  it("The Receipt is a ledger (index/count/label rows), not a stat-card grid", () => {
    const receipt = sources["rankle-receipt.tsx"];
    expect(receipt).toContain('className="rk-ledger"');
    expect(receipt).not.toMatch(/rk-stats-row|rk-stat\b/);
    expect(read("components/rankle/rankle.css")).not.toMatch(/rk-stats-row/);
  });

  it("the receipt still renders the exact five verified counts, unchanged by the restyle", () => {
    expect(RANKLE_RECEIPT_STATS.map((s) => s.n)).toEqual(["15", "36", "12", "5", "10"]);
  });

  it("no icon-drawing rotate crept into rankle.css outside the named .tilt-* system (the Thing arrow uses a border-triangle, not rotate)", () => {
    const css = strip(read("components/rankle/rankle.css"));
    expect(css).not.toMatch(/\brotate\s*:/);
    expect(css).toMatch(/\.rk-thing-arrow\s*\{[^}]*border-block-start:\s*7px solid/);
  });
});

describe("Rankle case study — accessibility", () => {
  it("has exactly one h1 (the wordmark) and one h2 per spread", () => {
    const h1s = allSource.match(/<h1\b/g) ?? [];
    const h2s = allSource.match(/<h2\b/g) ?? [];
    expect(h1s.length).toBe(1);
    expect(h2s.length).toBe(4); // Thing, Argument, System, Receipt
  });

  it("decorative graphics are aria-hidden and non-semantic (.ornament)", () => {
    for (const cls of ["rk-hero-stack", "rk-argument-compare"]) {
      expect(allSource, cls).toMatch(new RegExp(`className="${cls} ornament"[^>]*aria-hidden="true"`));
    }
  });

  it("The Thing gives RANK a real heading; SUBMIT/COMPARE/SHARE/RETURN stay plain text (the visual asymmetry is real, not decorative-only)", () => {
    const thing = sources["rankle-thing.tsx"];
    expect(thing).toMatch(/<h3 className="rk-thing-rank-word">\{rank\.step\}<\/h3>/);
    expect((thing.match(/<h3\b/g) ?? []).length).toBe(1);
  });

  it("the one real image has honest, non-invented alt text and explicit dimensions", () => {
    expect(sources["rankle-hero.tsx"]).toMatch(/alt="Rankle's app icon: three stacked, tilted ranking cards"/);
    expect(sources["rankle-hero.tsx"]).toMatch(/width=\{40\}/);
    expect(sources["rankle-hero.tsx"]).toMatch(/height=\{40\}/);
  });

  it("every section has a real accessible name via aria-labelledby", () => {
    for (const [name, src] of Object.entries(sources)) {
      if (name === "rankle-case.tsx") continue;
      expect(src, name).toMatch(/aria-labelledby="rankle-[a-z]+-heading"/);
    }
  });
});

describe("Rankle case study — no fake product evidence", () => {
  it("never presents a CSS mock as a screenshot (no 'screenshot' language, no fake browser chrome)", () => {
    expect(allSource).not.toMatch(/screenshot/i);
    expect(allSource).not.toMatch(/browser-chrome|fake-window|mock-browser/i);
  });

  it("uses no image other than the one real, verified brand asset", () => {
    const imgSrcs = [...allSource.matchAll(/src="([^"]+)"/g)].map((m) => m[1]);
    for (const src of imgSrcs) expect(src).toBe("/rankle/rankle-mark.svg");
  });
});

describe("Rankle case study — color containment", () => {
  const css = read("app/globals.css");
  const cssCode = strip(css);

  it(".rankle-case reuses the exact M4 palette, scoped, not global", () => {
    expect(css).toMatch(/\.rankle-case\s*\{[^}]*--rankle-red:\s*#e5332a/);
    const themeBlock = cssCode.slice(cssCode.indexOf("@theme"), cssCode.indexOf("@theme inline"));
    expect(themeBlock).not.toMatch(/rankle/i);
  });

  it("no raw hex color appears in any Rankle component file (globals.css is the one allowed file)", () => {
    for (const [name, src] of Object.entries(sources)) {
      expect(src, name).not.toMatch(/#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/);
    }
    expect(read("components/rankle/rankle.css")).not.toMatch(/#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/);
  });

  it("Rankle's rotation uses the site's own named .tilt-* utilities, never a raw rotate value", () => {
    const css2 = strip(read("components/rankle/rankle.css"));
    expect(css2).not.toMatch(/\brotate\s*:/);
  });
});

describe("Rankle case study — M5B signature interaction", () => {
  const interaction = strip(read("components/rankle/rankle-rank-interaction.tsx"));
  const glyphs = strip(read("components/rankle/rank-glyphs.tsx"));
  const rankDemo = strip(read("lib/work/rank-demo.ts"));
  const thing = sources["rankle-thing.tsx"];

  it("is the ONLY client component on the page -- everything else stays server-rendered", () => {
    expect(interaction).toMatch(/^"use client";/);
    for (const [name, src] of [
      ["rank-glyphs.tsx", glyphs],
      ["rankle-thing.tsx", thing],
      ["rankle-case.tsx", sources["rankle-case.tsx"]],
      ["rankle-hero.tsx", sources["rankle-hero.tsx"]],
      ["rankle-argument.tsx", sources["rankle-argument.tsx"]],
      ["rankle-system.tsx", sources["rankle-system.tsx"]],
      ["rankle-receipt.tsx", sources["rankle-receipt.tsx"]],
    ] as const) {
      expect(src, name).not.toMatch(/"use client"/);
    }
  });

  it("the state logic is a plain, framework-free module (no React import, no new test dependency needed)", () => {
    expect(rankDemo).not.toMatch(/from ["']react["']/);
    expect(rankDemo).not.toMatch(/useState|useEffect|useReducer/);
  });

  it("wires the interaction into the RANK block, replacing the old blank card-fan ornament", () => {
    expect(thing).toContain("<RankleRankInteraction />");
    expect(thing).not.toMatch(/rk-thing-cards|rk-thing-card\b/);
    expect(read("components/rankle/rankle.css")).not.toMatch(/\.rk-thing-cards|\.rk-thing-card\b/);
  });

  it("makes no network, database, or auth call of any kind -- purely local state", () => {
    for (const [name, src] of [
      ["rankle-rank-interaction.tsx", interaction],
      ["rank-demo.ts", rankDemo],
    ] as const) {
      expect(src, name).not.toMatch(/fetch\(|supabase|convex|XMLHttpRequest|axios|WebSocket|EventSource/i);
      expect(src, name).not.toMatch(/localStorage|sessionStorage|indexedDB|document\.cookie/i);
    }
  });

  it("never implies a real Rankle submission occurred", () => {
    expect(interaction).not.toMatch(/submit(ted)?|rankle\.io|your ranking has been|saved|synced/i);
    expect(interaction).toMatch(/RANKED\./);
  });

  it("uses exactly four abstract shapes -- no invented items, movies, foods, or people", () => {
    expect(rankDemo).toMatch(/"circle"[\s\S]*"square"[\s\S]*"triangle"[\s\S]*"diamond"/);
  });

  it("the mechanism is real <button> elements (Tab + Enter/Space work natively), not synthesized click targets", () => {
    expect(interaction).toMatch(/<button\s+type="button"/);
    expect(interaction).not.toMatch(/<div[^>]*onClick/);
    expect(interaction).not.toMatch(/draggable=\{?true\}?|onDragStart|onDrop/);
  });

  it("shape buttons and tier destinations both carry aria-pressed and a real, concrete accessible name", () => {
    // A shape's own button: pressed = currently selected/picked up.
    expect(interaction).toMatch(/aria-pressed=\{selected\}/);
    expect(interaction).toMatch(/`\$\{item\.label\}, ranked \$\{item\.tier\}\. Press to pick up\.`/);
    // A tier destination: pressed = the selected shape is already here;
    // its accessible name says exactly what activating it will do.
    expect(interaction).toMatch(/aria-pressed=\{selected \? selected\.tier === tier : undefined\}/);
    expect(interaction).toMatch(/`Move \$\{selected\.label\} to \$\{tier\} tier`/);
  });

  it("tier destinations are disabled -- not hidden -- until a shape is selected (brief's own preferred architecture: exposed, not removed, from a keyboard user's reach)", () => {
    expect(interaction).toMatch(/disabled=\{!selected\}/);
    // A disabled button is real markup, still in the accessibility tree and
    // still discoverable by a screen reader moving through the page --
    // merely not focusable/activatable until enabled. Never `display:none`
    // or conditionally unrendered.
    expect(interaction).not.toMatch(/\{selected &&[\s\S]{0,20}<button[^>]*rk-rank-tier-target/);
  });

  it("the live region is a single concise status, not a growing log", () => {
    expect(interaction).toMatch(/role="status"\s+aria-live="polite"/);
    // exactly one status paragraph, not per-item live regions
    expect((interaction.match(/aria-live="polite"/g) ?? []).length).toBe(1);
  });

  it("decorative glyphs are aria-hidden; the shape's real name is separate visible text", () => {
    expect(interaction).toMatch(/className="rk-rank-glyph" aria-hidden="true"/);
    expect(interaction).toMatch(/rk-rank-shape-name.*\{item\.label\}/);
  });

  it("selecting a shape is a real, testable toggle (select / re-select-to-deselect), not just a click handler with no state contract", () => {
    expect(rankDemo).toMatch(/export function announceSelect/);
    expect(rankDemo).toMatch(/export function announceDeselect/);
    expect(interaction).toMatch(/if \(selectedId === id\)/);
  });

  it("no 'TRY IT — NOT THE REAL GAME' debug-style disclaimer copy remains (brief: demote to something editorial, or nothing)", () => {
    expect(interaction).not.toMatch(/TRY IT/i);
    expect(interaction).not.toMatch(/NOT THE REAL GAME/i);
  });

  it("only one tier field exists -- five tier letters total, not five per shape", () => {
    // RANK_DEMO_TIERS is mapped exactly once (the shared tier list), never
    // once per rankable item as the earlier per-item-picker version did.
    const mapCalls = (interaction.match(/RANK_DEMO_TIERS\.map/g) ?? []).length;
    expect(mapCalls).toBe(1);
  });

  it("motion, if any, rides the site's own reduced-motion-safe tokens -- no separate reduced-motion path, no hardcoded ms", () => {
    const css = strip(read("components/rankle/rankle.css"));
    const rankBlock = css.slice(css.indexOf(".rk-rank-demo"), css.indexOf(".rk-thing-chain"));
    expect(rankBlock).not.toMatch(/\d+m?s\s+(ease|linear|cubic-bezier)/); // no raw duration values
    expect(rankBlock).toMatch(/var\(--dur-quick\)/);
    expect(rankBlock).not.toMatch(/@keyframes/);
    expect(rankBlock).not.toMatch(/\brotate\s*:/);
  });

  it("the tier destination -- the one precision-sensitive touch target -- meets the 44px minimum (ART_DIRECTION.md §11)", () => {
    const css = read("components/rankle/rankle.css");
    expect(css).toMatch(/\.rk-rank-tier-target\s*\{[^}]*min-block-size:\s*2\.75rem/);
  });

  it("restores keyboard focus after an item's DOM node relocates between tiers (regression: live Playwright testing found focus was silently lost on every move before this fix)", () => {
    // Every shape button has a stable, predictable id so it can be re-found
    // after React relocates its <li> into a different parent list.
    expect(interaction).toMatch(/id=\{`rank-shape-\$\{item\.id\}`\}/);
    // A pending-focus ref is set before the state update and consumed by an
    // effect keyed on `items`, after the DOM has actually moved.
    expect(interaction).toMatch(/const pendingFocusId = useRef/);
    expect(interaction).toMatch(/useEffect\(\(\) => \{[\s\S]*pendingFocusId\.current[\s\S]*\}, \[items\]\)/);
    // Reset removes its own trigger button (it only renders while
    // `started`), so focus moves to the stable, never-unmounting container.
    expect(interaction).toMatch(/tabIndex=\{-1\}/);
    expect(interaction).toMatch(/containerRef\.current\?\.focus\(\)/);
  });

  it("focus also follows a fresh selection to the first tier destination (select, then choose a tier, reads as one continuous keyboard motion)", () => {
    expect(interaction).toMatch(/const firstTierTargetRef = useRef/);
    expect(interaction).toMatch(/useEffect\(\(\) => \{\s*if \(selectedId\) firstTierTargetRef\.current\?\.focus\(\);\s*\}, \[selectedId\]\)/);
  });

  it("the rank demo's tier bands use rk-rt-*, never bare rk-tier-* (regression: live testing found the Argument section's .rk-tier-c sets color:paper, which cascaded into a real interactive control here and made its label functionally invisible -- paper-on-white)", () => {
    expect(interaction).toMatch(/`rk-rank-tier rk-rt-\$\{tier\.toLowerCase\(\)\}`/);
    expect(interaction).not.toMatch(/rk-tier-\$\{tier/);
    const css = strip(read("components/rankle/rankle.css"));
    expect(css).toMatch(/\.rk-rank-tier\.rk-rt-s/);
    expect(css).not.toMatch(/\.rk-rank-tier\.rk-tier-/);
  });

  it("no icon library or drag library was added; only platform APIs and React state", () => {
    const pkg = JSON.parse(read("package.json"));
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };
    expect(Object.keys(deps).sort()).toEqual(
      [
        "@edge-runtime/vm",
        "@tailwindcss/postcss",
        "@types/node",
        "@types/react",
        "@types/react-dom",
        "@workos-inc/authkit-nextjs",
        "convex",
        "convex-test",
        "eslint",
        "eslint-config-next",
        "next",
        "react",
        "react-dom",
        "tailwindcss",
        "typescript",
        "vitest",
      ].sort()
    );
  });
});

describe("Rankle case study — M5 hardening pass", () => {
  it("the Argument section's side labels are full-opacity white on blue (regression: an axe scan found a reduced opacity there failed WCAG AA color-contrast; every other white-on-blue text in this section is full-opacity and already passes)", () => {
    const css = strip(read("components/rankle/rankle.css"));
    const rule = css.slice(css.indexOf(".rk-argument-side-label {"), css.indexOf(".rk-argument-stack"));
    expect(rule).toMatch(/color:\s*var\(--color-white\)/);
    expect(rule).not.toMatch(/opacity\s*:\s*0\.\d/);
  });
});

describe("Rankle case study — M2/M3 untouched", () => {
  it("the shell and cover were not modified by this milestone", () => {
    for (const f of ["components/shell/site-shell.tsx", "components/shell/site-header.tsx", "components/shell/site-footer.tsx"]) {
      expect(read(f)).not.toMatch(/rankle/i);
    }
    expect(read("components/cover/cover.tsx")).not.toMatch(/rankle/i);
    expect(read("components/cover/cover.css")).not.toMatch(/rankle/i);
  });
});
