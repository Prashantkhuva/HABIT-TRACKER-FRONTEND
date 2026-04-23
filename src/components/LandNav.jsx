import React from "react";
import { Link } from "react-router-dom";
import Button from "./Button";
import { motion } from "framer-motion";
import { Bell } from "lucide-react";

function LandNav() {
  const navLinks = ["PHILOSOPHY", "FEATURES", "JOURNAL"];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-center justify-between px-10 py-5 sticky top-0 z-50"
      style={{ background: "#FAFAF5", borderBottom: "1px solid #E8E4DC" }}
    >
      {/* Logo */}
      <Link to={"/"}>
        <h1
          className="text-2xl font-bold tracking-tight"
          style={{ fontFamily: "Epilogue, sans-serif", color: "#1A1A1A" }}
        >
          habitflow
        </h1>
      </Link>

      {/* Nav Links */}
      <div className="flex items-center gap-10">
        {navLinks.map((link, i) => (
          <motion.a
            key={link}
            href="#"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 + 0.2, duration: 0.4 }}
            whileHover={{ color: "#1A1A1A" }}
            className="text-xs tracking-widest transition-colors"
            style={{ fontFamily: "Manrope, sans-serif", color: "#1A1C19" }}
          >
            {link}
          </motion.a>
        ))}
      </div>

      {/* Right — Bell + Upgrade */}
      <div className="flex items-center gap-5">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-full transition-all"
          style={{ background: "#F0EDE5" }}
        >
          <Bell size={16} color="#1A1A1A" />
        </motion.button>

        <Button variant="primary">UPGRADE</Button>
      </div>
    </motion.nav>
  );
}

export default LandNav;
