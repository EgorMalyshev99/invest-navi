'use client';

import {
  Button,
} from '@repo/ui';

import { getOAuthAuthorizeUrl } from '@/features/auth/lib/start-oauth';
import { useTranslations } from '@/i18n/react-i18n';

type OAuthSocialButtonsProps = {
  from?: string;
};

export function OAuthSocialButtons({ from }: OAuthSocialButtonsProps) {
  const t = useTranslations('auth');

  const startOAuth = (provider: 'yandex' | 'google') => {
    window.location.assign(getOAuthAuthorizeUrl(provider, from));
  };

  return (
    <div className="flex flex-col gap-2">
      <Button type="button" variant="outline" className="w-full" onClick={() => startOAuth('yandex')}>
        {t('yandexLogin')}
      </Button>
      <Button type="button" variant="outline" className="w-full" onClick={() => startOAuth('google')}>
        {t('googleLogin')}
      </Button>
    </div>
  );
}
