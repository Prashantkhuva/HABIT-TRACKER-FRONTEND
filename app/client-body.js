"use client";

import dynamic from "next/dynamic";
import { Analytics } from "@vercel/analytics/react";

const DynamicCustomCursor = dynamic(
  () => import("@/components/CustomCursor"),
  { ssr: false },
);

export default function ClientBody({ children }) {
  return (
    <>
      <DynamicCustomCursor />
      <Analytics />
      {children}
    </>
  );
}
