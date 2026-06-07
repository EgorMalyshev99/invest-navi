# Deploy on Vercel (`vercel` branch)

This branch targets **Vercel** for `apps/landing`, `apps/dashboard`, and `apps/api`. Use **`main`** later for Railway (long-running Nest `listen`).

## Vercel projects (three)

| Project               | Root Directory   | Production branch |
| --------------------- | ---------------- | ----------------- |
| invest-navi-landing   | `apps/landing`   | `vercel`          |
| invest-navi-dashboard | `apps/dashboard` | `vercel`          |
| invest-navi-api       | `apps/api`       | `vercel`          |

`vercel.json` in each app sets monorepo `installCommand` / `buildCommand` from repo root.

## API (`apps/api`)

- Entry: `src/main.ts` (Vercel zero-config NestJS; must import `@nestjs/core`). Do not add a separate `api/` handler.
- `vercel.json` only runs `@repo/api` build; Nest compile is handled by Vercel.
- Local dev: `pnpm --filter api dev` (same `main.ts`, port 3000).
- GraphQL: `/graphql` (Apollo default).
- Set env vars in Vercel (same as `.env.example`): `DATABASE_URL`, JWT, `LANDING_URL`, `DASHBOARD_URL`, market/AI keys.
- `LANDING_URL` / `DASHBOARD_URL` must match deployed frontend URLs (CORS + OAuth redirects).

## Landing (`apps/landing`)

- Next.js marketing site, port 3001 locally.
- Env per `apps/landing/.env.example`: `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_DASHBOARD_URL`, `NEXT_PUBLIC_API_URL`.

## Dashboard (`apps/dashboard`)

- Vite SPA (TanStack Router), port 3002 locally.
- `vercel.json` includes SPA rewrite to `index.html`.
- Env per `apps/dashboard/.env.example`: `VITE_APP_URL`, `VITE_API_URL`, OAuth client IDs.

## Railway later (`main`)

Keep `main` without serverless entry; deploy API with `node dist/main` and `PORT` from the platform.
