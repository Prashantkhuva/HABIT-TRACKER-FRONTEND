import { NextResponse } from "next/server";
import {
  handler,
  json,
  ApiResponse,
  setAuthCookies,
  clearAuthCookies,
  ApiError,
} from "@/lib/api";
import { auth } from "@/lib/auth";
import { readBody, parse } from "@/lib/validate";
import { User } from "@/src/server/models/user.model";
import { Habit } from "@/src/server/models/habit.model";
import { HabitLog } from "@/src/server/models/habitLog.model";
import { UserSchemas } from "@/src/server/schemas/users";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(
        400,
        "User does not found. Please register the User..",
      );
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    if (error instanceof ApiError) throw error;

    throw new ApiError(
      500,
      error?.message ||
        "Something went wrong while generating access & refresh token",
    );
  }
};

const register = handler(async (req) => {
  const body = parse(UserSchemas.register, await readBody(req));
  const { username, email, password } = body;

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(
      409,
      "User already exists with this username and email",
    );
  }

  const user = await User.create({
    username: username.toLowerCase(),
    email,
    password,
    isEmailVerified: false,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering user!");
  }

  return json(
    200,
    new ApiResponse(200, createdUser, "User registered successfully"),
  );
});

const login = handler(async (req) => {
  const body = parse(UserSchemas.login, await readBody(req));
  const { username, email, password } = body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User not found, Kindly register user.");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id,
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  if (!loggedInUser) {
    throw new ApiError(500, "Something went wrong while log in user");
  }

  const r = NextResponse.json(
    new ApiResponse(
      200,
      { user: loggedInUser },
      "User logged in successfully",
    ),
  );
  return setAuthCookies(r, accessToken, refreshToken);
});

const logout = handler(async (req) => {
  const user = await auth(req);

  await User.findByIdAndUpdate(
    user._id,
    {
      $set: {
        refreshToken: null,
      },
    },
    {
      returnDocument: "after",
    },
  );

  return clearAuthCookies(
    json(200, new ApiResponse(200, {}, "User logged out successfully")),
  );
});

const refresh = handler(async (req) => {
  const incomingRefreshToken =
    req.cookies.get("refreshToken")?.value ||
    (await readBody(req)).refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(400, "Refresh token is required");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Invalid refresh token");
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);

    const r = NextResponse.json(
      new ApiResponse(200, { user }, "Access token refreshed successfully"),
    );
    return setAuthCookies(r, accessToken, newRefreshToken);
  } catch {
    throw new ApiError(
      500,
      "Something went wrong while refreshing access token",
    );
  }
});

const currentUser = handler(async (req) => {
  const user = await auth(req);

  return json(
    200,
    new ApiResponse(200, user, "Current user fetched successfully"),
  );
});

const changePassword = handler(async (req) => {
  const reqUser = await auth(req);
  const body = parse(UserSchemas.changePassword, await readBody(req));
  const { oldPassword, newPassword } = body;

  const user = await User.findById(reqUser._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordValid = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordValid) {
    throw new ApiError(500, "Old Password is Incorrect");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return json(200, new ApiResponse(200, {}, "Password changed successfully"));
});

const updateDetails = handler(async (req) => {
  const reqUser = await auth(req);
  const body = parse(UserSchemas.updateDetails, await readBody(req));
  const { username, email } = body || {};

  if (!username && !email) {
    throw new ApiError(400, "Username or email required");
  }

  const user = await User.findById(reqUser._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const updateFields = {};

  if (username) {
    const cleanUsername = username.toLowerCase().trim();

    if (cleanUsername !== user.username) {
      const existed = await User.findOne({ username: cleanUsername });

      if (existed && existed._id.toString() !== user._id.toString()) {
        throw new ApiError(409, "Username already taken");
      }

      updateFields.username = cleanUsername;
    }
  }

  if (email) {
    updateFields.email = email.trim();
  }

  const updatedUser = await User.findByIdAndUpdate(
    reqUser._id,
    { $set: updateFields },
    { new: true },
  );

  return json(200, new ApiResponse(200, { user: updatedUser }, "Updated"));
});

const deleteAccount = handler(async (req) => {
  const reqUser = await auth(req);
  const userId = reqUser._id;

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const userHabits = await Habit.find({ user: userId });
  const habitIds = userHabits.map((h) => h._id);

  if (habitIds.length > 0) {
    await HabitLog.deleteMany({ habit: { $in: habitIds } });
    await Habit.deleteMany({ user: userId });
  }

  await User.findByIdAndDelete(userId);

  return json(200, new ApiResponse(200, {}, "Account deleted successfully"));
});

const forgotPassword = handler(async (req) => {
  const body = parse(UserSchemas.forgotPassword, await readBody(req));
  const { email } = body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    return json(
      200,
      new ApiResponse(
        200,
        {},
        "If the email exists, a reset link will be sent.",
      ),
    );
  }

  const resetToken = jwt.sign(
    { _id: user._id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" },
  );

  user.resetPasswordToken = resetToken;
  user.resetPasswordExpiry = new Date(Date.now() + 15 * 60 * 1000);
  await user.save({ validateBeforeSave: false });

  const frontendUrl =
    req.headers.get("origin") ||
    process.env.FRONTEND_URL ||
    process.env.CORS_ORIGIN?.split(",")[0] ||
    "http://localhost:5173";
  const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

  return json(
    200,
    new ApiResponse(
      200,
      { resetUrl, message: "Use this link to reset your password (dev mode)" },
      "Reset link generated",
    ),
  );
});

const resetPassword = handler(async (req) => {
  const body = parse(UserSchemas.resetPassword, await readBody(req));
  const { token, password } = body;

  if (!token || !password) {
    throw new ApiError(400, "Token and new password are required");
  }

  if (password.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch {
    throw new ApiError(400, "Invalid or expired reset token");
  }

  const user = await User.findById(decoded._id);

  if (
    !user ||
    user.resetPasswordToken !== token ||
    user.resetPasswordExpiry < new Date()
  ) {
    throw new ApiError(400, "Invalid or expired reset token");
  }

  user.password = password;
  user.resetPasswordToken = null;
  user.resetPasswordExpiry = null;
  await user.save({ validateBeforeSave: false });

  return json(200, new ApiResponse(200, {}, "Password reset successfully"));
});

const routes = {
  register: { POST: register },
  login: { POST: login },
  logout: { POST: logout },
  "refresh-token": { POST: refresh },
  "current-user": { GET: currentUser },
  "change-password": { POST: changePassword },
  "update-details": { PATCH: updateDetails },
  "delete-account": { DELETE: deleteAccount },
  "forgot-password": { POST: forgotPassword },
  "reset-password": { POST: resetPassword },
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
  const key = Array.isArray(slug) ? slug.join("/") : slug;
  const handlerFn = routes[key]?.[method];
  if (!handlerFn) {
    return json(404, {
      success: false,
      message: "Route not found",
      errors: [],
    });
  }
  return handlerFn(req, ctx);
}
