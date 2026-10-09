import { motion } from "framer-motion";

/**
 * Full-bleed mini trend for stat tiles.
 * variant "line" — area+line (points: number[])
 * variant "bars" — mini columns (points: number[])
 */
export default function Sparkline({
  points = [],
  variant = "line",
  className = "",
  delay = 0,
}) {
  if (!points.length) return null;

  if (variant === "bars") {
    const max = Math.max(...points, 1);
    return (
      <div
        aria-hidden="true"
        className={`flex h-7 w-full items-end gap-[3px] ${className}`}
      >
        {points.map((p, i) => (
          <motion.span
            key={i}
            initial={{ height: 2 }}
            animate={{ height: `${Math.max((p / max) * 100, 8)}%` }}
            transition={{
              duration: 0.5,
              delay: delay + i * 0.05,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex-1 rounded-sm bg-current opacity-70"
          />
        ))}
      </div>
    );
  }

  const max = Math.max(...points, 1);
  const w = 100;
  const h = 28;
  const step = points.length > 1 ? w / (points.length - 1) : w;
  const coords = points.map((p, i) => [i * step, h - (p / max) * (h - 5) - 2]);
  const d = coords
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`)
    .join(" ");
  const area = `${d} L${w},${h} L0,${h} Z`;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      className={`h-7 w-full ${className}`}
    >
      <path d={area} fill="currentColor" opacity="0.1" />
      <motion.path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  );
}
