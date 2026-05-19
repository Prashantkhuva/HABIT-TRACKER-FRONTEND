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
      className={`text-[10px] tracking-[0.32em] uppercase text-[#888888] dark:text-[#938F99] ${className}`}
    >
      {children}
    </p>
  );
}

function MiniMetric({ icon: Icon, label, value, accent = false }) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-[#E8E4DC] dark:border-[#49454F] last:border-0">
      <span className="flex items-center gap-2.5 text-xs text-[#888888] dark:text-[#938F99]">
        <Icon size={13} />
        {label}
      </span>
      <span
        className={`text-xs font-bold ${accent ? "text-[#48645E] dark:text-[#D0BCFF]" : "text-[#1A1A1A] dark:text-[#E6E1E5]"}`}
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
    <div className="w-full space-y-10">
      {/* ── HEADER ────────────────────────────────────── */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={0}
        className="flex items-end justify-between"
      >
        <div>
          <Eyebrow className="mb-4">Analytics</Eyebrow>
          <h1
            className="text-[clamp(40px,6vw,72px)] font-black leading-[0.92] tracking-[-0.05em] text-[#1A1A1A] dark:text-[#E6E1E5]"
            style={{ fontFamily: "Epilogue, sans-serif" }}
          >
            curated{" "}
            <em className="not-italic text-[#48645E] dark:text-[#D0BCFF]">
              rhythm
            </em>
          </h1>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-[#1D1B20] border border-[#E8E4DC] dark:border-[#49454F] text-[11px] tracking-[0.2em] uppercase text-[#888888] dark:text-[#938F99]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#48645E] dark:bg-[#D0BCFF] animate-pulse" />
          Live sync
        </div>
      </motion.div>

      {/* ── HERO CARD ─────────────────────────────────── */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={1}
        className="relative overflow-hidden rounded-[32px] bg-white dark:bg-[#1D1B20] p-8 sm:p-12 border border-[#E8E4DC] dark:border-[#49454F]"
        style={{ fontFamily: "Epilogue, sans-serif" }}
      >
        {/* glows */}
        <motion.div
          animate={{ y: [0, -18, 0] }}
          transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
          className="absolute -top-32 -right-32 w-[380px] h-[380px] rounded-full bg-[#48645E]/[0.12] dark:bg-[#D0BCFF]/[0.12] blur-3xl pointer-events-none"
        />
        <div className="absolute -bottom-24 -left-16 w-64 h-64 rounded-full bg-[#C8E6DF]/[0.2] dark:bg-[#6750A4]/[0.16] blur-3xl pointer-events-none" />

        {/* subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right,currentColor 1px,transparent 1px),linear-gradient(to bottom,currentColor 1px,transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-start gap-12">
          {/* left */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#48645E] dark:bg-[#D0BCFF]" />
              <Eyebrow>Today's Rhythm</Eyebrow>
            </div>

            <div className="flex items-end gap-4 mb-5">
              <span className="text-[96px] sm:text-[120px] font-bold leading-none tracking-[-0.06em] text-[#1A1A1A] dark:text-[#E6E1E5]">
                {stats.completedToday}
              </span>
              <span className="text-[30px] font-medium text-[#888888]/50 dark:text-[#938F99]/50 pb-5">
                / {stats.totalHabits}
              </span>
            </div>

            <p
              className="text-sm text-[#888888] dark:text-[#938F99] max-w-sm leading-[1.8] mb-8"
              style={{ fontFamily: "Manrope, sans-serif" }}
            >
              Your consistency compounds daily. Every completed ritual
              strengthens your long-term rhythm and personal momentum.
            </p>

            <div className="flex flex-wrap gap-2.5">
              {["Flow Active", "Synced Analytics", "Streak Intact"].map((t) => (
                <span
                  key={t}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#F4F4EF] dark:bg-[#0F0D13] text-[11px] tracking-[0.18em] uppercase text-[#888888] dark:text-[#938F99]"
                >
                  <span className="w-1 h-1 rounded-full bg-[#48645E] dark:bg-[#D0BCFF]" />
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* right panel */}
          <div className="w-full lg:w-[280px] shrink-0 rounded-[24px] bg-[#F4F4EF] dark:bg-[#0F0D13] p-6">
            <div className="flex items-end gap-2 h-20 mb-8">
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
                  className="flex-1 rounded-full bg-gradient-to-t from-[#48645E] to-[#C8E6DF] dark:from-[#6750A4] dark:to-[#D0BCFF]"
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
                        className="text-[#48645E] dark:text-[#D0BCFF] shrink-0"
                      />
                    )}
                    <span
                      className={`font-bold text-[#1A1A1A] dark:text-[#E6E1E5] leading-none ${
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
            <span className="text-xs text-[#888888] dark:text-[#938F99]">
              {stats.completedToday} rituals completed
            </span>
          </div>
          <div className="relative h-[5px] w-full rounded-full bg-[#E8E4DC] dark:bg-[#49454F] overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completionPct}%` }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              className="h-full rounded-full bg-gradient-to-r from-[#48645E] via-[#617B6E] to-[#C8E6DF] dark:from-[#6750A4] dark:via-[#B69DF8] dark:to-[#D0BCFF] relative"
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
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">
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
              className="rounded-[20px] bg-[#F4F4EF] dark:bg-[#0F0D13] p-5 flex items-center gap-4"
            >
              <div className="w-11 h-11 rounded-2xl bg-[#48645E]/10 dark:bg-[#D0BCFF]/10 flex items-center justify-center shrink-0">
                <Icon
                  size={17}
                  className="text-[#48645E] dark:text-[#D0BCFF]"
                />
              </div>
              <div>
                <Eyebrow className="mb-1.5">{eyebrow}</Eyebrow>
                <p className="text-base font-black tracking-[-0.03em] text-[#1A1A1A] dark:text-[#E6E1E5] leading-none">
                  {val}
                </p>
                <p className="text-[11px] text-[#888888] dark:text-[#938F99] mt-1">
                  {sub}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── STAT CARDS ────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
            className={`rounded-[20px] p-6 flex flex-col justify-between min-h-[120px] ${
              accent
                ? "bg-[#C8E6DF] dark:bg-[#4D4465]"
                : "bg-white dark:bg-[#1D1B20]"
            }`}
          >
            <Eyebrow>{eyebrow}</Eyebrow>
            <div>
              <p
                className={`text-[38px] font-black leading-none tracking-[-0.05em] mt-3 ${
                  accent
                    ? "text-[#1A1A1A] dark:text-[#E6E1E5]"
                    : "text-[#1A1A1A] dark:text-[#E6E1E5]"
                }`}
                style={{ fontFamily: "Epilogue, sans-serif" }}
              >
                {val}
              </p>
              {sub && (
                <p
                  className={`text-[11px] uppercase tracking-[0.15em] mt-1.5 ${accent ? "text-[#1A1A1A]/70 dark:text-[#E6E1E5]/70" : "text-[#888888] dark:text-[#938F99]"}`}
                >
                  {sub}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── CHART + INSIGHTS ──────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* weekly chart */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={2}
          className="lg:col-span-2 bg-white dark:bg-[#1D1B20] rounded-[24px] p-8 sm:p-10 flex flex-col border border-[#E8E4DC] dark:border-[#49454F]"
        >
          <div className="flex justify-between items-start mb-10">
            <div>
              <Eyebrow className="mb-3">Weekly Flow</Eyebrow>
              <h2
                className="text-2xl font-black tracking-[-0.04em] text-[#1A1A1A] dark:text-[#E6E1E5]"
                style={{ fontFamily: "Epilogue, sans-serif" }}
              >
                Completion Activity
              </h2>
            </div>
            <span className="text-[11px] uppercase tracking-[0.18em] px-4 py-2 rounded-full bg-[#F4F4EF] dark:bg-[#0F0D13] text-[#888888] dark:text-[#938F99]">
              Last 7 days
            </span>
          </div>
          <div className="flex-1 flex flex-col justify-end min-h-52 sm:min-h-64">
            <WeeklyChart data={weekly} />
          </div>
        </motion.div>

        {/* insights */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={3}
          className="bg-white dark:bg-[#1D1B20] rounded-[24px] p-8 sm:p-10 flex flex-col border border-[#E8E4DC] dark:border-[#49454F]"
        >
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-5">
              <Sparkles
                size={13}
                className="text-[#48645E] dark:text-[#D0BCFF]"
              />
              <Eyebrow>Insights</Eyebrow>
            </div>

            <h2
              className="text-xl font-black tracking-[-0.03em] text-[#1A1A1A] dark:text-[#E6E1E5] leading-tight mb-3"
              style={{ fontFamily: "Epilogue, sans-serif" }}
            >
              {title}
            </h2>

            <p className="text-xs text-[#888888] dark:text-[#938F99] uppercase tracking-[0.12em] leading-relaxed mb-8">
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
              className="w-full py-3.5 rounded-full bg-[#1A1A1A] dark:bg-[#D0BCFF] text-[#FAFAF5] dark:text-[#1A1A1A] text-[11px] font-bold tracking-[0.2em] uppercase hover:opacity-85 transition-colors flex items-center justify-center gap-2"
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
          border-[#ECE7F3]
          dark:border-[#2B2436]

          bg-[#F8F8F6]
          dark:bg-[#141218]

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
              dark:hover:bg-[#1D1B20]
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

                  bg-[#E8E4DC]
                  dark:bg-[#2A2A2A]
                "
                          >
                            <Icon
                              size={18}
                              className="
                    text-[#1A1A1A]
                    dark:text-[#D0BCFF]
                  "
                            />
                          </div>

                          <div>
                            <p
                              className="
                    text-sm
                    font-semibold

                    text-[#1A1A1A]
                    dark:text-[#E6E1E5]
                  "
                            >
                              {label}
                            </p>

                            <p
                              className="
                    text-[11px]

                    tracking-[0.18em]
                    uppercase

                    text-[#888888]
                    dark:text-[#938F99]
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

                  text-[#1A1A1A]
                  dark:text-[#FAFAF5]
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

                  text-[#888888]
                  dark:text-[#938F99]
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 items-stretch">
        {/* heatmap */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={4}
          className="bg-white dark:bg-[#1D1B20] rounded-[24px] p-8 sm:p-10 border border-[#E8E4DC] dark:border-[#49454F]"
        >
          <div className="flex max-sm:flex-col justify-between gap-8">
            <div className="flex flex-col gap-5 sm:max-w-52">
              <div>
                <Eyebrow className="mb-3">Consistency Map</Eyebrow>
                <h2
                  className="text-2xl font-black tracking-[-0.04em] text-[#1A1A1A] dark:text-[#E6E1E5]"
                  style={{ fontFamily: "Epilogue, sans-serif" }}
                >
                  Monthly Rhythm
                </h2>
              </div>

              <span className="text-[11px] uppercase tracking-[0.2em] text-[#888888] dark:text-[#938F99]">
                {new Date().toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </span>

              <p className="text-xs text-[#888888] dark:text-[#938F99] leading-relaxed">
                Track your daily habit completion intensity throughout the
                month.
              </p>

              <div className="w-8 h-px bg-[#E8E4DC] dark:bg-[#49454F]" />

              <div className="flex gap-10">
                <div>
                  <p
                    className="text-2xl font-black tracking-[-0.04em] text-[#1A1A1A] dark:text-[#E6E1E5]"
                    style={{ fontFamily: "Epilogue, sans-serif" }}
                  >
                    {activeDays}
                  </p>
                  <Eyebrow className="mt-1.5">Active Days</Eyebrow>
                </div>
                <div>
                  <p
                    className="text-2xl font-black tracking-[-0.04em] text-[#1A1A1A] dark:text-[#E6E1E5]"
                    style={{ fontFamily: "Epilogue, sans-serif" }}
                  >
                    {totalHeatmapLogs}
                  </p>
                  <Eyebrow className="mt-1.5">Total Logs</Eyebrow>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[#888888] dark:text-[#938F99] uppercase tracking-[0.15em]">
                  Less
                </span>
                {[
                  "bg-[#E8E4DC] dark:bg-[#2A2A2A]",
                  "bg-[#C8E6DF]/40 dark:bg-[#D0BCFF]/20",
                  "bg-[#C8E6DF] dark:bg-[#D0BCFF]/40",
                  "bg-[#48645E]/65 dark:bg-[#D0BCFF]/65",
                  "bg-[#48645E] dark:bg-[#D0BCFF]",
                ].map((c, i) => (
                  <div key={i} className={`w-3 h-3 rounded-sm ${c}`} />
                ))}
                <span className="text-[10px] text-[#888888] dark:text-[#938F99] uppercase tracking-[0.15em]">
                  More
                </span>
              </div>
            </div>

            <div className="flex-1 flex max-sm:justify-center sm:justify-end items-start max-sm:overflow-x-auto">
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
          className="bg-white dark:bg-[#1D1B20] rounded-[24px] p-8 sm:p-10 border border-[#E8E4DC] dark:border-[#49454F]"
        >
          <StreakPanel />
        </motion.div>
      </div>
    </div>
  );
}
