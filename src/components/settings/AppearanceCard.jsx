"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/hooks/useTheme";
import { Check } from "lucide-react";

const OPTIONS = ["light", "dark", "system"];

export default function AppearanceCard() {
  const { theme, accent, setTheme, setAccent, accents } = useTheme();

  const activeIndex = Math.max(0, OPTIONS.indexOf(theme));

  return (
    <div className="app-surface flex h-full flex-col rounded-2xl p-6">
      <div>
        <p className="app-label mb-2">VISUALS</p>
        <h2 className="font-heading text-2xl font-semibold tracking-[-0.04em] text-text-primary">
          appearance
        </h2>
      </div>

      {/* Theme segmented control */}
      <div
        role="radiogroup"
        aria-label="Theme"
        className="relative mt-6 grid grid-cols-3 rounded-full bg-surface-dim p-1"
      >
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className="absolute bottom-1 top-1 rounded-full bg-primary shadow-sm"
          style={{
            width: "calc(100% / 3 - 6px)",
            left: `calc(${activeIndex * 33.333}% + 4px)`,
          }}
        />
        {OPTIONS.map((opt) => {
          const isActive = theme === opt;
          return (
            <button
              key={opt}
              type="button"
              role="radio"
              aria-checked={isActive}
              onClick={() => setTheme(opt)}
              className={`relative z-10 rounded-full py-2 text-xs tracking-wide transition-colors duration-200 ${
                isActive
                  ? "font-medium text-background"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              {opt.toUpperCase()}
            </button>
          );
        })}
      </div>

      {/* Accent swatches */}
      <p className="app-label mt-6 mb-3">ACCENT</p>
      <div className="flex items-center gap-3">
        {accents.map((a) => {
          const isActive = accent === a.id;
          return (
            <button
              key={a.id}
              type="button"
              aria-label={a.label}
              aria-pressed={isActive}
              onClick={() => setAccent(a.id)}
              className={`group relative h-9 w-9 rounded-full transition-transform duration-200 hover:scale-110`}
              style={{
                background: `linear-gradient(135deg, ${a.mint}, ${a.mint} 60%, ${a.soft})`,
                boxShadow: isActive
                  ? `0 0 0 2px var(--color-surface), 0 0 0 4px ${a.mint}`
                  : "none",
              }}
            >
              {isActive && (
                <Check
                  size={14}
                  strokeWidth={3}
                  className="absolute inset-0 m-auto text-white drop-shadow"
                />
              )}
            </button>
          );
        })}
        <span className="ml-auto text-[11px] font-semibold text-text-muted">
          {accents.find((a) => a.id === accent)?.label}
        </span>
      </div>

      <p className="app-label mt-auto pt-6">Saved on this device</p>
    </div>
  );
}
