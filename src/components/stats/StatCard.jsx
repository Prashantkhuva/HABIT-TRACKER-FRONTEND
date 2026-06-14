import { motion } from "framer-motion";

export default function StatCard({ title, value, subtitle, variant = "default" }) {
  const styles = {
    default: {
      card: "bg-surface text-text-primary border border-border-subtle/50",
      glow: "bg-accent-mint/5",
    },
    dark: {
      card: "bg-primary text-background",
      glow: "bg-white/8",
    },
    mint: {
      card: "bg-accent-mint/10 text-text-primary border border-accent-mint/20",
      glow: "bg-accent-mint/10",
    },
  };

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 18 }}
      className={`relative overflow-hidden rounded-2xl px-7 py-6 flex flex-col justify-between transition-all duration-300 shadow-sm ${styles[variant].card}`}
      style={{ minHeight: "180px" }}
    >
      {/* Hover glow */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="absolute -inset-4 pointer-events-none"
      >
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] ${styles[variant].glow} blur-[50px] rounded-full`} />
      </motion.div>

      <div className="relative z-10">
        <p className="app-label">{title}</p>
      </div>

      <div className="relative z-10 flex items-end justify-between mt-4">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="font-heading text-5xl font-bold leading-none text-inherit tracking-[-0.04em]"
        >
          {value}
        </motion.h2>
        {subtitle && (
          <p className="text-sm mb-1.5 text-text-muted">{subtitle}</p>
        )}
      </div>
    </motion.div>
  );
}
