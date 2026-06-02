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
  Search,
  SlidersHorizontal,
  BookOpen,
  Calendar,
  Clock,
} from "lucide-react";

import {
  getDashboardStats,
  getWeeklyData,
  getLongestStreak,
  getHeatmapData,
} from "../api/dashboard-api";
import { getAllHabitLogs } from "../api/habits-api";

import { useSelector } from "react-redux";
import WeeklyChart from "../components/stats/WeeklyChart";
import Heatmap from "../components/stats/Heatmap";
import StreakPanel from "../components/stats/StreakPanel";
import { categoryMap } from "../components/Habit/categoryMap";
import { getTimeInsights, getTextColor, getBestDay } from "../lib/habit-utils";
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
  const reduxHabits = useSelector((state) => state.habit.habits);
  const [logs, setLogs] = useState([]);
  const [habits, setHabits] = useState([]);
  const [showDetails, setShowDetails] = useState(false);

  // Journal States
  const [journalSearch, setJournalSearch] = useState("");
  const [selectedHabitFilter, setSelectedHabitFilter] = useState("ALL");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("ALL");
  const [visibleCount, setVisibleCount] = useState(6);

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

  useEffect(() => {
    if (reduxHabits?.length) {
      setHabits(reduxHabits);
    }
  }, [reduxHabits]);

  const { title, description, stats: timeStats } = getTimeInsights(logs || []);

  const resolveHabitId = (habitRef) =>
    typeof habitRef === "object" && habitRef !== null ? habitRef._id : habitRef;

  const journalLogs = useMemo(() => {
    const noteLogs = logs.filter(
      (log) => log.completed && log.note && log.note.trim() !== "",
    );

    return noteLogs
      .map((log) => {
        const habitId = resolveHabitId(log.habit);
        const habitDetails = habits.find((h) => h._id === habitId);
        return {
          ...log,
          habitId,
          habitDetails: habitDetails || {
            title: "Unknown Ritual",
            color: "#8B8477",
            category: "Mindfulness",
          },
        };
      })
      .sort((a, b) => new Date(Number(b.date)) - new Date(Number(a.date)));
  }, [logs, habits]);

  const filteredJournalLogs = useMemo(() => {
    return journalLogs.filter((log) => {
      // Habit ID filter
      if (selectedHabitFilter !== "ALL" && log.habitId !== selectedHabitFilter) {
        return false;
      }
      // Category filter
      if (
        selectedCategoryFilter !== "ALL" &&
        log.habitDetails?.category !== selectedCategoryFilter
      ) {
        return false;
      }
      // Search filter
      if (journalSearch.trim() !== "") {
        const query = journalSearch.toLowerCase();
        const noteMatch = log.note.toLowerCase().includes(query);
        const titleMatch = log.habitDetails?.title?.toLowerCase().includes(query);
        const categoryMatch = log.habitDetails?.category?.toLowerCase().includes(query);
        return noteMatch || titleMatch || categoryMatch;
      }
      return true;
    });
  }, [journalLogs, selectedHabitFilter, selectedCategoryFilter, journalSearch]);

  const visibleLogs = useMemo(() => {
    return filteredJournalLogs.slice(0, visibleCount);
  }, [filteredJournalLogs, visibleCount]);

  const bestDay = useMemo(() => {
    const result = getBestDay(weekly);
    return result?.shortLabel ?? null;
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

      {/* ── RHYTHM JOURNAL (DAILY REFLECTIONS) ────────── */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={6}
        className="relative overflow-hidden rounded-[36px] border border-[#E6DED1] bg-[#FFFEFA] p-7 shadow-[0_30px_90px_-60px_rgba(24,23,20,0.7)] sm:p-10"
        style={{ fontFamily: "Epilogue, sans-serif" }}
      >
        {/* Decorative elements */}
        <div className="pointer-events-none absolute -right-32 -bottom-32 h-80 w-80 rounded-full bg-[#E9D7B8]/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 top-20 h-64 w-64 rounded-full bg-[#47655E]/[0.05] blur-3xl" />
        
        {/* Subtle broadsheet pattern grid */}
        <div
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right,currentColor 1px,transparent 1px),linear-gradient(to bottom,currentColor 1px,transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />

        <div className="relative z-10">
          {/* Header */}
          <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <BookOpen size={13} className="text-[#47655E]" />
                <Eyebrow>VOLUME 01 — THE WRITTEN RECORD</Eyebrow>
              </div>
              <h2
                className="text-3xl font-black tracking-[-0.05em] text-[#181714] sm:text-4xl"
                style={{ fontFamily: "Epilogue, sans-serif" }}
              >
                rhythm journal.
              </h2>
              <p 
                className="mt-2 max-w-xl text-sm leading-relaxed text-[#6F685D]"
                style={{ fontFamily: "Manrope, sans-serif" }}
              >
                An archive of your thoughts, breakthroughs, and daily reflections captured when checking off your sacred rituals.
              </p>
            </div>
            
            <div className="flex items-center gap-2 rounded-full border border-[#E6DED1] bg-[#F7F2EA] px-4 py-2 text-[10px] uppercase tracking-[0.18em] text-[#8B8477]">
              <span>{journalLogs.length} Reflections logged</span>
            </div>
          </div>

          {/* Search & Filters Controls */}
          <div className="mb-8 flex flex-col gap-4 border-b border-[#E6DED1] pb-8">
            {/* Search and Category filters */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B8477]" />
                <input
                  type="text"
                  placeholder="Search your daily thoughts..."
                  value={journalSearch}
                  onChange={(e) => {
                    setJournalSearch(e.target.value);
                    setVisibleCount(6); // reset pagination when searching
                  }}
                  className="w-full rounded-full border border-[#E6DED1] bg-[#F7F2EA]/40 py-3.5 pl-11 pr-5 text-xs text-[#181714] placeholder-[#8B8477]/70 transition-all focus:border-[#47655E] focus:bg-[#FFFEFA] focus:outline-none focus:ring-1 focus:ring-[#47655E]"
                  style={{ fontFamily: "Manrope, sans-serif" }}
                />
              </div>

              {/* Category Filter Dropdown */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <SlidersHorizontal size={13} className="text-[#8B8477]" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B8477] mr-1" style={{ fontFamily: "Manrope, sans-serif" }}>Category:</span>
                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => {
                    setSelectedCategoryFilter(e.target.value);
                    setVisibleCount(6); // reset pagination
                  }}
                  className="rounded-full border border-[#E6DED1] bg-[#FFFEFA] px-4 py-2.5 text-xs font-bold text-[#181714] outline-none transition-all hover:bg-[#F7F2EA] cursor-pointer"
                  style={{ fontFamily: "Manrope, sans-serif" }}
                >
                  <option value="ALL">All Categories</option>
                  <option value="Health">Health</option>
                  <option value="Fitness">Fitness</option>
                  <option value="Learning">Learning</option>
                  <option value="Productivity">Productivity</option>
                  <option value="Mindfulness">Mindfulness</option>
                </select>
              </div>
            </div>

            {/* Habit Filter Pills */}
            {habits.length > 0 && (
              <div className="flex flex-col gap-2 mt-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B8477]" style={{ fontFamily: "Manrope, sans-serif" }}>Filter by ritual:</span>
                <div className="flex flex-wrap gap-2 py-1 max-h-24 overflow-y-auto pr-2 custom-scroll">
                  <button
                    onClick={() => {
                      setSelectedHabitFilter("ALL");
                      setVisibleCount(6);
                    }}
                    className={`rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all ${
                      selectedHabitFilter === "ALL"
                        ? "bg-[#181714] text-[#FAFAF5] shadow-sm"
                        : "border border-[#E6DED1] bg-[#FFFEFA] text-[#8B8477] hover:bg-[#F7F2EA] hover:text-[#181714]"
                    }`}
                  >
                    All Rituals
                  </button>
                  {habits.map((h) => {
                    const hasNotes = journalLogs.some((l) => l.habitId === h._id);
                    if (!hasNotes) return null; // Only show habits that have notes to keep pills clean
                    return (
                      <button
                        key={h._id}
                        onClick={() => {
                          setSelectedHabitFilter(h._id);
                          setVisibleCount(6);
                        }}
                        className={`flex items-center gap-2 rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all ${
                          selectedHabitFilter === h._id
                            ? "bg-[#181714] text-[#FAFAF5] shadow-sm"
                            : "border border-[#E6DED1] bg-[#FFFEFA] text-[#8B8477] hover:bg-[#F7F2EA] hover:text-[#181714]"
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: h.color }} />
                        {h.title}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Reflections Grid */}
          <AnimatePresence mode="popLayout">
            {visibleLogs.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center justify-center rounded-[28px] border border-dashed border-[#D6D1C7] bg-[#F7F2EA]/40 p-12 text-center"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#47655E]/10">
                  <BookOpen size={24} className="text-[#47655E]" />
                </div>
                <h3 className="text-lg font-black tracking-tight text-[#181714]">The journal is currently blank</h3>
                <p 
                  className="mt-2 max-w-sm text-xs leading-relaxed text-[#8B8477]"
                  style={{ fontFamily: "Manrope, sans-serif" }}
                >
                  {journalLogs.length === 0
                    ? "Record a note when checking off your rituals to begin your written archive."
                    : "No reflections match your search or filters. Try adjusting your criteria."}
                </p>
              </motion.div>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
              >
                {visibleLogs.map((log) => {
                  const Icon = categoryMap[log.habitDetails?.category] || BookOpen;
                  const borderAccentColor = log.habitDetails?.color || "#47655E";
                  const badgeTextColor = getTextColor(borderAccentColor);

                  return (
                    <motion.div
                      layout
                      key={log._id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      whileHover={{ y: -4, shadow: "0 20px 40px -25px rgba(24,23,20,0.15)" }}
                      className="group flex flex-col justify-between rounded-[24px] border border-[#E6DED1] bg-[#FFFEFA] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-shadow duration-300"
                    >
                      <div>
                        {/* Card Header metadata */}
                        <div className="flex items-center justify-between border-b border-[#E6DED1]/60 pb-3 mb-4">
                          <div className="flex items-center gap-2">
                            <div
                              className="flex h-7 w-7 items-center justify-center rounded-full"
                              style={{
                                backgroundColor: borderAccentColor,
                                color: badgeTextColor,
                              }}
                            >
                              <Icon size={12} />
                            </div>
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-widest text-[#181714] truncate max-w-[130px]">
                                {log.habitDetails?.title}
                              </p>
                              <p className="text-[9px] uppercase tracking-wider text-[#8B8477]">
                                {log.habitDetails?.category}
                              </p>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="flex items-center gap-1 text-[9px] uppercase tracking-wider text-[#8B8477]">
                              <Calendar size={9} />
                              <span>
                                {new Date(log.date).toLocaleDateString("en-US", {
                                  month: "long",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </span>
                            </div>
                            {log.completedAt && (
                              <div className="flex items-center justify-end gap-1 text-[8px] uppercase tracking-wider text-[#8B8477]/70 mt-0.5">
                                <Clock size={8} />
                                <span>
                                  {new Date(log.completedAt).toLocaleTimeString("en-US", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Note Content */}
                        <p
                          className="relative pl-4 text-sm font-medium italic leading-relaxed text-[#181714]/80 group-hover:text-[#181714] transition-colors"
                          style={{
                            fontFamily: "Epilogue, sans-serif",
                            borderLeft: `3px solid ${borderAccentColor}`,
                          }}
                        >
                          “ {log.note} ”
                        </p>
                      </div>
                      
                      {/* Card Footer detail */}
                      <div className="mt-6 flex items-center justify-end text-[8px] font-bold tracking-widest text-[#8B8477]/40 group-hover:text-[#47655E] uppercase transition-colors">
                        <span>Ritual Complete</span>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Reveal More / Load More Button */}
          {filteredJournalLogs.length > visibleCount && (
            <motion.div 
              layout
              className="mt-12 flex justify-center"
            >
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setVisibleCount((prev) => prev + 6)}
                className="flex items-center gap-2 rounded-full border border-[#E6DED1] bg-[#FFFEFA] px-6 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#181714] shadow-sm transition-colors hover:bg-[#F7F2EA]"
              >
                <span>Reveal More Pages</span>
                <ArrowUpRight size={13} className="text-[#8B8477]" />
              </motion.button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
