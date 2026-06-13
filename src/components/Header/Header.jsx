"use client";

import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import NotificationDropdown from "../NotificationDropdown";
import AvatarDropdown from "../AvatarDropdown";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
}

function Header() {
  const user = useSelector((state) => state.auth.userData);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 h-16 w-full border-b border-border-subtle/50 bg-background/80 backdrop-blur-2xl lg:h-20"
    >
      <div className="mx-auto flex h-full w-full max-w-screen-2xl items-center justify-between px-5 lg:px-10">
        <div>
          <h1 className="font-heading text-lg font-semibold tracking-[-0.03em] text-text-primary sm:text-xl lg:text-2xl">
            {getGreeting()}
            {user?.username && <span className="text-accent-mint">, {user.username}</span>}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <NotificationDropdown />
          <AvatarDropdown />
        </div>
      </div>
    </motion.header>
  );
}

export default Header;
