import { query } from "./_generated/server";
import { isAdminSubject } from "./lib/access";

// Lets the admin UI ask "am I allowed to edit?" without triggering an error.
// Returns only a boolean: it reveals nothing about who the admins are.
export const isAdmin = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    return isAdminSubject(identity?.subject, process.env.ADMIN_WORKOS_USER_IDS);
  },
});
