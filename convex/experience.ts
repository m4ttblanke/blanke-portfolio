import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Public: only non-draft experience
export const listPublished = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("experience")
      .filter((q) => q.eq(q.field("draft"), false))
      .collect();
  },
});

// Admin: all experience including drafts
export const listAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("experience").collect();
  },
});

export const getById = query({
  args: { id: v.id("experience") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    company: v.string(),
    role: v.string(),
    description: v.string(),
    startDate: v.string(),
    endDate: v.optional(v.string()),
    current: v.boolean(),
    draft: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("experience", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("experience"),
    company: v.optional(v.string()),
    role: v.optional(v.string()),
    description: v.optional(v.string()),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
    current: v.optional(v.boolean()),
    draft: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
    return await ctx.db.get(id);
  },
});

export const remove = mutation({
  args: { id: v.id("experience") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});
