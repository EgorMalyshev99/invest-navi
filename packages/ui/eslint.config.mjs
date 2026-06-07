import { config } from "@repo/eslint-config/react-internal";

/** @type {import("eslint").Linter.Config} */
export default [
  ...config,
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "@eslint-react/no-use-context": "off",
      "@eslint-react/no-context-provider": "off",
      "@eslint-react/no-array-index-key": "off",
      "@eslint-react/set-state-in-effect": "off",
      "react-hooks/set-state-in-effect": "off",
    },
  },
];
