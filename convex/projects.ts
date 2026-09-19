import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { requireAdmin } from "./lib/access";

// Public: only non-draft projects
export const listPublished = query({
  args: {},
  handler: async (ctx) => {
    const projects = await ctx.db
      .query("projects")
      .filter((q) => q.eq(q.field("draft"), false))
      .collect();
    return projects.sort((a, b) => a.order - b.order);
  },
});

// Public: a single project by slug. Drafts are never returned, so a draft's
// contents cannot be fetched by calling this function directly.
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("projects")
      .filter((q) =>
        q.and(q.eq(q.field("slug"), args.slug), q.eq(q.field("draft"), false))
      )
      .unique();
  },
});

// Admin: all projects including drafts
export const listAll = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const projects = await ctx.db.query("projects").collect();
    return projects.sort((a, b) => a.order - b.order);
  },
});

// Admin: any project by id, including drafts
export const getById = query({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    description: v.string(),
    stack: v.array(v.string()),
    repoUrl: v.optional(v.string()),
    liveUrl: v.optional(v.string()),
    startDate: v.string(),
    endDate: v.optional(v.string()),
    draft: v.boolean(),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    return await ctx.db.insert("projects", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("projects"),
    title: v.optional(v.string()),
    slug: v.optional(v.string()),
    description: v.optional(v.string()),
    stack: v.optional(v.array(v.string())),
    repoUrl: v.optional(v.string()),
    liveUrl: v.optional(v.string()),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
    draft: v.optional(v.boolean()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
    return await ctx.db.get(id);
  },
});

export const remove = mutation({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    return await ctx.db.delete(args.id);
  },
});
