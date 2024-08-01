import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getTasks = query({
  args: {},
  handler: async (ctx, args) => {
    const tasks = await ctx.db.query("tasks").collect()
    return tasks;
  },
});

export const addTask = mutation({
  args: {
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const taskId = await ctx.db.insert("tasks", {
      text: args.text,
      completed: false,
    });

    return taskId;
  },
});

export const completeTask = mutation({
  args: {
    taskId: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    const task = await ctx.db.patch(args.taskId, {
      completed: true,
    });

    return task;
  },
});

export const deleteTask = mutation({
  args: {
    taskId: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    const task = await ctx.db.delete(args.taskId);
    return task;
  },
});
