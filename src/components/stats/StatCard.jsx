import { motion } from "framer-motion";

export default function StatCard({
  title,
  value,
  subtitle,
  variant = "default",
}) {
  const variants = {
    default: "bg-white dark:bg-[#0F0D13] text-[#1A1A1A] dark:text-[#E6E1E5]",
    dark: "bg-[#1A1A1A] text-[#FAFAF5] dark:bg-[#6750A4] dark:text-[#E6E1E5]",
    mint: "bg-[#C8E6DF] text-[#1A1A1A] dark:bg-[#4D4465] dark:text-[#E6E1E5]",
  };

  const labelVariants = {
    default: "text-[#888888] dark:text-[#938F99]",
    dark: "text-[#FAFAF5]/70 dark:text-[#E6E1E5]/70",
    mint: "text-[#1A1A1A]/70 dark:text-[#E6E1E5]/70",
  };

  const titleVariants = {
    default: "text-[#888888] dark:text-[#938F99]",
    dark: "text-[#FAFAF5]/70 dark:text-[#E6E1E5]/70",
    mint: "text-[#1A1A1A]/70 dark:text-[#E6E1E5]/70",
  };

  const vClass = variants[variant];
  const lClass = labelVariants[variant];
  const tClass = titleVariants[variant];

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`rounded-xl px-7 py-6 flex flex-col justify-between transition-all duration-200 ${vClass}`}
      style={{
        minHeight: "190px",
      }}
    >
      {/* TITLE */}
      <p className={`text-xs tracking-widest transition-colors duration-200 ${tClass}`} style={{ fontFamily: "Epilogue, sans-serif" }}>
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
