import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Flame, Trophy, Zap, Medal } from "lucide-react";
import { getLongestStreak } from "../../api/dashboard-api";
import gsap from "gsap";

const medalIcons = [Trophy, Medal, Zap];
const medalLabels = ["Gold", "Silver", "Bronze"];
const rankColors = ["#D4BB06", "#9CB8B0", "#C8A88E"];

export default function StreakPanel() {
  const habits = useSelector((state) => state.habit.habits);
  const [habitStreaks, setHabitStreaks] = useState([]);
  const panelRef = useRef(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const results = await Promise.all(
          habits
            .filter((h) => h.status === "active")
            .map(async (habit) => {
              const res = await getLongestStreak(habit._id);
              return {
                _id: habit._id,
                title: habit.title,
                color: habit.color,
                frequency: habit.frequency,
                currentStreak: res.data.data?.currentStreak || 0,
              };
            }),
        );
        const sorted = results.sort((a, b) => b.currentStreak - a.currentStreak).slice(0, 3);
        setHabitStreaks(sorted);
      } catch { /* silent */ }
    };
    if (habits.length > 0) fetchAll();
  }, [habits]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(panelRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );
    }, panelRef);
    return () => ctx.revert();
  }, [habitStreaks]);

  const maxStreak = Math.max(...habitStreaks.map((h) => h.currentStreak), 1);

  return (
    <div ref={panelRef} className="h-full flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-lg font-bold tracking-[-0.03em] text-text-primary">
            ritual streaks
          </h2>
          <p className="text-[11px] text-text-muted mt-0.5">top performing habits</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-surface-dim px-3 py-1.5">
          <Flame size={12} className="text-[#D4BB06]" />
          <span className="text-[10px] font-bold text-text-muted">leaderboard</span>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-border-subtle via-border-subtle/50 to-transparent" />

      <div className="flex flex-col gap-3">
        {habitStreaks.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-8 text-center">
            <Flame size={24} className="text-[#D4BB06]/30 mb-3" />
            <p className="text-sm font-medium text-text-muted">No streaks yet.</p>
            <p className="text-[11px] text-text-muted/60 mt-1">Complete rituals to build your streak.</p>
          </motion.div>
        ) : (
          habitStreaks.map((habit, i) => {
            const MedalIcon = medalIcons[i];
            const ratio = habit.currentStreak / maxStreak;
            const barWidth = Math.max(ratio * 100, 8);

            return (
              <motion.div
                key={habit._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="group relative overflow-hidden rounded-2xl border border-border-subtle bg-surface p-4 transition-all duration-300 hover:shadow-lg"
              >
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: `${rankColors[i]}20` }}>
                      <MedalIcon size={18} style={{ color: rankColors[i] }} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-text-primary">{habit.title}</p>
                      <p className="text-[10px] font-medium text-text-muted tracking-wider uppercase">{medalLabels[i]} · {habit.frequency}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-heading text-2xl font-black tracking-[-0.04em] text-text-primary">{habit.currentStreak}</p>
                    <p className="text-[9px] font-bold tracking-wider text-text-muted uppercase">days</p>
                  </div>
                </div>
                <div className="relative z-10 mt-3 h-1.5 w-full overflow-hidden rounded-full bg-border-subtle/50">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${barWidth}%` }}
                    transition={{ duration: 1, delay: 0.3 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${rankColors[i]}, ${rankColors[i]}88)` }}
                  />
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
