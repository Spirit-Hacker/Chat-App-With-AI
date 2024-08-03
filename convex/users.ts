import { ConvexError, v } from "convex/values";
import { query, internalMutation } from "./_generated/server";

export const createUser = internalMutation({
  args: {
    tokenIdentifier: v.string(),
    name: v.optional(v.string()),
    email: v.string(),
    image: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("users", {
      tokenIdentifier: args.tokenIdentifier,
      name: args.name,
      email: args.email,
      image: args.image,
      isOnline: true,
    });
  },
});

export const updateUser = internalMutation({
  args: {
    tokenIdentifier: v.string(),
    image: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", args.tokenIdentifier),
      )
      .unique();

    if (!user) {
      throw new ConvexError("unable to fetch user, while update user");
    }

    await ctx.db.patch(user._id, {
      tokenIdentifier: args.tokenIdentifier,
      image: args.image,
    });
  },
});

export const setUserOnline = internalMutation({
  args: {
    tokenIdentifier: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", args.tokenIdentifier),
      )
      .unique();

    if (!user) {
      throw new ConvexError("unable to fetch user, while set user online");
    }

    await ctx.db.patch(user._id, {
      isOnline: true,
    });
  },
});

export const setUserOffline = internalMutation({
  args: {
    tokenIdentifier: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", args.tokenIdentifier),
      )
      .unique();

    if (!user) {
      throw new ConvexError("unable to fetch user, while set user offline");
    }

    await ctx.db.patch(user._id, {
      isOnline: false,
    });
  },
});

export const getAllUsers = query({
  args: {},
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("Unauthorized, get all users");
    }

    const users = await ctx.db.query("users").collect();

    if (!users) {
      throw new ConvexError("Unable to fetch all users");
    }

    return users;
  },
});

export const getMe = query({
  args: {},
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("Unauthorized, get single user");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    if (!user) {
      throw new ConvexError("unable to fetch user");
    }

    return user;
  },
});

// TODO: Add getGroupMembers query -- later
