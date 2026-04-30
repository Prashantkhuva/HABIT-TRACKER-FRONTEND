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
    primary: "bg-[#B69DF8] text-black hover:opacity-90 dark:bg-[#D0BCFF] dark:text-[#1A1A1A]",
    secondary: "bg-[#F4F4EF] text-[#1A1A1A] border border-[#E8E4DC] hover:bg-[#E8E4DC] dark:bg-[#2A2A2A] dark:text-[#E6E1E5] dark:border-[#49454F]",
    outline: "bg-transparent text-[#1A1A1A] border border-[#E8E4DC] hover:bg-[#F4F4EF] dark:text-[#E6E1E5] dark:border-[#49454F] dark:hover:bg-[#2A2A2A]",
    ghost: "bg-transparent text-[#888888] hover:text-[#1A1A1A] dark:text-[#938F99] dark:hover:text-[#E6E1E5]",
    danger: "bg-[#FFEDED] text-[#D32F2F] hover:bg-[#FFDADA] dark:bg-[#311111] dark:text-[#F2B8B5] dark:hover:bg-[#411111]",
  };

  const ghostHover = {
    red: "hover:border-red-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20",
    green: "hover:border-[#4F6F64] hover:text-[#4F6F64] hover:bg-[#EEF4F2] dark:hover:bg-[#4F6F64]/20",
    gray: "hover:border-[#1A1A1A] hover:text-[#1A1A1A] hover:bg-[#F3F3F3] dark:hover:bg-[#2A2A2A]",
    default: "hover:border-[#1A1A1A] hover:text-[#1A1A1A] hover:bg-[#F5F5F5] dark:hover:bg-[#2A2A2A]",
  };

  return (
    <motion.button
      type={type}
      className={`px-6 py-3 inline-flex items-center justify-center gap-2 rounded-full font-thin text-sm tracking-widest transition-all duration-200 font-body ${variants[variant]} ${variant === "ghost" ? ghostHover[color] : ""} ${className}`}
      whileHover={{ opacity: 0.9, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export default Button;
