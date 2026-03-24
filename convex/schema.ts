import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  projects: defineTable({
    title: v.string(),
    description: v.string(),
    stack: v.array(v.string()),
    repoUrl: v.optional(v.string()),
    liveUrl: v.optional(v.string()),
    startDate: v.string(),
    endDate: v.optional(v.string()),
    draft: v.boolean(),
    order: v.number(),
  }),
  experience: defineTable({
    company: v.string(),
    role: v.string(),
    description: v.string(),
    startDate: v.string(),
    endDate: v.optional(v.string()),
    current: v.boolean(),
    draft: v.boolean(),
  }),
  coursework: defineTable({
    title: v.string(),
    institution: v.string(),
    description: v.string(),
    term: v.string(),
    grade: v.optional(v.string()),
    draft: v.boolean(),
  }),
});
