import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useState, useEffect } from "react";
import { getHabitLogs } from "../../api/habits-api";

export default function CompletedHabit({ habit, index }) {
  const [weeklyCount, setWeeklyCount] = useState(0);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await getHabitLogs(habit._id, 1, 7);
        const logs = res.data.data.logs;
        setWeeklyCount(logs.filter((l) => l.completed).length);
      } catch (err) { console.error("[CompletedHabit] Log fetch:", err); }
    };
    fetchLogs();
  }, [habit._id]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-center gap-5 px-6 py-5 rounded-2xl bg-surface border border-border-subtle/50 hover:border-accent-mint/20 transition-all"
    >
      <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 bg-accent-mint/15 text-accent-mint">
        <Check size={20} />
      </div>

      <div className="flex-1">
        <p className="font-heading text-base font-bold text-text-primary">
          {habit.title}
        </p>
        <p className="text-[11px] font-bold tracking-wider text-text-muted uppercase mt-0.5">
          COMPLETED TODAY
        </p>
      </div>

      <div className="flex gap-1.5">
        {[1, 2, 3, 4, 5, 6, 7].map((d) => (
          <div
            key={d}
            className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
              d <= weeklyCount
                ? "bg-accent-mint"
                : "bg-transparent border border-border-subtle"
            }`}
          />
        ))}
      </div>
    </motion.div>
  );
}
