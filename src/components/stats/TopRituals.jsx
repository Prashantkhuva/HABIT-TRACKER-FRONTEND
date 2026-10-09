"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, BookOpen } from "lucide-react";
import { categoryMap } from "../Habit/categoryMap";

/**
 * Fernly leaders-card: ordered top rituals by completions.
 * items: [{ _id, title, color, category, count, streak? }]
 */
export default function TopRituals({ items = [], periodLabel = "30d" }) {
  if (!items.length) {
    return (
      <div className="app-empty">Complete rituals to build the leaderboard</div>
    );
  }

  const max = Math.max(...items.map((i) => i.count), 1);

  return (
    <ol className="flex flex-col gap-1">
      {items.map((item, i) => {
        const Icon = categoryMap[item.category] || BookOpen;
        const barPct = Math.round((item.count / max) * 100);
        return (
          <motion.li
            key={item._id || item.title}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.05 * i,
              duration: 0.4,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Link
              href={`/rituals/${item._id}`}
              className="group flex items-center gap-3 rounded-[var(--r-sm)] px-2 py-2.5 transition-colors hover:bg-surface-dim"
            >
              <span
                className={`w-5 shrink-0 text-center text-[11px] font-semibold tabular-nums ${
                  i === 0 ? "text-accent-mint" : "text-text-muted"
                }`}
              >
                {i + 1}
              </span>
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                style={{
                  background: item.color
                    ? `${item.color}18`
                    : "var(--color-surface-dim)",
                  color: item.color || "var(--color-text-muted)",
                }}
              >
                <Icon size={14} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] font-medium text-text-primary">
                  {item.title}
                </span>
                <span className="mt-1 block h-1 w-full overflow-hidden rounded-full bg-border-subtle/60">
                  <motion.span
                    initial={{ width: 0 }}
                    animate={{ width: `${barPct}%` }}
                    transition={{
                      delay: 0.15 + i * 0.05,
                      duration: 0.7,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="block h-full rounded-full"
                    style={{
                      background: item.color || "var(--color-accent-mint)",
                    }}
                  />
                </span>
              </span>
              <span className="shrink-0 text-right">
                <span className="block text-[13px] font-semibold tabular-nums text-text-primary">
                  {item.count}
                </span>
                <span className="block text-[9px] uppercase tracking-[0.06em] text-text-muted">
                  {periodLabel}
                </span>
              </span>
              <ArrowUpRight
                size={14}
                className="shrink-0 text-text-muted opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent-mint group-hover:opacity-100"
              />
            </Link>
          </motion.li>
        );
      })}
    </ol>
  );
}
