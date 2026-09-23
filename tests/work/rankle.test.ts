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

  it("renders the static composition with no page-specific client JS (M5A is static-only)", () => {
    for (const [name, src] of Object.entries(sources)) {
      expect(src, name).not.toMatch(/"use client"/);
      expect(src, name).not.toMatch(/onClick|onMouseEnter|onMouseLeave|onDragStart|addEventListener|useState|useEffect/);
    }
  });

  it("added no new dependency (no drag/animation/cursor library)", () => {
    const pkg = JSON.parse(read("package.json"));
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };
    for (const banned of ["framer-motion", "gsap", "motion", "react-spring", "@dnd-kit/core", "@dnd-kit/sortable"]) {
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

describe("Rankle case study — accessibility", () => {
  it("has exactly one h1 (the wordmark) and one h2 per spread", () => {
    const h1s = allSource.match(/<h1\b/g) ?? [];
    const h2s = allSource.match(/<h2\b/g) ?? [];
    expect(h1s.length).toBe(1);
    expect(h2s.length).toBe(4); // Thing, Argument, System, Receipt
  });

  it("decorative graphics are aria-hidden and non-semantic (.ornament)", () => {
    for (const cls of ["rk-hero-stack", "rk-argument-marks"]) {
      expect(allSource, cls).toMatch(new RegExp(`className="${cls} ornament"[^>]*aria-hidden="true"`));
    }
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

describe("Rankle case study — M2/M3 untouched", () => {
  it("the shell and cover were not modified by this milestone", () => {
    for (const f of ["components/shell/site-shell.tsx", "components/shell/site-header.tsx", "components/shell/site-footer.tsx"]) {
      expect(read(f)).not.toMatch(/rankle/i);
    }
    expect(read("components/cover/cover.tsx")).not.toMatch(/rankle/i);
    expect(read("components/cover/cover.css")).not.toMatch(/rankle/i);
  });
});
