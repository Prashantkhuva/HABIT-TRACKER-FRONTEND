import { motion } from "framer-motion";
import { Check } from "lucide-react";

export default function CompletedHabit({ habit, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex items-center gap-4 px-6 py-4 rounded-full"
      style={{ background: "#F5F3EE" }}
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
        style={{ background: "#4B6B63" }}
      >
        <Check size={18} color="#fff" />
      </div>

      <div className="flex-1">
        <p className="font-bold text-sm" style={{ color: "#1A1A1A" }}>
          {habit.title}
        </p>
        <p className="text-xs" style={{ color: "#9A9A8A" }}>
          COMPLETED TODAY
        </p>
      </div>

      <div className="flex gap-1.5">
        {[1, 2, 3, 4, 5].map((d) => (
          <div
            key={d}
            className="w-2 h-2 rounded-full"
            style={{ background: d <= 3 ? "#4B6B63" : "#D8D4CA" }}
          />
        ))}
      </div>
    </motion.div>
  );
}
