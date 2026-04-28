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

export const getWeeklyCount = async (habitId) => {
  try {
    const res = await getHabitLogs(habitId, 1, 7);
    const logs = res.data.data.logs;
    return logs.length;
  } catch (err) {
    console.error(err);
    return 0;
  }
};

function isDarkColor(hexColor) {
  const hex = hexColor.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 128;
}

function getButtonColors(habitColor) {
  const textColor = getTextColor(habitColor);
  const isDark = textColor === "#FAFAF5";

  return {
    plusBg: isDark ? "#FAFAF5" : "#1A1A1A",
    plusIcon: isDark ? "#1A1A1A" : "#FAFAF5",

    checkBg: isDark ? "#FAFAF5" : "#1A1A1A",
    checkIcon: isDark ? "#1A1A1A" : "#FAFAF5",
  };
}

function getBestMonth(logs = []) {
  if (!logs.length) {
    return {
      bestmonth: "—",
      percentage: 0,
    };
  }

  const monthMap = {};

  logs.forEach((log) => {
    if (!log?.date) return;

    const date = new Date(log.date);
    if (isNaN(date)) return;

    const month = date.toLocaleString("en-US", { month: "long" });

    if (!monthMap[month]) {
      monthMap[month] = { completed: 0, total: 0 };
    }

    monthMap[month].total += 1;

    if (log.completed) {
      monthMap[month].completed += 1;
    }
  });

  let bestMonth = null;
  let bestRate = 0;

  // 🔥 Dynamic threshold (smart handling small data)
  const minRequired = Math.min(5, logs.length);

  for (const month in monthMap) {
    const { completed, total } = monthMap[month];

    if (total < minRequired) continue;

    const rate = (completed / total) * 100;

    if (rate > bestRate) {
      bestRate = rate;
      bestMonth = month;
    }
  }

  // 🔥 Fallback (agar sab months skip ho gaye)
  if (!bestMonth) {
    for (const month in monthMap) {
      const { completed, total } = monthMap[month];
      const rate = (completed / total) * 100;

      if (rate > bestRate) {
        bestRate = rate;
        bestMonth = month;
      }
    }
  }

  return {
    bestmonth: bestMonth || "—",
    percentage: Math.round(bestRate),
  };
}

function getTimeInsights(logs = []) {
  let morning = 0;
  let afternoon = 0;
  let evening = 0;

  logs.forEach((log) => {
    if (!log.completed) return;

    const hour = new Date(log.createdAt).getHours();

    if (hour < 12) morning++;
    else if (hour < 17) afternoon++;
    else evening++;
  });

  const max = Math.max(morning, afternoon, evening);

  if (max === 0) {
    return {
      title: "no pattern detected yet.",
      description: "complete more habits to unlock insights.",
      stats: { morning, afternoon, evening },
    };
  }

  // 🔥 tie case
  const isTie =
    (morning === evening && morning === max) ||
    (morning === afternoon && morning === max) ||
    (afternoon === evening && afternoon === max);

  if (isTie) {
    return {
      title: "your consistency is balanced.",
      description:
        "you complete habits evenly throughout the day. keep building this rhythm.",
      stats: { morning, afternoon, evening },
    };
  }

  if (max === morning) {
    return {
      title: "you're most consistent in the morning.",
      description:
        "your habit completion peaks before 12pm. anchor key rituals early.",
      stats: { morning, afternoon, evening },
    };
  }

  if (max === afternoon) {
    return {
      title: "your afternoons are strongest.",
      description: "you perform best mid-day.",
      stats: { morning, afternoon, evening },
    };
  }

  return {
    title: "your evenings are most productive.",
    description: "you complete most habits later in the day.",
    stats: { morning, afternoon, evening },
  };
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
  expandHex,
  isDarkColor,
  getButtonColors,
  getBestMonth,
  getTimeInsights,
};
