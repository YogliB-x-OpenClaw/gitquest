import { defineConfig } from "oxlint";

export default defineConfig({
  categories: {
    correctness: "error",
    suspicious: "warn",
    pedantic: "off",
  },
  plugins: ["import", "react"],
  rules: {
    "react/react-in-jsx-scope": "off",
    "import/no-unassigned-import": "off",
  },
});
