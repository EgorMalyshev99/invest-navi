# Deploy on Vercel (`vercel` branch)

This branch targets **Vercel** for both `apps/web` and `apps/api`. Use **`main`** later for Railway (long-running Nest `listen`).

## Vercel projects (two)

| Project         | Root Directory | Production branch |
| --------------- | -------------- | ----------------- |
| invest-navi-web | `apps/web`     | `vercel`          |
| invest-navi-api | `apps/api`     | `vercel`          |

`vercel.json` in each app sets monorepo `installCommand` / `buildCommand` from repo root.

## API (`apps/api`)

- Entry: `src/main.ts` (Vercel zero-config NestJS; must import `@nestjs/core`). Do not add a separate `api/` handler.
- `vercel.json` only runs `@repo/api` build; Nest compile is handled by Vercel.
- Local dev: `pnpm --filter api dev` (same `main.ts`).
- Local dev: `pnpm --filter api dev` (still uses `main.ts` + port 3000).
- GraphQL: `/graphql` (Apollo default).
- Set env vars in Vercel (same as `.env.example`): `DATABASE_URL`, JWT, `CORS_ORIGIN`, market/AI keys.
- `CORS_ORIGIN` must match the web URL, e.g. `https://invest-navi-web.vercel.app`.

## Web (`apps/web`)

- `NEXT_PUBLIC_GRAPHQL_URL=https://<your-api-host>/graphql`
- Other env per `apps/web/.env.example`.

## Railway later (`main`)

Keep `main` without serverless entry; deploy API with `node dist/main` and `PORT` from the platform.
