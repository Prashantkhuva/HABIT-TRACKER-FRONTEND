export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { connectDB } = await import("./lib/db");
    await connectDB().catch((e) => console.error("[instrumentation] db:", e.message));
    const { startReminderJob } = await import("./src/server/jobs/reminder");
    if (process.env.NODE_ENV !== "production") startReminderJob();
  }
}
