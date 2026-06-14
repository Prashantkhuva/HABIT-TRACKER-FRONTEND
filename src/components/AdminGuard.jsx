"use client";

import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isAdmin } from "@/lib/admin";

export default function AdminGuard({ children }) {
  const router = useRouter();
  const user = useSelector((state) => state.auth.userData);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!isAdmin(user)) {
      router.replace("/dashboard");
    } else {
      setChecking(false);
    }
  }, [user, router]);

  if (checking) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-accent-mint border-t-transparent" />
          <p className="app-label">Checking access...</p>
        </div>
      </div>
    );
  }

  return children;
}
