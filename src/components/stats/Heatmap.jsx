import { useMemo, useState } from "react";
import { motion } from "framer-motion";

const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];
const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

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

function formatDate(d) {
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export default function Heatmap({ data }) {
  const [hovered, setHovered] = useState(null);
  const [range, setRange] = useState("month");

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const map = useMemo(() => {
    const m = {};
    (data || []).forEach((d) => {
      const date = new Date(d._id);
      const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      m[key] = d.count;
    });
    return m;
  }, [data]);

  const countFor = (d) =>
    map[`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`] || 0;

  const tooltip = hovered && (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="pointer-events-none absolute bottom-[130%] left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-xl border border-white/10 app-glass px-3 py-2 text-[10px] font-semibold text-text-primary shadow-xl"
    >
      {hovered.label}
      <span className="text-accent-mint"> · {hovered.count}</span>
    </motion.div>
  );

  const toggle = (
    <div className="mb-5 flex justify-center">
      <div className="flex rounded-full border border-border-subtle/60 bg-surface-dim p-1">
        {["month", "year"].map((r) => (
          <button
            key={r}
            onClick={() => {
              setRange(r);
              setHovered(null);
            }}
            className={`rounded-full px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.06em] transition-colors duration-200 ${
              range === r
                ? "bg-primary text-background"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            {r}
          </button>
        ))}
      </div>
    </div>
  );

  if (range === "year") {
    const start = new Date(today);
    start.setDate(start.getDate() - 364);
    const dow = (start.getDay() + 6) % 7;
    start.setDate(start.getDate() - dow);

    const weeks = [];
    const cursor = new Date(start);
    while (cursor <= today) {
      const col = [];
      for (let i = 0; i < 7; i++) {
        col.push(new Date(cursor));
        cursor.setDate(cursor.getDate() + 1);
      }
      weeks.push(col);
      if (weeks.length > 53) break;
    }

    return (
      <div className="w-full overflow-x-auto pb-2 custom-scroll-x">
        {toggle}
        <div className="flex min-w-max gap-3">
          <div className="grid shrink-0 grid-rows-7 gap-1 pr-1 pt-5">
            {DAY_LABELS.map((l, i) => (
              <div
                key={i}
                className="flex h-3 items-center text-[8px] font-medium text-text-muted"
              >
                {i % 2 === 1 ? l : ""}
              </div>
            ))}
          </div>
          <div>
            <div className="mb-1 flex gap-1">
              {weeks.map((col, i) => {
                const first = col[0];
                const showLabel = i === 0 || first.getDate() <= 7;
                return (
                  <div
                    key={i}
                    className="w-3 text-center text-[8px] font-medium text-text-muted"
                  >
                    {showLabel ? MONTH_LABELS[first.getMonth()] : ""}
                  </div>
                );
              })}
            </div>
            <div className="flex gap-1">
              {weeks.map((col, wi) => (
                <div key={wi} className="grid grid-rows-7 gap-1">
                  {col.map((d, di) => {
                    const future = d > today;
                    const count = future ? 0 : countFor(d);
                    const intensity = getIntensity(count);
                    const isToday = d.toDateString() === today.toDateString();
                    return (
                      <div
                        key={di}
                        className="relative"
                        onMouseEnter={() =>
                          setHovered({ label: formatDate(d), count })
                        }
                        onMouseLeave={() => setHovered(null)}
                      >
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{
                            delay: (wi * 7 + di) * 0.0008,
                            duration: 0.3,
                          }}
                          className={`size-3 cursor-pointer rounded-[3px] transition-transform duration-200 hover:scale-125 ${
                            future
                              ? "bg-border-subtle/40 opacity-40"
                              : getColorClass(intensity)
                          } ${isToday ? "ring-2 ring-accent-mint/50 ring-offset-1 ring-offset-background" : ""}`}
                        />
                        {hovered?.label === formatDate(d) && tooltip}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-end gap-2 text-[9px] font-medium uppercase tracking-wider text-text-muted">
          Less
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className={`size-3 rounded-[3px] ${getColorClass(i)}`}
            />
          ))}
          More
        </div>
      </div>
    );
  }

  const totalDays = new Date(year, month + 1, 0).getDate();
  const firstDayRaw = new Date(year, month, 1).getDay();
  const offset = firstDayRaw === 0 ? 6 : firstDayRaw - 1;

  const cells = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= totalDays; d++) cells.push(d);

  return (
    <div className="flex w-full flex-col items-center">
      {toggle}
      <div className="grid w-fit grid-cols-7 gap-1 sm:gap-1.5">
        {DAY_LABELS.map((label, i) => (
          <div
            key={`label-${i}`}
            className="flex size-8 items-center justify-center text-[9px] font-medium text-text-muted sm:size-10"
          >
            {label}
          </div>
        ))}

        {cells.map((day, i) => {
          if (!day)
            return (
              <div
                key={`empty-${i}`}
                className="size-8 sm:size-10"
                aria-hidden
              />
            );

          const d = new Date(year, month, day);
          const count = countFor(d);
          const intensity = getIntensity(count);
          const isToday = day === today.getDate();

          return (
            <div
              key={`cell-${i}`}
              className="relative size-8 sm:size-10"
              onMouseEnter={() => setHovered({ label: formatDate(d), count })}
              onMouseLeave={() => setHovered(null)}
            >
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  delay: i * 0.003,
                  type: "spring",
                  stiffness: 200,
                  damping: 18,
                }}
                whileHover={{ scale: 1.25 }}
                className={`size-full cursor-pointer rounded-lg transition-all duration-300 ${getColorClass(intensity)} ${
                  isToday
                    ? "ring-2 ring-accent-mint/40 ring-offset-2 ring-offset-background"
                    : ""
                }`}
              />
              {hovered?.label === formatDate(d) && tooltip}
            </div>
          );
        })}
      </div>
    </div>
  );
}
