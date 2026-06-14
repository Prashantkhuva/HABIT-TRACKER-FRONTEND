"use client";

import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { signin, signout, setAuthChecked } from "@/store/authSlice";
import { getCurrentUser } from "@/api/auth-api";

export default function AuthInitializer({ children }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const check = async () => {
      try {
        const res = await getCurrentUser();
        const user = res?.data?.data;
        if (user) {
          dispatch(signin({ userData: user }));
        } else {
          dispatch(setAuthChecked());
        }
      } catch {
        dispatch(setAuthChecked());
      }
    };
    check();

    const handleUnauthorized = () => {
      dispatch(signout());
      router.replace("/signin");
    };
    window.addEventListener("unauthorized", handleUnauthorized);

    return () => window.removeEventListener("unauthorized", handleUnauthorized);
  }, [dispatch, router]);

  return children;
}
