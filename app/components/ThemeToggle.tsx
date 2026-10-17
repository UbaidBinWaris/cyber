"use client";

import { Icon } from "./Icon";
import { useTheme, toggleTheme } from "@/lib/useProgress";

/**
 * Theme toggle. The initial theme is applied before paint by a blocking inline
 * script in the layout; here we read it via an external store and flip it.
 */
export function ThemeToggle() {
  const theme = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      title={`Switch to ${isDark ? "light" : "dark"} theme`}
    >
      <Icon name={isDark ? "sun" : "moon"} size={17} />
      <span>{isDark ? "Light" : "Dark"}</span>
    </button>
  );
}
