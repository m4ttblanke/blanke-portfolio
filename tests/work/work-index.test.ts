// @vitest-environment node
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { ARCHIVE, COURSES_SHOT, DV_RUN, FEATURES, RULE_TESTS } from "../../lib/work/archive";

const root = join(__dirname, "../..");
const read = (p: string) => readFileSync(join(root, p), "utf8");
const strip = (src: string) => src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1");

const page = read("app/(public)/projects/page.tsx");
const index = strip(read("components/work-index/work-index.tsx"));
const artifacts = strip(read("components/work-index/artifacts.tsx"));
const css = read("components/work-index/work-index.css");
const evidence = read("docs/planning/m7-work-evidence.md");

describe("Work index — hierarchy", () => {
  it("features are exactly the two flagships, in order", () => {
    expect(FEATURES.map((f) => f.id)).toEqual(["rankle", "plannr"]);
    expect(FEATURES.map((f) => f.caseStudy.href)).toEqual(["/projects/rankle", "/projects/plannr"]);
  });

  it("the archive never repeats a flagship and is numbered on from the features", () => {
    for (const e of ARCHIVE) expect(e.title).not.toMatch(/rankle|plannr/i);
    const numbers = [...FEATURES, ...ARCHIVE].map((x) => Number(x.number));
    expect(numbers).toEqual(numbers.map((_, i) => i + 1));
  });

  it("display type belongs to the features only", () => {
    const displays = index.match(/t-display/g) ?? [];
    expect(displays).toHaveLength(1); // the feature name
    expect(index.slice(index.indexOf("function ArchiveItem"))).not.toMatch(/t-display/);
  });

  it("project color stays inside the two features' own scopes", () => {
    const archiveCss = css.slice(css.indexOf("the break: features -> archive"));
    expect(archiveCss).not.toMatch(/--rankle-|--plannr-/);
    const globals = read("app/globals.css");
    expect(globals).toMatch(/\.wi-rankle\s*\{[^}]*--rankle-red:\s*#e5332a/);
    expect(globals).toMatch(/\.wi-plannr\s*\{[^}]*--plannr-navy:\s*#002e61/);
  });

  it("creates no secondary detail routes", () => {
    const routes = readdirSync(join(root, "app/(public)/projects")).sort();
    expect(routes).toEqual(["[slug]", "page.tsx", "plannr", "rankle"]);
  });
});

describe("Work index — content truth", () => {
  it("every archive entry is recorded in the internal evidence inventory", () => {
    for (const e of ARCHIVE) expect(evidence).toContain(`SELECTED — ${e.title}`);
  });

  it("an entry with nothing to link says so, instead of an empty list", () => {
    for (const e of ARCHIVE) {
      if (e.links.length === 0) expect(e.unlinked).toBeTruthy();
    }
  });

  it("does not claim sole authorship of team or course work", () => {
    const [courses, networks] = ARCHIVE;
    expect(courses.context).toMatch(/team/i);
    expect(`${courses.role} ${courses.work}`).not.toMatch(/solo|alone|single-handed|sole/i);
    expect(networks.role).toMatch(/came from the course/i);
    expect(`${networks.role} ${networks.work}`).not.toMatch(/solo|alone|individual/i);
  });

  it("claims no metrics, grades or unverified résumé phrases", () => {
    const text = JSON.stringify(ARCHIVE);
    expect(text).not.toMatch(/\bA\+|GPA|mobile usability|users|downloads|stars|%/i);
  });

  it("the rule names on the page are the test file's own names, verbatim", () => {
    const rules = read(RULE_TESTS.file);
    expect(rules).toContain(`describe("${RULE_TESTS.suite}"`);
    for (const name of RULE_TESTS.names) expect(rules).toContain(`it("${name}"`);
  });

  it("the routing exhibit is internally consistent (route cost = table cost)", () => {
    const cost = (a: number, b: number) =>
      DV_RUN.links.find((l) => (l.a === a && l.b === b) || (l.a === b && l.b === a))!.cost;
    const route = DV_RUN.route;
    const total = route.slice(1).reduce<number>((sum, n, i) => sum + cost(route[i], n), 0);
    expect(total).toBe(DV_RUN.table.find((r) => r.dest === `E${route.at(-1)}`)!.cost);
    expect(cost(0, 3)).toBeGreaterThan(total); // the caption's claim: direct link costs more
  });

  it("the Courses Search screenshot exists at the size the page declares", () => {
    const file = join(root, "public", COURSES_SHOT.src);
    expect(existsSync(file)).toBe(true);
    const png = readFileSync(file);
    expect(png.readUInt32BE(16)).toBe(COURSES_SHOT.width);
    expect(png.readUInt32BE(20)).toBe(COURSES_SHOT.height);
    expect(png.length).toBeLessThan(120_000);
  });
});

describe("Work index — structure and accessibility", () => {
  it("is server-rendered: no client component, no handlers, no randomness", () => {
    for (const src of [index, artifacts, page]) {
      expect(src).not.toMatch(/"use client"/);
      expect(src).not.toMatch(/onClick|onMouse|addEventListener|useState|useEffect/);
      expect(src).not.toMatch(/Math\.random/);
    }
  });

  it("has one h1, and section and entry titles as h2 and h3", () => {
    expect(index.match(/<h1\b/g)).toHaveLength(1);
    expect(index).toMatch(/<h2 id="wi-features-title"/);
    expect(index).toMatch(/<h2 id="wi-archive-title"/);
    expect(index).toMatch(/<h3 id=\{titleId\} className="wi-feature-name/);
    expect(index).toMatch(/<h3 id=\{titleId\} className="wi-entry-title"/);
  });

  it("external links open in a new tab safely and say so to assistive tech", () => {
    expect(index).toMatch(/target="_blank" rel="noopener noreferrer"/);
    expect(index).toMatch(/opens in a new tab/);
  });

  it("marks are decorative and removable: aria-hidden, .annotation, .ornament", () => {
    const marks = artifacts.match(/<span className="[^"]*annotation[^"]*"/g) ?? [];
    expect(marks.length).toBe(2);
    for (const m of marks) expect(m).toMatch(/ornament/);
    expect(read("components/design/marks.tsx")).toMatch(/aria-hidden="true"/);
  });

  it("the one rotation on the page is a named tilt (scaled by --chaos)", () => {
    expect(artifacts.match(/tilt-(c?cw)-\d/g)).toEqual(["tilt-cw-2"]);
    expect(css).not.toMatch(/(^|[\s;{])(rotate|transform)\s*:/m);
  });

  it("keeps the admin (Convex) path: published projects are still listed", () => {
    expect(page).toMatch(/api\.projects\.listPublished/);
    expect(index).toMatch(/filed\.length > 0/);
  });
});
