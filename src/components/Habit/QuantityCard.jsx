import { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { categoryMap } from "./categoryMap";
import { getTextColor, getIconBg } from "../../lib/habit-utils";

export default function QuantityCard({ habit, index }) {
  const Icon = categoryMap[habit.category];
  const textColor = getTextColor(habit.color);
  const iconBg = getIconBg(habit.color);
  const subColor =
    textColor === "#FAFAF5" ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.4)";

  const [quantity, setQuantity] = useState(0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative min-w-75 h-55 rounded-[28px] p-6 flex flex-col justify-between shrink-0"
      style={{ background: habit.color || "#1A1A1A" }}
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
      {/* Content */}
      <div>
        <p
          className="text-xl font-bold mb-2"
          style={{ fontFamily: "Epilogue, sans-serif", color: textColor }}
        >
          {habit.title}
        </p>

        {/* Big number */}
        <p
          className="text-5xl font-black leading-none"
          style={{ fontFamily: "Epilogue, sans-serif", color: textColor }}
        >
          {quantity}
        </p>

        <p className="text-xs tracking-widest mt-1" style={{ color: subColor }}>
          {habit.frequency === "daily" ? "TODAY" : "THIS WEEK"}
        </p>
      </div>

      {/* Buttons */}
      <div className="absolute bottom-6 right-6 flex gap-2">
        {/* Minus */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setQuantity((prev) => Math.max(0, prev - 1))}
          className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold"
          style={{
            background:
              subColor === "rgba(255,255,255,0.6)"
                ? "rgba(255,255,255,0.2)"
                : "rgba(0,0,0,0.1)",
            color: textColor,
          }}
        >
          −
        </motion.button>

        {/* Plus */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setQuantity((prev) => prev + 1)}
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: textColor, color: habit.color }}
        >
          <Plus size={18} />
        </motion.button>
      </div>
    </motion.div>
  );
}
