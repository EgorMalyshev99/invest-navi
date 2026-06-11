import { OAUTH_PROVIDER_CONFIG, type OAuthProvider } from '@/features/auth/lib/oauth-providers';
import { storePostAuthFrom } from '@/features/auth/lib/post-auth-from';
import { consumePostAuthRedirect } from '@/features/auth/lib/resolve-post-auth-redirect';
import {
  clearOAuthModeFromStorage,
  getOAuthModeFromStorage,
} from '@/features/auth/lib/start-oauth';
import { refreshAccessTokenViaRest } from '@/shared/auth/auth-session';
import { getAccessToken, setAccessToken } from '@/shared/auth/token-store';
import { getApiBaseUrl, getAppUrl } from '@/shared/config/env';

interface AuthOAuthResultResponse {
  accessToken: string;
  isNewUser: boolean;
}

function clearOAuthSession(config: (typeof OAUTH_PROVIDER_CONFIG)[OAuthProvider]): void {
  window.sessionStorage.removeItem(config.stateCookie);
  window.sessionStorage.removeItem(config.fromCookie);
  clearOAuthModeFromStorage();
}

async function fetchWithAuthRetry(url: string, init: RequestInit): Promise<Response> {
  const token = getAccessToken();
  const headers = new Headers(init.headers);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let response = await fetch(url, {
    ...init,
    headers,
    credentials: 'include',
    cache: 'no-store',
  });

  if (response.status === 401 || response.status === 403) {
    const refreshed = await refreshAccessTokenViaRest();
    if (refreshed) {
      headers.set('Authorization', `Bearer ${refreshed}`);
      response = await fetch(url, {
        ...init,
        headers,
        credentials: 'include',
        cache: 'no-store',
      });
    }
  }

  return response;
}

async function completeOAuthLink(
  provider: OAuthProvider,
  code: string,
  redirectUri: string,
): Promise<boolean> {
  const config = OAUTH_PROVIDER_CONFIG[provider];

  if (!getAccessToken()) {
    return false;
  }

  const response = await fetchWithAuthRetry(
    `${getApiBaseUrl()}/auth/oauth/${config.apiPath}/link`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, redirectUri }),
    },
  );

  return response.ok;
}

export async function handleOAuthCallback(
  searchParams: URLSearchParams,
  provider: OAuthProvider,
): Promise<string> {
  const config = OAUTH_PROVIDER_CONFIG[provider];
  const origin = getAppUrl();
  const mode = getOAuthModeFromStorage();

  const oauthError = searchParams.get('error');
  if (oauthError) {
    clearOAuthSession(config);
    return mode === 'link' ? '/profile?oauth=denied' : '/login?oauth=denied';
  }

  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const savedState = window.sessionStorage.getItem(config.stateCookie);

  if (!code || !state || !savedState || state !== savedState) {
    clearOAuthSession(config);
    return mode === 'link' ? '/profile?oauth=invalid' : '/login?oauth=invalid';
  }

  const redirectUri = `${origin}${config.callbackPath}`;

  if (mode === 'link') {
    try {
      const linked = await completeOAuthLink(provider, code, redirectUri);
      clearOAuthSession(config);
      return linked ? `/profile?linked=${provider}` : '/profile?oauth=failed';
    } catch {
      clearOAuthSession(config);
      return '/profile?oauth=failed';
    }
  }

  let result: AuthOAuthResultResponse;
  try {
    const response = await fetch(`${getApiBaseUrl()}/auth/oauth/${config.apiPath}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ code, redirectUri }),
      cache: 'no-store',
    });

    if (!response.ok) {
      clearOAuthSession(config);
      return '/login?oauth=failed';
    }

    result = (await response.json()) as AuthOAuthResultResponse;
  } catch {
    clearOAuthSession(config);
    return '/login?oauth=failed';
  }

  const from = window.sessionStorage.getItem(config.fromCookie);
  storePostAuthFrom(from ?? undefined);
  clearOAuthSession(config);
  setAccessToken(result.accessToken);

  if (result.isNewUser) {
    return '/onboarding';
  }

  return consumePostAuthRedirect(from ?? undefined);
}
