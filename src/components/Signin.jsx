"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signin as authLogin } from "../store/authSlice";
import Button from "./Button";
import Input from "./Input";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { login } from "../api/auth-api";
const Signin = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleLogin = async (data) => {
    setError("");
    setIsSubmitting(true);
    try {
      const response = await login(data);
      const user = response?.data?.data?.user;
      if (user) {
        dispatch(authLogin({ userData: user }));
        router.push("/dashboard");
      } else {
        setError("Login failed: user not found");
      }
    } catch (error) {
      setError(error.response?.data?.message || error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-background text-text-primary overflow-hidden">
      <div className="max-sm:hidden -rotate-4 absolute left-10 bottom-10 w-50 h-77.5 rounded-3xl overflow-hidden opacity-30 pointer-events-none">
        <img src="/signinbtm.png" alt="" loading="lazy" className="w-full h-full object-cover scale-125 blur-[1px]" />
      </div>
      <div className="max-sm:hidden absolute right-10 top-10 w-42.5 h-42.5 rounded-full overflow-hidden opacity-40 pointer-events-none">
        <img src="/signintop.png" alt="" loading="lazy" className="w-full h-full object-cover scale-125 blur-[3px]" />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col items-center gap-4 pt-10">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M18 8L16.75 5.25L14 4L16.75 2.75L18 0L19.25 2.75L22 4L19.25 5.25L18 8ZM18 22L16.75 19.25L14 18L16.75 16.75L18 14L19.25 16.75L22 18L19.25 19.25L18 22ZM8 19L5.5 13.5L0 11L5.5 8.5L8 3L10.5 8.5L16 11L10.5 13.5L8 19ZM8 14.15L9 12L11.15 11L9 10L8 7.85L7 10L4.85 11L7 12L8 14.15Z" fill="#4B6B63" />
            </svg>
          </div>
          <h1 className="font-heading text-3xl font-bold text-text-primary">habitflow</h1>
          <p className="text-xs tracking-widest text-text-muted">PREMIUM EDITORIAL TRACKING</p>
        </div>

        <div className="min-h-[60vh] flex items-center justify-center px-4 py-10 sm:py-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-md"
          >
            <div className="bg-surface/80 backdrop-blur-md border border-border-subtle/60 rounded-3xl p-8 shadow-xl">
              <h1 className="font-heading text-2xl font-bold mb-2 text-text-primary">Welcome Back</h1>
              <hr className="border-t-2 border-primary w-16 mb-5 mt-7" />
              {error && <p className="text-danger text-sm mb-4">{error}</p>}
              <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
                <Input type="email" label="Email" placeholder="hello@habitflow.com" {...register("email", { required: true })} />
                <Input type="password" label="Password" placeholder="••••••••" {...register("password", { required: true })} />
                <div className="flex justify-end">
                  <Link href="/forgot-password" className="text-xs text-text-muted hover:text-text-primary transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <Button type="submit" disabled={isSubmitting} className="w-full mt-2">
                  {isSubmitting ? "Signing in..." : "Sign in"}
                </Button>
              </form>
              <p className="text-center text-sm mt-6 text-text-muted">
                Don't have account?{" "}
                <Link href="/signup" className="font-medium text-text-primary hover:opacity-70 transition-opacity">Sign up</Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
      <p className="text-sm text-text-muted pt-3 pb-2 text-center font-thin font-body">
        &quot;rituals turn intention into reality.&quot;
      </p>
    </div>
  );
};

export default Signin;
