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
  Layers,
  Activity,
  Target,
  Timer,
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

/* ─── animation variants ───────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  show: (i = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.45, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] },
  }),
};

function BentoCard({ children, className = "", as = "div", ...props }) {
  const Tag = as === "section" ? motion.section : motion.div;
  return (
    <Tag
      variants={fadeUp}
      initial="hidden"
      animate="show"
      className={`app-surface rounded-[28px] p-6 sm:p-8 ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}

/* ─── page ─────────────────────────────────────────────────── */
export default function StatisticsPage() {
  const [stats, setStats] = useState(null);
  const [weekly, setWeekly] = useState([]);
  const [streak, setStreak] = useState({});
  const [heatmap, setHeatmap] = useState([]);
  const reduxHabits = useSelector((state) => state.habit.habits);
  const [logs, setLogs] = useState([]);
  const [habits, setHabits] = useState([]);
  const [showDetails, setShowDetails] = useState(false);

  // Journal states
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
        console.error("[StatisticsPage] Fetch error:", err);
      }
    };
    fetchAll();
  }, []);

  useEffect(() => {
    if (reduxHabits?.length) setHabits(reduxHabits);
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
            color: "#4B6B63",
            category: "Mindfulness",
          },
        };
      })
      .sort((a, b) => new Date(Number(b.date)) - new Date(Number(a.date)));
  }, [logs, habits]);

  const filteredJournalLogs = useMemo(() => {
    return journalLogs.filter((log) => {
      if (selectedHabitFilter !== "ALL" && log.habitId !== selectedHabitFilter) return false;
      if (selectedCategoryFilter !== "ALL" && log.habitDetails?.category !== selectedCategoryFilter) return false;
      if (journalSearch.trim() !== "") {
        const q = journalSearch.toLowerCase();
        return (
          log.note.toLowerCase().includes(q) ||
          log.habitDetails?.title?.toLowerCase().includes(q) ||
          log.habitDetails?.category?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [journalLogs, selectedHabitFilter, selectedCategoryFilter, journalSearch]);

  const visibleLogs = useMemo(() => filteredJournalLogs.slice(0, visibleCount), [filteredJournalLogs, visibleCount]);

  const bestDay = useMemo(() => {
    const result = getBestDay(weekly);
    return result?.shortLabel ?? null;
  }, [weekly]);

  const totalHeatmapLogs = useMemo(() => heatmap.reduce((acc, curr) => acc + curr.count, 0), [heatmap]);
  const activeDays = useMemo(() => heatmap.filter((d) => d.count > 0).length, [heatmap]);

  if (!stats) return <StatisticsSkeleton />;

  const completionPct = stats.completionRate || 0;

  return (
    <div className="relative w-full space-y-5 overflow-hidden pb-6">
      {/* Ambient glows */}
      <div className="pointer-events-none fixed -right-32 top-20 h-96 w-96 rounded-full bg-accent-mint/8 blur-3xl" />
      <div className="pointer-events-none fixed -left-32 top-1/3 h-80 w-80 rounded-full bg-accent-mint/5 blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── HEADER ────────────────────────────────────── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0}
          className="flex items-end justify-between mb-8"
        >
          <div>
            <p className="app-label mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-mint" />
              Analytics
            </p>
            <h1 className="font-heading text-[clamp(36px,5vw,64px)] font-black leading-[0.9] tracking-[-0.06em] text-text-primary">
              ritual
              <br />
              intelligence.
            </h1>
          </div>
          <div className="app-glass hidden items-center gap-2 rounded-full px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-text-muted shadow-sm sm:flex">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent-mint" />
            Live sync
          </div>
        </motion.div>

        {/* ── BENTO GRID ────────────────────────────────── */}

        {/* Section A: Hero + mini metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">
          {/* Hero card — spans 7 cols */}
          <BentoCard
            custom={1}
            className="relative overflow-hidden lg:col-span-7"
          >
            <motion.div
              animate={{ y: [0, -16, 0] }}
              transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
              className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-accent-mint/[0.07] blur-3xl"
            />
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none [background-image:linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] [background-size:32px_32px]" />

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6">
                <span className="h-2 w-2 rounded-full bg-accent-mint" />
                <p className="app-label">Today's Rhythm</p>
              </div>

              <div className="flex items-end gap-3 mb-2">
                <span className="font-heading text-[88px] sm:text-[112px] font-black leading-none tracking-[-0.08em] text-text-primary">
                  {stats.completedToday}
                </span>
                <span className="pb-4 text-2xl font-medium text-text-muted/50">
                  / {stats.totalHabits}
                </span>
              </div>

              <p className="max-w-md text-sm leading-relaxed text-text-muted mb-8">
                Your consistency compounds daily. Every completed ritual
                strengthens your long-term rhythm and personal momentum.
              </p>

              <div className="flex flex-wrap gap-2">
                {["Flow Active", "Synced", "Streak Intact"].map((t) => (
                  <span
                    key={t}
                    className="flex items-center gap-1.5 rounded-full border border-border-subtle bg-surface-dim px-3.5 py-1.5 text-[10px] uppercase tracking-[0.16em] text-text-muted"
                  >
                    <span className="h-1 w-1 rounded-full bg-accent-mint" />
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Progress bar */}
            <div className="relative z-10 mt-10">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <p className="app-label mb-1.5">Daily Progress</p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-heading text-3xl font-black leading-none tracking-[-0.04em] text-text-primary">
                      {completionPct}%
                    </span>
                    <span className="text-[11px] text-text-muted">
                      complete
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1.5 rounded-lg bg-accent-mint/10 px-3 py-1.5">
                    <span className="font-heading text-lg font-black leading-none tracking-[-0.03em] text-accent-mint">
                      {stats.completedToday}
                    </span>
                    <span className="text-[10px] text-text-muted">
                      / {stats.totalHabits}
                    </span>
                  </div>
                </div>
              </div>

              <div className="relative h-[10px] w-full overflow-hidden rounded-full bg-border-subtle/60">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${completionPct}%` }}
                  transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                  className="relative h-full rounded-full bg-gradient-to-r from-accent-mint via-accent-mint/80 to-accent-soft"
                >
                  <motion.div
                    animate={{ x: ["-100%", "300%"] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                    className="absolute inset-y-0 w-20 bg-white/30 blur-md"
                  />

                  {/* Leading glow dot */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="absolute -right-[2px] -top-[2px] h-[14px] w-[14px] rounded-full bg-accent-mint shadow-[0_0_10px_3px_rgba(75,107,99,0.4)]"
                  />
                </motion.div>
              </div>

              <div className="mt-3 flex justify-between text-[10px] text-text-muted/60">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          </BentoCard>

          {/* Mini metrics — spans 5 cols */}
          <div className="grid grid-cols-2 gap-5 lg:col-span-5">
            {[
              {
                label: "Completion",
                value: `${completionPct}%`,
                icon: Target,
                sub: "rate",
                accent: true,
              },
              {
                label: "Best Streak",
                value: streak.longestStreak || 0,
                icon: Flame,
                sub: "days",
                accent: false,
              },
              {
                label: "Peak Day",
                value: bestDay || "N/A",
                icon: Zap,
                sub: "highest activity",
                accent: false,
              },
              {
                label: "Total Habits",
                value: stats.totalHabits,
                icon: Layers,
                sub: "active",
                accent: false,
              },
            ].map(({ label, value, icon: Icon, sub, accent }, i) => (
              <motion.div
                key={label}
                variants={scaleIn}
                initial="hidden"
                animate="show"
                custom={i}
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
                className={`relative overflow-hidden rounded-[24px] border p-5 sm:p-6 transition-all duration-300 ${
                  accent
                    ? "border-accent-mint/20 bg-accent-mint/10"
                    : "app-surface"
                }`}
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="absolute -inset-4 pointer-events-none"
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-accent-mint/5 blur-[50px] rounded-full" />
                </motion.div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <p className="app-label">{label}</p>
                    <div className={`flex items-center justify-center w-8 h-8 rounded-xl ${accent ? "bg-accent-mint/15" : "bg-surface-dim"}`}>
                      <Icon size={14} className={accent ? "text-accent-mint" : "text-text-muted"} />
                    </div>
                  </div>
                  <p className="font-heading text-[32px] font-black leading-none tracking-[-0.05em] text-text-primary">
                    {value}
                  </p>
                  {sub && (
                    <p className="mt-1.5 text-[10px] uppercase tracking-[0.15em] text-text-muted">
                      {sub}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Section B: Chart + Insights + Footer metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">
          {/* Chart — spans 7 cols */}
          <BentoCard custom={5} className="lg:col-span-7 flex flex-col">
            <div className="flex items-start justify-between gap-4 mb-8">
              <div>
                <p className="app-label mb-2">Weekly Flow</p>
                <h2 className="font-heading text-xl font-black tracking-[-0.04em] text-text-primary">
                  Completion Activity
                </h2>
              </div>
              <span className="shrink-0 rounded-full bg-surface-dim px-3.5 py-1.5 text-[10px] uppercase tracking-[0.18em] text-text-muted">
                Last 7 days
              </span>
            </div>
            <div className="mt-auto flex min-h-52 flex-col justify-end sm:min-h-64">
              <WeeklyChart data={weekly} />
            </div>
          </BentoCard>

          {/* Insights + mini footer — spans 5 cols */}
          <BentoCard custom={6} className="lg:col-span-5 flex flex-col">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-5">
                <Sparkles size={13} className="text-accent-mint" />
                <p className="app-label">Insights</p>
              </div>

              <h3 className="font-heading mb-2 text-xl font-black leading-tight tracking-[-0.03em] text-text-primary">
                {title}
              </h3>

              <p className="mb-7 text-xs uppercase leading-relaxed tracking-[0.12em] text-text-muted">
                {description}
              </p>

              <div className="space-y-2">
                {[
                  { icon: Flame, label: "Strongest day", value: bestDay || "N/A" },
                  { icon: Zap, label: "Peak consistency", value: "Evening", accent: true },
                  { icon: TrendingUp, label: "Rhythm score", value: `${completionPct}/100`, accent: true },
                ].map(({ icon: Icon, label, value, accent }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between border-b border-border-subtle py-3 last:border-0"
                  >
                    <span className="flex items-center gap-2.5 text-xs text-text-muted">
                      <Icon size={13} />
                      {label}
                    </span>
                    <span className={`text-xs font-bold ${accent ? "text-accent-mint" : "text-text-primary"}`}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-auto pt-6 space-y-3">
              {/* Longest streak + Strongest day footer cards */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    label: "Longest Run",
                    val: `${streak.longestStreak || 0}`,
                    sub: "days consistency",
                    icon: Flame,
                  },
                  {
                    label: "Strongest Day",
                    val: bestDay || "N/A",
                    sub: "highest activity",
                    icon: Zap,
                  },
                ].map(({ label, val, sub, icon: Icon }) => (
                  <motion.div
                    key={label}
                    whileHover={{ y: -2, scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="relative group overflow-hidden rounded-2xl border border-border-subtle bg-surface-dim p-4 transition-all duration-300"
                  >
                    <div className="absolute -inset-2 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-full bg-accent-mint/5 blur-[50px] rounded-full" />
                    </div>
                    <div className="relative z-10 flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-mint/10">
                        <Icon size={15} className="text-accent-mint" />
                      </div>
                      <div>
                        <p className="app-label mb-0.5">{label}</p>
                        <p className="font-heading text-lg font-black leading-none tracking-[-0.03em] text-text-primary">
                          {val}
                        </p>
                        <p className="mt-0.5 text-[10px] text-text-muted">{sub}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowDetails(!showDetails)}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-primary text-background py-3 text-[10px] font-bold uppercase tracking-[0.2em] shadow-[0_12px_28px_-16px_rgba(26,26,26,0.7)] transition-colors hover:bg-primary-soft"
              >
                {showDetails ? "Hide Time Breakdown" : "View Time Breakdown"}
                <ArrowUpRight size={12} />
              </motion.button>

              <AnimatePresence>
                {showDetails && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="rounded-2xl border border-border-subtle bg-surface-dim p-4 space-y-3">
                      {[
                        { icon: Sunrise, label: "Morning", val: timeStats.morning },
                        { icon: Sun, label: "Afternoon", val: timeStats.afternoon },
                        { icon: Moon, label: "Evening", val: timeStats.evening },
                      ].map(({ icon: Icon, label, val }) => (
                        <motion.div
                          key={label}
                          whileHover={{ x: 2 }}
                          className="flex items-center justify-between rounded-xl px-3 py-2.5 transition-all duration-300 hover:bg-surface"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-border-subtle">
                              <Icon size={16} className="text-accent-mint" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-text-primary">{label}</p>
                              <p className="text-[10px] tracking-[0.18em] uppercase text-text-muted">Peak Focus</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-heading text-base font-bold text-text-primary">{val}</p>
                            <p className="text-[9px] uppercase tracking-[0.18em] text-text-muted">completed</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </BentoCard>
        </div>

        {/* Section C: Heatmap + Streaks */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">
          {/* Heatmap — spans 7 cols */}
          <BentoCard custom={9} className="lg:col-span-7">
            <div className="flex justify-between gap-6 max-sm:flex-col">
              <div className="flex flex-col gap-4 sm:max-w-48">
                <div>
                  <p className="app-label mb-2">Consistency Map</p>
                  <h2 className="font-heading text-xl font-black tracking-[-0.04em] text-text-primary">
                    Monthly Rhythm
                  </h2>
                </div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-text-muted">
                  {new Date().toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <p className="text-xs leading-relaxed text-text-muted">
                  Daily habit completion intensity throughout the month.
                </p>
                <div className="h-px w-8 bg-border-subtle" />
                <div className="flex gap-8">
                  <div>
                    <p className="font-heading text-2xl font-black tracking-[-0.04em] text-text-primary">
                      {activeDays}
                    </p>
                    <p className="app-label mt-1">Active Days</p>
                  </div>
                  <div>
                    <p className="font-heading text-2xl font-black tracking-[-0.04em] text-text-primary">
                      {totalHeatmapLogs}
                    </p>
                    <p className="app-label mt-1">Total Logs</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] uppercase tracking-[0.15em] text-text-muted">Less</span>
                  {["bg-border-subtle", "bg-accent-mint/20", "bg-accent-mint/40", "bg-accent-mint/70", "bg-accent-mint"].map((c, i) => (
                    <div key={i} className={`w-2.5 h-2.5 rounded-[3px] ${c}`} />
                  ))}
                  <span className="text-[9px] uppercase tracking-[0.15em] text-text-muted">More</span>
                </div>
              </div>
              <div className="flex flex-1 items-start max-sm:justify-center max-sm:overflow-x-auto sm:justify-end">
                <div className="min-w-fit">
                  <Heatmap data={heatmap} />
                </div>
              </div>
            </div>
          </BentoCard>

          {/* Streaks — spans 5 cols */}
          <BentoCard custom={10} className="lg:col-span-5">
            <StreakPanel />
          </BentoCard>
        </div>

        {/* ── RHYTHM JOURNAL ───────────────────────────── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={11}
          className="app-surface relative overflow-hidden rounded-[36px] p-6 sm:p-8"
        >
          <div className="pointer-events-none absolute -right-32 -bottom-32 h-80 w-80 rounded-full bg-accent-mint/5 blur-3xl" />
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none [background-image:linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] [background-size:30px_30px]" />

          <div className="relative z-10">
            {/* Header */}
            <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen size={13} className="text-accent-mint" />
                  <p className="app-label">The Written Record</p>
                </div>
                <h2 className="font-heading text-2xl sm:text-3xl font-black tracking-[-0.05em] text-text-primary">
                  rhythm journal.
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-text-muted">
                  Reflections captured when checking off your sacred rituals.
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-border-subtle bg-surface-dim px-4 py-2 text-[10px] uppercase tracking-[0.18em] text-text-muted">
                <span>{journalLogs.length} logged</span>
              </div>
            </div>

            {/* Filters */}
            <div className="mb-6 flex flex-col gap-4 border-b border-border-subtle pb-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input
                    type="text"
                    placeholder="Search reflections..."
                    value={journalSearch}
                    onChange={(e) => { setJournalSearch(e.target.value); setVisibleCount(6); }}
                    className="w-full rounded-full border border-border-subtle bg-surface-dim/40 py-3 pl-10 pr-4 text-xs text-text-primary placeholder:text-text-muted/60 transition-all focus:border-accent-mint focus:bg-surface focus:outline-none focus:ring-1 focus:ring-accent-mint"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <SlidersHorizontal size={12} className="text-text-muted" />
                  <select
                    value={selectedCategoryFilter}
                    onChange={(e) => { setSelectedCategoryFilter(e.target.value); setVisibleCount(6); }}
                    className="rounded-full border border-border-subtle bg-surface px-3.5 py-2 text-[10px] font-bold text-text-primary outline-none transition-all hover:bg-surface-dim cursor-pointer"
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

              {habits.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => { setSelectedHabitFilter("ALL"); setVisibleCount(6); }}
                    className={`rounded-full px-3.5 py-1.5 text-[9px] font-bold uppercase tracking-widest transition-all ${
                      selectedHabitFilter === "ALL"
                        ? "bg-primary text-background shadow-sm"
                        : "border border-border-subtle bg-surface text-text-muted hover:bg-surface-dim hover:text-text-primary"
                    }`}
                  >
                    All
                  </button>
                  {habits.filter((h) => journalLogs.some((l) => l.habitId === h._id)).map((h) => (
                    <button
                      key={h._id}
                      onClick={() => { setSelectedHabitFilter(h._id); setVisibleCount(6); }}
                      className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[9px] font-bold uppercase tracking-widest transition-all ${
                        selectedHabitFilter === h._id
                          ? "bg-primary text-background shadow-sm"
                          : "border border-border-subtle bg-surface text-text-muted hover:bg-surface-dim hover:text-text-primary"
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: h.color }} />
                      {h.title}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Cards */}
            <AnimatePresence mode="popLayout">
              {visibleLogs.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center rounded-[28px] border border-dashed border-border-subtle bg-surface-dim/30 p-10 text-center"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-mint/10">
                    <BookOpen size={22} className="text-accent-mint" />
                  </div>
                  <h3 className="font-heading text-base font-black tracking-tight text-text-primary">
                    The journal is blank
                  </h3>
                  <p className="mt-1.5 max-w-xs text-xs leading-relaxed text-text-muted">
                    {journalLogs.length === 0
                      ? "Record a note when checking off your rituals."
                      : "No reflections match your search."}
                  </p>
                </motion.div>
              ) : (
                <motion.div layout className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {visibleLogs.map((log) => {
                    const Icon = categoryMap[log.habitDetails?.category] || BookOpen;
                    const accentColor = log.habitDetails?.color || "#4B6B63";
                    const badgeTextColor = getTextColor(accentColor);

                    return (
                      <motion.div
                        layout
                        key={log._id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        whileHover={{ y: -4, scale: 1.01 }}
                        className="group relative overflow-hidden rounded-2xl border border-border-subtle bg-surface p-5 transition-shadow duration-300 hover:shadow-md"
                      >
                        <div className="absolute -inset-2 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-full bg-accent-mint/5 blur-[60px] rounded-full" />
                        </div>

                        <div className="relative z-10">
                          <div className="flex items-center justify-between border-b border-border-subtle/60 pb-2.5 mb-3.5">
                            <div className="flex items-center gap-2">
                              <div
                                className="flex h-6 w-6 items-center justify-center rounded-full"
                                style={{ backgroundColor: accentColor, color: badgeTextColor }}
                              >
                                <Icon size={11} />
                              </div>
                              <div>
                                <p className="text-[9px] font-bold uppercase tracking-widest text-text-primary truncate max-w-[120px]">
                                  {log.habitDetails?.title}
                                </p>
                                <p className="text-[8px] uppercase tracking-wider text-text-muted">
                                  {log.habitDetails?.category}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-1 text-[8px] uppercase tracking-wider text-text-muted">
                                <Calendar size={8} />
                                <span>
                                  {new Date(log.date).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </span>
                              </div>
                              {log.completedAt && (
                                <div className="flex items-center justify-end gap-1 text-[7px] uppercase tracking-wider text-text-muted/60 mt-0.5">
                                  <Clock size={7} />
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

                          <p
                            className="relative pl-3 text-sm font-medium italic leading-relaxed text-text-primary/70 group-hover:text-text-primary transition-colors"
                            style={{ borderLeft: `2px solid ${accentColor}` }}
                          >
                            &ldquo;{log.note}&rdquo;
                          </p>
                        </div>

                        <div className="relative z-10 mt-4 flex items-center justify-end text-[7px] font-bold tracking-widest text-text-muted/30 group-hover:text-accent-mint uppercase transition-colors">
                          Ritual Complete
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>

            {filteredJournalLogs.length > visibleCount && (
              <motion.div layout className="mt-8 flex justify-center">
                <motion.button
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setVisibleCount((prev) => prev + 6)}
                  className="flex items-center gap-2 rounded-full border border-border-subtle bg-surface px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-text-primary shadow-sm transition-all hover:bg-surface-dim"
                >
                  <span>Show More</span>
                  <ArrowUpRight size={12} className="text-text-muted" />
                </motion.button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
