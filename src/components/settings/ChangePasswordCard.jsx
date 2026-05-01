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
      className="
      rounded-xl p-6
      bg-[#FAFAF5] dark:bg-[#1D1B20]
    "
    >
      <p className="text-[10px] tracking-widest text-[#888888] dark:text-[#938F99] mb-2">
        SECURITY
      </p>

      <h2 className="text-xl font-semibold mb-6 text-[#1A1A1A] dark:text-[#E6E1E5]">
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
