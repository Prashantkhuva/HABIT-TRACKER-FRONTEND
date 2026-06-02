import "./globals.css";
import Providers from "./providers";
import ClientBody from "./client-body";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "HabitFlow — Editorial Habit Tracker for Daily Rituals & Streaks",
  description:
    "HabitFlow is a premium editorial habit tracker for building daily rituals, streaks, and consistency. Track rituals, visualize progress, and cultivate intentional routines.",
  metadataBase: new URL("https://habitflow.indevs.in"),
  robots: "index, follow",
  authors: [{ name: "Prashant Khuva" }],
  openGraph: {
    type: "website",
    url: "https://habitflow.indevs.in",
    siteName: "HabitFlow",
    title: "HabitFlow — Editorial Habit Tracker for Daily Rituals & Streaks",
    description:
      "Premium editorial habit tracking for daily rituals, streaks, and intentional routines.",
    images: [{ url: "/og-image.png" }],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "HabitFlow — Editorial Habit Tracker for Daily Rituals & Streaks",
    description:
      "Premium editorial habit tracking for daily rituals, streaks, and intentional routines.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport = {
  themeColor: "#FAFAF5",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Epilogue:ital,wght@0,100..900;1,100..900&family=Manrope:wght@200..800&display=swap"
        />
      </head>
      <body>
        <Providers>
          <ClientBody>
            {children}
          </ClientBody>
        </Providers>
      </body>
    </html>
  );
}
