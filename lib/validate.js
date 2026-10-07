import "server-only";
import { ApiError } from "./api";

export function readBody(req) {
  return req.json().catch(() => ({}));
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
