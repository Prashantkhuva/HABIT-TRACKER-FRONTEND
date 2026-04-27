import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { getTextColor } from "../../lib/habit-utils";
import { useState, useEffect } from "react";
import { getHabitLogs } from "../../api/habits-api";

export default function CompletedHabit({ habit, index }) {
  const [weeklyCount, setWeeklyCount] = useState(0);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await getHabitLogs(habit._id, 1, 7);
        const logs = res.data.data.logs;

        // 🔥 FIX: directly length use
        setWeeklyCount(logs.length);
      } catch (err) {
        console.error(err);
      }
    };

    fetchLogs();
  }, [habit._id]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex items-center gap-4 px-6 py-4 rounded-full"
      style={{ background: "#F5F3EE" }}
    >
      {/* Check Icon */}
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
        style={{ background: "#4B6B63" }}
      >
        <Check size={18} color="#fff" />
      </div>

      {/* Text */}
      <div className="flex-1">
        <p className="font-bold text-sm" style={{ color: "#1A1A1A" }}>
          {habit.title}
        </p>
        <p className="text-xs" style={{ color: "#9A9A8A" }}>
          COMPLETED TODAY
        </p>
      </div>

      {/* Weekly Dots */}
      <div>
        <div className="flex gap-1.5">
          {[1, 2, 3, 4, 5, 6, 7].map((d) => (
            <div
              key={d}
              className="w-3 h-3 rounded-full transition-all"
              style={{
                background: d <= weeklyCount ? "#48645E" : "rgba(0,0,0,0.4)",
                opacity: d <= weeklyCount ? 1 : 0.3,
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
