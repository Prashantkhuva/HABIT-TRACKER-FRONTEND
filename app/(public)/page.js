"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import LandingPage from "@/views/LandingPage";

export default function Home() {
  const router = useRouter();
  const { status: authStatus, isAuthChecked } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthChecked) return;
    if (authStatus) {
      router.replace("/dashboard");
    }
  }, [isAuthChecked, authStatus, router]);

  if (!isAuthChecked) return null;

  if (authStatus) return null;

  return <LandingPage />;
}
