import { useSelector } from "react-redux";
import { User } from "lucide-react";
import Button from "../Button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function ProfileCard() {
  const user = useSelector((state) => state.auth.userData);
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 360, damping: 28 }}
      className="app-surface flex items-center gap-6 rounded-2xl p-7"
    >
      {/* Avatar */}
      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-surface-dim">
        <User size={32} className="text-text-muted" />
      </div>

      {/* Info */}
      <div className="flex-1">
        <p className="app-label mb-1">
          PERSONAL PROFILE
        </p>
        <h2 className="font-heading text-2xl font-bold tracking-[-0.04em] text-text-primary">
          {user?.fullname || user?.username || "habitflow user"}
        </h2>
        <p className="text-sm text-text-muted">{user?.email || ""}</p>
      </div>

      {/* Button */}
      <Button
        variant="ghost"
        onClick={() => navigate("/edit-profile")}
        className="px-5 py-2 text-xs"
      >
        EDIT PROFILE
      </Button>
    </motion.div>
  );
}
