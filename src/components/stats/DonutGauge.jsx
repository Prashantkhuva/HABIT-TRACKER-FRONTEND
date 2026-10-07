"use client";

import { useEffect, useState } from "react";

export default function DonutGauge({
  value = 0,
  size = 180,
  thickness = 16,
  label = "today",
  caption,
}) {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setPct(Math.min(Math.max(value, 0), 100)), 150);
    return () => clearTimeout(t);
  }, [value]);

  const r = (size - thickness) / 2;
  const circumference = 2 * Math.PI * r;
  const dash = (pct / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="-rotate-90"
          role="img"
          aria-label={`${pct}% complete`}
        >
          <defs>
            <pattern
              id="hatch-track"
              width="7"
              height="7"
              patternTransform="rotate(45)"
              patternUnits="userSpaceOnUse"
            >
              <rect width="7" height="7" fill="transparent" />
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="7"
                stroke="currentColor"
                strokeWidth="2.5"
                className="text-border-subtle"
              />
            </pattern>
          </defs>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="url(#hatch-track)"
            strokeWidth={thickness}
            opacity="0.9"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="var(--color-accent-mint)"
            strokeWidth={thickness}
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circumference}`}
            style={{
              transition:
                "stroke-dasharray 1.2s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-heading text-3xl font-black tracking-[-0.05em] text-text-primary sm:text-4xl">
            {Math.round(pct)}%
          </span>
          <span className="app-label mt-0.5">{label}</span>
        </div>
      </div>
      {caption && (
        <p className="mt-3 text-center text-xs text-text-muted">{caption}</p>
      )}
    </div>
  );
}
