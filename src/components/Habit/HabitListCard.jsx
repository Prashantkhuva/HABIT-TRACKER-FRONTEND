import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Pencil } from "lucide-react";
import { categoryMap } from "./categoryMap";
import { getHabitLogs } from "../../api/habits-api";

export default function HabitListCard({ habit, index, onEdit }) {
  const Icon = categoryMap[habit.category];
  const [weeklyCount, setWeeklyCount] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getHabitLogs(habit._id, 1, 7);
        const logs = res.data.data.logs;
        setWeeklyCount(logs.filter((l) => l.completed).length);
      } catch (err) {
        console.error(err);
      }
    };
    fetch();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="relative bg-white rounded-3xl p-6 flex flex-col gap-4"
      style={{ border: "1px solid #E8E4DC" }}
    >
      {/* Top Row */}
      <div className="flex justify-between items-start">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ background: habit.color + "22" }}
        >
          {Icon && <Icon size={20} color={habit.color} />}
        </div>
        <button
          onClick={() => onEdit?.(habit)}
          className="p-2 rounded-full transition-all hover:bg-gray-100"
        >
          <Pencil size={14} color="#9A9A8A" />
        </button>
      </div>

      {/* Title */}
      <p
        className="text-xl font-bold leading-tight"
        style={{ fontFamily: "Epilogue, sans-serif", color: "#1A1A1A" }}
      >
        {habit.title}
      </p>

      {/* Weekly Progress */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <p className="text-xs tracking-widest" style={{ color: "#9A9A8A" }}>
            WEEKLY PROGRESS
          </p>
          <p
            className="text-lg font-bold"
            style={{ fontFamily: "Epilogue, sans-serif", color: habit.color }}
          >
            {weeklyCount}/7
          </p>
        </div>
        <div className="flex gap-1.5">
          {[1, 2, 3, 4, 5, 6, 7].map((d) => (
            <div
              key={d}
              className="w-3 h-3 rounded-full transition-all"
              style={{
                background: d <= weeklyCount ? habit.color : "#E8E4DC",
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
