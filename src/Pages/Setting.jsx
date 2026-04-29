import { motion } from "framer-motion";
import ProfileCard from "../components/settings/ProfileCard";
import AppearanceCard from "../components/settings/AppearanceCard";
import DangerZone from "../components/settings/DangerZone";
import { useState } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.08,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export default function SettingsPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen py-10 px-6 bg-[#FAFAF5]">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0}
          className="mb-10"
        >
          <h1 className="font-bold text-[clamp(2.5rem,5vw,4rem)] tracking-[-0.04em] text-[#1A1A1A]">
            settings
          </h1>
          <p className="text-xs tracking-widest mt-1 text-[#9A9A8A]">
            CONFIGURE YOUR CREATIVE SPACE
          </p>
        </motion.div>

        {/* 🔥 70 / 30 layout */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={1}
          className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 mb-6"
        >
          <ProfileCard />
          <AppearanceCard />
        </motion.div>

        {/* Danger */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={2}
        >
          <DangerZone />
        </motion.div>
      </div>
    </div>
  );
}
