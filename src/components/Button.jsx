import { motion } from 'framer-motion'

function Button({
  children,
  type = "button",
  className = "",
  variant = "primary", // primary | outline
  ...props
}) {
  const variants = {
    primary: "bg-[#1A1A1A] text-[#FAFAF5] hover:bg-[#333333]",
    outline: "bg-transparent text-[#1A1A1A] border border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#FAFAF5]",
  }

  return (
    <motion.button
      type={type}
      className={`px-6 py-3 inline-flex items-center justify-center gap-2 rounded-full font-thin text-sm tracking-widest transition-all duration-300 font-body ${variants[variant]} ${className}`}
      whileHover={{ opacity: 0.8, scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      {...props}
    >
      {children}
    </motion.button>
  )
}

export default Button