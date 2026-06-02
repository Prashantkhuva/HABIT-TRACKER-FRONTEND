"use client";

import LandNav from "@/components/LandNav";
import Footer from "@/components/Footer";

export default function PublicLayout({ children }) {
  return (
    <>
      <LandNav />
      {children}
      <Footer />
    </>
  );
}
