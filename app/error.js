"use client";

export default function Error({ error, reset }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <span className="app-label mb-4">Error</span>
      <h1 className="app-heading text-5xl sm:text-6xl">Something broke</h1>
      <p className="app-muted mt-4 max-w-md text-base leading-relaxed">
        {error?.message || "An unexpected error occurred."}
      </p>
      <button
        onClick={() => reset()}
        className="mt-8 rounded-full bg-primary px-8 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-80"
      >
        Try again
      </button>
    </div>
  );
}
