/** Canonical site URL — override in production via NEXT_PUBLIC_SITE_URL */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://habitflow.indevs.in"
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
    robots: "index, follow",
    ogType: "website",
  },
  "/signup": {
    title: "Create Account — HabitFlow",
    description:
      "Create a free HabitFlow account and start building editorial daily rituals.",
    robots: "index, follow",
    ogType: "website",
  },
};

export const PRIVATE_ROUTE_SEO = {
  title: "HabitFlow",
  description: "Your personal habit tracking workspace.",
  robots: "noindex, nofollow",
  ogType: "website",
};

export function getFAQStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is HabitFlow?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "HabitFlow is a premium editorial habit tracker that helps you build daily rituals, track streaks, visualize progress with heatmaps and charts, and maintain a reflection journal — all in a calm, distraction-free interface.",
        },
      },
      {
        "@type": "Question",
        name: "Is HabitFlow free to use?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, HabitFlow is completely free to use. You can create unlimited habits, track streaks, view analytics, and write reflection notes at no cost.",
        },
      },
      {
        "@type": "Question",
        name: "How does habit tracking work on HabitFlow?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Create a habit with a title, category icon, color, and frequency (daily or weekly). Each day you complete it, mark it done and optionally add a reflection note. HabitFlow tracks your streak, weekly progress, and long-term consistency through heatmaps and charts.",
        },
      },
      {
        "@type": "Question",
        name: "Can I track multiple habits at once?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, you can create and track unlimited habits simultaneously. Each habit has its own tracking page with a calendar view, completion rate, and reflection log.",
        },
      },
      {
        "@type": "Question",
        name: "What categories of habits can I create?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "HabitFlow supports categories including Health, Fitness, Learning, Productivity, and Mindfulness. Each category has a distinct icon and you can assign a custom color to each habit.",
        },
      },
    ],
  };
}

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
