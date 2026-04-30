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
    <div className="p-6 bg-[#F4F4EF] dark:bg-[#0F0D13] rounded-3xl border border-[#E8E4DC] dark:border-[#49454F]">
      {/* TITLE */}
      <h2 className="text-xl font-semibold mb-4 text-[#1A1A1A] dark:text-[#E6E1E5]">monthly rhythm</h2>

      {/* DAY NAMES */}
      <div className="grid grid-cols-7 gap-1 sm:gap-3 text-xs text-[#888888] dark:text-[#938F99] mb-3">
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <div key={i} className="text-center font-bold">
            {d}
          </div>
        ))}
      </div>

      {/* CALENDAR GRID */}
      <div className="grid grid-cols-7 gap-1 sm:gap-3">
        {days.map((day, i) => {
          if (!day) {
            return <div key={`empty-${i}`} className="w-8 h-8 sm:w-10 sm:h-10" />;
          }

          const isCompleted = completedMap[day];
          const isToday = day === today.getDate();

          return (
            <div
              key={`day-${i}`}
              className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-xs sm:text-sm font-semibold rounded-full transition-all ${
                isCompleted 
                  ? "bg-[#1A1A1A] dark:bg-[#D0BCFF] text-[#FAFAF5] dark:text-[#1A1A1A]" 
                  : "text-[#1A1A1A] dark:text-[#E6E1E5]"
              }`}
              style={{
                border: isToday 
                  ? (isCompleted ? "none" : "2px solid #1A1A1A") 
                  : "none",
                borderColor: isToday && !isCompleted ? (document.documentElement.classList.contains("dark") ? "#D0BCFF" : "#1A1A1A") : "transparent"
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
          <p className="text-xs text-[#888888] dark:text-[#938F99] tracking-widest">BEST MONTH</p>
          <p className="text-lg font-semibold text-[#1A1A1A] dark:text-[#E6E1E5]">{bestmonth}</p>
        </div>

        <p className="text-3xl font-bold text-[#1A1A1A] dark:text-[#D0BCFF]">{percentage}%</p>
      </div>
    </div>
  );
}
