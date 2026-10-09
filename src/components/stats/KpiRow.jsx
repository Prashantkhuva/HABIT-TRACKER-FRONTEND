"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Flame,
  Target,
  Trophy,
  CheckCircle2,
} from "lucide-react";

function useCountUp(value, duration = 900) {
  const [display, setDisplay] = useState(0);
  const raf = useRef(null);

  useEffect(() => {
    const start = performance.now();
    const from = 0;
    const step = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(from + (value - from) * eased));
      if (t < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [value, duration]);

  return display;
}

function Sparkline({ points, className = "" }) {
  if (!points || points.length < 2) {
    return <div className={`h-8 ${className}`} />;
  }
  const max = Math.max(...points, 1);
  const w = 100;
  const h = 28;
  const step = w / (points.length - 1);
  const coords = points.map((p, i) => [i * step, h - (p / max) * (h - 4) - 2]);
  const d = coords
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`)
    .join(" ");
  const area = `${d} L${w},${h} L0,${h} Z`;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      className={`h-8 w-full ${className}`}
      aria-hidden="true"
    >
      <path d={area} fill="currentColor" opacity="0.1" />
      <path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

function KpiCard({
  label,
  value,
  suffix,
  sub,
  icon: Icon,
  points,
  featured,
  href,
  index,
  onGo,
}) {
  const numeric = typeof value === "number" ? value : 0;
  const counted = useCountUp(numeric);

  return (
    <motion.button
      type="button"
      onClick={() => onGo(href)}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.06 * index,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`group relative overflow-hidden rounded-[var(--r-md)] border p-5 text-left transition-transform duration-300 hover:-translate-y-1 ${
        featured
          ? "border-transparent bg-primary text-background"
          : "border-border-subtle/60 bg-surface hover:shadow-[var(--shadow-card)]"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p
            className={`text-[10px] font-medium uppercase tracking-[0.06em] ${featured ? "text-background/70" : "text-text-muted"}`}
          >
            {label}
          </p>
          <p
            className={`mt-2 font-heading text-[28px] font-semibold tracking-[-0.035em] sm:text-[32px] ${featured ? "" : "text-text-primary"}`}
          >
            {typeof value === "number" ? counted : value}
            {suffix && <span className="text-lg font-medium">{suffix}</span>}
          </p>
          <p
            className={`mt-1 text-[11px] font-medium ${featured ? "text-background/70" : "text-text-muted"}`}
          >
            {sub}
          </p>
        </div>
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
            featured
              ? "bg-background/15 text-background"
              : "border border-border-subtle bg-surface-dim text-text-muted group-hover:text-accent-mint"
          }`}
        >
          <ArrowUpRight size={15} />
        </span>
      </div>
      {points && (
        <div
          className={`mt-3 ${featured ? "text-background" : "text-accent-mint"}`}
        >
          <Sparkline points={points} />
        </div>
      )}
      {Icon && (
        <div
          className={`absolute -right-4 -bottom-4 h-20 w-20 rounded-full opacity-[0.07] ${featured ? "bg-background" : "bg-accent-mint"}`}
        />
      )}
    </motion.button>
  );
}

export default function KpiRow({ stats, weeklyData, streak = 0, onNavigate }) {
  const done = stats?.completedToday ?? 0;
  const total = stats?.totalHabits ?? 0;
  const rate = stats?.completionRate ?? 0;
  const points = Array.isArray(weeklyData)
    ? weeklyData.map((d) => d?.count ?? 0)
    : [];

  const go = (href) => href && onNavigate?.(href);

  return (
    <div className="mb-5 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
      <KpiCard
        index={0}
        featured
        label="today's done"
        value={`${done}/${total}`}
        sub={
          done >= total && total > 0
            ? "perfect day"
            : `${Math.max(total - done, 0)} to go`
        }
        icon={CheckCircle2}
        href="/rituals"
        onGo={go}
      />
      <KpiCard
        index={1}
        label="current streak"
        value={streak}
        suffix={streak === 1 ? " day" : " days"}
        sub="best run"
        icon={Flame}
        href="/statistics"
        onGo={go}
      />
      <KpiCard
        index={2}
        label="completion"
        value={rate}
        suffix="%"
        sub="today's rhythm"
        icon={Target}
        points={points}
        href="/statistics"
        onGo={go}
      />
      <KpiCard
        index={3}
        label="active rituals"
        value={total}
        sub="in rotation"
        icon={Trophy}
        href="/rituals"
        onGo={go}
      />
    </div>
  );
}
