"use client";

import { useSelector } from "react-redux";
import { User } from "lucide-react";
import Button from "../Button";
import { motion } from "framer-motion";

import { useRouter } from "next/navigation";

export default function ProfileCard() {
  const user = useSelector((state) => state.auth.userData);
  const router = useRouter();

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 360, damping: 28 }}
      className="app-surface flex flex-col items-center gap-4 rounded-2xl p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-7"
    >
      {/* Avatar */}
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-surface-dim sm:h-20 sm:w-20">
        <User size={32} className="text-text-muted" />
      </div>

      {/* Info */}
      <div className="flex-1 text-center sm:text-left min-w-0">
        <p className="app-label mb-1">
          PERSONAL PROFILE
        </p>
        <h2 className="font-heading text-xl sm:text-2xl font-bold tracking-[-0.04em] text-text-primary truncate">
          {user?.fullname || user?.username || "habitflow user"}
        </h2>
        <p className="text-sm text-text-muted truncate">{user?.email || ""}</p>
      </div>

      {/* Button */}
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
