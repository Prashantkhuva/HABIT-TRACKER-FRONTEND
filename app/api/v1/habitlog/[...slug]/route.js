import { handler, json, ApiResponse, ApiError } from "@/lib/api";
import { auth } from "@/lib/auth";
import { query, readBody } from "@/lib/validate";
import { Habit } from "@/src/server/models/habit.model";
import { HabitLog } from "@/src/server/models/habitLog.model";

const completeHabitLog = handler(async (req, ctx) => {
  const reqUser = await auth(req);

  const { habitId } = await ctx.params;

  const { note } = await readBody(req);

  const habit = await Habit.findOne({
    _id: habitId,
    user: reqUser._id,
  });

  if (!habit) {
    throw new ApiError(404, "Habit not found or unauthorized");
  }

  /* TODAY START */
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const dayTimestamp = today.getTime();

  /* CHECK DUPLICATE */
  const alreadyCompleted = await HabitLog.findOne({
    habit: habitId,
    user: reqUser._id,
    date: dayTimestamp,
  });

  if (alreadyCompleted) {
    throw new ApiError(400, "Habit already completed today");
  }

  /* CREATE LOG */
  const habitLog = await HabitLog.create({
    habit: habitId,

    user: reqUser._id,

    date: dayTimestamp,

    completedAt: new Date(),

    completed: true,

    note: note || "",
  });

  return json(
    200,
    new ApiResponse(200, habitLog, "Habit completed successfully"),
  );
});

const getHabitLogs = handler(async (req, ctx) => {
  const reqUser = await auth(req);

  const { habitId } = await ctx.params;

  const params = query(req);
  const page = parseInt(params.page) || 1;

  const limit = parseInt(params.limit) || 10;

  const skip = (page - 1) * limit;

  const habit = await Habit.findOne({
    _id: habitId,
    user: reqUser._id,
  });

  if (!habit) {
    throw new ApiError(404, "Habit not found or unauthorized");
  }

  const [logs, totalLogs] = await Promise.all([
    HabitLog.find({
      habit: habitId,
      user: reqUser._id,
    })
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit),

    HabitLog.countDocuments({
      habit: habitId,
      user: reqUser._id,
    }),
  ]);

  const totalPages = Math.ceil(totalLogs / limit);

  return json(
    200,
    new ApiResponse(
      200,
      {
        logs,

        pagination: {
          totalLogs,
          totalPages,
          currentPage: page,
          limit,
        },
      },
      "Habit log fetched successfully",
    ),
  );
});

const getHabitStreak = handler(async (req, ctx) => {
  const reqUser = await auth(req);

  const { habitId } = await ctx.params;

  const habit = await Habit.findOne({
    _id: habitId,
    user: reqUser._id,
  }).select("_id");

  if (!habit) {
    throw new ApiError(404, "Habit not found or unauthorized");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTs = today.getTime();
  const thirtyDaysAgo = todayTs - 30 * 24 * 60 * 60 * 1000;

  const logs = await HabitLog.find({
    habit: habitId,
    user: reqUser._id,
    completed: true,
    date: { $gte: thirtyDaysAgo },
  })
    .sort({ date: -1 })
    .limit(31)
    .select("date -_id");

  if (logs.length === 0) {
    return json(
      200,
      new ApiResponse(200, { currentStreak: 0 }, "No streak yet"),
    );
  }

  let streak = 0;
  let currentDate = new Date(today);

  for (const log of logs) {
    const logDate = new Date(log.date);
    logDate.setHours(0, 0, 0, 0);

    if (logDate.getTime() === currentDate.getTime()) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return json(
    200,
    new ApiResponse(
      200,
      { currentStreak: streak },
      "Habit streak fetched successfully",
    ),
  );
});

const getAllHabitLogs = handler(async (req) => {
  const reqUser = await auth(req);

  const params = query(req);
  const page = parseInt(params.page) || 1;
  const limit = Math.min(parseInt(params.limit) || 50, 200);
  const skip = (page - 1) * limit;

  const [logs, totalLogs] = await Promise.all([
    HabitLog.find({ user: reqUser._id })
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .populate("habit", "title color type unit"),

    HabitLog.countDocuments({ user: reqUser._id }),
  ]);

  return json(
    200,
    new ApiResponse(
      200,
      {
        logs,
        pagination: {
          totalLogs,
          totalPages: Math.ceil(totalLogs / limit),
          currentPage: page,
          limit,
        },
      },
      "All logs fetched",
    ),
  );
});

const routes = {
  all: { GET: getAllHabitLogs },
  complete: { POST: completeHabitLog },
  logs: { GET: getHabitLogs },
  streak: { GET: getHabitStreak },
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
  const [first, second] = slug;
  let key,
    habitId = first;
  if (first === "all") {
    key = second === undefined ? "all" : "__no_match__";
    habitId = undefined;
  } else {
    key = second;
  }
  const fn = routes[key]?.[method];
  if (!fn) {
    return json(404, {
      success: false,
      message: "Route not found",
      errors: [],
    });
  }
  ctx.params = Promise.resolve({ habitId, slug });
  return fn(req, ctx);
}
