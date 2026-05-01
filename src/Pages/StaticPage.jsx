import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getDashboardStats,
  getWeeklyData,
  getLongestStreak,
  getHeatmapData,
} from "../api/dashboard-api";
import { getAllHabitLogs } from "../api/habits-api";
import StatCard from "../components/stats/StatCard";
import WeeklyChart from "../components/stats/WeeklyChart";
import Heatmap from "../components/stats/Heatmap";
import StreakPanel from "../components/stats/StreakPanel";
import { getTimeInsights } from "../lib/habit-utils";
import { StatisticsSkeleton } from "../components/loading/LoadingSkeletons";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08 },
  }),
};

export default function StatisticsPage() {
  const [stats, setStats] = useState(null);
  const [weekly, setWeekly] = useState([]);
  const [streak, setStreak] = useState({});
  const [heatmap, setHeatmap] = useState([]);
  const [logs, setLogs] = useState([]);
  const [view, setView] = useState("WEEKLY");
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

  if (!stats) {
    return <StatisticsSkeleton />;
  }

  return (
    <div className="w-full">
      {/* HEADER */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={0}
        className="flex justify-between mb-10"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-text-primary dark:text-white">
          curated rhythm
        </h1>
      </motion.div>

      {/* CARDS */}
      <div className="grid max-sm:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="TOTAL HABITS" value={stats.totalHabits} />
        <StatCard
          title="BEST STREAK"
          value={streak.longestStreak || 0}
          variant="dark"
        />
        <StatCard
          title="THIS WEEK"
          value={stats.completedToday || 0}
          variant="mint"
        />
        <StatCard
          title="COMPLETION RATE"
          value={`${stats.completionRate || 0}%`}
        />
      </div>

      {/* CHART + AI */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 items-stretch">
        {/* CHART */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1D1B20] b p-6 sm:p-8 rounded-xl max-sm:h-64 sm:h-80 flex flex-col justify-end">
          <WeeklyChart data={weekly} />
        </div>

        {/* AI CARD */}
        <div className="bg-[#F4F4EF] dark:bg-[#1D1B20] p-6 sm:p-8 rounded-xl min-h-80 flex flex-col">
          {/* TOP */}
          <div>
            <p className="text-xs mb-3 text-[#1A1A1A] dark:text-[#D0BCFF] tracking-widest">
              ✦ INSIGHTS
            </p>

            <h2 className="text-xl font-bold mb-3 text-[#1A1A1A] dark:text-[#E6E1E5]">
              {title}
            </h2>

            <p className="text-sm text-[#888888] dark:text-[#938F99] leading-relaxed uppercase">
              {description}
            </p>
          </div>

          {/* BOTTOM AREA */}
          <motion.div layout className="mt-auto flex flex-col gap-3">
            {/* BUTTON */}
            <motion.button
              layout
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              onClick={() => setShowDetails(!showDetails)}
              className="py-3 rounded-full bg-[#1A1A1A] dark:bg-[#D0BCFF] text-[#FAFAF5] dark:text-[#1A1A1A] text-xs font-semibold tracking-widest hover:bg-[#333333] dark:hover:bg-[#B69DF8] transition-colors duration-200"
            >
              {showDetails ? "HIDE DETAILS" : "OPTIMIZE ROUTINE"}
            </motion.button>

            {/* DETAILS */}
            <AnimatePresence mode="wait">
              {showDetails && (
                <motion.div
                  layout
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 rounded-xl bg-white dark:bg-[#1D1B20] border border-[#E8E4DC] dark:border-[#49454F] text-xs text-text-muted space-y-1">
                    <p>🌅 Morning: {timeStats.morning}</p>
                    <p>☀️ Afternoon: {timeStats.afternoon}</p>
                    <p>🌙 Evening: {timeStats.evening}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Heatmap */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={7}
          className="rounded-xl p-6 w-full h-full bg-white dark:bg-[#1D1B20] "
        >
          <div className="flex max-sm:flex-col justify-between gap-6">
            {/* LEFT SIDE (TEXT) */}
            <div className="flex flex-col gap-4 max-sm:w-full sm:max-w-60">
              {/* Title */}
              <h2 className="text-lg font-bold text-text-primary dark:text-white">
                Monthly Consistency
              </h2>

              {/* Month */}
              <span className="text-xs text-text-muted">April 2026</span>

              {/* Subtitle */}
              <p className="text-xs text-[#888888] dark:text-[#938F99] leading-relaxed">
                Track your daily habit completion intensity
              </p>

              {/* Divider */}
              <div className="w-10 h-px bg-[#E8E4DC] dark:bg-[#49454F]" />

              {/* Stats */}
              <div className="flex gap-6 text-xs">
                <div>
                  <p className="font-semibold text-text-primary">1</p>
                  <p className="text-text-muted">Days</p>
                </div>

                <div>
                  <p className="font-semibold text-text-primary">2</p>
                  <p className="text-text-muted">Logs</p>
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-2 text-[10px] text-text-muted">
                <span>LESS</span>

                {[
                  { light: "#E8E4DC", dark: "#2A2A2A" },
                  { light: "#CFCBC3", dark: "#4A4750" },
                  { light: "#A9A59D", dark: "#6B6673" },
                  { light: "#1A1A1A", dark: "#CDC0E9" },
                ].map((c, i) => (
                  <div
                    key={i}
                    className="w-3 h-3 rounded-sm"
                    style={{
                      background: document.documentElement.classList.contains(
                        "dark",
                      )
                        ? c.dark
                        : c.light,
                    }}
                  />
                ))}

                <span>MORE</span>
              </div>
            </div>

            {/* RIGHT SIDE (HEATMAP CENTERED ON MOBILE) */}
            <div className="flex-1 flex max-sm:justify-center sm:justify-end items-start max-sm:overflow-x-auto max-sm:-mx-6 max-sm:px-6 custom-scroll-x">
              <div className="min-w-fit">
                <Heatmap className="min-w-95" data={heatmap} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Streak Panel */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={8}
          className="w-full h-full rounded-xl p-6 bg-white dark:bg-[#1D1B20] "
        >
          <StreakPanel />
        </motion.div>
      </div>
    </div>
  );
}
