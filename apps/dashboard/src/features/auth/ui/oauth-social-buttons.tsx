'use client';

import { Button } from '@repo/ui';

import type { OAuthProvider } from '@/features/auth/lib/oauth-providers';
import type { OAuthMode } from '@/features/auth/lib/start-oauth';

import {
  getConfiguredOAuthProviders,
  hasAnyOAuthProviderConfigured,
} from '@/features/auth/lib/oauth-config';
import { getOAuthAuthorizeUrl } from '@/features/auth/lib/start-oauth';
import { OAuthDivider } from '@/features/auth/ui/oauth-divider';
import { useTranslations } from '@/i18n/react-i18n';

type OAuthSocialButtonsProps = {
  from?: string;
  mode?: OAuthMode;
  providers?: OAuthProvider[];
};

export function OAuthSocialButtons({
  from,
  mode = 'login',
  providers: providersFilter,
}: OAuthSocialButtonsProps) {
  const t = useTranslations('auth');
  const providers = (providersFilter ?? getConfiguredOAuthProviders()).filter((provider) =>
    getConfiguredOAuthProviders().includes(provider),
  );

  if (providers.length === 0) {
    return null;
  }

  const startOAuth = (provider: (typeof providers)[number]) => {
    window.location.assign(getOAuthAuthorizeUrl(provider, { from, mode }));
  };

  const labelKeys =
    mode === 'link'
      ? { yandex: 'linkYandex' as const, google: 'linkGoogle' as const }
      : { yandex: 'yandexLogin' as const, google: 'googleLogin' as const };

  return (
    <>
      <div className="flex flex-col gap-2">
        {providers.includes('yandex') ? (
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => startOAuth('yandex')}
          >
            {t(labelKeys.yandex)}
          </Button>
        ) : null}
        {providers.includes('google') ? (
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => startOAuth('google')}
          >
            {t(labelKeys.google)}
          </Button>
        ) : null}
      </div>
      {mode === 'login' && hasAnyOAuthProviderConfigured() ? <OAuthDivider /> : null}
    </>
  );
}
