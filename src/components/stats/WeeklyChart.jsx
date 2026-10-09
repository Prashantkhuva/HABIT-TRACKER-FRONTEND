import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function normalizeWeeklyChartData(data = []) {
  const WEEKDAY_SHORT = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  const today = new Date().getDay();
  const todayIdx = today === 0 ? 6 : today - 1;

  const slots = WEEKDAY_SHORT.map((label, index) => ({
    label,
    count: 0,
    prev: 0,
    isToday: index === todayIdx,
  }));

  const API_DAY_MAP = {
    Mon: 0,
    Monday: 0,
    Tue: 1,
    Tuesday: 1,
    Wed: 2,
    Wednesday: 2,
    Thu: 3,
    Thursday: 3,
    Fri: 4,
    Friday: 4,
    Sat: 5,
    Saturday: 5,
    Sun: 6,
    Sunday: 6,
  };

  data.forEach((entry, i) => {
    const dayStr = entry?.day;
    let idx = dayStr != null ? API_DAY_MAP[dayStr] : null;
    if (
      idx == null &&
      typeof dayStr === "number" &&
      dayStr >= 1 &&
      dayStr <= 7
    ) {
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
  if (ratio >= 0.75)
    return "bg-gradient-to-t from-accent-mint via-[#5F8478] to-[#9EC9BE]";
  if (ratio >= 0.4)
    return "bg-gradient-to-t from-[#3D5A4F] via-[#5F8478] to-[#9EC9BE]";
  return "bg-gradient-to-t from-[#5A7A6A] to-[#B8DDD4]";
}

const HATCH =
  "[background-image:repeating-linear-gradient(45deg,transparent,transparent_4px,rgba(19,26,21,0.14)_4px,rgba(19,26,21,0.14)_6px)]";

export default function WeeklyChart({ data, prev = [], planned = 0 }) {
  const slots = useMemo(() => {
    const s = normalizeWeeklyChartData(data);
    s.forEach((slot, i) => {
      slot.prev = Number(prev[i]) || 0;
    });
    return s;
  }, [data, prev]);

  const maxCount = Math.max(...slots.map((s) => s.count), 1);
  const scaleMax = Math.max(maxCount, planned, 1);
  const [hovered, setHovered] = useState(null);

  const isEmpty = slots.every((s) => s.count === 0);
  const prevMax = Math.max(...slots.map((s) => s.prev), 1);
  const showPrevLine = slots.some((s) => s.prev > 0);

  // dashed previous-period polyline over the columns (y mapped on same scale)
  const prevPoints = slots
    .map((s, i) => `${((i + 0.5) / 7) * 100},${(1 - s.prev / scaleMax) * 100}`)
    .join(" ");

  return (
    <div className="w-full">
      <div className="relative w-full h-[180px]">
        <div className="absolute inset-0 flex gap-2 sm:gap-3">
          {slots.map((slot, i) => {
            const gradient = getBarGradient(slot.count, scaleMax);
            const heightPct =
              slot.count > 0 ? Math.max((slot.count / scaleMax) * 100, 8) : 0;
            const plannedPct =
              planned > 0 ? Math.max((planned / scaleMax) * 100, 10) : 0;

            return (
              <div
                key={slot.label}
                className="relative flex h-full flex-1 flex-col justify-end"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Planned / target ghost (hatched) */}
                {plannedPct > 0 && (
                  <div
                    aria-hidden="true"
                    className={`absolute bottom-0 left-0 right-0 rounded-t-lg rounded-b-sm border border-border-subtle/60 bg-surface-dim/60 ${HATCH}`}
                    style={{ height: `${plannedPct}%` }}
                  />
                )}

                <AnimatePresence>
                  {hovered === i && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      className="absolute -top-12 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-xl bg-primary/95 px-3 py-2 text-[11px] font-semibold text-background shadow-xl backdrop-blur-xl"
                    >
                      <span className="text-accent-mint">{slot.count}</span>{" "}
                      done
                      {slot.prev > 0 && (
                        <>
                          {" · "}
                          <span className="text-background/60">
                            {slot.prev}
                          </span>{" "}
                          prev
                        </>
                      )}
                      {planned > 0 && (
                        <>
                          {" · "}
                          <span className="text-background/60">
                            {planned}
                          </span>{" "}
                          planned
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: `${heightPct}%`, opacity: 1 }}
                  transition={{
                    duration: 0.7,
                    delay: i * 0.09,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={[
                    gradient,
                    "relative z-10 w-full rounded-t-full rounded-b-sm transition-all duration-300 overflow-hidden",
                    hovered === i && slot.count > 0
                      ? "scale-[1.04] shadow-lg"
                      : "",
                    slot.isToday
                      ? "ring-2 ring-accent-mint/30 ring-offset-2 ring-offset-background"
                      : "",
                  ].join(" ")}
                >
                  {slot.count > 0 && (
                    <motion.div
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{
                        repeat: Infinity,
                        duration: 2.5,
                        ease: "linear",
                        delay: i * 0.1,
                      }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                    />
                  )}
                </motion.div>

                {slot.count > 0 && (
                  <motion.span
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.08 }}
                    style={{ bottom: `calc(${heightPct}% + 5px)` }}
                    className="absolute inset-x-0 z-10 text-center text-[9px] font-medium text-accent-mint"
                  >
                    {slot.count}
                  </motion.span>
                )}
              </div>
            );
          })}
        </div>

        {/* Previous-period dashed line overlay */}
        {showPrevLine && (
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full"
          >
            <motion.polyline
              points={prevPoints}
              fill="none"
              stroke="rgba(19,26,21,0.45)"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              vectorEffect="non-scaling-stroke"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            />
          </svg>
        )}

        {/* Empty state */}
        {isEmpty && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1.5">
            <p className="rounded-full border border-border-subtle bg-surface px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.06em] text-text-muted shadow-sm">
              No completions yet
            </p>
            <p className="text-[10px] text-text-muted/70">
              Hatched bars show your daily plan
            </p>
          </div>
        )}
      </div>

      <div className="mt-2 flex gap-2 sm:gap-3">
        {slots.map((slot) => (
          <span
            key={`label-${slot.label}`}
            className={`flex-1 text-center text-[9px] sm:text-[10px] font-medium tracking-wider ${
              slot.isToday ? "text-accent-mint" : "text-text-muted"
            }`}
          >
            {slot.label}
          </span>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center gap-4 text-[9px] font-medium uppercase tracking-[0.06em] text-text-muted">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-4 rounded-sm bg-gradient-to-t from-accent-mint to-[#9EC9BE]" />
          This week
        </span>
        <span className="flex items-center gap-1.5">
          <svg width="16" height="4" aria-hidden="true">
            <line
              x1="0"
              y1="2"
              x2="16"
              y2="2"
              stroke="rgba(19,26,21,0.45)"
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />
          </svg>
          Previous ({prevMax}/wk max)
        </span>
        {planned > 0 && (
          <span className="flex items-center gap-1.5">
            <span
              className={`h-2.5 w-4 rounded-sm border border-border-subtle bg-surface-dim ${HATCH}`}
            />
            Planned ({planned})
          </span>
        )}
      </div>
    </div>
  );
}
