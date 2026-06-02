import LoginPage from "@/views/LoginPage";
import { ROUTE_SEO, SITE_URL } from "@/lib/seo-config";

export const metadata = {
  title: ROUTE_SEO["/signin"].title,
  description: ROUTE_SEO["/signin"].description,
  robots: ROUTE_SEO["/signin"].robots,
  openGraph: {
    type: "website",
    url: `${SITE_URL}/signin`,
    siteName: "HabitFlow",
    title: ROUTE_SEO["/signin"].title,
    description: ROUTE_SEO["/signin"].description,
    images: [{ url: "/og-image.png" }],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: ROUTE_SEO["/signin"].title,
    description: ROUTE_SEO["/signin"].description,
    images: ["/og-image.png"],
  },
};

export default function SignIn() {
  return <LoginPage />;
}
