import { json, ApiResponse } from "@/lib/api";

/* Ported from backend src/controllers/healthcheck.controller.js:
   data is the string "Server is running fine", message defaults to "Success".
   Source never touches the DB, so no handler()/connectDB wrapper here. */
export function GET() {
  return json(200, new ApiResponse(200, "Server is running fine"));
}
