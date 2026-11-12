import eslintReact from "@eslint-react/eslint-plugin";
import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import stylistic from "@stylistic/eslint-plugin";
import { createTypeScriptImportResolver } from "eslint-import-resolver-typescript";
import importHelpers from "eslint-plugin-import-helpers";
import { flatConfigs as importX } from "eslint-plugin-import-x";
import prettierRecommended from "eslint-plugin-prettier/recommended";
import unusedImports from "eslint-plugin-unused-imports";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import { configs as tsConfigs } from "typescript-eslint";

import prettierOptions from "./prettier.config.js";

/**
 * Алиасы проекта (папки внутри src, на которые настроены paths в tsconfig).
 * Порядок здесь = порядок групп импортов в файле (сверху вниз).
 * Каждый алиас матчится в трёх видах: `name`, `@name` и `./name`.
 */
export const DEFAULT_ALIASES = [
  "layouts",
  "pages",
  "widgets",
  "components",
  "providers",
  "store",
  "api",
  "hooks",
  "libs",
  "functions",
  "utils",
  "assets",
  "constants",
  "types"
];

const SOURCE_FILES = ["**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}"];

const aliasGroup = (name) => [
  `/^${name}(\\/|$)/`,
  `/^@${name}(\\/|$)/`,
  `/^\\.\\/${name}(\\/|$)/`
];

/**
 * @param {object} [options]
 * @param {string[]} [options.aliases] алиасы для группировки импортов
 * @param {string[]} [options.ignores] дополнительные глобальные игноры
 */
export const createConfig = ({
  aliases = DEFAULT_ALIASES,
  ignores = []
} = {}) =>
  defineConfig([
    globalIgnores([
      "**/node_modules/**",
      "**/.next/**",
      "**/out/**",
      "**/dist/**",
      "**/build/**",
      "**/coverage/**",
      "**/next-env.d.ts",
      ...ignores
    ]),

    {
      files: SOURCE_FILES,
      extends: [
        js.configs.recommended,
        tsConfigs.recommended,
        importX.recommended,
        importX.typescript,
        eslintReact.configs["recommended-typescript"],
        // eslint-disable-next-line import-x/no-named-as-default-member -- CJS-пакет, именованного экспорта нет
        nextPlugin.configs["core-web-vitals"],
        // prettier всегда после остальных: отключает конфликтующие правила
        // форматирования и включает prettier/prettier
        prettierRecommended
      ],
      languageOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        globals: {
          ...globals.browser,
          ...globals.node
        }
      },
      plugins: {
        "import-helpers": importHelpers,
        "unused-imports": unusedImports,
        "@stylistic": stylistic
      },
      settings: {
        "import-x/resolver-next": [
          createTypeScriptImportResolver({ alwaysTryTypes: true })
        ]
      },
      rules: {
        // --- форматирование: единственный источник — prettier.config.js ---
        "prettier/prettier": [
          "error",
          prettierOptions,
          { usePrettierrc: false }
        ],
        "@stylistic/jsx-newline": "error",

        // --- typescript ---
        "@typescript-eslint/ban-ts-comment": "warn",
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/consistent-type-imports": "error",

        // --- неиспользуемый код ---
        "@typescript-eslint/no-unused-vars": "off",
        "unused-imports/no-unused-imports": "error",
        "unused-imports/no-unused-vars": [
          "error",
          {
            vars: "all",
            varsIgnorePattern: "^_",
            args: "after-used",
            argsIgnorePattern: "^_",
            caughtErrorsIgnorePattern: "^_"
          }
        ],

        // --- next ---
        // правило только для Pages Router; в App Router бессмысленно
        "@next/next/no-html-link-for-pages": "off",

        // --- react ---
        "@eslint-react/rules-of-hooks": "error",
        "@eslint-react/exhaustive-deps": "off",
        // правила именования — вопрос вкуса, не навязываем
        "@eslint-react/naming-convention-context-name": "off",
        "@eslint-react/naming-convention-id-name": "off",
        "@eslint-react/naming-convention-ref-name": "off",

        // --- общее ---
        eqeqeq: ["error", "always", { null: "ignore" }],
        "no-extra-boolean-cast": "off",
        "no-case-declarations": "off",

        // --- импорты ---
        "import-x/no-duplicates": "error",
        "import-x/newline-after-import": "error",
        "import-x/no-cycle": ["error", { maxDepth: 1 }],
        "import-helpers/order-imports": [
          "error",
          {
            newlinesBetween: "always",
            groups: [
              // 1. react / next
              ["/^react(-dom)?(\\/|$)/", "/^next(\\/|$)/"],
              // 2. остальные пакеты из node_modules
              "module",
              // 3. алиасы проекта (по одной группе на алиас)
              ...aliases.map(aliasGroup),
              // 4. относительные импорты
              ["parent", "sibling", "index"],
              // 5. стили — всегда в самом низу
              "/\\.(s?css|sass)$/"
            ],
            alphabetize: { order: "asc", ignoreCase: true }
          }
        ]
      }
    }
  ]);

export default createConfig();
