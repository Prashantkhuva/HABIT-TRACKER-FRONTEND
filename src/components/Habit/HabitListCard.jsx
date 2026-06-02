"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Pencil } from "lucide-react";
import { categoryMap } from "./categoryMap";
import { getHabitLogs } from "../../api/habits-api";
import { getTextColor, getIconBg } from "../../lib/habit-utils";

import { useRouter } from "next/navigation";

export default function HabitListCard({ habit, index, onEdit }) {
  const Icon = categoryMap[habit.category];
  const textColor = getTextColor(habit.color);
  const iconBg = getIconBg(habit.color);

  const isDark = textColor === "#FAFAF5";
  const subColor = isDark
    ? "rgba(255,255,255,0.6)"
    : "rgba(0,0,0,0.4)";

  const [weeklyCount, setWeeklyCount] = useState(0);
  const router = useRouter();

  const isActive = habit.status === "active";

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await getHabitLogs(habit._id, 1, 7);
        const logs = res.data.data.logs;
        setWeeklyCount(logs.filter((l) => l.completed).length);
      } catch (err) {
        // Silently ignore
      }
    };
    fetchLogs();
  }, [habit._id]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="relative rounded-[28px] p-6 flex flex-col justify-between gap-4 cursor-pointer"
      style={{
        background: habit.color || "#1A1A1A",
        minHeight: "220px",
        opacity: isActive ? 1 : 0.6,
        filter: habit.status === "archived" ? "grayscale(0.6)" : "none",
      }}
      onClick={() => router.push(`/rituals/${habit._id}`)}
      whileHover={isActive ? { scale: 1.02 } : {}}
    >
      {/* STATUS BADGE */}
      {habit.status !== "active" && (
        <div className="absolute top-7 right-15 px-3 py-1 text-[10px] tracking-widest rounded-full bg-black/30 text-white">
          {habit.status.toUpperCase()}
        </div>
      )}

      {/* Top */}
      <div className="flex justify-between items-start">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: iconBg }}
        >
          {Icon && <Icon size={18} color={textColor} />}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            if (!isActive) return;
            onEdit?.(habit);
          }}
          className="p-2 rounded-full"
          style={{ background: iconBg }}
        >
          <Pencil size={13} color={textColor} />
        </button>
      </div>

      {/* Content */}
      <div>
        <p
          className="text-xl font-bold mb-3"
          style={{ color: textColor }}
        >
          {habit.title}
        </p>

        <div>
          <div className="flex justify-between mb-1">
            <span className="text-xs" style={{ color: subColor }}>
              WEEKLY PROGRESS
            </span>
            <span className="text-sm font-bold" style={{ color: textColor }}>
              {weeklyCount}/7
            </span>
          </div>

          <div className="flex gap-1">
            {[1,2,3,4,5,6,7].map(d => (
              <div
                key={d}
                className="w-3 h-3 rounded-full"
                style={{
                  background: d <= weeklyCount ? textColor : subColor,
                  opacity: d <= weeklyCount ? 1 : 0.3
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}