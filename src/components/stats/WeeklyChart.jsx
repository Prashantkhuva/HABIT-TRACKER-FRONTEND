import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { normalizeWeeklyChartData } from "../../lib/habit-utils";

function getBarAppearance(count, max) {
  if (count <= 0) {
    return {
      className: "bg-[#E6DED1]",
      height: "6px",
    };
  }

  const ratio = count / max;

  if (ratio >= 0.75) {
    return {
      className: "bg-gradient-to-t from-[#3D554F] via-[#47655E] to-[#9EC9BE]",
      height: null,
    };
  }

  if (ratio >= 0.4) {
    return {
      className: "bg-gradient-to-t from-[#47655E] via-[#5F8478] to-[#B8DDD4]",
      height: null,
    };
  }

  return {
    className: "bg-gradient-to-t from-[#6F8C72] to-[#C8E6DF]",
    height: null,
  };
}

export default function WeeklyChart({ data }) {
  const slots = useMemo(() => normalizeWeeklyChartData(data), [data]);
  const max = Math.max(...slots.map((s) => s.count), 1);
  const [hovered, setHovered] = useState(null);

  return (
    <div className="w-full">
      <div className="relative w-full" style={{ height: "160px" }}>
        <div className="absolute inset-0 flex items-end gap-3">
          {slots.map((slot, i) => {
            const { className: barClass, height: fixedHeight } = getBarAppearance(
              slot.count,
              max,
            );
            const heightPct =
              slot.count > 0
                ? Math.max((slot.count / max) * 100, 14)
                : 0;

            return (
              <div
                key={slot.label}
                className="relative flex flex-1 flex-col justify-end"
                style={{ height: "100%" }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                {hovered === i && (
                  <div className="absolute -top-10 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-lg bg-[#181714] px-3 py-1.5 text-xs font-semibold text-[#FAFAF5]">
                    {slot.label} — {slot.count} habit
                    {slot.count !== 1 ? "s" : ""}
                  </div>
                )}

                <motion.div
                  initial={{ height: 0 }}
                  animate={{
                    height: fixedHeight ?? `${heightPct}%`,
                  }}
                  transition={{
                    duration: 0.6,
                    delay: i * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={[
                    barClass,
                    "w-full rounded-full transition-[opacity,transform] duration-200",
                    hovered === i && slot.count > 0 ? "scale-[1.03] opacity-90" : "",
                    slot.isToday && slot.count > 0
                      ? "ring-2 ring-[#47655E]/45 ring-offset-2 ring-offset-[#FFFEFA]"
                      : slot.isToday
                        ? "ring-1 ring-[#47655E]/25 ring-offset-1 ring-offset-[#FFFEFA]"
                        : "",
                  ].join(" ")}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-3 flex gap-3">
        {slots.map((slot) => (
          <span
            key={`label-${slot.label}`}
            className={`flex-1 text-center text-[10px] font-medium tracking-wide ${
              slot.isToday
                ? "font-bold text-[#47655E]"
                : "text-[#8B8477]"
            }`}
          >
            {slot.label}
          </span>
        ))}
      </div>
    </div>
  );
}
