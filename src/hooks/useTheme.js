"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ACCENT_KEY,
  ACCENTS,
  applyAccent,
  readStoredAccent,
} from "@/lib/appearance";

export function useTheme() {
  const [accent, setAccentState] = useState("forest");

  useEffect(() => {
    const storedAccent = readStoredAccent();
    setAccentState(storedAccent);
    applyAccent(storedAccent);
  }, []);

  const setAccent = useCallback((id) => {
    setAccentState(id);
    try {
      localStorage.setItem(ACCENT_KEY, id);
    } catch {
      // storage unavailable (private mode)
    }
    applyAccent(id);
  }, []);

  return {
    accent,
    setAccent,
    accents: ACCENTS,
  };
}
