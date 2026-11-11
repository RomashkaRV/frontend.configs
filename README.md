# @romashka_rv/frontend-config

Единые конфиги для фронтенда (Next.js 16, React 19, TypeScript 6):
ESLint 10, Stylelint 17, Prettier 3, Commitlint 21.

**Требования:** Node.js `>=22.22.1`.

## Установка

```bash
npm i -D @romashka_rv/frontend-config eslint prettier stylelint typescript
```

Все плагины (ESLint, Stylelint, commitlint) идут внутри пакета, ставить их отдельно не нужно —
у всех разработчиков версии одинаковые.

## Подключение

**eslint.config.js**

```js
export { default } from "@romashka_rv/frontend-config/eslint";
```

Свои алиасы для группировки импортов:

```js
import { createConfig } from "@romashka_rv/frontend-config/eslint";

export default createConfig({ aliases: ["components", "hooks", "types"] });
```

**prettier.config.js**

```js
export { default } from "@romashka_rv/frontend-config/prettier";
```

**stylelint.config.js**

```js
export default {
  extends: ["@romashka_rv/frontend-config/stylelint"]
};
```

**commitlint.config.cjs**

```js
module.exports = {
  extends: ["@romashka_rv/frontend-config/commitlint"]
};
```

**tsconfig.json** (алиасы `paths` задаются в проекте, `baseUrl` не используется)

```json
{
  "extends": "@romashka_rv/frontend-config/tsconfig",
  "compilerOptions": {
    "types": ["node"],
    "plugins": [{ "name": "next" }],
    "paths": { "components/*": ["./src/components/*"] }
  }
}
```

## Что гарантируется

- **Отступы и форматирование** — только Prettier (2 пробела, `"`, `;`, без trailing comma, LF).
  Те же опции получает ESLint (`prettier/prettier`), поэтому редактор, ESLint и CI не расходятся.
  Для SCSS отступы тоже проверяет Prettier (`prettier --check .`).
- **Порядок импортов:** `react`/`next` → пакеты → алиасы проекта → относительные → стили.
  Строки `import type` плагин не сортирует.
- **SCSS:** `stylelint-config-standard-scss` + порядок свойств по группам с пустой строкой между ними.
- **Коммиты:** `<type>: <description>`, типы `ci, docs, feature, fix, refactoring, revert, test`.

Рекомендуется добавить в проект `.editorconfig` (лежит в этом репозитории) и `.nvmrc`.

## Миграция с 3.x

- Node.js `>=22.22.1`, ESLint 10, Stylelint 17, TypeScript 6.
- Новые экспорты: `./prettier`, `./stylelint`, `./tsconfig`.
- В `package.json` проекта уберите `"prettier": { "extends": ... }` и `"stylelint": { "extends": ... }` —
  вместо них файлы `prettier.config.js` и `stylelint.config.js` (см. выше).
- Удалите из devDependencies отдельные плагины ESLint/Stylelint и `@next/eslint-plugin-next`.
- `next lint` удалён в Next 16: используйте `eslint .`.
- `eslint-plugin-react` и `eslint-plugin-import` заменены на `@eslint-react/eslint-plugin` и
  `eslint-plugin-import-x` (первые не работают на ESLint 10).
- `baseUrl` убран из tsconfig (deprecated в TS 6): используйте `paths` с путями от корня проекта.
