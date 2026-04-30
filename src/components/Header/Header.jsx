import React from "react";
import { motion } from "framer-motion";
import { Bell, User, Crown } from "lucide-react";
import Button from "../Button";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function Header() {
  const user = useSelector((state) => state.auth.userData);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const getEmoji = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "🌅";
    if (hour < 18) return "☀️";
    return "🌙";
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 h-16 w-full max-w-full flex items-center justify-between lg:px-10 px-5 bg-[#FAFAF5]/80 dark:bg-[#1D1B20]/80 backdrop-blur-xl border-b border-[#E8E4DC] dark:border-[#49454F]"
    >
      {/* LEFT — GREETING */}
      <div>

        <motion.h1
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-lg font-semibold text-text-primary dark:text-white"
          style={{ fontFamily: "Epilogue, sans-serif" }}
        >
          {getGreeting()}
          {user?.username && `, ${user.username}`} {getEmoji()}
        </motion.h1>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4 ml-6">
        {/* Bell */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-full bg-[#F3F3F3] dark:bg-[#2A2A2A] hover:bg-white dark:hover:bg-[#1D1B20] transition-all duration-200"
        >
          <Bell size={18} className="text-[#1A1A1A] dark:text-[#E6E1E5]" />
        </motion.button>

        {/* Upgrade Button */}
        <Button className="max-sm:px-3 sm:px-5 py-2 text-xs tracking-widest flex justify-center items-center bg-[#1A1A1A] dark:bg-[#D0BCFF] text-white dark:text-black">
          <span className="hidden sm:inline">UPGRADE</span>
          <Crown className="sm:hidden" size={16} />
        </Button>

        {/* Profile */}
        <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
          <Link
            to="/settings"
            className="flex items-center justify-center w-9 h-9 rounded-full bg-[#1A1A1A] dark:bg-[#D0BCFF] text-white dark:text-black hover:opacity-90 transition-all duration-200 text-sm font-semibold"
          >
            {user?.username?.charAt(0)?.toUpperCase() || "U"}
          </Link>
        </motion.div>
      </div>
    </motion.nav>
  );
}

export default Header;
