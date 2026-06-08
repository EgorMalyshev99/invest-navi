'use client';

import { WarningCircleIcon } from '@phosphor-icons/react';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
} from '@repo/ui';
import { useTranslations } from 'next-intl';

interface RouteErrorFallbackProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export function RouteErrorFallback({ reset }: RouteErrorFallbackProps) {
  const t = useTranslations('errors');

  return (
    <div className="container flex min-h-[40vh] flex-col items-center justify-center py-12">
      <Alert variant="destructive" className="max-w-md">
        <WarningCircleIcon className="size-5" aria-hidden />
        <AlertTitle>{t('errorTitle')}</AlertTitle>
        <AlertDescription>{t('errorDescription')}</AlertDescription>
      </Alert>
      <Button type="button" className="mt-6" onClick={() => reset()}>
        {t('retry')}
      </Button>
    </div>
  );
}
