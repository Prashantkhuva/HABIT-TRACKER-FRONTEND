import { useMemo, useState } from "react";
import { motion } from "framer-motion";

function normalizeWeeklyChartData(data = []) {
  const WEEKDAY_SHORT = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  const today = new Date().getDay();
  const todayIdx = today === 0 ? 6 : today - 1;

  const slots = WEEKDAY_SHORT.map((label, index) => ({
    label, count: 0, isToday: index === todayIdx,
  }));

  const API_DAY_MAP = {
    Mon: 0, Monday: 0, Tue: 1, Tuesday: 1,
    Wed: 2, Wednesday: 2, Thu: 3, Thursday: 3,
    Fri: 4, Friday: 4, Sat: 5, Saturday: 5,
    Sun: 6, Sunday: 6,
  };

  data.forEach((entry, i) => {
    const dayStr = entry?.day;
    let idx = dayStr != null ? API_DAY_MAP[dayStr] : null;
    if (idx == null && typeof dayStr === "number" && dayStr >= 1 && dayStr <= 7) {
      idx = dayStr === 1 ? 6 : dayStr - 2;
    }
    if (idx == null && i < 7) idx = i === 0 ? 6 : i - 1;
    if (idx != null && idx >= 0 && idx < 7) {
      slots[idx].count = entry.count || 0;
    }
  });

  return slots;
}

function getBarGradient(count, max) {
  if (count <= 0) return "bg-border-subtle/40";
  const ratio = count / max;
  if (ratio >= 0.75) return "bg-gradient-to-t from-accent-mint via-[#5F8478] to-[#9EC9BE]";
  if (ratio >= 0.4) return "bg-gradient-to-t from-[#3D5A4F] via-[#5F8478] to-[#9EC9BE]";
  return "bg-gradient-to-t from-[#5A7A6A] to-[#B8DDD4]";
}

export default function WeeklyChart({ data }) {
  const slots = useMemo(() => normalizeWeeklyChartData(data), [data]);
  const max = Math.max(...slots.map((s) => s.count), 1);
  const [hovered, setHovered] = useState(null);

  return (
    <div className="w-full">
      <div className="relative w-full h-[180px]">
        <div className="absolute inset-0 flex items-end gap-2 sm:gap-3">
          {slots.map((slot, i) => {
            const gradient = getBarGradient(slot.count, max);
            const heightPct = slot.count > 0 ? Math.max((slot.count / max) * 100, 12) : 0;

            return (
              <div
                key={slot.label}
                className="relative flex flex-1 flex-col justify-end"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                {hovered === i && slot.count > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -top-11 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-xl border border-white/20 bg-primary/90 backdrop-blur-xl px-3 py-2 text-xs font-semibold text-background shadow-xl"
                  >
                    <span className="text-accent-mint">{slot.count}</span> {slot.count === 1 ? "habit" : "habits"}
                  </motion.div>
                )}

                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: `${heightPct}%`, opacity: 1 }}
                  transition={{ duration: 0.7, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] }}
                  className={[
                    gradient,
                    "w-full rounded-t-lg rounded-b-sm transition-all duration-300 relative overflow-hidden",
                    hovered === i && slot.count > 0 ? "scale-[1.04] shadow-lg" : "",
                    slot.isToday ? "ring-2 ring-accent-mint/30 ring-offset-2 ring-offset-background" : "",
                  ].join(" ")}
                >
                  {slot.count > 0 && (
                    <motion.div
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{ repeat: Infinity, duration: 2.5, ease: "linear", delay: i * 0.1 }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                    />
                  )}
                </motion.div>

                {slot.count > 0 && (
                  <motion.span
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.08 }}
                    className="text-[9px] font-bold text-accent-mint text-center mt-1.5"
                  >
                    {slot.count}
                  </motion.span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-2 flex gap-2 sm:gap-3">
        {slots.map((slot) => (
          <span
            key={`label-${slot.label}`}
            className={`flex-1 text-center text-[9px] sm:text-[10px] font-bold tracking-wider ${
              slot.isToday ? "text-accent-mint" : "text-text-muted"
            }`}
          >
            {slot.label}
          </span>
        ))}
      </div>
    </div>
  );
}
