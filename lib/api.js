import "server-only";
import { NextResponse } from "next/server";
import { connectDB } from "./db.js";

export class ApiError extends Error {
  constructor(statusCode, message = "Something went wrong", errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;
  }
}

export class ApiResponse {
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}

export const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 30 * 24 * 60 * 60,
};

export function json(statusCode, payload) {
  return NextResponse.json(payload, { status: statusCode });
}

export function errorResponse(err) {
  if (err instanceof ApiError) {
    return json(err.statusCode, {
      success: false,
      message: err.message,
      errors: err.errors || [],
    });
  }
  console.error("[api] unhandled:", err);
  return json(500, {
    success: false,
    message: err?.message || "Internal Server Error",
    errors: [],
  });
}

export function handler(fn) {
  return async (req, ctx) => {
    try {
      await connectDB();
      return await fn(req, ctx);
    } catch (err) {
      return errorResponse(err);
    }
  };
}

export function setAuthCookies(res, accessToken, refreshToken) {
  res.cookies.set("accessToken", accessToken, COOKIE_OPTS);
  res.cookies.set("refreshToken", refreshToken, COOKIE_OPTS);
  return res;
}

export function clearAuthCookies(res) {
  res.cookies.set("accessToken", "", { ...COOKIE_OPTS, maxAge: 0 });
  res.cookies.set("refreshToken", "", { ...COOKIE_OPTS, maxAge: 0 });
  return res;
}
