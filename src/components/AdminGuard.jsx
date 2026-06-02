"use client";

import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { isAdmin } from "@/lib/admin";

export default function AdminGuard({ children }) {
  const router = useRouter();
  const user = useSelector((state) => state.auth.userData);

  useEffect(() => {
    if (!isAdmin(user)) {
      router.replace("/dashboard");
    }
  }, [user, router]);

  if (!isAdmin(user)) return null;

  return children;
}
