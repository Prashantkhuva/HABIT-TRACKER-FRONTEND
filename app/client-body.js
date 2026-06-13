"use client";

import dynamic from "next/dynamic";
import { Analytics } from "@vercel/analytics/react";
import RouteLoadingBar from "@/components/RouteLoadingBar";

const DynamicCustomCursor = dynamic(
  () => import("@/components/CustomCursor"),
  { ssr: false },
);

export default function ClientBody({ children }) {
  return (
    <>
      <RouteLoadingBar />
      <DynamicCustomCursor />
      <Analytics />
      {children}
    </>
  );
}
