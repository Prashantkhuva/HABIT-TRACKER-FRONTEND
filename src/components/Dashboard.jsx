import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getHabits, completeHabit, getHabitLogs } from "../api/habits-api";
import { getDashboardStats, getWeeklyData } from "../api/dashboard-api";
import { setReduxHabits } from "../store/habitSlice";
import HabitCard from "./Habit/HabitCard";
import CompletedHabit from "./Habit/CompletedHabit";
import Button from "./Button";
import { useToast } from "./Toast/ToastProvider";
import { DashboardSkeleton } from "./loading/LoadingSkeletons";
import { showNotification } from "../utils/notifications";

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const habits = useSelector((state) => state.habit.habits);
  const [completing, setCompleting] = useState(null);
  const [completedIds, setCompletedIds] = useState([]);
  const [stats, setStats] = useState(null);
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
              const doneToday = logs.some((log) => {
                const logDate = new Date(Number(log.date));
                const today = new Date();
                return (
                  logDate.getDate() === today.getDate() &&
                  logDate.getMonth() === today.getMonth() &&
                  logDate.getFullYear() === today.getFullYear()
                );
              });
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

  const handleComplete = async (habit) => {
    if (completing) return;

    setCompleting(habit._id);

    try {
      await completeHabit(habit._id);

      setCompletedIds((prev) => [...prev, habit._id]);

      addToast({
        type: "success",
        title: "Ritual completed",
        message: `${habit.title} done for today`,
      });

      const statsRes = await getDashboardStats();
      setStats(statsRes.data.data);

      showNotification({
        title: "Habit Completed",
        body: `${habit.title} completed 🔥`,
      });
    } catch (err) {
      const msg = err.response?.data?.message;

      if (msg === "Habit already completed today") {
        setCompletedIds((prev) => [...prev, habit._id]);

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

  const maxWeekly = Math.max(...weeklyData.map((d) => d.count), 1);

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="w-full min-w-0">
      {activeHabits.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
          <div className="text-center">
            <p
              className="text-3xl font-semibold mb-2 text-[#1A1A1A] dark:text-[#E6E1E5]"
              style={{ fontFamily: "Epilogue, sans-serif" }}
            >
              no rituals yet.
            </p>
            <p className="text-sm text-[#888888] dark:text-[#938F99]">
              design your first daily rhythm.
            </p>
          </div>
          <Button variant="primary" onClick={() => navigate("/create-habit")}>
            NEW RITUAL
          </Button>
        </div>
      ) : (
        <>
          <p className="text-xs tracking-widest mb-2 text-[#888888] dark:text-[#938F99]">
            TRACK
          </p>
          <h1
            className="font-bold mb-8 text-[#1A1A1A] dark:text-[#E6E1E5]"
            style={{
              fontFamily: "Epilogue, sans-serif",
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
              <div className="flex justify-between items-center mb-6">
                <h2
                  className="text-2xl font-bold text-[#1A1A1A] dark:text-[#E6E1E5]"
                  style={{ fontFamily: "Epilogue, sans-serif" }}
                >
                  habits completed
                </h2>
                <button
                  className="text-xs tracking-widest text-[#888888] dark:text-[#938F99] hover:text-[#1A1A1A] dark:hover:text-[#E6E1E5] transition-colors"
                  onClick={() => navigate("/rituals/completed")}
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
    </div>
  );
}
