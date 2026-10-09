"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Fernly analytics line+area chart with previous-period dashed line,
 * crosshair, hover dot + tooltip.
 * series / prevSeries: number[] (chronological). labels: string[].
 */
export default function ThroughputChart({
  series = [],
  prevSeries = [],
  labels = [],
  height = 220,
}) {
  const [hoverIdx, setHoverIdx] = useState(null);

  const n = series.length;
  const maxVal = Math.max(...series, ...prevSeries, 1);
  const pad = { top: 16, right: 8, bottom: 4, left: 8 };
  const w = 100;
  const h = 100;
  const innerW = w - pad.left - pad.right;
  const innerH = h - pad.top - pad.bottom;

  const toXY = (val, i, count) => {
    const x = pad.left + (count <= 1 ? innerW / 2 : (i / (count - 1)) * innerW);
    const y = pad.top + (1 - val / maxVal) * innerH;
    return [x, y];
  };

  const { lineD, areaD, prevD, points } = useMemo(() => {
    if (!n) return { lineD: "", areaD: "", prevD: "", points: [] };
    const pts = series.map((v, i) => toXY(v, i, n));
    const line = pts
      .map(
        ([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`,
      )
      .join(" ");
    const area = `${line} L${pts[n - 1][0].toFixed(2)},${h - pad.bottom} L${pts[0][0].toFixed(2)},${h - pad.bottom} Z`;

    let prev = "";
    if (prevSeries.length > 1) {
      prev = prevSeries
        .map((v, i) => {
          const [x, y] = toXY(v, i, prevSeries.length);
          return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
        })
        .join(" ");
    }
    return { lineD: line, areaD: area, prevD: prev, points: pts };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [series, prevSeries, n, maxVal]);

  const isEmpty = !n || series.every((v) => v === 0);
  const hoverPt = hoverIdx != null ? points[hoverIdx] : null;
  const labelStep = Math.max(1, Math.ceil(n / 7));

  return (
    <div className="w-full">
      <div
        className="relative w-full"
        style={{ height }}
        onMouseLeave={() => setHoverIdx(null)}
      >
        {/* grid lines */}
        <svg
          viewBox={`0 0 ${w} ${h}`}
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          {[0.25, 0.5, 0.75].map((f) => (
            <line
              key={f}
              x1={pad.left}
              x2={w - pad.right}
              y1={pad.top + f * innerH}
              y2={pad.top + f * innerH}
              stroke="var(--color-border-subtle)"
              strokeWidth="0.3"
              vectorEffect="non-scaling-stroke"
              opacity="0.7"
            />
          ))}
        </svg>

        {/* chart */}
        <svg
          viewBox={`0 0 ${w} ${h}`}
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
          role="img"
          aria-label="Completions over time"
        >
          <defs>
            <linearGradient id="tp-area" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor="var(--color-accent-mint)"
                stopOpacity="0.22"
              />
              <stop
                offset="100%"
                stopColor="var(--color-accent-mint)"
                stopOpacity="0.02"
              />
            </linearGradient>
          </defs>

          {prevD && (
            <motion.path
              d={prevD}
              fill="none"
              stroke="var(--color-text-muted)"
              strokeWidth="1.25"
              strokeDasharray="4 4"
              vectorEffect="non-scaling-stroke"
              opacity="0.45"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 1.2,
                delay: 0.3,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
          )}

          {!isEmpty && (
            <>
              <motion.path
                d={areaD}
                fill="url(#tp-area)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.25 }}
              />
              <motion.path
                d={lineD}
                fill="none"
                stroke="var(--color-accent-mint)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              />
            </>
          )}

          {/* crosshair */}
          {hoverPt && (
            <line
              x1={hoverPt[0]}
              x2={hoverPt[0]}
              y1={pad.top}
              y2={h - pad.bottom}
              stroke="var(--color-accent-mint)"
              strokeWidth="0.4"
              vectorEffect="non-scaling-stroke"
              opacity="0.4"
            />
          )}
        </svg>

        {/* hover dots (html for size consistency) */}
        {hoverPt && (
          <span
            className="pointer-events-none absolute z-10 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-surface bg-accent-mint shadow-sm"
            style={{
              left: `${hoverPt[0]}%`,
              top: `${hoverPt[1]}%`,
            }}
          />
        )}

        {/* hit areas */}
        <div className="absolute inset-0 flex">
          {series.map((v, i) => (
            <button
              key={i}
              type="button"
              tabIndex={-1}
              aria-label={`${labels[i] ?? i}: ${v}`}
              className="h-full flex-1 cursor-default focus:outline-none"
              onMouseEnter={() => setHoverIdx(i)}
            />
          ))}
        </div>

        {/* tooltip */}
        <AnimatePresence>
          {hoverIdx != null && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.15 }}
              className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-xl bg-primary px-3 py-1.5 text-[11px] font-medium text-background shadow-[var(--shadow-card)]"
              style={{
                left: `${points[hoverIdx]?.[0] ?? 0}%`,
                top: `${(points[hoverIdx]?.[1] ?? 0) - 2}%`,
              }}
            >
              <span className="text-accent-mint">{series[hoverIdx]}</span>
              {" done"}
              {prevSeries[hoverIdx] != null && (
                <span className="text-background/55">
                  {" · "}
                  {prevSeries[hoverIdx]} prev
                </span>
              )}
              {labels[hoverIdx] && (
                <span className="ml-1.5 text-background/45">
                  {labels[hoverIdx]}
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {isEmpty && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <p className="rounded-full border border-border-subtle bg-surface px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.06em] text-text-muted shadow-sm">
              No completions yet
            </p>
          </div>
        )}
      </div>

      {/* x labels */}
      <div className="mt-2 flex w-full">
        {labels.map((lab, i) => (
          <span
            key={`${lab}-${i}`}
            className={`flex-1 text-center text-[9px] font-medium tracking-wide text-text-muted ${
              i % labelStep !== 0 && n > 10 ? "opacity-0 sm:opacity-100" : ""
            } ${hoverIdx === i ? "text-accent-mint" : ""}`}
          >
            {i % labelStep === 0 || n <= 10 ? lab : ""}
          </span>
        ))}
      </div>

      {/* key */}
      <div className="mt-3 flex flex-wrap items-center gap-4 text-[9px] font-medium uppercase tracking-[0.06em] text-text-muted">
        <span className="flex items-center gap-1.5">
          <svg width="16" height="6" aria-hidden="true">
            <line
              x1="0"
              y1="3"
              x2="16"
              y2="3"
              stroke="var(--color-accent-mint)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          This period
        </span>
        {prevSeries.some((v) => v > 0) && (
          <span className="flex items-center gap-1.5">
            <svg width="16" height="6" aria-hidden="true">
              <line
                x1="0"
                y1="3"
                x2="16"
                y2="3"
                stroke="var(--color-text-muted)"
                strokeWidth="1.5"
                strokeDasharray="4 3"
                opacity="0.55"
              />
            </svg>
            Previous
          </span>
        )}
      </div>
    </div>
  );
}
