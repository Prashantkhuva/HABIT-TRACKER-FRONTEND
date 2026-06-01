// components/Toast/Toast.jsx
import { motion } from "framer-motion";
import { Bell, Check, X } from "lucide-react";

export default function Toast({ type = "success", title, message, onClose }) {
  const styles = {
    success: {
      bg: "bg-[#E8F5F1] dark:bg-[#152722]",
      text: "text-[#4F6F64] dark:text-[#C8E6DF]",
      iconBg: "bg-[#DFF0EA] dark:bg-[#0D1815]",
      icon: <Check size={18} />,
    },
    error: {
      bg: "bg-[#FDECEC] dark:bg-[#321616]",
      text: "text-[#D9534F] dark:text-[#FAD4D4]",
      iconBg: "bg-[#FAD4D4] dark:bg-[#200E0E]",
      icon: <X size={18} />,
    },
    info: {
      bg: "bg-[#E8F0FE] dark:bg-[#1A2332]",
      text: "text-[#4A6FA5] dark:text-[#B8D4F0]",
      iconBg: "bg-[#D6E4F5] dark:bg-[#0E1728]",
      icon: <Bell size={18} />,
    },
  };

  const s = styles[type];

  return (
    <motion.div
      initial={{ opacity: 0, x: 80 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 80 }}
      transition={{
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1], // smooth ease
      }}
      className={`w-85 p-5 rounded-2xl shadow-xl flex gap-4 items-start ${s.bg}`}
    >
      {/* ICON */}
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center ${s.iconBg} ${s.text}`}
      >
        {s.icon}
      </div>

      {/* TEXT */}
      <div className="flex-1">
        <p className={`font-semibold text-sm ${s.text}`}>
          {title}
        </p>
        <p className={`text-sm mt-1 opacity-80 ${s.text}`}>
          {message}
        </p>
      </div>

      {/* CLOSE */}
      <button onClick={onClose} className={`opacity-60 hover:opacity-100 ${s.text}`}>
        <X size={16} />
      </button>
    </motion.div>
  );
}
