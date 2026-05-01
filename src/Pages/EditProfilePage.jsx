import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateUserDetails } from "../api/auth-api";
import { setUser } from "../store/authSlice";
import Input from "../components/Input";
import Button from "../components/Button";
import { useToast } from "../components/Toast/ToastProvider";

export default function EditProfilePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { addToast } = useToast();

  const user = useSelector((state) => state.auth.userData);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleUpdate = async () => {
    try {
      setLoading(true);

      const res = await updateUserDetails({
        username: username.trim(), // 🔥 IMPORTANT
        email: email.trim(),
      });

      // 🔥 always use user
      dispatch(setUser(res.data.data.user));

      addToast({
        type: "success",
        title: "Profile updated",
        message: "Your details have been updated",
      });

      navigate("/settings");
    } catch (err) {
      console.log(err.response?.data); // debug

      addToast({
        type: "error",
        title: "Update failed",
        message: err.response?.data?.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    navigate("/settings");
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
          className="absolute right-5 top-5 text-[#888888] dark:text-[#938F99] hover:opacity-70"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-semibold mb-6 font-display">
          edit profile
        </h2>

        {/* FORM */}
        <div className="flex flex-col gap-6">
          <Input
            label="User Name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your name"
          />

          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>

        {/* ACTIONS */}
        <div className="mt-8 flex justify-between items-center">
          <button
            onClick={handleClose}
            className="text-xs tracking-widest text-[#888888] dark:text-[#938F99] hover:opacity-70"
          >
            CANCEL
          </button>

          <Button onClick={handleUpdate}>
            {loading ? "Saving..." : "SAVE CHANGES"}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
