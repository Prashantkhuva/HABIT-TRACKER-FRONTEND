"use client";

import { useState, useEffect, useCallback } from "react";
import {
  THEME_KEY,
  ACCENT_KEY,
  ACCENTS,
  resolveTheme,
  applyTheme,
  applyAccent,
  readStoredTheme,
  readStoredAccent,
} from "@/lib/appearance";

export function useTheme() {
  const [theme, setThemeState] = useState("system");
  const [accent, setAccentState] = useState("forest");

  useEffect(() => {
    const storedTheme = readStoredTheme();
    const storedAccent = readStoredAccent();
    setThemeState(storedTheme);
    setAccentState(storedAccent);
    applyTheme(resolveTheme(storedTheme));
    applyAccent(storedAccent);
  }, []);

  // Follow OS changes while theme = system
  useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme(resolveTheme("system"));
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [theme]);

  const setTheme = useCallback((t) => {
    setThemeState(t);
    try {
      localStorage.setItem(THEME_KEY, t);
    } catch {
      // storage unavailable (private mode)
    }
    applyTheme(resolveTheme(t));
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
    theme,
    accent,
    setTheme,
    setAccent,
    isDark: resolveTheme(theme) === "dark",
    accents: ACCENTS,
  };
}
