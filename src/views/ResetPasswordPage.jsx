"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { resetPassword } from "../api/auth-api";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><p className="text-text-muted">Loading...</p></div>}>
      <ResetForm />
    </Suspense>
  );
}

function ResetForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Invalid or missing reset token.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await resetPassword({ token, password });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="relative min-h-screen bg-background text-text-primary overflow-hidden flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md bg-surface/80 backdrop-blur-md border border-border-subtle/60 rounded-3xl p-8 shadow-xl text-center">
          <h1 className="font-heading text-2xl font-bold mb-4 text-text-primary">Invalid Link</h1>
          <p className="text-sm text-text-muted mb-6">This reset link is invalid or has expired.</p>
          <a href="/forgot-password" className="text-sm text-primary underline">Request a new reset link</a>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="relative min-h-screen bg-background text-text-primary overflow-hidden flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md bg-surface/80 backdrop-blur-md border border-border-subtle/60 rounded-3xl p-8 shadow-xl text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-mint/10">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4B6B63" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5"/>
            </svg>
          </div>
          <h1 className="font-heading text-2xl font-bold mb-2 text-text-primary">Password Reset</h1>
          <p className="text-sm text-text-muted mb-6">Your password has been reset successfully.</p>
          <a href="/signin" className="inline-block rounded-full bg-primary px-8 py-3 text-xs font-bold tracking-wider text-background shadow-lg transition-all hover:bg-primary-soft">Sign in</a>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background text-text-primary overflow-hidden flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-surface/80 backdrop-blur-md border border-border-subtle/60 rounded-3xl p-8 shadow-xl">
          <h1 className="font-heading text-2xl font-bold mb-2 text-text-primary">Set new password</h1>
          <p className="text-sm text-text-muted mb-6">Enter your new password below.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-danger text-sm">{error}</p>}
            <label className="block">
              <span className="app-label mb-2 block">New password</span>
              <input
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-full border border-border-subtle bg-surface px-5 py-3 text-sm text-text-primary placeholder:text-text-muted/55 transition-all focus:border-primary/40 focus:outline-none focus:ring-4 focus:ring-primary/8"
              />
            </label>
            <label className="block">
              <span className="app-label mb-2 block">Confirm password</span>
              <input
                type="password"
                placeholder="Repeat your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full rounded-full border border-border-subtle bg-surface px-5 py-3 text-sm text-text-primary placeholder:text-text-muted/55 transition-all focus:border-primary/40 focus:outline-none focus:ring-4 focus:ring-primary/8"
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-primary py-3 text-xs font-bold tracking-wider text-background shadow-lg transition-all hover:bg-primary-soft disabled:opacity-50"
            >
              {loading ? "Resetting..." : "Reset password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
