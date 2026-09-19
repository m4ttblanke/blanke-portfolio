// @vitest-environment node
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { contrastRatio } from "../../lib/design/contrast";
import { PAIRS, PALETTE } from "../../lib/design/palette";

const css = readFileSync(join(__dirname, "../../app/globals.css"), "utf8");

function declared(prefix: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const m of css.matchAll(new RegExp(`--${prefix}-([a-z-]+):\\s*([^;]+);`, "g"))) out[m[1]] = m[2].trim();
  return out;
}

describe("palette", () => {
  it("the CSS @theme colors are exactly the palette the proof sheet shows", () => {
    const fromCss = declared("color");
    const lower = Object.fromEntries(Object.entries(PALETTE));
    expect(fromCss).toEqual(lower);
  });

  it("keeps the global palette restrained: no project colors leak into the tokens", () => {
    const names = Object.keys(declared("color"));
    for (const banned of ["yellow", "blue", "cobalt", "pink", "green", "navy", "gold"]) {
      expect(names.some((n) => n.includes(banned)), banned).toBe(false);
    }
  });
});

describe("contrast", () => {
  const ratio = (fg: keyof typeof PALETTE, bg: keyof typeof PALETTE) => contrastRatio(PALETTE[fg], PALETTE[bg]);

  it("every pair used for readable text meets WCAG AA (4.5:1)", () => {
    const readable = PAIRS.filter((p) => !/graphic|marks|never for small/i.test(p.use));
    expect(readable.length).toBeGreaterThanOrEqual(6);
    for (const p of readable) expect(ratio(p.fg, p.bg), `${p.fg} on ${p.bg}`).toBeGreaterThanOrEqual(4.5);
  });

  it("red on ink and ink on red are graphic/large-text only, and documented that way", () => {
    for (const [fg, bg] of [["red", "ink"], ["ink", "red"]] as const) {
      const r = ratio(fg, bg);
      expect(r).toBeGreaterThanOrEqual(3);
      expect(r).toBeLessThan(4.5);
      const pair = PAIRS.find((p) => p.fg === fg && p.bg === bg);
      expect(pair?.use).toMatch(/marks|large|never for small/i);
    }
  });

  it("the focus ring color is visible on every surface it sits on (>= 3:1)", () => {
    expect(ratio("ink", "paper")).toBeGreaterThanOrEqual(3);
    expect(ratio("paper", "ink")).toBeGreaterThanOrEqual(3);
    expect(ratio("white", "red")).toBeGreaterThanOrEqual(3);
  });
});

describe("layers", () => {
  const order = ["ground", "paper", "type-back", "subject", "type-front", "collage", "annotation", "grain", "navigation", "cursor", "modal"];

  it("are declared once, in the documented stacking order", () => {
    const layers = declared("layer");
    expect(Object.keys(layers)).toEqual(order);
    const values = order.map((n) => Number(layers[n]));
    expect(values).toEqual([...values].sort((a, b) => a - b));
    expect(new Set(values).size).toBe(values.length);
  });

  it("each layer has a .layer-* utility bound to its token", () => {
    for (const n of order) expect(css).toMatch(new RegExp(`\\.layer-${n}\\s*\\{[^}]*z-index:\\s*var\\(--layer-${n}\\)`));
  });
});

describe("controlled chaos", () => {
  it("every rotation, nudge, overlap and bleed utility is multiplied by --chaos", () => {
    const rules = [...css.matchAll(/\.((?:tilt|nudge|overlap|bleed)-[a-z0-9-]+)\s*\{([^}]*)\}/g)];
    expect(rules.length).toBe(29); // 8 tilts + 12 nudges + 6 overlaps + 3 bleeds
    for (const [, name, body] of rules) expect(body, name).toContain("var(--chaos)");
  });

  it("Clean Copy zeroes the multiplier and hides ornament without touching content", () => {
    expect(css).toMatch(/:root\[data-copy="clean"\]\s*\{\s*--chaos:\s*0;/);
    expect(css).toMatch(/\[data-copy="clean"\] \.ornament/);
    expect(css).toMatch(/\[data-copy="clean"\] \.torn-bottom-a/);
    // it must never hide arbitrary content classes
    const cleanBlock = css.slice(css.indexOf("7. CLEAN COPY"));
    expect(cleanBlock).not.toMatch(/\.copy|\bp\b|\bh1\b|\barticle\b|\bmain\b/);
  });

  it("torn edges are static numbers, not computed: no runtime randomness in CSS", () => {
    expect(css).toMatch(/--torn-bottom-a:\s*polygon\(/);
    expect(css).not.toMatch(/random\(/);
  });
});

describe("grid", () => {
  it("is 4 columns by default, 8 from 48rem and 12 from 64rem", () => {
    expect(css).toMatch(/--cols:\s*4;/);
    expect(css).toMatch(/@media \(min-width: 48rem\)\s*\{\s*:root\s*\{\s*--cols:\s*8;/);
    expect(css).toMatch(/@media \(min-width: 64rem\)\s*\{\s*:root\s*\{\s*--cols:\s*12;/);
  });
});

describe("motion", () => {
  it("has two easings and four durations, and reduced motion zeroes every duration", () => {
    expect(Object.keys(declared("ease")).sort()).toEqual(["in-out", "out"]);
    const dur = Object.keys(declared("dur")).sort();
    expect(dur).toEqual(["base", "instant", "quick", "slow"]);
    const reduced = css.slice(css.indexOf("prefers-reduced-motion: reduce"));
    for (const d of dur) expect(reduced).toMatch(new RegExp(`--dur-${d}:\\s*0\\.01ms`));
  });
});
