import { useState } from "react";
import { motion } from "framer-motion";

export default function AppearanceCard() {
  const [theme, setTheme] = useState("light");

  const options = ["light", "dark", "system"];

  return (
    <div
      className="rounded-4xl p-6 h-full flex flex-col justify-between"
      style={{ background: "#ECE8DE" }} // 🔥 softer than previous
    >
      {/* Title */}
      <div>
        <p className="text-[10px] tracking-[0.2em] text-[#7A7663] uppercase mb-2">
          VISUALS
        </p>

        <h2
          className="text-2xl font-semibold text-[#1A1A1A]"
          style={{ fontFamily: "Epilogue" }}
        >
          appearance
        </h2>
      </div>

      {/* Toggle */}
      <div className="relative grid grid-cols-3 bg-[#E4E1D8] rounded-full p-1 mt-6">

        {/* Animated pill */}
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className="absolute top-1 bottom-1 rounded-full bg-white shadow-sm"
          style={{
            width: "calc(100% / 3 - 6px)",
            left:
              theme === "light"
                ? "4px"
                : theme === "dark"
                ? "calc(100% / 3 + 2px)"
                : "calc(2 * 100% / 3)"
          }}
        />

        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => setTheme(opt)}
            className={`relative z-10 py-2 text-xs tracking-wide transition-all
              ${
                theme === opt
                  ? "text-[#1A1A1A] font-medium"
                  : "text-[#8A8A7A]"
              }`}
          >
            {opt.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}