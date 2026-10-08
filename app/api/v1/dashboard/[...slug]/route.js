import mongoose from "mongoose";
import { handler, json, ApiResponse } from "@/lib/api";
import { auth } from "@/lib/auth";
import { query } from "@/lib/validate";
import { Habit } from "@/src/server/models/habit.model";
import { HabitLog } from "@/src/server/models/habitLog.model";

/* Ported verbatim from backend src/controllers/deshboard.controller.js (source spelling) */

const getDashboardStats = handler(async (req) => {
  const reqUser = await auth(req);

  const userId = new mongoose.Types.ObjectId(reqUser._id);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTs = today.getTime();

  const [dashboardStats] = await HabitLog.aggregate([
    {
      $facet: {
        totalCompletions: [{ $match: { user: userId } }, { $count: "count" }],
        completedToday: [
          { $match: { user: userId, date: todayTs } },
          { $count: "count" },
        ],
      },
    },
  ]);

  const [habitCount] = await Habit.aggregate([
    { $match: { user: userId } },
    { $count: "count" },
  ]);

  const totalHabits = habitCount?.count || 0;
  const completedToday = dashboardStats?.completedToday?.[0]?.count || 0;
  const totalCompletions = dashboardStats?.totalCompletions?.[0]?.count || 0;

  const completionRate =
    totalHabits === 0 ? 0 : Math.floor((completedToday / totalHabits) * 100);

  return json(
    200,
    new ApiResponse(
      200,
      { totalHabits, completedToday, totalCompletions, completionRate },
      "Dashboard stats fetched successfully",
    ),
  );
});

const weeklyChart = handler(async (req) => {
  const reqUser = await auth(req);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  const weeklyData = await HabitLog.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(reqUser._id),
        completed: true,
        date: {
          $gte: monday.getTime(),
          $lte: sunday.getTime(),
        },
      },
    },
    {
      $group: {
        _id: { $dayOfWeek: { $toDate: "$date" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const result = days.map((day, index) => {
    const found = weeklyData.find((d) => d._id === index + 1);
    return { day, count: found ? found.count : 0 };
  });

  return json(
    200,
    new ApiResponse(200, result, "Weekly data fetched successfully"),
  );
});

const longestStreak = handler(async (req, ctx) => {
  const reqUser = await auth(req);

  const { habitId: secondSlug } = await ctx.params;
  const habitId = secondSlug || query(req).habitId;

  const userId = new mongoose.Types.ObjectId(reqUser._id);
  const matchFilter = {
    user: userId,
    completed: true,
  };

  if (habitId) {
    matchFilter.habit = new mongoose.Types.ObjectId(habitId);
  }

  const uniqueDays = await HabitLog.aggregate([
    { $match: matchFilter },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: { $toDate: "$date" } },
        },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  if (!uniqueDays.length) {
    return json(
      200,
      new ApiResponse(
        200,
        { currentStreak: 0, longestStreak: 0 },
        "Streak calculated successfully",
      ),
    );
  }

  const dates = uniqueDays.map((d) => new Date(d._id));

  let currentStreak = 1;
  let maxStreak = 1;

  for (let i = 1; i < dates.length; i++) {
    const diff = (dates[i] - dates[i - 1]) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      currentStreak++;
    } else {
      currentStreak = 1;
    }
    maxStreak = Math.max(maxStreak, currentStreak);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let liveStreak = 0;
  const dateSet = new Set(uniqueDays.map((d) => d._id));

  const formatDate = (d) => d.toISOString().slice(0, 10);
  let cursor = formatDate(today);

  while (dateSet.has(cursor)) {
    liveStreak++;
    const prev = new Date(cursor);
    prev.setDate(prev.getDate() - 1);
    cursor = formatDate(prev);
  }

  return json(
    200,
    new ApiResponse(
      200,
      { currentStreak: liveStreak, longestStreak: maxStreak },
      "Streak calculated successfully",
    ),
  );
});

const heatmapData = handler(async (req) => {
  const reqUser = await auth(req);

  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  oneYearAgo.setHours(0, 0, 0, 0);

  const data = await HabitLog.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(reqUser._id),
        completed: true,
        date: { $gte: oneYearAgo.getTime() },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: { $toDate: "$date" },
          },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return json(
    200,
    new ApiResponse(200, data, "Heatmap data fetched successfully"),
  );
});

const routes = {
  getstats: { GET: getDashboardStats },
  weeklydata: { GET: weeklyChart },
  "longest-streak": { GET: longestStreak },
  heatmap: { GET: heatmapData },
};

export async function GET(req, ctx) {
  return dispatch(req, ctx, "GET");
}
export async function POST(req, ctx) {
  return dispatch(req, ctx, "POST");
}
export async function PATCH(req, ctx) {
  return dispatch(req, ctx, "PATCH");
}
export async function DELETE(req, ctx) {
  return dispatch(req, ctx, "DELETE");
}

async function dispatch(req, ctx, method) {
  const { slug } = await ctx.params;
  const [first, second, ...rest] = slug;
  let key = first;
  if (rest.length > 0) {
    key = "__no_match__";
  } else if (first !== "longest-streak" && second !== undefined) {
    key = "__no_match__";
  }
  const fn = routes[key]?.[method];
  if (!fn) {
    return json(404, {
      success: false,
      message: "Route not found",
      errors: [],
    });
  }
  ctx.params = Promise.resolve({ habitId: second, slug });
  return fn(req, ctx);
}
