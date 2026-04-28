import { useEffect, useState } from "react";
import { getLongestStreak } from "../../api/dashboard-api";
import { useSelector } from "react-redux";

export default function StreakPanel() {
  const habits = useSelector((state) => state.habit.habits);
  const [habitStreaks, setHabitStreaks] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const results = await Promise.all(
          habits.filter((h) => h.status === "active").map(async (habit) => {
            const res = await getLongestStreak(habit._id);
            return {
              _id: habit._id,
              title: habit.title,
              color: habit.color,
              frequency: habit.frequency,
              currentStreak: res.data.data?.currentStreak || 0,
            };
          })
        );
        // Sort by streak — top 3
        const sorted = results
          .sort((a, b) => b.currentStreak - a.currentStreak)
          .slice(0, 3);
        setHabitStreaks(sorted);
      } catch (err) {
        console.error(err);
      }
    };
    if (habits.length > 0) fetchAll();
  }, [habits]);

  const rankColors = ["#C2B280", "#C8E6DF", "#E0DED9"];

  return (
    <div className="rounded-[32px] p-8 h-full" style={{ background: "#F0EDE5" }}>
      <h2 className="text-2xl font-bold mb-6"
        style={{ fontFamily: "Epilogue, sans-serif", color: "#1A1A1A" }}>
        ritual streaks
      </h2>

      <div className="flex flex-col gap-5">
        {habitStreaks.length === 0 ? (
          <p className="text-sm" style={{ color: "#9A9A8A" }}>No streaks yet.</p>
        ) : (
          habitStreaks.map((habit, i) => (
            <div key={habit._id} className="flex items-center gap-4 py-4 border-b"
              style={{ borderColor: "#E8E4DC" }}>
              {/* Rank circle */}
              <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: rankColors[i] }}>
                <span className="text-xs font-bold"
                  style={{ color: "#1A1A1A", fontFamily: "Manrope, sans-serif" }}>
                  0{i + 1}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1">
                <p className="text-sm font-bold" style={{ color: "#1A1A1A" }}>
                  {habit.title}
                </p>
                <p className="text-xs tracking-widest"
                  style={{ color: "#9A9A8A", fontFamily: "Manrope, sans-serif" }}>
                  {habit.frequency === "daily" ? "DAILY HABIT" : "WEEKLY HABIT"}
                </p>
              </div>

              {/* Streak */}
              <div className="text-right">
                <p className="text-3xl font-bold"
                  style={{ fontFamily: "Epilogue, sans-serif", color: "#1A1A1A" }}>
                  {habit.currentStreak}
                </p>
                <p className="text-xs tracking-widest"
                  style={{ color: "#9A9A8A", fontFamily: "Manrope, sans-serif" }}>
                  DAYS
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}