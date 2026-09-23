// @vitest-environment node
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const root = join(__dirname, "../..");
const read = (p: string) => readFileSync(join(root, p), "utf8");
const strip = (src: string) => src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1");
const cover = read("components/cover/cover.tsx");
const stripped = strip(cover);

describe("the cover", () => {
  it("is the homepage, and only the homepage", () => {
    expect(read("app/(public)/page.tsx")).toContain("<Cover />");
    // No other route imports it: the cover does not leak into other pages.
    const other = ["about", "projects", "experience", "coursework", "contact"].map(
      (r) => read(`app/(public)/${r}/page.tsx`)
    );
    for (const src of other) expect(src).not.toMatch(/components\/cover/);
  });

  it("has exactly one heading, with the name as its accessible name", () => {
    const h1s = [...stripped.matchAll(/<h1\b/g)];
    expect(h1s.length).toBe(1);
    expect(stripped).toMatch(/<h1[^>]*aria-label="Matthew Blanke"/);
  });

  it("the statement exists as real, non-hidden text", () => {
    expect(stripped).toMatch(/<p className="cover-statement[^"]*"[^>]*>/);
    expect(stripped).not.toMatch(/<p className="cover-statement[^"]*"[^>]*aria-hidden/);
    expect(cover).toContain("Builds things");
    expect(cover).toContain("people use.");
  });

  it("hides the stylized name spans and the placeholder subject from assistive tech", () => {
    const nameLines = [...stripped.matchAll(/<div className="cover-name-line[^>]*>/g)];
    expect(nameLines.length).toBe(2);
    for (const [tag] of nameLines) expect(tag).toContain('aria-hidden="true"');
    expect(stripped).toMatch(/<div className="cover-subject[^"]*"[^>]*aria-hidden="true"/);
  });

  it("the placeholder subject is clearly temporary, not a real photograph", () => {
    expect(cover).toMatch(/final asset pending/i);
  });

  it("the exit seam is pure ornament: aria-hidden and Clean-Copy-hidden", () => {
    expect(stripped).toMatch(/<div className="cover-seam ornament[^"]*"[^>]*aria-hidden="true"/);
  });

  it("uses Big Shoulders only for the name and the statement, never for the factual rail", () => {
    const metaBlock = stripped.slice(stripped.indexOf("cover-meta"));
    expect(metaBlock).not.toMatch(/t-display/);
  });

  it("does not invent facts: only verified identity data appears", () => {
    expect(cover).not.toMatch(/UCSB|Santa Barbara|California|Product\b/i);
  });

  it("is hand-art-directed: no seed/hash-based placement, no Math.random", () => {
    expect(stripped).not.toMatch(/Math\.random|hashString|lib\/design\/seed/);
  });
});

describe("cover.css", () => {
  const css = strip(read("components/cover/cover.css"));

  it("introduces no new z-index outside the token file", () => {
    expect(css).not.toMatch(/z-index\s*:/);
  });

  it("introduces no raw hex colors", () => {
    expect(css).not.toMatch(/#[0-9a-fA-F]{3,6}\b/);
  });

  it("uses only the sanctioned grid violations it claims (overlap, crop) -- no rotation", () => {
    expect(css).not.toMatch(/\brotate\s*:/);
  });
});
