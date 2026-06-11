type AuthTranslate = (key: string) => string;

const OAUTH_ERROR_KEYS = {
  denied: 'oauthErrorDenied',
  invalid: 'oauthErrorInvalid',
  failed: 'oauthErrorFailed',
} as const;

export function resolveOAuthErrorMessage(
  oauthParam: string | null | undefined,
  t: AuthTranslate,
): string | null {
  if (!oauthParam) return null;

  const key = OAUTH_ERROR_KEYS[oauthParam as keyof typeof OAUTH_ERROR_KEYS];
  if (key) return t(key);

  return t('oauthError');
}
