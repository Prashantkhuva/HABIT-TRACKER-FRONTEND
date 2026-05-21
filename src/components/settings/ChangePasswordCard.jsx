import { useState } from "react";
import { changePassword } from "../../api/auth-api";
import { useToast } from "../Toast/ToastProvider";
import Button from "../Button";
import Input from "../Input";

export default function ChangePasswordCard() {
  const { addToast } = useToast();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
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

      setOldPassword("");
      setNewPassword("");
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
    <div
      className="app-surface rounded-2xl p-6"
    >
      <p className="app-label mb-2">
        SECURITY
      </p>

      <h2 className="font-heading mb-6 text-xl font-semibold tracking-[-0.04em] text-text-primary">
        change password
      </h2>

      <div className="flex flex-col gap-4">
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

      <div className="mt-6 flex justify-end">
        <Button onClick={handleChangePassword}>
          {loading ? "Updating..." : "UPDATE PASSWORD"}
        </Button>
      </div>
    </div>
  );
}
