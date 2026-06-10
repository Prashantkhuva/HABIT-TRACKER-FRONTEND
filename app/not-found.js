import Link from "next/link";

export const metadata = {
  robots: "noindex, nofollow",
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <span className="app-label mb-4">404</span>
      <h1 className="app-heading text-6xl sm:text-7xl">Off the grid</h1>
      <p className="app-muted mt-4 max-w-md text-base leading-relaxed">
        This page doesn&apos;t exist — or it wandered off.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-primary px-8 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-80"
      >
        Go home
      </Link>
    </div>
  );
}
