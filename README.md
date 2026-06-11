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

- Landing: [http://localhost:3001](http://localhost:3001)
- Dashboard: [http://localhost:3003](http://localhost:3003)
- API: [http://localhost:3000](http://localhost:3000)

Локальная разработка — только `pnpm dev` (без Docker). База подключается по `DATABASE_URL` из `.env`.

### Отдельные приложения

```bash
pnpm --filter api dev
pnpm --filter landing dev
pnpm --filter dashboard dev
```

### Качество кода

```bash
pnpm test
pnpm test:e2e
pnpm lint
pnpm format
pnpm --filter api schema:generate # после изменения GraphQL resolvers
pnpm --filter dashboard codegen   # после изменения schema.gql или *.graphql
pnpm --filter api openapi:generate # после изменения REST-контроллеров
```

## Переменные окружения

Создайте `.env.local` в корне и в приложениях по мере появления интеграций (Phase 2+).

### Матрица по приложениям

| Переменная                                                                                           | App       | Назначение                           |
| ---------------------------------------------------------------------------------------------------- | --------- | ------------------------------------ |
| `LANDING_URL`, `DASHBOARD_URL`                                                                       | api       | CORS и OAuth redirect allowlist      |
| `DATABASE_URL`, `JWT_*`, `AI_*`, `YANDEX_*`, `GOOGLE_*` (secrets)                                    | api       | Серверные секреты и интеграции       |
| `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_DASHBOARD_URL`, `NEXT_PUBLIC_API_URL`                            | landing   | Публичные origins для Next.js        |
| `VITE_APP_URL`, `VITE_API_URL`, `VITE_LANDING_URL`, `VITE_YANDEX_CLIENT_ID`, `VITE_GOOGLE_CLIENT_ID` | dashboard | Публичные origins и OAuth client IDs |

### Справочник

| Переменная                                           | Описание                                               |
| ---------------------------------------------------- | ------------------------------------------------------ |
| `DATABASE_URL`                                       | PostgreSQL (Drizzle)                                   |
| `LANDING_URL` / `DASHBOARD_URL`                      | Origins landing/dashboard для API CORS и OAuth         |
| `NEXT_PUBLIC_APP_URL`                                | Origin landing                                         |
| `NEXT_PUBLIC_DASHBOARD_URL`                          | Origin dashboard для CTA на лендинге                   |
| `VITE_APP_URL` / `VITE_API_URL` / `VITE_LANDING_URL` | Origins dashboard, API и landing для Vite              |
| `JWT_SECRET` / `JWT_REFRESH_SECRET`                  | Auth tokens                                            |
| `YANDEX_CLIENT_ID` / `GOOGLE_CLIENT_ID`              | OAuth                                                  |
| `MOEX_*` / `TINKOFF_*`                               | Рыночные данные                                        |
| `AI_PROVIDER`                                        | Активный LLM: `groq`, `gemini`, `openrouter`           |
| `GROQ_API_KEY`                                       | [Groq](https://console.groq.com/)                      |
| `GEMINI_API_KEY`                                     | [Google AI Studio](https://aistudio.google.com/apikey) |
| `OPENROUTER_API_KEY`                                 | [OpenRouter](https://openrouter.ai/keys)               |

## Статус проекта

MVP **Phase 1–10 завершён**: landing, dashboard, API, дневник, портфель, облигации, обучение, OAuth, weekly review, Vitest + Playwright. Продукт в стадии **post-MVP** — фокус на стабилизации деплоя и закрытии пробелов из [PRODUCT.md](./docs/PRODUCT.md) (watchlist на сервере, ключевая ставка, поиск в каталоге).

## Завершённые этапы (Phase 1–10)

| Phase | Итог                                                             |
| ----- | ---------------------------------------------------------------- |
| 1     | Monorepo, shared-пакеты, ESLint/Prettier, документация           |
| 2     | Tailwind v4, shadcn/ui, Drizzle + PostgreSQL                     |
| 3     | GraphQL code-first, JWT auth (register/login/refresh/me)         |
| 4     | MOEX ISS + T-Invest, market cache, `packages/api` contracts      |
| 5     | Каталог, watchlist (local), auth gate, profile, FSD, codegen     |
| 6     | Инвестиционный дневник + AI compliance pipeline                  |
| 7     | Портфель (ручной ввод) + облигационный помощник                  |
| 8     | Обучение, риски, overview, глоссарий, MVP `/ai`                  |
| 9     | OAuth (Yandex/Google), split landing/dashboard, `@repo/ui`       |
| 10    | Контент лендинга, weekly review, Vitest/Playwright, OpenAPI REST |

## Roadmap (Phase 11+)

### Phase 11 — Стабилизация продакшена (P0)

- Fix dashboard SPA 404 на Vercel (SPA rewrite + `outputDirectory`)
- Документация деплоя (см. [Деплой](#деплой))
- E2E: direct URL + reload для dashboard paths
- Дозакрыть тесты: RTL smoke (1 форма), `applyWeeklyReviewCompliance` unit

### Phase 12 — Watchlist (P1)

- Серверная watchlist (Drizzle + GraphQL CRUD)
- Миграция localStorage → server при первом логине
- AI `watchlistInsight` (compliance pipeline) вместо hardcoded правил

### Phase 13 — Картина рынка и каталог (P1)

- Блок ключевой ставки (CBR API или curated static)
- `topMovers` (gainers/losers), search/filter в каталоге
- Multi-period price changes на карточке актива

### Phase 14 — Дневник и портфель (P2)

- `deleteDiaryEntry`, уточнение retrospective milestones
- `portfolioNarrative` (LLM + compliance)
- Sector comparison на карточке актива

### Phase 15 — Рост и удержание (P2–P3)

- Weekly review cron, email/push для retrospective
- Password reset, SEO-страницы активов на landing
- ETF/funds в каталоге, Sentry, custom domains

**Вне scope:** брокерская интеграция, торговые сигналы, real-time терминал.

Рекомендуемый трек: **Product depth** — Phase 12 → 13 → 14.

## Деплой

Три отдельных проекта на Vercel (monorepo, Root Directory на приложение):

| Проект    | Root Directory   | Output  | Framework        | `vercel.json`                                            |
| --------- | ---------------- | ------- | ---------------- | -------------------------------------------------------- |
| landing   | `apps/landing`   | `.next` | Next.js          | [apps/landing/vercel.json](apps/landing/vercel.json)     |
| dashboard | `apps/dashboard` | `dist`  | Other (Vite SPA) | [apps/dashboard/vercel.json](apps/dashboard/vercel.json) |
| api       | `apps/api`       | —       | см. Phase 11     | [apps/api/vercel.json](apps/api/vercel.json)             |

### Dashboard SPA (fix 404 на прямых URL)

Dashboard — Vite SPA + TanStack Router. Прямой заход на `/market`, `/diary`, `/auth/*/callback` или refresh требует rewrite всех path → `index.html`.

В [apps/dashboard/vercel.json](apps/dashboard/vercel.json):

- `outputDirectory: "dist"`
- `framework: null` — не давать автопресету Vercel перезаписать rewrites
- `rewrites`: `/(.*)` → `/index.html` (кроме `/assets/`\*)

**Checklist в Vercel Dashboard (dashboard-проект):**

1. Root Directory = `apps/dashboard`
2. Framework Preset = **Other** (не Next.js)
3. Build Command и Install Command — из `vercel.json` (monorepo: `cd ../.. && pnpm install`)
4. Env **Production + Preview**: `VITE_APP_URL`, `VITE_API_URL`, `VITE_LANDING_URL`, `VITE_YANDEX_CLIENT_ID`, `VITE_GOOGLE_CLIENT_ID`
5. OAuth redirect URIs в провайдерах: `https://<dashboard-domain>/auth/yandex/callback`, `.../auth/google/callback`

**Локальная проверка prod-build:**

```bash
pnpm --filter dashboard build && pnpm --filter dashboard preview
# http://localhost:4173/market — должен открыться без 404
```

### Env matrix (production)

| App       | Ключевые переменные                                                            |
| --------- | ------------------------------------------------------------------------------ |
| api       | `DATABASE_URL`, `LANDING_URL`, `DASHBOARD_URL`, `JWT_*`, `AI_*`, OAuth secrets |
| landing   | `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_DASHBOARD_URL`, `NEXT_PUBLIC_API_URL`      |
| dashboard | `VITE_APP_URL`, `VITE_API_URL`, `VITE_LANDING_URL`, OAuth client IDs           |

CORS на API: `LANDING_URL` и `DASHBOARD_URL` должны совпадать с реальными origins фронтендов.

## Документация

- [PRODUCT.md](./docs/PRODUCT.md) — бизнес-логика, целевая аудитория, разделы платформы, сценарии
- [AGENTS.md](./AGENTS.md) — правила для AI-агентов и конвенции разработки
- [.agents/rules/](./.agents/rules/) — правила Cursor IDE (frontend / backend)
