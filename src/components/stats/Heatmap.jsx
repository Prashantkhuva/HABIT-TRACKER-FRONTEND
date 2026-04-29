import { useMemo, useState } from "react";
import { motion } from "framer-motion";

export default function Heatmap({ data }) {
  const [hovered, setHovered] = useState(null);

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const map = useMemo(() => {
    const m = {};
    data.forEach((d) => {
      const day = parseInt(d._id.split("-")[2], 10);
      m[day] = d.count;
    });
    return m;
  }, [data]);

  const totalDays = new Date(year, month + 1, 0).getDate();
  const firstDayRaw = new Date(year, month, 1).getDay();
  const offset = firstDayRaw === 0 ? 6 : firstDayRaw - 1;

  const cells = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= totalDays; d++) cells.push(d);

  const getColor = (count) => {
    if (!count) return "#E8E4DC";
    if (count === 1) return "#C8DAD6";
    if (count === 2) return "#8FA8A3";
    return "#4F6F64";
  };

  return (
    <div className="flex justify-center w-full">
      {/* 🔥 IMPORTANT: inline-grid instead of grid */}
      <div className="inline-grid gap-1">
        {/* Day labels */}
        <div className="grid grid-cols-7 text-center text-[10px] text-[#9A9A8A] mb-1">
          {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
            <div key={i} className="w-8">
              {d}
            </div>
          ))}
        </div>

        {/* Cells */}
        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, i) => {
            if (!day) return <div key={`empty-${i}`} className="w-8 h-8" />;

            const count = map[day] || 0;

            return (
              <div
                key={day}
                className="relative"
                onMouseEnter={() => setHovered({ day, count })}
                onMouseLeave={() => setHovered(null)}
              >
                <motion.div
                  whileHover={{ scale: 1.15 }}
                  className="w-10 h-10 rounded-md cursor-pointer"
                  style={{ background: getColor(count) }}
                />

                {/* Tooltip */}
                {hovered?.day === day && (
                  <div className="absolute bottom-[120%] left-1/2 -translate-x-1/2 bg-[#1A1A1A] text-[#FAFAF5] text-[10px] px-2 py-1 rounded-md whitespace-nowrap pointer-events-none">
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
