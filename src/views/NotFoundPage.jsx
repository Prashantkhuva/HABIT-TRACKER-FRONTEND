"use client";

import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6">
      <h1 className="text-[clamp(64px,16vw,120px)] font-semibold leading-none tracking-[-0.05em] text-text-primary">
        404
      </h1>
      <p className="text-sm text-text-muted">This page doesn&apos;t exist</p>
      <Link
        href="/dashboard"
        className="rounded-full bg-primary px-6 py-3 text-xs font-bold uppercase tracking-widest text-background"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}
