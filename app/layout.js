import { Epilogue, Manrope } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import ClientBody from "./client-body";
import { getStructuredData, getFAQStructuredData } from "@/lib/seo-config";

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
  other: {
    "application/ld+json:website": JSON.stringify(getStructuredData()),
    "application/ld+json:faq": JSON.stringify(getFAQStructuredData()),
  },
};

export const viewport = {
  themeColor: "#FAFAF5",
};

export default function RootLayout({ children }) {
  const structuredData = getStructuredData();
  const faqData = getFAQStructuredData();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${epilogue.variable} ${manrope.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://habit-tracker-t0o0.onrender.com" />
        <link
          rel="alternate"
          type="text/markdown"
          href="/llms.txt"
          title="LLMs TXT"
        />
        <link
          rel="alternate"
          type="text/markdown"
          href="/llms-full.txt"
          title="LLMs Full TXT"
        />
        <script
          type="application/ld+json"
          id="ld-structured-data"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <script
          type="application/ld+json"
          id="ld-faq-data"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("habitflow-theme");var dark=t==="dark"||(t===null||t==="system")&&window.matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.classList.toggle("dark",dark);var id=localStorage.getItem("habitflow-accent")||"forest";var m={forest:"#4b6b63",ocean:"#2b6cb0",plum:"#7c3aed",ember:"#c2410c"};var c=m[id]||m.forest;var s=document.createElement("style");s.id="habitflow-accent-style";s.textContent=":root{--color-accent-mint:"+c+";}";document.head.appendChild(s);}catch(e){}})();`,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <Providers>
          <ClientBody>{children}</ClientBody>
        </Providers>
      </body>
    </html>
  );
}
