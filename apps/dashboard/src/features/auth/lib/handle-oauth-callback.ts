import { OAUTH_PROVIDER_CONFIG, type OAuthProvider } from '@/features/auth/lib/oauth-providers';
import { setTokens } from '@/shared/auth/token-store';
import { getApiBaseUrl, getAppUrl } from '@/shared/config/env';

interface AuthTokensResponse {
  accessToken: string;
  refreshToken: string;
}

export async function handleOAuthCallback(
  searchParams: URLSearchParams,
  provider: OAuthProvider,
): Promise<string> {
  const config = OAUTH_PROVIDER_CONFIG[provider];
  const origin = getAppUrl();

  const oauthError = searchParams.get('error');
  if (oauthError) {
    return '/login?oauth=denied';
  }

  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const savedState = window.sessionStorage.getItem(config.stateCookie);

  if (!code || !state || !savedState || state !== savedState) {
    return '/login?oauth=invalid';
  }

  const redirectUri = `${origin}${config.callbackPath}`;
  const apiBaseUrl = getApiBaseUrl();

  let tokens: AuthTokensResponse;
  try {
    const response = await fetch(`${apiBaseUrl}/auth/oauth/${config.apiPath}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, redirectUri }),
      cache: 'no-store',
    });

    if (!response.ok) {
      return '/login?oauth=failed';
    }

    tokens = (await response.json()) as AuthTokensResponse;
  } catch {
    return '/login?oauth=failed';
  }

  const from = window.sessionStorage.getItem(config.fromCookie);
  const destination = from?.startsWith('/') && !from.startsWith('//') ? from : '/overview';

  window.sessionStorage.removeItem(config.stateCookie);
  window.sessionStorage.removeItem(config.fromCookie);
  setTokens(tokens);

  return destination;
}
