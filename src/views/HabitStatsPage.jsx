"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Flame,
  Trophy,
  Timer,
  Percent,
  Calendar,
  BookOpen,
} from "lucide-react";

import { getHabits, getAllHabitLogs, getHabitStreak } from "../api/habits-api";
import Heatmap from "../components/stats/Heatmap";
import Sparkline from "../components/stats/Sparkline";
import TimeOfDayCard from "../components/stats/TimeOfDayCard";
import { categoryMap } from "../components/Habit/categoryMap";
import { Skeleton } from "../components/loading/LoadingSkeletons";

const DAY_MS = 86400000;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

function localMidnight(ts) {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

const CATEGORY_COLORS = {
  Health: "#C4696B",
  Fitness: "#5F8478",
  Learning: "#8B6F47",
  Productivity: "#4F6F64",
  Mindfulness: "#7B6B9E",
};

function bestStreakFrom(days) {
  const sorted = [...days].sort((a, b) => a - b);
  let best = 0;
  let run = 0;
  let prev = null;
  sorted.forEach((d) => {
    run = prev !== null && d === prev + 1 ? run + 1 : 1;
    best = Math.max(best, run);
    prev = d;
  });
  return best;
}

function KpiTile({ label, value, sub, icon: Icon, accent, i }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="show"
      custom={i + 1}
      whileHover={{ y: -4 }}
      className={`app-surface relative overflow-hidden rounded-[24px] p-5 sm:p-6 ${
        accent ? "border-accent-mint/20 bg-accent-mint/10" : ""
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <p className="app-label">{label}</p>
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-xl ${
            accent ? "bg-accent-mint/15" : "bg-surface-dim"
          }`}
        >
          <Icon
            size={14}
            className={accent ? "text-accent-mint" : "text-text-muted"}
          />
        </div>
      </div>
      <p className="font-heading text-[32px] font-black leading-none tracking-[-0.05em] text-text-primary">
        {value}
      </p>
      <p className="mt-1.5 text-[10px] uppercase tracking-[0.15em] text-text-muted">
        {sub}
      </p>
    </motion.div>
  );
}

export default function HabitStatsPage() {
  const { id } = useParams();
  const [habit, setHabit] = useState(null);
  const [allLogs, setAllLogs] = useState([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const [habitsRes, logsRes] = await Promise.all([
          getHabits(),
          getAllHabitLogs(),
        ]);
        const raw = habitsRes.data.data;
        const list = Array.isArray(raw) ? raw : (raw?.habits ?? []);
        const found = list.find((h) => h._id === id);
        if (!alive) return;
        if (!found) {
          setNotFound(true);
          setLoading(false);
          return;
        }
        setHabit(found);
        setAllLogs(logsRes.data.data?.logs || []);
        try {
          const streakRes = await getHabitStreak(id);
          if (alive) setCurrentStreak(streakRes.data.data?.currentStreak || 0);
        } catch {
          /* streak optional */
        }
      } catch (err) {
        console.error("[HabitStatsPage] load failed:", err);
        if (alive) setNotFound(true);
      } finally {
        if (alive) setLoading(false);
      }
    };
    load();
    return () => {
      alive = false;
    };
  }, [id]);

  const myLogs = useMemo(
    () =>
      (allLogs || []).filter((l) => {
        const ref =
          typeof l.habit === "object" && l.habit ? l.habit._id : l.habit;
        return ref === id;
      }),
    [allLogs, id],
  );

  const derived = useMemo(() => {
    const done = myLogs.filter((l) => l.completed !== false);
    const daySet = new Set();
    const weekday = Array(7).fill(0);
    const daily30 = [];
    myLogs.forEach((l) => {
      const t = Number(l.date);
      if (Number.isNaN(t)) return;
      daySet.add(localMidnight(t));
      if (l.completed !== false) {
        weekday[(new Date(t).getDay() + 6) % 7]++;
      }
    });
    const base = localMidnight(Date.now());
    for (let i = 29; i >= 0; i--) {
      const key = base - i * DAY_MS;
      let c = 0;
      myLogs.forEach((l) => {
        const t = Number(l.date);
        if (
          !Number.isNaN(t) &&
          localMidnight(t) === key &&
          l.completed !== false
        )
          c++;
      });
      daily30.push(c);
    }

    const heatMap = {};
    done.forEach((l) => {
      const d = new Date(Number(l.date));
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      heatMap[key] = (heatMap[key] || 0) + 1;
    });
    const heatmap = Object.entries(heatMap).map(([key, count]) => {
      const [y, m, d] = key.split("-").map(Number);
      return { _id: new Date(y, m, d).toISOString(), count };
    });

    const created = habit?.createdAt ? new Date(habit.createdAt) : null;
    const daysElapsed = created
      ? Math.max(1, Math.ceil((Date.now() - created.getTime()) / DAY_MS))
      : 1;
    const rate = Math.min(100, Math.round((done.length / daysElapsed) * 100));

    const notes = myLogs
      .filter((l) => l.note && l.note.trim())
      .sort((a, b) => Number(b.date) - Number(a.date))
      .slice(0, 5);

    return {
      total: done.length,
      best: bestStreakFrom(daySet),
      weekday,
      daily30,
      heatmap,
      rate,
      notes,
    };
  }, [myLogs, habit]);

  if (loading) {
    return (
      <div className="w-full min-w-0 space-y-5">
        <Skeleton className="h-24 w-full" />
        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          <Skeleton className="h-36" />
          <Skeleton className="h-36" />
          <Skeleton className="h-36" />
          <Skeleton className="h-36" />
        </div>
        <Skeleton className="h-72 w-full" />
      </div>
    );
  }

  if (notFound || !habit) {
    return (
      <div className="flex min-h-[60vh] w-full min-w-0 flex-col items-center justify-center gap-5 text-center">
        <p className="font-heading text-3xl font-black tracking-[-0.05em] text-text-primary">
          ritual not found.
        </p>
        <Link
          href="/statistics"
          className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest text-background"
        >
          <ArrowLeft size={14} />
          Back to statistics
        </Link>
      </div>
    );
  }

  const MetaIcon = categoryMap[habit.category] || Calendar;
  const metaColor = CATEGORY_COLORS[habit.category] || "#5F8478";

  return (
    <div className="w-full min-w-0">
      {/* Header */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="mb-5"
      >
        <div className="app-surface relative overflow-hidden rounded-[36px] p-6 sm:p-8">
          <div className="pointer-events-none absolute -right-32 -bottom-32 h-80 w-80 rounded-full bg-accent-mint/5 blur-3xl" />
          <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <Link
                href="/statistics"
                className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-border-subtle bg-surface-dim px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-widest text-text-muted transition-colors hover:border-accent-mint/40 hover:text-accent-mint"
              >
                <ArrowLeft size={12} />
                All statistics
              </Link>
              <div className="flex items-center gap-3">
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-2xl"
                  style={{
                    backgroundColor: `${metaColor}1f`,
                    color: metaColor,
                  }}
                >
                  <MetaIcon size={20} />
                </span>
                <div>
                  <p className="app-label mb-1">Habit Breakdown</p>
                  <h1 className="font-heading text-3xl sm:text-4xl font-black tracking-[-0.05em] text-text-primary">
                    {habit.title.toLowerCase()}.
                  </h1>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-border-subtle bg-surface-dim px-3.5 py-1.5 text-[10px] uppercase tracking-[0.16em] text-text-muted">
                {habit.frequency}
              </span>
              <span className="rounded-full border border-border-subtle bg-surface-dim px-3.5 py-1.5 text-[10px] uppercase tracking-[0.16em] text-text-muted">
                {habit.status || "active"}
              </span>
              <span
                className="rounded-full px-3.5 py-1.5 text-[10px] uppercase tracking-[0.16em]"
                style={{
                  backgroundColor: `${metaColor}1f`,
                  color: metaColor,
                }}
              >
                {habit.category}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* KPI tiles */}
      <div className="mb-5 grid grid-cols-2 gap-5 lg:grid-cols-4">
        <KpiTile
          i={0}
          label="Completions"
          value={derived.total}
          sub="all time"
          icon={Trophy}
          accent
        />
        <KpiTile
          i={1}
          label="Current Streak"
          value={currentStreak}
          sub="days running"
          icon={Flame}
        />
        <KpiTile
          i={2}
          label="Best Streak"
          value={derived.best}
          sub="days"
          icon={Timer}
        />
        <KpiTile
          i={3}
          label="Daily Rate"
          value={`${derived.rate}%`}
          sub="of days since start"
          icon={Percent}
        />
      </div>

      {/* Daily pulse + weekday */}
      <div className="mb-5 grid grid-cols-1 gap-5 lg:grid-cols-12">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={5}
          className="app-surface rounded-[28px] p-6 sm:p-8 lg:col-span-7"
        >
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="app-label mb-2">Daily Pulse</p>
              <h2 className="font-heading text-xl font-black tracking-[-0.04em] text-text-primary">
                last 30 days
              </h2>
            </div>
            <span className="rounded-full bg-surface-dim px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-text-muted">
              {derived.daily30.reduce((a, b) => a + b, 0)} done
            </span>
          </div>
          <div className="text-accent-mint">
            <Sparkline
              points={derived.daily30}
              variant="bars"
              delay={0.3}
              className="h-24"
            />
          </div>
          <div className="mt-3 flex justify-between text-[9px] font-bold tracking-wider text-text-muted">
            <span>30d ago</span>
            <span>today</span>
          </div>

          <div className="mt-7 grid grid-cols-7 gap-2">
            {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((d, i) => {
              const max = Math.max(...derived.weekday, 1);
              const pct = Math.max((derived.weekday[i] / max) * 100, 4);
              return (
                <div key={d} className="flex flex-col items-center gap-1.5">
                  <div className="flex h-20 w-full items-end justify-center rounded-lg bg-surface-dim/60 p-1">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${pct}%` }}
                      transition={{ delay: 0.4 + i * 0.05, duration: 0.5 }}
                      className="w-full rounded-md bg-accent-mint/70"
                    />
                  </div>
                  <span className="text-[8px] font-bold tracking-wider text-text-muted">
                    {d}
                  </span>
                  <span className="text-[9px] font-bold text-text-primary">
                    {derived.weekday[i]}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={6}
          className="app-surface rounded-[28px] p-6 sm:p-8 lg:col-span-5"
        >
          <TimeOfDayCard logs={myLogs} />
        </motion.div>
      </div>

      {/* Heatmap */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={7}
        className="app-surface mb-5 rounded-[28px] p-6 sm:p-8"
      >
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="app-label mb-2">Consistency</p>
            <h2 className="font-heading text-xl font-black tracking-[-0.04em] text-text-primary">
              activity map
            </h2>
          </div>
        </div>
        <div className="flex justify-center sm:justify-start">
          <Heatmap data={derived.heatmap} />
        </div>
      </motion.div>

      {/* Recent reflections */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={8}
        className="app-surface rounded-[28px] p-6 sm:p-8"
      >
        <div className="mb-6 flex items-center gap-3">
          <BookOpen size={16} className="text-accent-mint" />
          <div>
            <p className="app-label mb-1">Reflections</p>
            <h2 className="font-heading text-xl font-black tracking-[-0.04em] text-text-primary">
              recent notes
            </h2>
          </div>
        </div>
        {derived.notes.length === 0 ? (
          <p className="text-sm text-text-muted">
            No reflections logged for this ritual yet.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {derived.notes.map((n, i) => (
              <div
                key={i}
                className="rounded-2xl border border-border-subtle/60 bg-surface-dim/40 p-4"
              >
                <div className="mb-1.5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-text-muted">
                  <Calendar size={11} />
                  {new Date(Number(n.date)).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
                <p className="text-sm leading-relaxed text-text-primary">
                  {n.note}
                </p>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
