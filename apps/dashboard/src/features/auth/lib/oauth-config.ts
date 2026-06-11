import type { OAuthProvider } from '@/features/auth/lib/oauth-providers';

import { getGoogleClientId, getYandexClientId } from '@/shared/config/env';

export function isOAuthProviderConfigured(provider: OAuthProvider): boolean {
  if (provider === 'yandex') return Boolean(getYandexClientId());
  return Boolean(getGoogleClientId());
}

export function getConfiguredOAuthProviders(): OAuthProvider[] {
  const providers: OAuthProvider[] = [];
  if (isOAuthProviderConfigured('yandex')) providers.push('yandex');
  if (isOAuthProviderConfigured('google')) providers.push('google');
  return providers;
}

export function hasAnyOAuthProviderConfigured(): boolean {
  return getConfiguredOAuthProviders().length > 0;
}
