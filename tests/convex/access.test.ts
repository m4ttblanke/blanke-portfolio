/// <reference types="vite/client" />
import { convexTest } from "convex-test";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { api } from "../../convex/_generated/api";
import schema from "../../convex/schema";
import { isAdminSubject, parseIdList } from "../../convex/lib/access";

const modules = import.meta.glob("../../convex/**/*.ts");

const ADMIN_ID = "user_ADMIN";
const OTHER_ID = "user_SOMEONE_ELSE";

const project = (overrides: Record<string, unknown> = {}) => ({
  title: "T",
  slug: "t",
  description: "d",
  stack: ["x"],
  startDate: "2026-01-01",
  draft: false,
  order: 0,
  ...overrides,
});

function setup() {
  const t = convexTest(schema, modules);
  const asAdmin = t.withIdentity({ subject: ADMIN_ID });
  const asOther = t.withIdentity({ subject: OTHER_ID });
  return { t, asAdmin, asOther };
}

async function expectCode(promise: Promise<unknown>, code: string) {
  await expect(promise).rejects.toMatchObject({ data: { code } });
}

const originalEnv = process.env.ADMIN_WORKOS_USER_IDS;
beforeEach(() => {
  process.env.ADMIN_WORKOS_USER_IDS = ADMIN_ID;
});
afterEach(() => {
  if (originalEnv === undefined) delete process.env.ADMIN_WORKOS_USER_IDS;
  else process.env.ADMIN_WORKOS_USER_IDS = originalEnv;
});

describe("allow-list parsing (fail closed)", () => {
  it("parses, trims and drops empties", () => {
    expect(parseIdList(" a , b,, ,c ")).toEqual(["a", "b", "c"]);
    expect(parseIdList(undefined)).toEqual([]);
    expect(parseIdList("")).toEqual([]);
  });

  it("nobody is admin when the list is missing or empty", () => {
    expect(isAdminSubject(ADMIN_ID, undefined)).toBe(false);
    expect(isAdminSubject(ADMIN_ID, "")).toBe(false);
    expect(isAdminSubject(ADMIN_ID, " , ,")).toBe(false);
  });

  it("requires an exact id match and a subject", () => {
    expect(isAdminSubject(ADMIN_ID, ADMIN_ID)).toBe(true);
    expect(isAdminSubject("user_ADMIN2", ADMIN_ID)).toBe(false);
    expect(isAdminSubject(undefined, ADMIN_ID)).toBe(false);
  });
});

describe("mutations", () => {
  it("reject anonymous callers for every table", async () => {
    const { t } = setup();
    const id = await t.run((ctx) => ctx.db.insert("projects", project()));

    await expectCode(t.mutation(api.projects.create, project()), "UNAUTHENTICATED");
    await expectCode(t.mutation(api.projects.update, { id, title: "hacked" }), "UNAUTHENTICATED");
    await expectCode(t.mutation(api.projects.remove, { id }), "UNAUTHENTICATED");

    await expectCode(
      t.mutation(api.experience.create, {
        company: "c", role: "r", description: "d", startDate: "s", current: false, draft: false,
      }),
      "UNAUTHENTICATED"
    );
    await expectCode(
      t.mutation(api.coursework.create, {
        title: "t", institution: "i", description: "d", term: "t", draft: false,
      }),
      "UNAUTHENTICATED"
    );

    // Nothing was changed by the failed attempts.
    const after = await t.run((ctx) => ctx.db.get(id));
    expect(after?.title).toBe("T");
  });

  it("reject authenticated users who are not the admin", async () => {
    const { t, asOther } = setup();
    const id = await t.run((ctx) => ctx.db.insert("projects", project()));

    await expectCode(asOther.mutation(api.projects.create, project()), "FORBIDDEN");
    await expectCode(asOther.mutation(api.projects.update, { id, title: "hacked" }), "FORBIDDEN");
    await expectCode(asOther.mutation(api.projects.remove, { id }), "FORBIDDEN");
    expect((await t.run((ctx) => ctx.db.get(id)))?.title).toBe("T");
  });

  it("reject even the real admin when the allow-list is empty (fails closed)", async () => {
    const { asAdmin } = setup();
    process.env.ADMIN_WORKOS_USER_IDS = "";
    await expectCode(asAdmin.mutation(api.projects.create, project()), "FORBIDDEN");

    delete process.env.ADMIN_WORKOS_USER_IDS;
    await expectCode(asAdmin.mutation(api.projects.create, project()), "FORBIDDEN");
  });

  it("allow the allow-listed admin to create, update and remove", async () => {
    const { t, asAdmin } = setup();
    const id = await asAdmin.mutation(api.projects.create, project({ slug: "mine" }));
    const updated = await asAdmin.mutation(api.projects.update, { id, title: "New title" });
    expect(updated?.title).toBe("New title");
    await asAdmin.mutation(api.projects.remove, { id });
    expect(await t.run((ctx) => ctx.db.get(id))).toBeNull();
  });
});

describe("drafts are not publicly retrievable", () => {
  it("listPublished and getBySlug never return drafts to anonymous callers", async () => {
    const { t } = setup();
    await t.run(async (ctx) => {
      await ctx.db.insert("projects", project({ slug: "live", title: "Live" }));
      await ctx.db.insert("projects", project({ slug: "secret", title: "Secret", draft: true }));
      await ctx.db.insert("experience", {
        company: "c", role: "r", description: "d", startDate: "s", current: false, draft: true,
      });
      await ctx.db.insert("coursework", {
        title: "t", institution: "i", description: "d", term: "t", draft: true,
      });
    });

    const listed = await t.query(api.projects.listPublished, {});
    expect(listed.map((p) => p.slug)).toEqual(["live"]);
    expect(await t.query(api.projects.getBySlug, { slug: "secret" })).toBeNull();
    expect((await t.query(api.projects.getBySlug, { slug: "live" }))?.title).toBe("Live");
    expect(await t.query(api.experience.listPublished, {})).toEqual([]);
    expect(await t.query(api.coursework.listPublished, {})).toEqual([]);
  });

  it("listAll and getById reject anonymous and non-admin callers", async () => {
    const { t, asOther } = setup();
    const id = await t.run((ctx) => ctx.db.insert("projects", project({ draft: true })));

    await expectCode(t.query(api.projects.listAll, {}), "UNAUTHENTICATED");
    await expectCode(t.query(api.projects.getById, { id }), "UNAUTHENTICATED");
    await expectCode(asOther.query(api.projects.listAll, {}), "FORBIDDEN");
    await expectCode(asOther.query(api.projects.getById, { id }), "FORBIDDEN");
    await expectCode(t.query(api.experience.listAll, {}), "UNAUTHENTICATED");
    await expectCode(t.query(api.coursework.listAll, {}), "UNAUTHENTICATED");
  });

  it("the admin can list drafts", async () => {
    const { t, asAdmin } = setup();
    await t.run((ctx) => ctx.db.insert("projects", project({ slug: "secret", draft: true })));
    const all = await asAdmin.query(api.projects.listAll, {});
    expect(all.map((p) => p.slug)).toEqual(["secret"]);
  });
});

describe("admin.isAdmin", () => {
  it("is false for anonymous and non-admin callers, true only for the admin", async () => {
    const { t, asAdmin, asOther } = setup();
    expect(await t.query(api.admin.isAdmin, {})).toBe(false);
    expect(await asOther.query(api.admin.isAdmin, {})).toBe(false);
    expect(await asAdmin.query(api.admin.isAdmin, {})).toBe(true);

    process.env.ADMIN_WORKOS_USER_IDS = "";
    expect(await asAdmin.query(api.admin.isAdmin, {})).toBe(false);
  });
});
