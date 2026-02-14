import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeCtx = createContext(null);

// Theme colors - light and dark themes
// eslint-disable-next-line react-refresh/only-export-components
export const themes = {
  light: {
    background: "#F6F6F2",
    text: "#0F172A",
    card: "#FFFFFF",
    accent: "#F2D34B",
    border: "rgba(15,23,42,.08)",
    blackBtn: "#0B0F19",
  },
  dark: {
    background: "#0b1220",
    text: "#e9eefb",
    card: "rgba(255,255,255,0.06)",
    accent: "#F2D34B",
    border: "rgba(255,255,255,0.10)",
    blackBtn: "#e9eefb",
  },
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // Check localStorage first, default to "light"
    return localStorage.getItem("theme") || "light";
  });

  // Keep localStorage and document theme synced
  useEffect(() => {
    localStorage.setItem("theme", theme);
    const next = themes[theme] || themes.light;
    document.documentElement.dataset.theme = theme;
    document.body.style.background = next.background;
    document.body.style.color = next.text;
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const value = useMemo(
    () => ({ theme, toggleTheme, isDark: theme === "dark" }),
    [theme],
  );

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider />");
  return ctx;
}
