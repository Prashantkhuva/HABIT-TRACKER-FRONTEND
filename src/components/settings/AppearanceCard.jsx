import { useEffect } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { setTheme } from "../../store/themeSlice";

export default function AppearanceCard() {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.theme);

  const options = ["light", "dark", "system"];

  return (
    <div className="rounded-xl p-6 h-full flex flex-col justify-between bg-white dark:bg-[#1D1B20] ">
      
      {/* Title */}
      <div>
        <p className="text-[10px] tracking-[0.2em] uppercase mb-2 text-[#888888] dark:text-[#938F99]">
          VISUALS
        </p>

        <h2
          className="text-2xl font-semibold text-[#1A1A1A] dark:text-[#E6E1E5]"
          style={{ fontFamily: "Epilogue" }}
        >
          appearance
        </h2>
      </div>

      {/* Toggle */}
      <div className="relative grid grid-cols-3 bg-[#F3F3F3] dark:bg-[#2A2A2A] rounded-full p-1 mt-6">
        
        {/* Animated pill */}
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className="absolute top-1 bottom-1 rounded-full bg-[#1A1A1A] dark:bg-[#D0BCFF] shadow-sm"
          style={{
            width: "calc(100% / 3 - 6px)",
            left:
              theme === "light"
                ? "4px"
                : theme === "dark"
                ? "calc(33.33% + 2px)"
                : "calc(66.66% + 2px)",
          }}
        />

        {options.map((opt) => {
          const isActive =
            theme === opt ||
            (opt === "system" &&
              !["light", "dark"].includes(theme));

          return (
            <button
              key={opt}
              onClick={() => dispatch(setTheme(opt))}
              className={`relative z-10 py-2 text-xs tracking-wide transition-all duration-200 ${
                isActive
                  ? "text-[#FAFAF5] dark:text-black font-medium"
                  : "text-[#888888] dark:text-[#938F99]"
              }`}
            >
              {opt.toUpperCase()}
            </button>
          );
        })}
      </div>
    </div>
  );
}