import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

function SearchBar() {
  const [focused, setFocused] = useState(false);

  return (
    <motion.div
      className="w-full max-w-xl"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="flex items-center gap-3 px-5 py-3 rounded-full bg-[#EDEBE6] shadow-sm"
        animate={{
          scale: focused ? 1.02 : 1,
          boxShadow: focused
            ? "0 8px 25px rgba(0,0,0,0.08)"
            : "0 2px 6px rgba(0,0,0,0.05)",
        }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        <Search size={18} className="text-gray-500" />

        <input
          type="text"
          placeholder="Search rituals..."
          className="bg-transparent outline-none w-full text-sm text-gray-700 placeholder:text-gray-400"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </motion.div>
    </motion.div>
  );
}

export default SearchBar;