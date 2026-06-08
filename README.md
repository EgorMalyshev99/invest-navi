# ИнвестНавигатор (invest-navi)

AI-платформа для частных инвесторов на российском рынке. Помогает понимать акции, облигации, фонды и рыночные события простым языком, вести инвестиционный дневник и принимать более осознанные решения **без прямых торговых рекомендаций** («покупай» / «продавай»).

## Ценность продукта

Платформа отвечает на пять вопросов по каждому активу и идее:

1. **Что это за инструмент?** — человеческое объяснение типа актива
2. **Что с ним происходит сейчас?** — резюме динамики, а не только график
3. **Почему это могло произойти?** — гипотезы, не утверждения как факт
4. **Какие риски есть?** — рыночный, секторный, ставка, валюта и др.
5. **Подходит ли это под мою идею?** — разбор гипотезы пользователя через дневник и AI

**Ключевая фича:** инвестиционный дневник с AI-разбором гипотез и ретроспективой через 30/60/90 дней.

## Стек

| Слой         | Технологии                                                                                                      |
| ------------ | --------------------------------------------------------------------------------------------------------------- |
| Monorepo     | Turborepo, pnpm                                                                                                 |
| Landing      | Next.js 16 (App Router), React 19, next-intl, next-themes, shadcn/ui из `@repo/ui`, Tailwind v4                 |
| Dashboard    | Vite, React 19, TanStack Router/Query/Table, react-i18next + ICU, Zod, React Hook Form, shadcn/ui из `@repo/ui` |
| Backend      | NestJS 11, GraphQL (code-first, Apollo), Drizzle ORM, PostgreSQL                                                |
| Auth         | OAuth (Yandex ID, Google) + email/password, bearer + refresh tokens                                             |
| Данные рынка | MOEX ISS API, Tinkoff Invest API                                                                                |
| AI           | Adapter pattern: Groq, Google Gemini, OpenRouter                                                                |
| Infra        | Vercel (landing + dashboard + api), PostgreSQL на отдельном хостинге                                            |

## Структура монорепозитория

```txt
invest-navi/
├── apps/
│   ├── api/          # NestJS — GraphQL API, auth, рыночные данные, AI
│   ├── landing/      # Next.js — маркетинг, публичные данные
│   └── dashboard/    # Vite + React — кабинет инвестора (FSD в src/)
├── packages/
│   ├── api/          # Общие типы/DTO между api и frontend apps
│   ├── shared/       # Общие утилиты (format, url, locales)
│   ├── ui/           # shadcn/ui + Tailwind v4, общие компоненты
│   ├── eslint-config/
│   └── typescript-config/
└── .github/workflows/   # CI (по мере необходимости)
```

### Frontend (FSD)

`apps/dashboard` использует **упрощённый FSD** (4 слоя + `src/routes`):

- `src/routes/` — маршрутизация TanStack Router и page composition из widgets
- `src/widgets/` — крупные блоки UI
- `src/features/` — действия пользователя
- `src/entities/` — бизнес-сущности (asset, diary-entry, …)
- `src/shared/` — API client, auth, i18n, утилиты; UI primitives импортируются из `@repo/ui`

Зависимости только **вниз** по слоям. Public API каждого slice — через `index.ts`.

### i18n

Сообщения хранятся **отдельно в каждом frontend-app**:

- Landing: `apps/landing/src/messages/{ru,en}.json` (next-intl)
- Dashboard: `apps/dashboard/src/messages/{ru,en}.json` (react-i18next + ICU)

При изменении UI-копирайта синхронизируйте `ru` и `en` внутри приложения. Cross-app sync — вручную (общего i18n-пакета нет).

## Требования

- Node.js >= 22
- pnpm 11+
- PostgreSQL (managed instance или локальный сервер) — `DATABASE_URL` в `.env`

## Quick start

```bash
# Скопировать переменные окружения
cp .env.example .env
# Указать DATABASE_URL и секреты JWT в .env

# Установка зависимостей
pnpm install

# Сборка shared-пакетов (нужна перед api)
pnpm --filter @repo/api build

# Миграции БД (при первом запуске)
pnpm --filter api db:migrate

# Разработка (API :3000, Landing :3001, Dashboard :3003)
pnpm dev
```

Откройте:

- Landing: http://localhost:3001
- Dashboard: http://localhost:3003
- API: http://localhost:3000

Локальная разработка — только `pnpm dev` (без Docker). База подключается по `DATABASE_URL` из `.env`.

### Отдельные приложения

```bash
pnpm --filter api dev
pnpm --filter landing dev
pnpm --filter dashboard dev
```

### Качество кода

```bash
pnpm lint
pnpm format
pnpm --filter api schema:generate # после изменения GraphQL resolvers
pnpm --filter dashboard codegen   # после изменения schema.gql или *.graphql
```

## Переменные окружения

Создайте `.env.local` в корне и в приложениях по мере появления интеграций (Phase 2+).

### Матрица по приложениям

| Переменная                                                                       | App       | Назначение                           |
| -------------------------------------------------------------------------------- | --------- | ------------------------------------ |
| `LANDING_URL`, `DASHBOARD_URL`                                                   | api       | CORS и OAuth redirect allowlist      |
| `DATABASE_URL`, `JWT_*`, `AI_*`, `YANDEX_*`, `GOOGLE_*` (secrets)                | api       | Серверные секреты и интеграции       |
| `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_DASHBOARD_URL`, `NEXT_PUBLIC_API_URL`        | landing   | Публичные origins для Next.js        |
| `VITE_APP_URL`, `VITE_API_URL`, `VITE_YANDEX_CLIENT_ID`, `VITE_GOOGLE_CLIENT_ID` | dashboard | Публичные origins и OAuth client IDs |

### Справочник

| Переменная                              | Описание                                               |
| --------------------------------------- | ------------------------------------------------------ |
| `DATABASE_URL`                          | PostgreSQL (Drizzle)                                   |
| `LANDING_URL` / `DASHBOARD_URL`         | Origins landing/dashboard для API CORS и OAuth         |
| `NEXT_PUBLIC_APP_URL`                   | Origin landing                                         |
| `NEXT_PUBLIC_DASHBOARD_URL`             | Origin dashboard для CTA на лендинге                   |
| `VITE_APP_URL` / `VITE_API_URL`         | Origins dashboard и API для Vite                       |
| `JWT_SECRET` / `JWT_REFRESH_SECRET`     | Auth tokens                                            |
| `YANDEX_CLIENT_ID` / `GOOGLE_CLIENT_ID` | OAuth                                                  |
| `MOEX_*` / `TINKOFF_*`                  | Рыночные данные                                        |
| `AI_PROVIDER`                           | Активный LLM: `groq`, `gemini`, `openrouter`           |
| `GROQ_API_KEY`                          | [Groq](https://console.groq.com/)                      |
| `GEMINI_API_KEY`                        | [Google AI Studio](https://aistudio.google.com/apikey) |
| `OPENROUTER_API_KEY`                    | [OpenRouter](https://openrouter.ai/keys)               |

## Roadmap

### Phase 1 ✅ — Инфраструктура

- Monorepo: Turborepo + pnpm workspaces
- Базовые shared-пакеты (`packages/*`)
- Линтинг/форматирование: ESLint + Prettier
- Стартовая документация (`README.md`, `AGENTS.md`, правила Cursor)

### Phase 2 ✅ — UI и Data Foundation

- Tailwind v4 + shadcn/ui setup
- Дизайн-токены и типографика (Inter, dark palette)
- Drizzle ORM, базовая схема PostgreSQL (`DATABASE_URL` из env)

### Phase 3 ✅ — Auth и GraphQL Base

- GraphQL code-first на NestJS (Apollo)
- Auth flow: `register`, `login`, `refreshTokens`, `me`
- JWT access/refresh tokens

### Phase 4 ✅ — Рыночные данные и доменные сущности

- Интеграция MOEX ISS (акции TQBR, индексы IMOEX/RGBI, сектора)
- Интеграция T-Invest API (обогащение акций: FIGI, валюта, сектор, див. доходность)
- GraphQL: `assets`, `asset(symbol)`, `indices`, `sectors`, `marketProviders`
- In-memory кэш (`MARKET_CACHE_TTL_SECONDS`)
- Shared-контракты в `packages/api` (`AssetSnapshot`, enums)

### Phase 5 ✅ — Web: маркет, auth и кабинет

- Каталог `/market`, карточка `/market/[symbol]`, watchlist `/watchlist`; GraphQL codegen
- Auth gate: Landing `/`, `/login`, `/register` (2 шага), middleware + JWT cookie; PublicShell (header) / DashboardShell (sidebar)
- Профиль `/profile`: `knowledgeLevel`, `preferredLocale`; next-intl `ru`/`en`, `localePrefix: 'never'`
- FSD `shared/ui`, миграции Drizzle (`pnpm --filter api db:migrate`)

### Phase 6 ✅ — Инвестиционный дневник + AI

- Модуль `ai/` с adapter pattern и провайдерами Groq, Gemini, OpenRouter
- **Compliance gate** на API: проверка AI-ответов (без buy/sell/hold, без гарантий, оговорки при сравнении с вкладом) → safe fallback
- Единые дисклеймеры в UI (`compliance.*` в next-intl, компонент `AiDisclaimer`)
- `assetInsight` на карточке актива; `diaryHypothesisFeedback` для черновика гипотезы
- GraphQL `diary/` — CRUD записей, снимок цены/индекса, `reviewAt` по горизонту
- Web `/diary` — форма гипотезы, AI-разбор, ретроспектива, фильтры статусов
- Связка с `/market/[symbol]` → «Гипотеза в дневнике»

### Phase 7 ✅ — Портфель и облигационный помощник

- Портфель: ручной ввод позиций, `/portfolio`, GraphQL CRUD + `portfolioSummary` (структура, концентрация, образовательные risk hints)
- Облигации: MOEX ISS, `/bonds` и `/bonds/[symbol]`, `bondInsight` (AI + шаблон), вводный блок без сравнения с вкладом без оговорок

### Phase 8 ✅ — Обучающий слой и риск-навигация

- Раздел «Обучение» (`/learn`, глоссарий) — 8 статей, перекрёстные ссылки в разделы приложения
- «Картина рынка» (`/overview`) — entrypoint, блок «путь новичка», карточка для `knowledgeLevel: beginner`
- Раздел рисков (`/risks`) с примерами и ссылками на статьи
- Контекстный глоссарий (`GlossaryTerm`) на market, portfolio, asset/bond detail, diary, bonds intro
- Персонализация hub обучения по `knowledgeLevel` в профиле
- MVP AI Q&A (`/ai`, GraphQL `educationalAnswer`) — compliance pipeline, disclaimer

### Phase 9 — OAuth (после получения токенов)

- Yandex ID и Google OAuth
- Связывание OAuth-аккаунтов с существующим пользователем
- Полировка UX входа и регистрации
- Разделение frontend на `apps/landing` (Next.js) и `apps/dashboard` (Vite + TanStack Router)
- shadcn/ui и дизайн-токены вынесены в `@repo/ui`

### Phase 10 — Лендинг, обзор рынка и тесты

- Обновить контент лендинга (`/`) с учётом реализованного функционала: актуальные разделы, сценарии, преимущества и CTA
- Еженедельный AI-обзор рынка (полуавтоматический кэш; cron — по необходимости позже)

#### Тесты (минимальный стек)

| Слой             | Инструмент                                                         | Где                                                         |
| ---------------- | ------------------------------------------------------------------ | ----------------------------------------------------------- |
| Unit / component | **Vitest** (+ `@testing-library/react` для dashboard и `@repo/ui`) | `packages/api`, `apps/api`, `apps/dashboard`, `packages/ui` |
| E2E              | **Playwright**                                                     | `e2e/` (landing + dashboard, happy-path сценарии)           |

Общий конфиг — `@repo/vitest-config` (по аналогии с `@repo/eslint-config`). Без Jest и supertest.

**План внедрения (без перегруза):**

1. `@repo/vitest-config` + `turbo run test` в CI
2. Vitest: compliance AI (`apps/api/src/ai/lib/compliance/`) и zod/валидации в `packages/api`
3. Vitest + RTL: 1–2 формы или виджета в dashboard (smoke)
4. Playwright: auth + один сквозной сценарий (например, дневник)
5. Дальше — только по мере изменений в критичных местах; landing — в основном E2E, не unit

## Документация

- [PRODUCT.md](./docs/PRODUCT.md) — бизнес-логика, целевая аудитория, разделы платформы, сценарии
- [AGENTS.md](./AGENTS.md) — правила для AI-агентов и конвенции разработки
- [.agents/rules/](./.agents/rules/) — правила Cursor IDE (frontend / backend)
