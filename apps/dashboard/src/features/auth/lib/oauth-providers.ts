import { OAUTH_CALLBACK_PATHS } from '@repo/api/auth/oauth-providers';

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
    callbackPath: OAUTH_CALLBACK_PATHS.yandex,
    apiPath: 'yandex',
  },
  google: {
    stateCookie: 'google_oauth_state',
    fromCookie: 'google_oauth_from',
    callbackPath: OAUTH_CALLBACK_PATHS.google,
    apiPath: 'google',
  },
};
