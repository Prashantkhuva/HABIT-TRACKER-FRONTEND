import { useMemo, useState } from "react";
import { motion } from "framer-motion";

const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];
const CELL_SIZE = "size-8 sm:size-10";

function getColorClass(count) {
  const shades = [
    "bg-border-subtle",
    "bg-accent-mint/20",
    "bg-accent-mint/40",
    "bg-accent-mint/70",
    "bg-accent-mint",
  ];
  return shades[Math.min(count, 4)];
}

function getIntensity(count) {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 4) return 2;
  if (count <= 7) return 3;
  return 4;
}

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

  return (
    <div className="flex w-full justify-center">
      <div className="grid w-fit grid-cols-7 gap-1 sm:gap-1.5">
        {DAY_LABELS.map((label, i) => (
          <div key={`label-${i}`} className={`${CELL_SIZE} flex items-center justify-center text-[9px] font-bold text-text-muted`}>
            {label}
          </div>
        ))}

        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} className={CELL_SIZE} aria-hidden />;

          const key = `${year}-${month}-${day}`;
          const count = map[key] || 0;
          const intensity = getIntensity(count);
          const isToday = day === today.getDate();

          return (
            <div
              key={`cell-${i}`}
              className={`relative ${CELL_SIZE}`}
              onMouseEnter={() => setHovered({ day, count, intensity })}
              onMouseLeave={() => setHovered(null)}
            >
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.003, type: "spring", stiffness: 200, damping: 18 }}
                whileHover={{ scale: 1.2 }}
                className={`size-full cursor-pointer rounded-lg transition-all duration-200 ${getColorClass(intensity)} ${
                  isToday ? "ring-2 ring-accent-mint/40 ring-offset-1 ring-offset-background" : ""
                }`}
              />

              {hovered?.day === day && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="pointer-events-none absolute bottom-[120%] left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-xl border border-white/10 bg-primary/90 backdrop-blur-xl px-3 py-2 text-[10px] font-semibold text-background shadow-xl"
                >
                  {new Date(year, month, day).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  <span className="text-accent-mint"> · {count}</span>
                </motion.div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
