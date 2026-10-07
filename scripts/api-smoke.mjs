const BASE_URL = process.env.SMOKE_URL || "http://localhost:3000/api/v1";

let failures = 0;

export function check(name, cond) {
  const status = cond ? "PASS" : "FAIL";
  if (!cond) failures += 1;
  console.log(`${status} ${name}`);
}

async function main() {
  const body = await fetch(`${BASE_URL}/healthcheck`)
    .then((res) => res.json())
    .catch(() => null);
  check("GET /healthcheck returns success: true", body?.success === true);

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
