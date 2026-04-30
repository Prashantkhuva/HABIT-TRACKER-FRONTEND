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
      className="flex items-center gap-4 px-6 py-4 rounded-full bg-white dark:bg-[#1D1B20] border border-[#E8E4DC] dark:border-[#49454F]"
    >
      {/* Check Icon */}
      <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-[#C8E6DF] dark:bg-[#D0BCFF] text-[#1A1A1A] dark:text-black">
        <Check size={18} className="text-[#1A1A1A] dark:text-black" />
      </div>

      {/* Text */}
      <div className="flex-1">
        <p className="font-bold text-sm text-[#1A1A1A] dark:text-[#E6E1E5]">
          {habit.title}
        </p>
        <p className="text-xs text-[#888888] dark:text-[#938F99] uppercase">
          COMPLETED TODAY
        </p>
      </div>

      {/* Weekly Dots */}
      <div>
        <div className="flex gap-1.5">
          {[1, 2, 3, 4, 5, 6, 7].map((d) => (
            <div
              key={d}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                d <= weeklyCount 
                  ? "bg-[#1A1A1A] dark:bg-[#D0BCFF]" 
                  : "bg-transparent border border-[#E8E4DC] dark:border-[#2A2A2A]"
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
