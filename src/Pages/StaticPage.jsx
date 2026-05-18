import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, TrendingUp, Zap } from "lucide-react";

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
  hidden: {
    opacity: 0,
    y: 24,
  },

  show: (i = 0) => ({
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.5,
      delay: i * 0.08,
    },
  }),
};

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

    const days = [
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
      "SUNDAY",
    ];

    const max = weekly.reduce((a, b) => (a.count > b.count ? a : b));

    return days[max.day - 1];
  }, [weekly]);

  const totalHeatmapLogs = useMemo(() => {
    return heatmap.reduce((acc, curr) => acc + curr.count, 0);
  }, [heatmap]);

  const activeDays = useMemo(() => {
    return heatmap.filter((d) => d.count > 0).length;
  }, [heatmap]);

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
        className="flex justify-between items-center mb-10"
      >
        <div>
          <p className="text-xs tracking-[0.25em] text-[#888888] dark:text-[#938F99] mb-3">
            ANALYTICS
          </p>

          <h1 className="text-3xl sm:text-5xl font-black text-text-primary dark:text-white">
            curated rhythm
          </h1>
        </div>
      </motion.div>

      {/* TODAY RHYTHM */}

      <motion.div
        style={{
          fontFamily: "Epilogue, sans-serif",
        }}
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.45,
        }}
        className="
    relative
    overflow-hidden

    mb-8

    rounded-[36px]

    bg-[#1A1A1A]
    dark:bg-[#6750A4]

    p-6 sm:p-8 lg:p-10

    text-[#FAFAF5]

    shadow-[0_20px_80px_rgba(0,0,0,0.25)]
  "
      >
        {/* BACKGROUND GLOWS */}
        <div
          className="
      absolute
      -top-24
      -right-24

      w-72
      h-72

      rounded-full
      bg-white/10

      blur-3xl
    "
        />

        <div
          className="
      absolute
      bottom-0
      left-0

      w-full
      h-32

      bg-gradient-to-t
      from-black/10
      to-transparent
    "
        />

        {/* GRID TEXTURE */}
        <div
          className="
      absolute inset-0 opacity-[0.04]
      [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)]
      [background-size:32px_32px]
    "
        />

        <div className="relative z-10">
          {/* TOP */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-8">
            {/* LEFT */}
            <div>
              <p
                className="
            text-[11px]
            tracking-[0.35em]
            uppercase

            text-white/50
          "
                style={{
                  fontFamily: "Epilogue, sans-serif",
                }}
              >
                TODAY'S RHYTHM
              </p>

              <div className="mt-5 flex items-end gap-4">
                <h2
                  style={{
                    fontFamily: "Epilogue, sans-serif",
                  }}
                  className="
              text-4xl
              sm:text-6xl
              font-bold
              
              tracking-tight
              leading-none
            "
                >
                  {stats.completedToday}
                </h2>

                <div className="pb-2 text-white/40 text-xl font-medium">
                  / {stats.totalHabits}
                </div>
              </div>

              <p className="mt-3 text-sm text-white/60 max-w-xs leading-relaxed">
                You're building consistency one ritual at a time.
              </p>
            </div>

            {/* RIGHT */}
            <div
              className="
          self-start

          rounded-3xl
          bg-white/10
          backdrop-blur-xl

          px-5
          py-4

          border border-white/10
        "
            >
              <p className="text-xs uppercase tracking-[0.2em] text-white/50">
                Completion
              </p>

              <div className="mt-2 flex items-end gap-2">
                <h3 className="text-4xl font-bold leading-none">
                  {stats.completionRate || 0}
                </h3>

                <span className="text-lg text-white/60 mb-1">%</span>
              </div>
            </div>
          </div>

          {/* PROGRESS */}
          <div className="mt-10">
            <div className="flex justify-between text-[11px] uppercase tracking-[0.2em] text-white/40 mb-3">
              <span>Daily Progress</span>
              <span>{stats.completedToday} Completed</span>
            </div>

            <div className="relative w-full h-4 rounded-full bg-white/10 overflow-hidden">
              {/* glow */}
              <div className="absolute inset-y-0 left-0 w-40 bg-white/20 blur-2xl" />

              <motion.div
                initial={{
                  width: 0,
                }}
                animate={{
                  width: `${stats.completionRate || 0}%`,
                }}
                transition={{
                  duration: 1,
                  ease: "easeOut",
                }}
                className="
            relative
            h-full

            rounded-full

            bg-[#FAFAF5]
          "
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white blur-md opacity-70" />
              </motion.div>
            </div>
          </div>

          {/* FOOTER STATS */}
          <div className="mt-8 flex flex-wrap gap-3">
            <div
              className="
          px-4 py-3 rounded-2xl
          bg-white/10
          border border-white/10

          backdrop-blur-xl
        "
            >
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">
                Best Streak
              </p>

              <p className="flex gap-2 mt-1 text-sm font-semibold">
                <Flame size={17} /> {streak.longestStreak || 0} days
              </p>
            </div>

            <div
              className="
          px-4 py-3 rounded-2xl
          bg-white/10
          border border-white/10
          backdrop-blur-xl
        "
            >
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">
                Peak Day
              </p>

              <p className="flex gap-2 mt-1 text-sm font-semibold">
                <Zap size={17} />
                {bestDay || "N/A"}
              </p>
            </div>

            <div
              className="
          px-4 py-3 rounded-2xl
          bg-white/10
          border border-white/10
          backdrop-blur-xl
        "
            >
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">
                Momentum
              </p>

              <p className="flex gap-2 mt-1 text-sm font-semibold">
                {" "}
                <TrendingUp size={17} /> Growing steadily
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* STAT CARDS */}
      <div className="grid max-sm:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="TOTAL HABITS" value={stats.totalHabits} />

        <StatCard
          title="BEST STREAK"
          value={streak.longestStreak || 0}
          variant="dark"
          subtitle="CONSISTENCY"
        />

        <StatCard
          title="THIS WEEK"
          value={stats.completedToday || 0}
          variant="mint"
          subtitle="COMPLETED"
        />

        <StatCard
          title="COMPLETION RATE"
          value={`${stats.completionRate || 0}%`}
          subtitle="AVERAGE"
        />
      </div>

      {/* CHART + AI */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 items-stretch">
        {/* WEEKLY CHART */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={1}
          className="
            lg:col-span-2

            bg-white
            dark:bg-[#1D1B20]

            p-6 sm:p-8

            rounded-[28px]

            max-sm:h-72
            sm:h-96

            flex
            flex-col
            justify-between

            shadow-sm
          "
        >
          {/* TOP */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-xs tracking-[0.25em] text-[#888888] dark:text-[#938F99] mb-2">
                WEEKLY FLOW
              </p>

              <h2 className="text-2xl font-bold text-text-primary dark:text-white">
                Completion Activity
              </h2>
            </div>

            <div className="px-3 py-2 rounded-full bg-[#F4F4EF] dark:bg-[#2A2A2A] text-xs text-text-muted">
              LAST 7 DAYS
            </div>
          </div>

          {/* CHART */}
          <WeeklyChart data={weekly} />
        </motion.div>

        {/* INSIGHTS */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={2}
          className="
            bg-[#F4F4EF]
            dark:bg-[#1D1B20]

            p-6 sm:p-8

            rounded-[28px]

            min-h-96

            flex
            flex-col

            border
            border-[#E8E4DC]
            dark:border-[#2A2A2A]
          "
        >
          {/* TOP */}
          <div>
            <p className="text-xs mb-3 text-[#1A1A1A] dark:text-[#D0BCFF] tracking-[0.25em]">
              ✦ INSIGHTS
            </p>

            <h2 className="text-2xl font-bold mb-4 text-[#1A1A1A] dark:text-[#E6E1E5] leading-tight">
              {title}
            </h2>

            <p className="text-sm text-[#888888] dark:text-[#938F99] leading-relaxed uppercase">
              {description}
            </p>

            {/* EXTRA */}
            <div className="mt-6 flex flex-col gap-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex gap-1 text-text-muted">
                  <Flame size={16} /> Strongest day
                </span>

                <span className="font-semibold text-text-primary dark:text-white">
                  {bestDay || "N/A"}
                </span>
              </div>

              <div className="flex  items-center justify-between">
                <span className=" flex gap-1 text-text-muted">
                  <Zap size={16} /> Peak consistency
                </span>

                <span className="font-semibold text-text-primary dark:text-white">
                  Evening
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex gap-1 text-text-muted">
                  <TrendingUp size={16} /> Rhythm score
                </span>

                <span className="font-semibold text-text-primary dark:text-white">
                  {stats.completionRate || 0}/100
                </span>
              </div>
            </div>
          </div>

          {/* BOTTOM */}
          <motion.div layout className="mt-auto flex flex-col gap-3">
            {/* BUTTON */}
            <motion.button
              whileTap={{
                scale: 0.98,
              }}
              layout
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
              }}
              onClick={() => setShowDetails(!showDetails)}
              className="
                py-3
                rounded-full

                bg-[#1A1A1A]
                dark:bg-[#D0BCFF]

                text-[#FAFAF5]
                dark:text-[#1A1A1A]

                text-xs
                font-semibold
                tracking-[0.2em]

                hover:bg-[#333333]
                dark:hover:bg-[#B69DF8]

                transition-colors
                duration-200
              "
            >
              {showDetails ? "HIDE DETAILS" : "OPTIMIZE ROUTINE"}
            </motion.button>

            {/* DETAILS */}
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
                      p-4
                      rounded-2xl

                      bg-white
                      dark:bg-[#141218]

                      border
                      border-[#E8E4DC]
                      dark:border-[#2A2A2A]

                      text-xs

                      space-y-3
                    "
                  >
                    <div className="flex justify-between">
                      <span className="text-text-muted">🌅 Morning</span>

                      <span className="font-semibold text-text-primary dark:text-white">
                        {timeStats.morning}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-text-muted">☀️ Afternoon</span>

                      <span className="font-semibold text-text-primary dark:text-white">
                        {timeStats.afternoon}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-text-muted">🌙 Evening</span>

                      <span className="font-semibold text-text-primary dark:text-white">
                        {timeStats.evening}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>

      {/* BOTTOM GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* HEATMAP */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={3}
          className="
            rounded-[28px]
            p-6

            w-full
            h-full

            bg-white
            dark:bg-[#1D1B20]

            shadow-sm
          "
        >
          <div className="flex max-sm:flex-col justify-between gap-6">
            {/* LEFT */}
            <div className="flex flex-col gap-5 max-sm:w-full sm:max-w-60">
              <div>
                <p className="text-xs tracking-[0.25em] text-[#888888] dark:text-[#938F99] mb-2">
                  CONSISTENCY MAP
                </p>

                <h2 className="text-2xl font-bold text-text-primary dark:text-white">
                  Monthly Rhythm
                </h2>
              </div>

              <span className="text-xs text-text-muted">APRIL 2026</span>

              <p className="text-xs text-[#888888] dark:text-[#938F99] leading-relaxed">
                Track your daily habit completion intensity throughout the
                month.
              </p>

              <div className="w-10 h-px bg-[#E8E4DC] dark:bg-[#49454F]" />

              {/* STATS */}
              <div className="flex gap-8 text-xs">
                <div>
                  <p className="text-2xl font-bold text-text-primary dark:text-white">
                    {activeDays}
                  </p>

                  <p className="text-text-muted">ACTIVE DAYS</p>
                </div>

                <div>
                  <p className="text-2xl font-bold text-text-primary dark:text-white">
                    {totalHeatmapLogs}
                  </p>

                  <p className="text-text-muted">TOTAL LOGS</p>
                </div>
              </div>

              {/* LEGEND */}
              <div className="flex items-center gap-2 text-[10px] text-text-muted">
                <span>LESS</span>

                {[
                  {
                    light: "#E8E4DC",
                    dark: "#2A2A2A",
                  },

                  {
                    light: "#D6D1C7",
                    dark: "#3A3640",
                  },

                  {
                    light: "#BDB7AA",
                    dark: "#5A5363",
                  },

                  {
                    light: "#8C8478",
                    dark: "#7B7190",
                  },

                  {
                    light: "#1A1A1A",
                    dark: "#CDC0E9",
                  },
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

            {/* RIGHT */}
            <div className="flex-1 flex max-sm:justify-center sm:justify-end items-start max-sm:overflow-x-auto max-sm:-mx-6 max-sm:px-6 custom-scroll-x">
              <div className="min-w-fit">
                <Heatmap className="min-w-95" data={heatmap} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* STREAK PANEL */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={4}
          className="
            w-full
            h-full

            rounded-[28px]
            p-6

            bg-white
            dark:bg-[#1D1B20]

            shadow-sm
          "
        >
          <StreakPanel />
        </motion.div>
      </div>
    </div>
  );
}
