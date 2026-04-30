import React from "react";
import { Link } from "react-router-dom";
import Button from "./Button";
import { motion } from "framer-motion";
import { Bell } from "lucide-react";

function LandNav() {

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-center justify-between px-10 py-5 sticky top-0 z-50 bg-[#FAFAF5] dark:bg-[#141218] border-b border-gray-300 dark:border-[#2A2A2A]"
    >
      {/* Logo */}
      <Link to={"/"}>
        <h1
          className="text-2xl font-bold tracking-tight text-[#1A1A1A] dark:text-[#E6E1E5] font-heading"
        >
          habitflow
        </h1>
      </Link>
     
      {/* Right — Bell + Upgrade */}
      <div className="flex items-center gap-5">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-full transition-all bg-gray-200 dark:bg-[#1D1B20]"
        >
          <Bell size={16} className="text-[#1A1A1A] dark:text-[#E6E1E5]" />
        </motion.button>

        <Button variant="primary">UPGRADE</Button>
      </div>
    </motion.nav>
  );
}

export default LandNav;
