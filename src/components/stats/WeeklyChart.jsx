import { useState } from "react";
import { motion } from "framer-motion";

export default function WeeklyChart({ data }) {
  const counts = data.map((d) => d.count || 0);
  const max = Math.max(...counts, 1);
  const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  const [hovered, setHovered] = useState(null);

  return (
    <>
      {/* Container — fixed height with relative positioning */}
      <div className="relative w-full" style={{ height: "160px" }}>
        <div className="absolute inset-0 flex items-end gap-3">
          {counts.map((val, i) => {
            const heightPct = Math.max((val / max) * 100, 5);
            return (
              <div
                key={i}
                className="flex-1 relative flex flex-col justify-end"
                style={{ height: "100%" }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Tooltip */}
                {hovered === i && (
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap z-10 bg-primary text-surface-dim">
                    {days[i]} — {val} habit{val !== 1 ? "s" : ""}
                  </div>
                )}

                {/* Bar */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPct}%` }}
                  transition={{
                    duration: 0.6,
                    delay: i * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={`${
                    hovered === i
                      ? "bg-primary-soft"
                      : val > 0
                        ? "bg-primary"
                        : "bg-border-subtle"
                  }`}
                  style={{
                    width: "100%",
                    borderRadius: "999px 999px 0 0",
                    minHeight: "8px",
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
