import { createRequire } from "module";

const require = createRequire(import.meta.url);

/** @type {import("eslint").Linter.Config[]} */
const nextConfig = require("eslint-config-next/core-web-vitals");

const eslintConfig = [
  ...nextConfig,
  {
    rules: {
      // Texte FR avec apostrophes ; le build Next ne dépend pas de cette règle
      "react/no-unescaped-entities": "off",
      // Patterns courants (hydratation, fermeture menu au changement de route)
      "react-hooks/set-state-in-effect": "off",
    },
  },
];

export default eslintConfig;
