export const OAUTH_CALLBACK_PATHS = {
  yandex: '/auth/yandex/callback',
  google: '/auth/google/callback',
} as const;

export type OAuthProviderId = keyof typeof OAUTH_CALLBACK_PATHS;
