/// <reference types="vitest" />
import { defineConfig } from "vite-plus";
import react from "@vitejs/plugin-react";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import { resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  base: "/gitquest/",
  plugins: [vanillaExtractPlugin(), react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  test: {
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/**/*.css.ts", "src/types/**", "src/main.tsx"],
      thresholds: {
        perFile: true,
        statements: 80,
        lines: 80,
        functions: 80,
        branches: 80,
      },
    },
  },
  fmt: {
    ignorePatterns: ["CLAUDE.md"],
  },
  staged: {
    "*.{ts,tsx,js,jsx}": "vp check --fix",
  },
});
