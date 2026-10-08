import { handler, json, ApiResponse, ApiError } from "@/lib/api";
import { auth } from "@/lib/auth";
import { readBody, query, parse } from "@/lib/validate";
import { Habit } from "@/src/server/models/habit.model";
import { HabitLog } from "@/src/server/models/habitLog.model";
import { HabitSchemas } from "@/src/server/schemas/habits";

const createHabit = handler(async (req) => {
  const reqUser = await auth(req);
  const body = parse(HabitSchemas.create, await readBody(req));
  const { title, description, frequency, category, color, type, unit } = body;

  if (!title || !description || !frequency) {
    throw new ApiError(400, "Title, Description and Frequency are required");
  }

  const allowedFrequency = ["daily", "weekly"];

  if (
    typeof frequency !== "string" ||
    !allowedFrequency.includes(frequency.toLowerCase())
  ) {
    throw new ApiError(400, "Frequency must be 'daily' or 'weekly'");
  }

  const allowedTypes = ["boolean", "streak", "quantity"];

  if (type && !allowedTypes.includes(type)) {
    throw new ApiError(400, "Invalid habit type");
  }

  const habit = await Habit.create({
    title: title.trim(),

    description: description?.trim() || "",

    frequency: frequency.toLowerCase(),

    category: category?.trim(),

    color,

    type: type || "boolean",

    unit: type === "quantity" ? unit?.trim() || "" : "",

    user: reqUser._id,
  });

  return json(201, new ApiResponse(201, habit, "Habit created successfully"));
});

const getHabits = handler(async (req) => {
  const reqUser = await auth(req);

  const params = query(req);
  const page = parseInt(params.page) || 1;
  const limit = Math.min(parseInt(params.limit) || 50, 200);
  const skip = (page - 1) * limit;
  const status = params.status;

  const filter = { user: reqUser._id };
  if (status) filter.status = status;

  const [habits, totalHabits] = await Promise.all([
    Habit.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Habit.countDocuments(filter),
  ]);

  return json(
    200,
    new ApiResponse(
      200,
      {
        habits,
        pagination: {
          totalHabits,
          totalPages: Math.ceil(totalHabits / limit),
          currentPage: page,
          limit,
        },
      },
      "Habits fetched successfully",
    ),
  );
});

const deleteHabit = handler(async (req, ctx) => {
  const reqUser = await auth(req);

  const { habitId: routeHabitId } = await ctx.params;
  const habitId =
    routeHabitId || query(req).habitId || (await readBody(req)).habitId;

  if (!habitId) {
    throw new ApiError(400, "habitId is required");
  }

  const habit = await Habit.findOneAndDelete({
    _id: habitId,
    user: reqUser._id,
  });

  if (!habit) {
    throw new ApiError(404, "Habit not found");
  }

  await HabitLog.deleteMany({
    habit: habitId,
  });

  return json(200, new ApiResponse(200, {}, "Habit deleted successfully"));
});

const updateHabit = handler(async (req, ctx) => {
  const reqUser = await auth(req);
  const body = parse(HabitSchemas.update, await readBody(req));

  const { habitId } = await ctx.params;
  const { title, description, frequency, category, color, type, unit } = body;

  const updateFields = {};

  if (title !== undefined) updateFields.title = title.trim();
  if (description !== undefined) updateFields.description = description.trim();
  if (frequency !== undefined) updateFields.frequency = frequency.toLowerCase();
  if (category !== undefined) updateFields.category = category;
  if (color !== undefined) updateFields.color = color;
  if (type !== undefined) {
    updateFields.type = type;
    if (type !== "quantity") updateFields.unit = "";
  }
  if (unit !== undefined && updateFields.type === "quantity") {
    updateFields.unit = unit.trim();
  }

  const habit = await Habit.findByIdAndUpdate(
    {
      _id: habitId,
      user: reqUser._id,
    },
    {
      $set: updateFields,
    },
    {
      returnDocument: "after",
    },
  );

  if (!habit) {
    throw new ApiError(400, "Habit not found");
  }

  return json(
    200,
    new ApiResponse(200, habit, "habit details updated successfully"),
  );
});

const pause = handler(async (req, ctx) => {
  const reqUser = await auth(req);

  const { habitId } = await ctx.params;

  const habit = await Habit.findByIdAndUpdate(
    {
      _id: habitId,
      user: reqUser._id,
    },
    {
      status: "paused",
    },
    {
      returnDocument: "after",
    },
  );

  return json(200, new ApiResponse(200, habit, "Habit paused successfully"));
});

const resume = handler(async (req, ctx) => {
  const reqUser = await auth(req);

  const { habitId } = await ctx.params;

  const habit = await Habit.findByIdAndUpdate(
    {
      _id: habitId,
      user: reqUser._id,
    },
    {
      status: "active",
    },
    {
      returnDocument: "after",
    },
  );

  return json(200, new ApiResponse(200, habit, "Habit resumed successfully"));
});

const archive = handler(async (req, ctx) => {
  const reqUser = await auth(req);

  const { habitId } = await ctx.params;

  const habit = await Habit.findByIdAndUpdate(
    {
      _id: habitId,
      user: reqUser._id,
    },
    {
      status: "archived",
    },
    {
      returnDocument: "after",
    },
  );

  return json(200, new ApiResponse(200, habit, "Habit archived  successfully"));
});

const routes = {
  "create-habit": { POST: createHabit },
  "get-habits": { GET: getHabits },
  "update-habit": { PATCH: updateHabit },
  "delete-habit": { DELETE: deleteHabit },
  pause: { PATCH: pause },
  resume: { PATCH: resume },
  archive: { PATCH: archive },
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
  let key = first,
    habitId = second;
  if (["pause", "resume", "archive"].includes(second)) {
    key = second;
    habitId = first;
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
