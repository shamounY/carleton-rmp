// eslint.config.js
import js from "@eslint/js";
import ts from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
  js.configs.recommended,
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsParser,
    },
    plugins: {
      "@typescript-eslint": ts,
    },
    rules: {
      "@/semi": ["error", "always"],
    },
  },
];
