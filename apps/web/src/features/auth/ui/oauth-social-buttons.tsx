'use client';

import { useTranslations } from 'next-intl';

import { Button } from '@/shared/ui/button';

type OAuthSocialButtonsProps = {
  from?: string;
};

export function OAuthSocialButtons({ from }: OAuthSocialButtonsProps) {
  const t = useTranslations('auth');
  const fromQuery = from ? `?from=${encodeURIComponent(from)}` : '';

  return (
    <div className="flex flex-col gap-2">
      <Button type="button" variant="outline" className="w-full" asChild>
        <a href={`/auth/yandex${fromQuery}`}>{t('yandexLogin')}</a>
      </Button>
      <Button type="button" variant="outline" className="w-full" asChild>
        <a href={`/auth/google${fromQuery}`}>{t('googleLogin')}</a>
      </Button>
    </div>
  );
}
