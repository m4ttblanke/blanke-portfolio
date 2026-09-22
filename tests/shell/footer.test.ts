// @vitest-environment node
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { PRIMARY_NAV } from "../../lib/shell/nav";

const root = join(__dirname, "../..");
const footer = readFileSync(join(root, "components/shell/site-footer.tsx"), "utf8");
const strip = (src: string) => src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1");
const stripped = strip(footer);

describe("colophon", () => {
  it("lists every primary destination, from the one nav source (no second nav data)", () => {
    expect(stripped).toContain("PRIMARY_NAV.map");
    for (const item of PRIMARY_NAV) {
      expect(footer, item.id).toContain("item.href");
      expect(footer, item.id).toContain("item.label");
    }
  });

  it("lists the verified contact destinations from lib/site's CONTACT, not new literals", () => {
    expect(footer).toContain('from "@/lib/site"');
    for (const key of ["github", "linkedin", "email"]) {
      expect(footer, key).toContain(`CONTACT.${key}.href`);
    }
  });

  it("carries publication identity: the site name and the issue", () => {
    expect(footer).toContain("{SITE_NAME}");
    expect(footer).toContain("ISSUE.number");
    expect(footer).toContain("ISSUE.year");
  });

  it("keeps the /admin escape hatch structurally after, and separate from, the index", () => {
    expect(stripped).toMatch(/<a href="\/admin"/);
    const adminIdx = stripped.indexOf('href="/admin"');
    const navCloseIdx = stripped.indexOf("</nav>");
    expect(navCloseIdx).toBeGreaterThan(-1);
    expect(adminIdx).toBeGreaterThan(navCloseIdx);
  });

  it("does not repeat the tagline: the colophon is not a second About blurb", () => {
    expect(stripped).not.toContain("TAGLINE");
  });

  it("introduces no display typography and no new red", () => {
    expect(stripped).not.toMatch(/t-display|--font-display|display-face/);
    expect(stripped).not.toMatch(/--accent-graphic|--color-red|accent-graphic/);
  });

  it("stays static publication furniture: no client directive, state or listeners", () => {
    expect(footer).not.toMatch(/^\s*["']use client["']/);
    expect(footer).not.toMatch(/useState|useEffect|addEventListener|usePathname/);
  });

  it("labels the footer navigation landmark distinctly from the masthead's", () => {
    expect(footer).toContain('aria-label="Footer"');
  });
});
