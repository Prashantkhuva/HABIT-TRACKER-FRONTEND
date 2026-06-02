"use client";
import dynamic from "next/dynamic";

const Create = dynamic(() => import("@/components/Habit/Create"), { ssr: false });

export default function CreateHabit() {
  return <Create />;
}
