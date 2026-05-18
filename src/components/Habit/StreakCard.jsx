import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Plus } from "lucide-react";
import { categoryMap } from "./categoryMap";
import {
  getTextColor,
  getIconBg,
  getButtonColors,
} from "../../lib/habit-utils";
import { getHabitStreak as fetchStreak } from "../../api/habits-api";
import { useNavigate } from "react-router-dom";

export default function StreakCard({
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

  const navigate = useNavigate();

  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const loadStreak = async () => {
      try {
        const res = await fetchStreak(habit._id);
        const data = res.data.data;
        const count = data?.currentStreak ?? data?.streak ?? 0;
        setStreak(count);
      } catch (err) {
        console.error("streak error:", err);
      }
    };
    loadStreak();
  }, [isDone, habit._id]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative w-[80vw] sm:w-75 h-55 rounded-xl p-6 flex flex-col justify-between shrink-0 snap-start"
      style={{ background: habit.color || "#1A1A1A" }}
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
          className="text-xl font-bold mb-1"
          style={{ fontFamily: "Epilogue, sans-serif", color: textColor }}
        >
          {habit.title}
        </p>

        <p
          className="text-6xl font-black leading-none"
          style={{ fontFamily: "Epilogue, sans-serif", color: textColor }}
        >
          {streak}
        </p>

        <p className="text-xs tracking-widest mt-2" style={{ color: subColor }}>
          DAY STREAK
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
          id="w8j0kp"
          onClick={(e) => {
            e.stopPropagation();

            if (!isDone) {
              onComplete(habit);
            }
          }}
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
