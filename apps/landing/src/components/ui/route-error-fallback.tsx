'use client';

import { RouteErrorFallbackContent } from '@repo/ui/components/route-error-fallback-content';
import { useTranslations } from 'next-intl';

interface RouteErrorFallbackProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export function RouteErrorFallback({ reset }: RouteErrorFallbackProps) {
  const t = useTranslations('errors');

  return (
    <RouteErrorFallbackContent
      title={t('errorTitle')}
      description={t('errorDescription')}
      retryLabel={t('retry')}
      onRetry={() => reset()}
    />
  );
}
