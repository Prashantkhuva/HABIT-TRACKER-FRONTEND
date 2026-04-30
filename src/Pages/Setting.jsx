import { motion } from "framer-motion";
import ProfileCard from "../components/settings/ProfileCard";
import AppearanceCard from "../components/settings/AppearanceCard";
import DangerZone from "../components/settings/DangerZone";
import { useState, useEffect } from "react";
import { SettingsSkeleton } from "../components/loading/LoadingSkeletons";
import { HelpCircle, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signout } from "../store/authSlice";
import { logout } from "../api/auth-api";

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
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleSignOut = async () => {
    try {
      await logout(); // 🔥 IMPORTANT (cookie clear karega)
    } catch (err) {
      console.log(err);
    }

    dispatch(signout());
    navigate("/signin", { replace: true });
  };

  if (loading) return <SettingsSkeleton />;

  return (
    <div className="text-text-primary">
      <div className="w-full max-w-[1400px] mx-auto">

        {/* Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0}
          className="mb-10"
        >
          <h1 className="font-bold text-[clamp(2.5rem,5vw,4rem)] tracking-[-0.04em] text-text-primary dark:text-white" style={{ fontFamily: "Epilogue, sans-serif" }}>
            settings
          </h1>
          <p className="text-xs tracking-widest mt-1 text-text-muted">
            CONFIGURE YOUR CREATIVE SPACE
          </p>
        </motion.div>

        {/* 70 / 30 layout */}
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
          className="mb-6"
        >
          <DangerZone />
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={3}
          className="flex flex-row justify-end items-start gap-2"
        >
          {/* Help */}
          <button
            onClick={() => navigate("/help")}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-text-muted dark:text-dark-text-muted hover:bg-surface dark:hover:bg-dark-surface hover:text-text-primary dark:hover:text-dark-text-primary transition-all duration-200"
          >
            <HelpCircle size={16} />
            <span>Help</span>
          </button>

          {/* Logout */}
          <button
            onClick={handleSignOut}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
}
