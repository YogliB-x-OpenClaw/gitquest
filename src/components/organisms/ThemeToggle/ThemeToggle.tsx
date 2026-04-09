import { useStore } from "@/store";
import type { ColorTheme } from "@/types";

const OPTIONS: { value: ColorTheme; icon: string; label: string }[] = [
  { value: "light", icon: "☀", label: "Light" },
  { value: "dark", icon: "☾", label: "Dark" },
  { value: "system", icon: "⊙", label: "System" },
];

export function ThemeToggle() {
  const colorTheme = useStore((s) => s.colorTheme);
  const setColorTheme = useStore((s) => s.setColorTheme);

  return (
    <div className="join" role="group" aria-label="Color theme">
      {OPTIONS.map((o) => (
        <button
          key={o.value}
          className={`join-item btn btn-sm ${colorTheme === o.value ? "btn-primary" : "btn-ghost"}`}
          onClick={() => setColorTheme(o.value)}
          aria-label={o.label}
          title={o.label}
        >
          {o.icon}
        </button>
      ))}
    </div>
  );
}
