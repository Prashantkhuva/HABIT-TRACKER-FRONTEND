import { motion, AnimatePresence } from "framer-motion";
import Button from "./Button";

export default function ConfirmModal({
  open,
  title = "Are you sure?",
  description,
  confirmText = "CONFIRM",
  cancelText = "CANCEL",
  onConfirm,
  onCancel,
  loading = false,
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={onCancel}
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 10, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="relative w-[92%] max-w-md rounded-[28px] p-7 
bg-[#FAFAF5] text-[#1A1A1A] 
dark:bg-[#1A1A1A] dark:text-[#E6E1E5] 
border border-[#E8E4DC] dark:border-[#2A2A2A]"
          >
            <h3 className="text-lg font-bold text-text-primary dark:text-white mb-2">
              {title}
            </h3>

            {description && (
              <p className="text-sm text-text-muted mb-6 leading-relaxed">
                {description}
              </p>
            )}

            <div className="flex justify-end gap-3">
              <Button
                variant="ghost"
                onClick={onCancel}
                className="px-4 py-2 text-xs"
                disabled={loading}
              >
                {cancelText}
              </Button>

              <Button
                variant="ghost"
                color="red"
                onClick={onConfirm}
                className="px-4 py-2 text-xs"
                disabled={loading}
              >
                {loading ? "DELETING..." : confirmText}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}