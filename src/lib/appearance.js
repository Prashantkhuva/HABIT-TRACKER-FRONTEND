"use client";

export const ACCENT_KEY = "habitflow-accent";
export const ACCENT_STYLE_ID = "habitflow-accent-style";

export const ACCENTS = [
  { id: "forest", label: "Forest", mint: "#4b6b63", soft: "#eef4f2" },
  { id: "ocean", label: "Ocean", mint: "#2b6cb0", soft: "#e8f1fb" },
  { id: "plum", label: "Plum", mint: "#7c3aed", soft: "#f3ecfe" },
  { id: "ember", label: "Ember", mint: "#c2410c", soft: "#fdeee6" },
];

/** Injects :root accent vars. Light-only — no theme variants. */
export function applyAccent(id) {
  const accent = ACCENTS.find((a) => a.id === id) || ACCENTS[0];
  let style = document.getElementById(ACCENT_STYLE_ID);
  if (!style) {
    style = document.createElement("style");
    style.id = ACCENT_STYLE_ID;
    document.head.appendChild(style);
  }
  style.textContent = `
:root { --color-accent-mint: ${accent.mint}; --color-accent-soft: ${accent.soft}; }`;
}

export function readStoredAccent() {
  try {
    return localStorage.getItem(ACCENT_KEY) || ACCENTS[0].id;
  } catch {
    return ACCENTS[0].id;
  }
}
