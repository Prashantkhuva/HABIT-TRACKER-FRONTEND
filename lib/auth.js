import "server-only";
import jwt from "jsonwebtoken";
import { ApiError } from "./api";
import { connectDB } from "./db";
import { User } from "@/src/server/models/user.model";

export async function auth(req) {
  await connectDB();
  const token =
    req.cookies?.get?.("accessToken")?.value ||
    req.headers.get("Authorization")?.replace("Bearer ", "");

  if (!token) throw new ApiError(401, "Unauthorized: No token provided");

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (error) {
    throw new ApiError(401, error?.message || "Unauthorized: Invalid token");
  }

  const user = await User.findById(decoded?._id).select(
    "-password -refreshToken",
  );
  if (!user) throw new ApiError(401, "Unauthorized: User not found");
  return user;
}
