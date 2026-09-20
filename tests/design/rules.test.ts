// @vitest-environment node
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

// The brief's "never do this" list, as invariants. If one of these fails, the
// change probably broke docs/ART_DIRECTION.md, not the test.

const root = join(__dirname, "../..");

function walk(dir: string, exts: RegExp): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (name === "node_modules" || name === ".next" || name === "_generated") return [];
    if (statSync(full).isDirectory()) return walk(full, exts);
    return exts.test(name) ? [full] : [];
  });
}

const sources = ["app", "components", "lib"].flatMap((d) => walk(join(root, d), /\.(tsx?|css)$/));
const rel = (f: string) => relative(root, f);
const isAdmin = (f: string) => /(^|\/)(\(admin\)|admin)\//.test(rel(f));
const strip = (src: string) => src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1");

function offenders(test: (src: string, file: string) => boolean, only: (f: string) => boolean = () => true) {
  return sources.filter((f) => only(f) && test(strip(readFileSync(f, "utf8")), f)).map(rel);
}

describe("things we never do", () => {
  it("finds the source files it is meant to scan", () => {
    expect(sources.length).toBeGreaterThan(20);
    expect(sources.map(rel)).toContain("app/globals.css");
  });

  it("no Math.random anywhere: visible chaos is deterministic", () => {
    expect(offenders((s) => /Math\.random\s*\(/.test(s))).toEqual([]);
  });

  it("no `transition: all` / transition-all", () => {
    expect(offenders((s) => /transition(-property)?\s*:\s*all\b|\btransition-all\b/.test(s))).toEqual([]);
  });

  it("no raw z-index outside the token file: use .layer-* inside a .stage", () => {
    const bad = offenders(
      (s) => /z-index\s*:\s*(?!var\(--layer-)/.test(s) || /\bz-(\d+|\[)/.test(s),
      (f) => rel(f) !== "app/globals.css"
    );
    expect(bad).toEqual([]);
  });

  it("no raw hex colors outside the token file, the palette mirror, and OG images", () => {
    const bad = offenders(
      (s) => /(?<![&\w])#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/.test(s),
      (f) => !["app/globals.css", "lib/design/palette.ts"].includes(rel(f)) && !/opengraph-image\.tsx$/.test(f)
    );
    expect(bad).toEqual([]);
  });

  it("public and design code never uses Tailwind's default color families (the admin does)", () => {
    const families = "zinc|slate|gray|neutral|stone|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose";
    const re = new RegExp(`\\b(?:bg|text|border|fill|stroke|ring|from|to|via|divide|outline|decoration|shadow)-(?:${families}|red)-\\d{2,3}\\b`);
    expect(offenders((s) => re.test(s), (f) => !isAdmin(f))).toEqual([]);
  });

  it("no gradient text or glow effects", () => {
    expect(offenders((s) => /bg-clip-text|background-clip\s*:\s*text|text-transparent/.test(s), (f) => !isAdmin(f))).toEqual([]);
  });

  it("no backdrop blur / glass outside the admin", () => {
    expect(offenders((s) => /backdrop-(filter|blur)/.test(s), (f) => !isAdmin(f))).toEqual([]);
  });

  it("annotation marks are always hidden from assistive tech", () => {
    const marks = readFileSync(join(root, "components/design/marks.tsx"), "utf8");
    const svgs = marks.match(/<svg\b[^>]*>/g) ?? [];
    expect(svgs.length).toBe(4);
    for (const tag of svgs) expect(tag).toContain('aria-hidden="true"');
  });
});

describe("fonts", () => {
  const dir = join(root, "app/fonts");
  const size = (n: string) => statSync(join(dir, n)).size;

  it("ships only the three self-hosted variable files, each under 60 KB", () => {
    const files = readdirSync(dir).filter((f) => f.endsWith(".woff2")).sort();
    expect(files).toEqual(["Anybody-Variable.woff2", "BigShouldersDisplay-Variable.woff2", "SchibstedGrotesk-Variable.woff2"]);
    for (const f of files) expect(size(f), f).toBeLessThan(60 * 1024);
  });

  it("the site-wide fonts (body + display) stay under 100 KB together", () => {
    expect(size("SchibstedGrotesk-Variable.woff2") + size("BigShouldersDisplay-Variable.woff2")).toBeLessThan(100 * 1024);
  });

  it("only the body and display faces are loaded by the root layout", () => {
    const layout = readFileSync(join(root, "app/layout.tsx"), "utf8");
    expect(layout).toContain('from "./fonts/body"');
    expect(layout).toContain('from "./fonts/display"');
    expect(layout).not.toMatch(/anybody|proof\/candidates/i);
  });
});

describe("proof sheet", () => {
  it("any negative-margin bleed in the proof sheet is scaled by --chaos so Clean Copy realigns it", () => {
    const css = readFileSync(join(root, "app/proof/proof.css"), "utf8");
    for (const m of css.matchAll(/margin-inline[^:]*:\s*calc\([^;]*\*\s*-1\)/g)) expect(m[0]).toContain("var(--chaos)");
  });
});
