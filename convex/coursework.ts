import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Public: only non-draft coursework
export const listPublished = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("coursework")
      .filter((q) => q.eq(q.field("draft"), false))
      .collect();
  },
});

// Admin: all coursework including drafts
export const listAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("coursework").collect();
  },
});

export const getById = query({
  args: { id: v.id("coursework") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    institution: v.string(),
    description: v.string(),
    term: v.string(),
    grade: v.optional(v.string()),
    draft: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("coursework", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("coursework"),
    title: v.optional(v.string()),
    institution: v.optional(v.string()),
    description: v.optional(v.string()),
    term: v.optional(v.string()),
    grade: v.optional(v.string()),
    draft: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
    return await ctx.db.get(id);
  },
});

export const remove = mutation({
  args: { id: v.id("coursework") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});
