import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getLongestStreak } from "../../api/dashboard-api";

export default function StreakPanel() {
  const habits = useSelector((state) => state.habit.habits);
  const [habitStreaks, setHabitStreaks] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const results = await Promise.all(
          habits
            .filter((h) => h.status === "active")
            .map(async (habit) => {
              const res = await getLongestStreak(habit._id);
              return {
                _id: habit._id,
                title: habit.title,
                color: habit.color,
                frequency: habit.frequency,
                currentStreak: res.data.data?.currentStreak || 0,
              };
            }),
        );

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
    <div className="h-full flex flex-col gap-4">
      {/* 🔥 Header (match heatmap style) */}
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-bold text-[#1A1A1A]">Ritual Streaks</h2>
        <p className="text-xs text-[#8A8A7A]">Your top performing habits</p>
      </div>

      {/* Divider */}
      <div className="w-10 h-px bg-[#D6D3CB]" />

      {/* 🔥 Content */}
      <div className="flex flex-col gap-4">
        {habitStreaks.length === 0 ? (
          <p className="text-xs text-[#9A9A8A]">No streaks yet.</p>
        ) : (
          habitStreaks.map((habit, i) => (
            <div key={habit._id} className="flex items-center justify-between">
              {/* Left */}
              <div className="flex items-center gap-3">
                {/* Rank */}
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold"
                  style={{ background: rankColors[i], color: "#1A1A1A" }}
                >
                  0{i + 1}
                </div>

                {/* Info */}
                <div>
                  <p className="text-sm font-semibold text-[#1A1A1A]">
                    {habit.title}
                  </p>
                  <p className="text-xs text-[#8A8A7A]">
                    {habit.frequency.toUpperCase()} HABIT
                  </p>
                </div>
              </div>

              {/* Right */}
              <div className="text-right">
                <p className="text-xl font-bold text-[#1A1A1A]">
                  {habit.currentStreak}
                </p>
                <p className="text-xs text-[#8A8A7A]">DAYS</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
