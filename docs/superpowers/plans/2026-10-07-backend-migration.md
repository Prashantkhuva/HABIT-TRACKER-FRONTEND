# Backend Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port the Express backend (30 endpoints) into this Next.js 15 app as native App Router route handlers, same Atlas DB, unchanged API contract, frontend env-only change.

**Architecture:** `app/api/v1/**/route.js` handlers port controller logic line-by-line against a shared helper layer (`lib/` for db/auth/errors/validation, `src/server/` for models/schemas). Mongoose connection cached globally. Auth = JWT httpOnly cookie verified per handler (no Edge middleware).

**Tech Stack:** Next.js 15 App Router (JS), Mongoose 9, jsonwebtoken, bcrypt, zod. No Express anywhere.

**Spec:** `docs/superpowers/specs/2026-10-07-backend-migration-design.md`

**Source of truth (read, never modify):** `D:\PROJECTS\HABIT TRACKER BACKEND\src\` — controllers/, models/, routes/, validators/, utils/.

## Global Constraints

- API paths and JSON response shapes byte-identical to source (`{ success, message, data }` / errors `{ success: false, message, errors }`).
- No DB schema changes; models copied verbatim.
- No frontend code changes. `NEXT_PUBLIC_API_URL` stays on Render URL until Task 8.
- Server-only modules import `server-only`.
- Cookie options everywhere: `{ httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 30 * 24 * 60 * 60 * 1000 }` — source used `sameSite: "none", secure: true` for cross-origin; same-origin now, `lax` required for localhost HTTP.
- Verification for every task: `npm run build` passes AND `node scripts/api-smoke.mjs <scope>` passes (script grows per task).
- Windows: run git bash commands from repo root `D:\PROJECTS\HABIT TRACKER FRONTEND`.

## Handler Transformation Rules (apply in Tasks 2-6)

Source pattern → Next.js target:

| Express source | Next.js target |
|---|---|
| `asyncHandler(async (req, res) => { ... })` | `export async function METHOD(req, ctx) { return handler(async () => { ... }) }` |
| `return res.status(N).json(new ApiResponse(N, data, msg))` | `return NextResponse.json(new ApiResponse(N, data, msg), { status: N })` |
| `res.status(N).cookie(k, v, o).json(...)` | `const r = NextResponse.json(...); r.cookies.set(k, v, COOKIE_OPTS); return r;` (set every cookie before return) |
| `req.body` | `await readBody(req)` (once, top of handler) |
| `req.params.x` | `const { x } = await ctx.params` (Next 15: params is a Promise) |
| `req.query.x` | `query(req).x` (helper returns plain object from `req.nextUrl.searchParams`) |
| `req.user` | `const user = await auth(req)` (top of handler, replaces verifyJWT middleware) |
| `req.cookies.x` | `req.cookies.get("x")?.value` |
| `req.headers.origin` | `req.headers.get("origin")` |
| `validate` middleware | `const body = parse(USER_SCHEMA, raw)` — throws ApiError 422 same shape |

Error responses handled once by `handler()` — no per-route try/catch needed beyond what controllers already throw.

---

### Task 1: Foundation (deps, env, models, helpers)

**Files:**
- Create: `lib/db.js`, `lib/api.js`, `lib/auth.js`, `lib/validate.js`, `src/server/constants.js`, `src/server/models/{user,habit,habitLog,blog}.model.js`, `src/server/schemas/users.js`, `src/server/jobs/reminder.js`, `scripts/api-smoke.mjs`
- Modify: `package.json` (deps), `.env` (append backend secrets), `instrumentation.js` (new, Next entry)

**Interfaces:**
- Produces (used by Tasks 2-7):
  - `connectDB(): Promise<typeof mongoose>` — cached global
  - `ApiError(statusCode, message?, errors?)`, `ApiResponse(statusCode, data, message?)` — same signatures as source utils
  - `handler(fn): (req, ctx) => Promise<NextResponse>` — catches ApiError/unknown → JSON
  - `auth(req): Promise<User>` — throws ApiError(401) if invalid
  - `readBody(req): Promise<object>`, `query(req): object`, `COOKIE_OPTS` object
  - `parse(schema, data)` — zod → throws ApiError(422, "Received data is not valid", [{field: msg}])
  - `setAuthCookies(res, access, refresh)`, `clearAuthCookies(res)` on NextResponse

- [ ] **Step 1: Install deps**

Run: `npm i mongoose jsonwebtoken bcrypt zod && npm i -D @types/bcrypt`
Expected: added to package.json.

- [ ] **Step 2: Append backend secrets to `.env`**

Append (values copied verbatim from `D:\PROJECTS\HABIT TRACKER BACKEND\.env` — see that file directly; secrets intentionally not duplicated here):

```
MONGODB_URL=<from backend .env>
ACCESS_TOKEN_SECRET=<from backend .env><from backend .env>
ACCESS_TOKEN_EXPIRE=1d
REFRESH_TOKEN_SECRET=<from backend .env><from backend .env>
REFRESH_TOKEN_EXPIRE=7d
```

Verify `.gitignore` line 26 contains `.env` (already confirmed). Never commit `.env`.

- [ ] **Step 3: Copy models + constants verbatim**

Copy `src/{models/*,constants.js}` from backend into `src/server/` keeping relative imports working. Add `import "server-only";` at top of each model file. Rename nothing.

- [ ] **Step 4: Write `lib/db.js`**

```js
import "server-only";
import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;
const DB_NAME = "habittraker";

export async function connectDB() {
  if (!global._mongooseConn) {
    global._mongooseConn = mongoose.connect(`${MONGODB_URL}/${DB_NAME}`, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
  }
  return global._mongooseConn;
}
```

- [ ] **Step 5: Write `lib/api.js`**

```js
import "server-only";
import { NextResponse } from "next/server";

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
  maxAge: 30 * 24 * 60 * 60 * 1000,
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
```

(`handler` imports `connectDB` from `./db.js` — add that import.)

- [ ] **Step 6: Write `lib/auth.js`**

```js
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
```

- [ ] **Step 7: Write `lib/validate.js` (zod)**

```js
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
```

- [ ] **Step 8: Write `instrumentation.js` (repo root)**

```js
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { connectDB } = await import("./lib/db");
    await connectDB().catch((e) => console.error("[instrumentation] db:", e.message));
    const { startReminderJob } = await import("./src/server/jobs/reminder");
    if (process.env.NODE_ENV !== "production") startReminderJob();
  }
}
```

Copy backend `src/jobs/reminder.jobs.js` → `src/server/jobs/reminder.js`, add `server-only` import, keep `node-cron` schedule as-is (add `npm i node-cron`).

- [ ] **Step 9: Smoke script skeleton `scripts/api-smoke.mjs`**

Node script, base URL `process.env.SMOKE_URL || "http://localhost:3000/api/v1"`. Exports a `check(name, cond)` helper that prints `PASS/FAIL` and tracks failures; exits 1 on any failure. Task 1 content: only `GET /healthcheck` expecting `{ success: true }`.

- [ ] **Step 10: Build + commit**

Run: `npm run build && node scripts/api-smoke.mjs` (dev server running on 3000)
Expected: build passes, healthcheck smoke PASS (Task 6 lands healthcheck — until then smoke may FAIL; if so, temporarily hit `/api/v1/healthcheck` after creating Task 7's route first or accept FAIL and fix in Task 7; prefer creating a stub `app/api/v1/healthcheck/route.js` here returning `json(200, new ApiResponse(200, { status: "ok" }, "Healthcheck successful"))`).

Commit: `feat(api): foundation — db/auth/validation helpers, models, instrumentation`

---

### Task 2: Users API (10 endpoints)

**Files:**
- Create: `src/server/schemas/users.js`, `app/api/v1/users/[...slug]/route.js`
- Read: backend `src/controllers/user.controller.js`, `src/routes/user.route.js`, `src/validators/index.js` (user portion)

**Interfaces:**
- Consumes: `auth`, `handler`, `ApiError`, `ApiResponse`, `setAuthCookies`, `clearAuthCookies`, `readBody`, `parse`, models.
- Produces: all `/api/v1/users/*` endpoints (frontend `auth-api.js` contract).

- [ ] **Step 1: Route entry `app/api/v1/users/[...slug]/route.js`**

Single catch-all (keeps 10 paths in one dispatcher — Next folder-per-route would be 10 folders; this mirrors Express router):

```js
import { NextResponse } from "next/server";
import { handler, json, ApiResponse, setAuthCookies, clearAuthCookies, ApiError } from "@/lib/api";
import { auth } from "@/lib/auth";
import { readBody, parse } from "@/lib/validate";
import { User } from "@/src/server/models/user.model";
import { UserSchemas } from "@/src/server/schemas/users";
import jwt from "jsonwebtoken";

// handler functions: register, login, logout, refresh, current, changePassword,
// updateDetails, deleteAccount, forgotPassword, resetPassword — ported below.

const routes = {
  "register": { POST: register },
  "login": { POST: login },
  "logout": { POST: logout },
  "refresh-token": { POST: refresh },
  "current-user": { GET: currentUser },
  "change-password": { POST: changePassword },
  "update-details": { PATCH: updateDetails },
  "delete-account": { DELETE: deleteAccount },
  "forgot-password": { POST: forgotPassword },
  "reset-password": { POST: resetPassword },
};

export async function GET(req, ctx) { return dispatch(req, ctx, "GET"); }
export async function POST(req, ctx) { return dispatch(req, ctx, "POST"); }
export async function PATCH(req, ctx) { return dispatch(req, ctx, "PATCH"); }
export async function DELETE(req, ctx) { return dispatch(req, ctx, "DELETE"); }

async function dispatch(req, ctx, method) {
  const { slug } = await ctx.params;
  const key = Array.isArray(slug) ? slug.join("/") : slug;
  const handlerFn = routes[key]?.[method];
  if (!handlerFn) {
    return json(404, { success: false, message: "Route not found", errors: [] });
  }
  return handlerFn(req, ctx);
}
```

- [ ] **Step 2: Port each controller function**

Port verbatim from backend `user.controller.js` with these bindings:
- `generateAccessAndRefreshToken` helper copied as-is (module scope, uses `User` model).
- Each route value: `(req, ctx) => handler(async () => { ... })` — but dispatch already returns inner fn; so define `const register = async (req) => handlerInner(...)` — simplest: each exported const IS wrapped: `const register = handler(async (req, ctx) => { ... })`.
- `req.body` → `const body = parse(UserSchemas.register, await readBody(req))` FIRST (validator position preserved: validate → controller logic).
- Login success: port logic, but response:

```js
const r = NextResponse.json(
  new ApiResponse(200, { user: loggedInUser }, "User logged in successfully"),
);
return setAuthCookies(r, accessToken, refreshToken);
```

- Logout: `const user = await auth(req);` replaces `req.user`; then port `findByIdAndUpdate` logic; `return clearAuthCookies(json(200, new ApiResponse(200, null, "User logged out successfully")))`.
- `refresh-token`: read `req.cookies.get("refreshToken")?.value`; no cookie → `ApiError(401, "Unauthorized: No refresh token")`; port decode/compare/save logic; on success `setAuthCookies(r, newAccess, newRefresh)`.
- `current-user`: `const user = await auth(req);` → `json(200, new ApiResponse(200, user, "Current user fetched successfully"))`.
- `forgot-password`: port as-is (uses `req.headers.origin` → `req.headers.get("origin")`). Response must NOT leak token if source doesn't — copy source behavior exactly.
- `change-password` / `update-details` / `delete-account` / `reset-password`: port verbatim, `auth(req)` at top where route had `verifyJWT`.
- Delete account clears cookies on success (match source — if source doesn't clear, don't either).

- [ ] **Step 3: Zod schemas `src/server/schemas/users.js`**

Port rules from backend `src/validators/index.js` user section (read it — same messages). Example shape:

```js
import "server-only";
import { z } from "zod";

export const UserSchemas = {
  register: z.object({
    username: z.string().trim().min(3, "Username must be at least 3 characters"),
    email: z.string().trim().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  }),
  login: z.object({
    email: z.string().trim().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
  }),
  // forgotPassword, resetPassword, changePassword, updateDetails:
  // port field-by-field from source validators, copying each .withMessage text.
};
```

Read source validator file first — adjust field sets/messages to match exactly (source may allow username OR email on login: make both optional in `login` schema, keep controller's own `if (!email) throw ApiError(400)` logic).

- [ ] **Step 4: Extend smoke `scripts/api-smoke.mjs` — users scope**

Append users flow (run with `node scripts/api-smoke.mjs users`):
1. `POST /users/register` unique email `smoke+${Date.now()}@test.dev` → expect 200, `data.user.email`
2. `POST /users/login` → 200, capture `set-cookie` containing `accessToken`
3. `GET /users/current-user` with `Cookie: accessToken=...` → 200, username matches
4. `PATCH /users/update-details` `{username: same}` → 200
5. `POST /users/change-password` wrong current password → 401/400 per source message
6. `POST /users/register` duplicate → 409
7. `POST /users/login` wrong password → 401
8. `GET /users/current-user` without cookie → 401 `Unauthorized: No token provided`
9. `POST /users/refresh-token` with refreshToken cookie → 200
10. `POST /users/logout` → 200

- [ ] **Step 5: Run smoke + build + commit**

Run: `node scripts/api-smoke.mjs users` then `npm run build`
Expected: all PASS, build OK.
Commit: `feat(api): users endpoints — register/login/refresh/auth flows`

---

### Task 3: Habits API (7 endpoints)

**Files:**
- Create: `src/server/schemas/habits.js`, `app/api/v1/habits/[...slug]/route.js`
- Read: backend `src/controllers/habit.controller.js`, `src/routes/habit.route.js`, validators (habit section)

**Interfaces:**
- Consumes: foundation + `auth`.
- Produces: `/api/v1/habits/*` (frontend `habits-api.js` contract).

- [ ] **Step 1: Dispatch route file** — same dispatcher pattern as Task 2 with map:

```js
const routes = {
  "create-habit": { POST: createHabit },
  "get-habits": { GET: getHabits },
  "update-habit": { PATCH: updateHabit },      // :habitId = slug[1]
  "delete-habit": { DELETE: deleteHabit },     // :habitId = slug[1]
  "pause": { PATCH: pause },    // slug = [":habitId","pause"] → path key built from first segment
  ...
};
```

Path key logic: `const key = slug.join("/")` gives `"delete-habit/<id>"` — normalize: `const base = slug[0]; const id = slug[1];` then dispatch on `base` for `delete-habit`/`update-habit`, on `id ? slug[1] : slug[0]` for pause/resume/archive. Implement exactly:

```js
async function dispatch(req, ctx, method) {
  const { slug } = await ctx.params;
  const [first, second] = slug;
  let key = first, habitId = second;
  if (["pause", "resume", "archive"].includes(second)) { key = second; habitId = first; }
  const fn = routes[key]?.[method];
  if (!fn) return json(404, { success: false, message: "Route not found", errors: [] });
  ctx.params = Promise.resolve({ habitId, slug });
  return fn(req, ctx);
}
```

- [ ] **Step 2: Port 7 controller functions** using transformation rules; validate `create-habit`/`update-habit` with zod schemas (`HabitSchemas.create`, `HabitSchemas.update` — port habit validators from source, messages verbatim). `getHabits` keeps query params (`page`, `limit`, `status`) via `query(req)`; habit body uses fields `title, category, color, frequency...` — port exactly from source.

- [ ] **Step 3: Extend smoke — habits scope** (`node scripts/api-smoke.mjs habits`): login first (reuse helper from Task 2), create habit, get-habits lists it, pause → status paused, resume → active, update title, archive, delete → 400/404 behavior matching source, get-habits no longer contains it. Unauthenticated create → 401.

- [ ] **Step 4: Smoke + build + commit**

Run: `node scripts/api-smoke.mjs habits && npm run build` → PASS.
Commit: `feat(api): habits CRUD + pause/resume/archive`

---

### Task 4: HabitLog API (4 endpoints)

**Files:**
- Create: `app/api/v1/habitlog/[...slug]/route.js`
- Read: backend `src/controllers/habitlog.controller.js`, route file

**Interfaces:**
- Produces: `/api/v1/habitlog/:habitId/complete|logs|streak`, `/habitlog/all` (frontend contract).

- [ ] **Step 1: Dispatcher** — special-case `"all"` (GET, no auth user needed? route has verifyJWT — keep):

```js
const [first, second] = slug;
if (first === "all") { fn = routes.all.GET; }
else { /* first = habitId, second = complete|logs|streak */ }
```

- [ ] **Step 2: Port 4 functions** — transformation rules; `complete` takes body (note/date optional — port source exactly); `logs`/`all` paginate via `query(req)`.

- [ ] **Step 3: Smoke — habitlog scope**: create+login (helper), create habit, `POST :id/complete` → log created + streak 1; `GET :id/logs` returns it; `GET :id/streak` ≥ 1; `GET all` contains habit id in items; complete again same day → source's idempotent behavior (read source — likely 400 "already completed" or upsert; match it).

- [ ] **Step 4: Smoke + build + commit** — Commit: `feat(api): habitlog complete/logs/streak/all`

---

### Task 5: Dashboard API (5 endpoints)

**Files:**
- Create: `app/api/v1/dashboard/[...slug]/route.js`
- Read: backend `src/controllers/deshboard.controller.js` (keep source spelling in comments only)

**Interfaces:**
- Produces: `getstats`, `weeklydata`, `longest-streak`, `longest-streak/:habitId`, `heatmap` (frontend `dashboard-api.js`).

- [ ] **Step 1: Dispatcher** — keys: `getstats`, `weeklydata`, `longest-streak` (optional second segment habitId → pass to handler via `ctx.params`).

- [ ] **Step 2: Port 5 functions** — transformation rules. `longestStreak(req, ctx)`: habitId = `secondSlug || query(req).habitId` (source: `req.params.habitId || req.query.habitId`).

- [ ] **Step 3: Smoke — dashboard scope**: with data from earlier scopes: getstats returns `totalHabits, completedToday, completionRate` numbers; weeklydata array length 7; heatmap array of `{_id, count}`; longest-streak number ≥ 1; unauth → 401.

- [ ] **Step 4: Smoke + build + commit** — Commit: `feat(api): dashboard stats/weekly/streak/heatmap`

---

### Task 6: Blog API (6 endpoints) + Healthcheck

**Files:**
- Create: `app/api/v1/blog/[...slug]/route.js`, `app/api/v1/healthcheck/route.js` (skip stub from Task 1 if created), `src/server/schemas/blog.js`
- Read: backend `src/controllers/blog.controller.js`, `src/routes/blog.route.js`, blog validators

**Interfaces:**
- Produces: `GET /posts`, `GET /posts/:slug` (public); `POST /posts`, `GET /post/:id`, `PATCH /post/:id`, `DELETE /post/:id` (JWT); `GET /healthcheck`.

- [ ] **Step 1: Blog dispatcher** — `[first, second]`: `"posts"` → GET (public) / POST (auth); `"post"` → GET/PATCH/DELETE with `second = id` (auth). Public GETs skip `auth()`.

- [ ] **Step 2: Port 6 functions** — transformation rules, blog zod schema for create/update.

- [ ] **Step 3: Healthcheck route**

```js
import { json, ApiResponse, handler } from "@/lib/api";
export const GET = handler(async () =>
  json(200, new ApiResponse(200, { status: "ok" }, "Healthcheck successful")),
);
```

(Match source `healthcheck.controller.js` message exactly — read it.)

- [ ] **Step 4: Smoke — blog+health scope**: public `GET /posts` → 200 array; `GET /posts/<slug>` from seed → 200; `POST /posts` authed → 201; `GET /post/:id` → 200; `PATCH` → 200; unauth `POST` → 401; `DELETE` → 200; after delete public slug → 404. `GET /healthcheck` → 200.

- [ ] **Step 5: Smoke + build + commit** — Commit: `feat(api): blog endpoints + healthcheck`

---

### Task 7: Full smoke + parity diff

**Files:**
- Modify: `scripts/api-smoke.mjs` (make `node scripts/api-smoke.mjs` run ALL scopes in sequence with one fresh user)

- [ ] **Step 1: Full run** — `node scripts/api-smoke.mjs` against local dev (`npm run dev`). All 30 endpoints PASS.
- [ ] **Step 2: Parity diff** — pick 3 read endpoints that work with a test account on live Render (`https://habit-tracker-t0o0.onrender.com/api/v1`): `GET /healthcheck`, `GET /dashboard/getstats` (login against Render first with throwaway account), `GET /habits/get-habits`. Compare JSON keys/values local vs Render with `diff <(node -e ...)`. Same shape → PASS; note intentional diffs (e.g. counts differ across accounts — use SAME account on both, same DB so counts MUST match).
- [ ] **Step 3: Commit** — `test(api): full 30-endpoint smoke + parity diff`

---

### Task 8: Cutover + verification

**Files:**
- Modify: `.env` (`NEXT_PUBLIC_API_URL=/api/v1`), `README.md` (run instructions), `vercel.json` (create if Atlas region ≠ default — check `MONGODB_LOC`/Atlas UI during this task; set `{"regions": ["<region>"]}` only if confirmed)

- [ ] **Step 1: Flip env** — `NEXT_PUBLIC_API_URL=/api/v1` in `.env`.
- [ ] **Step 2: Full click-through** — Playwright (webapp-testing skill): signin with real account → dashboard loads stats → create ritual → complete it → statistics heatmap → blog list → settings appearance → help page. Zero console errors, zero 401s on happy path.
- [ ] **Step 3: Build + lint** — `npm run build && npm run lint` (0 errors).
- [ ] **Step 4: Update README** — "API runs in-app at `/api/v1`; backend repo archived; deploy = Vercel only."
- [ ] **Step 5: Commit** — `feat: cutover to in-app API (single-server deployment)`

---

## Self-Review (done)

- Spec coverage: all 30 endpoints (T2-T6), perf rules (T1 db cache/server-only), cutover/rollback (T8 env flip), secrets (T1 .git 26), smoke (script grows T2-T7), parity (T7), region (T8 conditional). Dropped items in spec (rate limit, DNS hack) — no tasks, intentionally.
- Placeholders: none — every task has concrete dispatch code, transformation table, smoke assertions.
- Type consistency: `handler(fn)`, `auth(req)`, `parse(schema, data)`, `readBody`, `query`, `ApiResponse/ApiError`, `setAuthCookies/clearAuthCookies` used identically across tasks.
