/** Canonical site URL — override in production via VITE_SITE_URL */
export const SITE_URL = (
  import.meta.env.VITE_SITE_URL || "https://habit-flow-fullstack.vercel.app"
).replace(/\/$/, "");

export const SITE_NAME = "HabitFlow";
export const SITE_TAGLINE = "Premium Editorial Habit Tracking";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

export const PUBLIC_ROUTES = ["/", "/signin", "/signup"];

/** Per-route SEO — private app routes use noindex */
export const ROUTE_SEO = {
  "/": {
    title: "HabitFlow — Editorial Habit Tracker for Daily Rituals & Streaks",
    description:
      "HabitFlow is a premium editorial habit tracker for building daily rituals, streaks, and consistency. Track rituals, visualize progress, and cultivate intentional routines.",
    robots: "index, follow",
    ogType: "website",
  },
  "/signin": {
    title: "Sign In — HabitFlow",
    description:
      "Sign in to your HabitFlow account and continue your daily rituals.",
    robots: "index, follow", // ✅
    ogType: "website",
  },
  "/signup": {
    title: "Create Account — HabitFlow",
    description:
      "Create a free HabitFlow account and start building editorial daily rituals.",
    robots: "index, follow", // ✅
    ogType: "website",
  },
};

export const PRIVATE_ROUTE_SEO = {
  title: "HabitFlow",
  description: "Your personal habit tracking workspace.",
  robots: "noindex, nofollow",
  ogType: "website",
};

/** JSON-LD for homepage (also in index.html for first paint) */
export function getStructuredData() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: SITE_URL,
        description:
          "Premium editorial habit tracking for daily rituals, streaks, and intentional routines.",
        inLanguage: "en",
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/logo.png`,
        founder: {
          "@type": "Person",
          name: "Prashant Khuva",
        },
      },
      {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "@id": `${SITE_URL}/#app`,
        name: SITE_NAME,
        url: SITE_URL,
        applicationCategory: "LifestyleApplication",
        operatingSystem: "Web",
        browserRequirements: "Requires JavaScript",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        description:
          "Editorial habit tracker with ritual tracking, streak analytics, heatmaps, and a calm, distraction-free interface.",
        featureList: [
          "Daily ritual and habit tracking",
          "Streak and consistency analytics",
          "Editorial, distraction-free UI",
          "Progress heatmaps and weekly charts",
          "Reflection notes and habit archives",
        ],
      },
    ],
  };
}
