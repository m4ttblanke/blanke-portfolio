// @vitest-environment node
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

// Structural guard: the only Convex functions that may be callable without
// admin rights are the ones deliberately listed here. Adding a new mutation, or
// a new query that returns data, without `requireAdmin(ctx)` fails this test,
// so a future change cannot silently re-open the database.
const PUBLIC_QUERIES = new Set([
  "projects.listPublished",
  "projects.getBySlug",
  "experience.listPublished",
  "coursework.listPublished",
  "admin.isAdmin", // returns only a boolean
]);

const convexDir = join(__dirname, "../../convex");
const modules = readdirSync(convexDir).filter(
  (f) => f.endsWith(".ts") && !f.endsWith(".d.ts") && f !== "schema.ts" && f !== "auth.config.ts"
);

type Fn = { id: string; kind: string; body: string };

function functionsIn(file: string): Fn[] {
  const src = readFileSync(join(convexDir, file), "utf8");
  const moduleName = file.replace(/\.ts$/, "");
  const re = /export const (\w+) = (query|mutation|action|internalQuery|internalMutation|internalAction|httpAction)\(/g;
  const starts: { name: string; kind: string; index: number }[] = [];
  for (let m = re.exec(src); m; m = re.exec(src)) {
    starts.push({ name: m[1], kind: m[2], index: m.index });
  }
  return starts.map((s, i) => ({
    id: `${moduleName}.${s.name}`,
    kind: s.kind,
    body: src.slice(s.index, starts[i + 1]?.index ?? src.length),
  }));
}

const all = modules.flatMap(functionsIn);

describe("every exported Convex function is guarded", () => {
  it("finds the functions it is supposed to check", () => {
    expect(all.length).toBeGreaterThan(10);
  });

  it("no public actions or HTTP actions exist without review", () => {
    const unreviewed = all.filter((f) => ["action", "httpAction"].includes(f.kind)).map((f) => f.id);
    expect(unreviewed).toEqual([]);
  });

  it("every mutation calls requireAdmin(ctx)", () => {
    const missing = all
      .filter((f) => f.kind === "mutation" && !f.body.includes("requireAdmin(ctx)"))
      .map((f) => f.id);
    expect(missing).toEqual([]);
  });

  it("every query is either explicitly public or calls requireAdmin(ctx)", () => {
    const missing = all
      .filter((f) => f.kind === "query")
      .filter((f) => !PUBLIC_QUERIES.has(f.id) && !f.body.includes("requireAdmin(ctx)"))
      .map((f) => f.id);
    expect(missing).toEqual([]);
  });

  it("public queries that list or read content filter out drafts", () => {
    const draftAware = ["projects.listPublished", "projects.getBySlug", "experience.listPublished", "coursework.listPublished"];
    for (const id of draftAware) {
      const fn = all.find((f) => f.id === id);
      expect(fn, id).toBeDefined();
      expect(fn!.body, id).toMatch(/q\.eq\(q\.field\("draft"\), false\)/);
    }
  });
});
