export function getCalorieInfo(calories: number | null, isDark: boolean) {
  if (calories === null) return null;

  if (calories < 100) {
    return {
      backgroundColor: "rgba(16,185,129,0.1)",
      barColor: "#10b981",
      color: isDark ? "#34d399" : "#059669",
      label: "Low calorie",
    };
  }

  if (calories < 250) {
    return {
      backgroundColor: "rgba(245,158,11,0.1)",
      barColor: "#f59e0b",
      color: isDark ? "#fbbf24" : "#d97706",
      label: "Moderate calorie",
    };
  }

  return {
    backgroundColor: "rgba(244,63,94,0.1)",
    barColor: "#f43f5e",
    color: isDark ? "#fb7185" : "#e11d48",
    label: "High calorie",
  };
}
