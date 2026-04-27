import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Pencil } from "lucide-react";
import { categoryMap } from "./categoryMap";
import { getHabitLogs } from "../../api/habits-api";
import { getTextColor, getIconBg } from "../../lib/habit-utils";
import { useNavigate } from "react-router-dom";

export default function HabitListCard({ habit, index, onEdit }) {
  const Icon = categoryMap[habit.category];
  const textColor = getTextColor(habit.color);
  const iconBg = getIconBg(habit.color);
  const subColor =
    textColor === "#FAFAF5" ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.4)";

  const [weeklyCount, setWeeklyCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await getHabitLogs(habit._id, 1, 7);
        const logs = res.data.data.logs;
        setWeeklyCount(logs.filter((l) => l.completed).length);
      } catch (err) {
        console.error(err);
      }
    };
    fetchLogs();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="relative rounded-[28px] p-6 flex flex-col justify-between gap-4"
      style={{ background: habit.color || "#1A1A1A", minHeight: "220px" }}
      onClick={() => navigate(`/rituals/${habit._id}`)}
    >
      {/* Top Row */}
      <div className="flex justify-between items-start">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: iconBg }}
        >
          {Icon && <Icon size={18} color={textColor} />}
        </div>
        <button
          onClick={() => onEdit?.(habit)}
          className="p-2 rounded-full transition-all"
          style={{ background: iconBg }}
        >
          <Pencil size={13} color={textColor} />
        </button>
      </div>

      {/* Content */}
      <div>
        <p
          className="text-xl font-bold mb-3 leading-tight"
          style={{ fontFamily: "Epilogue, sans-serif", color: textColor }}
        >
          {habit.title}
        </p>

        {/* Weekly Progress */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <p className="text-xs tracking-widest" style={{ color: subColor }}>
              WEEKLY PROGRESS
            </p>
            <p
              className="text-sm font-bold"
              style={{ fontFamily: "Epilogue, sans-serif", color: textColor }}
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
                  background: d <= weeklyCount ? textColor : subColor,
                  opacity: d <= weeklyCount ? 1 : 0.3,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
