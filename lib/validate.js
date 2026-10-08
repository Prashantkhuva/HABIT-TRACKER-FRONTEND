import "server-only";
import { ApiError } from "./api";

export async function readBody(req) {
  const len = req.headers.get("content-length");
  if (!len || len === "0") return {};
  try {
    return await req.json();
  } catch (err) {
    // source: express body-parser SyntaxError -> errorHandler -> 500 + message
    throw new ApiError(500, err?.message || "Invalid JSON payload");
  }
}

export function query(req) {
  return Object.fromEntries(req.nextUrl.searchParams.entries());
}

export function parse(schema, data) {
  const result = schema.safeParse(data);
  if (result.success) return result.data;
  const errors = result.error.issues.map((i) => ({
    [i.path.join(".") || "form"]: i.message,
  }));
  throw new ApiError(422, "Received data is not valid", errors);
}
