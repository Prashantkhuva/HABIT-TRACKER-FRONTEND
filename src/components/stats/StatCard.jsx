import { motion } from "framer-motion";

export default function StatCard({
  title,
  value,
  subtitle,
  variant = "default",
}) {
  const variants = {
    default: { bg: "#F0EDE5", text: "#1A1A1A", label: "#9A9A8A" },
    dark: { bg: "#1A1A1A", text: "#FAFAF5", label: "#9A9A8A" },
    mint: { bg: "#C8E6DF", text: "#1A1A1A", label: "#4B6B63" },
  };

  const v = variants[variant];

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="rounded-[32px] px-7 py-6 flex flex-col justify-between"
      style={{
        background: v.bg,
        minHeight: "190px", // 🔥 height increase
      }}
    >
      {/* TITLE */}
      <p
        className="text-xs tracking-widest"
        style={{
          color: v.label,
          fontFamily: "Manrope, sans-serif",
        }}
      >
        {title}
      </p>

      {/* VALUE SECTION */}
      <div className="flex items-end justify-between mt-6">
        <h2
          className="text-[64px] leading-none font-bold" // 🔥 bigger number
          style={{
            fontFamily: "Epilogue, sans-serif",
            color: v.text,
          }}
        >
          {value}
        </h2>

        {subtitle && (
          <p
            className="text-sm mb-2" // 🔥 better spacing
            style={{
              color: v.label,
              fontFamily: "Manrope, sans-serif",
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </motion.div>
  );
}
