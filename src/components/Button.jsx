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
      bg-primary text-background shadow-[0_12px_28px_-16px_rgba(26,26,26,0.7)]
      hover:bg-primary-soft
    `,
    secondary: `
      bg-surface-dim text-text-primary border border-border-subtle
      hover:bg-border-subtle/60
    `,
    outline: `
      bg-transparent text-text-primary border border-border-subtle
      hover:bg-surface-dim
    `,
    ghost: `
      bg-transparent text-text-muted
      hover:bg-surface-dim hover:text-text-primary
    `,
    danger: `
      bg-danger-soft text-danger
      hover:bg-danger-soft/80
    `,
  };

  const ghostHover = {
    red: `hover:text-danger hover:bg-danger-soft`,
    green: `hover:text-accent-mint hover:bg-accent-soft`,
    gray: `hover:text-text-primary hover:bg-surface-dim`,
    default: `hover:text-text-primary hover:bg-surface-dim`,
  };

  return (
    <motion.button
      type={type}
      className={`
        inline-flex items-center justify-center gap-2.5 rounded-full
        px-5 py-3 sm:px-6 sm:py-3.5
        text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.16em]
        outline-none transition-all duration-200
        focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2
        focus-visible:ring-offset-background
        disabled:pointer-events-none disabled:opacity-50
        ${variants[variant]}
        ${variant === "ghost" ? ghostHover[color] : ""}
        ${className}
      `}
      whileHover={props.disabled ? undefined : { y: -2, scale: 1.02 }}
      whileTap={props.disabled ? undefined : { scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export default Button;
