import { SITE_URL } from "@/lib/seo-config";

export const metadata = {
  title: "HabitFlow Blog — Guides on Habit Building & Daily Rituals",
  description:
    "Practical guides on habit building, streak tracking, habit stacking, and daily rituals. Learn how to build consistent routines that stick.",
  robots: "index, follow",
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/blog`,
    siteName: "HabitFlow",
    title: "HabitFlow Blog — Guides on Habit Building & Daily Rituals",
    description:
      "Practical guides on habit building, streak tracking, habit stacking, and daily rituals. Learn how to build consistent routines that stick.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "HabitFlow Blog — Guides on Habit Building & Daily Rituals",
    description:
      "Practical guides on habit building, streak tracking, habit stacking, and daily rituals.",
    images: ["/og-image.png"],
  },
};

export default function BlogLayout({ children }) {
  return <>{children}</>;
}
