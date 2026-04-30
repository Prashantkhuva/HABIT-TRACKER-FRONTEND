import { motion } from "framer-motion";

export default function StatCard({
  title,
  value,
  subtitle,
  variant = "default",
}) {
  const variants = {
    default: "bg-white dark:bg-[#1D1B20] border border-[#E8E4DC] dark:border-[#49454F] text-[#1A1A1A] dark:text-[#E6E1E5]",
    dark: "bg-[#1A1A1A] text-[#FAFAF5] dark:bg-[#D0BCFF] dark:text-[#1A1A1A]",
    mint: "bg-[#C8E6DF] text-[#1A1A1A] dark:bg-[#D4BB06] dark:text-[#1A1A1A]",
  };

  const labelVariants = {
    default: "text-[#888888] dark:text-[#938F99]",
    dark: "text-[#FAFAF5]/70 dark:text-[#1A1A1A]/70",
    mint: "text-[#1A1A1A]/70 dark:text-[#1A1A1A]/70",
  };

  const vClass = variants[variant];
  const lClass = labelVariants[variant];

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`rounded-xl px-7 py-6 flex flex-col justify-between transition-all duration-200 ${vClass}`}
      style={{
        minHeight: "190px",
      }}
    >
      {/* TITLE */}
      <p className="text-xs tracking-widest transition-colors duration-200" style={{ fontFamily: "Manrope, sans-serif" }}>
        {title}
      </p>

      {/* VALUE SECTION */}
      <div className="flex items-end justify-between mt-6">
        <h2
          className="text-[64px] leading-none font-bold text-inherit"
          style={{
            fontFamily: "Epilogue, sans-serif",
          }}
        >
          {value}
        </h2>

        {subtitle && (
          <p className={`text-sm mb-2 transition-colors duration-200 ${lClass}`} style={{ fontFamily: "Manrope, sans-serif" }}>
            {subtitle}
          </p>
        )}
      </div>
    </motion.div>
  );
}
