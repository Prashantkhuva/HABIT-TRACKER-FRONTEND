import { motion, AnimatePresence } from "framer-motion";
import { Plus, Check } from "lucide-react";
import { categoryMap } from "./categoryMap";
import {
  getTextColor,
  getIconBg,
  getButtonColors,
} from "../../lib/habit-utils";
import { useEffect, useState } from "react";
import { getHabitLogs } from "../../api/habits-api";
import { useNavigate } from "react-router-dom";
import { useToast } from "../Toast/ToastProvider";

export default function BooleanCard({
  habit,
  index,
  onComplete,
  completing,
  isDone,
}) {
  const Icon = categoryMap[habit.category];
  const textColor = getTextColor(habit.color);
  const iconBg = getIconBg(habit.color);
  const subColor =
    textColor === "#FAFAF5" ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.4)";
  const { plusBg, plusIcon, checkBg, checkIcon } = getButtonColors(habit.color);

  const [weeklyCount, setWeeklyCount] = useState(0);
  const navigate = useNavigate();
  const addToast = useToast();

  useEffect(() => {
    const fetchWeekly = async () => {
      try {
        const res = await getHabitLogs(habit._id, 1, 7);
        const logs = res.data.data.logs;
        setWeeklyCount(logs.filter((l) => l.completed).length);
      } catch (err) {
        console.error(err);
      }
    };
    fetchWeekly();
  }, [isDone]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative w-[80vw] sm:w-75 h-55 rounded-[28px] p-6 flex flex-col justify-between shrink-0 border border-[#E8E4DC] dark:border-[#49454F] snap-start"
      style={{ background: habit.color || "#C8E6DF" }}
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
        <span className="text-xs tracking-widest" style={{ color: subColor }}>
          HABIT {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      {/* Content */}
      <div>
        <p
          className="text-xl font-bold mb-3 leading-tight"
          style={{ fontFamily: "Epilogue, sans-serif", color: textColor }}
        >
          {habit.title}
        </p>

        <p
          className="text-xs tracking-widest uppercase"
          style={{ color: subColor }}
        >
          {habit.frequency === "daily" ? "DAILY RITUAL" : "WEEKLY SESSIONS"}
        </p>
      </div>

      {/* Complete Button */}
      <AnimatePresence mode="wait">
        <motion.button
          key={isDone ? "done" : "pending"}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => !isDone && onComplete(habit)}
          className="absolute bottom-6 right-6 w-12 h-12 rounded-full flex items-center justify-center"
          style={{
            background: isDone ? checkBg : plusBg,
            color: isDone ? checkIcon : plusIcon,
          }}
        >
          {completing === habit._id ? (
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
              className="text-xs"
            >
              ●
            </motion.span>
          ) : isDone ? (
            <Check size={20} />
          ) : (
            <Plus size={20} />
          )}
        </motion.button>
      </AnimatePresence>
    </motion.div>
  );
}
