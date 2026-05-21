import React from "react";
import { motion } from "framer-motion";
import { Bell } from "lucide-react";
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

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 h-16 w-full max-w-full flex items-center justify-between border-b border-border-subtle/70 bg-background/88 px-5 backdrop-blur-xl lg:px-10"
    >
      {/* LEFT — GREETING */}
      <div>
        <motion.h1
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="font-heading text-lg font-semibold tracking-[-0.03em] text-text-primary"
        >
          {getGreeting()}
          {user?.username && `, ${user.username}`}
        </motion.h1>
      </div>

      {/* RIGHT */}
      <div className="ml-6 flex items-center gap-3">
        {/* Bell */}
        <motion.button
          whileHover={{ y: -1, scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          className="rounded-full border border-border-subtle bg-surface p-2 text-text-muted hover:text-text-primary"
        >
          <Bell size={18} />
        </motion.button>

        {/* Profile */}
        <motion.div whileHover={{ y: -1, scale: 1.03 }} whileTap={{ scale: 0.96 }}>
          <Link
            to="/settings"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-background shadow-[0_12px_28px_-18px_rgba(26,26,26,0.8)]"
          >
            {user?.username?.charAt(0)?.toUpperCase() || "U"}
          </Link>
        </motion.div>
      </div>
    </motion.nav>
  );
}

export default Header;
