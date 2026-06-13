"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Sparkles, TrendingUp, Target } from "lucide-react";
import { getHabits, createHabit, completeHabit, getHabitLogs } from "../api/habits-api";
import { getDashboardStats, getWeeklyData } from "../api/dashboard-api";
import { setReduxHabits, addReduxHabit } from "../store/habitSlice";
import HabitCard from "./Habit/HabitCard";
import CompletedHabit from "./Habit/CompletedHabit";
import Button from "./Button";
import { useToast } from "./Toast/ToastProvider";
import { DashboardSkeleton } from "./loading/LoadingSkeletons";
import ReflectionModal from "./Habit/ReflectionModal";
import { isLogFromToday } from "../lib/habit-utils";
import { fireConfetti } from "../lib/confetti";
import gsap from "gsap";

const TEMPLATES = [
  { title: "Morning Meditation", category: "Mindfulness", color: "#4F6F64", description: "Start your day with calm" },
  { title: "Read 10 Pages", category: "Learning", color: "#8B7E74", description: "Daily reading habit" },
  { title: "Evening Walk", category: "Health", color: "#C2B280", description: "Wind down with a walk" },
];

function WeeklySummary({ stats }) {
  if (!stats) return null;
  const pct = stats.completionRate || 0;
  const done = stats.completedToday || 0;
  const total = stats.totalHabits || 0;
  const cardRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(cardRef.current,
        { opacity: 0, y: 20, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out" }
      );
    }, cardRef);
    return () => ctx.revert();
  }, []);

  return (
    <motion.div
      ref={cardRef}
      className="mb-10 overflow-hidden rounded-3xl border border-border-subtle/60 bg-gradient-to-br from-accent-soft via-surface to-surface-dim p-6 sm:p-8"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-mint/12">
            <TrendingUp size={20} className="text-accent-mint" />
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-accent-mint">
              this week
            </p>
            <p className="mt-1.5 font-heading text-xl font-bold tracking-[-0.04em] text-text-primary sm:text-2xl">
              {done}/{total} rituals completed
            </p>
            <p className="mt-1 text-sm text-text-muted">
              {pct >= 70
                ? "Strong rhythm — keep the momentum going"
                : pct >= 40
                  ? "Building consistency — you're on track"
                  : "Early days — start with one ritual today"}
            </p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="font-heading text-3xl font-black tracking-[-0.06em] text-accent-mint sm:text-4xl">
            {pct}%
          </p>
          <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-text-muted">
            completion
          </p>
        </div>
      </div>
      <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-border-subtle/60">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="h-full rounded-full bg-gradient-to-r from-accent-mint via-accent-mint to-accent-mint/60"
        />
      </div>
    </motion.div>
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
  const [, setWeeklyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTemplates, setShowTemplates] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    (async () => {
      try {
        const res = await getHabits();
        const fetchedHabits = res.data.data;
        dispatch(setReduxHabits(fetchedHabits));
        setLoading(false);

        getDashboardStats().then((r) => setStats(r.data.data)).catch(() => {});
        getWeeklyData().then((r) => setWeeklyData(r.data.data)).catch(() => {});

        Promise.all(
          fetchedHabits.map(async (habit) => {
            try {
              const logRes = await getHabitLogs(habit._id, 1, 5);
              const logs = logRes.data.data.logs;
              if (logs.some(isLogFromToday)) {
                setCompletedIds((prev) => [...prev, habit._id]);
              }
            } catch { /* silent */ }
          }),
        );
      } catch {
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
        addToast({ type: "error", title: "Already done", message: "You already completed this today" });
      } else {
        addToast({ type: "error", title: "Failed", message: "Could not complete habit" });
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

  const doneCount = completedHabits.length;
  const streakMilestones = useMemo(() => {
    const ms = [];
    if (doneCount >= 1) ms.push({ at: 1, label: "first ritual", reached: true });
    if (doneCount >= 3) ms.push({ at: 3, label: "hat trick", reached: true });
    if (doneCount >= 5) ms.push({ at: 5, label: "half dozen", reached: true });
    if (doneCount >= 7) ms.push({ at: 7, label: "perfect week", reached: true });
    return ms;
  }, [doneCount]);

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
            <p className="font-heading mb-3 text-3xl font-bold tracking-[-0.05em] text-text-primary sm:text-4xl">
              no rituals yet.
            </p>
            <p className="text-base text-text-muted">
              design your first daily rhythm to begin.
            </p>
          </motion.div>

          <div className="flex flex-col items-center gap-5">
            <Button variant="primary" onClick={() => router.push("/create-habit")}>
              NEW RITUAL
            </Button>

            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className="text-[11px] font-bold tracking-[0.15em] uppercase text-text-muted hover:text-text-primary transition-colors"
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
              <p className="app-label mb-5 text-center">
                choose a template
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {TEMPLATES.map((t, i) => (
                  <motion.button
                    key={t.title}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 * i, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
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
                          addToast({ type: "success", title: "Template added", message: `${t.title} created` });
                          setShowTemplates(false);
                        } else {
                          addToast({ type: "error", title: "Failed", message: "Unexpected server response" });
                        }
                      } catch (err) {
                        addToast({ type: "error", title: "Failed", message: err?.response?.data?.message || err?.message || "Could not create template" });
                      }
                    }}
                    className="group relative overflow-hidden rounded-2xl border border-border-subtle/60 bg-surface/80 backdrop-blur-sm p-5 text-left transition-all duration-300 hover:border-accent-mint/30 hover:shadow-xl hover:-translate-y-1.5"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-accent-mint/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative z-10">
                      <div className="mb-4 flex items-center gap-3">
                        <div
                          className="h-10 w-10 rounded-xl flex items-center justify-center text-sm font-bold"
                          style={{ background: t.color + "20", color: t.color }}
                        >
                          {t.title.charAt(0)}
                        </div>
                        <span className="app-label">{t.category}</span>
                      </div>
                      <p className="text-sm font-bold text-text-primary group-hover:text-accent-mint transition-colors">
                        {t.title}
                      </p>
                      <p className="mt-1.5 text-[10px] leading-relaxed text-text-muted/70">
                        {t.description}
                      </p>
                      <div className="mt-3 flex items-center gap-1.5 text-[9px] font-bold tracking-wider text-accent-mint opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
          <WeeklySummary stats={stats} />

          {streakMilestones.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 flex items-center gap-2"
            >
              <Target size={16} className="text-accent-mint" />
              <span className="text-[11px] font-bold tracking-[0.12em] uppercase text-accent-mint">
                milestones
              </span>
              <div className="flex gap-2">
                {streakMilestones.map((m) => (
                  <span
                    key={m.at}
                    className="inline-flex items-center gap-1.5 rounded-full bg-accent-mint/10 px-3 py-1.5 text-[10px] font-bold text-accent-mint"
                  >
                    {m.label}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          <p className="app-label mb-2">TRACK</p>
          <h1 className="app-heading mb-10 text-text-primary" style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.5rem)" }}>
            your habits
          </h1>

          <div className="relative w-full overflow-hidden">
            <div className="flex w-full gap-6 overflow-x-auto pb-8 snap-x snap-mandatory custom-scroll-x">
              {activeHabits.map((habit, i) => (
                <HabitCard
                  key={habit._id}
                  habit={habit}
                  index={i}
                  onComplete={handleComplete}
                  completing={completing}
                  isDone={completedIds.includes(habit._id)}
                />
              ))}
            </div>
          </div>

          {completedHabits.length > 0 && (
            <div className="mt-20">
              <div className="mb-8 flex items-center justify-between">
                <h2 className="font-heading text-xl font-bold tracking-[-0.04em] text-text-primary sm:text-2xl">
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
    </div>
  );
}
