const LOCAL = process.env.PARITY_LOCAL_URL || "http://localhost:3000/api/v1";
const LEGACY =
  process.env.PARITY_LEGACY_URL ||
  "https://habit-tracker-t0o0.onrender.com/api/v1";

const REQUEST_TIMEOUT_MS = 90000;
const LEGACY_RETRIES = 3;
const RETRY_DELAY_MS = 5000;

let mismatches = 0;

function typeOf(value) {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function rawCall(base, method, path, { body, cookie } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (cookie) headers.Cookie = cookie;
  const res = await fetch(`${base}${path}`, {
    method,
    headers,
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
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

async function call(base, method, path, opts = {}) {
  const isLegacy = base === LEGACY;
  let lastError = null;
  for (let attempt = 1; attempt <= (isLegacy ? LEGACY_RETRIES : 1); attempt++) {
    try {
      const res = await rawCall(base, method, path, opts);
      // Render cold-start / transient gateway errors: retry
      if (isLegacy && res.status >= 500 && attempt < LEGACY_RETRIES) {
        lastError = `status ${res.status}`;
        await sleep(RETRY_DELAY_MS);
        continue;
      }
      return res;
    } catch (err) {
      lastError = err.message;
      if (!isLegacy || attempt === LEGACY_RETRIES) {
        return { status: 0, body: null, setCookies: [], error: err.message };
      }
      await sleep(RETRY_DELAY_MS);
    }
  }
  return { status: 0, body: null, setCookies: [], error: lastError };
}

function cookiePair(setCookies, name) {
  const raw = setCookies.find((c) => c.startsWith(`${name}=`));
  return raw ? raw.split(";")[0] : null;
}

function authCookieFrom(setCookies) {
  const access = cookiePair(setCookies, "accessToken");
  const refresh = cookiePair(setCookies, "refreshToken");
  return [access, refresh].filter(Boolean).join("; ");
}

function diffValues(path, localVal, legacyVal, out) {
  if (localVal === legacyVal) return;
  const tl = typeOf(localVal);
  const tg = typeOf(legacyVal);
  if (tl !== tg) {
    out.push(
      `${path}: type local=${tl} legacy=${tg} (${JSON.stringify(localVal)} vs ${JSON.stringify(legacyVal)})`,
    );
    return;
  }
  if (tl === "object") {
    const keys = [
      ...new Set([...Object.keys(localVal), ...Object.keys(legacyVal)]),
    ].sort();
    for (const key of keys) {
      const inLocal = key in localVal;
      const inLegacy = key in legacyVal;
      if (!inLocal) {
        out.push(`${path}.${key}: present in legacy only`);
        continue;
      }
      if (!inLegacy) {
        out.push(`${path}.${key}: present in local only`);
        continue;
      }
      diffValues(`${path}.${key}`, localVal[key], legacyVal[key], out);
    }
    return;
  }
  if (tl === "array") {
    if (localVal.length !== legacyVal.length) {
      out.push(
        `${path}: length local=${localVal.length} legacy=${legacyVal.length}`,
      );
    }
    const common = Math.min(localVal.length, legacyVal.length);
    for (let i = 0; i < common; i++) {
      diffValues(`${path}[${i}]`, localVal[i], legacyVal[i], out);
    }
    return;
  }
  out.push(
    `${path}: local=${JSON.stringify(localVal)} legacy=${JSON.stringify(legacyVal)}`,
  );
}

function compareEndpoint(label, localRes, legacyRes) {
  const deltas = [];

  if (localRes.status !== legacyRes.status) {
    deltas.push(`status: local=${localRes.status} legacy=${legacyRes.status}`);
  }

  const lb = localRes.body;
  const gb = legacyRes.body;

  if (typeOf(lb) !== typeOf(gb)) {
    deltas.push(`body: local=${typeOf(lb)} legacy=${typeOf(gb)}`);
    mismatches += 1;
    console.log(`FAIL ${label}`);
    for (const d of deltas) console.log(`  ${d}`);
    console.log(`  local body:   ${JSON.stringify(lb)}`);
    console.log(`  legacy body:  ${JSON.stringify(gb)}`);
    return;
  }

  if (lb === null && gb === null) {
    deltas.push(
      `body: unparseable JSON on both bases (status local=${localRes.status} legacy=${legacyRes.status})`,
    );
  } else if (lb && gb) {
    if (lb.success !== gb.success) {
      deltas.push(
        `success: local=${JSON.stringify(lb.success)} legacy=${JSON.stringify(gb.success)}`,
      );
    }
    if (lb.message !== gb.message) {
      deltas.push(
        `message: local=${JSON.stringify(lb.message)} legacy=${JSON.stringify(gb.message)}`,
      );
    }
    diffValues("data", lb.data, gb.data, deltas);
    if (lb.data == null && gb.data == null) {
      console.log(
        `WARN ${label}: data is null/undefined on both bases — data shape not verified (status ${localRes.status})`,
      );
    }
  }

  if (deltas.length === 0) {
    console.log(
      `PASS ${label} (status ${localRes.status}, success=${JSON.stringify(lb?.success)}, message=${JSON.stringify(lb?.message)}, data match)`,
    );
    return;
  }

  mismatches += 1;
  console.log(`FAIL ${label}`);
  for (const d of deltas) console.log(`  ${d}`);
}

// Best-effort cleanup against whichever base/token works: both bases share the
// same Atlas DB, so a delete via LOCAL+cookieLocal or LEGACY+cookieLegacy both
// remove the data. Every attempt is logged; `problems` only collects TOTAL
// failures (all available token/base combos failed, or no token at all).
async function cleanup(
  seedHabitId,
  cookieLocal,
  cookieLegacy,
  runAlreadyFailed,
) {
  const problems = [];
  const tokens = [];
  if (cookieLocal) {
    tokens.push({ name: "local", base: LOCAL, cookie: cookieLocal });
  }
  if (cookieLegacy) {
    tokens.push({ name: "legacy", base: LEGACY, cookie: cookieLegacy });
  }

  async function attemptAll(label, path) {
    if (tokens.length === 0) {
      problems.push(`${label} skipped: no auth token from either login`);
      return;
    }
    for (const t of tokens) {
      const res = await call(t.base, "DELETE", path, { cookie: t.cookie });
      if (res.status === 200) {
        console.log(`PASS cleanup ${label} via ${t.name} base`);
        return;
      }
      console.log(
        `cleanup ${label} via ${t.name} base failed (status ${res.status}): ${JSON.stringify(res.body)} — trying next token`,
      );
    }
    problems.push(
      `${label} failed on all available tokens (${tokens.map((t) => t.name).join(", ")})`,
    );
  }

  if (seedHabitId) {
    await attemptAll(
      "delete-habit (seed habit)",
      `/habits/delete-habit/${seedHabitId}`,
    );
  }
  await attemptAll("delete-account (disposable user)", "/users/delete-account");

  if (problems.length === 0) return;
  const level = runAlreadyFailed ? "WARN" : "FAIL";
  for (const p of problems) console.log(`${level} cleanup: ${p}`);
  if (!runAlreadyFailed) mismatches += 1;
}

async function main() {
  // 1. warm Render (cold start can take 30-60s) + healthcheck parity (no auth)
  console.log(`Parity bases: local=${LOCAL} legacy=${LEGACY}`);
  const healthLocal = await call(LOCAL, "GET", "/healthcheck");
  const healthLegacy = await call(LEGACY, "GET", "/healthcheck");
  compareEndpoint("GET /healthcheck", healthLocal, healthLegacy);

  // 2. one throwaway account: register locally (shared Atlas DB), login on BOTH bases
  const stamp = Date.now();
  const username = `parity${stamp}`;
  const email = `parity+${stamp}@test.dev`;
  const password = "secret123";

  const reg = await call(LOCAL, "POST", "/users/register", {
    body: { username, email, password },
  });
  if (reg.status !== 200 || reg.body?.success !== true) {
    // non-200 register = user not created, nothing to clean up
    console.log(
      `FAIL register (local status ${reg.status}): ${JSON.stringify(reg.body)}`,
    );
    process.exit(1);
  }

  // post-register: everything runs inside try/catch/finally so the disposable
  // user is best-effort deleted on EVERY exit path
  let cookieLocal = "";
  let cookieLegacy = "";
  let seedHabitId = null;
  let fatal = null;

  try {
    const loginLocal = await call(LOCAL, "POST", "/users/login", {
      body: { email, password },
    });
    cookieLocal = authCookieFrom(loginLocal.setCookies);

    const loginLegacy = await call(LEGACY, "POST", "/users/login", {
      body: { email, password },
    });
    cookieLegacy = authCookieFrom(loginLegacy.setCookies);

    if (
      loginLocal.status !== 200 ||
      loginLegacy.status !== 200 ||
      loginLocal.error ||
      loginLegacy.error
    ) {
      fatal = `FAIL login: local=${loginLocal.status} ${loginLocal.error || ""} legacy=${loginLegacy.status} ${loginLegacy.error || ""}`;
    } else if (!cookieLocal || !cookieLegacy) {
      fatal = `FAIL login cookies: local=${Boolean(cookieLocal)} legacy=${Boolean(cookieLegacy)}`;
    }

    if (!fatal) {
      // 3. seed ONE habit locally so reads return real data (same DB → both bases see it)
      const seed = await call(LOCAL, "POST", "/habits/create-habit", {
        cookie: cookieLocal,
        body: {
          title: "Parity Seed Habit",
          description: "parity diff seed",
          category: "Health",
          frequency: "daily",
          color: "#4F6F64",
          type: "boolean",
        },
      });
      if (seed.status !== 201 || !seed.body?.data?._id) {
        fatal = `FAIL seed habit (local status ${seed.status}): ${JSON.stringify(seed.body)}`;
      } else {
        seedHabitId = seed.body.data._id;

        // 4. authenticated reads on both bases, SAME account (same DB → same data)
        const habitsLocal = await call(LOCAL, "GET", "/habits/get-habits", {
          cookie: cookieLocal,
        });
        const habitsLegacy = await call(LEGACY, "GET", "/habits/get-habits", {
          cookie: cookieLegacy,
        });
        compareEndpoint("GET /habits/get-habits", habitsLocal, habitsLegacy);

        const statsLocal = await call(LOCAL, "GET", "/dashboard/getstats", {
          cookie: cookieLocal,
        });
        const statsLegacy = await call(LEGACY, "GET", "/dashboard/getstats", {
          cookie: cookieLegacy,
        });
        compareEndpoint("GET /dashboard/getstats", statsLocal, statsLegacy);
      }
    }
  } catch (err) {
    fatal = `FAIL parity-diff script error: ${err.message}`;
  } finally {
    // 5. cleanup on EVERY path, using whichever login token(s) succeeded
    //    (local-first, legacy fallback — same DB, either base deletes the row)
    await cleanup(
      seedHabitId,
      cookieLocal,
      cookieLegacy,
      Boolean(fatal) || mismatches > 0,
    );
  }

  if (fatal) {
    console.log(fatal);
    process.exit(1);
  }
  if (mismatches > 0) {
    console.error(`${mismatches} parity mismatch(es)`);
    process.exit(1);
  }
  console.log(
    "Parity diff passed: local matches legacy on all compared endpoints",
  );
}

main().catch((err) => {
  console.error(`FAIL parity-diff script error: ${err.message}`);
  process.exit(1);
});
