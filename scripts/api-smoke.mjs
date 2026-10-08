const BASE_URL = process.env.SMOKE_URL || "http://localhost:3000/api/v1";

let failures = 0;

export function check(name, cond) {
  const status = cond ? "PASS" : "FAIL";
  if (!cond) failures += 1;
  console.log(`${status} ${name}`);
}

async function call(method, path, { body, cookie } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (cookie) headers.Cookie = cookie;
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
  const text = await res.text();
  let payload = null;
  try {
    payload = JSON.parse(text);
  } catch {
    payload = null;
  }
  return {
    status: res.status,
    body: payload,
    setCookies: res.headers.getSetCookie(),
  };
}

function cookiePair(setCookies, name) {
  const raw = setCookies.find((c) => c.startsWith(`${name}=`));
  return raw ? raw.split(";")[0] : null;
}

async function healthcheckScope() {
  const body = await fetch(`${BASE_URL}/healthcheck`)
    .then((res) => res.json())
    .catch(() => null);
  check("GET /healthcheck returns success: true", body?.success === true);
}

async function usersScope() {
  const stamp = Date.now();
  const username = `smoke${stamp}`;
  const email = `smoke+${stamp}@test.dev`;
  const password = "secret123";
  const newPassword = "secret456";

  // 1. register
  const r1 = await call("POST", "/users/register", {
    body: { username, email, password },
  });
  check("register 200", r1.status === 200);
  check("register success true", r1.body?.success === true);
  check("register data.email matches", r1.body?.data?.email === email);
  check(
    "register message",
    r1.body?.message === "User registered successfully",
  );

  // 2. login
  const r2 = await call("POST", "/users/login", { body: { email, password } });
  check("login 200", r2.status === 200);
  check(
    "login user.username matches",
    r2.body?.data?.user?.username === username,
  );
  check("login message", r2.body?.message === "User logged in successfully");
  const accessToken = cookiePair(r2.setCookies, "accessToken");
  const refreshToken = cookiePair(r2.setCookies, "refreshToken");
  check("login sets accessToken cookie", Boolean(accessToken));
  check("login sets refreshToken cookie", Boolean(refreshToken));
  const authCookie = [accessToken, refreshToken].filter(Boolean).join("; ");

  // 3. current-user with cookie
  const r3 = await call("GET", "/users/current-user", { cookie: authCookie });
  check("current-user 200", r3.status === 200);
  check("current-user username matches", r3.body?.data?.username === username);
  check(
    "current-user message",
    r3.body?.message === "Current user fetched successfully",
  );

  // 4. update-details
  const r4 = await call("PATCH", "/users/update-details", {
    cookie: authCookie,
    body: { username, email },
  });
  check("update-details 200", r4.status === 200);
  check(
    "update-details user.username matches",
    r4.body?.data?.user?.username === username,
  );
  check("update-details message", r4.body?.message === "Updated");

  // 5. change-password with wrong current password
  const r5 = await call("POST", "/users/change-password", {
    cookie: authCookie,
    body: { oldPassword: "wrong-current-pass-1", newPassword },
  });
  check("change-password wrong old password 500", r5.status === 500);
  check(
    "change-password wrong old password message",
    r5.body?.message === "Old Password is Incorrect",
  );

  // 6. duplicate register
  const r6 = await call("POST", "/users/register", {
    body: { username, email, password },
  });
  check("duplicate register 409", r6.status === 409);
  check(
    "duplicate register message",
    r6.body?.message === "User already exists with this username and email",
  );

  // 7. login with wrong password
  const r7 = await call("POST", "/users/login", {
    body: { email, password: "wrong-current-pass-1" },
  });
  check("login wrong password 401", r7.status === 401);
  check(
    "login wrong password message",
    r7.body?.message === "Invalid credentials",
  );

  // 8. current-user without cookie
  const r8 = await call("GET", "/users/current-user");
  check("current-user no cookie 401", r8.status === 401);
  check(
    "current-user no cookie message",
    r8.body?.message === "Unauthorized: No token provided",
  );

  // 9. refresh-token with refreshToken cookie
  const r9 = await call("POST", "/users/refresh-token", {
    cookie: refreshToken,
  });
  check("refresh-token 200", r9.status === 200);
  check(
    "refresh-token message",
    r9.body?.message === "Access token refreshed successfully",
  );
  check(
    "refresh-token sets new accessToken cookie",
    Boolean(cookiePair(r9.setCookies, "accessToken")),
  );

  // 10. logout
  const r10 = await call("POST", "/users/logout", { cookie: authCookie });
  check("logout 200", r10.status === 200);
  check("logout message", r10.body?.message === "User logged out successfully");

  // 11. change-password success (access token still valid after logout)
  const r11 = await call("POST", "/users/change-password", {
    cookie: authCookie,
    body: { oldPassword: password, newPassword },
  });
  check("change-password 200", r11.status === 200);
  check(
    "change-password message",
    r11.body?.message === "Password changed successfully",
  );

  // 12. login with new password
  const r12 = await call("POST", "/users/login", {
    body: { email, password: newPassword },
  });
  check("login with new password 200", r12.status === 200);

  // 13. delete-account (cleanup disposable user)
  const r13 = await call("DELETE", "/users/delete-account", {
    cookie: authCookie,
  });
  check("delete-account 200", r13.status === 200);
  check(
    "delete-account message",
    r13.body?.message === "Account deleted successfully",
  );

  // 14. current-user after delete
  const r14 = await call("GET", "/users/current-user", {
    cookie: authCookie,
  });
  check("current-user after delete 401", r14.status === 401);
  check(
    "current-user after delete message",
    r14.body?.message === "Unauthorized: User not found",
  );
}

async function habitsScope() {
  const stamp = Date.now();
  const username = `smokeh${stamp}`;
  const email = `smokeh+${stamp}@test.dev`;
  const password = "secret123";
  const unknownId = "64b000000000000000000000";

  // 1. unauthorized create (no cookie)
  const u1 = await call("POST", "/habits/create-habit", {
    body: {
      title: "No Cookie Habit",
      description: "desc",
      category: "Health",
      frequency: "daily",
    },
  });
  check("create-habit no cookie 401", u1.status === 401);
  check(
    "create-habit no cookie message",
    u1.body?.message === "Unauthorized: No token provided",
  );

  const u2 = await call("GET", "/habits/get-habits");
  check("get-habits no cookie 401", u2.status === 401);
  check(
    "get-habits no cookie message",
    u2.body?.message === "Unauthorized: No token provided",
  );

  // 2. register disposable user
  const r1 = await call("POST", "/users/register", {
    body: { username, email, password },
  });
  check("habits register 200", r1.status === 200);

  // 3. login
  const r2 = await call("POST", "/users/login", { body: { email, password } });
  check("habits login 200", r2.status === 200);
  const accessToken = cookiePair(r2.setCookies, "accessToken");
  const refreshToken = cookiePair(r2.setCookies, "refreshToken");
  check("habits login sets cookies", Boolean(accessToken && refreshToken));
  const authCookie = [accessToken, refreshToken].filter(Boolean).join("; ");

  // 4. create validation: missing everything → all checks fire (express parity)
  const v1 = await call("POST", "/habits/create-habit", {
    cookie: authCookie,
    body: {},
  });
  check("create-habit validation 422", v1.status === 422);
  check(
    "create-habit validation message",
    v1.body?.message === "Received data is not valid",
  );
  check(
    "create-habit validation errors exact",
    JSON.stringify(v1.body?.errors) ===
      JSON.stringify([
        { title: "Habit title is required" },
        { title: "Habit title must be at least 3 characters long" },
        { description: "Description is required" },
        { description: "Description must be at least 3 characters long" },
        { category: "Category is required" },
        { category: "Invalid category" },
        { frequency: "Frequency is required" },
        { frequency: "Frequency must be 'daily' or 'weekly'" },
      ]),
  );

  // 5. create valid habit → 201
  const title1 = "Smoke Habit";
  const c1 = await call("POST", "/habits/create-habit", {
    cookie: authCookie,
    body: {
      title: title1,
      description: "smoke description",
      category: "Health",
      frequency: "daily",
      color: "#4F6F64",
      type: "boolean",
    },
  });
  check("create-habit 201", c1.status === 201);
  check(
    "create-habit message",
    c1.body?.message === "Habit created successfully",
  );
  check("create-habit data.title", c1.body?.data?.title === title1);
  check("create-habit data.status active", c1.body?.data?.status === "active");
  const habitId = c1.body?.data?._id;
  check("create-habit returns _id", Boolean(habitId));

  // 6. controller type check → 400 (type not covered by create validator)
  const c2 = await call("POST", "/habits/create-habit", {
    cookie: authCookie,
    body: {
      title: "Another Habit",
      description: "desc",
      category: "Health",
      frequency: "daily",
      type: "bogus",
    },
  });
  check("create-habit invalid type 400", c2.status === 400);
  check(
    "create-habit invalid type message",
    c2.body?.message === "Invalid habit type",
  );

  // 7. create bad frequency → 422 single error
  const v2 = await call("POST", "/habits/create-habit", {
    cookie: authCookie,
    body: {
      title: "Valid title",
      description: "valid desc",
      category: "Health",
      frequency: "monthly",
    },
  });
  check("create-habit bad frequency 422", v2.status === 422);
  check(
    "create-habit bad frequency errors exact",
    JSON.stringify(v2.body?.errors) ===
      JSON.stringify([{ frequency: "Frequency must be 'daily' or 'weekly'" }]),
  );

  // 8. get-habits lists it
  const g1 = await call("GET", "/habits/get-habits", { cookie: authCookie });
  check("get-habits 200", g1.status === 200);
  check(
    "get-habits message",
    g1.body?.message === "Habits fetched successfully",
  );
  check(
    "get-habits contains habit",
    (g1.body?.data?.habits ?? []).some((h) => h._id === habitId),
  );
  check(
    "get-habits pagination.totalHabits 1",
    g1.body?.data?.pagination?.totalHabits === 1,
  );
  check(
    "get-habits pagination.currentPage 1",
    g1.body?.data?.pagination?.currentPage === 1,
  );

  // 9. status filter: archived empty while habit active
  const g2 = await call("GET", "/habits/get-habits?status=archived", {
    cookie: authCookie,
  });
  check("get-habits archived filter excludes active", g2.status === 200);
  check(
    "get-habits archived filter no habit",
    !(g2.body?.data?.habits ?? []).some((h) => h._id === habitId),
  );

  // 10. pause → paused
  const p1 = await call("PATCH", `/habits/${habitId}/pause`, {
    cookie: authCookie,
  });
  check("pause 200", p1.status === 200);
  check("pause message", p1.body?.message === "Habit paused successfully");
  check("pause status paused", p1.body?.data?.status === "paused");

  // 11. resume → active
  const p2 = await call("PATCH", `/habits/${habitId}/resume`, {
    cookie: authCookie,
  });
  check("resume 200", p2.status === 200);
  check("resume message", p2.body?.message === "Habit resumed successfully");
  check("resume status active", p2.body?.data?.status === "active");

  // 12. update title
  const newTitle = "Renamed Smoke Habit";
  const p3 = await call("PATCH", `/habits/update-habit/${habitId}`, {
    cookie: authCookie,
    body: { title: newTitle },
  });
  check("update-habit 200", p3.status === 200);
  check(
    "update-habit message",
    p3.body?.message === "habit details updated successfully",
  );
  check("update-habit data.title", p3.body?.data?.title === newTitle);

  // 13. update validation: color + type failures
  const v3 = await call("PATCH", `/habits/update-habit/${habitId}`, {
    cookie: authCookie,
    body: { color: "#12", type: "bogus" },
  });
  check("update-habit validation 422", v3.status === 422);
  check(
    "update-habit validation errors exact",
    JSON.stringify(v3.body?.errors) ===
      JSON.stringify([
        { color: "Color must be a valid hex color" },
        { type: "Invalid habit type" },
      ]),
  );

  // 14. update unknown habit → 400
  const p4 = await call("PATCH", `/habits/update-habit/${unknownId}`, {
    cookie: authCookie,
    body: { title: "nope habit" },
  });
  check("update-habit unknown 400", p4.status === 400);
  check("update-habit unknown message", p4.body?.message === "Habit not found");

  // 15. archive → archived (message has double space in source)
  const p5 = await call("PATCH", `/habits/${habitId}/archive`, {
    cookie: authCookie,
  });
  check("archive 200", p5.status === 200);
  check("archive message", p5.body?.message === "Habit archived  successfully");
  check("archive status archived", p5.body?.data?.status === "archived");

  const g3 = await call("GET", "/habits/get-habits?status=archived", {
    cookie: authCookie,
  });
  check(
    "get-habits archived filter includes archived",
    (g3.body?.data?.habits ?? []).some((h) => h._id === habitId),
  );

  // 16. delete unknown → 404
  const d0 = await call("DELETE", `/habits/delete-habit/${unknownId}`, {
    cookie: authCookie,
  });
  check("delete-habit unknown 404", d0.status === 404);
  check("delete-habit unknown message", d0.body?.message === "Habit not found");

  // 17. delete without id → 400
  const d1 = await call("DELETE", "/habits/delete-habit", {
    cookie: authCookie,
  });
  check("delete-habit no id 400", d1.status === 400);
  check(
    "delete-habit no id message",
    d1.body?.message === "habitId is required",
  );

  // 18. unknown route → 404 shape
  const n1 = await call("GET", "/habits/nope", { cookie: authCookie });
  check("unknown habit route 404", n1.status === 404);
  check("unknown habit route message", n1.body?.message === "Route not found");
  check(
    "unknown habit route errors empty",
    Array.isArray(n1.body?.errors) && n1.body.errors.length === 0,
  );

  // 19. wrong method → 404 (GET on pause)
  const n2 = await call("GET", `/habits/${habitId}/pause`, {
    cookie: authCookie,
  });
  check("GET pause 404", n2.status === 404);

  // 20. pause unknown → 200 data null (source: no null check)
  const p6 = await call("PATCH", `/habits/${unknownId}/pause`, {
    cookie: authCookie,
  });
  check("pause unknown 200 source parity", p6.status === 200);
  check("pause unknown data null", p6.body?.data == null);

  // 21. delete → 200, list no longer contains it
  const d2 = await call("DELETE", `/habits/delete-habit/${habitId}`, {
    cookie: authCookie,
  });
  check("delete-habit 200", d2.status === 200);
  check(
    "delete-habit message",
    d2.body?.message === "Habit deleted successfully",
  );

  const g4 = await call("GET", "/habits/get-habits", { cookie: authCookie });
  check("get-habits after delete 200", g4.status === 200);
  check(
    "get-habits after delete excludes habit",
    !(g4.body?.data?.habits ?? []).some((h) => h._id === habitId),
  );
  check(
    "get-habits after delete totalHabits 0",
    g4.body?.data?.pagination?.totalHabits === 0,
  );

  // 22. delete again → 404
  const d3 = await call("DELETE", `/habits/delete-habit/${habitId}`, {
    cookie: authCookie,
  });
  check("delete-habit again 404", d3.status === 404);

  // 23. logout + delete-account cleanup
  const out = await call("POST", "/users/logout", { cookie: authCookie });
  check("habits logout 200", out.status === 200);
  const del = await call("DELETE", "/users/delete-account", {
    cookie: authCookie,
  });
  check("habits delete-account 200", del.status === 200);
}

async function habitlogScope() {
  const stamp = Date.now();
  const username = `smokel${stamp}`;
  const email = `smokel+${stamp}@test.dev`;
  const password = "secret123";
  const unknownId = "64b000000000000000000000";

  // 1. unauthorized checks (verifyJWT before handler)
  const u1 = await call("POST", `/habitlog/${unknownId}/complete`, {
    body: { note: "nope" },
  });
  check("complete no cookie 401", u1.status === 401);
  check(
    "complete no cookie message",
    u1.body?.message === "Unauthorized: No token provided",
  );

  const u2 = await call("GET", "/habitlog/all");
  check("all no cookie 401", u2.status === 401);

  const u3 = await call("GET", `/habitlog/${unknownId}/logs`);
  check("logs no cookie 401", u3.status === 401);

  // 2. register disposable user
  const r1 = await call("POST", "/users/register", {
    body: { username, email, password },
  });
  check("habitlog register 200", r1.status === 200);

  // 3. login
  const r2 = await call("POST", "/users/login", { body: { email, password } });
  check("habitlog login 200", r2.status === 200);
  const accessToken = cookiePair(r2.setCookies, "accessToken");
  const refreshToken = cookiePair(r2.setCookies, "refreshToken");
  check("habitlog login sets cookies", Boolean(accessToken && refreshToken));
  const authCookie = [accessToken, refreshToken].filter(Boolean).join("; ");

  // 4. create habit
  const c1 = await call("POST", "/habits/create-habit", {
    cookie: authCookie,
    body: {
      title: "Habitlog Smoke",
      description: "smoke description",
      category: "Health",
      frequency: "daily",
      color: "#4F6F64",
      type: "boolean",
    },
  });
  check("habitlog create-habit 201", c1.status === 201);
  const habitId = c1.body?.data?._id;
  check("habitlog create-habit returns _id", Boolean(habitId));

  // 5. unknown habitId → 404 exact source message
  const n1 = await call("GET", `/habitlog/${unknownId}/logs`, {
    cookie: authCookie,
  });
  check("logs unknown habit 404", n1.status === 404);
  check(
    "logs unknown habit message",
    n1.body?.message === "Habit not found or unauthorized",
  );

  const n2 = await call("GET", `/habitlog/${unknownId}/streak`, {
    cookie: authCookie,
  });
  check("streak unknown habit 404", n2.status === 404);
  check(
    "streak unknown habit message",
    n2.body?.message === "Habit not found or unauthorized",
  );

  const n3 = await call("POST", `/habitlog/${unknownId}/complete`, {
    cookie: authCookie,
    body: {},
  });
  check("complete unknown habit 404", n3.status === 404);
  check(
    "complete unknown habit message",
    n3.body?.message === "Habit not found or unauthorized",
  );

  // 6. unknown route → 404 dispatcher shape
  const n4 = await call("GET", "/habitlog/nope", { cookie: authCookie });
  check("unknown habitlog route 404", n4.status === 404);
  check(
    "unknown habitlog route message",
    n4.body?.message === "Route not found",
  );
  check(
    "unknown habitlog route errors empty",
    Array.isArray(n4.body?.errors) && n4.body.errors.length === 0,
  );

  // 7. streak before any log → source "No streak yet"
  const s0 = await call("GET", `/habitlog/${habitId}/streak`, {
    cookie: authCookie,
  });
  check("streak no logs 200", s0.status === 200);
  check("streak no logs message", s0.body?.message === "No streak yet");
  check("streak no logs currentStreak 0", s0.body?.data?.currentStreak === 0);

  // 8. complete → log created, streak 1
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dayTs = today.getTime();

  const d1 = await call("POST", `/habitlog/${habitId}/complete`, {
    cookie: authCookie,
    body: {},
  });
  check("complete 200", d1.status === 200);
  check(
    "complete message",
    d1.body?.message === "Habit completed successfully",
  );
  check("complete data.completed true", d1.body?.data?.completed === true);
  check("complete data.date today start", d1.body?.data?.date === dayTs);
  check("complete data.note empty", d1.body?.data?.note === "");

  // 9. duplicate complete same day → source idempotency guard 400
  const d2 = await call("POST", `/habitlog/${habitId}/complete`, {
    cookie: authCookie,
    body: {},
  });
  check("complete duplicate 400", d2.status === 400);
  check(
    "complete duplicate message",
    d2.body?.message === "Habit already completed today",
  );

  // 10. logs returns it with pagination defaults
  const l1 = await call("GET", `/habitlog/${habitId}/logs`, {
    cookie: authCookie,
  });
  check("logs 200", l1.status === 200);
  check("logs message", l1.body?.message === "Habit log fetched successfully");
  check("logs length 1", (l1.body?.data?.logs ?? []).length === 1);
  check(
    "logs pagination.totalLogs 1",
    l1.body?.data?.pagination?.totalLogs === 1,
  );
  check(
    "logs pagination.currentPage 1",
    l1.body?.data?.pagination?.currentPage === 1,
  );
  check("logs pagination.limit 10", l1.body?.data?.pagination?.limit === 10);

  // 11. logs query params honored
  const l2 = await call("GET", `/habitlog/${habitId}/logs?page=1&limit=1`, {
    cookie: authCookie,
  });
  check("logs limit query honored", l2.body?.data?.pagination?.limit === 1);

  // 12. streak ≥ 1
  const s1 = await call("GET", `/habitlog/${habitId}/streak`, {
    cookie: authCookie,
  });
  check("streak 200", s1.status === 200);
  check(
    "streak message",
    s1.body?.message === "Habit streak fetched successfully",
  );
  check("streak currentStreak 1", s1.body?.data?.currentStreak === 1);

  // 13. all contains habit id + pagination defaults
  const a1 = await call("GET", "/habitlog/all", { cookie: authCookie });
  check("all 200", a1.status === 200);
  check("all message", a1.body?.message === "All logs fetched");
  check(
    "all contains habit id",
    (a1.body?.data?.logs ?? []).some((log) =>
      typeof log.habit === "object" && log.habit !== null
        ? log.habit._id === habitId
        : log.habit === habitId,
    ),
  );
  check(
    "all pagination.totalLogs 1",
    a1.body?.data?.pagination?.totalLogs === 1,
  );
  check("all pagination.limit 50", a1.body?.data?.pagination?.limit === 50);

  // 14. all limit capped at 200 (source: Math.min(..., 200))
  const a2 = await call("GET", "/habitlog/all?limit=500", {
    cookie: authCookie,
  });
  check("all limit capped 200", a2.body?.data?.pagination?.limit === 200);

  // 15. wrong method on complete → 404
  const w1 = await call("GET", `/habitlog/${habitId}/complete`, {
    cookie: authCookie,
  });
  check("GET complete 404", w1.status === 404);

  // 16. second habit: note body ported verbatim
  const c2 = await call("POST", "/habits/create-habit", {
    cookie: authCookie,
    body: {
      title: "Habitlog Note Smoke",
      description: "smoke description",
      category: "Health",
      frequency: "daily",
    },
  });
  check("habitlog create-habit 2 (201)", c2.status === 201);
  const habitId2 = c2.body?.data?._id;
  check("habitlog create-habit 2 returns _id", Boolean(habitId2));

  const d3 = await call("POST", `/habitlog/${habitId2}/complete`, {
    cookie: authCookie,
    body: { note: "with note" },
  });
  check("complete with note 200", d3.status === 200);
  check("complete with note data.note", d3.body?.data?.note === "with note");

  // 17. cleanup: delete habits (cascades logs), logout, delete-account
  const h1 = await call("DELETE", `/habits/delete-habit/${habitId}`, {
    cookie: authCookie,
  });
  check("habitlog delete-habit 1 200", h1.status === 200);
  const h2 = await call("DELETE", `/habits/delete-habit/${habitId2}`, {
    cookie: authCookie,
  });
  check("habitlog delete-habit 2 200", h2.status === 200);

  const out = await call("POST", "/users/logout", { cookie: authCookie });
  check("habitlog logout 200", out.status === 200);
  const del = await call("DELETE", "/users/delete-account", {
    cookie: authCookie,
  });
  check("habitlog delete-account 200", del.status === 200);
}

async function main() {
  const scope = process.argv[2] || "healthcheck";

  if (scope === "healthcheck") {
    await healthcheckScope();
  } else if (scope === "users") {
    await usersScope();
  } else if (scope === "habits") {
    await habitsScope();
  } else if (scope === "habitlog") {
    await habitlogScope();
  } else {
    console.error(`FAIL unknown scope: ${scope}`);
    process.exit(2);
  }

  if (failures > 0) {
    console.error(`${failures} check(s) failed`);
    process.exit(1);
  }
  console.log("All smoke checks passed");
}

main().catch((err) => {
  console.error(`FAIL smoke script error: ${err.message}`);
  process.exit(1);
});
