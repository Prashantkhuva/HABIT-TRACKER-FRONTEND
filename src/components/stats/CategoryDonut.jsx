"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

/**
 * Fernly donut-card: ring + center read + legend list.
 * slices: [{ label, value, color }]
 */
export default function CategoryDonut({
  slices = [],
  label = "completions",
  size = 160,
  thickness = 22,
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 150);
    return () => clearTimeout(t);
  }, []);

  const total = slices.reduce((a, s) => a + s.value, 0);
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const shown = slices.filter((s) => s.value > 0);

  let offset = 0;
  const arcs = shown.map((s) => {
    const frac = total ? s.value / total : 0;
    const arc = {
      ...s,
      dash: frac * c,
      gap: c - frac * c,
      offset: -offset,
    };
    offset += frac * c;
    return arc;
  });

  return (
    <div className="flex h-full flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
      <div
        className="relative shrink-0 self-center sm:self-auto"
        style={{ width: size, height: size }}
      >
        <svg
          width={size}
          height={size}
          className="-rotate-90"
          role="img"
          aria-label={`${total} ${label} across ${shown.length} categories`}
        >
          {total === 0 ? (
            <circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke="var(--color-border-subtle)"
              strokeWidth={thickness}
              opacity="0.5"
            />
          ) : (
            arcs.map((a) => (
              <motion.circle
                key={a.label}
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke={a.color}
                strokeWidth={thickness}
                strokeLinecap="butt"
                strokeDasharray={`${mounted ? a.dash : 0} ${c}`}
                strokeDashoffset={a.offset}
                initial={false}
                animate={{
                  strokeDasharray: `${mounted ? a.dash : 0} ${c}`,
                  strokeDashoffset: a.offset,
                }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              />
            ))
          )}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-heading text-[24px] font-semibold leading-none tracking-[-0.035em] text-text-primary sm:text-[28px]">
            {total}
          </span>
          <span className="app-label mt-0.5">{label}</span>
        </div>
      </div>

      <div className="min-w-0 flex-1">
        {shown.length === 0 ? (
          <div className="app-empty">No completions in this period</div>
        ) : (
          <ul className="flex flex-col gap-2.5">
            {arcs
              .slice()
              .sort((a, b) => b.value - a.value)
              .map((a) => {
                const pct = total ? Math.round((a.value / total) * 100) : 0;
                return (
                  <li
                    key={a.label}
                    className="flex items-center justify-between gap-3 border-b border-border-subtle/60 pb-2 last:border-0 last:pb-0"
                  >
                    <span className="flex min-w-0 items-center gap-2.5">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ background: a.color }}
                      />
                      <span className="truncate text-xs font-medium text-text-primary">
                        {a.label}
                      </span>
                    </span>
                    <span className="shrink-0 text-[11px] font-medium text-text-muted tabular-nums">
                      {a.value}
                      <span className="ml-1.5 text-text-muted/60">{pct}%</span>
                    </span>
                  </li>
                );
              })}
          </ul>
        )}
      </div>
    </div>
  );
}
