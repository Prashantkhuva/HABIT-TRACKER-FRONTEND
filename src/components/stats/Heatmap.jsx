import { useMemo, useState } from "react";
import { motion } from "framer-motion";

const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];
const CELL_SIZE = "size-8 sm:size-10";

export default function Heatmap({ data }) {
  const [hovered, setHovered] = useState(null);

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

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
    <div className="flex w-full justify-center">
      <div className="grid w-fit grid-cols-7 gap-1.5 sm:gap-2">
        {DAY_LABELS.map((label, i) => (
          <div
            key={`label-${i}`}
            className={`${CELL_SIZE} flex items-center justify-center text-[10px] font-medium text-[#888888] dark:text-[#938F99]`}
          >
            {label}
          </div>
        ))}

        {cells.map((day, i) => {
          if (!day) {
            return <div key={`empty-${i}`} className={CELL_SIZE} aria-hidden />;
          }

          const key = `${year}-${month}-${day}`;
          const count = map[key] || 0;

          return (
            <div
              key={`cell-${i}`}
              className={`relative ${CELL_SIZE}`}
              onMouseEnter={() => setHovered({ day, count })}
              onMouseLeave={() => setHovered(null)}
            >
              <motion.div
                whileHover={{ scale: 1.12 }}
                className={`size-full cursor-pointer rounded-md transition-colors duration-200 ${getColorClass(count)}`}
              />

              {hovered?.day === day && (
                <div
                  className="
                    pointer-events-none absolute bottom-[115%] left-1/2 z-10
                    -translate-x-1/2 whitespace-nowrap rounded-md
                    bg-[#1A1A1A] px-2 py-1 text-[10px] text-[#FAFAF5]
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
  );
}
