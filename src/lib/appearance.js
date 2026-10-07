"use client";

export const THEME_KEY = "habitflow-theme";
export const ACCENT_KEY = "habitflow-accent";
export const ACCENT_STYLE_ID = "habitflow-accent-style";

export const ACCENTS = [
  { id: "forest", label: "Forest", mint: "#4b6b63", soft: "#eef4f2" },
  { id: "ocean", label: "Ocean", mint: "#2b6cb0", soft: "#e8f1fb" },
  { id: "plum", label: "Plum", mint: "#7c3aed", soft: "#f3ecfe" },
  { id: "ember", label: "Ember", mint: "#c2410c", soft: "#fdeee6" },
];

export function resolveTheme(stored) {
  if (stored === "dark" || stored === "light") return stored;
  if (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  )
    return "dark";
  return "light";
}

export function applyTheme(theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

/** Injects :root + .dark accent vars — dark mode lifts mint, dims soft. */
export function applyAccent(id) {
  const accent = ACCENTS.find((a) => a.id === id) || ACCENTS[0];
  let style = document.getElementById(ACCENT_STYLE_ID);
  if (!style) {
    style = document.createElement("style");
    style.id = ACCENT_STYLE_ID;
    document.head.appendChild(style);
  }
  style.textContent = `
:root { --color-accent-mint: ${accent.mint}; --color-accent-soft: ${accent.soft}; }
.dark {
  --color-accent-mint: color-mix(in srgb, ${accent.mint} 72%, #ffffff);
  --color-accent-soft: color-mix(in srgb, ${accent.mint} 24%, #141218);
}`;
}

export function readStoredTheme() {
  try {
    return localStorage.getItem(THEME_KEY) || "system";
  } catch {
    return "system";
  }
}

export function readStoredAccent() {
  try {
    return localStorage.getItem(ACCENT_KEY) || ACCENTS[0].id;
  } catch {
    return ACCENTS[0].id;
  }
}
