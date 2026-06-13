import SignupPage from "@/views/SignupPage";
import { ROUTE_SEO, SITE_URL } from "@/lib/seo-config";

export const metadata = {
  title: ROUTE_SEO["/signup"].title,
  description: ROUTE_SEO["/signup"].description,
  robots: ROUTE_SEO["/signup"].robots,
  alternates: {
    canonical: `${SITE_URL}/signup`,
  },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/signup`,
    siteName: "HabitFlow",
    title: ROUTE_SEO["/signup"].title,
    description: ROUTE_SEO["/signup"].description,
    images: [{ url: "/og-image.png" }],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: ROUTE_SEO["/signup"].title,
    description: ROUTE_SEO["/signup"].description,
    images: ["/og-image.png"],
  },
};

export default function SignUp() {
  return <SignupPage />;
}
