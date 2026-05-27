# AGENTS.md — ИнвестНавигатор

Правила для AI-агентов и разработчиков, работающих с репозиторием `invest-navi`.

## О проекте

**ИнвестНавигатор** — образовательно-аналитическая платформа для частных инвесторов на российском рынке (Мосбиржа). Продукт **не даёт торговых рекомендаций**; он объясняет рынок простым языком и помогает пользователю осмыслять свои идеи через дневник и AI-разбор.

Главная дифференциация: **инвестиционный дневник** с фиксацией гипотез, рисков, критериев успеха/ошибки и ретроспективой.

> Полное описание бизнес-логики, разделов платформы и сценариев — в [PRODUCT.md](./docs/PRODUCT.md).

## Архитектурные решения (не менять без согласования)

| Область     | Решение                                                                                                     |
| ----------- | ----------------------------------------------------------------------------------------------------------- |
| Monorepo    | Turborepo + pnpm workspaces                                                                                 |
| Frontend    | Next.js App Router, **упрощённый FSD** (app/ → widgets → features → entities → shared)                      |
| Backend     | NestJS, **GraphQL code-first** (Apollo)                                                                     |
| ORM         | Drizzle + PostgreSQL                                                                                        |
| Auth        | Yandex ID + Google OAuth + email/password; bearer + refresh                                                 |
| i18n        | next-intl — `ru`, `en`; `localePrefix: 'never'` (URL без `/ru`/`/en`; cookie + `preferredLocale` в профиле) |
| Market data | MOEX ISS + Tinkoff Invest API                                                                               |
| AI          | Adapter pattern: Groq, Google Gemini, OpenRouter (`AI_PROVIDER` + API keys в env)                           |
| UI          | shadcn/ui + Tailwind v4, Inter, Phosphor Icons                                                              |
| Themes      | System default via `next-themes`; `:root` (light) + `.dark` (dark)                                          |
| Tables      | TanStack Table                                                                                              |
| Forms       | shadcn/ui `Field` + React Hook Form + Zod (`zodResolver`)                                                   |
| Deploy      | Vercel (web + api); PostgreSQL на отдельном хостинге                                                        |

## Структура репозитория

```txt
apps/api/       — NestJS GraphQL API
apps/web/       — Next.js; FSD в apps/web/src/
packages/api/   — Shared types (build before apps/api)
packages/ui/    — Shared UI components
packages/eslint-config/
packages/typescript-config/
```

## Язык и контент

- **Код:** английский (имена файлов, переменных, комментарии в коде — английский)
- **UI / копирайт / AI-ответы пользователю:** русский по умолчанию; английский через i18n
- **Документация в репо:** русский допустим в README/AGENTS; технические идентификаторы — английский

## Кодстайл

- TypeScript strict где включено в tsconfig
- ESLint flat config из `@repo/eslint-config`
- Prettier из `@repo/eslint-config/prettier-base`
- Импорты: `eslint-plugin-import-x` — порядок групп, без дубликатов, newline after imports
- Не использовать `eslint-plugin-only-warn` — ошибки должны быть errors
- Коммиты: осмысленные, Conventional Commits при возможности

## Frontend — FSD

### Слои (только вниз)

```txt
app/ (Next.js routes + page composition) → widgets → features → entities → shared
```

`app/` выполняет роль верхнего композиционного слоя (аналог FSD `pages`). Отдельный слой `views/pages` **не используется** — Next.js App Router уже объединяет routing, metadata, data fetching и композицию в `app/`.

### Правила

1. **Public API:** экспорт только через `index.ts` slice
2. **Сегменты:** `ui/`, `model/`, `api/`, `lib/`, `config/` — по необходимости
3. **Запрещено:** импорт из верхнего слоя; cross-import между slices одного слоя (entity → entity)
4. **`app/`:** routing, layout, providers, metadata, page composition из widgets
5. **Server Components по умолчанию;** `'use client'` только при интерактивности
6. Если page.tsx разрастается — вытаскивать в **widget**, а не в отдельный слой
7. Данные: TanStack Query + GraphQL codegen (когда появится)
   - Fetchers → `*/api/*-api.ts` (GraphQL `graphqlRequest`)
   - Query keys → `*/model/query-keys.ts` (`assetKeys.list(limit)`)
   - `queryOptions` / `mutationOptions` + hook → один файл `*/api/use-*.ts` (например `assetsQueryOptions` + `useAssetsQuery`)
   - Виджеты/features **не** содержат inline `queryFn` / сырых `queryKey`
   - Таблицы: TanStack Table **v8** (`useReactTable`, `getSortedRowModel`); generic UI → `shared/ui/data-table.tsx`; колонки → `widgets/*/model/*-columns.tsx`
8. Формы: react-hook-form + zod
9. **shadcn/ui primitives** — `apps/web/src/shared/ui/` (импорт `@/shared/ui/...`); не `src/components/`

### Формы (shadcn/ui + react-hook-form)

- Базовый стек: `react-hook-form` + `@hookform/resolvers/zod` + `zod`
- Разметка полей: `Field`, `FieldLabel`, `FieldDescription`, `FieldError`
- Для controlled компонентов использовать `Controller`
- Для простых input-like полей использовать spread `field` (`<Input {...field} />`, `<Textarea {...field} />`)
- Для Select/Switch/Radio/Checkbox использовать `field.value` + `field.onChange` (или `onValueChange`/`onCheckedChange`)
- Для ошибок обязательно:
  - `data-invalid={fieldState.invalid}` на `Field`
  - `aria-invalid={fieldState.invalid}` на control-компоненте (`Input`, `SelectTrigger`, `Checkbox`, и т.д.)
- Схема валидации всегда через Zod и `zodResolver(schema)` в `useForm`
- Режим валидации по умолчанию: `mode: 'onSubmit'`; `onChange`/`onBlur` только при явной UX-задаче
- Dynamic arrays: только через `useFieldArray`; key в map всегда `field.id`, не index
- DatePicker: композиция `Popover` + `Calendar`, отдельного `DatePicker`-root компонента нет
- `form.reset()` использовать для сброса к `defaultValues`

### Пример route

```tsx
// app/[locale]/market/page.tsx
import { MarketSummary } from '@/widgets/market-summary';
import { SectorList } from '@/widgets/sector-list';

export default function MarketPage() {
  return (
    <>
      <MarketSummary />
      <SectorList />
    </>
  );
}
```

## Backend — NestJS

- Модули по доменам: `auth`, `assets`, `market`, `diary`, `portfolio`, `ai`, …
- GraphQL: code-first resolvers + DTO/Input types
- Не утверждать причину движения цены как факт — формулировки «вероятно», «возможные факторы»
- AI: модуль `ai/` с `AiProvider` interface и реализациями **Groq**, **Gemini**, **OpenRouter**
- Выбор провайдера: `AI_PROVIDER` (`groq` | `gemini` | `openrouter`); ключи — `GROQ_API_KEY`, `GEMINI_API_KEY`, `OPENROUTER_API_KEY`
- **AI compliance pipeline** (обязательно для новых AI-эндпоинтов): `LLM → parse JSON → compliance gate → response | safe fallback`; для plain-text (`educationalAnswer`): `LLM → scanComplianceText → response | safe fallback`
  - Код: `apps/api/src/ai/lib/compliance/` (`scanComplianceText`, `apply*Compliance`)
  - При нарушении в сыром AI-тексте (buy/sell/hold, гарантии доходности, сравнение с вкладом без риска) — лог + **fallback**, не отдавать сырой ответ
  - Тесты: `pnpm --filter api test`
- Секреты только через env; не коммитить `.env`

## База данных (Drizzle)

- Миграции в version control; схема в `apps/api/src/database/schema/`
- После изменения схемы: `pnpm --filter api db:generate` — **не писать** `drizzle/*.sql` и `drizzle/meta/*` вручную
- Применение: `pnpm --filter api db:migrate`
- `noUncheckedIndexedAccess` учитывать при работе с массивами

## Дизайн-система

Полная концепция — в [DESIGN.md](./docs/DESIGN.md).

| Область    | Решение                                                         |
| ---------- | --------------------------------------------------------------- |
| Стиль      | Dark modern fintech, premium SaaS                               |
| Палитра    | Тёмная, hex-цвета через CSS custom properties                   |
| Темы       | System default (`next-themes`), light в `:root`, dark в `.dark` |
| Шрифт      | Inter (latin + cyrillic), `next/font/google`                    |
| Иконки     | Phosphor Icons (`@phosphor-icons/react`)                        |
| Компоненты | shadcn/ui, кастомизация через Tailwind v4                       |
| Числа      | `font-variant-numeric: tabular-nums` для цен и процентов        |

### Ключевые цвета

- Background: `#080B12`, Surface: `#0F172A`, Card: `#121A2B`
- Border: `#243044`, Border muted: `#1E293B`
- Text: `#F8FAFC` / `#CBD5E1` / `#94A3B8`
- Accent: `#38BDF8` (primary), `#818CF8` (secondary)
- Growth: `#22C55E`, Decline: `#EF4444`, Warning: `#F59E0B`

### Дизайн-правила

- Не перегружать интерфейс — больше воздуха, меньше плотности
- Positive/negative — всегда иконка или текст, не только цвет
- AI-блоки — мягкий градиентный border + disclaimer
- Семантика — базовый уровень (header/nav/main/aside/footer); внутри — shadcn/ui
- Адаптивность: mobile (1 col, bottom nav), tablet (2 col), desktop (sidebar + multi-col)

## Продуктовые ограничения (критично)

- **Никогда** не генерировать «покупай / продавай / держи» как рекомендацию
- Объяснять риски и вопросы, которые пользователь должен задать себе
- AI-ответы по активам — образовательные, с оговорками
- Для облигаций: не сравнивать с вкладом без оговорок о рисках

## Тестирование

> **Отложено:** Jest, `@repo/jest-config` и E2E (supertest) убраны из репозитория; подключим на отдельном этапе.

- Перед PR: `pnpm lint`, при изменении shared types — `pnpm --filter @repo/api build`

## Phase scope

Phase 1 ✅ — инфраструктура (monorepo, ESLint, Prettier, документация).
Phase 2 ✅ — Tailwind v4, shadcn/ui, Drizzle + PostgreSQL, FSD-скелет.
Phase 3 ✅ — Auth (email/password + JWT), GraphQL base.
Phase 4 ✅ — MOEX ISS + T-Invest API, entities Asset/Sector/Index, `packages/api` contracts, market cache.
Phase 5 ✅ — Web: маркет, auth и кабинет (каталог, watchlist, auth gate, shells, profile, next-intl, codegen, FSD `shared/ui`, миграции).
Phase 6 ✅ — инвестиционный дневник + AI (`diary` GraphQL, `/diary`, `diaryHypothesisFeedback`, ретроспектива).
Phase 7 ✅ — портфель (`/portfolio`, `portfolioSummary`) и облигационный помощник (`/bonds`, `bondInsight`).
Phase 8 ✅ — обучение (`/learn`, `/risks`, `/overview`), контекстный глоссарий, `knowledgeLevel` в hub/overview, MVP `/ai` (`educationalAnswer` + compliance).
Текущая фаза — **Phase 9**: OAuth (Yandex ID, Google). Еженедельный обзор рынка и cron — **Phase 10**.

## Полезные команды

```bash
pnpm install
pnpm --filter @repo/api build
pnpm dev
pnpm lint
pnpm format
pnpm --filter api test
```

## Ссылки

- [PRODUCT.md](./docs/PRODUCT.md) — полное описание бизнес-логики, разделов, сценариев
- [DESIGN.md](./docs/DESIGN.md) — дизайн-концепция, палитра, компоненты, адаптивность
- [README.md](./README.md)
- [.agents/rules/](./.agents/rules/)
