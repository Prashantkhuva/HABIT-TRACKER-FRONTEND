import { useSelector } from "react-redux";
import { User } from "lucide-react";
import Button from "../Button";
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProfileCard() {
  const user = useSelector((state) => state.auth.userData);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="rounded-[28px] p-7 flex items-center gap-6 transition-all"
      style={{ background: "#F0EDE5" }}
    >
      {/* Avatar */}
      <div
        className="w-20 h-20 rounded-2xl flex items-center justify-center"
        style={{ background: "#E8E4DC" }}
      >
        <User size={32} color="#9A9A8A" />
      </div>

      {/* Info */}
      <div className="flex-1">
        <p className="text-xs tracking-widest mb-1 text-[#9A9A8A]">
          PERSONAL PROFILE
        </p>
        <h2 className="text-2xl font-bold text-[#1A1A1A]">
          {user?.fullname || user?.username || "habitflow user"}
        </h2>
        <p className="text-sm text-[#9A9A8A]">{user?.email || ""}</p>
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
