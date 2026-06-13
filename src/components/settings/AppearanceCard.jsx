import { motion } from "framer-motion";

export default function AppearanceCard() {
  const options = ["light", "dark", "system"];
  const theme = "light";

  return (
    <div className="app-surface flex h-full flex-col justify-between rounded-2xl p-6">
      
      <div>
        <p className="app-label mb-2">
          VISUALS
        </p>

        <h2
          className="font-heading text-2xl font-semibold tracking-[-0.04em] text-text-primary"
        >
          appearance
        </h2>
      </div>

      <div
        className="relative mt-6 grid cursor-not-allowed select-none grid-cols-3 rounded-full bg-surface-dim p-1 opacity-70"
        aria-disabled="true"
      >
        
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className="absolute bottom-1 top-1 rounded-full bg-primary shadow-sm"
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
              type="button"
              disabled
              className={`relative z-10 py-2 text-xs tracking-wide transition-all duration-200 ${
                isActive
                  ? "font-medium text-background"
                  : "text-text-muted"
              } cursor-not-allowed`}
            >
              {opt.toUpperCase()}
            </button>
          );
        })}
      </div>

      <p className="app-label mt-3">
        Coming soon
      </p>
    </div>
  );
}
