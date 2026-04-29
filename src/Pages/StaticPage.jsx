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

        // 🔥 logs ke liye temporary use
        setLogs(logsRes.data.data.logs || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAll();
  }, []);

  // 🔥 AI insights safe usage
  const { title, description, stats: timeStats } = getTimeInsights(logs || []);

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF5]">
        <p className="text-xs tracking-widest text-[#9A9A8A]">LOADING...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-8 py-10 bg-[#FAFAF5]">
      {/* HEADER */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={0}
        className="flex justify-between mb-10"
      >
        <h1 className="text-4xl font-bold">curated rhythm</h1>
      </motion.div>

      {/* CARDS */}
      <div className="grid grid-cols-4 gap-4 mb-8">
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
      <div className="grid grid-cols-3 gap-6 mb-6 items-stretch">
        {/* CHART */}
        <div className="col-span-2 bg-[#F0EDE5] p-8 rounded-4xl h-80 flex flex-col justify-end">
          <WeeklyChart data={weekly} />
        </div>

        {/* AI CARD */}

        <div className="bg-[#E8F0EE] p-8 rounded-4xl h-80 flex flex-col">
          {/* TOP */}
          <div>
            <p className="text-xs mb-3 text-[#4F6F64] tracking-widest">
              ✦ INSIGHTS
            </p>

            <h2 className="text-xl font-bold mb-3">{title}</h2>

            <p className="text-sm text-gray-600 leading-relaxed">
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
              className="py-3 rounded-full bg-[#4F6F64] text-white text-xs font-semibold tracking-widest"
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
                  <div className="p-4 rounded-xl bg-white text-xs text-gray-700 space-y-1">
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
        {/* 🔥 Heatmap */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={7}
          className="rounded-4xl p-6 w-full h-full"
          style={{ background: "#F0EDE5" }}
        >
          <div className="flex justify-between gap-6">
            {/* 🔥 LEFT SIDE (TEXT) */}
            <div className="flex flex-col gap-4 max-w-60">
              {/* Title */}
              <h2 className="text-lg font-bold text-[#1A1A1A]">
                Monthly Consistency
              </h2>

              {/* Month */}
              <span className="text-xs text-[#8A8A7A]">April 2026</span>

              {/* Subtitle */}
              <p className="text-xs text-[#9A9A8A] leading-relaxed">
                Track your daily habit completion intensity
              </p>

              {/* Divider */}
              <div className="w-10 h-px bg-[#D6D3CB]" />

              {/* Stats */}
              <div className="flex gap-6 text-xs">
                <div>
                  <p className="font-semibold text-[#1A1A1A]">1</p>
                  <p className="text-[#8A8A7A]">Days</p>
                </div>

                <div>
                  <p className="font-semibold text-[#1A1A1A]">2</p>
                  <p className="text-[#8A8A7A]">Logs</p>
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-2 text-[10px] text-[#9A9A8A]">
                <span>LESS</span>

                {["#E8E4DC", "#C8DAD6", "#8FA8A3", "#4F6F64"].map((c) => (
                  <div
                    key={c}
                    className="w-3 h-3 rounded-sm"
                    style={{ background: c }}
                  />
                ))}

                <span>MORE</span>
              </div>
            </div>

            {/* 🔥 RIGHT SIDE (HEATMAP TOP ALIGNED) */}
            <div className="flex-1 flex justify-end items-start">
              <Heatmap className="min-w-95" data={heatmap} />
            </div>
          </div>
        </motion.div>

        {/* 🔥 Streak Panel */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={8}
          className="w-full h-full rounded-4xl p-6"
          style={{ background: "#F0EDE5" }}
        >
          <StreakPanel />
        </motion.div>
      </div>
    </div>
  );
}
