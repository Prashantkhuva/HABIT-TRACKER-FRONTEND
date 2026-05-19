import { useMemo, useState } from "react";
import { motion } from "framer-motion";

export default function Heatmap({ data }) {
  const [hovered, setHovered] = useState(null);

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  // ✅ FIXED MAP (full date key)
  const map = useMemo(() => {
    const m = {};
    data.forEach((d) => {
      const date = new Date(d._id);
      const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      m[key] = d.count;
    });
    return m;
  }, [data]);

  const totalDays = new Date(year, month + 1, 0).getDate();
  const firstDayRaw = new Date(year, month, 1).getDay();
  const offset = firstDayRaw === 0 ? 6 : firstDayRaw - 1;

  const cells = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= totalDays; d++) cells.push(d);

  // ✅ COLOR FIX

  const getColorClass = (count) => {
    const shades = [
      "bg-[#E8E4DC] dark:bg-[#2A2A2A]",
      "bg-[#D6D1C7] dark:bg-[#3A3640]",
      "bg-[#BDB7AA] dark:bg-[#5A5363]",
      "bg-[#8C8478] dark:bg-[#7B7190]",
      "bg-[#1A1A1A] dark:bg-[#CDC0E9]",
    ];

    return shades[Math.min(count, 4)];
  };

  return (
    <div className="flex justify-center w-full">
      <div className="inline-grid gap-2 min-w-fit mx-auto">
        {/* DAY LABELS */}
        <div className="grid grid-cols-7 text-center text-[10px] text-[#888888] dark:text-[#938F99] mb-1">
          {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
            <div key={i} className="w-8">
              {d}
            </div>
          ))}
        </div>

        {/* CELLS */}
        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, i) => {
            if (!day) return <div key={`empty-${i}`} className="w-8 h-8" />;

            const key = `${year}-${month}-${day}`;
            const count = map[key] || 0;

            return (
              <div
                key={`cell-${i}`}
                className="relative"
                onMouseEnter={() => setHovered({ day, count })}
                onMouseLeave={() => setHovered(null)}
              >
                <motion.div
                  whileHover={{ scale: 1.15 }}
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-md cursor-pointer transition-colors duration-200 ${getColorClass(count)}`}
                />

                {/* TOOLTIP */}
                {hovered?.day === day && (
                  <div
                    className="
                    absolute bottom-[120%] left-1/2 -translate-x-1/2
                    text-[10px] px-2 py-1 rounded-md whitespace-nowrap
                    pointer-events-none z-10
                    bg-[#1A1A1A] text-[#FAFAF5]
                    dark:bg-[#CDC0E9] dark:text-[#1A1A1A]
                  "
                  >
                    {new Date(year, month, day).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}{" "}
                    — {count} habits
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
