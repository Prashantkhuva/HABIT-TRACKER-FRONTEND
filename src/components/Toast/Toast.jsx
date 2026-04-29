// components/Toast/Toast.jsx
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

export default function Toast({ type = "success", title, message, onClose }) {
  const styles = {
    success: {
      bg: "#E8F5F1",
      text: "#4F6F64",
      iconBg: "#DFF0EA",
      icon: <Check size={18} />,
    },
    error: {
      bg: "#FDECEC",
      text: "#D9534F",
      iconBg: "#FAD4D4",
      icon: <X size={18} />,
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
      className="w-85 p-5 rounded-2xl shadow-xl flex gap-4 items-start"
      style={{ background: s.bg }}
    >
      {/* ICON */}
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center"
        style={{ background: s.iconBg, color: s.text }}
      >
        {s.icon}
      </div>

      {/* TEXT */}
      <div className="flex-1">
        <p className="font-semibold text-sm" style={{ color: s.text }}>
          {title}
        </p>
        <p className="text-sm mt-1 opacity-80" style={{ color: s.text }}>
          {message}
        </p>
      </div>

      {/* CLOSE */}
      <button onClick={onClose} className="opacity-60 hover:opacity-100">
        <X size={16} style={{ color: s.text }} />
      </button>
    </motion.div>
  );
}
