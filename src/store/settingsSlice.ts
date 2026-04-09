import { storage } from "@/lib/storage";
import type { ColorTheme, RateLimitStatus } from "@/types";

export interface SettingsSlice {
  githubToken: string;
  colorTheme: ColorTheme;
  rateLimit: RateLimitStatus;
  saveSettings: (partial: { githubToken?: string; colorTheme?: ColorTheme }) => void;
  setColorTheme: (theme: ColorTheme) => void;
  setRateLimit: (rl: RateLimitStatus) => void;
}

export function createSettingsSlice(
  set: (fn: (state: SettingsSlice) => Partial<SettingsSlice>) => void,
): SettingsSlice {
  const s = storage.getSettings();
  return {
    githubToken: s.githubToken || "",
    colorTheme: s.colorTheme || "system",
    rateLimit: { remaining: null, reset: null },
    saveSettings: (partial) => {
      storage.saveSettings(partial);
      set(() => ({ ...partial }));
    },
    setColorTheme: (theme) => {
      storage.saveSettings({ colorTheme: theme });
      set(() => ({ colorTheme: theme }));
    },
    setRateLimit: (rl) => set(() => ({ rateLimit: rl })),
  };
}
