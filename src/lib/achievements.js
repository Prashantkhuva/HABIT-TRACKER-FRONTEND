export const ACHIEVEMENTS = [
  { id: "first-habit", label: "First Ritual", desc: "Create your first habit", icon: "Sprout", color: "#4B6B63" },
  { id: "triple", label: "Hat Trick", desc: "Complete 3 habits in one day", icon: "Target", color: "#D4BB06" },
  { id: "perfect-week", label: "Perfect Week", desc: "Complete all habits for 7 days", icon: "Star", color: "#D4BB06" },
  { id: "streak-7", label: "Week Warrior", desc: "Reach a 7-day streak", icon: "Flame", color: "#E67E22" },
  { id: "streak-30", label: "Monthly Master", desc: "Reach a 30-day streak", icon: "Gem", color: "#8E44AD" },
  { id: "five-habits", label: "Habit Stacker", desc: "Create 5 active habits", icon: "BookOpen", color: "#2ECC71" },
  { id: "ten-tonight", label: "Double Digits", desc: "Complete 10 habits total", icon: "Award", color: "#4B6B63" },
  { id: "fifty-club", label: "Fifty Club", desc: "Complete 50 habits total", icon: "Crown", color: "#D4BB06" },
];

export function getAchievements(stats, streaks, totalCompleted) {
  return ACHIEVEMENTS.map((a) => ({
    ...a,
    unlocked: a.check
      ? a.check(stats || {}, streaks || [], totalCompleted || 0)
      : false,
  }));
}

// Add check functions separately so the data stays clean
ACHIEVEMENTS[0].check = (stats) => stats.totalHabits >= 1;
ACHIEVEMENTS[1].check = (stats) => stats.completedToday >= 3;
ACHIEVEMENTS[2].check = (stats) => stats.completionRate === 100;
ACHIEVEMENTS[3].check = (_stats, streaks) => streaks.some((s) => s >= 7);
ACHIEVEMENTS[4].check = (_stats, streaks) => streaks.some((s) => s >= 30);
ACHIEVEMENTS[5].check = (stats) => stats.totalHabits >= 5;
ACHIEVEMENTS[6].check = (_stats, _streaks, totalCompleted) => totalCompleted >= 10;
ACHIEVEMENTS[7].check = (_stats, _streaks, totalCompleted) => totalCompleted >= 50;
