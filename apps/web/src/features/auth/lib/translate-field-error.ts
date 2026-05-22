import type { FieldError as RHFFieldError } from 'react-hook-form';

const AUTH_ERROR_KEYS = {
  minPassword: true,
  passwordTooWeak: true,
  passwordConfirmRequired: true,
  passwordMismatch: true,
  passwordRequired: true,
} as const;

type AuthErrorKey = keyof typeof AUTH_ERROR_KEYS;

function isAuthErrorKey(message: string): message is AuthErrorKey {
  return message in AUTH_ERROR_KEYS;
}

export function translateFieldError(
  error: RHFFieldError | undefined,
  t: (key: AuthErrorKey) => string,
): string | undefined {
  const message = error?.message;
  if (!message) {
    return undefined;
  }
  if (isAuthErrorKey(message)) {
    return t(message);
  }
  return message;
}
