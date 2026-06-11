'use client';

import { Spinner } from '@repo/ui';

import { useTranslations } from '@/i18n/react-i18n';

export function OAuthCallbackLoading() {
  const t = useTranslations('auth');

  return (
    <div className="text-muted-foreground flex items-center gap-3 p-6 text-sm">
      <Spinner className="size-4" />
      <span>{t('oauthCallbackLoading')}</span>
    </div>
  );
}
