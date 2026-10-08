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
    if (deltas.length) {
      mismatches += 1;
      console.log(`FAIL ${label}`);
      for (const d of deltas) console.log(`  ${d}`);
      console.log(`  local body:   ${JSON.stringify(lb)}`);
      console.log(`  legacy body:  ${JSON.stringify(gb)}`);
    }
    return;
  }

  if (lb && gb) {
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
    console.log(
      `FAIL register (local status ${reg.status}): ${JSON.stringify(reg.body)}`,
    );
    process.exit(1);
  }

  const loginLocal = await call(LOCAL, "POST", "/users/login", {
    body: { email, password },
  });
  const loginLegacy = await call(LEGACY, "POST", "/users/login", {
    body: { email, password },
  });

  if (
    loginLocal.status !== 200 ||
    loginLegacy.status !== 200 ||
    loginLocal.error ||
    loginLegacy.error
  ) {
    console.log(
      `FAIL login: local=${loginLocal.status} ${loginLocal.error || ""} legacy=${loginLegacy.status} ${loginLegacy.error || ""}`,
    );
    // best-effort cleanup
    const cleanupCookie = authCookieFrom(loginLocal.setCookies);
    if (cleanupCookie) {
      await call(LOCAL, "DELETE", "/users/delete-account", {
        cookie: cleanupCookie,
      });
    }
    process.exit(1);
  }

  const cookieLocal = authCookieFrom(loginLocal.setCookies);
  const cookieLegacy = authCookieFrom(loginLegacy.setCookies);
  if (!cookieLocal || !cookieLegacy) {
    console.log(
      `FAIL login cookies: local=${Boolean(cookieLocal)} legacy=${Boolean(cookieLegacy)}`,
    );
    process.exit(1);
  }

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
    console.log(
      `FAIL seed habit (local status ${seed.status}): ${JSON.stringify(seed.body)}`,
    );
    await call(LOCAL, "DELETE", "/users/delete-account", {
      cookie: cookieLocal,
    });
    process.exit(1);
  }
  const seedHabitId = seed.body.data._id;

  // 4. authenticated reads on both bases with the SAME account (same DB → same data)
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

  // 5. cleanup: remove seed habit + account locally (shared DB → removes everywhere)
  const delHabit = await call(
    LOCAL,
    "DELETE",
    `/habits/delete-habit/${seedHabitId}`,
    { cookie: cookieLocal },
  );
  if (delHabit.status !== 200) {
    console.log(
      `FAIL cleanup delete-habit status ${delHabit.status}: ${JSON.stringify(delHabit.body)}`,
    );
    mismatches += 1;
  } else {
    console.log("PASS cleanup delete-habit (seed habit removed)");
  }
  const del = await call(LOCAL, "DELETE", "/users/delete-account", {
    cookie: cookieLocal,
  });
  if (del.status !== 200) {
    console.log(
      `FAIL cleanup delete-account status ${del.status}: ${JSON.stringify(del.body)}`,
    );
    mismatches += 1;
  } else {
    console.log("PASS cleanup delete-account (disposable user removed)");
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
