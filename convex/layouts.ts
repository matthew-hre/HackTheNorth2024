import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    // Grab the most recent messages.
    const messages = await ctx.db
      .query("layouts")
      .filter((u) => u.eq(u.field("userId"), userId))
      .collect();
    // Add the author's name to each message.
    return Promise.all(
      messages.map(async (message) => {
        const { name, email } = (await ctx.db.get(message.userId))!;
        return { ...message, author: name ?? email! };
      }),
    );
  },
});

export const create = mutation({
  args: {
    layout: v.array(
      v.object({
        x: v.number(),
        y: v.number(),
        width: v.number(),
        height: v.number(),
        application: v.string(),
      }),
    ),
  },
  handler: async (ctx, { layout }) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Not signed in");
    }
    // Send a new message.
    await ctx.db.insert("layouts", { layout, userId, title: "Unnamed Layout" });
  },
});

export const remove = mutation({
  args: { id: v.id("layouts") },
  handler: async (ctx, { id }) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Not signed in");
    }
    // Delete the message.
    await ctx.db.delete(id);
  },
});
