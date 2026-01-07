import { useEffect, useState } from "react";

const prefersDark = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
};

const getSavedTheme = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("theme") as "dark" | "light" | null;
};

const resolveInitialTheme = (): "dark" | "light" => {
  const saved = getSavedTheme();
  if (saved === "dark" || saved === "light") {
    return saved;
  }
  return prefersDark() ? "dark" : "light";
};

export function useAutoTheme() {
  const [theme, setTheme] = useState<"dark" | "light">(resolveInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  useEffect(() => {
    if (typeof window === "undefined") return () => {};
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (event: MediaQueryListEvent) => {
      setTheme(event.matches ? "dark" : "light");
    };

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", handler);
      return () => media.removeEventListener("change", handler);
    }

    media.addListener(handler);
    return () => media.removeListener(handler);
  }, []);

  return theme;
}
