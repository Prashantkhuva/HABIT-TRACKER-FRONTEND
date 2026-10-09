"use client";

import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Target,
  Search,
  Trophy,
  Sprout,
  Star,
  Flame,
  Gem,
  BookOpen,
  Award,
  Crown,
  CheckCircle2,
  ChevronRight,
  Zap,
} from "lucide-react";
import {
  getHabits,
  createHabit,
  completeHabit,
  getHabitLogs,
} from "../api/habits-api";
import {
  getDashboardStats,
  getWeeklyData,
  getLongestStreak,
} from "../api/dashboard-api";
import { setReduxHabits, addReduxHabit } from "../store/habitSlice";
import HabitCard from "./Habit/HabitCard";
import CompletedHabit from "./Habit/CompletedHabit";
import Button from "./Button";
import { useToast } from "./Toast/ToastProvider";
import { DashboardSkeleton } from "./loading/LoadingSkeletons";
import ReflectionModal from "./Habit/ReflectionModal";
import { isLogFromToday } from "../lib/habit-utils";
import { fireConfetti } from "../lib/confetti";
import { getAchievements } from "../lib/achievements";
import OnboardingGuide from "./OnboardingGuide";
import KpiRow from "./stats/KpiRow";
import WeeklyChart from "./stats/WeeklyChart";
import SemicircleGauge from "./stats/SemicircleGauge";
import { categoryMap } from "./Habit/categoryMap";

const TEMPLATES = [
  {
    title: "Morning Meditation",
    category: "Mindfulness",
    color: "#4F6F64",
    description: "Start your day with calm",
  },
  {
    title: "Read 10 Pages",
    category: "Learning",
    color: "#8B7E74",
    description: "Daily reading habit",
  },
  {
    title: "Evening Walk",
    category: "Health",
    color: "#C2B280",
    description: "Wind down with a walk",
  },
];

function CardShell({ children, className = "" }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`app-surface rounded-[var(--r-md)] p-5 sm:p-6 ${className}`}
    >
      {children}
    </motion.section>
  );
}

export default function Dashboard() {
  const dispatch = useDispatch();
  const router = useRouter();
  const habits = useSelector((state) => state.habit.habits);
  const [completing, setCompleting] = useState(null);
  const [completedIds, setCompletedIds] = useState([]);
  const [stats, setStats] = useState(null);
  const [reflectionOpen, setReflectionOpen] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [weeklyData, setWeeklyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [dashboardSearch, setDashboardSearch] = useState("");
  const [bestStreak, setBestStreak] = useState(0);
  const [habitStreaks, setHabitStreaks] = useState({});
  const { addToast } = useToast();

  useEffect(() => {
    (async () => {
      try {
        const res = await getHabits();
        const raw = res.data.data;
        const fetchedHabits = Array.isArray(raw) ? raw : (raw?.habits ?? []);
        dispatch(setReduxHabits(fetchedHabits));
        setLoading(false);

        getDashboardStats()
          .then((r) => setStats(r.data.data))
          .catch(() => {});
        getWeeklyData()
          .then((r) => setWeeklyData(r.data.data))
          .catch(() => {});
        getLongestStreak()
          .then((r) => setBestStreak(r.data.data?.longestStreak || 0))
          .catch(() => {});

        if (fetchedHabits.length > 0) {
          const active = fetchedHabits.filter((h) => h.status === "active");
          Promise.all(
            active.map(async (habit) => {
              try {
                const [logRes, streakRes] = await Promise.all([
                  getHabitLogs(habit._id, 1, 5),
                  getLongestStreak(habit._id).catch(() => null),
                ]);
                const logs = logRes.data.data.logs;
                if (logs.some(isLogFromToday)) {
                  setCompletedIds((prev) => [...prev, habit._id]);
                }
                if (streakRes) {
                  const cs = streakRes.data.data?.currentStreak || 0;
                  const ls = streakRes.data.data?.longestStreak || 0;
                  setHabitStreaks((prev) => ({
                    ...prev,
                    [habit._id]: { current: cs, longest: ls },
                  }));
                }
              } catch (err) {
                console.error("[Dashboard] Log fetch:", err);
              }
            }),
          );
        } else {
          const dismissed = localStorage.getItem(
            "habitflow-onboarding-dismissed",
          );
          if (!dismissed) setShowOnboarding(true);
        }
      } catch (err) {
        const msg =
          err?.response?.data?.message || err?.message || "Unknown error";
        console.error("[Dashboard] Failed to fetch habits:", msg);
        addToast({
          type: "error",
          title: "Failed to load habits",
          message: msg,
        });
        setLoading(false);
      }
    })();
  }, []);

  const handleComplete = (habit) => {
    if (completing) return;
    setSelectedHabit(habit);
    setReflectionOpen(true);
  };

  const handleSaveReflection = async (note = "") => {
    if (!selectedHabit) return;
    setCompleting(selectedHabit._id);
    try {
      await completeHabit(selectedHabit._id, note);
      setCompletedIds((prev) => [...prev, selectedHabit._id]);

      addToast({
        type: "success",
        title: "Ritual completed",
        message: `${selectedHabit.title} done for today`,
      });

      const doneCount = completedIds.length + 1;
      if (doneCount === 3 || doneCount === 5 || doneCount === 10) {
        fireConfetti();
      }

      const statsRes = await getDashboardStats();
      setStats(statsRes.data.data);
      setReflectionOpen(false);
      setSelectedHabit(null);
    } catch (err) {
      const msg = err.response?.data?.message;
      if (msg === "Habit already completed today") {
        setCompletedIds((prev) => [...prev, selectedHabit._id]);
        addToast({
          type: "error",
          title: "Already done",
          message: "You already completed this today",
        });
      } else {
        addToast({
          type: "error",
          title: "Failed",
          message: "Could not complete habit",
        });
      }
    } finally {
      setCompleting(null);
    }
  };

  const habitList = Array.isArray(habits) ? habits : [];
  const activeHabits = habitList.filter((h) => h.status === "active");
  const completedHabits = activeHabits.filter((h) =>
    completedIds.includes(h._id),
  );
  const pendingHabits = activeHabits.filter(
    (h) => !completedIds.includes(h._id),
  );

  const doneCount = completedHabits.length;
  const remainingCount = Math.max(activeHabits.length - doneCount, 0);
  const streakMilestones = useMemo(() => {
    const ms = [];
    if (doneCount >= 1)
      ms.push({ at: 1, label: "first ritual", reached: true });
    if (doneCount >= 3) ms.push({ at: 3, label: "hat trick", reached: true });
    if (doneCount >= 5) ms.push({ at: 5, label: "half dozen", reached: true });
    if (doneCount >= 7)
      ms.push({ at: 7, label: "perfect week", reached: true });
    return ms;
  }, [doneCount]);

  const topRituals = useMemo(() => {
    return activeHabits
      .map((h) => ({
        ...h,
        streak: habitStreaks[h._id]?.current || 0,
        doneToday: completedIds.includes(h._id),
      }))
      .sort((a, b) => b.streak - a.streak)
      .slice(0, 5);
  }, [activeHabits, habitStreaks, completedIds]);

  const bestStreakHabit = useMemo(() => {
    return activeHabits
      .map((h) => ({
        title: h.title,
        streak: habitStreaks[h._id]?.current || 0,
      }))
      .sort((a, b) => b.streak - a.streak)[0];
  }, [activeHabits, habitStreaks]);

  const filteredHabits = useMemo(() => {
    if (!dashboardSearch.trim()) return activeHabits;
    const q = dashboardSearch.toLowerCase();
    return activeHabits.filter(
      (h) =>
        h.title.toLowerCase().includes(q) ||
        (h.category || "").toLowerCase().includes(q),
    );
  }, [activeHabits, dashboardSearch]);

  const ICON_MAP = { Sprout, Target, Star, Flame, Gem, BookOpen, Award, Crown };
  const achievements = useMemo(() => {
    const streaks = activeHabits.map(() => 0);
    return getAchievements(stats, streaks, completedIds.length);
  }, [stats, completedIds.length, activeHabits]);
  const unlockedAchievements = achievements.filter((a) => a.unlocked);
  const totalAchievements = achievements.length;

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="w-full min-w-0">
      {activeHabits.length === 0 ? (
        <div className="flex min-h-[70vh] flex-col items-center justify-center gap-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-center"
          >
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-accent-mint/8">
              <Sparkles size={32} className="text-accent-mint" />
            </div>
            <p className="font-heading mb-3 text-[26px] font-semibold tracking-[-0.035em] text-text-primary sm:text-[30px]">
              no rituals yet.
            </p>
            <p className="text-base text-text-muted">
              design your first daily rhythm to begin.
            </p>
          </motion.div>

          <div className="flex flex-col items-center gap-5">
            <Button
              variant="primary"
              onClick={() => router.push("/create-habit")}
            >
              NEW RITUAL
            </Button>

            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className="text-[11px] font-semibold tracking-[0.15em] uppercase text-text-muted hover:text-text-primary transition-colors"
            >
              {showTemplates ? "hide templates" : "or start with a template"}
            </button>
          </div>

          <AnimatePresence>
            {showTemplates && (
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-lg"
              >
                <p className="app-label mb-5 text-center">choose a template</p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {TEMPLATES.map((t, i) => (
                    <motion.button
                      key={t.title}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.08 * i,
                        duration: 0.5,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      onClick={async () => {
                        try {
                          const res = await createHabit({
                            title: t.title,
                            description: t.description,
                            category: t.category,
                            color: t.color,
                            frequency: "daily",
                            type: "boolean",
                            unit: "",
                          });
                          if (res?.data?.data) {
                            dispatch(addReduxHabit(res.data.data));
                            addToast({
                              type: "success",
                              title: "Template added",
                              message: `${t.title} created`,
                            });
                            setShowTemplates(false);
                          } else {
                            addToast({
                              type: "error",
                              title: "Failed",
                              message: "Unexpected server response",
                            });
                          }
                        } catch (err) {
                          addToast({
                            type: "error",
                            title: "Failed",
                            message:
                              err?.response?.data?.message ||
                              err?.message ||
                              "Could not create template",
                          });
                        }
                      }}
                      className="group relative overflow-hidden rounded-2xl border border-border-subtle/60 bg-surface/80 backdrop-blur-sm p-5 text-left transition-all duration-300 hover:border-accent-mint/30 hover:shadow-xl hover:-translate-y-1.5"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-accent-mint/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="relative z-10">
                        <div className="mb-4 flex items-center gap-3">
                          <div
                            className="h-10 w-10 rounded-xl flex items-center justify-center text-sm font-semibold"
                            style={{
                              background: t.color + "20",
                              color: t.color,
                            }}
                          >
                            {t.title.charAt(0)}
                          </div>
                          <span className="app-label">{t.category}</span>
                        </div>
                        <p className="text-sm font-semibold text-text-primary group-hover:text-accent-mint transition-colors">
                          {t.title}
                        </p>
                        <p className="mt-1.5 text-[10px] leading-relaxed text-text-muted/70">
                          {t.description}
                        </p>
                        <div className="mt-3 flex items-center gap-1.5 text-[9px] font-semibold tracking-wider text-accent-mint opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span>ADD RITUAL</span>
                          <span>→</span>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <>
          <KpiRow
            stats={stats}
            weeklyData={weeklyData}
            streak={bestStreak}
            onNavigate={(href) => router.push(href)}
          />

          {/* Fernly row: bars + today's focus */}
          <div className="mb-4 grid gap-4 lg:grid-cols-12">
            <CardShell className="lg:col-span-7 flex flex-col">
              <div className="card__head">
                <div>
                  <h2 className="card__title">Weekly flow</h2>
                  <p className="card__sub">Completions this week</p>
                </div>
                <span className="chip">Last 7 days</span>
              </div>
              <div className="mt-auto flex min-h-44 flex-col justify-end sm:min-h-52">
                <WeeklyChart
                  data={weeklyData}
                  planned={stats?.totalHabits || 0}
                />
              </div>
            </CardShell>

            <CardShell className="lg:col-span-5 flex flex-col">
              <div className="card__head">
                <div>
                  <h2 className="card__title">Today&apos;s focus</h2>
                  <p className="card__sub">
                    {pendingHabits.length > 0
                      ? `${pendingHabits.length} left to complete`
                      : "All done for today"}
                  </p>
                </div>
                <span
                  className={`chip ${pendingHabits.length === 0 ? "trend-up" : ""}`}
                >
                  {doneCount}/{activeHabits.length}
                </span>
              </div>
              {pendingHabits.length === 0 ? (
                <div className="app-empty flex-1">
                  <CheckCircle2 size={22} className="text-accent-mint" />
                  <p>Every ritual checked off — enjoy the momentum</p>
                </div>
              ) : (
                <ul className="flex flex-col gap-1">
                  {pendingHabits.slice(0, 6).map((habit) => {
                    const Icon = categoryMap[habit.category] || Zap;
                    return (
                      <li key={habit._id}>
                        <div className="group flex items-center gap-3 rounded-[var(--r-sm)] px-2 py-2 transition-colors hover:bg-surface-dim">
                          <span
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                            style={{
                              background: habit.color
                                ? `${habit.color}18`
                                : "var(--color-surface-dim)",
                              color: habit.color || "var(--color-text-muted)",
                            }}
                          >
                            <Icon size={14} />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[13px] font-medium text-text-primary">
                              {habit.title}
                            </span>
                            <span className="block text-[10px] text-text-muted">
                              {habit.category}
                            </span>
                          </span>
                          <button
                            type="button"
                            onClick={() => handleComplete(habit)}
                            disabled={completing === habit._id}
                            aria-label={`Complete ${habit.title}`}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border-subtle bg-surface text-text-muted transition-all hover:border-accent-mint hover:bg-accent-mint hover:text-background disabled:opacity-50"
                          >
                            <CheckCircle2 size={14} />
                          </button>
                        </div>
                      </li>
                    );
                  })}
                  {pendingHabits.length > 6 && (
                    <li className="px-2 pt-1">
                      <button
                        type="button"
                        onClick={() => router.push("/rituals")}
                        className="flex items-center gap-1 text-[11px] font-medium text-text-muted hover:text-accent-mint"
                      >
                        +{pendingHabits.length - 6} more
                        <ChevronRight size={12} />
                      </button>
                    </li>
                  )}
                </ul>
              )}
            </CardShell>
          </div>

          {/* Fernly row: rituals + gauge + streak tracker */}
          <div className="mb-4 grid gap-4 lg:grid-cols-12">
            <CardShell className="lg:col-span-5 flex flex-col">
              <div className="card__head">
                <div>
                  <h2 className="card__title">Your rituals</h2>
                  <p className="card__sub">Top by streak</p>
                </div>
                <button
                  type="button"
                  onClick={() => router.push("/rituals")}
                  className="chip transition-colors hover:text-text-primary"
                >
                  View all
                </button>
              </div>
              <ul className="flex flex-col gap-1">
                {topRituals.map((habit) => {
                  const Icon = categoryMap[habit.category] || Zap;
                  return (
                    <li key={habit._id}>
                      <button
                        type="button"
                        onClick={() => router.push(`/rituals/${habit._id}`)}
                        className="group flex w-full items-center gap-3 rounded-[var(--r-sm)] px-2 py-2 text-left transition-colors hover:bg-surface-dim"
                      >
                        <span
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                          style={{
                            background: habit.color
                              ? `${habit.color}18`
                              : "var(--color-surface-dim)",
                            color: habit.color || "var(--color-text-muted)",
                          }}
                        >
                          <Icon size={14} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[13px] font-medium text-text-primary">
                            {habit.title}
                          </span>
                          <span className="block text-[10px] text-text-muted">
                            {habit.category}
                          </span>
                        </span>
                        <span className="flex shrink-0 items-center gap-1.5">
                          {habit.streak > 0 && (
                            <span className="flex items-center gap-1 rounded-full bg-accent-mint/10 px-2 py-0.5 text-[10px] font-semibold text-accent-mint">
                              <Flame size={10} />
                              {habit.streak}
                            </span>
                          )}
                          <span
                            className={`chip ${habit.doneToday ? "trend-up" : ""}`}
                            style={{ padding: "4px 10px" }}
                          >
                            {habit.doneToday ? "Done" : "Pending"}
                          </span>
                        </span>
                        <ChevronRight
                          size={14}
                          className="shrink-0 text-text-muted opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
                        />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </CardShell>

            <CardShell className="lg:col-span-4 flex flex-col">
              <div className="card__head">
                <div>
                  <h2 className="card__title">Today&apos;s split</h2>
                  <p className="card__sub">Done vs remaining</p>
                </div>
              </div>
              <div className="flex flex-1 items-center">
                <SemicircleGauge
                  done={doneCount}
                  remaining={remainingCount}
                  planned={stats?.totalHabits || activeHabits.length}
                  size={200}
                />
              </div>
            </CardShell>

            <CardShell className="lg:col-span-3 flex flex-col">
              <div className="card__head">
                <div>
                  <h2 className="card__title">Streak</h2>
                  <p className="card__sub">Best run</p>
                </div>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-mint/10">
                  <Flame size={16} className="text-accent-mint" />
                </span>
              </div>
              <div className="flex flex-1 flex-col justify-center gap-1">
                <p className="font-heading text-[40px] font-semibold leading-none tracking-[-0.045em] text-text-primary sm:text-[48px]">
                  {bestStreak}
                </p>
                <p className="text-[11px] font-medium text-text-muted">
                  day{bestStreak === 1 ? "" : "s"} consistency
                </p>
                {bestStreakHabit?.streak > 0 && (
                  <p className="mt-3 truncate text-[11px] text-text-muted">
                    Now:{" "}
                    <span className="font-medium text-text-primary">
                      {bestStreakHabit.title}
                    </span>{" "}
                    · {bestStreakHabit.streak}d
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => router.push("/statistics")}
                className="mt-4 flex items-center gap-1 text-[11px] font-medium text-text-muted transition-colors hover:text-accent-mint"
              >
                Streak analytics
                <ChevronRight size={12} />
              </button>
            </CardShell>
          </div>

          {streakMilestones.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 flex items-center gap-2"
            >
              <Target size={16} className="text-accent-mint" />
              <span className="app-label">milestones</span>
              <div className="flex flex-wrap gap-2">
                {streakMilestones.map((m) => (
                  <span key={m.at} className="trend trend-up">
                    {m.label}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="app-label mb-2">TRACK</p>
              <h1
                className="app-heading text-text-primary"
                style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.5rem)" }}
              >
                your habits
              </h1>
            </div>
            <div className="relative max-w-xs">
              <Search
                size={14}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
              />
              <input
                type="text"
                placeholder="Search habits..."
                value={dashboardSearch}
                onChange={(e) => setDashboardSearch(e.target.value)}
                className="w-full rounded-full border border-border-subtle bg-surface-dim/60 py-2.5 pl-9 pr-4 text-xs text-text-primary placeholder:text-text-muted/60 transition-all focus:border-accent-mint focus:bg-surface focus:outline-none focus:ring-1 focus:ring-accent-mint"
              />
            </div>
          </div>

          <div className="relative w-full overflow-hidden">
            <div className="flex w-full gap-6 overflow-x-auto pb-8 snap-x snap-mandatory custom-scroll-x">
              {(dashboardSearch ? filteredHabits : activeHabits).map(
                (habit, i) => (
                  <HabitCard
                    key={habit._id}
                    habit={habit}
                    index={i}
                    onComplete={handleComplete}
                    completing={completing}
                    isDone={completedIds.includes(habit._id)}
                  />
                ),
              )}
              {dashboardSearch && filteredHabits.length === 0 && (
                <div className="flex w-full items-center justify-center py-12">
                  <p className="text-sm text-text-muted">
                    No habits match your search.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Achievements */}
          {unlockedAchievements.length > 0 && (
            <div className="mt-12 mb-6">
              <div className="flex items-center gap-2 mb-5">
                <Trophy size={16} className="text-accent-mint" />
                <p className="app-label">
                  ACHIEVEMENTS ({unlockedAchievements.length}/
                  {totalAchievements})
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {unlockedAchievements.map((a) => {
                  const Icon = ICON_MAP[a.icon];
                  return (
                    <div
                      key={a.id}
                      className="group relative inline-flex items-center gap-2 rounded-full border border-accent-mint/20 bg-accent-mint/8 px-4 py-2 transition-all duration-300 hover:border-accent-mint/40 hover:bg-accent-mint/15 hover:shadow-lg hover:-translate-y-0.5"
                      title={a.desc}
                    >
                      <div
                        className="flex h-5 w-5 items-center justify-center rounded-full"
                        style={{ background: `${a.color}18` }}
                      >
                        {Icon && (
                          <Icon
                            size={11}
                            style={{ color: a.color }}
                            strokeWidth={2}
                          />
                        )}
                      </div>
                      <span
                        className="text-[11px] font-semibold tracking-wide"
                        style={{ color: a.color }}
                      >
                        {a.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {completedHabits.length > 0 && (
            <div className="mt-20">
              <div className="mb-8 flex items-center justify-between">
                <h2 className="font-heading text-xl font-semibold tracking-[-0.04em] text-text-primary sm:text-2xl">
                  habits completed
                </h2>
                <button
                  className="app-label transition-colors hover:text-text-primary"
                  onClick={() => router.push("/rituals/completed")}
                >
                  VIEW HISTORY →
                </button>
              </div>
              <div className="flex flex-col gap-4">
                {completedHabits.map((habit, i) => (
                  <CompletedHabit key={habit._id} habit={habit} index={i} />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <ReflectionModal
        open={reflectionOpen}
        habit={selectedHabit}
        onClose={() => {
          setReflectionOpen(false);
          setSelectedHabit(null);
        }}
        onSkip={() => handleSaveReflection("")}
        onSave={handleSaveReflection}
      />

      <AnimatePresence>
        {showOnboarding && (
          <OnboardingGuide
            onDismiss={() => {
              localStorage.setItem("habitflow-onboarding-dismissed", "true");
              setShowOnboarding(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
