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
    r6.body?.message ===
      "User already exists with this username and email",
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

async function main() {
  const scope = process.argv[2] || "healthcheck";

  if (scope === "healthcheck") {
    await healthcheckScope();
  } else if (scope === "users") {
    await usersScope();
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
