"use client";

import { useSelector } from "react-redux";
import { motion } from "framer-motion";

import Button from "../Button";

import { useRouter } from "next/navigation";

const AVATAR_GRADIENTS = [
  "from-[#47655E] to-[#2D4A42]",
  "from-[#8069bf] to-[#4D4465]",
  "from-[#C2B280] to-[#8A7A4F]",
  "from-[#4B6B63] to-[#1A1A1A]",
  "from-[#6B8F9E] to-[#3A5068]",
];

function getGradient(username) {
  if (!username) return AVATAR_GRADIENTS[0];
  const idx = username.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % AVATAR_GRADIENTS.length;
  return AVATAR_GRADIENTS[idx];
}

export default function ProfileCard() {
  const user = useSelector((state) => state.auth.userData);
  const router = useRouter();
  const name = user?.fullname || user?.username || "H";
  const initial = name.charAt(0).toUpperCase();
  const gradient = getGradient(name);

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 360, damping: 28 }}
      className="app-surface flex flex-col items-center gap-4 rounded-2xl p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-7"
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} sm:h-20 sm:w-20 shadow-lg`}
      >
        <span className="text-2xl sm:text-3xl font-bold text-white">
          {initial}
        </span>
      </motion.div>

      <div className="flex-1 text-center sm:text-left min-w-0">
        <p className="app-label mb-1">PERSONAL PROFILE</p>
        <h2 className="font-heading text-xl sm:text-2xl font-bold tracking-[-0.04em] text-text-primary truncate">
          {name}
        </h2>
        <p className="text-sm text-text-muted truncate">{user?.email || ""}</p>
      </div>

      <Button
        variant="ghost"
        onClick={() => router.push("/edit-profile")}
        className="w-full sm:w-auto px-5 py-2 text-xs"
      >
        EDIT PROFILE
      </Button>
    </motion.div>
  );
}
