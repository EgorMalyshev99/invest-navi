import { clearAccessToken, getAccessToken, setAccessToken } from '@/shared/auth/token-store';
import { getApiBaseUrl } from '@/shared/config/env';

let refreshPromise: Promise<string | undefined> | null = null;

export async function refreshAccessTokenViaRest(): Promise<string | undefined> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const response = await fetch(`${getApiBaseUrl()}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
        cache: 'no-store',
      });

      if (!response.ok) {
        clearAccessToken({ expired: true });
        return undefined;
      }

      const payload = (await response.json()) as { accessToken?: string };
      if (!payload.accessToken) {
        clearAccessToken({ expired: true });
        return undefined;
      }

      setAccessToken(payload.accessToken);
      return payload.accessToken;
    } catch {
      clearAccessToken({ expired: true });
      return undefined;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export async function logoutViaRest(): Promise<void> {
  const token = getAccessToken();

  try {
    await fetch(`${getApiBaseUrl()}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      cache: 'no-store',
    });
  } finally {
    clearAccessToken();
  }
}
