import { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../api/auth-api";
import { useToast } from "../components/Toast/ToastProvider";
import Input from "../components/Input";
import Button from "../components/Button";

export default function ChangePasswordModal() {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClose = () => navigate("/settings");

  const handleSubmit = async () => {
    if (!oldPassword || !newPassword) {
      return addToast({
        type: "error",
        title: "Missing fields",
        message: "Please fill all fields",
      });
    }

    try {
      setLoading(true);

      await changePassword({ oldPassword, newPassword });

      addToast({
        type: "success",
        title: "Password updated",
        message: "Your password has been changed",
      });

      navigate("/settings");
    } catch (err) {
      addToast({
        type: "error",
        title: "Update failed",
        message: err.response?.data?.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 dark:bg-black/60 backdrop-blur-sm px-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="
          relative w-full max-w-md
          rounded-[28px] p-7
          bg-[#FAFAF5] text-[#1A1A1A]
          dark:bg-[#1A1A1A] dark:text-[#E6E1E5]
          border border-[#E8E4DC] dark:border-[#2A2A2A]
        "
      >
        {/* CLOSE */}
        <button
          onClick={handleClose}
          className="absolute right-5 top-5 text-[#888888] dark:text-[#938F99]"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-semibold mb-6">
          change password
        </h2>

        <div className="flex flex-col gap-5">
          <Input
            type="password"
            label="Current Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />

          <Input
            type="password"
            label="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <div className="mt-8 flex justify-end">
          <Button onClick={handleSubmit}>
            {loading ? "Updating..." : "UPDATE PASSWORD"}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}