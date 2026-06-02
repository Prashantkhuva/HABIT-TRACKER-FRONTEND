"use client";

import Link from "next/link";

export default function ErrorBoundary() {

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#FAFAF5] px-6">
      <h1 className="text-[clamp(80px,20vw,160px)] font-black leading-none tracking-[-0.08em] text-[#1A1A1A]">
        500
      </h1>
      <p className="mt-4 text-sm text-[#8B8477]">Something went wrong</p>
      <Link
        href="/dashboard"
        className="mt-8 rounded-full bg-[#1A1A1A] px-6 py-3 text-xs font-bold uppercase tracking-widest text-white"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
