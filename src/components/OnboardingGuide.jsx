"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Target, BarChart2 } from "lucide-react";

const STEPS = [
  {
    icon: Sparkles,
    title: "Create Your First Ritual",
    desc: "Tap 'New Ritual' to define a daily habit. Pick a category, color, and type that feels right.",
  },
  {
    icon: Target,
    title: "Complete Habits Daily",
    desc: "Check off rituals each day. Add reflections to build a journal of your progress.",
  },
  {
    icon: BarChart2,
    title: "Track Your Progress",
    desc: "Visit Statistics to see your streaks, weekly chart, heatmap, and time insights.",
  },
];

export default function OnboardingGuide({ onDismiss }) {
  const [step, setStep] = useState(0);

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.92, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-border-subtle/60 bg-surface p-8 shadow-2xl"
      >
        <div className="flex items-center gap-2 mb-6">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i === step ? "bg-primary" : i < step ? "bg-accent-mint" : "bg-border-subtle"
              }`}
            />
          ))}
        </div>

        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-mint/10">
          <current.icon size={32} className="text-accent-mint" />
        </div>

        <h2 className="font-heading text-2xl font-bold tracking-[-0.04em] text-text-primary mb-3">
          {current.title}
        </h2>
        <p className="text-sm leading-relaxed text-text-muted mb-8">
          {current.desc}
        </p>

        <div className="flex items-center justify-between">
          <button
            onClick={onDismiss}
            className="text-xs text-text-muted hover:text-text-primary transition-colors"
          >
            Skip tour
          </button>
          <button
            onClick={() => {
              if (isLast) {
                onDismiss();
              } else {
                setStep((s) => s + 1);
              }
            }}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-xs font-bold tracking-wider text-background transition-all hover:bg-primary-soft"
          >
            {isLast ? "Get started" : "Next"}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
