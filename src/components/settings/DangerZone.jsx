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
      <div className="app-surface flex flex-col gap-4 rounded-2xl p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-7">
        
        {/* Icon */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-danger-soft">
          <AlertTriangle size={20} className="text-danger" />
        </div>

        {/* Text */}
        <div className="flex-1">
          <h3 className="font-heading text-base font-bold tracking-[-0.03em] text-text-primary sm:text-lg">
            account termination
          </h3>

          <p className="text-sm leading-relaxed text-text-muted">
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
