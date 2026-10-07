# Backend Migration Design — Express → Native Next.js Route Handlers

**Date:** 2026-10-07
**Status:** Approved (design phase)
**Source:** `D:\PROJECTS\HABIT TRACKER BACKEND` (Express 5 + Mongoose, deployed at `https://habit-tracker-t0o0.onrender.com/api/v1`)

## Goal

Single project, single server: port the whole Express backend into this Next.js 15 app as native App Router route handlers. No Express, no second deploy, no external API URL. Frontend code stays untouched (env change only).

## Non-negotiables

- **Database unchanged:** same Atlas cluster (`MONGODB_URL`), same DB (`habittraker`), same collections, same schemas. Models copied verbatim from backend. Zero migration, zero schema edits.
- **API contract unchanged:** every endpoint keeps its exact path, method, request body, and response JSON shape (`ApiResponse`/`ApiError`). Frontend makes no code changes.
- **Fast:** cached global Mongo connection, no per-request reconnect, no Edge auth, `server-only` server code, Vercel region matched to Atlas region.
- **Data flows:** existing users/habits/logs/blog posts carry over untouched (same DB).

## Architecture

```
app/api/v1/[groups]/route.js   ← native handlers (exact Express paths)
lib/db.js                      ← cached mongoose.connect (global promise)
lib/auth.js                    ← getUserFromRequest(req) → user | null
lib/api.js                     ← ApiError, ApiResponse helpers (copied)
lib/handler.js                 ← handler(fn) wrapper: ApiError→status JSON, else 500
lib/validate.js                ← zod validate(schema, req) → 422 on fail
src/server/models/*            ← verbatim Mongoose models (user, habit, habitLog, blog)
src/server/schemas/*           ← zod ports of src/validators/index.js
src/server/jobs/reminder.js    ← console-only reminder job (from reminder.jobs.js)
instrumentation.js             ← connectDB() + start reminder job on server boot
```

Server code imports `server-only` so nothing leaks into client bundles.

### What gets dropped (and why)

| Backend piece | Decision |
|---|---|
| express, cors | Same origin now — not needed |
| helmet | → security headers in `next.config.js` |
| cookie-parser | → adapter parses `req.cookies` natively (Next provides) |
| express-rate-limit | Dropped (YAGNI — per-instance anyway) |
| morgan + winston + winston-mongodb | Dropped — console/Next logging |
| express-validator | → zod schemas |
| dns.setServers hack | Drop; re-add only if local DNS fails |
| express.static, nodemon | Not applicable |
| node-cron in-process | → `instrumentation.js`; Vercel Cron later if deployed |

## Auth

- `lib/auth.js`:
  1. `accessToken` from httpOnly cookie (fallback `Authorization: Bearer`).
  2. `jwt.verify(token, ACCESS_TOKEN_SECRET)` (same secrets as today).
  3. `User.findById(decoded._id).select("-password -refreshToken")`.
  4. Returns `user` or throws `ApiError(401)`.
- Protected handlers: `const user = await auth(req);`
- Cookies: `httpOnly: true`, `sameSite: "lax"` (same-origin), `secure` when `NODE_ENV === "production"`, `path: "/"`. Expiry matches current (access 1d, refresh 7d).
- `middleware.js` intentionally NOT used for auth (Edge runtime can't run Mongoose).

## Endpoint map (30 routes, URLs byte-identical)

| Prefix | Endpoints |
|---|---|
| `/api/v1/users` | POST register, login, logout, refresh-token, forgot-password, reset-password, change-password, delete-account; PATCH update-details; GET current-user |
| `/api/v1/habits` | POST create-habit; GET get-habits; PATCH update-habit/:habitId, :habitId/pause, :habitId/resume, :habitId/archive; DELETE delete-habit/:habitId |
| `/api/v1/habitlog` | POST :habitId/complete; GET :habitId/logs, :habitId/streak, all |
| `/api/v1/dashboard` | GET getstats, weeklydata, longest-streak, longest-streak/:habitId, heatmap |
| `/api/v1/blog` | GET posts, posts/:slug, post/:id; POST posts (admin); PATCH post/:id (admin); DELETE post/:id (admin) |
| `/api/v1/healthcheck` | GET / |

Admin gate: `NEXT_PUBLIC_ADMIN_EMAIL` list, compared to `user.email` (as today).

## Validation

- zod schemas ported 1:1 from `src/validators/index.js` (same rules, same messages).
- `validate(schema, req)` collects issues → `ApiError(422, first message)`.

## Error handling

- `handler(fn)` wrapper around every route export: catches `ApiError` → `{ statusCode, message }` status code; unknown errors → 500 + `console.error`.
- Response bodies always `{ success, message, data }` — exact current `ApiResponse` shape.

## Performance rules

1. `lib/db.js`: `if (!global._mongooseConn) global._mongooseConn = connect()` — one connection, reused across invocations.
2. Pool: `maxPoolSize: 10`, same timeouts as source.
3. No user-data caching (`no-store`); handlers are point lookups, warm ~1-3 ms.
4. `server-only` on all server modules; route code never enters client chunks.
5. `vercel.json`: set function region to Atlas cluster region (verify during implementation; biggest prod RTT win).

## Cutover plan (rollback = flip env back)

1. Implement + smoke-test all routes **alongside** live Render backend.
2. Parity diff: curl representative endpoints (login, get-habits, getstats, heatmap) against Render vs local; diff JSON.
3. Deploy to Vercel with old `NEXT_PUBLIC_API_URL` still pointing at Render (API live but unused).
4. Flip `NEXT_PUBLIC_API_URL=/api/v1` → verify production flows.
5. Rollback path: revert env to Render URL. Old repo stays archived forever.

## Secrets

- Merge backend `.env` (Atlas URL, JWT secrets, expiry, ADMIN_EMAIL) into this repo's `.env`. `.gitignore` already covers `.env` (verified line 26).

## Smoke test

One script (Playwright or node+fetch) that: registers → logs in (captures cookie) → creates habit → completes log → reads stats/heatmap/blog → refresh token → logout; asserts status + JSON shape for all 30 endpoints. Run after any server change.

## Out of scope

- No DB schema changes, no data migration.
- No frontend code changes (env only).
- No rate limiting, no email delivery (backend had none — forgot-password token flow ports as-is).
- No new features (notifications, reminders push, etc.) — migration only.
- Old backend repo: untouched archive.

## Risk register

| Risk | Mitigation |
|---|---|
| Response shape drift | Parity diff step 2 before cutover |
| Cold-start DB latency | Cached global connection; warm-up on first request |
| Cookie behavior change (same-origin) | `sameSite: lax` is safe for same-origin; test login→refresh→logout |
| Express-validator message mismatch | zod schemas copy messages verbatim |
| Vercel region mismatch | Set region after checking Atlas cluster region |
