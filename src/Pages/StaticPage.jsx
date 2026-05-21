import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame,
  TrendingUp,
  Zap,
  ArrowUpRight,
  Sparkles,
  Sunrise,
  Sun,
  Moon,
} from "lucide-react";

import {
  getDashboardStats,
  getWeeklyData,
  getLongestStreak,
  getHeatmapData,
} from "../api/dashboard-api";
import { getAllHabitLogs } from "../api/habits-api";

import WeeklyChart from "../components/stats/WeeklyChart";
import Heatmap from "../components/stats/Heatmap";
import StreakPanel from "../components/stats/StreakPanel";
import { getTimeInsights } from "../lib/habit-utils";
import { StatisticsSkeleton } from "../components/loading/LoadingSkeletons";

/* ─── variants ───────────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  show: (i = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* ─── helpers ────────────────────────────────────────────────── */
function Eyebrow({ children, className = "" }) {
  return (
    <p
      className={`text-[10px] font-bold tracking-[0.26em] uppercase text-[#8B8477] ${className}`}
    >
      {children}
    </p>
  );
}

function MiniMetric({ icon: Icon, label, value, accent = false }) {
  return (
    <div className="flex items-center justify-between border-b border-[#E6DED1] py-3.5 last:border-0">
      <span className="flex items-center gap-2.5 text-xs text-[#8B8477]">
        <Icon size={13} />
        {label}
      </span>
      <span
        className={`text-xs font-bold ${accent ? "text-[#47655E]" : "text-[#181714]"}`}
      >
        {value}
      </span>
    </div>
  );
}

/* ─── page ───────────────────────────────────────────────────── */
export default function StatisticsPage() {
  const [stats, setStats] = useState(null);
  const [weekly, setWeekly] = useState([]);
  const [streak, setStreak] = useState({});
  const [heatmap, setHeatmap] = useState([]);
  const [logs, setLogs] = useState([]);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [s, w, st, h, logsRes] = await Promise.all([
          getDashboardStats(),
          getWeeklyData(),
          getLongestStreak(),
          getHeatmapData(),
          getAllHabitLogs(),
        ]);
        setStats(s.data.data);
        setWeekly(w.data.data || []);
        setStreak(st.data.data || {});
        setHeatmap(h.data.data || []);
        setLogs(logsRes.data.data.logs || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAll();
  }, []);

  const { title, description, stats: timeStats } = getTimeInsights(logs || []);

  const bestDay = useMemo(() => {
    if (!weekly?.length) return null;
    const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
    const max = weekly.reduce((a, b) => (a.count > b.count ? a : b));
    return days[max.day - 1];
  }, [weekly]);

  const totalHeatmapLogs = useMemo(
    () => heatmap.reduce((acc, curr) => acc + curr.count, 0),
    [heatmap],
  );
  const activeDays = useMemo(
    () => heatmap.filter((d) => d.count > 0).length,
    [heatmap],
  );

  if (!stats) return <StatisticsSkeleton />;

  const completionPct = stats.completionRate || 0;

  return (
    <div className="relative w-full space-y-8 overflow-hidden pb-6">
      <div className="pointer-events-none absolute -right-28 top-8 h-72 w-72 rounded-full bg-[#C8E6DF]/30 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 top-80 h-64 w-64 rounded-full bg-[#E9D7B8]/45 blur-3xl" />

      {/* ── HEADER ────────────────────────────────────── */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={0}
        className="relative z-10 flex items-end justify-between"
      >
        <div>
          <Eyebrow className="mb-4">Analytics</Eyebrow>
          <h1
            className="text-[clamp(44px,7vw,84px)] font-black leading-[0.88] tracking-[-0.07em] text-[#181714]"
            style={{ fontFamily: "Epilogue, sans-serif" }}
          >
            ritual
            <br />
            intelligence.
          </h1>
        </div>

        <div className="hidden items-center gap-2 rounded-full border border-[#E6DED1] bg-white/70 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-[#8B8477] shadow-sm backdrop-blur sm:flex">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#47655E]" />
          Live sync
        </div>
      </motion.div>

      {/* ── HERO CARD ─────────────────────────────────── */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={1}
        className="relative overflow-hidden rounded-[36px] border border-[#E6DED1] bg-[#FFFEFA] p-7 shadow-[0_30px_90px_-60px_rgba(24,23,20,0.7)] sm:p-10"
        style={{ fontFamily: "Epilogue, sans-serif" }}
      >
        {/* glows */}
        <motion.div
          animate={{ y: [0, -18, 0] }}
          transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
          className="pointer-events-none absolute -right-32 -top-32 h-[380px] w-[380px] rounded-full bg-[#47655E]/[0.12] blur-3xl"
        />
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-[#E9D7B8]/50 blur-3xl" />

        {/* subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right,currentColor 1px,transparent 1px),linear-gradient(to bottom,currentColor 1px,transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 flex flex-col gap-10 lg:flex-row lg:items-start">
          {/* left */}
          <div className="flex-1">
            <div className="mb-8 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#47655E]" />
              <Eyebrow>Today's Rhythm</Eyebrow>
            </div>

            <div className="mb-5 flex items-end gap-4">
              <span className="text-[92px] font-black leading-none tracking-[-0.08em] text-[#181714] sm:text-[124px]">
                {stats.completedToday}
              </span>
              <span className="pb-5 text-[30px] font-medium text-[#8B8477]/55">
                / {stats.totalHabits}
              </span>
            </div>

            <p
              className="mb-8 max-w-sm text-sm leading-[1.8] text-[#6F685D]"
              style={{ fontFamily: "Manrope, sans-serif" }}
            >
              Your consistency compounds daily. Every completed ritual
              strengthens your long-term rhythm and personal momentum.
            </p>

            <div className="flex flex-wrap gap-2.5">
              {["Flow Active", "Synced Analytics", "Streak Intact"].map((t) => (
                <span
                  key={t}
                  className="flex items-center gap-1.5 rounded-full border border-[#E6DED1] bg-[#F7F2EA] px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-[#756D61]"
                >
                  <span className="h-1 w-1 rounded-full bg-[#47655E]" />
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* right panel */}
          <div className="w-full shrink-0 rounded-[28px] border border-[#E6DED1] bg-[#F7F2EA] p-6 lg:w-[300px]">
            <div className="mb-8 flex h-24 items-end gap-2">
              {[38, 60, 52, 88, 58, 95, 72].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{
                    duration: 0.8,
                    delay: 0.3 + i * 0.06,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="flex-1 rounded-full bg-gradient-to-t from-[#47655E] to-[#C8E6DF]"
                />
              ))}
            </div>

            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
              {[
                { label: "Completion", value: `${completionPct}%`, big: true },
                {
                  label: "Best Streak",
                  value: streak.longestStreak || 0,
                  icon: Flame,
                  big: true,
                },
                { label: "Peak Day", value: bestDay || "N/A", icon: Zap },
                { label: "Momentum", value: "Growing", icon: TrendingUp },
              ].map(({ label, value, icon: Icon, big }) => (
                <div key={label}>
                  <Eyebrow className="mb-2">{label}</Eyebrow>
                  <div className="flex items-center gap-1.5">
                    {Icon && (
                      <Icon
                        size={13}
                        className="shrink-0 text-[#47655E]"
                      />
                    )}
                    <span
                      className={`font-bold leading-none text-[#181714] ${
                        big ? "text-[28px] tracking-[-0.04em]" : "text-sm"
                      }`}
                    >
                      {value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* progress bar */}
        <div className="relative z-10 mt-12">
          <div className="flex justify-between items-center mb-4">
            <Eyebrow>Daily Progress</Eyebrow>
            <span className="text-xs text-[#8B8477]">
              {stats.completedToday} rituals completed
            </span>
          </div>
          <div className="relative h-[6px] w-full overflow-hidden rounded-full bg-[#E6DED1]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completionPct}%` }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative h-full rounded-full bg-gradient-to-r from-[#47655E] via-[#6F8C72] to-[#C8E6DF]"
            >
              <motion.div
                animate={{ x: ["-100%", "300%"] }}
                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                className="absolute inset-y-0 w-16 bg-white/35 blur-md"
              />
            </motion.div>
          </div>
        </div>

        {/* footer cards */}
        <div className="relative z-10 mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            {
              eyebrow: "Longest Run",
              val: `${streak.longestStreak || 0}`,
              sub: "days consistency",
              icon: Flame,
            },
            {
              eyebrow: "Strongest Day",
              val: bestDay || "N/A",
              sub: "highest activity",
              icon: Zap,
            },
            {
              eyebrow: "Current Momentum",
              val: "Stable",
              sub: "rhythm improving",
              icon: TrendingUp,
            },
          ].map(({ eyebrow, val, sub, icon: Icon }) => (
            <div
              key={eyebrow}
              className="flex items-center gap-4 rounded-[22px] border border-[#E6DED1] bg-[#F7F2EA] p-5"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#47655E]/10">
                <Icon
                  size={17}
                  className="text-[#47655E]"
                />
              </div>
              <div>
                <Eyebrow className="mb-1.5">{eyebrow}</Eyebrow>
                <p className="text-base font-black leading-none tracking-[-0.03em] text-[#181714]">
                  {val}
                </p>
                <p className="mt-1 text-[11px] text-[#8B8477]">
                  {sub}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── STAT CARDS ────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { eyebrow: "Total Habits", val: stats.totalHabits, accent: false },
          {
            eyebrow: "Best Streak",
            val: streak.longestStreak || 0,
            accent: true,
            sub: "Consistency",
          },
          {
            eyebrow: "This Week",
            val: stats.completedToday || 0,
            accent: false,
            sub: "Completed",
          },
          {
            eyebrow: "Completion Rate",
            val: `${completionPct}%`,
            accent: false,
            sub: "Average",
          },
        ].map(({ eyebrow, val, accent, sub }, i) => (
          <motion.div
            key={eyebrow}
            variants={scaleIn}
            initial="hidden"
            animate="show"
            custom={i}
            className={`flex min-h-[128px] flex-col justify-between rounded-[24px] border p-6 shadow-[0_18px_60px_-48px_rgba(24,23,20,0.8)] ${
              accent
                ? "border-[#B9D9D1] bg-[#C8E6DF]"
                : "border-[#E6DED1] bg-[#FFFEFA]"
            }`}
          >
            <Eyebrow>{eyebrow}</Eyebrow>
            <div>
              <p
                className={`text-[38px] font-black leading-none tracking-[-0.05em] mt-3 ${
                  accent
                    ? "text-[#181714]"
                    : "text-[#181714]"
                }`}
                style={{ fontFamily: "Epilogue, sans-serif" }}
              >
                {val}
              </p>
              {sub && (
                <p
                  className={`mt-1.5 text-[11px] uppercase tracking-[0.15em] ${accent ? "text-[#181714]/70" : "text-[#8B8477]"}`}
                >
                  {sub}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── CHART + INSIGHTS ──────────────────────────── */}
      <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-3">
        {/* weekly chart */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={2}
          className="flex flex-col rounded-[28px] border border-[#E6DED1] bg-[#FFFEFA] p-7 shadow-[0_24px_80px_-58px_rgba(24,23,20,0.75)] sm:p-9 lg:col-span-2"
        >
          <div className="mb-10 flex items-start justify-between gap-4">
            <div>
              <Eyebrow className="mb-3">Weekly Flow</Eyebrow>
              <h2
                className="text-2xl font-black tracking-[-0.04em] text-[#181714]"
                style={{ fontFamily: "Epilogue, sans-serif" }}
              >
                Completion Activity
              </h2>
            </div>
            <span className="rounded-full bg-[#F7F2EA] px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-[#8B8477]">
              Last 7 days
            </span>
          </div>
          <div className="flex min-h-52 flex-1 flex-col justify-end sm:min-h-64">
            <WeeklyChart data={weekly} />
          </div>
        </motion.div>

        {/* insights */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={3}
          className="flex flex-col rounded-[28px] border border-[#E6DED1] bg-[#FFFEFA] p-7 shadow-[0_24px_80px_-58px_rgba(24,23,20,0.75)] sm:p-9"
        >
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-5">
              <Sparkles
                size={13}
                className="text-[#47655E]"
              />
              <Eyebrow>Insights</Eyebrow>
            </div>

            <h2
              className="mb-3 text-xl font-black leading-tight tracking-[-0.03em] text-[#181714]"
              style={{ fontFamily: "Epilogue, sans-serif" }}
            >
              {title}
            </h2>

            <p className="mb-8 text-xs uppercase leading-relaxed tracking-[0.12em] text-[#8B8477]">
              {description}
            </p>

            <div>
              <MiniMetric
                icon={Flame}
                label="Strongest day"
                value={bestDay || "N/A"}
              />
              <MiniMetric
                icon={Zap}
                label="Peak consistency"
                value="Evening"
                accent
              />
              <MiniMetric
                icon={TrendingUp}
                label="Rhythm score"
                value={`${completionPct}/100`}
                accent
              />
            </div>
          </div>

          <motion.div layout className="mt-8 flex flex-col gap-3">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowDetails(!showDetails)}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#181714] py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#FAFAF5] shadow-[0_18px_40px_-25px_rgba(24,23,20,0.9)] transition-colors hover:bg-[#32302A]"
            >
              {showDetails ? "Hide Details" : "Optimize Routine"}
              <ArrowUpRight size={13} />
            </motion.button>

            <AnimatePresence mode="wait">
              {showDetails && (
                <motion.div
                  layout
                  initial={{
                    opacity: 0,
                    height: 0,
                  }}
                  animate={{
                    opacity: 1,
                    height: "auto",
                  }}
                  exit={{
                    opacity: 0,
                    height: 0,
                  }}
                  transition={{
                    duration: 0.3,
                  }}
                  className="overflow-hidden"
                >
                  <div
                    className="
          rounded-[28px]

          border
          border-[#E6DED1]

          bg-[#F7F2EA]

          p-5

          space-y-4
        "
                  >
                    {[
                      {
                        icon: Sunrise,
                        label: "Morning",
                        val: timeStats.morning,
                      },

                      {
                        icon: Sun,
                        label: "Afternoon",
                        val: timeStats.afternoon,
                      },

                      {
                        icon: Moon,
                        label: "Evening",
                        val: timeStats.evening,
                      },
                    ].map(({ icon: Icon, label, val }) => (
                      <motion.div
                        key={label}
                        whileHover={{
                          x: 2,
                        }}
                        className="
              flex
              items-center
              justify-between

              rounded-2xl

              px-3
              py-3

              transition-all
              duration-300

              hover:bg-white
              hover:bg-white
            "
                      >
                        {/* LEFT */}

                        <div className="flex items-center gap-3">
                          <div
                            className="
                  flex
                  items-center
                  justify-center

                  w-10
                  h-10

                  rounded-2xl

                  bg-[#E6DED1]
                "
                          >
                            <Icon
                              size={18}
                              className="
                    text-[#47655E]
                  "
                            />
                          </div>

                          <div>
                            <p
                              className="
                    text-sm
                    font-semibold

                    text-[#181714]
                  "
                            >
                              {label}
                            </p>

                            <p
                              className="
                    text-[11px]

                    tracking-[0.18em]
                    uppercase

                    text-[#8B8477]
                  "
                            >
                              Peak Focus
                            </p>
                          </div>
                        </div>

                        {/* RIGHT */}

                        <div className="text-right">
                          <p
                            className="
                  text-base
                  font-bold

                  text-[#181714]
                "
                            style={{
                              fontFamily: "Epilogue, sans-serif",
                            }}
                          >
                            {val}
                          </p>

                          <p
                            className="
                  text-[10px]

                  uppercase
                  tracking-[0.18em]

                  text-[#8B8477]
                "
                          >
                            completion
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>

      {/* ── HEATMAP + STREAK ──────────────────────────── */}
      <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-2">
        {/* heatmap */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={4}
          className="rounded-[28px] border border-[#E6DED1] bg-[#FFFEFA] p-7 shadow-[0_24px_80px_-58px_rgba(24,23,20,0.75)] sm:p-9"
        >
          <div className="flex justify-between gap-8 max-sm:flex-col">
            <div className="flex flex-col gap-5 sm:max-w-52">
              <div>
                <Eyebrow className="mb-3">Consistency Map</Eyebrow>
                <h2
                  className="text-2xl font-black tracking-[-0.04em] text-[#181714]"
                  style={{ fontFamily: "Epilogue, sans-serif" }}
                >
                  Monthly Rhythm
                </h2>
              </div>

              <span className="text-[11px] uppercase tracking-[0.2em] text-[#8B8477]">
                {new Date().toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </span>

              <p className="text-xs leading-relaxed text-[#8B8477]">
                Track your daily habit completion intensity throughout the
                month.
              </p>

              <div className="h-px w-8 bg-[#E6DED1]" />

              <div className="flex gap-10">
                <div>
                  <p
                    className="text-2xl font-black tracking-[-0.04em] text-[#181714]"
                    style={{ fontFamily: "Epilogue, sans-serif" }}
                  >
                    {activeDays}
                  </p>
                  <Eyebrow className="mt-1.5">Active Days</Eyebrow>
                </div>
                <div>
                  <p
                    className="text-2xl font-black tracking-[-0.04em] text-[#181714]"
                    style={{ fontFamily: "Epilogue, sans-serif" }}
                  >
                    {totalHeatmapLogs}
                  </p>
                  <Eyebrow className="mt-1.5">Total Logs</Eyebrow>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-[0.15em] text-[#8B8477]">
                  Less
                </span>
                {[
                  "bg-[#E6DED1]",
                  "bg-[#C8E6DF]/40",
                  "bg-[#C8E6DF]",
                  "bg-[#47655E]/65",
                  "bg-[#47655E]",
                ].map((c, i) => (
                  <div key={i} className={`w-3 h-3 rounded-sm ${c}`} />
                ))}
                <span className="text-[10px] uppercase tracking-[0.15em] text-[#8B8477]">
                  More
                </span>
              </div>
            </div>

            <div className="flex flex-1 items-start max-sm:justify-center max-sm:overflow-x-auto sm:justify-end">
              <div className="min-w-fit">
                <Heatmap data={heatmap} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* streak panel */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={5}
          className="rounded-[28px] border border-[#E6DED1] bg-[#FFFEFA] p-7 shadow-[0_24px_80px_-58px_rgba(24,23,20,0.75)] sm:p-9"
        >
          <StreakPanel />
        </motion.div>
      </div>
    </div>
  );
}
