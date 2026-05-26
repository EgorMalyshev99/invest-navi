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

| Слой         | Технологии                                                                                                                                |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Monorepo     | Turborepo, pnpm                                                                                                                           |
| Frontend     | Next.js 16 (App Router), React 19, FSD, TanStack Query/Table, Highcharts, shadcn/ui, Tailwind v4, next-intl (ru/en), Zod, React Hook Form |
| Backend      | NestJS 11, GraphQL (code-first, Apollo), Drizzle ORM, PostgreSQL                                                                          |
| Auth         | OAuth (Yandex ID, VK ID) + email/password, bearer + refresh tokens                                                                        |
| Данные рынка | MOEX ISS API, Tinkoff Invest API                                                                                                          |
| AI           | Adapter pattern: Groq, Google Gemini, OpenRouter                                                                                          |
| Realtime     | socket.io (при необходимости)                                                                                                             |
| Infra        | Vercel (web + api), PostgreSQL на отдельном хостинге                                                                                      |

## Структура монорепозитория

```txt
invest-navi/
├── apps/
│   ├── api/          # NestJS — GraphQL API, auth, рыночные данные, AI
│   └── web/          # Next.js — UI (FSD в src/)
├── packages/
│   ├── api/          # Общие типы/DTO между api и web
│   ├── ui/           # shadcn/ui + Tailwind v4, общие компоненты
│   ├── eslint-config/
│   └── typescript-config/
└── .github/workflows/   # CI (по мере необходимости)
```

### Frontend (FSD)

`apps/web` использует **упрощённый FSD** (4 слоя + `app/`):

- `app/` — маршрутизация Next.js, layouts, metadata, **page composition** из widgets
- `src/widgets/` — крупные блоки UI
- `src/features/` — действия пользователя
- `src/entities/` — бизнес-сущности (asset, diary-entry, …)
- `src/shared/` — UI-kit, API client, i18n, утилиты

Зависимости только **вниз** по слоям. Public API каждого slice — через `index.ts`.

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

# Разработка (API :3000, Web :3001)
pnpm dev
```

Откройте:

- Web: http://localhost:3001
- API: http://localhost:3000

Локальная разработка — только `pnpm dev` (без Docker). База подключается по `DATABASE_URL` из `.env`.

### Отдельные приложения

```bash
pnpm --filter api dev
pnpm --filter web dev
```

### Качество кода

```bash
pnpm lint
pnpm format
pnpm --filter web codegen   # после изменения schema.gql или *.graphql
```

> Тесты (Jest, E2E) пока не подключены — вернём на отдельном этапе.

## Переменные окружения

Создайте `.env.local` в корне и в приложениях по мере появления интеграций (Phase 2+):

| Переменная                          | Описание                                               |
| ----------------------------------- | ------------------------------------------------------ |
| `DATABASE_URL`                      | PostgreSQL (Drizzle)                                   |
| `JWT_SECRET` / `JWT_REFRESH_SECRET` | Auth tokens                                            |
| `YANDEX_CLIENT_ID` / `VK_CLIENT_ID` | OAuth                                                  |
| `MOEX_*` / `TINKOFF_*`              | Рыночные данные                                        |
| `AI_PROVIDER`                       | Активный LLM: `groq`, `gemini`, `openrouter`           |
| `GROQ_API_KEY`                      | [Groq](https://console.groq.com/)                      |
| `GEMINI_API_KEY`                    | [Google AI Studio](https://aistudio.google.com/apikey) |
| `OPENROUTER_API_KEY`                | [OpenRouter](https://openrouter.ai/keys)               |

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

### Phase 5 ✅ — Каталог и карточка актива

- Каталог `/market` — simple/advanced, GraphQL codegen
- Карточка `/market/[symbol]` — образовательные блоки (шаблоны; AI — Phase 6)
- Watchlist `/watchlist` — `@uidotdev/usehooks` + localStorage, статусы, сводка
- next-intl `ru`/`en`, переключатель языка

### Phase 5.5 ✅ — Auth, layouts, onboarding

- Публичные маршруты: Landing `/`, `/login`, `/register` (2 шага: credentials → уровень знаний)
- Защита кабинета: middleware + cookie JWT; без входа — только публичная зона
- Layout: **header** (public) / **sidebar** (app); `ThemeToggle` в обеих зонах
- Профиль `/profile`: `knowledgeLevel`, `preferredLocale` (`updateProfile`)
- i18n: `localePrefix: 'never'` — в URL нет `/ru`/`/en`
- БД: `pnpm --filter api db:migrate` (baseline `users`, `0001` profile + `diary_entries` prep)
- FSD: shadcn в `apps/web/src/shared/ui/`

### Phase 6 (текущая) — Инвестиционный дневник + AI

- Модуль `ai/` с adapter pattern и провайдерами Groq, Gemini, OpenRouter
- Форма гипотез и фиксация решений
- AI-подсказки к гипотезе (риски, критерии валидации)
- Ретроспектива 30/60/90 дней

### Phase 7 — Портфель и облигационный помощник

- Портфель пользователя (ручной ввод на первом этапе)
- Оценка структуры и концентрации рисков
- Раздел облигаций: купон, дюрация, риск эмитента
- Еженедельный обзор рынка

### Phase 8 — Обучающий слой и риск-навигация

- «Картина рынка» как основной обучающий entrypoint
- База знаний — структурированные материалы по инструментам, терминам и рискам
- Отдельный раздел рисков с примерами
- Контекстные подсказки по терминам прямо в UI

### Phase 9 — OAuth (после получения токенов)

- Финальное подключение Yandex ID и VK ID
- Связывание OAuth-аккаунтов с существующим пользователем
- Полировка UX входа и регистрации

## Документация

- [PRODUCT.md](./PRODUCT.md) — бизнес-логика, целевая аудитория, разделы платформы, сценарии
- [AGENTS.md](./AGENTS.md) — правила для AI-агентов и конвенции разработки
- [.cursor/rules/](./.cursor/rules/) — правила Cursor IDE (frontend / backend)

## Лицензия

UNLICENSED — private project.
