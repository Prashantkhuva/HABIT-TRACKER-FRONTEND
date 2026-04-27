import { motion } from "framer-motion";

function Button({
  children,
  type = "button",
  className = "",
  variant = "primary", // primary | outline
  color = "default",
  ...props
}) {
  const variants = {
    primary: "bg-[#1A1A1A] text-[#FAFAF5] hover:bg-[#333333]",
    outline:
      "bg-transparent text-[#1A1A1A] border border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#FAFAF5]",
    ghost: "bg-transparent text-[#6B6B6B] border border-[#D6D3CD]",
  };

  const ghostHover = {
    red: "hover:border-red-500 hover:text-red-500 hover:bg-red-50",
    green: "hover:border-[#4F6F64] hover:text-[#4F6F64] hover:bg-[#EEF4F2]",
    gray: "hover:border-[#1A1A1A] hover:text-[#1A1A1A] hover:bg-[#F3F3F3]",
    default: "hover:border-[#1A1A1A] hover:text-[#1A1A1A] hover:bg-[#F5F5F5]",
  };

  return (
    <motion.button
      type={type}
      className={`px-6 py-3 inline-flex items-center justify-center gap-2 rounded-full font-thin text-sm tracking-widest transition-all duration-300 font-body ${variants[variant]} ${variant === "ghost" ? ghostHover[color] : ""} ${className}`}
      whileHover={{ opacity: 0.8, scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export default Button;
