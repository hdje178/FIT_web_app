import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import pluginPrettier from "eslint-plugin-prettier";
import tseslint from "typescript-eslint";
export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
  {
    plugins: { prettier: pluginPrettier },
    rules: {
      "prettier/prettier": "error",
    },
  },
];
