"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const HATCH =
  "[background-image:repeating-linear-gradient(45deg,transparent,transparent_3px,rgba(19,26,21,0.12)_3px,rgba(19,26,21,0.12)_5px)]";

/**
 * Fernly-style semicircular progress gauge.
 * Segments: done (mint) / remaining (border) / planned (hatch, optional).
 */
export default function SemicircleGauge({
  done = 0,
  remaining = 0,
  planned = 0,
  size = 200,
  label = "complete",
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 120);
    return () => clearTimeout(t);
  }, []);

  const plannedExtra = Math.max(planned - (done + remaining), 0);
  const grandTotal = Math.max(done + remaining + plannedExtra, 1);
  const donePct = Math.round((done / grandTotal) * 100);

  const thickness = Math.max(14, Math.round(size * 0.1));
  const r = size / 2 - thickness / 2 - 2;
  const cx = size / 2;
  const cy = size / 2 + 2;
  const halfLen = Math.PI * r;

  const trackD = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;

  const segDone = (done / grandTotal) * halfLen;
  const segRemaining = (remaining / grandTotal) * halfLen;
  const segPlanned = (plannedExtra / grandTotal) * halfLen;

  const legends = [
    { key: "done", label: "Done", value: done, cls: "bg-accent-mint" },
    {
      key: "remaining",
      label: "Remaining",
      value: remaining,
      cls: "bg-border-subtle",
    },
  ];
  if (plannedExtra > 0) {
    legends.push({
      key: "planned",
      label: "Planned",
      value: plannedExtra,
      cls: `border border-border-subtle bg-surface-dim ${HATCH}`,
    });
  }

  return (
    <div className="flex h-full flex-col items-center justify-between gap-4">
      <div
        className="relative w-full"
        style={{ maxWidth: size, height: size / 2 + 8 }}
      >
        <svg
          width="100%"
          height={size / 2 + 8}
          viewBox={`0 0 ${size} ${size / 2 + 8}`}
          role="img"
          aria-label={`${donePct}% complete`}
        >
          <path
            d={trackD}
            fill="none"
            stroke="var(--color-border-subtle)"
            strokeWidth={thickness}
            strokeLinecap="round"
            opacity="0.5"
          />
          {remaining > 0 && (
            <path
              d={trackD}
              fill="none"
              stroke="var(--color-accent-mint)"
              strokeWidth={thickness}
              strokeLinecap="butt"
              strokeDasharray={`${segDone + segRemaining} ${halfLen}`}
              opacity="0.28"
            />
          )}
          {plannedExtra > 0 && (
            <path
              d={trackD}
              fill="none"
              stroke="var(--color-border-subtle)"
              strokeWidth={thickness}
              strokeDasharray={`${segPlanned} ${halfLen}`}
              strokeDashoffset={-(segDone + segRemaining)}
              opacity="0.55"
            />
          )}
          <motion.path
            d={trackD}
            fill="none"
            stroke="var(--color-accent-mint)"
            strokeWidth={thickness}
            strokeLinecap="round"
            initial={{ strokeDasharray: `0 ${halfLen}` }}
            animate={{
              strokeDasharray: `${mounted ? segDone : 0} ${halfLen}`,
            }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center">
          <span className="font-heading text-[28px] font-semibold leading-none tracking-[-0.035em] text-text-primary sm:text-[32px]">
            {donePct}%
          </span>
          <span className="app-label mt-1">{label}</span>
        </div>
      </div>

      <div className="flex w-full flex-wrap items-center justify-center gap-x-4 gap-y-2">
        {legends.map((l) => (
          <span
            key={l.key}
            className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.06em] text-text-muted"
          >
            <span className={`h-2.5 w-2.5 rounded-[3px] ${l.cls}`} />
            {l.label} ({l.value})
          </span>
        ))}
      </div>
    </div>
  );
}
