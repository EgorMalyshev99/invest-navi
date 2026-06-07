export type OAuthProvider = 'yandex' | 'google';

export const OAUTH_PROVIDER_CONFIG: Record<
  OAuthProvider,
  {
    stateCookie: string;
    fromCookie: string;
    callbackPath: string;
    apiPath: string;
  }
> = {
  yandex: {
    stateCookie: 'yandex_oauth_state',
    fromCookie: 'yandex_oauth_from',
    callbackPath: '/auth/yandex/callback',
    apiPath: 'yandex',
  },
  google: {
    stateCookie: 'google_oauth_state',
    fromCookie: 'google_oauth_from',
    callbackPath: '/auth/google/callback',
    apiPath: 'google',
  },
};
