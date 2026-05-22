import { motion } from "framer-motion";

function Button({
  children,
  type = "button",
  className = "",
  variant = "primary",
  color = "default",
  ...props
}) {
  const variants = {
    primary: `
      bg-primary text-background shadow-[0_14px_34px_-22px_rgba(26,26,26,0.85)]
      hover:bg-primary-soft
      dark:bg-primary dark:text-[#1A1A1A] dark:hover:bg-primary-soft
    `,

    secondary: `
      bg-surface-dim text-text-primary border border-border-subtle
      hover:bg-border-subtle/60
      dark:bg-surface-dim dark:text-text-primary dark:border-border-subtle
    `,

    outline: `
      bg-transparent text-text-primary border border-border-subtle
      hover:bg-surface-dim
      dark:text-text-primary dark:border-border-subtle dark:hover:bg-surface-dim
    `,

    ghost: `
      bg-transparent text-text-muted
      hover:bg-surface-dim hover:text-text-primary
      dark:text-text-muted dark:hover:text-text-primary
    `,

    danger: `
      bg-danger-soft text-danger
      hover:bg-danger-soft/80
      dark:bg-danger-soft dark:text-danger
    `,
  };

  const ghostHover = {
    red: `
      hover:text-danger hover:bg-danger-soft
      dark:hover:bg-danger-soft
    `,
    green: `
      hover:text-accent-mint hover:bg-accent-soft
      dark:hover:bg-accent-soft
    `,
    gray: `
      hover:text-text-primary hover:bg-surface-dim
      dark:hover:bg-surface-dim
    `,
    default: `
      hover:text-text-primary hover:bg-surface-dim
      dark:hover:bg-surface-dim
    `,
  };

  return (
    <motion.button
      type={type}
      className={`
        inline-flex items-center justify-center gap-2 rounded-full
        px-4 py-2.5 sm:px-6 sm:py-3 font-body text-[10px] sm:text-xs font-bold uppercase tracking-[0.18em]
        outline-none transition-all duration-200
        focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2
        focus-visible:ring-offset-background
        disabled:pointer-events-none disabled:opacity-50
        ${variants[variant]}
        ${variant === "ghost" ? ghostHover[color] : ""}
        ${className}
      `}
      whileHover={props.disabled ? undefined : { y: -1, scale: 1.015 }}
      whileTap={props.disabled ? undefined : { scale: 0.98 }}
      transition={{ type: "spring", stiffness: 420, damping: 28 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export default Button;
