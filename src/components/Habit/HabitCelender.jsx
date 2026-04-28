import { useMemo } from "react";
import { getBestMonth } from "../../lib/habit-utils";

export default function HabitCalendar({ logs }) {
  const today = new Date();

  // 🔥 Create map for quick lookup
  const completedMap = useMemo(() => {
    const map = {};
    logs.forEach((log) => {
      const d = new Date(log.date).getDate();
      if (log.completed) map[d] = true;
    });
    return map;
  }, [logs]);

  // 🔥 Get current month details
  const year = today.getFullYear();
  const month = today.getMonth();

  const firstDay = new Date(year, month, 1).getDay(); // 0-6
  const totalDays = new Date(year, month + 1, 0).getDate();

  // 🔥 Convert Sunday start → Monday start
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;

  const days = [];

  const { bestmonth, percentage } = getBestMonth(logs);

  // empty slots before month start
  for (let i = 0; i < startOffset; i++) {
    days.push(null);
  }

  // actual days
  for (let d = 1; d <= totalDays; d++) {
    days.push(d);
  }

  return (
    <div className="p-6 bg-[#F5F5F5] rounded-3xl">
      {/* TITLE */}
      <h2 className="text-xl font-semibold mb-4">monthly rhythm</h2>

      {/* DAY NAMES */}
      <div className="grid grid-cols-7 gap-3 text-xs text-gray-400 mb-3">
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <div key={i} className="text-center">
            {d}
          </div>
        ))}
      </div>

      {/* CALENDAR GRID */}
      <div className="grid grid-cols-7 gap-3">
        {days.map((day, i) => {
          if (!day) {
            return <div key={i} />;
          }

          const isCompleted = completedMap[day];
          const isToday = day === today.getDate();

          return (
            <div
              key={day}
              className="w-10 h-10 flex items-center justify-center text-sm font-semibold rounded-full transition-all"
              style={{
                background: isCompleted ? "#4F6F64" : "transparent",
                color: isCompleted ? "#fff" : "#333",
                border: isToday ? "2px solid #000" : "1px solid #E5E5E5",
              }}
            >
              {day}
            </div>
          );
        })}
      </div>

      {/* FOOTER */}
      <div className="flex justify-between items-end mt-8">
        <div>
          <p className="text-xs text-gray-400 tracking-widest">BEST MONTH</p>
          <p className="text-lg font-semibold">{bestmonth}</p>
        </div>

        <p className="text-3xl font-bold text-[#4F6F64]">{percentage}%</p>
      </div>
    </div>
  );
}
