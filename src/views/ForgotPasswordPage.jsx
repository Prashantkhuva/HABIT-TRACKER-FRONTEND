import { useState } from "react";
import { forgotPassword } from "../api/auth-api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [resetLink, setResetLink] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await forgotPassword({ email });
      if (res.data?.data?.resetUrl) {
        setResetLink(res.data.data.resetUrl);
      }
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-background text-text-primary overflow-hidden flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-surface/80 backdrop-blur-md border border-border-subtle/60 rounded-3xl p-8 shadow-xl">
          <a href="/signin" className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors mb-6">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
            Back to sign in
          </a>

          <h1 className="font-heading text-2xl font-bold mb-2 text-text-primary">Reset password</h1>
          <p className="text-sm text-text-muted mb-6">Enter your email and we'll send you a reset link.</p>

          {sent ? (
            <div className="text-center py-4">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-mint/10">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4B6B63" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <h2 className="font-heading text-lg font-bold text-text-primary mb-2">Reset link generated</h2>
              <p className="text-sm text-text-muted mb-4">Click the link below to reset your password. It expires in 15 minutes.</p>
              {resetLink ? (
                <a
                  href={resetLink}
                  className="inline-block rounded-full bg-primary px-6 py-3 text-xs font-bold tracking-wider text-background shadow-lg transition-all hover:bg-primary-soft mb-4"
                >
                  Reset password
                </a>
              ) : (
                <p className="text-xs text-text-muted">If an account exists with that email, a reset link would be sent.</p>
              )}
              {resetLink && (
                <p className="text-xs text-text-muted">
                  Or copy this link: <span className="text-primary select-all break-all">{resetLink}</span>
                </p>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <p className="text-danger text-sm">{error}</p>}
              <label className="block">
                <span className="app-label mb-2 block">Email</span>
                <input
                  type="email"
                  placeholder="hello@habitflow.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-full border border-border-subtle bg-surface px-5 py-3 text-sm text-text-primary placeholder:text-text-muted/55 transition-all focus:border-primary/40 focus:outline-none focus:ring-4 focus:ring-primary/8"
                />
              </label>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-primary py-3 text-xs font-bold tracking-wider text-background shadow-lg transition-all hover:bg-primary-soft disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send reset link"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
