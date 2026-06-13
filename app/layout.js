import { Epilogue, Manrope } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import ClientBody from "./client-body";

const epilogue = Epilogue({
  subsets: ["latin"],
  variable: "--font-epilogue",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata = {
  title: "HabitFlow — Editorial Habit Tracker for Daily Rituals & Streaks",
  description:
    "HabitFlow is a premium editorial habit tracker for building daily rituals, streaks, and consistency. Track rituals, visualize progress, and cultivate intentional routines.",
  metadataBase: new URL("https://habitflow.indevs.in"),
  robots: "index, follow",
  alternates: {
    canonical: "/",
  },
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
    <html lang="en" suppressHydrationWarning className={`${epilogue.variable} ${manrope.variable}`}>
      <head>
        <link rel="preconnect" href="https://habit-tracker-t0o0.onrender.com" />
      </head>
      <body suppressHydrationWarning>
        <Providers>
          <ClientBody>
            {children}
          </ClientBody>
        </Providers>
      </body>
    </html>
  );
}
