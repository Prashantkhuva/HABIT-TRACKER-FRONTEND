import React from "react";
import { motion } from "framer-motion";
import { Bell, User } from "lucide-react";
import Button from "../Button";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function Header() {
  const user = useSelector((state) => state.auth.userData);

  // 🔥 greeting logic
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
      className="fixed top-0 left-56 right-0 z-50 flex items-center justify-between px-10 py-4"
      style={{
        background: "#FAFAF5",
        borderBottom: "1px solid #E8E4DC",
      }}
    >
      {/* 🔥 LEFT — GREETING */}
      <div>
        <p className="text-xs tracking-widest text-[#9A9A8A]">DASHBOARD</p>

        <motion.h1
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-lg font-semibold"
          style={{ fontFamily: "Epilogue, sans-serif" }}
        >
          {getGreeting()}
          {user?.username && `, ${user.username}`} {getEmoji()}
        </motion.h1>
      </div>

      {/* 🔔 RIGHT */}
      <div className="flex items-center gap-4 ml-6">
        {/* Bell */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-full bg-[#F0EDE5] hover:bg-[#E7E3DA] transition-all"
        >
          <Bell size={18} className="text-[#1A1A1A]" />
        </motion.button>

        {/* Upgrade Button */}
        <Button className="px-5 py-2 text-xs tracking-widest">UPGRADE</Button>

        {/* Profile */}
        <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
          <Link
            to="/profile"
            className="flex items-center justify-center w-9 h-9 rounded-full bg-[#1A1A1A] hover:bg-[#333] transition-all text-white text-sm font-semibold"
          >
            {user?.username?.charAt(0)?.toUpperCase() || "U"}
          </Link>
        </motion.div>
      </div>
    </motion.nav>
  );
}

export default Header;
