/**
 * Единый конфиг Prettier. Применяется:
 *  - в редакторе (format on save),
 *  - в ESLint (правило prettier/prettier получает ЭТИ ЖЕ опции),
 *  - в lint-staged и CI (prettier --check).
 *
 * @type {import("prettier").Config}
 */
const config = {
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: false,
  quoteProps: "as-needed",
  jsxSingleQuote: false,
  trailingComma: "none",
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: "always",
  endOfLine: "lf"
};

export default config;
