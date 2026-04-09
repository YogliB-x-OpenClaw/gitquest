import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useStore } from "./store";
import "./styles/global.css";

export function App() {
  const colorTheme = useStore((s) => s.colorTheme);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");

    const apply = () => {
      const isDark = colorTheme === "dark" || (colorTheme === "system" && mq.matches);
      document.documentElement.setAttribute(
        "data-theme",
        isDark ? "gitquest-dark" : "gitquest-light",
      );
    };

    apply();

    if (colorTheme === "system") {
      mq.addEventListener("change", apply);
      return () => mq.removeEventListener("change", apply);
    }
  }, [colorTheme]);

  return <Outlet />;
}
