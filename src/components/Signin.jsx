import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signin as authLogin, signin } from "../store/authSlice";
import { Button, Input } from "./index";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { motion, setFeatureDefinitions } from "framer-motion";
import { registerUser, getCurrentUser, login } from "../api/auth-api";
import { img } from "framer-motion/client";

const Signin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { register, handleSubmit } = useForm();

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const create = async (data) => {
    setError("");
    setIsSubmitting(true);

    try {
      const session = await register(data);

      if (session) {
        const userData = await getCurrentUser();

        if (userData) {
          const safeUserData = toPlainData({
            $id: userData.$id,
            name: userData.name,
            email: userData.email,
          });

          dispatch(authLogin({ userData: safeUserData }));
        }
        navigate("/");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <>
      <div className="relative min-h-screen bg-[#F3F1EA] overflow-hidden">
        {/* 🔥 Bottom Left Blur */}
        <div className="-rotate-4 absolute left-10 bottom-10 w-50 h-77.5 rounded-3xl overflow-hidden opacity-30 pointer-events-none">
          <img
            src="/signinbtm.png"
            alt=""
            className="w-full h-full object-cover scale-125 blur-[1px]"
          />
        </div>

        {/* 🔥 Top Right Blur */}
        <div className="absolute right-10 top-10 w-42.5 h-42.5 rounded-full overflow-hidden opacity-40 pointer-events-none">
          <img
            src="/signintop.png"
            alt=""
            className="w-full h-full object-cover scale-125 blur-[3px]"
          />
        </div>

        {/* CONTENT */}
        <div className="relative z-10">
          {/* 🔹 Top Logo Section */}
          <div className="flex flex-col items-center gap-4 pt-10">
            <div className="w-14 h-14 rounded-full bg-[#C8E6DF] flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path
                  d="M18 8L16.75 5.25L14 4L16.75 2.75L18 0L19.25 2.75L22 4L19.25 5.25L18 8ZM18 22L16.75 19.25L14 18L16.75 16.75L18 14L19.25 16.75L22 18L19.25 19.25L18 22ZM8 19L5.5 13.5L0 11L5.5 8.5L8 3L10.5 8.5L16 11L10.5 13.5L8 19ZM8 14.15L9 12L11.15 11L9 10L8 7.85L7 10L4.85 11L7 12L8 14.15Z"
                  fill="#4D6863"
                />
              </svg>
            </div>

            <div
              className="text-center font-bold text-3xl"
              style={{ fontFamily: "Epilogue, sans-serif" }}
            >
              habitflow
            </div>

            <p className="text-xs tracking-widest text-[#9A9A8A]">
              PREMIUM EDITORIAL TRACKING
            </p>
          </div>

          {/* 🔹 Form Section */}
          <div className="min-h-[75vh] flex items-center justify-center px-4">
            <motion.div
              className="w-full max-w-md"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="bg-white/80 backdrop-blur-md border border-[#E8E4DC] rounded-4xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
                <h2 className="text-2xl font-semibold mb-2">Welcome Back</h2>

                <hr className="border-t-2 border-[#1A1A1A] w-16 mb-5 mt-7" />

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <form onSubmit={handleSubmit(create)} className="space-y-4">
                  <Input
                    type="email"
                    label="Email"
                    placeholder="hello@habitflow.com"
                    {...register("email", { required: true })}
                  />

                  <Input
                    type="password"
                    label="Password"
                    placeholder="••••••••"
                    {...register("password", { required: true })}
                  />

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-2"
                  >
                    {isSubmitting ? "Creating..." : "Sign in"}
                  </Button>
                </form>

                <p className="text-center text-sm mt-6 text-[#6A6A5A]">
                  Don't have account?{" "}
                  <Link to="/signup" className="font-medium text-black">
                    Sign up
                  </Link>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
        <p className="text-sm text-[#6A6A5A] pt-3 pb-2 text-center font-thin font-body">
          "rituals turn intention into reality."
        </p>
      </div>
    </>
  );
};

export default Signin;
