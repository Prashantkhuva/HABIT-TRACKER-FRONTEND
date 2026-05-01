import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AlertTriangle } from "lucide-react";
import { deleteAccount } from "../../api/auth-api";
import { signout } from "../../store/authSlice";
import ConfirmModal from "../ConfirmModal";
import Button from "../Button";

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

      navigate("/login");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      {/* CARD */}
      <div className="rounded-xl p-5 sm:p-7 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 bg-white dark:bg-[#1D1B20] ">
        
        {/* Icon */}
        <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 bg-red-500/10">
          <AlertTriangle size={20} className="text-red-500" />
        </div>

        {/* Text */}
        <div className="flex-1">
          <h3 className="font-bold text-base sm:text-lg text-[#1A1A1A] dark:text-[#E6E1E5]">
            account termination
          </h3>

          <p className="text-sm text-[#888888] dark:text-[#938F99] leading-relaxed">
            this action is irreversible. all tracking history, rituals, and
            personal statistics will be permanently removed from our servers.
          </p>
        </div>

        {/* Button */}
        <div className="w-full sm:w-auto">
          <Button
            variant="ghost"
            color="red"
            onClick={() => setOpen(true)}
            className="w-full sm:w-auto px-5 py-2 text-xs"
          >
            DELETE ACCOUNT
          </Button>
        </div>
      </div>

      {/* Modal */}
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