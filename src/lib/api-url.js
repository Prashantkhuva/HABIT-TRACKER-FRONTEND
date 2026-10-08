import { SITE_URL } from "./seo-config";

/**
 * Absolute API base for server-side fetch (build / ISR).
 * Browser keeps using NEXT_PUBLIC_API_URL as-is (relative = same-origin).
 * Relative URL inside Next's patched fetch hangs prerendering, so resolve origin here.
 */
export function serverApiBase() {
  const api = process.env.NEXT_PUBLIC_API_URL || "";
  if (/^https?:\/\//.test(api)) return api;
  const origin = process.env.VERCEL
    ? SITE_URL
    : `http://localhost:${process.env.PORT || 3000}`;
  return `${origin}${api}`;
}
