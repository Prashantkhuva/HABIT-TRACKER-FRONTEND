import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AlertTriangle } from "lucide-react";
import { deleteAccount } from "../../api/auth-api";
import { signout } from "../../store/authSlice";
import ConfirmModal from "../ConfirmModal";
import Button from "../Button";
import Toast from "../Toast/Toast";
import ToastProvider from "../Toast/ToastProvider";

export default function DangerZone() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleDelete = async () => {
    try {
      setLoading(true);

      await deleteAccount();

      dispatch(signout());

      addToast({
        type: "success",
        title: "Account deleted",
        message: "Your account has been removed successfully",
      });

      navigate("/login");
    } catch (err) {
      addToast({
        type: "error",
        title: "Delete failed",
        message: "Could not delete account",
      });
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      {/* 🔥 FULL CARD (text wapas aa gaya 😏) */}
      <div
        className="rounded-[28px] p-7 flex items-center gap-6"
        style={{ background: "#FAFAF5", border: "1.5px solid #E8E4DC" }}
      >
        {/* Icon */}
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
          style={{ background: "#FADADD" }}
        >
          <AlertTriangle size={20} color="#C0392B" />
        </div>

        {/* Text */}
        <div className="flex-1">
          <h3 className="font-bold text-lg text-[#1A1A1A]">
            account termination
          </h3>

          <p className="text-sm text-[#9A9A8A] leading-relaxed">
            this action is irreversible. all tracking history, rituals, and
            personal statistics will be permanently removed from our servers.
          </p>
        </div>

        {/* Button */}
        <Button
          variant="ghost"
          color="red"
          onClick={() => setOpen(true)}
          className="px-5 py-2 text-xs"
        >
          DELETE ACCOUNT
        </Button>
      </div>

      {/* 🔥 Modal */}
      <ConfirmModal
        open={open}
        onCancel={() => setOpen(false)}
        onConfirm={handleDelete}
        loading={loading}
        title="Delete your account?"
        description="This action is irreversible. All your habits, history and data will be permanently removed."
        confirmText="DELETE"
      />
    </>
  );
}
