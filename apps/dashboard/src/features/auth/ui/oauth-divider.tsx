'use client';

import { useTranslations } from '@/i18n/react-i18n';

export function OAuthDivider() {
  const t = useTranslations('auth');

  return (
    <div className="relative flex items-center gap-3 py-1">
      <span className="bg-border h-px flex-1" aria-hidden />
      <span className="text-muted-foreground text-xs tracking-wide uppercase">
        {t('oauthDivider')}
      </span>
      <span className="bg-border h-px flex-1" aria-hidden />
    </div>
  );
}
