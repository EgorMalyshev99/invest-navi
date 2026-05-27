import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from '@/shared/lib/auth-cookies';

const ACCESS_MAX_AGE_SECONDS = 60 * 15;
const REFRESH_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

interface CookieStore {
  set: (
    name: string,
    value: string,
    options: {
      httpOnly?: boolean;
      secure?: boolean;
      sameSite?: 'lax' | 'strict' | 'none';
      maxAge?: number;
      path?: string;
    },
  ) => void;
}

export function setAuthTokensOnCookies(
  cookieStore: CookieStore,
  accessToken: string,
  refreshToken: string,
  secure: boolean,
): void {
  const base = {
    httpOnly: false,
    sameSite: 'lax' as const,
    path: '/',
    secure,
  };

  cookieStore.set(ACCESS_TOKEN_COOKIE, accessToken, {
    ...base,
    maxAge: ACCESS_MAX_AGE_SECONDS,
  });
  cookieStore.set(REFRESH_TOKEN_COOKIE, refreshToken, {
    ...base,
    maxAge: REFRESH_MAX_AGE_SECONDS,
  });
}
