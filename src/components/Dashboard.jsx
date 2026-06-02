"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useRouter } from "next/navigation";
import { getHabits, completeHabit, getHabitLogs } from "../api/habits-api";
import { getDashboardStats, getWeeklyData } from "../api/dashboard-api";
import { setReduxHabits } from "../store/habitSlice";
import HabitCard from "./Habit/HabitCard";
import CompletedHabit from "./Habit/CompletedHabit";
import Button from "./Button";
import { useToast } from "./Toast/ToastProvider";
import { DashboardSkeleton } from "./loading/LoadingSkeletons";
import ReflectionModal from "./Habit/ReflectionModal";
import { isLogFromToday } from "../lib/habit-utils";

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
  const { addToast } = useToast();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await getHabits();
        const fetchedHabits = res.data.data;
        dispatch(setReduxHabits(fetchedHabits));

        const [statsRes, weeklyRes] = await Promise.all([
          getDashboardStats(),
          getWeeklyData(),
        ]);
        setStats(statsRes.data.data);
        setWeeklyData(weeklyRes.data.data);

        const alreadyDoneIds = [];
        await Promise.all(
          fetchedHabits.map(async (habit) => {
            try {
              const logRes = await getHabitLogs(habit._id, 1, 5);
              const logs = logRes.data.data.logs;
              const doneToday = logs.some(isLogFromToday);
              if (doneToday) alreadyDoneIds.push(habit._id);
            } catch (err) {
              console.error(err);
            }
          }),
        );
        setCompletedIds(alreadyDoneIds);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
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
        console.error(err);

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

  const activeHabits = habits.filter((h) => h.status === "active");
  const completedHabits = activeHabits.filter((h) =>
    completedIds.includes(h._id),
  );

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="w-full min-w-0">
      {activeHabits.length === 0 ? (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6">
          <div className="text-center">
            <p
              className="font-heading mb-2 text-3xl font-semibold tracking-[-0.04em] text-text-primary"
            >
              no rituals yet.
            </p>
            <p className="text-sm text-text-muted">
              design your first daily rhythm.
            </p>
          </div>
          <Button variant="primary" onClick={() => router.push("/create-habit")}>
            NEW RITUAL
          </Button>
        </div>
      ) : (
        <>
          <p className="app-label mb-2">
            TRACK
          </p>
          <h1
            className="app-heading mb-8 text-text-primary"
            style={{
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
            }}
          >
            your habits
          </h1>

          <div className="relative w-full overflow-hidden">
            <div className="w-full overflow-x-auto pb-6 flex gap-5 custom-scroll-x snap-x snap-mandatory">
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
            <div className="mt-16">
              <div className="mb-6 flex items-center justify-between">
                <h2
                  className="font-heading text-2xl font-bold tracking-[-0.04em] text-text-primary"
                >
                  habits completed
                </h2>
                <button
                  className="app-label transition-colors hover:text-text-primary"
                  onClick={() => router.push("/rituals/completed")}
                >
                  VIEW HISTORY →
                </button>
              </div>
              <div className="flex flex-col gap-3">
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
