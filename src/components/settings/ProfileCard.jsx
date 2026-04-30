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
      className="rounded-xl p-7 flex items-center gap-6 transition-all duration-200 bg-white dark:bg-[#1D1B20] border border-[#E8E4DC] dark:border-[#49454F]"
    >
      {/* Avatar */}
      <div className="w-20 h-20 rounded-2xl flex items-center justify-center bg-[#F4F4EF] dark:bg-[#0F0D13]">
        <User size={32} className="text-[#888888] dark:text-[#938F99]" />
      </div>

      {/* Info */}
      <div className="flex-1">
        <p className="text-xs tracking-widest mb-1 text-[#888888] dark:text-[#938F99]">
          PERSONAL PROFILE
        </p>
        <h2 className="text-2xl font-bold text-[#1A1A1A] dark:text-[#E6E1E5]">
          {user?.fullname || user?.username || "habitflow user"}
        </h2>
        <p className="text-sm text-[#888888] dark:text-[#938F99]">{user?.email || ""}</p>
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
