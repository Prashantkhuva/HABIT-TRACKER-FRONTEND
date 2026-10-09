import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Sprout,
  Target,
  Star,
  Flame,
  Gem,
  BookOpen,
  Award,
  Crown,
  Lock,
} from "lucide-react";
import { getAchievements } from "../../lib/achievements";

const ICON_MAP = { Sprout, Target, Star, Flame, Gem, BookOpen, Award, Crown };

/** Longest run of consecutive local days with >=1 completion, per habit. */
function bestStreakFor(logs, habitId) {
  const dayMs = 86400000;
  const days = new Set();
  logs.forEach((l) => {
    if (l.completed === false) return;
    const ref = typeof l.habit === "object" && l.habit ? l.habit._id : l.habit;
    if (ref !== habitId) return;
    const t = Number(l.date);
    if (!Number.isNaN(t)) days.add(Math.floor(t / dayMs));
  });
  const sorted = [...days].sort((a, b) => a - b);
  let best = 0;
  let run = 0;
  let prev = null;
  sorted.forEach((d) => {
    run = prev !== null && d === prev + 1 ? run + 1 : 1;
    best = Math.max(best, run);
    prev = d;
  });
  return best;
}

export default function MilestonesCard({ stats, logs = [], habits = [] }) {
  const achievements = useMemo(() => {
    const habitIds = habits.map((h) => h._id);
    const streaks = habitIds.map((id) => bestStreakFor(logs, id));
    const totalCompleted = logs.filter((l) => l.completed !== false).length;
    return getAchievements(stats, streaks, totalCompleted);
  }, [stats, logs, habits]);

  const unlocked = achievements.filter((a) => a.unlocked).length;

  return (
    <div>
      <div className="flex items-end justify-between gap-4 mb-5">
        <div>
          <p className="app-label mb-2">Milestones</p>
          <h2 className="font-heading text-[19px] font-medium tracking-[-0.02em] text-text-primary">
            earned badges
          </h2>
        </div>
        <span className="shrink-0 rounded-full bg-surface-dim px-3.5 py-1.5 text-[10px] font-medium uppercase tracking-[0.06em] text-text-muted">
          {unlocked}/{achievements.length}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {achievements.map((a, i) => {
          const Icon = ICON_MAP[a.icon] || Award;
          return (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: i * 0.05,
                duration: 0.45,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={a.unlocked ? { y: -3 } : {}}
              className={`relative overflow-hidden rounded-2xl border p-4 transition-colors duration-300 ${
                a.unlocked
                  ? "border-border-subtle bg-surface hover:shadow-md"
                  : "border-dashed border-border-subtle bg-surface-dim/40"
              }`}
              title={a.desc}
            >
              <div
                className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${
                  a.unlocked ? "" : "bg-surface-dim grayscale"
                }`}
                style={
                  a.unlocked
                    ? { backgroundColor: `${a.color}1a`, color: a.color }
                    : undefined
                }
              >
                {a.unlocked ? (
                  <Icon size={18} />
                ) : (
                  <Lock size={15} className="text-text-muted/60" />
                )}
              </div>
              <p
                className={`text-[11px] font-medium uppercase tracking-[0.06em] ${
                  a.unlocked ? "text-text-primary" : "text-text-muted/70"
                }`}
              >
                {a.label}
              </p>
              <p className="mt-0.5 text-[10px] leading-snug text-text-muted">
                {a.desc}
              </p>
              {a.unlocked && (
                <span
                  className="absolute right-3 top-3 h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: a.color }}
                />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
