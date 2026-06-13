import { motion } from "framer-motion";

export default function StatCard({ title, value, subtitle, variant = "default" }) {
  const variants = {
    default: "bg-surface text-text-primary border border-border-subtle/50",
    dark: "bg-primary text-background",
    mint: "bg-accent-mint/10 text-text-primary border border-accent-mint/20",
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`rounded-2xl px-7 py-6 flex flex-col justify-between transition-all duration-200 shadow-sm ${variants[variant]}`}
      style={{ minHeight: "180px" }}
    >
      <p className="app-label">{title}</p>
      <div className="flex items-end justify-between mt-4">
        <h2 className="font-heading text-5xl font-bold leading-none text-inherit tracking-[-0.04em]">
          {value}
        </h2>
        {subtitle && (
          <p className="text-sm mb-1.5 text-text-muted">{subtitle}</p>
        )}
      </div>
    </motion.div>
  );
}
