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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-150 rounded-4xl p-10"
        style={{ background: "#F5F3EE" }}
      >
        {/* CLOSE */}
        <button onClick={handleClose} className="absolute right-6 top-6">
          <X />
        </button>

        <h2 className="text-2xl font-semibold mb-6">edit profile</h2>

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
          <button onClick={handleClose} className="text-xs text-gray-500">
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
