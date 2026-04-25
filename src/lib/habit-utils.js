function cleanText(text = "") {
  if (!text) return "";
  return text
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function toPlainData(value) {
  if (value == null) return value;
  return JSON.parse(JSON.stringify(value));
}

// Habit streak format karo
function formatStreak(count = 0) {
  if (count === 0) return "No streak yet";
  if (count === 1) return "1 day streak 🔥";
  return `${count} day streak 🔥`;
}

// Date format karo
function formatDate(dateValue) {
  if (!dateValue) return null;
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

// Aaj ka date check karo
function isToday(dateValue) {
  if (!dateValue) return false;
  const date = new Date(dateValue);
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

// Habit completion percentage
function getCompletionRate(completed = 0, total = 0) {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

// Frequency label
function getFrequencyLabel(frequency = "") {
  const map = {
    daily: "Every Day",
    weekly: "Every Week",
  };
  return map[frequency.toLowerCase()] || frequency;
}

// Hex color se brightness check karo
function expandHex(hex) {
  // #000 → #000000, #fff → #ffffff
  if (hex.length === 3) {
    return hex
      .split("")
      .map((c) => c + c)
      .join("");
  }
  return hex;
}

function getTextColor(hexColor = "#FAFAF5") {
  const hex = expandHex(hexColor.replace("#", ""));
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 128 ? "#FAFAF5" : "#1A1A1A";
}

function getIconBg(hexColor = "#FAFAF5") {
  const hex = expandHex(hexColor.replace("#", ""));
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 128 ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)";
}

// Category label

export {
  cleanText,
  toPlainData,
  formatStreak,
  formatDate,
  isToday,
  getCompletionRate,
  getFrequencyLabel,
  getTextColor,
  getIconBg,
  expandHex
};
