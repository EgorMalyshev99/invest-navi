# @repo/ui

Shared shadcn/ui primitives, typography, Tailwind v4 tokens, and small UI helpers for
`apps/landing` and `apps/dashboard`.

Monorepo shadcn setup: `components.json` here + in each app (`apps/landing`, `apps/dashboard`).
Add components from an app directory — CLI installs primitives here and blocks in the app.

```bash
cd apps/landing   # or apps/dashboard
pnpm dlx shadcn@latest add button
```

```tsx
import { Button, cn } from '@repo/ui';
import { Button as ButtonPrimitive } from '@repo/ui/components/button';
import '@repo/ui/globals.css';
```
