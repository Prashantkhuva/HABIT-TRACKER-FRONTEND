import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getHabits, completeHabit, getHabitLogs } from "../api/habits-api";
import { setReduxHabits } from "../store/habitSlice";
import HabitCard from "./Habit/HabitCard";
import CompletedHabit from "./Habit/CompletedHabit";
import Button from "./Button";

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const habits = useSelector((state) => state.habit.habits);
  const [completing, setCompleting] = useState(null);
  const [completedIds, setCompletedIds] = useState([]);

  useEffect(() => {
    const fetchHabits = async () => {
      try {
        const res = await getHabits();
        const fetchedHabits = res.data.data;
        dispatch(setReduxHabits(fetchedHabits));

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
      }
    };
    fetchHabits();
  }, []);

  const handleComplete = async (habit) => {
    if (completing) return;
    setCompleting(habit._id);
    try {
      await completeHabit(habit._id);
      setCompletedIds((prev) => [...prev, habit._id]);
    } catch (err) {
      const msg = err.response?.data?.message;
      if (msg === "Habit already completed today") {
        setCompletedIds((prev) => [...prev, habit._id]);
      } else {
        console.error(err);
      }
    } finally {
      setCompleting(null);
    }
  };

  const activeHabits = habits.filter((h) => h.status === "active");
  const completedHabits = activeHabits.filter((h) =>
    completedIds.includes(h._id),
  );

  return (
    <div
      className="min-h-screen px-8 pt-10 pb-0 custom-scroll"
      style={{ background: "#FAFAF5", color: "#1A1A1A" }}
    >
      {activeHabits.length === 0 ? (
        /* ── EMPTY STATE ── */
        <div className="flex flex-col items-center justify-center h-[60vh] gap-6 ">
          <div className="text-center">
            <p
              className="text-3xl font-semibold mb-2"
              style={{ fontFamily: "Epilogue, sans-serif", color: "#1A1A1A" }}
            >
              no rituals yet.
            </p>
            <p className="text-sm" style={{ color: "#9A9A8A" }}>
              design your first daily rhythm.
            </p>
          </div>
          <Button onClick={() => navigate("/create-habit")}>NEW RITUAL</Button>
        </div>
      ) : (
        /* ── HABITS ── */
        <>
          <p
            className="text-xs tracking-widest mb-2"
            style={{ color: "#9A9A8A" }}
          >
            TRACK
          </p>
          <h1
            className="font-bold mb-8"
            style={{
              fontFamily: "Epilogue, sans-serif",
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
            }}
          >
            your habits
          </h1>

          <div className="flex gap-5 overflow-x-auto pb-4 custom-scroll-x">
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

          {completedHabits.length > 0 && (
            <div className="mt-16">
              <div className="flex justify-between items-center mb-6">
                <h2
                  className="text-2xl font-bold"
                  style={{
                    fontFamily: "Epilogue, sans-serif",
                    color: "#1A1A1A",
                  }}
                >
                  habits completed
                </h2>
                <button
                  className="text-xs tracking-widest"
                  style={{ color: "#9A9A8A" }}
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
