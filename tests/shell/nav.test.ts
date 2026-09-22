// @vitest-environment node
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { PRIMARY_NAV, isActive, navItem } from "../../lib/shell/nav";

const root = join(__dirname, "../..");
const read = (p: string) => readFileSync(join(root, p), "utf8");
const strip = (src: string) => src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1");

const active = (path: string | null) => PRIMARY_NAV.filter((i) => isActive(path, i)).map((i) => i.id);

describe("primary navigation structure", () => {
  it("is the publication's contents, in order", () => {
    expect(PRIMARY_NAV.map((i) => i.label)).toEqual(["Work", "File 001", "Résumé", "Contact"]);
  });

  it("points every entry at a route that exists, and lists it in the sitemap", () => {
    const sitemap = read("app/sitemap.ts");
    for (const item of PRIMARY_NAV) {
      const route = item.href.replace(/^\//, "");
      expect(existsSync(join(root, "app/(public)", route, "page.tsx")), item.href).toBe(true);
      expect(sitemap, item.href).toContain(`'${item.href}'`);
    }
    for (const item of PRIMARY_NAV) {
      for (const page of item.pages ?? []) {
        expect(existsSync(join(root, "app/(public)", page.href.slice(1), "page.tsx")), page.href).toBe(true);
      }
    }
  });

  it("never puts the admin, sign-in or an auth route in the publication nav", () => {
    for (const item of PRIMARY_NAV) {
      expect(item.href).not.toMatch(/^\/(admin|callback|sign)/);
      for (const page of item.pages ?? []) expect(page.href).not.toMatch(/^\/(admin|callback|sign)/);
    }
  });

  it("keeps the legacy routes reachable: every public page belongs to a section or is the home page", () => {
    const publicRoutes = readdirSync(join(root, "app/(public)"), { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => `/${d.name}`);
    for (const route of publicRoutes) expect(active(route), route).toHaveLength(1);
    expect(active("/")).toEqual([]);
  });
});

describe("active section", () => {
  it("marks exactly one section for a page, including nested paths", () => {
    expect(active("/projects")).toEqual(["work"]);
    expect(active("/projects/rankle")).toEqual(["work"]);
    expect(active("/about")).toEqual(["file"]);
    expect(active("/experience")).toEqual(["resume"]);
    expect(active("/coursework")).toEqual(["resume"]);
    expect(active("/contact")).toEqual(["contact"]);
  });

  it("does not match on a shared prefix, or for unrelated paths", () => {
    expect(active("/projectsarchive")).toEqual([]);
    expect(active("/about-me")).toEqual([]);
    expect(active("/admin/projects")).toEqual([]);
    expect(active("/plannr/")).toEqual([]);
    expect(active(null)).toEqual([]);
  });

  it("looks sections up by id", () => {
    expect(navItem("resume").pages?.map((p) => p.href)).toEqual(["/experience", "/coursework"]);
    expect(() => navItem("nope" as never)).toThrow();
  });
});

describe("shell architecture", () => {
  const shellFiles = readdirSync(join(root, "components/shell"));

  it("stays server-rendered except for the one component that needs the path", () => {
    const clients = shellFiles.filter((f) => f.endsWith(".tsx") && /^\s*["']use client["']/.test(read(`components/shell/${f}`)));
    expect(clients).toEqual(["primary-nav.tsx"]);
  });

  it("puts the skip link first and gives it a target", () => {
    const shell = read("components/shell/site-shell.tsx");
    expect(shell.indexOf('className="skip-link"')).toBeGreaterThan(-1);
    expect(shell.indexOf('className="skip-link"')).toBeLessThan(shell.indexOf("<SiteHeader"));
    expect(shell).toContain('href="#main-content"');
    expect(shell).toContain('<main id="main-content">');
  });

  it("labels its two navigation landmarks so they can be told apart", () => {
    expect(read("components/shell/primary-nav.tsx")).toContain('aria-label="Primary"');
    expect(read("components/shell/site-footer.tsx")).toContain('aria-label="Footer"');
  });

  it("marks the current section with aria-current, not just a class", () => {
    expect(read("components/shell/primary-nav.tsx")).toContain('aria-current={isActive(pathname, item) ? "page" : undefined}');
  });

  it("links to /admin with a plain anchor so it is never prefetched", () => {
    const footer = strip(read("components/shell/site-footer.tsx"));
    expect(footer).toMatch(/<a href="\/admin"/);
    expect(footer).not.toMatch(/<Link[^>]*href="\/admin/);
  });

  it("does not use the display face: it is an instrument, not the shell's voice", () => {
    for (const f of shellFiles) {
      const src = strip(read(`components/shell/${f}`));
      expect(src, f).not.toMatch(/t-display|--font-display|display-face/);
    }
  });

  it("does not stick or float: no fixed/sticky positioning", () => {
    expect(strip(read("components/shell/shell.css"))).not.toMatch(/position\s*:\s*(fixed|sticky)/);
  });

  it("the public layout is the shell", () => {
    expect(read("app/(public)/layout.tsx")).toContain("<SiteShell>");
  });
});
