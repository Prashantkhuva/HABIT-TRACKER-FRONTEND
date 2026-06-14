"use client";

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Check, Sparkles } from "lucide-react";
import { categoryMap } from "./categoryMap";
import { getTextColor, getIconBg, getButtonColors } from "../../lib/habit-utils";
import { getHabitLogs } from "../../api/habits-api";
import { useRouter } from "next/navigation";
import gsap from "gsap";

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
  const subColor = textColor === "#FAFAF5" ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.35)";
  const { plusBg, plusIcon, checkBg, checkIcon } = getButtonColors(habit.color);
  const [weeklyCount, setWeeklyCount] = useState(0);
  const router = useRouter();
  const cardRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(cardRef.current,
        { opacity: 0, y: 40, scale: 0.95 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.7,
          delay: index * 0.08,
          ease: "power3.out",
        }
      );
    }, cardRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const fetchWeekly = async () => {
      try {
        const res = await getHabitLogs(habit._id, 1, 7);
        const logs = res.data.data.logs;
        setWeeklyCount(logs.filter((l) => l.completed).length);
      } catch (err) { console.error("[BooleanCard] Weekly fetch:", err); }
    };
    fetchWeekly();
  }, [isDone]);

  return (
    <motion.div
      ref={cardRef}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative w-[80vw] sm:w-80 h-64 rounded-[28px] p-6 flex flex-col justify-between shrink-0 snap-start overflow-hidden group cursor-pointer"
      style={{ background: habit.color || "#C8E6DF" }}
      onClick={() => router.push(`/rituals/${habit._id}`)}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/12 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/5 blur-3xl" />

      <div className="relative z-10 flex justify-between items-start">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-sm" style={{ background: iconBg }}>
          {Icon && <Icon size={18} color={textColor} />}
        </div>
        <span className="text-[10px] font-bold tracking-[0.18em] uppercase" style={{ color: subColor }}>
          0{index + 1}
        </span>
      </div>

      <div className="relative z-10">
        <p className="text-xl font-bold mb-2 leading-tight tracking-[-0.03em]" style={{ fontFamily: "Epilogue, sans-serif", color: textColor }}>
          {habit.title}
        </p>
        <p className="text-[10px] font-bold tracking-[0.15em] uppercase" style={{ color: subColor }}>
          {habit.frequency === "daily" ? "daily ritual" : "weekly sessions"}
        </p>

        <div className="mt-5 flex gap-1.5">
          {[1, 2, 3, 4, 5, 6, 7].map((d) => (
            <div
              key={d}
              className="h-2 flex-1 rounded-full transition-all duration-300"
              style={{
                background: d <= weeklyCount ? textColor : subColor,
                opacity: d <= weeklyCount ? 1 : 0.25,
              }}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.button
          key={isDone ? "done" : "pending"}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            if (!isDone) onComplete(habit);
          }}
          className="absolute bottom-6 right-6 w-12 h-12 rounded-full flex items-center justify-center shadow-lg z-10"
          style={{ background: isDone ? checkBg : plusBg, color: isDone ? checkIcon : plusIcon }}
        >
          {completing === habit._id ? (
            <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }} className="text-sm">●</motion.span>
          ) : isDone ? (
            <div className="relative">
              <Check size={20} />
              <motion.div initial={{ scale: 0 }} animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 0.4 }} className="absolute inset-0">
                <Sparkles size={20} className="opacity-0" />
              </motion.div>
            </div>
          ) : (
            <Plus size={20} />
          )}
        </motion.button>
      </AnimatePresence>
    </motion.div>
  );
}
