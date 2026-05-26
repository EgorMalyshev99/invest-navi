'use client';

import { RouteErrorFallback } from '@/shared/ui/route-error-fallback';

interface LocaleErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function LocaleError({ error, reset }: LocaleErrorProps) {
  return <RouteErrorFallback error={error} reset={reset} />;
}
