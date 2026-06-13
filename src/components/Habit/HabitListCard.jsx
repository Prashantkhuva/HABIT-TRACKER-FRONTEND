"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Pencil, Sparkles } from "lucide-react";
import { categoryMap } from "./categoryMap";
import { getHabitLogs } from "../../api/habits-api";
import { getTextColor, getIconBg } from "../../lib/habit-utils";
import { useRouter } from "next/navigation";
import gsap from "gsap";

export default function HabitListCard({ habit, index, onEdit }) {
  const Icon = categoryMap[habit.category];
  const textColor = getTextColor(habit.color);
  const iconBg = getIconBg(habit.color);
  const isDark = textColor === "#FAFAF5";
  const subColor = isDark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.35)";
  const [weeklyCount, setWeeklyCount] = useState(0);
  const router = useRouter();
  const isActive = habit.status === "active";
  const cardRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(cardRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.5, delay: index * 0.05, ease: "power2.out" }
      );
    }, cardRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await getHabitLogs(habit._id, 1, 7);
        const logs = res.data.data.logs;
        setWeeklyCount(logs.filter((l) => l.completed).length);
      } catch { /* silent */ }
    };
    fetchLogs();
  }, [habit._id]);

  const progressPercent = (weeklyCount / 7) * 100;

  return (
    <motion.div
      ref={cardRef}
      whileHover={isActive ? { y: -5, scale: 1.01 } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative rounded-[28px] p-6 flex flex-col justify-between gap-4 cursor-pointer overflow-hidden group"
      style={{
        background: habit.color || "#1A1A1A",
        minHeight: "230px",
        opacity: isActive ? 1 : 0.5,
        filter: habit.status === "archived" ? "grayscale(0.6)" : "none",
      }}
      onClick={() => router.push(`/rituals/${habit._id}`)}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {habit.status !== "active" && (
        <div className="absolute top-5 right-5 px-3 py-1.5 text-[10px] font-bold tracking-widest rounded-full bg-black/30 text-white/80 backdrop-blur-sm z-10">
          {habit.status.toUpperCase()}
        </div>
      )}

      <div className="relative z-10 flex justify-between items-start">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-sm" style={{ background: iconBg }}>
          {Icon && <Icon size={18} color={textColor} />}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            if (!isActive) return;
            onEdit?.(habit);
          }}
          className="p-2.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: iconBg }}
        >
          <Pencil size={14} color={textColor} />
        </button>
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <p className="text-xl font-bold leading-tight tracking-[-0.03em]" style={{ color: textColor }}>
            {habit.title}
          </p>
          {weeklyCount >= 5 && <Sparkles size={14} className="text-[#D4BB06]" />}
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <span className="text-[10px] font-bold tracking-[0.15em] uppercase" style={{ color: subColor }}>
              weekly progress
            </span>
            <span className="text-sm font-bold" style={{ color: textColor }}>
              {weeklyCount}/7
            </span>
          </div>

          <div className="h-2.5 w-full overflow-hidden rounded-full" style={{ background: subColor + "30" }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="h-full rounded-full"
              style={{ background: textColor }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
