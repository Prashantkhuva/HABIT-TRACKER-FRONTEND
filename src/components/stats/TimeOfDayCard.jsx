import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Sunrise, Sun, Moon } from "lucide-react";

const PHASES = [
  {
    key: "morning",
    label: "Morning",
    hint: "00–11",
    icon: Sunrise,
    from: 0,
    to: 12,
  },
  {
    key: "afternoon",
    label: "Afternoon",
    hint: "12–16",
    icon: Sun,
    from: 12,
    to: 17,
  },
  {
    key: "evening",
    label: "Evening",
    hint: "17–23",
    icon: Moon,
    from: 17,
    to: 24,
  },
];

export default function TimeOfDayCard({ logs = [] }) {
  const [hovered, setHovered] = useState(null);
  const [hoveredHour, setHoveredHour] = useState(null);

  const { hourly, phases } = useMemo(() => {
    const hourly = Array(24).fill(0);
    const phases = { morning: 0, afternoon: 0, evening: 0 };
    logs.forEach((l) => {
      if (l.completed === false) return;
      const when = l.completedAt || l.createdAt || l.date;
      const h = new Date(when).getHours();
      if (Number.isNaN(h)) return;
      hourly[h]++;
      if (h < 12) phases.morning++;
      else if (h < 17) phases.afternoon++;
      else phases.evening++;
    });
    return { hourly, phases };
  }, [logs]);

  const max = Math.max(...hourly, 1);
  const peakHour = hourly.indexOf(Math.max(...hourly));
  const total = phases.morning + phases.afternoon + phases.evening;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-end justify-between gap-4 mb-5">
        <div>
          <p className="app-label mb-2">Rhythm Clock</p>
          <h2 className="font-heading text-xl font-black tracking-[-0.04em] text-text-primary">
            time of day
          </h2>
        </div>
        <span className="shrink-0 rounded-full bg-surface-dim px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-text-muted">
          {total > 0 ? `peak ${peakHour}:00` : "no data"}
        </span>
      </div>

      {/* 24h histogram */}
      <div className="relative flex h-32 items-end gap-[3px] rounded-2xl border border-border-subtle/60 bg-surface-dim/40 px-3 pb-2 pt-3">
        {hourly.map((count, h) => {
          const pct =
            total > 0 ? Math.max((count / max) * 100, count > 0 ? 8 : 2) : 2;
          const isPhase =
            hovered == null ||
            (hovered === "morning" && h < 12) ||
            (hovered === "afternoon" && h >= 12 && h < 17) ||
            (hovered === "evening" && h >= 17);
          return (
            <div
              key={h}
              className="group relative flex flex-1 flex-col justify-end"
              onMouseEnter={() => setHoveredHour(h)}
              onMouseLeave={() => setHoveredHour(null)}
            >
              <motion.div
                initial={{ height: 2 }}
                animate={{ height: `${pct}%` }}
                transition={{
                  delay: h * 0.02,
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`w-full rounded-t-[3px] transition-colors duration-200 ${
                  count > 0
                    ? hoveredHour != null && hoveredHour === h
                      ? "bg-primary"
                      : "bg-accent-mint/80"
                    : "bg-border-subtle"
                } ${isPhase ? "" : "opacity-30"}`}
              />
            </div>
          );
        })}
        <div className="pointer-events-none absolute inset-x-3 bottom-0 flex justify-between text-[8px] font-bold tracking-wider text-text-muted/70">
          <span>00</span>
          <span>06</span>
          <span>12</span>
          <span>18</span>
          <span>23</span>
        </div>
      </div>

      {/* Phase split */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        {PHASES.map(({ key, label, hint, icon: Icon }) => {
          const val = phases[key];
          const pct = total > 0 ? Math.round((val / total) * 100) : 0;
          const active = hovered === key;
          return (
            <button
              key={key}
              type="button"
              onMouseEnter={() => setHovered(key)}
              onMouseLeave={() => setHovered(null)}
              className={`rounded-2xl border p-3 text-left transition-all duration-200 ${
                active
                  ? "border-accent-mint/40 bg-accent-mint/8 shadow-sm"
                  : "border-border-subtle/60 bg-surface hover:border-accent-mint/30"
              }`}
            >
              <div className="flex items-center justify-between">
                <Icon size={13} className="text-accent-mint" />
                <span className="text-[9px] font-bold uppercase tracking-wider text-text-muted">
                  {hint}
                </span>
              </div>
              <p className="mt-1.5 font-heading text-xl font-black leading-none tracking-[-0.04em] text-text-primary">
                {pct}%
              </p>
              <p className="mt-0.5 text-[9px] uppercase tracking-[0.14em] text-text-muted">
                {label} · {val}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
