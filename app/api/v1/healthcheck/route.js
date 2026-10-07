import { json, ApiResponse } from "@/lib/api";

export function GET() {
  return json(
    200,
    new ApiResponse(200, { status: "ok" }, "Healthcheck successful"),
  );
}
